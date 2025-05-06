var Y = (e) => {
  throw TypeError(e);
};
var F = (e, t, i) => t.has(e) || Y("Cannot " + i);
var p = (e, t, i) => (F(e, t, "read from private field"), i ? i.call(e) : t.get(e)), q = (e, t, i) => t.has(e) ? Y("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), R = (e, t, i, s) => (F(e, t, "write to private field"), s ? s.call(e, i) : t.set(e, i), i);
import { html as l, repeat as Q, unsafeHTML as he, nothing as M, css as B, state as g, customElement as W, property as pe, LitElement as ve } from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_ENTITY_TYPE as j, UmbDocumentDetailRepository as fe } from "@umbraco-cms/backoffice/document";
import { DocumentVersionService as E } from "@umbraco-cms/backoffice/external/backend-api";
import { tryExecuteAndNotify as D } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as be } from "@umbraco-cms/backoffice/class-api";
import { diffWords as K } from "@umbraco-cms/backoffice/external/diff";
import { UmbModalBaseElement as me } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles as _e } from "@umbraco-cms/backoffice/style";
import { UmbUserItemRepository as ye } from "@umbraco-cms/backoffice/user";
import { UMB_PROPERTY_DATASET_CONTEXT as ge } from "@umbraco-cms/backoffice/property";
import { UMB_APP_LANGUAGE_CONTEXT as we, UmbLanguageItemRepository as Ce } from "@umbraco-cms/backoffice/language";
import { UMB_ENTITY_CONTEXT as $e } from "@umbraco-cms/backoffice/entity";
import { UmbVariantId as ke } from "@umbraco-cms/backoffice/variant";
import { UMB_ACTION_EVENT_CONTEXT as Ve } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as xe, UmbEntityUpdatedEvent as Ee } from "@umbraco-cms/backoffice/entity-action";
import { UMB_APP_CONTEXT as De } from "@umbraco-cms/backoffice/app";
var b;
class Pe {
  /**
   * Creates an instance of UmbRollbackServerDataSource.
   * @param {UmbControllerHost} host - The controller host for this controller to be appended to
   * @memberof UmbRollbackServerDataSource
   */
  constructor(t) {
    q(this, b);
    R(this, b, t);
  }
  /**
   * Get a list of versions for a document
   * @param id
   * @param culture
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionsByDocumentId(t, i) {
    return D(p(this, b), E.getDocumentVersion({ documentId: t, culture: i }));
  }
  /**
   * Get a specific version by id
   * @param versionId
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionById(t) {
    return D(p(this, b), E.getDocumentVersionById({ id: t }));
  }
  setPreventCleanup(t, i) {
    return D(
      p(this, b),
      E.putDocumentVersionByIdPreventCleanup({ id: t, preventCleanup: i })
    );
  }
  rollback(t, i) {
    return D(
      p(this, b),
      E.postDocumentVersionByIdRollback({ id: t, culture: i })
    );
  }
}
b = new WeakMap();
var m;
class Ie extends be {
  constructor(i) {
    super(i);
    q(this, m);
    R(this, m, new Pe(this));
  }
  async requestVersionsByDocumentId(i, s) {
    return await p(this, m).getVersionsByDocumentId(i, s);
  }
  async requestVersionById(i) {
    return await p(this, m).getVersionById(i);
  }
  async setPreventCleanup(i, s) {
    return await p(this, m).setPreventCleanup(i, s);
  }
  async rollback(i, s) {
    return await p(this, m).rollback(i, s);
  }
}
m = new WeakMap();
var Se = Object.defineProperty, ze = Object.getOwnPropertyDescriptor, te = (e) => {
  throw TypeError(e);
}, w = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ze(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Se(t, i, r), r;
}, A = (e, t, i) => t.has(e) || te("Cannot " + i), v = (e, t, i) => (A(e, t, "read from private field"), i ? i.call(e) : t.get(e)), $ = (e, t, i) => t.has(e) ? te("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Z = (e, t, i, s) => (A(e, t, "write to private field"), t.set(e, i), i), d = (e, t, i) => (A(e, t, "access private method"), i), k, H, P, z, U, c, I, J, X, ie, re, se, N, ae;
let h = class extends me {
  constructor() {
    super(), $(this, c), this._versions = [], this._selectedCulture = null, this._isInvariant = !0, this._availableVariants = [], this._diffs = [], $(this, k, new Ie(this)), $(this, H, new ye(this)), $(this, P, {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit"
    }), $(this, z), $(this, U), this.consumeContext(ge, (e) => {
      Z(this, U, e.getVariantId().culture ?? void 0), d(this, c, I).call(this);
    }), this.consumeContext(we, (e) => {
      Z(this, z, e.getAppCulture()), d(this, c, I).call(this);
    }), this.consumeContext($e, async (e) => {
      var o;
      if (e.getEntityType() !== j)
        throw new Error(`Entity type is not ${j}`);
      const t = e == null ? void 0 : e.getUnique();
      if (!t)
        throw new Error("Document unique is not set");
      const { data: i } = await new fe(this).requestByUnique(t);
      if (!i) return;
      this.currentDocument = i;
      const s = ((o = this.currentDocument) == null ? void 0 : o.variants) ?? [];
      this._isInvariant = s.length === 1 && new ke(s[0].culture).isInvariant(), d(this, c, I).call(this);
      const r = s.map((n) => n.culture).filter((n) => n !== null), { data: a } = await new Ce(this).requestItems(r);
      a ? this._availableVariants = a.map((n) => ({
        name: n.name,
        value: n.unique,
        selected: n.unique === this._selectedCulture
      })) : this._availableVariants = [], d(this, c, J).call(this);
    });
  }
  // Change Note - Converted to public method
  async onRollback() {
    var u, _, C;
    if (!this._selectedVersion) return;
    const e = this._selectedVersion.id, t = this._selectedCulture ?? void 0, { error: i } = await v(this, k).rollback(e, t);
    if (i) return;
    const s = (u = this.currentDocument) == null ? void 0 : u.unique, r = (_ = this.currentDocument) == null ? void 0 : _.entityType;
    if (!s || !r)
      throw new Error("Document unique or entity type is not set");
    const a = await this.getContext(Ve), o = new xe({ unique: s, entityType: r });
    a.dispatchEvent(o);
    const n = new Ee({ unique: s, entityType: r });
    a.dispatchEvent(n), this.value = {}, (C = this.modalContext) == null || C.submit();
  }
  // Change Note - Converted to public method
  onCancel() {
    var e;
    (e = this.modalContext) == null || e.reject();
  }
  // Change Note - Converted to public method
  renderCultureSelect() {
    return l`
      <uui-select
        id="language-select"
        @change=${d(this, c, se)}
				.options=${this._availableVariants}></uui-select>
    `;
  }
  // Change Note - Converted to public method
  renderVersions() {
    return this._versions.length ? l` <uui-box id="versions-box" headline=${this.localize.term("rollback_versions")} headlineVariant="h4">
      ${Q(
      this._versions,
      (e) => e.id,
      (e) => {
        var t;
        return l`
            <div
              class="rollback-item ${((t = this._selectedVersion) == null ? void 0 : t.id) === e.id ? "active" : ""}"
            >
              <button
                class="rollback-item-version-button uui-text"
                @click=${() => d(this, c, ie).call(this, e.id)}
                @keydown=${() => {
        }}
              >
                <span class="rollback-item-date">
                  <umb-localize-date
                    date="${e.date}"
                    .options=${v(this, P)}
                  ></umb-localize-date>
                </span>
                <span>${e.user}</span>
                <span
                  >${e.isCurrentlyPublishedVersion ? this.localize.term("rollback_currentPublishedVersion") : ""}</span
                >
              </button>
              <uui-button
                look="secondary"
                @click=${(i) => d(this, c, re).call(this, i, e.id, !e.preventCleanup)}
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
    >` : l`<uui-box headline=${this.localize.term("rollback_versions")}>No versions available</uui-box>`;
  }
  // Change Note - Converted to public method
  renderSelectedVersion() {
    return this._selectedVersion ? l`
      <uui-box headline=${this.currentVersionHeader} id="box-right">
				${he(this.localize.term("rollback_diffHelp"))}
        <uui-table>
          <uui-table-column style="width: 0"></uui-table-column>
          <uui-table-column></uui-table-column>

          <uui-table-head>
						<uui-table-head-cell>${this.localize.term("general_alias")}</uui-table-head-cell>
						<uui-table-head-cell>${this.localize.term("general_value")}</uui-table-head-cell>
          </uui-table-head>
          ${Q(
      this._diffs,
      (e) => e.alias,
      (e) => {
        const t = this._diffs.find((i) => (i == null ? void 0 : i.alias) === e.alias);
        return l`
                <uui-table-row>
                  <uui-table-cell>${e.alias}</uui-table-cell>
                  <uui-table-cell>
                    ${t ? t.diff.map(
          (i) => i.added ? l`<span class="diff-added">${i.value}</span>` : i.removed ? l`<span class="diff-removed">${i.value}</span>` : i.value
        ) : M}
                  </uui-table-cell>
                </uui-table-row>
              `;
      }
    )}
        </uui-table>
      </uui-box>
    ` : l`
				<uui-box id="box-right" style="display: flex; align-items: center; justify-content: center;"
          >No selected version</uui-box
        >
      `;
  }
  get currentVersionHeader() {
    var e, t;
    return this.localize.date(((e = this._selectedVersion) == null ? void 0 : e.date) ?? /* @__PURE__ */ new Date(), v(this, P)) + " - " + ((t = this._selectedVersion) == null ? void 0 : t.user);
  }
  render() {
    return l`
      <umb-body-layout headline="Rollback">
        <div id="main">
          <div id="box-left">
            ${this._availableVariants.length ? l`
									<uui-box id="language-box" headline=${this.localize.term("general_language")}>
                    ${this.renderCultureSelect()}
                  </uui-box>
                ` : M}
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
k = /* @__PURE__ */ new WeakMap();
H = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakSet();
I = function() {
  const e = v(this, U) ?? v(this, z) ?? null;
  this._selectedCulture = this._isInvariant ? null : e;
};
J = async function() {
  var a, o, n;
  if (!((a = this.currentDocument) != null && a.unique))
    throw new Error("Document unique is not set");
  const { data: e } = await v(this, k).requestVersionsByDocumentId(
    (o = this.currentDocument) == null ? void 0 : o.unique,
    this._selectedCulture ?? void 0
  );
  if (!e) return;
  const t = [], i = [...new Set(e == null ? void 0 : e.items.map((u) => u.user.id))], { data: s } = await v(this, H).requestItems(i);
  e == null || e.items.forEach((u) => {
    var _;
    u.isCurrentDraftVersion || t.push({
      date: u.versionDate,
      user: ((_ = s == null ? void 0 : s.find((C) => C.unique === u.user.id)) == null ? void 0 : _.name) || this.localize.term("general_unknownUser"),
      isCurrentlyPublishedVersion: u.isCurrentPublishedVersion,
      id: u.id,
      preventCleanup: u.preventCleanup
    });
  }), this._versions = t;
  const r = (n = t.find((u) => u.isCurrentlyPublishedVersion)) == null ? void 0 : n.id;
  r && d(this, c, X).call(this, r);
};
X = async function(e) {
  var s;
  const t = this._versions.find((r) => r.id === e);
  if (!t) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  const { data: i } = await v(this, k).requestVersionById(e);
  if (!i) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  this._selectedVersion = {
    date: t.date,
    user: t.user,
    name: ((s = i.variants.find((r) => r.culture === this._selectedCulture)) == null ? void 0 : s.name) || i.variants[0].name,
    id: i.id,
    properties: i.values.filter((r) => r.culture === this._selectedCulture || !r.culture).map((r) => ({
      alias: r.alias,
      value: r.value
    }))
  }, await d(this, c, ae).call(this);
};
ie = function(e) {
  d(this, c, X).call(this, e);
};
re = function(e, t, i) {
  e.preventDefault(), e.stopImmediatePropagation(), v(this, k).setPreventCleanup(t, i);
  const s = this._versions.find((r) => r.id === t);
  s && (s.preventCleanup = i, this.requestUpdate("_versions"));
};
se = function(e) {
  const t = e.target.value;
  this._selectedCulture = t.toString(), d(this, c, J).call(this);
};
N = function(e) {
  return e.replace(/^['"]|['"]$/g, "");
};
ae = async function() {
  var r, a, o;
  if (!this._selectedVersion) return;
  const e = (r = this.currentDocument) == null ? void 0 : r.values.filter(
    (n) => n.culture === this._selectedCulture || !n.culture
  );
  if (!e)
    throw new Error("Current property values are not set");
  const t = (o = (a = this.currentDocument) == null ? void 0 : a.variants.find((n) => n.culture === this._selectedCulture)) == null ? void 0 : o.name;
  if (!t)
    throw new Error("Current name is not set");
  const i = [], s = K(t, this._selectedVersion.name);
  i.push({ alias: "name", diff: s }), this._selectedVersion.properties.forEach((n) => {
    const u = e.find((de) => de.alias === n.alias);
    if (!u) return;
    const _ = d(this, c, N).call(this, JSON.stringify(u.value)), C = d(this, c, N).call(this, JSON.stringify(n.value)), ce = K(_, C);
    i.push({ alias: n.alias, diff: ce });
  }), this._diffs = [...i];
};
h.styles = [
  _e,
  B`
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
w([
  g()
], h.prototype, "_versions", 2);
w([
  g()
], h.prototype, "_selectedVersion", 2);
w([
  g()
], h.prototype, "_selectedCulture", 2);
w([
  g()
], h.prototype, "_isInvariant", 2);
w([
  g()
], h.prototype, "_availableVariants", 2);
w([
  g()
], h.prototype, "_diffs", 2);
h = w([
  W("umb-rollback-modal")
], h);
const Ue = [
  ...h.styles,
  // Importing the base styles from UmbRollbackModalElement
  B`
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
var Te = Object.defineProperty, qe = Object.getOwnPropertyDescriptor, G = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? qe(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Te(t, i, r), r;
};
const Re = {
  alias: "desktop",
  label: "Desktop",
  demensions: {
    width: 1920,
    height: 1080
  }
};
let x = class extends ve {
  constructor() {
    super(...arguments), this.src = "", this._device = Re;
  }
  connectedCallback() {
    super.connectedCallback(), console.log("connected", this.src), this.src || console.error("No src provided for rollback previewer iframe"), new ResizeObserver(() => {
      this.updateIframeDevice();
    }).observe(this);
  }
  updateIframeDevice() {
    let e = this.clientWidth / this._device.demensions.width;
    e > 1 && (e = 1), this.style.setProperty("--rp-device-width", `${this._device.demensions.width}px`), this.style.setProperty("--rp-device-height", `${this._device.demensions.height}px`), this.style.setProperty("--rp-iframe-scale", `${e}`), this.style.setProperty("--rp-height", `${this._device.demensions.height * e}px`);
  }
  // This is a LitElement specific method that is called when the element is first rendered
  firstUpdated() {
    this.updateIframeDevice();
  }
  render() {
    return this.src ? l`
      <div id="wrapper">
          <iframe src=${this.src}></iframe>
      </div>
    ` : null;
  }
};
x.styles = [
  B`
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
G([
  pe({ type: String })
], x.prototype, "src", 2);
G([
  g()
], x.prototype, "_device", 2);
x = G([
  W("rp-iframe")
], x);
var Oe = Object.getOwnPropertyDescriptor, oe = (e) => {
  throw TypeError(e);
}, Me = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Oe(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = o(r) || r);
  return r;
}, L = (e, t, i) => t.has(e) || oe("Cannot " + i), y = (e, t, i) => (L(e, t, "read from private field"), i ? i.call(e) : t.get(e)), O = (e, t, i) => t.has(e) ? oe("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ne = (e, t, i, s) => (L(e, t, "write to private field"), t.set(e, i), i), ee = (e, t, i) => (L(e, t, "access private method"), i), f, V, S, le, ue;
let T = class extends h {
  constructor() {
    super(), O(this, S), O(this, f, !1), O(this, V, ""), ee(this, S, le).call(this);
  }
  renderSelectedVersionVisualPreview() {
    var e, t;
    return this._selectedVersion ? l`
      <uui-box id="box-right">
        <div class="rp-wrapper">
          <div class="rp-container current">
            <div>
              <h4 class="uui-h4">Current version</h4>
            </div>
            <rp-iframe src="${y(this, V)}/${(e = this.currentDocument) == null ? void 0 : e.unique}?culture=${this._selectedCulture}">
            </rp-iframe>
          </div>
          <div class="rp-container selected">
            <div>
              <h4 class="uui-h4">Selected version</h4>
              <p class="uui-text">${this.currentVersionHeader}</p>
            </div>
            <rp-iframe
              src="${y(this, V)}?cid=${(t = this.currentDocument) == null ? void 0 : t.unique}&vid=${this._selectedVersion.id}&culture=${this._selectedCulture}"
            ></rp-iframe>
          </div>
        </div>
      </uui-box>
    ` : l`
        <uui-box
          style="display: flex; align-items: center; justify-content: center;"
          >No selected version</uui-box
        >
      `;
  }
  render() {
    return l`
      <umb-body-layout
        headline="Visual Rollback Preview"
        class=${y(this, f) ? "json-view" : "preview-view"}
      >
        <uui-button
          slot="action-menu"
          look="secondary"
          @click=${ee(this, S, ue)}
          style="margin-right:24px"
          label=${y(this, f) ? "Visual difference" : "JSON difference"}
        >
          <uui-icon name="icon-repeat" style="margin-right:4px"></uui-icon>
          ${y(this, f) ? "Visual difference" : "JSON difference"}</uui-button
        >

        <div id="main">
          <div id="box-left">
            ${this._availableVariants.length ? l`
                  <uui-box
                    id="language-box"
                    headline=${this.localize.term("general_language")}
                  >
                    ${this.renderCultureSelect()}
                  </uui-box>
                ` : M}
            ${this.renderVersions()}
          </div>
          <div id="box-right">
            ${y(this, f) ? l` ${this.renderSelectedVersion()} ` : l` ${this.renderSelectedVersionVisualPreview()} `}
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
f = /* @__PURE__ */ new WeakMap();
V = /* @__PURE__ */ new WeakMap();
S = /* @__PURE__ */ new WeakSet();
le = async function() {
  const e = await this.getContext(De);
  ne(this, V, e.getServerUrl());
};
ue = function() {
  ne(this, f, !y(this, f)), this.requestUpdate();
};
T.styles = Ue;
T = Me([
  W("rp-rollback-modal")
], T);
const it = T;
export {
  T as RpRollbackModalElement,
  it as default
};
//# sourceMappingURL=rollback-previewer-modal.element-J8aaGtSp.js.map
