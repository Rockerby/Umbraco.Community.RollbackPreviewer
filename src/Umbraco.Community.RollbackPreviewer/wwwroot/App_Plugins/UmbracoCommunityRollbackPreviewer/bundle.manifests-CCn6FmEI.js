var R = (r) => {
  throw TypeError(r);
};
var te = (r, e, t) => e.has(r) || R("Cannot " + t);
var v = (r, e, t) => e.has(r) ? R("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t);
var B = (r, e, t) => (te(r, e, "access private method"), t);
import { umbExtensionsRegistry as I, UmbConditionBase as re } from "@umbraco-cms/backoffice/extension-registry";
import { UMB_ENTITY_WORKSPACE_CONTEXT as ae } from "@umbraco-cms/backoffice/workspace";
import { UMB_USER_PERMISSION_DOCUMENT_ROLLBACK as _, UMB_DOCUMENT_ENTITY_TYPE as W } from "@umbraco-cms/backoffice/document";
import { UMB_ENTITY_IS_NOT_TRASHED_CONDITION_ALIAS as H } from "@umbraco-cms/backoffice/recycle-bin";
I.unregister("Umb.Modal.Rollback");
const ne = [
  {
    name: "Rollback Previewer",
    alias: "Umb.Modal.Rollback",
    type: "modal",
    element: () => import("./rollback-previewer-modal.element-CbGVxFFs.js")
  }
], se = [
  {
    name: "Your Package Name Entrypoint",
    alias: "YourPackageName.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-W3d-85KL.js")
  }
], ie = {
  bodySerializer: (r) => JSON.stringify(
    r,
    (e, t) => typeof t == "bigint" ? t.toString() : t
  )
}, oe = ({
  onRequest: r,
  onSseError: e,
  onSseEvent: t,
  responseTransformer: a,
  responseValidator: s,
  sseDefaultRetryDelay: l,
  sseMaxRetryAttempts: c,
  sseMaxRetryDelay: i,
  sseSleepFn: o,
  url: f,
  ...n
}) => {
  let d;
  const E = o ?? ((u) => new Promise((m) => setTimeout(m, u)));
  return { stream: async function* () {
    let u = l ?? 3e3, m = 0;
    const k = n.signal ?? new AbortController().signal;
    for (; !k.aborted; ) {
      m++;
      const A = n.headers instanceof Headers ? n.headers : new Headers(n.headers);
      d !== void 0 && A.set("Last-Event-ID", d);
      try {
        const C = {
          redirect: "follow",
          ...n,
          body: n.serializedBody,
          headers: A,
          signal: k
        };
        let p = new Request(f, C);
        r && (p = await r(f, C));
        const y = await (n.fetch ?? globalThis.fetch)(p);
        if (!y.ok)
          throw new Error(
            `SSE failed: ${y.status} ${y.statusText}`
          );
        if (!y.body) throw new Error("No body in SSE response");
        const g = y.body.pipeThrough(new TextDecoderStream()).getReader();
        let x = "";
        const N = () => {
          try {
            g.cancel();
          } catch {
          }
        };
        k.addEventListener("abort", N);
        try {
          for (; ; ) {
            const { done: Q, value: X } = await g.read();
            if (Q) break;
            x += X;
            const P = x.split(`

`);
            x = P.pop() ?? "";
            for (const Z of P) {
              const ee = Z.split(`
`), U = [];
              let $;
              for (const b of ee)
                if (b.startsWith("data:"))
                  U.push(b.replace(/^data:\s*/, ""));
                else if (b.startsWith("event:"))
                  $ = b.replace(/^event:\s*/, "");
                else if (b.startsWith("id:"))
                  d = b.replace(/^id:\s*/, "");
                else if (b.startsWith("retry:")) {
                  const D = Number.parseInt(
                    b.replace(/^retry:\s*/, ""),
                    10
                  );
                  Number.isNaN(D) || (u = D);
                }
              let S, q = !1;
              if (U.length) {
                const b = U.join(`
`);
                try {
                  S = JSON.parse(b), q = !0;
                } catch {
                  S = b;
                }
              }
              q && (s && await s(S), a && (S = await a(S))), t == null || t({
                data: S,
                event: $,
                id: d,
                retry: u
              }), U.length && (yield S);
            }
          }
        } finally {
          k.removeEventListener("abort", N), g.releaseLock();
        }
        break;
      } catch (C) {
        if (e == null || e(C), c !== void 0 && m >= c)
          break;
        const p = Math.min(
          u * 2 ** (m - 1),
          i ?? 3e4
        );
        await E(p);
      }
    }
  }() };
}, ce = (r) => {
  switch (r) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, le = (r) => {
  switch (r) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, ue = (r) => {
  switch (r) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, V = ({
  allowReserved: r,
  explode: e,
  name: t,
  style: a,
  value: s
}) => {
  if (!e) {
    const i = (r ? s : s.map((o) => encodeURIComponent(o))).join(le(a));
    switch (a) {
      case "label":
        return `.${i}`;
      case "matrix":
        return `;${t}=${i}`;
      case "simple":
        return i;
      default:
        return `${t}=${i}`;
    }
  }
  const l = ce(a), c = s.map((i) => a === "label" || a === "simple" ? r ? i : encodeURIComponent(i) : j({
    allowReserved: r,
    name: t,
    value: i
  })).join(l);
  return a === "label" || a === "matrix" ? l + c : c;
}, j = ({
  allowReserved: r,
  name: e,
  value: t
}) => {
  if (t == null)
    return "";
  if (typeof t == "object")
    throw new Error(
      "Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these."
    );
  return `${e}=${r ? t : encodeURIComponent(t)}`;
}, Y = ({
  allowReserved: r,
  explode: e,
  name: t,
  style: a,
  value: s,
  valueOnly: l
}) => {
  if (s instanceof Date)
    return l ? s.toISOString() : `${t}=${s.toISOString()}`;
  if (a !== "deepObject" && !e) {
    let o = [];
    Object.entries(s).forEach(([n, d]) => {
      o = [
        ...o,
        n,
        r ? d : encodeURIComponent(d)
      ];
    });
    const f = o.join(",");
    switch (a) {
      case "form":
        return `${t}=${f}`;
      case "label":
        return `.${f}`;
      case "matrix":
        return `;${t}=${f}`;
      default:
        return f;
    }
  }
  const c = ue(a), i = Object.entries(s).map(
    ([o, f]) => j({
      allowReserved: r,
      name: a === "deepObject" ? `${t}[${o}]` : o,
      value: f
    })
  ).join(c);
  return a === "label" || a === "matrix" ? c + i : i;
}, fe = /\{[^{}]+\}/g, de = ({ path: r, url: e }) => {
  let t = e;
  const a = e.match(fe);
  if (a)
    for (const s of a) {
      let l = !1, c = s.substring(1, s.length - 1), i = "simple";
      c.endsWith("*") && (l = !0, c = c.substring(0, c.length - 1)), c.startsWith(".") ? (c = c.substring(1), i = "label") : c.startsWith(";") && (c = c.substring(1), i = "matrix");
      const o = r[c];
      if (o == null)
        continue;
      if (Array.isArray(o)) {
        t = t.replace(
          s,
          V({ explode: l, name: c, style: i, value: o })
        );
        continue;
      }
      if (typeof o == "object") {
        t = t.replace(
          s,
          Y({
            explode: l,
            name: c,
            style: i,
            value: o,
            valueOnly: !0
          })
        );
        continue;
      }
      if (i === "matrix") {
        t = t.replace(
          s,
          `;${j({
            name: c,
            value: o
          })}`
        );
        continue;
      }
      const f = encodeURIComponent(
        i === "label" ? `.${o}` : o
      );
      t = t.replace(s, f);
    }
  return t;
}, he = ({
  baseUrl: r,
  path: e,
  query: t,
  querySerializer: a,
  url: s
}) => {
  const l = s.startsWith("/") ? s : `/${s}`;
  let c = (r ?? "") + l;
  e && (c = de({ path: e, url: c }));
  let i = t ? a(t) : "";
  return i.startsWith("?") && (i = i.substring(1)), i && (c += `?${i}`), c;
};
function me(r) {
  const e = r.body !== void 0;
  if (e && r.bodySerializer)
    return "serializedBody" in r ? r.serializedBody !== void 0 && r.serializedBody !== "" ? r.serializedBody : null : r.body !== "" ? r.body : null;
  if (e)
    return r.body;
}
const ye = async (r, e) => {
  const t = typeof e == "function" ? await e(r) : e;
  if (t)
    return r.scheme === "bearer" ? `Bearer ${t}` : r.scheme === "basic" ? `Basic ${btoa(t)}` : t;
}, F = ({
  allowReserved: r,
  array: e,
  object: t
} = {}) => (s) => {
  const l = [];
  if (s && typeof s == "object")
    for (const c in s) {
      const i = s[c];
      if (i != null)
        if (Array.isArray(i)) {
          const o = V({
            allowReserved: r,
            explode: !0,
            name: c,
            style: "form",
            value: i,
            ...e
          });
          o && l.push(o);
        } else if (typeof i == "object") {
          const o = Y({
            allowReserved: r,
            explode: !0,
            name: c,
            style: "deepObject",
            value: i,
            ...t
          });
          o && l.push(o);
        } else {
          const o = j({
            allowReserved: r,
            name: c,
            value: i
          });
          o && l.push(o);
        }
    }
  return l.join("&");
}, be = (r) => {
  var t;
  if (!r)
    return "stream";
  const e = (t = r.split(";")[0]) == null ? void 0 : t.trim();
  if (e) {
    if (e.startsWith("application/json") || e.endsWith("+json"))
      return "json";
    if (e === "multipart/form-data")
      return "formData";
    if (["application/", "audio/", "image/", "video/"].some(
      (a) => e.startsWith(a)
    ))
      return "blob";
    if (e.startsWith("text/"))
      return "text";
  }
}, pe = (r, e) => {
  var t, a;
  return e ? !!(r.headers.has(e) || (t = r.query) != null && t[e] || (a = r.headers.get("Cookie")) != null && a.includes(`${e}=`)) : !1;
}, ge = async ({
  security: r,
  ...e
}) => {
  for (const t of r) {
    if (pe(e, t.name))
      continue;
    const a = await ye(t, e.auth);
    if (!a)
      continue;
    const s = t.name ?? "Authorization";
    switch (t.in) {
      case "query":
        e.query || (e.query = {}), e.query[s] = a;
        break;
      case "cookie":
        e.headers.append("Cookie", `${s}=${a}`);
        break;
      case "header":
      default:
        e.headers.set(s, a);
        break;
    }
  }
}, L = (r) => he({
  baseUrl: r.baseUrl,
  path: r.path,
  query: r.query,
  querySerializer: typeof r.querySerializer == "function" ? r.querySerializer : F(r.querySerializer),
  url: r.url
}), M = (r, e) => {
  var a;
  const t = { ...r, ...e };
  return (a = t.baseUrl) != null && a.endsWith("/") && (t.baseUrl = t.baseUrl.substring(0, t.baseUrl.length - 1)), t.headers = J(r.headers, e.headers), t;
}, we = (r) => {
  const e = [];
  return r.forEach((t, a) => {
    e.push([a, t]);
  }), e;
}, J = (...r) => {
  const e = new Headers();
  for (const t of r) {
    if (!t)
      continue;
    const a = t instanceof Headers ? we(t) : Object.entries(t);
    for (const [s, l] of a)
      if (l === null)
        e.delete(s);
      else if (Array.isArray(l))
        for (const c of l)
          e.append(s, c);
      else l !== void 0 && e.set(
        s,
        typeof l == "object" ? JSON.stringify(l) : l
      );
  }
  return e;
};
class z {
  constructor() {
    this.fns = [];
  }
  clear() {
    this.fns = [];
  }
  eject(e) {
    const t = this.getInterceptorIndex(e);
    this.fns[t] && (this.fns[t] = null);
  }
  exists(e) {
    const t = this.getInterceptorIndex(e);
    return !!this.fns[t];
  }
  getInterceptorIndex(e) {
    return typeof e == "number" ? this.fns[e] ? e : -1 : this.fns.indexOf(e);
  }
  update(e, t) {
    const a = this.getInterceptorIndex(e);
    return this.fns[a] ? (this.fns[a] = t, e) : !1;
  }
  use(e) {
    return this.fns.push(e), this.fns.length - 1;
  }
}
const ke = () => ({
  error: new z(),
  request: new z(),
  response: new z()
}), Ce = F({
  allowReserved: !1,
  array: {
    explode: !0,
    style: "form"
  },
  object: {
    explode: !0,
    style: "deepObject"
  }
}), Se = {
  "Content-Type": "application/json"
}, G = (r = {}) => ({
  ...ie,
  headers: Se,
  parseAs: "auto",
  querySerializer: Ce,
  ...r
}), Ee = (r = {}) => {
  let e = M(G(), r);
  const t = () => ({ ...e }), a = (f) => (e = M(e, f), t()), s = ke(), l = async (f) => {
    const n = {
      ...e,
      ...f,
      fetch: f.fetch ?? e.fetch ?? globalThis.fetch,
      headers: J(e.headers, f.headers),
      serializedBody: void 0
    };
    n.security && await ge({
      ...n,
      security: n.security
    }), n.requestValidator && await n.requestValidator(n), n.body !== void 0 && n.bodySerializer && (n.serializedBody = n.bodySerializer(n.body)), (n.body === void 0 || n.serializedBody === "") && n.headers.delete("Content-Type");
    const d = L(n);
    return { opts: n, url: d };
  }, c = async (f) => {
    const { opts: n, url: d } = await l(f), E = {
      redirect: "follow",
      ...n,
      body: me(n)
    };
    let w = new Request(d, E);
    for (const h of s.request.fns)
      h && (w = await h(w, n));
    const T = n.fetch;
    let u = await T(w);
    for (const h of s.response.fns)
      h && (u = await h(u, w, n));
    const m = {
      request: w,
      response: u
    };
    if (u.ok) {
      const h = (n.parseAs === "auto" ? be(u.headers.get("Content-Type")) : n.parseAs) ?? "json";
      if (u.status === 204 || u.headers.get("Content-Length") === "0") {
        let g;
        switch (h) {
          case "arrayBuffer":
          case "blob":
          case "text":
            g = await u[h]();
            break;
          case "formData":
            g = new FormData();
            break;
          case "stream":
            g = u.body;
            break;
          case "json":
          default:
            g = {};
            break;
        }
        return n.responseStyle === "data" ? g : {
          data: g,
          ...m
        };
      }
      let y;
      switch (h) {
        case "arrayBuffer":
        case "blob":
        case "formData":
        case "json":
        case "text":
          y = await u[h]();
          break;
        case "stream":
          return n.responseStyle === "data" ? u.body : {
            data: u.body,
            ...m
          };
      }
      return h === "json" && (n.responseValidator && await n.responseValidator(y), n.responseTransformer && (y = await n.responseTransformer(y))), n.responseStyle === "data" ? y : {
        data: y,
        ...m
      };
    }
    const k = await u.text();
    let A;
    try {
      A = JSON.parse(k);
    } catch {
    }
    const C = A ?? k;
    let p = C;
    for (const h of s.error.fns)
      h && (p = await h(C, u, w, n));
    if (p = p || {}, n.throwOnError)
      throw p;
    return n.responseStyle === "data" ? void 0 : {
      error: p,
      ...m
    };
  }, i = (f) => (n) => c({ ...n, method: f }), o = (f) => async (n) => {
    const { opts: d, url: E } = await l(n);
    return oe({
      ...d,
      body: d.body,
      headers: d.headers,
      method: f,
      onRequest: async (w, T) => {
        let u = new Request(w, T);
        for (const m of s.request.fns)
          m && (u = await m(u, d));
        return u;
      },
      url: E
    });
  };
  return {
    buildUrl: L,
    connect: i("CONNECT"),
    delete: i("DELETE"),
    get: i("GET"),
    getConfig: t,
    head: i("HEAD"),
    interceptors: s,
    options: i("OPTIONS"),
    patch: i("PATCH"),
    post: i("POST"),
    put: i("PUT"),
    request: c,
    setConfig: a,
    sse: {
      connect: o("CONNECT"),
      delete: o("DELETE"),
      get: o("GET"),
      head: o("HEAD"),
      options: o("OPTIONS"),
      patch: o("PATCH"),
      post: o("POST"),
      put: o("PUT"),
      trace: o("TRACE")
    },
    trace: i("TRACE")
  };
}, Ae = Ee(G({
  baseUrl: "https://localhost:44365"
})), Te = (r) => ((r == null ? void 0 : r.client) ?? Ae).get({
  security: [
    {
      scheme: "bearer",
      type: "http"
    }
  ],
  url: "/umbraco/rollbackpreviewer/api/v1/configuration",
  ...r
});
class Ue {
  /**
   * Fetches the configuration settings from the backend API
   * @returns Promise with configuration data
   */
  static async getConfiguration() {
    const { data: e, error: t } = await Te();
    return t ? (console.error(t), null) : e !== void 0 ? e : null;
  }
}
var O, K;
class Oe extends re {
  constructor(t, a) {
    super(t, a);
    v(this, O);
    console.log("UmbWorkspaceEntityUniqueCondition constructor", { host: t, args: a }), this.consumeContext(ae, async () => {
      var s = await B(this, O, K).call(this);
      console.log("config", s), this.permitted = (s == null ? void 0 : s.enableFrontendPreviewAuthorisation) ?? !1;
    });
  }
}
O = new WeakSet(), K = async function() {
  return await Ue.getConfiguration();
};
const je = [
  {
    type: "condition",
    name: "My Condition",
    alias: "My.Condition.CustomName",
    api: Oe
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "UmbracoCommunityRollbackPreviewer.WorkspaceAction.SaveAndSharePreview",
    name: "Save and Share Preview",
    api: () => import("./save-and-share-action.element-B3H7AIdH.js"),
    meta: {
      label: "Save and share preview",
      look: "secondary",
      color: "green"
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: "Umb.Workspace.Document"
      },
      {
        alias: "My.Condition.CustomName"
      }
    ]
  }
];
I.unregister("Umb.EntityAction.Document.Rollback");
I.unregister("Umb.AuditLogAction.Document.Rollback");
const xe = [
  {
    type: "entityAction",
    kind: "default",
    alias: "Umb.EntityAction.Document.Rollback",
    name: "Rollback Document Entity Action",
    weight: 450,
    api: () => import("./rbp-rollback.action-DaEMCHkj.js"),
    forEntityTypes: [W],
    meta: {
      icon: "icon-history",
      label: "#actions_rollback",
      additionalOptions: !0
    },
    conditions: [
      {
        alias: "Umb.Condition.UserPermission.Document",
        allOf: [_]
      },
      {
        alias: H
      }
    ]
  },
  {
    type: "auditLogAction",
    kind: "default",
    alias: "Umb.AuditLogAction.Document.Rollback",
    name: "Rollback Document Entity Action",
    weight: 450,
    api: () => import("./rbp-rollback.action-DaEMCHkj.js"),
    forEntityTypes: [W],
    meta: {
      icon: "icon-history",
      label: "#actions_rollback",
      additionalOptions: !0
    },
    conditions: [
      {
        alias: "Umb.Condition.UserPermission.Document",
        allOf: [_]
      },
      {
        alias: H
      }
    ]
  }
], qe = [
  ...ne,
  ...se,
  ...je,
  ...xe
];
export {
  Ue as R,
  Ae as c,
  qe as m
};
//# sourceMappingURL=bundle.manifests-CCn6FmEI.js.map
