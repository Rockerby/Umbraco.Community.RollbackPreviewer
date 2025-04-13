import { umbExtensionsRegistry as a } from "@umbraco-cms/backoffice/extension-registry";
const o = [
  {
    name: "Your Package Name Entrypoint",
    alias: "YourPackageName.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-BeuuXQCY.js")
  }
], e = [
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
    element: () => import("./rollback.element-BFiYJxuL.js")
  }
], s = "Umb.Repository.Rollback", i = [
  {
    type: "repository",
    alias: s,
    name: "Rollback Repository",
    api: () => import("./rollback.repository-BeMPFVxp.js")
  }
], m = [
  ...o,
  ...e,
  ...t,
  ...i
];
export {
  m as manifests
};
//# sourceMappingURL=your-package-name.js.map
