var A = Object.defineProperty;
var C = (s, e, a) => e in s ? A(s, e, { enumerable: !0, configurable: !0, writable: !0, value: a }) : s[e] = a;
var v = (s, e, a) => C(s, typeof e != "symbol" ? e + "" : e, a);
var q = /\{[^{}]+\}/g, b = ({ allowReserved: s, name: e, value: a }) => {
  if (a == null) return "";
  if (typeof a == "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  return `${e}=${s ? a : encodeURIComponent(a)}`;
}, U = (s) => {
  switch (s) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, _ = (s) => {
  switch (s) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, W = (s) => {
  switch (s) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, x = ({ allowReserved: s, explode: e, name: a, style: i, value: l }) => {
  if (!e) {
    let r = (s ? l : l.map((u) => encodeURIComponent(u))).join(_(i));
    switch (i) {
      case "label":
        return `.${r}`;
      case "matrix":
        return `;${a}=${r}`;
      case "simple":
        return r;
      default:
        return `${a}=${r}`;
    }
  }
  let n = U(i), t = l.map((r) => i === "label" || i === "simple" ? s ? r : encodeURIComponent(r) : b({ allowReserved: s, name: a, value: r })).join(n);
  return i === "label" || i === "matrix" ? n + t : t;
}, $ = ({ allowReserved: s, explode: e, name: a, style: i, value: l }) => {
  if (l instanceof Date) return `${a}=${l.toISOString()}`;
  if (i !== "deepObject" && !e) {
    let r = [];
    Object.entries(l).forEach(([d, c]) => {
      r = [...r, d, s ? c : encodeURIComponent(c)];
    });
    let u = r.join(",");
    switch (i) {
      case "form":
        return `${a}=${u}`;
      case "label":
        return `.${u}`;
      case "matrix":
        return `;${a}=${u}`;
      default:
        return u;
    }
  }
  let n = W(i), t = Object.entries(l).map(([r, u]) => b({ allowReserved: s, name: i === "deepObject" ? `${a}[${r}]` : r, value: u })).join(n);
  return i === "label" || i === "matrix" ? n + t : t;
}, E = ({ path: s, url: e }) => {
  let a = e, i = e.match(q);
  if (i) for (let l of i) {
    let n = !1, t = l.substring(1, l.length - 1), r = "simple";
    t.endsWith("*") && (n = !0, t = t.substring(0, t.length - 1)), t.startsWith(".") ? (t = t.substring(1), r = "label") : t.startsWith(";") && (t = t.substring(1), r = "matrix");
    let u = s[t];
    if (u == null) continue;
    if (Array.isArray(u)) {
      a = a.replace(l, x({ explode: n, name: t, style: r, value: u }));
      continue;
    }
    if (typeof u == "object") {
      a = a.replace(l, $({ explode: n, name: t, style: r, value: u }));
      continue;
    }
    if (r === "matrix") {
      a = a.replace(l, `;${b({ name: t, value: u })}`);
      continue;
    }
    let d = encodeURIComponent(r === "label" ? `.${u}` : u);
    a = a.replace(l, d);
  }
  return a;
}, O = ({ allowReserved: s, array: e, object: a } = {}) => (i) => {
  let l = [];
  if (i && typeof i == "object") for (let n in i) {
    let t = i[n];
    if (t != null) {
      if (Array.isArray(t)) {
        l = [...l, x({ allowReserved: s, explode: !0, name: n, style: "form", value: t, ...e })];
        continue;
      }
      if (typeof t == "object") {
        l = [...l, $({ allowReserved: s, explode: !0, name: n, style: "deepObject", value: t, ...a })];
        continue;
      }
      l = [...l, b({ allowReserved: s, name: n, value: t })];
    }
  }
  return l.join("&");
}, z = (s) => {
  if (!s) return;
  let e = s.split(";")[0].trim();
  if (e.startsWith("application/json") || e.endsWith("+json")) return "json";
  if (e === "multipart/form-data") return "formData";
  if (["application/", "audio/", "image/", "video/"].some((a) => e.startsWith(a))) return "blob";
  if (e.startsWith("text/")) return "text";
}, I = ({ baseUrl: s, path: e, query: a, querySerializer: i, url: l }) => {
  let n = l.startsWith("/") ? l : `/${l}`, t = s + n;
  e && (t = E({ path: e, url: t }));
  let r = a ? i(a) : "";
  return r.startsWith("?") && (r = r.substring(1)), r && (t += `?${r}`), t;
}, j = (s, e) => {
  var i;
  let a = { ...s, ...e };
  return (i = a.baseUrl) != null && i.endsWith("/") && (a.baseUrl = a.baseUrl.substring(0, a.baseUrl.length - 1)), a.headers = S(s.headers, e.headers), a;
}, S = (...s) => {
  let e = new Headers();
  for (let a of s) {
    if (!a || typeof a != "object") continue;
    let i = a instanceof Headers ? a.entries() : Object.entries(a);
    for (let [l, n] of i) if (n === null) e.delete(l);
    else if (Array.isArray(n)) for (let t of n) e.append(l, t);
    else n !== void 0 && e.set(l, typeof n == "object" ? JSON.stringify(n) : n);
  }
  return e;
}, g = class {
  constructor() {
    v(this, "_fns");
    this._fns = [];
  }
  clear() {
    this._fns = [];
  }
  exists(s) {
    return this._fns.indexOf(s) !== -1;
  }
  eject(s) {
    let e = this._fns.indexOf(s);
    e !== -1 && (this._fns = [...this._fns.slice(0, e), ...this._fns.slice(e + 1)]);
  }
  use(s) {
    this._fns = [...this._fns, s];
  }
}, N = () => ({ error: new g(), request: new g(), response: new g() }), D = { bodySerializer: (s) => JSON.stringify(s) }, P = O({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), k = { "Content-Type": "application/json" }, T = (s = {}) => ({ ...D, baseUrl: "", fetch: globalThis.fetch, headers: k, parseAs: "auto", querySerializer: P, ...s }), H = (s = {}) => {
  let e = j(T(), s), a = () => ({ ...e }), i = (t) => (e = j(e, t), a()), l = N(), n = async (t) => {
    let r = { ...e, ...t, headers: S(e.headers, t.headers) };
    r.body && r.bodySerializer && (r.body = r.bodySerializer(r.body)), r.body || r.headers.delete("Content-Type");
    let u = I({ baseUrl: r.baseUrl ?? "", path: r.path, query: r.query, querySerializer: typeof r.querySerializer == "function" ? r.querySerializer : O(r.querySerializer), url: r.url }), d = { redirect: "follow", ...r }, c = new Request(u, d);
    for (let f of l.request._fns) c = await f(c, r);
    let R = r.fetch, o = await R(c);
    for (let f of l.response._fns) o = await f(o, c, r);
    let m = { request: c, response: o };
    if (o.ok) {
      if (o.status === 204 || o.headers.get("Content-Length") === "0") return { data: {}, ...m };
      if (r.parseAs === "stream") return { data: o.body, ...m };
      let f = (r.parseAs === "auto" ? z(o.headers.get("Content-Type")) : r.parseAs) ?? "json", w = await o[f]();
      return f === "json" && r.responseTransformer && (w = await r.responseTransformer(w)), { data: w, ...m };
    }
    let p = await o.text();
    try {
      p = JSON.parse(p);
    } catch {
    }
    let h = p;
    for (let f of l.error._fns) h = await f(p, o, c, r);
    if (h = h || {}, r.throwOnError) throw h;
    return { error: h, ...m };
  };
  return { connect: (t) => n({ ...t, method: "CONNECT" }), delete: (t) => n({ ...t, method: "DELETE" }), get: (t) => n({ ...t, method: "GET" }), getConfig: a, head: (t) => n({ ...t, method: "HEAD" }), interceptors: l, options: (t) => n({ ...t, method: "OPTIONS" }), patch: (t) => n({ ...t, method: "PATCH" }), post: (t) => n({ ...t, method: "POST" }), put: (t) => n({ ...t, method: "PUT" }), request: n, setConfig: i, trace: (t) => n({ ...t, method: "TRACE" }) };
};
const y = H(T());
class M {
  static ping(e) {
    return ((e == null ? void 0 : e.client) ?? y).get({
      ...e,
      url: "/umbraco/yourpackagename/api/v1/ping"
    });
  }
  static whatsMyName(e) {
    return ((e == null ? void 0 : e.client) ?? y).get({
      ...e,
      url: "/umbraco/yourpackagename/api/v1/whatsMyName"
    });
  }
  static whatsTheTimeMrWolf(e) {
    return ((e == null ? void 0 : e.client) ?? y).get({
      ...e,
      url: "/umbraco/yourpackagename/api/v1/whatsTheTimeMrWolf"
    });
  }
  static whoAmI(e) {
    return ((e == null ? void 0 : e.client) ?? y).get({
      ...e,
      url: "/umbraco/yourpackagename/api/v1/whoAmI"
    });
  }
}
export {
  M as Y,
  y as c
};
//# sourceMappingURL=services.gen-BWwEisCT.js.map
