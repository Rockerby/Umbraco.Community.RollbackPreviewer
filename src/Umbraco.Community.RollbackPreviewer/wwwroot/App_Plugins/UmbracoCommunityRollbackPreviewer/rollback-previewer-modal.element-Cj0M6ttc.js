var re = (e) => {
  throw TypeError(e);
};
var se = (e, t, i) => t.has(e) || re("Cannot " + i);
var v = (e, t, i) => (se(e, t, "read from private field"), i ? i.call(e) : t.get(e)), B = (e, t, i) => t.has(e) ? re("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), N = (e, t, i, r) => (se(e, t, "write to private field"), r ? r.call(e, i) : t.set(e, i), i);
import { html as u, repeat as oe, unsafeHTML as we, nothing as A, css as F, state as $, customElement as G, property as Ce, query as X, LitElement as $e } from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_ENTITY_TYPE as ne, UmbDocumentDetailRepository as xe } from "@umbraco-cms/backoffice/document";
import { DocumentVersionService as T } from "@umbraco-cms/backoffice/external/backend-api";
import { tryExecute as R } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as ke } from "@umbraco-cms/backoffice/class-api";
import { diffWords as le } from "@umbraco-cms/backoffice/utils";
import { UmbModalBaseElement as Ve } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles as Ee } from "@umbraco-cms/backoffice/style";
import { UmbUserItemRepository as Pe } from "@umbraco-cms/backoffice/user";
import { UMB_PROPERTY_DATASET_CONTEXT as De } from "@umbraco-cms/backoffice/property";
import { UMB_APP_LANGUAGE_CONTEXT as Se, UmbLanguageItemRepository as Te } from "@umbraco-cms/backoffice/language";
import { UMB_ENTITY_CONTEXT as Re } from "@umbraco-cms/backoffice/entity";
import { UmbVariantId as Ue } from "@umbraco-cms/backoffice/variant";
import { UMB_ACTION_EVENT_CONTEXT as qe } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as ze, UmbEntityUpdatedEvent as Oe } from "@umbraco-cms/backoffice/entity-action";
import { c as Me } from "./client.gen-CSWNPGiu.js";
var g;
class We {
  /**
   * Creates an instance of UmbRollbackServerDataSource.
   * @param {UmbControllerHost} host - The controller host for this controller to be appended to
   * @memberof UmbRollbackServerDataSource
   */
  constructor(t) {
    B(this, g);
    N(this, g, t);
  }
  /**
   * Get a list of versions for a document
   * @param id
   * @param culture
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionsByDocumentId(t, i) {
    return R(v(this, g), T.getDocumentVersion({ query: { documentId: t, culture: i } }));
  }
  /**
   * Get a specific version by id
   * @param versionId
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionById(t) {
    return R(v(this, g), T.getDocumentVersionById({ path: { id: t } }));
  }
  setPreventCleanup(t, i) {
    return R(
      v(this, g),
      T.putDocumentVersionByIdPreventCleanup({
        path: { id: t },
        query: { preventCleanup: i }
      })
    );
  }
  rollback(t, i) {
    return R(
      v(this, g),
      T.postDocumentVersionByIdRollback({ path: { id: t }, query: { culture: i } })
    );
  }
}
g = new WeakMap();
var w;
class Ie extends ke {
  constructor(i) {
    super(i);
    B(this, w);
    N(this, w, new We(this));
  }
  async requestVersionsByDocumentId(i, r) {
    return await v(this, w).getVersionsByDocumentId(i, r);
  }
  async requestVersionById(i) {
    return await v(this, w).getVersionById(i);
  }
  async setPreventCleanup(i, r) {
    return await v(this, w).setPreventCleanup(i, r);
  }
  async rollback(i, r) {
    return await v(this, w).rollback(i, r);
  }
}
w = new WeakMap();
var Le = Object.defineProperty, Be = Object.getOwnPropertyDescriptor, ue = (e) => {
  throw TypeError(e);
}, x = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Be(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Le(t, i, s), s;
}, Y = (e, t, i) => t.has(e) || ue("Cannot " + i), m = (e, t, i) => (Y(e, t, "read from private field"), i ? i.call(e) : t.get(e)), k = (e, t, i) => t.has(e) ? ue("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ae = (e, t, i, r) => (Y(e, t, "write to private field"), t.set(e, i), i), h = (e, t, i) => (Y(e, t, "access private method"), i), E, j, q, O, M, c, z, Q, K, ce, de, he, H, pe;
let p = class extends Ve {
  constructor() {
    super(), k(this, c), this._versions = [], this._selectedCulture = null, this._isInvariant = !0, this._availableVariants = [], this._diffs = [], k(this, E, new Ie(this)), k(this, j, new Pe(this)), k(this, q, {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit"
    }), k(this, O), k(this, M), this.consumeContext(De, (e) => {
      ae(this, M, (e == null ? void 0 : e.getVariantId().culture) ?? void 0), h(this, c, z).call(this);
    }), this.consumeContext(Se, (e) => {
      ae(this, O, e == null ? void 0 : e.getAppCulture()), h(this, c, z).call(this);
    }), this.consumeContext(Re, async (e) => {
      var o;
      if (!e) return;
      if (e.getEntityType() !== ne)
        throw new Error(`Entity type is not ${ne}`);
      const t = e.getUnique();
      if (!t)
        throw new Error("Document unique is not set");
      const { data: i } = await new xe(this).requestByUnique(t);
      if (!i) return;
      this.currentDocument = i;
      const r = ((o = this.currentDocument) == null ? void 0 : o.variants) ?? [];
      this._isInvariant = r.length === 1 && new Ue(r[0].culture).isInvariant(), h(this, c, z).call(this);
      const s = r.map((l) => l.culture).filter((l) => l !== null), { data: n } = await new Te(this).requestItems(s);
      n ? this._availableVariants = n.map((l) => ({
        name: l.name,
        value: l.unique,
        selected: l.unique === this._selectedCulture
      })) : this._availableVariants = [], h(this, c, Q).call(this);
    });
  }
  async onRollback() {
    var a, f, _;
    if (!this._selectedVersion) return;
    const e = this._selectedVersion.id, t = this._selectedCulture ?? void 0, { error: i } = await m(this, E).rollback(e, t);
    if (i) return;
    const r = (a = this.currentDocument) == null ? void 0 : a.unique, s = (f = this.currentDocument) == null ? void 0 : f.entityType;
    if (!r || !s)
      throw new Error("Document unique or entity type is not set");
    const n = await this.getContext(qe);
    if (!n)
      throw new Error("Action event context not found");
    const o = new ze({ unique: r, entityType: s });
    n.dispatchEvent(o);
    const l = new Oe({ unique: r, entityType: s });
    n.dispatchEvent(l), this.value = {}, (_ = this.modalContext) == null || _.submit();
  }
  onCancel() {
    var e;
    (e = this.modalContext) == null || e.reject();
  }
  // Change Note - Converted to public method
  renderCultureSelect() {
    return u`
			<uui-select
				id="language-select"
				@change=${h(this, c, he)}
				.options=${this._availableVariants}></uui-select>
		`;
  }
  renderVersions() {
    return this._versions.length ? u` <uui-box id="versions-box" headline=${this.localize.term("rollback_versions")}>
			${oe(
      this._versions,
      (e) => e.id,
      (e) => {
        var t;
        return u`
						<div
							@click=${() => h(this, c, ce).call(this, e.id)}
							@keydown=${() => {
        }}
							class="rollback-item ${((t = this._selectedVersion) == null ? void 0 : t.id) === e.id ? "active" : ""}">
							<div>
								<p class="rollback-item-date">
									<umb-localize-date date="${e.date}" .options=${m(this, q)}></umb-localize-date>
								</p>
								<p>${e.user}</p>
								<p>${e.isCurrentlyPublishedVersion ? this.localize.term("rollback_currentPublishedVersion") : ""}</p>
							</div>
							<uui-button
								look="secondary"
								@click=${(i) => h(this, c, de).call(this, i, e.id, !e.preventCleanup)}
								label=${e.preventCleanup ? this.localize.term("contentTypeEditor_historyCleanupEnableCleanup") : this.localize.term("contentTypeEditor_historyCleanupPreventCleanup")}></uui-button>
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
				${we(this.localize.term("rollback_diffHelp"))}
				<uui-table>
					<uui-table-column style="width: 0"></uui-table-column>
					<uui-table-column></uui-table-column>

					<uui-table-head>
						<uui-table-head-cell>${this.localize.term("general_alias")}</uui-table-head-cell>
						<uui-table-head-cell>${this.localize.term("general_value")}</uui-table-head-cell>
					</uui-table-head>
					${oe(
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
        ) : A}
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
    return this.localize.date(((e = this._selectedVersion) == null ? void 0 : e.date) ?? /* @__PURE__ */ new Date(), m(this, q)) + " - " + ((t = this._selectedVersion) == null ? void 0 : t.user);
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
								` : A}
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
E = /* @__PURE__ */ new WeakMap();
j = /* @__PURE__ */ new WeakMap();
q = /* @__PURE__ */ new WeakMap();
O = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakSet();
z = function() {
  const e = m(this, M) ?? m(this, O) ?? null;
  this._selectedCulture = this._isInvariant ? null : e;
};
Q = async function() {
  var n, o, l;
  if (!((n = this.currentDocument) != null && n.unique))
    throw new Error("Document unique is not set");
  const { data: e } = await m(this, E).requestVersionsByDocumentId(
    (o = this.currentDocument) == null ? void 0 : o.unique,
    this._selectedCulture ?? void 0
  );
  if (!e) return;
  const t = [], i = [...new Set(e == null ? void 0 : e.items.map((a) => a.user.id))], { data: r } = await m(this, j).requestItems(i);
  e == null || e.items.forEach((a) => {
    var f;
    a.isCurrentDraftVersion || t.push({
      date: a.versionDate,
      user: ((f = r == null ? void 0 : r.find((_) => _.unique === a.user.id)) == null ? void 0 : f.name) || this.localize.term("general_unknownUser"),
      isCurrentlyPublishedVersion: a.isCurrentPublishedVersion,
      id: a.id,
      preventCleanup: a.preventCleanup
    });
  }), this._versions = t;
  const s = (l = t.find((a) => a.isCurrentlyPublishedVersion)) == null ? void 0 : l.id;
  s && h(this, c, K).call(this, s);
};
K = async function(e) {
  var r;
  const t = this._versions.find((s) => s.id === e);
  if (!t) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  const { data: i } = await m(this, E).requestVersionById(e);
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
  }, await h(this, c, pe).call(this);
};
ce = function(e) {
  h(this, c, K).call(this, e);
};
de = function(e, t, i) {
  e.preventDefault(), e.stopImmediatePropagation(), m(this, E).setPreventCleanup(t, i);
  const r = this._versions.find((s) => s.id === t);
  r && (r.preventCleanup = i, this.requestUpdate("_versions"));
};
he = function(e) {
  const t = e.target.value;
  this._selectedCulture = t.toString(), h(this, c, Q).call(this);
};
H = function(e) {
  return e.replace(/^['"]|['"]$/g, "");
};
pe = async function() {
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
  const i = [], r = le(t, this._selectedVersion.name);
  i.push({ alias: "name", diff: r }), this._selectedVersion.properties.forEach((l) => {
    const a = e.find((L) => L.alias === l.alias);
    if (!a) return;
    const f = h(this, c, H).call(this, JSON.stringify(a.value)), _ = h(this, c, H).call(this, JSON.stringify(l.value)), I = le(f, _);
    i.push({ alias: l.alias, diff: I });
  }), this._diffs = [...i];
};
p.styles = [
  Ee,
  F`
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
				cursor: pointer;
			}
			.rollback-item::after {
				content: '';
				position: absolute;
				inset: 2px;
				display: block;
				border: 2px solid transparent;
				pointer-events: none;
			}
			.rollback-item.active::after,
			.rollback-item:hover::after {
				border-color: var(--uui-color-selected);
			}
			.rollback-item:not(.active):hover::after {
				opacity: 0.5;
			}
			.rollback-item p {
				margin: 0;
				opacity: 0.5;
			}
			p.rollback-item-date {
				opacity: 1;
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
x([
  $()
], p.prototype, "_versions", 2);
x([
  $()
], p.prototype, "_selectedVersion", 2);
x([
  $()
], p.prototype, "_selectedCulture", 2);
x([
  $()
], p.prototype, "_isInvariant", 2);
x([
  $()
], p.prototype, "_availableVariants", 2);
x([
  $()
], p.prototype, "_diffs", 2);
p = x([
  G("umb-rollback-modal")
], p);
const Ne = [
  ...p.styles,
  // Importing the base styles from UmbRollbackModalElement
  F`
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

    .selected-version-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .align-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
  `
];
var Ae = Object.defineProperty, He = Object.getOwnPropertyDescriptor, W = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? He(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Ae(t, i, s), s;
};
const Je = {
  alias: "desktop",
  label: "Desktop",
  demensions: {
    width: 1920,
    height: 1080
  }
};
let P = class extends $e {
  constructor() {
    super(...arguments), this.src = "", this._device = Je;
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
P.styles = [
  F`
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

      #copy-url-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 1000;
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
W([
  Ce({ type: String })
], P.prototype, "src", 2);
W([
  $()
], P.prototype, "_device", 2);
W([
  X("iframe")
], P.prototype, "iframe", 2);
P = W([
  G("rp-iframe")
], P);
const Fe = (e) => ((e == null ? void 0 : e.client) ?? Me).get({
  security: [
    {
      scheme: "bearer",
      type: "http"
    }
  ],
  url: "/umbraco/rollbackpreviewer/api/v1/configuration",
  ...e
});
class Ge {
  /**
   * Fetches the configuration settings from the backend API
   * @returns Promise with configuration data
   */
  static async getConfiguration() {
    const { data: t, error: i } = await Fe();
    return i ? (console.error(i), null) : t !== void 0 ? t : null;
  }
}
var Xe = Object.defineProperty, Ye = Object.getOwnPropertyDescriptor, fe = (e) => {
  throw TypeError(e);
}, Z = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Ye(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Xe(t, i, s), s;
}, ee = (e, t, i) => t.has(e) || fe("Cannot " + i), d = (e, t, i) => (ee(e, t, "read from private field"), i ? i.call(e) : t.get(e)), U = (e, t, i) => t.has(e) ? fe("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), J = (e, t, i, r) => (ee(e, t, "write to private field"), t.set(e, i), i), S = (e, t, i) => (ee(e, t, "access private method"), i), b, V, y, C, ve, be, te, me;
let D = class extends p {
  constructor() {
    super(), U(this, C), U(this, b, !1), U(this, V, ""), U(this, y, null), S(this, C, ve).call(this);
  }
  async copyUrlToClipboard(e) {
    var n, o, l;
    const t = e.target;
    if (!this._selectedVersion) return;
    let i = this._selectedCulture || "", r = `${d(this, V)}/ucrbp?cid=${(n = this.currentDocument) == null ? void 0 : n.unique}&vid=${this._selectedVersion.id}&culture=${i}`;
    const s = (o = d(this, y)) != null && o.frontendPreviewAuthorisationSecret ? `${r}&secret=${encodeURIComponent((l = d(this, y)) == null ? void 0 : l.frontendPreviewAuthorisationSecret)}` : r;
    try {
      await navigator.clipboard.writeText(s), t.state = "success";
    } catch (a) {
      console.error("Failed to copy URL to clipboard:", a);
    }
  }
  // This is a LitElement specific method that is called when the element is first rendered
  updated() {
    setTimeout(() => {
      S(this, C, te).call(this);
    }, 300);
  }
  renderSelectedVersionVisualPreview() {
    var t, i, r, s, n;
    if (!this._selectedVersion)
      return u`
        <uui-box
          style="display: flex; align-items: center; justify-content: center;"
          >No selected version</uui-box
        >
      `;
    let e = u``;
    return (t = d(this, y)) != null && t.enableFrontendPreviewAuthorisation && (e = u`<uui-button
                @click=${this.copyUrlToClipboard}
                look="secondary"
                compact
                label="Copy shareable preview URL to clipboard"
                title="Copy shareable preview URL to clipboard"
                >
                Copy shareable URL
                <uui-icon name="icon-link"></uui-icon>
              </uui-button>`, (i = d(this, y)) != null && i.isTimeLimited && (e = u`${e}<p class="uui-text" style="font-size: 0.8rem; margin-top:4px;">This link is valid for ${(r = d(this, y)) == null ? void 0 : r.expirationMinutes} minutes</p>`)), u`
      <uui-box id="box-right">
        <div class="rp-wrapper">
          <div class="rp-container current">
            <div>
              <h4 class="uui-h4">Current version</h4>
            </div>
            <rp-iframe
              id="rollbackPreviewerLeft"
              src="${d(this, V)}/${(s = this.currentDocument) == null ? void 0 : s.unique}?culture=${this._selectedCulture}"
            >
            </rp-iframe>
          </div>
          <div class="rp-container selected">
            <div class="selected-version-title">
              <div>
                <h4 class="uui-h4">Selected version</h4>
                <p class="uui-text">${this.currentVersionHeader}</p>
              </div>
              <div class="align-right">
                ${e}
              </div>
            </div>
            <rp-iframe
              id="rollbackPreviewerRight"
              src="${d(this, V)}/ucrbp?cid=${(n = this.currentDocument) == null ? void 0 : n.unique}&vid=${this._selectedVersion.id}&culture=${this._selectedCulture}"
            ></rp-iframe>
          </div>
        </div>
      </uui-box>
    `;
  }
  render() {
    return u`
      <umb-body-layout
        headline="Visual Rollback Preview"
        class=${d(this, b) ? "json-view" : "preview-view"}
      >
        <uui-button
          slot="action-menu"
          look="secondary"
          @click=${S(this, C, be)}
          style="margin-right:24px"
          label=${d(this, b) ? "Visual difference" : "JSON difference"}
        >
          <uui-icon name="icon-repeat" style="margin-right:4px"></uui-icon>
          ${d(this, b) ? "Visual difference" : "JSON difference"}</uui-button
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
                ` : A}
            ${this.renderVersions()}
          </div>
          <div id="box-right">
            ${d(this, b) ? u` ${this.renderSelectedVersion()} ` : u` ${this.renderSelectedVersionVisualPreview()} `}
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
b = /* @__PURE__ */ new WeakMap();
V = /* @__PURE__ */ new WeakMap();
y = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakSet();
ve = async function() {
  J(this, V, window.location.origin), J(this, y, await Ge.getConfiguration());
};
be = async function() {
  J(this, b, !d(this, b)), this.requestUpdate(), d(this, b) || (await this.updateComplete, setTimeout(() => {
    S(this, C, te).call(this);
  }, 300));
};
te = function() {
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
      ), S(this, C, me).call(this, s, o), window.requestAnimationFrame(() => {
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
me = function(e, t) {
  var i, r, s;
  if (!(!e || !t))
    try {
      const n = e.contentDocument || ((i = e.contentWindow) == null ? void 0 : i.document), o = t.contentDocument || ((r = t.contentWindow) == null ? void 0 : r.document);
      if (!n || !o) return;
      const l = n.documentElement || n.body, a = o.documentElement || o.body, f = l.scrollHeight - l.clientHeight, _ = f > 0 ? l.scrollTop / f : 0, I = a.scrollHeight - a.clientHeight, L = _ * I, ie = l.scrollWidth - l.clientWidth, _e = ie > 0 ? l.scrollLeft / ie : 0, ye = a.scrollWidth - a.clientWidth, ge = _e * ye;
      (s = t.contentWindow) == null || s.scrollTo({
        top: L,
        left: ge,
        behavior: "instant"
      });
    } catch (n) {
      console.error("Error syncing scroll:", n);
    }
};
D.styles = Ne;
Z([
  X("#rollbackPreviewerLeft")
], D.prototype, "rollbackPreviewerLeft", 2);
Z([
  X("#rollbackPreviewerRight")
], D.prototype, "rollbackPreviewerRight", 2);
D = Z([
  G("rp-rollback-modal")
], D);
const pt = D;
export {
  D as RpRollbackModalElement,
  pt as default
};
//# sourceMappingURL=rollback-previewer-modal.element-Cj0M6ttc.js.map
