var te = (e) => {
  throw TypeError(e);
};
var ie = (e, t, i) => t.has(e) || te("Cannot " + i);
var f = (e, t, i) => (ie(e, t, "read from private field"), i ? i.call(e) : t.get(e)), W = (e, t, i) => t.has(e) ? te("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), N = (e, t, i, r) => (ie(e, t, "write to private field"), r ? r.call(e, i) : t.set(e, i), i);
import { html as u, repeat as re, unsafeHTML as ge, nothing as L, css as H, state as k, customElement as J, property as we, query as X, LitElement as ke } from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_ENTITY_TYPE as se, UmbDocumentDetailRepository as Ce } from "@umbraco-cms/backoffice/document";
import { DocumentVersionService as S } from "@umbraco-cms/backoffice/external/backend-api";
import { tryExecuteAndNotify as T } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as $e } from "@umbraco-cms/backoffice/class-api";
import { diffWords as oe } from "@umbraco-cms/backoffice/external/diff";
import { UmbModalBaseElement as xe } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles as Ve } from "@umbraco-cms/backoffice/style";
import { UmbUserItemRepository as Ee } from "@umbraco-cms/backoffice/user";
import { UMB_PROPERTY_DATASET_CONTEXT as Pe } from "@umbraco-cms/backoffice/property";
import { UMB_APP_LANGUAGE_CONTEXT as De, UmbLanguageItemRepository as Se } from "@umbraco-cms/backoffice/language";
import { UMB_ENTITY_CONTEXT as Te } from "@umbraco-cms/backoffice/entity";
import { UmbVariantId as Re } from "@umbraco-cms/backoffice/variant";
import { UMB_ACTION_EVENT_CONTEXT as ze } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as Ue, UmbEntityUpdatedEvent as qe } from "@umbraco-cms/backoffice/entity-action";
import { UMB_APP_CONTEXT as Oe } from "@umbraco-cms/backoffice/app";
var y;
class Me {
  /**
   * Creates an instance of UmbRollbackServerDataSource.
   * @param {UmbControllerHost} host - The controller host for this controller to be appended to
   * @memberof UmbRollbackServerDataSource
   */
  constructor(t) {
    W(this, y);
    N(this, y, t);
  }
  /**
   * Get a list of versions for a document
   * @param id
   * @param culture
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionsByDocumentId(t, i) {
    return T(f(this, y), S.getDocumentVersion({ documentId: t, culture: i }));
  }
  /**
   * Get a specific version by id
   * @param versionId
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionById(t) {
    return T(f(this, y), S.getDocumentVersionById({ id: t }));
  }
  setPreventCleanup(t, i) {
    return T(
      f(this, y),
      S.putDocumentVersionByIdPreventCleanup({ id: t, preventCleanup: i })
    );
  }
  rollback(t, i) {
    return T(
      f(this, y),
      S.postDocumentVersionByIdRollback({ id: t, culture: i })
    );
  }
}
y = new WeakMap();
var g;
class Ie extends $e {
  constructor(i) {
    super(i);
    W(this, g);
    N(this, g, new Me(this));
  }
  async requestVersionsByDocumentId(i, r) {
    return await f(this, g).getVersionsByDocumentId(i, r);
  }
  async requestVersionById(i) {
    return await f(this, g).getVersionById(i);
  }
  async setPreventCleanup(i, r) {
    return await f(this, g).setPreventCleanup(i, r);
  }
  async rollback(i, r) {
    return await f(this, g).rollback(i, r);
  }
}
g = new WeakMap();
var We = Object.defineProperty, Ne = Object.getOwnPropertyDescriptor, le = (e) => {
  throw TypeError(e);
}, C = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Ne(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && We(t, i, s), s;
}, G = (e, t, i) => t.has(e) || le("Cannot " + i), b = (e, t, i) => (G(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $ = (e, t, i) => t.has(e) ? le("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ne = (e, t, i, r) => (G(e, t, "write to private field"), t.set(e, i), i), d = (e, t, i) => (G(e, t, "access private method"), i), x, Y, R, U, q, c, z, F, j, ae, ue, ce, A, de;
let h = class extends xe {
  constructor() {
    super(), $(this, c), this._versions = [], this._selectedCulture = null, this._isInvariant = !0, this._availableVariants = [], this._diffs = [], $(this, x, new Ie(this)), $(this, Y, new Ee(this)), $(this, R, {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit"
    }), $(this, U), $(this, q), this.consumeContext(Pe, (e) => {
      ne(this, q, e.getVariantId().culture ?? void 0), d(this, c, z).call(this);
    }), this.consumeContext(De, (e) => {
      ne(this, U, e.getAppCulture()), d(this, c, z).call(this);
    }), this.consumeContext(Te, async (e) => {
      var o;
      if (e.getEntityType() !== se)
        throw new Error(`Entity type is not ${se}`);
      const t = e == null ? void 0 : e.getUnique();
      if (!t)
        throw new Error("Document unique is not set");
      const { data: i } = await new Ce(this).requestByUnique(t);
      if (!i) return;
      this.currentDocument = i;
      const r = ((o = this.currentDocument) == null ? void 0 : o.variants) ?? [];
      this._isInvariant = r.length === 1 && new Re(r[0].culture).isInvariant(), d(this, c, z).call(this);
      const s = r.map((l) => l.culture).filter((l) => l !== null), { data: n } = await new Se(this).requestItems(s);
      n ? this._availableVariants = n.map((l) => ({
        name: l.name,
        value: l.unique,
        selected: l.unique === this._selectedCulture
      })) : this._availableVariants = [], d(this, c, F).call(this);
    });
  }
  // Change Note - Converted to public method
  async onRollback() {
    var a, p, m;
    if (!this._selectedVersion) return;
    const e = this._selectedVersion.id, t = this._selectedCulture ?? void 0, { error: i } = await b(this, x).rollback(e, t);
    if (i) return;
    const r = (a = this.currentDocument) == null ? void 0 : a.unique, s = (p = this.currentDocument) == null ? void 0 : p.entityType;
    if (!r || !s)
      throw new Error("Document unique or entity type is not set");
    const n = await this.getContext(ze), o = new Ue({ unique: r, entityType: s });
    n.dispatchEvent(o);
    const l = new qe({ unique: r, entityType: s });
    n.dispatchEvent(l), this.value = {}, (m = this.modalContext) == null || m.submit();
  }
  // Change Note - Converted to public method
  onCancel() {
    var e;
    (e = this.modalContext) == null || e.reject();
  }
  // Change Note - Converted to public method
  renderCultureSelect() {
    return u`
      <uui-select
        id="language-select"
        @change=${d(this, c, ce)}
				.options=${this._availableVariants}></uui-select>
    `;
  }
  // Change Note - Converted to public method
  renderVersions() {
    return this._versions.length ? u` <uui-box id="versions-box" headline=${this.localize.term("rollback_versions")} headlineVariant="h4">
      ${re(
      this._versions,
      (e) => e.id,
      (e) => {
        var t;
        return u`
            <div
              class="rollback-item ${((t = this._selectedVersion) == null ? void 0 : t.id) === e.id ? "active" : ""}"
            >
              <button
                class="rollback-item-version-button uui-text"
                @click=${() => d(this, c, ae).call(this, e.id)}
                @keydown=${() => {
        }}
              >
                <span class="rollback-item-date">
                  <umb-localize-date
                    date="${e.date}"
                    .options=${b(this, R)}
                  ></umb-localize-date>
                </span>
                <span>${e.user}</span>
                <span
                  >${e.isCurrentlyPublishedVersion ? this.localize.term("rollback_currentPublishedVersion") : ""}</span
                >
              </button>
              <uui-button
                look="secondary"
                @click=${(i) => d(this, c, ue).call(this, i, e.id, !e.preventCleanup)}
                label=${e.preventCleanup ? this.localize.term(
          "contentTypeEditor_historyCleanupEnableCleanup"
        ) : this.localize.term(
          "contentTypeEditor_historyCleanupPreventCleanup"
        )}
              ></uui-button>
            </div>
          `;
      }
    )}</uui-box
    >` : u`<uui-box headline=${this.localize.term("rollback_versions")}>No versions available</uui-box>`;
  }
  // Change Note - Converted to public method
  renderSelectedVersion() {
    return this._selectedVersion ? u`
      <uui-box headline=${this.currentVersionHeader} id="box-right">
				${ge(this.localize.term("rollback_diffHelp"))}
        <uui-table>
          <uui-table-column style="width: 0"></uui-table-column>
          <uui-table-column></uui-table-column>

          <uui-table-head>
						<uui-table-head-cell>${this.localize.term("general_alias")}</uui-table-head-cell>
						<uui-table-head-cell>${this.localize.term("general_value")}</uui-table-head-cell>
          </uui-table-head>
          ${re(
      this._diffs,
      (e) => e.alias,
      (e) => {
        const t = this._diffs.find((i) => (i == null ? void 0 : i.alias) === e.alias);
        return u`
                <uui-table-row>
                  <uui-table-cell>${e.alias}</uui-table-cell>
                  <uui-table-cell>
                    ${t ? t.diff.map(
          (i) => i.added ? u`<span class="diff-added">${i.value}</span>` : i.removed ? u`<span class="diff-removed">${i.value}</span>` : i.value
        ) : L}
                  </uui-table-cell>
                </uui-table-row>
              `;
      }
    )}
        </uui-table>
      </uui-box>
    ` : u`
				<uui-box id="box-right" style="display: flex; align-items: center; justify-content: center;"
          >No selected version</uui-box
        >
      `;
  }
  get currentVersionHeader() {
    var e, t;
    return this.localize.date(((e = this._selectedVersion) == null ? void 0 : e.date) ?? /* @__PURE__ */ new Date(), b(this, R)) + " - " + ((t = this._selectedVersion) == null ? void 0 : t.user);
  }
  render() {
    return u`
      <umb-body-layout headline="Rollback">
        <div id="main">
          <div id="box-left">
            ${this._availableVariants.length ? u`
									<uui-box id="language-box" headline=${this.localize.term("general_language")}>
                    ${this.renderCultureSelect()}
                  </uui-box>
                ` : L}
            ${this.renderVersions()}
          </div>
          ${this.renderSelectedVersion()}
        </div>
        <umb-footer-layout slot="footer">
          <uui-button
            slot="actions"
            look="secondary"
            @click=${this.onCancel}
						label=${this.localize.term("general_cancel")}></uui-button>
          <uui-button
            slot="actions"
            look="primary"
            @click=${this.onRollback}
						label=${this.localize.term("actions_rollback")}
						?disabled=${!this._selectedVersion}></uui-button>
        </umb-footer-layout>
      </umb-body-layout>
    `;
  }
};
x = /* @__PURE__ */ new WeakMap();
Y = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakMap();
q = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakSet();
z = function() {
  const e = b(this, q) ?? b(this, U) ?? null;
  this._selectedCulture = this._isInvariant ? null : e;
};
F = async function() {
  var n, o, l;
  if (!((n = this.currentDocument) != null && n.unique))
    throw new Error("Document unique is not set");
  const { data: e } = await b(this, x).requestVersionsByDocumentId(
    (o = this.currentDocument) == null ? void 0 : o.unique,
    this._selectedCulture ?? void 0
  );
  if (!e) return;
  const t = [], i = [...new Set(e == null ? void 0 : e.items.map((a) => a.user.id))], { data: r } = await b(this, Y).requestItems(i);
  e == null || e.items.forEach((a) => {
    var p;
    a.isCurrentDraftVersion || t.push({
      date: a.versionDate,
      user: ((p = r == null ? void 0 : r.find((m) => m.unique === a.user.id)) == null ? void 0 : p.name) || this.localize.term("general_unknownUser"),
      isCurrentlyPublishedVersion: a.isCurrentPublishedVersion,
      id: a.id,
      preventCleanup: a.preventCleanup
    });
  }), this._versions = t;
  const s = (l = t.find((a) => a.isCurrentlyPublishedVersion)) == null ? void 0 : l.id;
  s && d(this, c, j).call(this, s);
};
j = async function(e) {
  var r;
  const t = this._versions.find((s) => s.id === e);
  if (!t) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  const { data: i } = await b(this, x).requestVersionById(e);
  if (!i) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  this._selectedVersion = {
    date: t.date,
    user: t.user,
    name: ((r = i.variants.find((s) => s.culture === this._selectedCulture)) == null ? void 0 : r.name) || i.variants[0].name,
    id: i.id,
    properties: i.values.filter((s) => s.culture === this._selectedCulture || !s.culture).map((s) => ({
      alias: s.alias,
      value: s.value
    }))
  }, await d(this, c, de).call(this);
};
ae = function(e) {
  d(this, c, j).call(this, e);
};
ue = function(e, t, i) {
  e.preventDefault(), e.stopImmediatePropagation(), b(this, x).setPreventCleanup(t, i);
  const r = this._versions.find((s) => s.id === t);
  r && (r.preventCleanup = i, this.requestUpdate("_versions"));
};
ce = function(e) {
  const t = e.target.value;
  this._selectedCulture = t.toString(), d(this, c, F).call(this);
};
A = function(e) {
  return e.replace(/^['"]|['"]$/g, "");
};
de = async function() {
  var s, n, o;
  if (!this._selectedVersion) return;
  const e = (s = this.currentDocument) == null ? void 0 : s.values.filter(
    (l) => l.culture === this._selectedCulture || !l.culture
  );
  if (!e)
    throw new Error("Current property values are not set");
  const t = (o = (n = this.currentDocument) == null ? void 0 : n.variants.find((l) => l.culture === this._selectedCulture)) == null ? void 0 : o.name;
  if (!t)
    throw new Error("Current name is not set");
  const i = [], r = oe(t, this._selectedVersion.name);
  i.push({ alias: "name", diff: r }), this._selectedVersion.properties.forEach((l) => {
    const a = e.find((I) => I.alias === l.alias);
    if (!a) return;
    const p = d(this, c, A).call(this, JSON.stringify(a.value)), m = d(this, c, A).call(this, JSON.stringify(l.value)), M = oe(p, m);
    i.push({ alias: l.alias, diff: M });
  }), this._diffs = [...i];
};
h.styles = [
  Ve,
  H`
      :host {
        color: var(--uui-color-text);
      }

      #language-box {
        margin-bottom: var(--uui-size-space-2);
      }

      #language-select {
        width: 100%;
      }

      uui-table {
				--uui-table-cell-padding: var(--uui-size-space-1) var(--uui-size-space-4);
        margin-top: var(--uui-size-space-5);
      }
      uui-table-head-cell:first-child {
        border-top-left-radius: var(--uui-border-radius);
      }
      uui-table-head-cell:last-child {
        border-top-right-radius: var(--uui-border-radius);
      }
      uui-table-head-cell {
        background-color: var(--uui-color-surface-alt);
      }
      uui-table-head-cell:last-child,
      uui-table-cell:last-child {
        border-right: 1px solid var(--uui-color-border);
      }
      uui-table-head-cell,
      uui-table-cell {
        border-top: 1px solid var(--uui-color-border);
        border-left: 1px solid var(--uui-color-border);
      }
      uui-table-row:last-child uui-table-cell {
        border-bottom: 1px solid var(--uui-color-border);
      }
      uui-table-row:last-child uui-table-cell:last-child {
        border-bottom-right-radius: var(--uui-border-radius);
      }
      uui-table-row:last-child uui-table-cell:first-child {
        border-bottom-left-radius: var(--uui-border-radius);
      }

      .diff-added,
      ins {
        background-color: #00c43e63;
      }
      .diff-removed,
      del {
        background-color: #ff35356a;
      }
      .rollback-item {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--uui-size-space-5);
      }
      .rollback-item::after {
        content: "";
        position: absolute;
        inset: 2px;
        display: block;
        border: 2px solid transparent;
        pointer-events: none;
      }
      .rollback-item.active::after,
      .rollback-item:has(:hover)::after,
      .rollback-item:has(:focus-visible)::after {
        border-color: var(--uui-color-selected);
      }
      .rollback-item:not(.active):has(:hover)::after,
      .rollback-item:not(.active):has(:focus-visible)::after {
        opacity: 0.5;
      }
      .rollback-item span {
        display: block;
        margin: 0;
      }

      .rollback-item .rollback-item-date {
        margin-bottom: 0.1em;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .rollback-item-version-button {
        border: none;
        padding: 0;
        text-align: left;
        background-color: transparent;

        &:focus-visible {
          outline: none; // Visual focus state handled via parent .rollback-item
        }

        &::after {
          content: "";
          position: absolute;
          inset: 0;
          display: block;
          cursor: pointer;
        }
      }

      .rollback-item uui-button {
        white-space: nowrap;
      }

      #main {
        display: flex;
        gap: var(--uui-size-space-5);
        width: 100%;
        height: 100%;
      }

      #versions-box {
        --uui-box-default-padding: 0;
      }

      #box-left {
        max-width: 500px;
        flex: 1;
        overflow: auto;
        height: 100%;
      }

      #box-right {
        flex: 1;
        overflow: auto;
        height: 100%;
      }
    `
];
C([
  k()
], h.prototype, "_versions", 2);
C([
  k()
], h.prototype, "_selectedVersion", 2);
C([
  k()
], h.prototype, "_selectedCulture", 2);
C([
  k()
], h.prototype, "_isInvariant", 2);
C([
  k()
], h.prototype, "_availableVariants", 2);
C([
  k()
], h.prototype, "_diffs", 2);
h = C([
  J("umb-rollback-modal")
], h);
const Be = [
  ...h.styles,
  // Importing the base styles from UmbRollbackModalElement
  H`
    .preview-view {
      #main {
        display: grid;
        place-content: start;
        grid-template-columns: 1fr;
        gap: var(--uui-size-space-5);
        height: 100%;
        container-type: inline-size;
      }

      #box-left {
        max-height: 300px;
        max-width: 100%;
      }

      #box-right {
        width: 100cqw;
      }
    }

    .rp-wrapper {
      display: grid;
      grid-template: "current selected" / 1fr 1fr;
      gap: var(--uui-size-space-5);
    }

    .rp-container {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto;
      overflow: hidden;
      container-type: inline-size;

      .uui-h4 {
        margin: 0;
      }

      .uui-text {
        margin-top: 0.3rem;
      }

      &.current {
        grid-area: current;
      }

      &.selected {
        grid-area: selected;
      }
    }
  `
];
var Le = Object.defineProperty, Ae = Object.getOwnPropertyDescriptor, O = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Ae(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Le(t, i, s), s;
};
const He = {
  alias: "desktop",
  label: "Desktop",
  demensions: {
    width: 1920,
    height: 1080
  }
};
let V = class extends ke {
  constructor() {
    super(...arguments), this.src = "", this._device = He;
  }
  connectedCallback() {
    super.connectedCallback(), this.src || console.error("No src provided for rollback previewer iframe"), new ResizeObserver(() => {
      this.updateIframeDevice();
    }).observe(this);
  }
  updateIframeDevice() {
    let e = this.clientWidth / this._device.demensions.width;
    e > 1 && (e = 1), this.style.setProperty("--rp-device-width", `${this._device.demensions.width}px`), this.style.setProperty("--rp-device-height", `${this._device.demensions.height}px`), this.style.setProperty("--rp-iframe-scale", `${e}`), this.style.setProperty("--rp-height", `${this._device.demensions.height * e}px`);
  }
  resetScrollPosition() {
    this.setScrollPosition(0, 0);
  }
  setScrollPosition(e = 0, t = 0) {
    var i, r;
    (r = (i = this.iframe) == null ? void 0 : i.contentWindow) == null || r.scrollTo({
      top: e,
      left: t,
      behavior: "instant"
    });
  }
  // This is a LitElement specific method that is called when the element is first rendered
  firstUpdated() {
    this.updateIframeDevice();
  }
  render() {
    return this.src ? u`
      <div id="wrapper">
          <iframe src=${this.src}></iframe>
      </div>
    ` : null;
  }
};
V.styles = [
  H`
      :host {
        display: block;
        height: var(--rp-height, auto);
        width: 100cqw;
      }

      #wrapper {
        width: var(--rp-device-width, 100%);
        height: var(--rp-device-height, 600px);
        transform: scale(var(--rp-iframe-scale, 1));
        transform-origin: 0 0;
        overflow: hidden;
        position: relative;
      }

      iframe {
        border: none;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    `
];
O([
  we({ type: String })
], V.prototype, "src", 2);
O([
  k()
], V.prototype, "_device", 2);
O([
  X("iframe")
], V.prototype, "iframe", 2);
V = O([
  J("rp-iframe")
], V);
var Je = Object.defineProperty, Xe = Object.getOwnPropertyDescriptor, he = (e) => {
  throw TypeError(e);
}, Q = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Xe(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Je(t, i, s), s;
}, K = (e, t, i) => t.has(e) || he("Cannot " + i), _ = (e, t, i) => (K(e, t, "read from private field"), i ? i.call(e) : t.get(e)), B = (e, t, i) => t.has(e) ? he("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), pe = (e, t, i, r) => (K(e, t, "write to private field"), t.set(e, i), i), P = (e, t, i) => (K(e, t, "access private method"), i), v, D, w, fe, ve, Z, be;
let E = class extends h {
  constructor() {
    super(), B(this, w), B(this, v, !1), B(this, D, ""), P(this, w, fe).call(this);
  }
  // This is a LitElement specific method that is called when the element is first rendered
  updated() {
    setTimeout(() => {
      P(this, w, Z).call(this);
    }, 300);
  }
  renderSelectedVersionVisualPreview() {
    var e, t;
    return this._selectedVersion ? u`
      <uui-box id="box-right">
        <div class="rp-wrapper">
          <div class="rp-container current">
            <div>
              <h4 class="uui-h4">Current version</h4>
            </div>
            <rp-iframe
              id="rollbackPreviewerLeft"
              src="${_(this, D)}/${(e = this.currentDocument) == null ? void 0 : e.unique}?culture=${this._selectedCulture}"
            >
            </rp-iframe>
          </div>
          <div class="rp-container selected">
            <div>
              <h4 class="uui-h4">Selected version</h4>
              <p class="uui-text">${this.currentVersionHeader}</p>
            </div>
            <rp-iframe
              id="rollbackPreviewerRight"
              src="${_(this, D)}?cid=${(t = this.currentDocument) == null ? void 0 : t.unique}&vid=${this._selectedVersion.id}&culture=${this._selectedCulture}"
            ></rp-iframe>
          </div>
        </div>
      </uui-box>
    ` : u`
        <uui-box
          style="display: flex; align-items: center; justify-content: center;"
          >No selected version</uui-box
        >
      `;
  }
  render() {
    return u`
      <umb-body-layout
        headline="Visual Rollback Preview"
        class=${_(this, v) ? "json-view" : "preview-view"}
      >
        <uui-button
          slot="action-menu"
          look="secondary"
          @click=${P(this, w, ve)}
          style="margin-right:24px"
          label=${_(this, v) ? "Visual difference" : "JSON difference"}
        >
          <uui-icon name="icon-repeat" style="margin-right:4px"></uui-icon>
          ${_(this, v) ? "Visual difference" : "JSON difference"}</uui-button
        >

        <div id="main">
          <div id="box-left">
            ${this._availableVariants.length ? u`
                  <uui-box
                    id="language-box"
                    headline=${this.localize.term("general_language")}
                  >
                    ${this.renderCultureSelect()}
                  </uui-box>
                ` : L}
            ${this.renderVersions()}
          </div>
          <div id="box-right">
            ${_(this, v) ? u` ${this.renderSelectedVersion()} ` : u` ${this.renderSelectedVersionVisualPreview()} `}
          </div>
        </div>
        <umb-footer-layout slot="footer">
          <uui-button
            slot="actions"
            look="secondary"
            @click=${this.onCancel}
            label=${this.localize.term("general_cancel")}
          ></uui-button>
          <uui-button
            slot="actions"
            look="primary"
            @click=${this.onRollback}
            label=${this.localize.term("actions_rollback")}
            ?disabled=${!this._selectedVersion}
          ></uui-button>
        </umb-footer-layout>
      </umb-body-layout>
    `;
  }
};
v = /* @__PURE__ */ new WeakMap();
D = /* @__PURE__ */ new WeakMap();
w = /* @__PURE__ */ new WeakSet();
fe = async function() {
  const e = await this.getContext(Oe);
  pe(this, D, e.getServerUrl());
};
ve = async function() {
  pe(this, v, !_(this, v)), this.requestUpdate(), _(this, v) || (await this.updateComplete, setTimeout(() => {
    P(this, w, Z).call(this);
  }, 300));
};
Z = function() {
  if (!this.rollbackPreviewerLeft || !this.rollbackPreviewerRight) return;
  const e = [this.rollbackPreviewerLeft, this.rollbackPreviewerRight];
  e.forEach((i) => {
    i !== null && (i.onload = () => {
      i.resetScrollPosition();
    });
  });
  const t = (i) => {
    const r = i.currentTarget, s = r == null ? void 0 : r.frameElement, n = e.filter(
      (o) => o.iframe !== s
    ).map((o) => o.iframe);
    s && n.forEach((o) => {
      var l;
      o && ((l = o.contentWindow) == null || l.removeEventListener(
        "scroll",
        t
      ), P(this, w, be).call(this, s, o), window.requestAnimationFrame(() => {
        var a;
        (a = o == null ? void 0 : o.contentWindow) == null || a.addEventListener(
          "scroll",
          t
        );
      }));
    });
  };
  e.forEach((i) => {
    var r, s;
    (s = (r = i.iframe) == null ? void 0 : r.contentWindow) == null || s.addEventListener("scroll", t);
  });
};
be = function(e, t) {
  var i, r, s;
  if (!(!e || !t))
    try {
      const n = e.contentDocument || ((i = e.contentWindow) == null ? void 0 : i.document), o = t.contentDocument || ((r = t.contentWindow) == null ? void 0 : r.document);
      if (!n || !o) return;
      const l = n.documentElement || n.body, a = o.documentElement || o.body, p = l.scrollHeight - l.clientHeight, m = p > 0 ? l.scrollTop / p : 0, M = a.scrollHeight - a.clientHeight, I = m * M, ee = l.scrollWidth - l.clientWidth, me = ee > 0 ? l.scrollLeft / ee : 0, _e = a.scrollWidth - a.clientWidth, ye = me * _e;
      (s = t.contentWindow) == null || s.scrollTo({
        top: I,
        left: ye,
        behavior: "instant"
      });
    } catch (n) {
      console.error("Error syncing scroll:", n);
    }
};
E.styles = Be;
Q([
  X("#rollbackPreviewerLeft")
], E.prototype, "rollbackPreviewerLeft", 2);
Q([
  X("#rollbackPreviewerRight")
], E.prototype, "rollbackPreviewerRight", 2);
E = Q([
  J("rp-rollback-modal")
], E);
const ct = E;
export {
  E as RpRollbackModalElement,
  ct as default
};
//# sourceMappingURL=rollback-previewer-modal.element-CQM-GdKg.js.map
