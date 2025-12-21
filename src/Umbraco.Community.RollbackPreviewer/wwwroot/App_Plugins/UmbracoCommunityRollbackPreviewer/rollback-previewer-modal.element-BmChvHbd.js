var se = (e) => {
  throw TypeError(e);
};
var oe = (e, t, i) => t.has(e) || se("Cannot " + i);
var f = (e, t, i) => (oe(e, t, "read from private field"), i ? i.call(e) : t.get(e)), A = (e, t, i) => t.has(e) ? se("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), H = (e, t, i, r) => (oe(e, t, "write to private field"), r ? r.call(e, i) : t.set(e, i), i);
import { html as u, repeat as ne, unsafeHTML as Ce, nothing as J, css as G, state as C, customElement as X, property as $e, query as Y, LitElement as ke } from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_ENTITY_TYPE as le, UmbDocumentDetailRepository as xe } from "@umbraco-cms/backoffice/document";
import { DocumentVersionService as R } from "@umbraco-cms/backoffice/external/backend-api";
import { tryExecute as U } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as Ve } from "@umbraco-cms/backoffice/class-api";
import { diffWords as ae } from "@umbraco-cms/backoffice/utils";
import { UmbModalBaseElement as Ee } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles as Pe } from "@umbraco-cms/backoffice/style";
import { UmbUserItemRepository as De } from "@umbraco-cms/backoffice/user";
import { UMB_PROPERTY_DATASET_CONTEXT as Se } from "@umbraco-cms/backoffice/property";
import { UMB_APP_LANGUAGE_CONTEXT as Te, UmbLanguageItemRepository as Re } from "@umbraco-cms/backoffice/language";
import { UMB_ENTITY_CONTEXT as Ue } from "@umbraco-cms/backoffice/entity";
import { UmbVariantId as qe } from "@umbraco-cms/backoffice/variant";
import { UMB_ACTION_EVENT_CONTEXT as ze } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as Oe, UmbEntityUpdatedEvent as We } from "@umbraco-cms/backoffice/entity-action";
import { c as Me } from "./client.gen-CSWNPGiu.js";
var y;
class Ie {
  /**
   * Creates an instance of UmbRollbackServerDataSource.
   * @param {UmbControllerHost} host - The controller host for this controller to be appended to
   * @memberof UmbRollbackServerDataSource
   */
  constructor(t) {
    A(this, y);
    H(this, y, t);
  }
  /**
   * Get a list of versions for a document
   * @param id
   * @param culture
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionsByDocumentId(t, i) {
    return U(f(this, y), R.getDocumentVersion({ query: { documentId: t, culture: i } }));
  }
  /**
   * Get a specific version by id
   * @param versionId
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionById(t) {
    return U(f(this, y), R.getDocumentVersionById({ path: { id: t } }));
  }
  setPreventCleanup(t, i) {
    return U(
      f(this, y),
      R.putDocumentVersionByIdPreventCleanup({
        path: { id: t },
        query: { preventCleanup: i }
      })
    );
  }
  rollback(t, i) {
    return U(
      f(this, y),
      R.postDocumentVersionByIdRollback({ path: { id: t }, query: { culture: i } })
    );
  }
}
y = new WeakMap();
var w;
class Le extends Ve {
  constructor(i) {
    super(i);
    A(this, w);
    H(this, w, new Ie(this));
  }
  async requestVersionsByDocumentId(i, r) {
    return await f(this, w).getVersionsByDocumentId(i, r);
  }
  async requestVersionById(i) {
    return await f(this, w).getVersionById(i);
  }
  async setPreventCleanup(i, r) {
    return await f(this, w).setPreventCleanup(i, r);
  }
  async rollback(i, r) {
    return await f(this, w).rollback(i, r);
  }
}
w = new WeakMap();
var Be = Object.defineProperty, Ne = Object.getOwnPropertyDescriptor, ce = (e) => {
  throw TypeError(e);
}, $ = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Ne(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Be(t, i, s), s;
}, j = (e, t, i) => t.has(e) || ce("Cannot " + i), m = (e, t, i) => (j(e, t, "read from private field"), i ? i.call(e) : t.get(e)), k = (e, t, i) => t.has(e) ? ce("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ue = (e, t, i, r) => (j(e, t, "write to private field"), t.set(e, i), i), d = (e, t, i) => (j(e, t, "access private method"), i), V, Q, q, W, M, c, z, K, Z, de, he, pe, F, ve;
let p = class extends Ee {
  constructor() {
    super(), k(this, c), this._versions = [], this._selectedCulture = null, this._isInvariant = !0, this._availableVariants = [], this._diffs = [], k(this, V, new Le(this)), k(this, Q, new De(this)), k(this, q, {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit"
    }), k(this, W), k(this, M), this.consumeContext(Se, (e) => {
      ue(this, M, (e == null ? void 0 : e.getVariantId().culture) ?? void 0), d(this, c, z).call(this);
    }), this.consumeContext(Te, (e) => {
      ue(this, W, e == null ? void 0 : e.getAppCulture()), d(this, c, z).call(this);
    }), this.consumeContext(Ue, async (e) => {
      var o;
      if (!e) return;
      if (e.getEntityType() !== le)
        throw new Error(`Entity type is not ${le}`);
      const t = e.getUnique();
      if (!t)
        throw new Error("Document unique is not set");
      const { data: i } = await new xe(this).requestByUnique(t);
      if (!i) return;
      this.currentDocument = i;
      const r = ((o = this.currentDocument) == null ? void 0 : o.variants) ?? [];
      this._isInvariant = r.length === 1 && new qe(r[0].culture).isInvariant(), d(this, c, z).call(this);
      const s = r.map((l) => l.culture).filter((l) => l !== null), { data: n } = await new Re(this).requestItems(s);
      n ? this._availableVariants = n.map((l) => ({
        name: l.name,
        value: l.unique,
        selected: l.unique === this._selectedCulture
      })) : this._availableVariants = [], d(this, c, K).call(this);
    });
  }
  async onRollback() {
    var a, v, _;
    if (!this._selectedVersion) return;
    const e = this._selectedVersion.id, t = this._selectedCulture ?? void 0, { error: i } = await m(this, V).rollback(e, t);
    if (i) return;
    const r = (a = this.currentDocument) == null ? void 0 : a.unique, s = (v = this.currentDocument) == null ? void 0 : v.entityType;
    if (!r || !s)
      throw new Error("Document unique or entity type is not set");
    const n = await this.getContext(ze);
    if (!n)
      throw new Error("Action event context not found");
    const o = new Oe({ unique: r, entityType: s });
    n.dispatchEvent(o);
    const l = new We({ unique: r, entityType: s });
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
				@change=${d(this, c, pe)}
				.options=${this._availableVariants}></uui-select>
		`;
  }
  renderVersions() {
    return this._versions.length ? u` <uui-box id="versions-box" headline=${this.localize.term("rollback_versions")}>
			${ne(
      this._versions,
      (e) => e.id,
      (e) => {
        var t;
        return u`
						<div
							@click=${() => d(this, c, de).call(this, e.id)}
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
								@click=${(i) => d(this, c, he).call(this, i, e.id, !e.preventCleanup)}
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
				${Ce(this.localize.term("rollback_diffHelp"))}
				<uui-table>
					<uui-table-column style="width: 0"></uui-table-column>
					<uui-table-column></uui-table-column>

					<uui-table-head>
						<uui-table-head-cell>${this.localize.term("general_alias")}</uui-table-head-cell>
						<uui-table-head-cell>${this.localize.term("general_value")}</uui-table-head-cell>
					</uui-table-head>
					${ne(
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
        ) : J}
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
								` : J}
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
V = /* @__PURE__ */ new WeakMap();
Q = /* @__PURE__ */ new WeakMap();
q = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakMap();
M = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakSet();
z = function() {
  const e = m(this, M) ?? m(this, W) ?? null;
  this._selectedCulture = this._isInvariant ? null : e;
};
K = async function() {
  var n, o, l;
  if (!((n = this.currentDocument) != null && n.unique))
    throw new Error("Document unique is not set");
  const { data: e } = await m(this, V).requestVersionsByDocumentId(
    (o = this.currentDocument) == null ? void 0 : o.unique,
    this._selectedCulture ?? void 0
  );
  if (!e) return;
  const t = [], i = [...new Set(e == null ? void 0 : e.items.map((a) => a.user.id))], { data: r } = await m(this, Q).requestItems(i);
  e == null || e.items.forEach((a) => {
    var v;
    a.isCurrentDraftVersion || t.push({
      date: a.versionDate,
      user: ((v = r == null ? void 0 : r.find((_) => _.unique === a.user.id)) == null ? void 0 : v.name) || this.localize.term("general_unknownUser"),
      isCurrentlyPublishedVersion: a.isCurrentPublishedVersion,
      id: a.id,
      preventCleanup: a.preventCleanup
    });
  }), this._versions = t;
  const s = (l = t.find((a) => a.isCurrentlyPublishedVersion)) == null ? void 0 : l.id;
  s && d(this, c, Z).call(this, s);
};
Z = async function(e) {
  var r;
  const t = this._versions.find((s) => s.id === e);
  if (!t) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  const { data: i } = await m(this, V).requestVersionById(e);
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
  }, await d(this, c, ve).call(this);
};
de = function(e) {
  d(this, c, Z).call(this, e);
};
he = function(e, t, i) {
  e.preventDefault(), e.stopImmediatePropagation(), m(this, V).setPreventCleanup(t, i);
  const r = this._versions.find((s) => s.id === t);
  r && (r.preventCleanup = i, this.requestUpdate("_versions"));
};
pe = function(e) {
  const t = e.target.value;
  this._selectedCulture = t.toString(), d(this, c, K).call(this);
};
F = function(e) {
  return e.replace(/^['"]|['"]$/g, "");
};
ve = async function() {
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
  const i = [], r = ae(t, this._selectedVersion.name);
  i.push({ alias: "name", diff: r }), this._selectedVersion.properties.forEach((l) => {
    const a = e.find((N) => N.alias === l.alias);
    if (!a) return;
    const v = d(this, c, F).call(this, JSON.stringify(a.value)), _ = d(this, c, F).call(this, JSON.stringify(l.value)), B = ae(v, _);
    i.push({ alias: l.alias, diff: B });
  }), this._diffs = [...i];
};
p.styles = [
  Pe,
  G`
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
$([
  C()
], p.prototype, "_versions", 2);
$([
  C()
], p.prototype, "_selectedVersion", 2);
$([
  C()
], p.prototype, "_selectedCulture", 2);
$([
  C()
], p.prototype, "_isInvariant", 2);
$([
  C()
], p.prototype, "_availableVariants", 2);
$([
  C()
], p.prototype, "_diffs", 2);
p = $([
  X("umb-rollback-modal")
], p);
const Ae = [
  ...p.styles,
  // Importing the base styles from UmbRollbackModalElement
  G`
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
  `
];
var He = Object.defineProperty, Je = Object.getOwnPropertyDescriptor, L = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Je(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && He(t, i, s), s;
};
const Fe = {
  alias: "desktop",
  label: "Desktop",
  demensions: {
    width: 1920,
    height: 1080
  }
};
let E = class extends ke {
  constructor() {
    super(...arguments), this.src = "", this._device = Fe;
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
E.styles = [
  G`
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
L([
  $e({ type: String })
], E.prototype, "src", 2);
L([
  C()
], E.prototype, "_device", 2);
L([
  Y("iframe")
], E.prototype, "iframe", 2);
E = L([
  X("rp-iframe")
], E);
const Ge = (e) => ((e == null ? void 0 : e.client) ?? Me).get({
  security: [
    {
      scheme: "bearer",
      type: "http"
    }
  ],
  url: "/umbraco/rollbackpreviewer/api/v1/configuration",
  ...e
});
class Xe {
  /**
   * Fetches the configuration settings from the backend API
   * @returns Promise with configuration data
   */
  static async getConfiguration() {
    const { data: t, error: i } = await Ge();
    return i ? (console.error(i), null) : t !== void 0 ? t : null;
  }
}
var Ye = Object.defineProperty, je = Object.getOwnPropertyDescriptor, fe = (e) => {
  throw TypeError(e);
}, ee = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? je(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Ye(t, i, s), s;
}, te = (e, t, i) => t.has(e) || fe("Cannot " + i), h = (e, t, i) => (te(e, t, "read from private field"), i ? i.call(e) : t.get(e)), D = (e, t, i) => t.has(e) ? fe("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), O = (e, t, i, r) => (te(e, t, "write to private field"), t.set(e, i), i), S = (e, t, i) => (te(e, t, "access private method"), i), b, x, I, T, g, be, me, ie, _e;
let P = class extends p {
  constructor() {
    super(), D(this, g), D(this, b, !1), D(this, x, ""), D(this, I, !1), D(this, T, null), S(this, g, be).call(this);
  }
  async copyUrlToClipboard(e) {
    var n;
    const t = e.target;
    if (!this._selectedVersion) return;
    let i = this._selectedCulture || "", r = `${h(this, x)}/ucrbp?cid=${(n = this.currentDocument) == null ? void 0 : n.unique}&vid=${this._selectedVersion.id}&culture=${i}`;
    const s = h(this, T) ? `${r}&secret=${encodeURIComponent(h(this, T))}` : r;
    try {
      await navigator.clipboard.writeText(s), t.state = "success";
    } catch (o) {
      console.error("Failed to copy URL to clipboard:", o);
    }
  }
  // This is a LitElement specific method that is called when the element is first rendered
  updated() {
    setTimeout(() => {
      S(this, g, ie).call(this);
    }, 300);
  }
  renderSelectedVersionVisualPreview() {
    var t, i;
    if (!this._selectedVersion)
      return u`
        <uui-box
          style="display: flex; align-items: center; justify-content: center;"
          >No selected version</uui-box
        >
      `;
    let e = u``;
    return h(this, I) && (e = u`<uui-button
                @click=${this.copyUrlToClipboard}
                look="secondary"
                compact
                title="Copy shareable preview URL to clipboard"
                >
                <span>Copy shareable URL</span>
                <uui-icon name="icon-link"></uui-icon>
              </uui-button>`), u`
      <uui-box id="box-right">
        <div class="rp-wrapper">
          <div class="rp-container current">
            <div>
              <h4 class="uui-h4">Current version</h4>
            </div>
            <rp-iframe
              id="rollbackPreviewerLeft"
              src="${h(this, x)}/${(t = this.currentDocument) == null ? void 0 : t.unique}?culture=${this._selectedCulture}"
            >
            </rp-iframe>
          </div>
          <div class="rp-container selected">
            <div class="selected-version-title">
              <div>
                <h4 class="uui-h4">Selected version</h4>
                <p class="uui-text">${this.currentVersionHeader}</p>
              </div>
              <div>
                ${e}
              </div>
            </div>
            <rp-iframe
              id="rollbackPreviewerRight"
              src="${h(this, x)}/ucrbp?cid=${(i = this.currentDocument) == null ? void 0 : i.unique}&vid=${this._selectedVersion.id}&culture=${this._selectedCulture}"
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
        class=${h(this, b) ? "json-view" : "preview-view"}
      >
        <uui-button
          slot="action-menu"
          look="secondary"
          @click=${S(this, g, me)}
          style="margin-right:24px"
          label=${h(this, b) ? "Visual difference" : "JSON difference"}
        >
          <uui-icon name="icon-repeat" style="margin-right:4px"></uui-icon>
          ${h(this, b) ? "Visual difference" : "JSON difference"}</uui-button
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
                ` : J}
            ${this.renderVersions()}
          </div>
          <div id="box-right">
            ${h(this, b) ? u` ${this.renderSelectedVersion()} ` : u` ${this.renderSelectedVersionVisualPreview()} `}
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
x = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakMap();
T = /* @__PURE__ */ new WeakMap();
g = /* @__PURE__ */ new WeakSet();
be = async function() {
  O(this, x, window.location.origin);
  const e = await Xe.getConfiguration();
  e != null && e.enableFrontendPreviewAuthorisation && (O(this, T, e.frontendPreviewAuthorisationSecret), O(this, I, !0));
};
me = async function() {
  O(this, b, !h(this, b)), this.requestUpdate(), h(this, b) || (await this.updateComplete, setTimeout(() => {
    S(this, g, ie).call(this);
  }, 300));
};
ie = function() {
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
      ), S(this, g, _e).call(this, s, o), window.requestAnimationFrame(() => {
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
_e = function(e, t) {
  var i, r, s;
  if (!(!e || !t))
    try {
      const n = e.contentDocument || ((i = e.contentWindow) == null ? void 0 : i.document), o = t.contentDocument || ((r = t.contentWindow) == null ? void 0 : r.document);
      if (!n || !o) return;
      const l = n.documentElement || n.body, a = o.documentElement || o.body, v = l.scrollHeight - l.clientHeight, _ = v > 0 ? l.scrollTop / v : 0, B = a.scrollHeight - a.clientHeight, N = _ * B, re = l.scrollWidth - l.clientWidth, ye = re > 0 ? l.scrollLeft / re : 0, we = a.scrollWidth - a.clientWidth, ge = ye * we;
      (s = t.contentWindow) == null || s.scrollTo({
        top: N,
        left: ge,
        behavior: "instant"
      });
    } catch (n) {
      console.error("Error syncing scroll:", n);
    }
};
P.styles = Ae;
ee([
  Y("#rollbackPreviewerLeft")
], P.prototype, "rollbackPreviewerLeft", 2);
ee([
  Y("#rollbackPreviewerRight")
], P.prototype, "rollbackPreviewerRight", 2);
P = ee([
  X("rp-rollback-modal")
], P);
const vt = P;
export {
  P as RpRollbackModalElement,
  vt as default
};
//# sourceMappingURL=rollback-previewer-modal.element-BmChvHbd.js.map
