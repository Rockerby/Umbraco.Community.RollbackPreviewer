import { LitElement as g, html as f, css as w, state as c, customElement as x } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as C } from "@umbraco-cms/backoffice/element-api";
import { Y as d } from "./services.gen-BWwEisCT.js";
import { UMB_NOTIFICATION_CONTEXT as U } from "@umbraco-cms/backoffice/notification";
import { UMB_CURRENT_USER_CONTEXT as W } from "@umbraco-cms/backoffice/current-user";
var T = Object.defineProperty, E = Object.getOwnPropertyDescriptor, y = (t) => {
  throw TypeError(t);
}, l = (t, e, r, a) => {
  for (var i = a > 1 ? void 0 : a ? E(e, r) : e, s = t.length - 1, m; s >= 0; s--)
    (m = t[s]) && (i = (a ? m(e, r, i) : m(i)) || i);
  return a && i && T(e, r, i), i;
}, b = (t, e, r) => e.has(t) || y("Cannot " + r), n = (t, e, r) => (b(t, e, "read from private field"), r ? r.call(t) : e.get(t)), h = (t, e, r) => e.has(t) ? y("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), N = (t, e, r, a) => (b(t, e, "write to private field"), e.set(t, r), r), u, p, _, v;
let o = class extends C(g) {
  constructor() {
    super(), this._yourName = "Press the button!", this._serverUserData = void 0, this._contextCurrentUser = void 0, h(this, u), h(this, p, async (t) => {
      var i, s;
      const e = t.target;
      e.state = "waiting";
      const { data: r, error: a } = await d.whoAmI();
      if (a) {
        e.state = "failed", console.error(a);
        return;
      }
      r !== void 0 && (this._serverUserData = r, e.state = "success"), n(this, u) && n(this, u).peek("warning", {
        data: {
          headline: `You are ${(i = this._serverUserData) == null ? void 0 : i.name}`,
          message: `Your email is ${(s = this._serverUserData) == null ? void 0 : s.email}`
        }
      });
    }), h(this, _, async (t) => {
      const e = t.target;
      e.state = "waiting";
      const { data: r, error: a } = await d.whatsTheTimeMrWolf();
      if (a) {
        e.state = "failed", console.error(a);
        return;
      }
      r !== void 0 && (this._timeFromMrWolf = new Date(r), e.state = "success");
    }), h(this, v, async (t) => {
      const e = t.target;
      e.state = "waiting";
      const { data: r, error: a } = await d.whatsMyName();
      if (a) {
        e.state = "failed", console.error(a);
        return;
      }
      this._yourName = r, e.state = "success";
    }), this.consumeContext(U, (t) => {
      N(this, u, t);
    }), this.consumeContext(W, (t) => {
      this.observe(t.currentUser, (e) => {
        this._contextCurrentUser = e;
      });
    });
  }
  render() {
    var t, e, r;
    return f`
        <uui-box headline="Who am I?">
            <div slot="header">[Server]</div>
            <h2><uui-icon name="icon-user"></uui-icon>${(t = this._serverUserData) != null && t.email ? this._serverUserData.email : "Press the button!"}</h2>
            <ul>
                ${(e = this._serverUserData) == null ? void 0 : e.groups.map((a) => f`<li>${a.name}</li>`)}
            </ul>
            <uui-button color="default" look="primary" @click="${n(this, p)}">
                Who am I?
            </uui-button>
            <p>This endpoint gets your current user from the server and displays your email and list of user groups.
            It also displays a Notification with your details.</p>
        </uui-box>

        <uui-box headline="What's my Name?">
            <div slot="header">[Server]</div>
            <h2><uui-icon name="icon-user"></uui-icon> ${this._yourName}</h2>
            <uui-button color="default" look="primary" @click="${n(this, v)}">
                Whats my name?
            </uui-button>
            <p>This endpoint has a forced delay to show the button 'waiting' state for a few seconds before completing the request.</p>
        </uui-box>

        <uui-box headline="What's the Time?">
            <div slot="header">[Server]</div>
            <h2><uui-icon name="icon-alarm-clock"></uui-icon> ${this._timeFromMrWolf ? this._timeFromMrWolf.toLocaleString() : "Press the button!"}</h2>
            <uui-button color="default" look="primary" @click="${n(this, _)}">
                Whats the time Mr Wolf?
            </uui-button>
            <p>This endpoint gets the current date and time from the server.</p>
        </uui-box>

        <uui-box headline="Who am I?" class="wide">
          <div slot="header">[Context]</div>
          <p>Current user email: <b>${(r = this._contextCurrentUser) == null ? void 0 : r.email}</b></p>
          <p>This is the JSON object available by consuming the 'UMB_CURRENT_USER_CONTEXT' context:</p>
          <umb-code-block language="json" copy>${JSON.stringify(this._contextCurrentUser, null, 2)}</umb-code-block>
        </uui-box>
    `;
  }
};
u = /* @__PURE__ */ new WeakMap();
p = /* @__PURE__ */ new WeakMap();
_ = /* @__PURE__ */ new WeakMap();
v = /* @__PURE__ */ new WeakMap();
o.styles = [
  w`
            :host {
                display: grid;
                gap: var(--uui-size-layout-1);
                padding: var(--uui-size-layout-1);
                grid-template-columns: 1fr 1fr 1fr;
            }

            uui-box {
                margin-bottom: var(--uui-size-layout-1);
            }

            h2 {
                margin-top:0;
            }

            .wide {
                grid-column: span 3;
            }
    `
];
l([
  c()
], o.prototype, "_yourName", 2);
l([
  c()
], o.prototype, "_timeFromMrWolf", 2);
l([
  c()
], o.prototype, "_serverUserData", 2);
l([
  c()
], o.prototype, "_contextCurrentUser", 2);
o = l([
  x("example-dashboard")
], o);
const S = o;
export {
  o as ExampleDashboardElement,
  S as default
};
//# sourceMappingURL=dashboard.element-6t6sxcIe.js.map
