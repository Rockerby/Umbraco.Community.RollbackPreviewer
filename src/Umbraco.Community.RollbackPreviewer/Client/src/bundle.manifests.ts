import { manifests as rpRollback } from './rollback-previewer/manifest';
import { manifests as entrypoints } from "./entrypoints/manifest.js";
import { manifests as saveAndShare } from "./save-and-share/manifest.js";
import { manifests as entityActions } from "./entity-actions/manifest.js";

// Job of the bundle is to collate all the manifests from different parts of the extension and load other manifests
// We load this bundle from umbraco-package.json
export const manifests: Array<UmbExtensionManifest> = [
  ...rpRollback,
  ...entrypoints,
  ...saveAndShare,
  ...entityActions
];
