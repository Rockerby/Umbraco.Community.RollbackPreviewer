import { UMB_AUTH_CONTEXT as c } from "@umbraco-cms/backoffice/auth";
import { c as t } from "./services.gen-BWwEisCT.js";
const g = (e, s) => {
  console.log("Hello from my extension 🎉"), e.consumeContext(c, async (i) => {
    const o = i.getOpenApiConfiguration();
    t.setConfig({
      baseUrl: o.base,
      credentials: o.credentials
    }), t.interceptors.request.use(async (n, a) => {
      const r = await o.token();
      return n.headers.set("Authorization", `Bearer ${r}`), n;
    });
  });
}, f = (e, s) => {
  console.log("Goodbye from my extension 👋");
};
export {
  g as onInit,
  f as onUnload
};
//# sourceMappingURL=entrypoint-BeuuXQCY.js.map
