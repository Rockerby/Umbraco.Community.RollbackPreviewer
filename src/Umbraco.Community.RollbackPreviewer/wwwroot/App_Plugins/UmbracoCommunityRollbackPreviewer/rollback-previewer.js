import { umbExtensionsRegistry as e } from "@umbraco-cms/backoffice/extension-registry";
e.unregister("Umb.Modal.Rollback");
const a = [
  {
    name: "Rollback Previewer",
    alias: "Umb.Modal.Rollback",
    type: "modal",
    element: () => import("./rollback-previewer-modal.element-CfDIpbl5.js")
  }
], t = [
  {
    name: "Your Package Name Entrypoint",
    alias: "YourPackageName.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-BNhqvFJl.js")
  }
], n = [
  ...a,
  ...t
];
export {
  n as manifests
};
//# sourceMappingURL=rollback-previewer.js.map
