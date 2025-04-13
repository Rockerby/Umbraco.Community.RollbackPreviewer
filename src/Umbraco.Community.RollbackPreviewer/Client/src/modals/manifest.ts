import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
umbExtensionsRegistry.unregister('Umb.Modal.Rollback');
export const manifests: any = [
  {
    name: "Rollback Previewer",
    alias: "Umb.Modal.Rollback",
    type: 'modal',
    element: () => import("./rollback.element")
  }
];
