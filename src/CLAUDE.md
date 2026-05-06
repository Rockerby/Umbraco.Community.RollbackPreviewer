# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

An Umbraco community package (NuGet) that replaces Umbraco's built-in rollback modal with an enhanced version that shows side-by-side visual previews and JSON diffs of content versions.

## Solution Structure

```
src/
├── Umbraco.Community.RollbackPreviewer/          # The NuGet package (net10.0)
│   ├── Client/                                   # TypeScript frontend (Vite + LitElement)
│   └── ...                                       # C# backend
├── Umbraco.Community.RollbackPreviewer.TestSite.v17/  # Umbraco 17 test site
├── Umbraco.Community.RollbackPreviewer.TestSite.v16/  # Umbraco 16 test site
└── Umbraco.Community.RollbackPreviewer.TestSite.v13/  # Umbraco 13 test site
```

## Build Commands

### Frontend (run from `Umbraco.Community.RollbackPreviewer/Client/`)
```bash
npm install           # Install dependencies
npm run build         # Compile TypeScript + Vite bundle → ../wwwroot/App_Plugins/UmbracoCommunityRollbackPreviewer/
npm run dev           # Watch mode
npm run generate-client  # Regenerate TypeScript API client from OpenAPI spec (requires Umbraco running at https://localhost:44365)
```

### Backend
```bash
dotnet build          # Build from solution root
dotnet run --project Umbraco.Community.RollbackPreviewer.TestSite.v17  # Run v17 test site
```

The frontend must be built before the test site will display the custom modal — the `.js` bundle is served as a static file from `App_Plugins/`.

## Architecture

### How the Extension Plugs Into Umbraco

The extension registers via `Client/public/umbraco-package.json` which loads `bundle.manifests.ts`. On load, the manifest code **unregisters** the built-in `Umb.Modal.Rollback` and re-registers it with the custom implementation (`rp-rollback-modal`). This means the hook point is in `Client/src/rollback-previewer/manifest.ts`.

### Frontend Components

- `rollback-previewer-modal.element.ts` — Main LitElement modal. Extends `UmbRollbackModalElement` (from Umbraco core, copied into `src/umbraco/`). Adds side-by-side iframe view, JSON diff toggle, scroll sync, and shareable URL copying.
- `rollback-previewer-iframe.element.ts` — `<rp-iframe>` element. Wraps an iframe with CSS `transform: scale()` to simulate device dimensions. Used for the two-panel preview.
- `rollback-previewer-config.service.ts` — Calls the backend `/configuration` endpoint to get sharing/auth config.
- `src/api/` — Auto-generated TypeScript client (do not hand-edit; regenerate with `npm run generate-client`).
- `src/umbraco/` — Copies of Umbraco core components not in the public API. When Umbraco updates these, copy the new source from the [Umbraco GitHub repo](https://github.com/umbraco/Umbraco-CMS/tree/contrib/src/Umbraco.Web.UI.Client/src/packages/documents/documents/rollback) into this folder.

### Backend Components

- `Composers/UmbracoCommunityRollbackPreviewerApiComposer.cs` — Registers all services and the custom Swagger document (`umbracocommunityrollbackpreviewer`). This is the DI composition root.
- `Services/RollBackContentFinder.cs` — Custom `IContentFinder` that handles requests to `/ucrbp?cid={id}&vid={versionId}`. Fetches the specified content version, converts it to `IPublishedContent`, and injects it into the request pipeline for rendering. Inserts itself *before* the standard content finder.
- `Extensions/PublishedContentExtensions.cs` — `PublishedContentWrapper` converts `IContent` (editable model) to `IPublishedContent` (renderable model) so historical versions render correctly through the front end.
- `Services/TimeLimitedSecretService.cs` — Generates cryptographically random tokens stored in `IMemoryCache` with TTL for time-limited shareable preview URLs.
- `Controllers/RollbackPreviewerConfigurationController.cs` — Backoffice API (versioned, swagger-documented). Returns auth/sharing config to the frontend.

### Preview URL Flow

The `/ucrbp` route is handled entirely by `RollbackContentFinder`. It:
1. Reads `cid` (content GUID) and `vid` (version GUID) from query string
2. Checks authorisation: backoffice cookie **or** frontend secret (static or time-limited)
3. Fetches the historical `IContent` version, copies its property values onto the current content node, converts to `IPublishedContent`, and sets `X-Robots-Tag: noindex, nofollow`

### Multi-Version Support

The C# code uses `#if NET9_0_OR_GREATER` preprocessor directives throughout to handle API differences between Umbraco 13 (net8.0) and Umbraco 15/17 (net9.0/net10.0). The current `.csproj` targets `net10.0` only. The `Client/v13/` folder contains a legacy AngularJS implementation for Umbraco v13.

## Configuration (`appsettings.json`)

```json
"RollbackPreviewer": {
  "EnableFrontendPreviewAuthorisation": false,
  "FrontendPreviewAuthorisationSecret": null,
  "EnableTimeLimitedSecrets": false,
  "SecretExpirationMinutes": 60
}
```

When `EnableFrontendPreviewAuthorisation` is false, the `/ucrbp` preview route only works for logged-in backoffice users. When enabled, unauthenticated users can access it (optionally gated by a secret in the query string).
