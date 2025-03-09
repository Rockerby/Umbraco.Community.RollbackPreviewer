const a = [
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
], o = [
  ...a,
  ...e
];
export {
  o as manifests
};
//# sourceMappingURL=your-package-name.js.map
