import { umbExtensionsRegistry as e } from "@umbraco-cms/backoffice/extension-registry";
e.unregister("Umb.Modal.Rollback");
const o = [
  {
    name: "Rollback Previewer",
    alias: "Umb.Modal.Rollback",
    type: "modal",
    element: () => import("./rollback-previewer-modal.element-J8aaGtSp.js")
  }
], a = [
  ...o
];
export {
  a as manifests
};
//# sourceMappingURL=rollback-previewer.js.map
