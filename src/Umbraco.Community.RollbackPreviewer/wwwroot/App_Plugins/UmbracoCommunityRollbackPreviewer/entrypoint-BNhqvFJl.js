import { UMB_AUTH_CONTEXT as i } from "@umbraco-cms/backoffice/auth";
import { c as r } from "./client.gen-CSWNPGiu.js";
const m = (s, n) => {
  console.log("Hello from my extension 🎉"), s.consumeContext(i, async (e) => {
    const o = e == null ? void 0 : e.getOpenApiConfiguration();
    r.setConfig({
      auth: (o == null ? void 0 : o.token) ?? void 0,
      baseUrl: (o == null ? void 0 : o.base) ?? "",
      credentials: (o == null ? void 0 : o.credentials) ?? "same-origin"
    });
  });
}, a = (s, n) => {
  console.log("Goodbye from my extension 👋");
};
export {
  m as onInit,
  a as onUnload
};
//# sourceMappingURL=entrypoint-BNhqvFJl.js.map
