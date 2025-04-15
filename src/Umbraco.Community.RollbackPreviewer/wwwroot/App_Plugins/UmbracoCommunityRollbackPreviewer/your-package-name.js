import { umbExtensionsRegistry as a } from "@umbraco-cms/backoffice/extension-registry";
const e = [
  {
    name: "Your Package Name Entrypoint",
    alias: "YourPackageName.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-BeuuXQCY.js")
  }
], o = [
  {
    name: "Your Package Name Dashboard",
    alias: "YourPackageName.Dashboard",
    type: "dashboard",
    js: () => import("./dashboard.element-6t6sxcIe.js"),
    meta: {
      label: "Example Dashboard",
      pathname: "example-dashboard"
    },
    conditions: [
      {
        alias: "Umb.Condition.SectionAlias",
        match: "Umb.Section.Content"
      }
    ]
  }
];
a.unregister("Umb.Modal.Rollback");
const t = [
  {
    name: "Rollback Previewer",
    alias: "Umb.Modal.Rollback",
    type: "modal",
    element: () => import("./rp-rollback-modal.element-X-P-4GTc.js")
  }
], s = [
  ...e,
  ...o,
  ...t
];
export {
  s as manifests
};
//# sourceMappingURL=your-package-name.js.map
