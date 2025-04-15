import { umbExtensionsRegistry as e } from "@umbraco-cms/backoffice/extension-registry";
e.unregister("Umb.Modal.Rollback");
const o = [
  {
    name: "Rollback Previewer",
    alias: "Umb.Modal.Rollback",
    type: "modal",
    element: () => import("./rp-rollback-modal.element-X-P-4GTc.js")
  }
], a = [
  ...o
];
export {
  a as manifests
};
//# sourceMappingURL=rollback-previewer.js.map
