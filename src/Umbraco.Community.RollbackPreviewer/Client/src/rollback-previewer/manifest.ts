import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';

// This will remove the default rollback modal from the registry
umbExtensionsRegistry.unregister('Umb.Modal.Rollback');

export const manifests: any = [
  {
    name: "Rollback Previewer",
    alias: "Umb.Modal.Rollback",
    type: 'modal',
    element: () => import("./rollback-previewer-modal.element")
  },
];
