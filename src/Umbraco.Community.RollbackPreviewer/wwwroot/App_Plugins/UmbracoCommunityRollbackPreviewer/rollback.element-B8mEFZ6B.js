import { html as s, customElement as d } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement as p } from "@umbraco-cms/backoffice/modal";
var c = Object.getOwnPropertyDescriptor, b = (t, a, n, o) => {
  for (var e = o > 1 ? void 0 : o ? c(a, n) : a, l = t.length - 1, m; l >= 0; l--)
    (m = t[l]) && (e = m(e) || e);
  return e;
};
let r = class extends p {
  render() {
    return s`
        <div>
            <h1>Default headline</h1>
        </div>
    `;
  }
};
r = b([
  d("pr-rollback-modal")
], r);
const u = r;
export {
  r as RbpRollbackModalElement,
  u as default
};
//# sourceMappingURL=rollback.element-B8mEFZ6B.js.map
