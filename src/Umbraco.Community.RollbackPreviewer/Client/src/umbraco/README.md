# Umbraco specific files

This folder contains code directly copied from the Umbraco source code that is not currently exported through the official Umbraco UI libraries.

The purpose of this approach is to make it possible to extend functionality of Umbraco UI components while we wait for them to become officially available through the public API.

## Example: Rollback Web Component

This folder contains the default `rollback` Web Component from Umbraco core. Our package extends this component to enhance its functionality while maintaining compatibility. When Umbraco updates the original component in their source code, we can simply copy the new version into this folder, and our custom implementation should continue to function properly.

> **Note:** This approach is potentially temporary and will be revisited if these components become officially supported through Umbraco's public API. 

## Components

- `rollback` - The default rollback Web Component from Umbraco core. The source code for this can be found in the [Umbraco GitHub Repository](https://github.com/umbraco/Umbraco-CMS/tree/contrib/src/Umbraco.Web.UI.Client/src/packages/documents/documents/rollback).
