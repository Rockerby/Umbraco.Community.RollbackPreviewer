var N = (r) => {
  throw TypeError(r);
};
var K = (r, e, t) => e.has(r) || N("Cannot " + t);
var B = (r, e, t) => e.has(r) ? N("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t);
var W = (r, e, t) => (K(r, e, "access private method"), t);
import { umbExtensionsRegistry as X, UmbConditionBase as Z } from "@umbraco-cms/backoffice/extension-registry";
import { UMB_ENTITY_WORKSPACE_CONTEXT as ee } from "@umbraco-cms/backoffice/workspace";
X.unregister("Umb.Modal.Rollback");
const te = [
  {
    name: "Rollback Previewer",
    alias: "Umb.Modal.Rollback",
    type: "modal",
    element: () => import("./rollback-previewer-modal.element-B9XauE1o.js")
  }
], re = [
  {
    name: "Your Package Name Entrypoint",
    alias: "YourPackageName.Entrypoint",
    type: "backofficeEntryPoint",
    js: () => import("./entrypoint-C6jAIsB5.js")
  }
], ae = {
  bodySerializer: (r) => JSON.stringify(
    r,
    (e, t) => typeof t == "bigint" ? t.toString() : t
  )
}, se = ({
  onRequest: r,
  onSseError: e,
  onSseEvent: t,
  responseTransformer: a,
  responseValidator: n,
  sseDefaultRetryDelay: l,
  sseMaxRetryAttempts: c,
  sseMaxRetryDelay: i,
  sseSleepFn: o,
  url: f,
  ...s
}) => {
  let d;
  const j = o ?? ((u) => new Promise((y) => setTimeout(y, u)));
  return { stream: async function* () {
    let u = l ?? 3e3, y = 0;
    const C = s.signal ?? new AbortController().signal;
    for (; !C.aborted; ) {
      y++;
      const x = s.headers instanceof Headers ? s.headers : new Headers(s.headers);
      d !== void 0 && x.set("Last-Event-ID", d);
      try {
        const S = {
          redirect: "follow",
          ...s,
          body: s.serializedBody,
          headers: x,
          signal: C
        };
        let m = new Request(f, S);
        r && (m = await r(f, S));
        const p = await (s.fetch ?? globalThis.fetch)(m);
        if (!p.ok)
          throw new Error(
            `SSE failed: ${p.status} ${p.statusText}`
          );
        if (!p.body) throw new Error("No body in SSE response");
        const g = p.body.pipeThrough(new TextDecoderStream()).getReader();
        let q = "";
        const O = () => {
          try {
            g.cancel();
          } catch {
          }
        };
        C.addEventListener("abort", O);
        try {
          for (; ; ) {
            const { done: J, value: Y } = await g.read();
            if (J) break;
            q += Y;
            const U = q.split(`

`);
            q = U.pop() ?? "";
            for (const G of U) {
              const Q = G.split(`
`), z = [];
              let v;
              for (const b of Q)
                if (b.startsWith("data:"))
                  z.push(b.replace(/^data:\s*/, ""));
                else if (b.startsWith("event:"))
                  v = b.replace(/^event:\s*/, "");
                else if (b.startsWith("id:"))
                  d = b.replace(/^id:\s*/, "");
                else if (b.startsWith("retry:")) {
                  const I = Number.parseInt(
                    b.replace(/^retry:\s*/, ""),
                    10
                  );
                  Number.isNaN(I) || (u = I);
                }
              let k, P = !1;
              if (z.length) {
                const b = z.join(`
`);
                try {
                  k = JSON.parse(b), P = !0;
                } catch {
                  k = b;
                }
              }
              P && (n && await n(k), a && (k = await a(k))), t == null || t({
                data: k,
                event: v,
                id: d,
                retry: u
              }), z.length && (yield k);
            }
          }
        } finally {
          C.removeEventListener("abort", O), g.releaseLock();
        }
        break;
      } catch (S) {
        if (e == null || e(S), c !== void 0 && y >= c)
          break;
        const m = Math.min(
          u * 2 ** (y - 1),
          i ?? 3e4
        );
        await j(m);
      }
    }
  }() };
}, ne = (r) => {
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
}, ie = (r) => {
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
}, oe = (r) => {
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
}, H = ({
  allowReserved: r,
  explode: e,
  name: t,
  style: a,
  value: n
}) => {
  if (!e) {
    const i = (r ? n : n.map((o) => encodeURIComponent(o))).join(ie(a));
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
  const l = ne(a), c = n.map((i) => a === "label" || a === "simple" ? r ? i : encodeURIComponent(i) : T({
    allowReserved: r,
    name: t,
    value: i
  })).join(l);
  return a === "label" || a === "matrix" ? l + c : c;
}, T = ({
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
}, V = ({
  allowReserved: r,
  explode: e,
  name: t,
  style: a,
  value: n,
  valueOnly: l
}) => {
  if (n instanceof Date)
    return l ? n.toISOString() : `${t}=${n.toISOString()}`;
  if (a !== "deepObject" && !e) {
    let o = [];
    Object.entries(n).forEach(([s, d]) => {
      o = [
        ...o,
        s,
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
  const c = oe(a), i = Object.entries(n).map(
    ([o, f]) => T({
      allowReserved: r,
      name: a === "deepObject" ? `${t}[${o}]` : o,
      value: f
    })
  ).join(c);
  return a === "label" || a === "matrix" ? c + i : i;
}, ce = /\{[^{}]+\}/g, le = ({ path: r, url: e }) => {
  let t = e;
  const a = e.match(ce);
  if (a)
    for (const n of a) {
      let l = !1, c = n.substring(1, n.length - 1), i = "simple";
      c.endsWith("*") && (l = !0, c = c.substring(0, c.length - 1)), c.startsWith(".") ? (c = c.substring(1), i = "label") : c.startsWith(";") && (c = c.substring(1), i = "matrix");
      const o = r[c];
      if (o == null)
        continue;
      if (Array.isArray(o)) {
        t = t.replace(
          n,
          H({ explode: l, name: c, style: i, value: o })
        );
        continue;
      }
      if (typeof o == "object") {
        t = t.replace(
          n,
          V({
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
          n,
          `;${T({
            name: c,
            value: o
          })}`
        );
        continue;
      }
      const f = encodeURIComponent(
        i === "label" ? `.${o}` : o
      );
      t = t.replace(n, f);
    }
  return t;
}, ue = ({
  baseUrl: r,
  path: e,
  query: t,
  querySerializer: a,
  url: n
}) => {
  const l = n.startsWith("/") ? n : `/${n}`;
  let c = (r ?? "") + l;
  e && (c = le({ path: e, url: c }));
  let i = t ? a(t) : "";
  return i.startsWith("?") && (i = i.substring(1)), i && (c += `?${i}`), c;
};
function fe(r) {
  const e = r.body !== void 0;
  if (e && r.bodySerializer)
    return "serializedBody" in r ? r.serializedBody !== void 0 && r.serializedBody !== "" ? r.serializedBody : null : r.body !== "" ? r.body : null;
  if (e)
    return r.body;
}
const de = async (r, e) => {
  const t = typeof e == "function" ? await e(r) : e;
  if (t)
    return r.scheme === "bearer" ? `Bearer ${t}` : r.scheme === "basic" ? `Basic ${btoa(t)}` : t;
}, L = ({
  allowReserved: r,
  array: e,
  object: t
} = {}) => (n) => {
  const l = [];
  if (n && typeof n == "object")
    for (const c in n) {
      const i = n[c];
      if (i != null)
        if (Array.isArray(i)) {
          const o = H({
            allowReserved: r,
            explode: !0,
            name: c,
            style: "form",
            value: i,
            ...e
          });
          o && l.push(o);
        } else if (typeof i == "object") {
          const o = V({
            allowReserved: r,
            explode: !0,
            name: c,
            style: "deepObject",
            value: i,
            ...t
          });
          o && l.push(o);
        } else {
          const o = T({
            allowReserved: r,
            name: c,
            value: i
          });
          o && l.push(o);
        }
    }
  return l.join("&");
}, he = (r) => {
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
}, ye = (r, e) => {
  var t, a;
  return e ? !!(r.headers.has(e) || (t = r.query) != null && t[e] || (a = r.headers.get("Cookie")) != null && a.includes(`${e}=`)) : !1;
}, pe = async ({
  security: r,
  ...e
}) => {
  for (const t of r) {
    if (ye(e, t.name))
      continue;
    const a = await de(t, e.auth);
    if (!a)
      continue;
    const n = t.name ?? "Authorization";
    switch (t.in) {
      case "query":
        e.query || (e.query = {}), e.query[n] = a;
        break;
      case "cookie":
        e.headers.append("Cookie", `${n}=${a}`);
        break;
      case "header":
      default:
        e.headers.set(n, a);
        break;
    }
  }
}, R = (r) => ue({
  baseUrl: r.baseUrl,
  path: r.path,
  query: r.query,
  querySerializer: typeof r.querySerializer == "function" ? r.querySerializer : L(r.querySerializer),
  url: r.url
}), D = (r, e) => {
  var a;
  const t = { ...r, ...e };
  return (a = t.baseUrl) != null && a.endsWith("/") && (t.baseUrl = t.baseUrl.substring(0, t.baseUrl.length - 1)), t.headers = M(r.headers, e.headers), t;
}, be = (r) => {
  const e = [];
  return r.forEach((t, a) => {
    e.push([a, t]);
  }), e;
}, M = (...r) => {
  const e = new Headers();
  for (const t of r) {
    if (!t)
      continue;
    const a = t instanceof Headers ? be(t) : Object.entries(t);
    for (const [n, l] of a)
      if (l === null)
        e.delete(n);
      else if (Array.isArray(l))
        for (const c of l)
          e.append(n, c);
      else l !== void 0 && e.set(
        n,
        typeof l == "object" ? JSON.stringify(l) : l
      );
  }
  return e;
};
class $ {
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
const me = () => ({
  error: new $(),
  request: new $(),
  response: new $()
}), ge = L({
  allowReserved: !1,
  array: {
    explode: !0,
    style: "form"
  },
  object: {
    explode: !0,
    style: "deepObject"
  }
}), we = {
  "Content-Type": "application/json"
}, _ = (r = {}) => ({
  ...ae,
  headers: we,
  parseAs: "auto",
  querySerializer: ge,
  ...r
}), Ce = (r = {}) => {
  let e = D(_(), r);
  const t = () => ({ ...e }), a = (f) => (e = D(e, f), t()), n = me(), l = async (f) => {
    const s = {
      ...e,
      ...f,
      fetch: f.fetch ?? e.fetch ?? globalThis.fetch,
      headers: M(e.headers, f.headers),
      serializedBody: void 0
    };
    s.security && await pe({
      ...s,
      security: s.security
    }), s.requestValidator && await s.requestValidator(s), s.body !== void 0 && s.bodySerializer && (s.serializedBody = s.bodySerializer(s.body)), (s.body === void 0 || s.serializedBody === "") && s.headers.delete("Content-Type");
    const d = R(s);
    return { opts: s, url: d };
  }, c = async (f) => {
    const { opts: s, url: d } = await l(f), j = {
      redirect: "follow",
      ...s,
      body: fe(s)
    };
    let w = new Request(d, j);
    for (const h of n.request.fns)
      h && (w = await h(w, s));
    const E = s.fetch;
    let u = await E(w);
    for (const h of n.response.fns)
      h && (u = await h(u, w, s));
    const y = {
      request: w,
      response: u
    };
    if (u.ok) {
      const h = (s.parseAs === "auto" ? he(u.headers.get("Content-Type")) : s.parseAs) ?? "json";
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
        return s.responseStyle === "data" ? g : {
          data: g,
          ...y
        };
      }
      let p;
      switch (h) {
        case "arrayBuffer":
        case "blob":
        case "formData":
        case "json":
        case "text":
          p = await u[h]();
          break;
        case "stream":
          return s.responseStyle === "data" ? u.body : {
            data: u.body,
            ...y
          };
      }
      return h === "json" && (s.responseValidator && await s.responseValidator(p), s.responseTransformer && (p = await s.responseTransformer(p))), s.responseStyle === "data" ? p : {
        data: p,
        ...y
      };
    }
    const C = await u.text();
    let x;
    try {
      x = JSON.parse(C);
    } catch {
    }
    const S = x ?? C;
    let m = S;
    for (const h of n.error.fns)
      h && (m = await h(S, u, w, s));
    if (m = m || {}, s.throwOnError)
      throw m;
    return s.responseStyle === "data" ? void 0 : {
      error: m,
      ...y
    };
  }, i = (f) => (s) => c({ ...s, method: f }), o = (f) => async (s) => {
    const { opts: d, url: j } = await l(s);
    return se({
      ...d,
      body: d.body,
      headers: d.headers,
      method: f,
      onRequest: async (w, E) => {
        let u = new Request(w, E);
        for (const y of n.request.fns)
          y && (u = await y(u, d));
        return u;
      },
      url: j
    });
  };
  return {
    buildUrl: R,
    connect: i("CONNECT"),
    delete: i("DELETE"),
    get: i("GET"),
    getConfig: t,
    head: i("HEAD"),
    interceptors: n,
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
}, Se = Ce(_({
  baseUrl: "https://localhost:44365"
})), ke = (r) => ((r == null ? void 0 : r.client) ?? Se).get({
  security: [
    {
      scheme: "bearer",
      type: "http"
    }
  ],
  url: "/umbraco/rollbackpreviewer/api/v1/configuration",
  ...r
});
class je {
  /**
   * Fetches the configuration settings from the backend API
   * @returns Promise with configuration data
   */
  static async getConfiguration() {
    const { data: e, error: t } = await ke();
    return t ? (console.error(t), null) : e !== void 0 ? e : null;
  }
}
var A, F;
class xe extends Z {
  constructor(t, a) {
    super(t, a);
    B(this, A);
    console.log("UmbWorkspaceEntityUniqueCondition constructor", { host: t, args: a }), this.consumeContext(ee, async () => {
      var n = await W(this, A, F).call(this);
      console.log("config", n), this.permitted = (n == null ? void 0 : n.enableFrontendPreviewAuthorisation) ?? !1;
    });
  }
}
A = new WeakSet(), F = async function() {
  return await je.getConfiguration();
};
const Ee = [
  {
    type: "condition",
    name: "My Condition",
    alias: "My.Condition.CustomName",
    api: xe
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "UmbracoCommunityRollbackPreviewer.WorkspaceAction.SaveAndSharePreview",
    name: "Save and Share Preview",
    api: () => import("./save-and-share-action.element-DiyynW2A.js"),
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
], qe = [
  ...te,
  ...re,
  ...Ee
];
export {
  je as R,
  Se as c,
  qe as m
};
//# sourceMappingURL=bundle.manifests-Causo6f7.js.map
