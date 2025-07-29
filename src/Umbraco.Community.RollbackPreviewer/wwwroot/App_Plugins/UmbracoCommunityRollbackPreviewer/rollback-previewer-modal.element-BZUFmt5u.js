var K = (e) => {
  throw TypeError(e);
};
var Z = (e, t, i) => t.has(e) || K("Cannot " + i);
var f = (e, t, i) => (Z(e, t, "read from private field"), i ? i.call(e) : t.get(e)), I = (e, t, i) => t.has(e) ? K("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), M = (e, t, i, r) => (Z(e, t, "write to private field"), r ? r.call(e, i) : t.set(e, i), i);
import { html as u, repeat as ee, unsafeHTML as be, nothing as B, css as L, state as C, customElement as A, property as _e, query as H, LitElement as ye } from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_ENTITY_TYPE as te, UmbDocumentDetailRepository as ge } from "@umbraco-cms/backoffice/document";
import { DocumentVersionService as D } from "@umbraco-cms/backoffice/external/backend-api";
import { tryExecute as S } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as we } from "@umbraco-cms/backoffice/class-api";
import { diffWords as ie } from "@umbraco-cms/backoffice/utils";
import { UmbModalBaseElement as Ce } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles as $e } from "@umbraco-cms/backoffice/style";
import { UmbUserItemRepository as xe } from "@umbraco-cms/backoffice/user";
import { UMB_PROPERTY_DATASET_CONTEXT as Ve } from "@umbraco-cms/backoffice/property";
import { UMB_APP_LANGUAGE_CONTEXT as ke, UmbLanguageItemRepository as Ee } from "@umbraco-cms/backoffice/language";
import { UMB_ENTITY_CONTEXT as Pe } from "@umbraco-cms/backoffice/entity";
import { UmbVariantId as De } from "@umbraco-cms/backoffice/variant";
import { UMB_ACTION_EVENT_CONTEXT as Se } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as Te, UmbEntityUpdatedEvent as Re } from "@umbraco-cms/backoffice/entity-action";
var _;
class qe {
  /**
   * Creates an instance of UmbRollbackServerDataSource.
   * @param {UmbControllerHost} host - The controller host for this controller to be appended to
   * @memberof UmbRollbackServerDataSource
   */
  constructor(t) {
    I(this, _);
    M(this, _, t);
  }
  /**
   * Get a list of versions for a document
   * @param id
   * @param culture
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionsByDocumentId(t, i) {
    return S(f(this, _), D.getDocumentVersion({ query: { documentId: t, culture: i } }));
  }
  /**
   * Get a specific version by id
   * @param versionId
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionById(t) {
    return S(f(this, _), D.getDocumentVersionById({ path: { id: t } }));
  }
  setPreventCleanup(t, i) {
    return S(
      f(this, _),
      D.putDocumentVersionByIdPreventCleanup({
        path: { id: t },
        query: { preventCleanup: i }
      })
    );
  }
  rollback(t, i) {
    return S(
      f(this, _),
      D.postDocumentVersionByIdRollback({ path: { id: t }, query: { culture: i } })
    );
  }
}
_ = new WeakMap();
var y;
class Ue extends we {
  constructor(i) {
    super(i);
    I(this, y);
    M(this, y, new qe(this));
  }
  async requestVersionsByDocumentId(i, r) {
    return await f(this, y).getVersionsByDocumentId(i, r);
  }
  async requestVersionById(i) {
    return await f(this, y).getVersionById(i);
  }
  async setPreventCleanup(i, r) {
    return await f(this, y).setPreventCleanup(i, r);
  }
  async rollback(i, r) {
    return await f(this, y).rollback(i, r);
  }
}
y = new WeakMap();
var ze = Object.defineProperty, Oe = Object.getOwnPropertyDescriptor, re = (e) => {
  throw TypeError(e);
}, $ = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Oe(t, i) : t, l = e.length - 1, o; l >= 0; l--)
    (o = e[l]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && ze(t, i, s), s;
}, se = (e, t, i) => t.has(e) || re("Cannot " + i), w = (e, t, i) => (se(e, t, "read from private field"), i ? i.call(e) : t.get(e)), T = (e, t, i) => t.has(e) ? re("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), d = (e, t, i) => (se(e, t, "access private method"), i), x, J, R, c, q, G, X, oe, le, ne, N, ae;
let h = class extends Ce {
  constructor() {
    super(), T(this, c), this._versions = [], this._selectedCulture = null, this._isInvariant = !0, this._availableVariants = [], this._diffs = [], T(this, x, new Ue(this)), T(this, J, new xe(this)), T(this, R, {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit"
    }), this.consumeContext(Ve, (e) => {
      this.currentDatasetCulture = (e == null ? void 0 : e.getVariantId().culture) ?? void 0, d(this, c, q).call(this);
    }), this.consumeContext(ke, (e) => {
      this.currentAppCulture = e == null ? void 0 : e.getAppCulture(), d(this, c, q).call(this);
    }), this.consumeContext(Pe, async (e) => {
      var o;
      if (!e) return;
      if (e.getEntityType() !== te)
        throw new Error(`Entity type is not ${te}`);
      const t = e.getUnique();
      if (!t)
        throw new Error("Document unique is not set");
      const { data: i } = await new ge(this).requestByUnique(t);
      if (!i) return;
      this.currentDocument = i;
      const r = ((o = this.currentDocument) == null ? void 0 : o.variants) ?? [];
      this._isInvariant = r.length === 1 && new De(r[0].culture).isInvariant(), d(this, c, q).call(this);
      const s = r.map((n) => n.culture).filter((n) => n !== null), { data: l } = await new Ee(this).requestItems(s);
      l ? this._availableVariants = l.map((n) => ({
        name: n.name,
        value: n.unique,
        selected: n.unique === this._selectedCulture
      })) : this._availableVariants = [], d(this, c, G).call(this);
    });
  }
  async onRollback() {
    var a, p, m;
    if (!this._selectedVersion) return;
    const e = this._selectedVersion.id, t = this._selectedCulture ?? void 0, { error: i } = await w(this, x).rollback(e, t);
    if (i) return;
    const r = (a = this.currentDocument) == null ? void 0 : a.unique, s = (p = this.currentDocument) == null ? void 0 : p.entityType;
    if (!r || !s)
      throw new Error("Document unique or entity type is not set");
    const l = await this.getContext(Se);
    if (!l)
      throw new Error("Action event context not found");
    const o = new Te({ unique: r, entityType: s });
    l.dispatchEvent(o);
    const n = new Re({ unique: r, entityType: s });
    l.dispatchEvent(n), this.value = {}, (m = this.modalContext) == null || m.submit();
  }
  onCancel() {
    var e;
    (e = this.modalContext) == null || e.reject();
  }
  renderCultureSelect() {
    return u`
			<uui-select
				id="language-select"
				@change=${d(this, c, ne)}
				.options=${this._availableVariants}></uui-select>
		`;
  }
  renderVersions() {
    return this._versions.length ? u` <uui-box id="versions-box" headline=${this.localize.term("rollback_versions")}>
			${ee(
      this._versions,
      (e) => e.id,
      (e) => {
        var t;
        return u`
						<div
							@click=${() => d(this, c, oe).call(this, e.id)}
							@keydown=${() => {
        }}
							class="rollback-item ${((t = this._selectedVersion) == null ? void 0 : t.id) === e.id ? "active" : ""}">
							<div>
								<p class="rollback-item-date">
									<umb-localize-date date="${e.date}" .options=${w(this, R)}></umb-localize-date>
								</p>
								<p>${e.user}</p>
								<p>${e.isCurrentlyPublishedVersion ? this.localize.term("rollback_currentPublishedVersion") : ""}</p>
							</div>
							<uui-button
								look="secondary"
								@click=${(i) => d(this, c, le).call(this, i, e.id, !e.preventCleanup)}
								label=${e.preventCleanup ? this.localize.term("contentTypeEditor_historyCleanupEnableCleanup") : this.localize.term("contentTypeEditor_historyCleanupPreventCleanup")}></uui-button>
						</div>
					`;
      }
    )}</uui-box
		>` : u`<uui-box headline=${this.localize.term("rollback_versions")}>No versions available</uui-box>`;
  }
  renderSelectedVersion() {
    return this._selectedVersion ? u`
			<uui-box headline=${this.currentVersionHeader} id="box-right">
				${be(this.localize.term("rollback_diffHelp"))}
				<uui-table>
					<uui-table-column style="width: 0"></uui-table-column>
					<uui-table-column></uui-table-column>

					<uui-table-head>
						<uui-table-head-cell>${this.localize.term("general_alias")}</uui-table-head-cell>
						<uui-table-head-cell>${this.localize.term("general_value")}</uui-table-head-cell>
					</uui-table-head>
					${ee(
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
        ) : B}
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
    return this.localize.date(((e = this._selectedVersion) == null ? void 0 : e.date) ?? /* @__PURE__ */ new Date(), w(this, R)) + " - " + ((t = this._selectedVersion) == null ? void 0 : t.user);
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
								` : B}
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
J = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakSet();
q = function() {
  const e = this.currentDatasetCulture ?? this.currentAppCulture ?? null;
  this._selectedCulture = this._isInvariant ? null : e;
};
G = async function() {
  var l, o, n;
  if (!((l = this.currentDocument) != null && l.unique))
    throw new Error("Document unique is not set");
  const { data: e } = await w(this, x).requestVersionsByDocumentId(
    (o = this.currentDocument) == null ? void 0 : o.unique,
    this._selectedCulture ?? void 0
  );
  if (!e) return;
  const t = [], i = [...new Set(e == null ? void 0 : e.items.map((a) => a.user.id))], { data: r } = await w(this, J).requestItems(i);
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
  const s = (n = t.find((a) => a.isCurrentlyPublishedVersion)) == null ? void 0 : n.id;
  s && d(this, c, X).call(this, s);
};
X = async function(e) {
  var r;
  const t = this._versions.find((s) => s.id === e);
  if (!t) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  const { data: i } = await w(this, x).requestVersionById(e);
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
  }, await d(this, c, ae).call(this);
};
oe = function(e) {
  d(this, c, X).call(this, e);
};
le = function(e, t, i) {
  e.preventDefault(), e.stopImmediatePropagation(), w(this, x).setPreventCleanup(t, i);
  const r = this._versions.find((s) => s.id === t);
  r && (r.preventCleanup = i, this.requestUpdate("_versions"));
};
ne = function(e) {
  const t = e.target.value;
  this._selectedCulture = t.toString(), d(this, c, G).call(this);
};
N = function(e) {
  return e.replace(/^['"]|['"]$/g, "");
};
ae = async function() {
  var s, l, o;
  if (!this._selectedVersion) return;
  const e = (s = this.currentDocument) == null ? void 0 : s.values.filter(
    (n) => n.culture === this._selectedCulture || !n.culture
  );
  if (!e)
    throw new Error("Current property values are not set");
  const t = (o = (l = this.currentDocument) == null ? void 0 : l.variants.find((n) => n.culture === this._selectedCulture)) == null ? void 0 : o.name;
  if (!t)
    throw new Error("Current name is not set");
  const i = [], r = ie(t, this._selectedVersion.name);
  i.push({ alias: "name", diff: r }), this._selectedVersion.properties.forEach((n) => {
    const a = e.find((O) => O.alias === n.alias);
    if (!a) return;
    const p = d(this, c, N).call(this, JSON.stringify(a.value)), m = d(this, c, N).call(this, JSON.stringify(n.value)), z = ie(p, m);
    i.push({ alias: n.alias, diff: z });
  }), this._diffs = [...i];
};
h.styles = [
  $e,
  L`
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
], h.prototype, "_versions", 2);
$([
  C()
], h.prototype, "_selectedVersion", 2);
$([
  C()
], h.prototype, "_selectedCulture", 2);
$([
  C()
], h.prototype, "_isInvariant", 2);
$([
  C()
], h.prototype, "_availableVariants", 2);
$([
  C()
], h.prototype, "_diffs", 2);
h = $([
  A("umb-rollback-modal")
], h);
const Ie = [
  ...h.styles,
  // Importing the base styles from UmbRollbackModalElement
  L`
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
var Me = Object.defineProperty, We = Object.getOwnPropertyDescriptor, U = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? We(t, i) : t, l = e.length - 1, o; l >= 0; l--)
    (o = e[l]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Me(t, i, s), s;
};
const Be = {
  alias: "desktop",
  label: "Desktop",
  demensions: {
    width: 1920,
    height: 1080
  }
};
let V = class extends ye {
  constructor() {
    super(...arguments), this.src = "", this._device = Be;
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
  L`
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
U([
  _e({ type: String })
], V.prototype, "src", 2);
U([
  C()
], V.prototype, "_device", 2);
U([
  H("iframe")
], V.prototype, "iframe", 2);
V = U([
  A("rp-iframe")
], V);
var Ne = Object.defineProperty, Le = Object.getOwnPropertyDescriptor, ue = (e) => {
  throw TypeError(e);
}, Y = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Le(t, i) : t, l = e.length - 1, o; l >= 0; l--)
    (o = e[l]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Ne(t, i, s), s;
}, j = (e, t, i) => t.has(e) || ue("Cannot " + i), b = (e, t, i) => (j(e, t, "read from private field"), i ? i.call(e) : t.get(e)), W = (e, t, i) => t.has(e) ? ue("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ce = (e, t, i, r) => (j(e, t, "write to private field"), t.set(e, i), i), E = (e, t, i) => (j(e, t, "access private method"), i), v, P, g, de, he, F, pe;
let k = class extends h {
  constructor() {
    super(), W(this, g), W(this, v, !1), W(this, P, ""), E(this, g, de).call(this);
  }
  // This is a LitElement specific method that is called when the element is first rendered
  updated() {
    setTimeout(() => {
      E(this, g, F).call(this);
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
              src="${b(this, P)}/${(e = this.currentDocument) == null ? void 0 : e.unique}?culture=${this._selectedCulture}"
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
              src="${b(this, P)}/ucrbp?cid=${(t = this.currentDocument) == null ? void 0 : t.unique}&vid=${this._selectedVersion.id}&culture=${this._selectedCulture}"
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
        class=${b(this, v) ? "json-view" : "preview-view"}
      >
        <uui-button
          slot="action-menu"
          look="secondary"
          @click=${E(this, g, he)}
          style="margin-right:24px"
          label=${b(this, v) ? "Visual difference" : "JSON difference"}
        >
          <uui-icon name="icon-repeat" style="margin-right:4px"></uui-icon>
          ${b(this, v) ? "Visual difference" : "JSON difference"}</uui-button
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
                ` : B}
            ${this.renderVersions()}
          </div>
          <div id="box-right">
            ${b(this, v) ? u` ${this.renderSelectedVersion()} ` : u` ${this.renderSelectedVersionVisualPreview()} `}
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
P = /* @__PURE__ */ new WeakMap();
g = /* @__PURE__ */ new WeakSet();
de = async function() {
  const e = await this.getContext("UmbBackofficeContext");
  ce(this, P, e.serverUrl);
};
he = async function() {
  ce(this, v, !b(this, v)), this.requestUpdate(), b(this, v) || (await this.updateComplete, setTimeout(() => {
    E(this, g, F).call(this);
  }, 300));
};
F = function() {
  if (!this.rollbackPreviewerLeft || !this.rollbackPreviewerRight) return;
  const e = [this.rollbackPreviewerLeft, this.rollbackPreviewerRight];
  e.forEach((i) => {
    i !== null && (i.onload = () => {
      i.resetScrollPosition();
    });
  });
  const t = (i) => {
    const r = i.currentTarget, s = r == null ? void 0 : r.frameElement, l = e.filter(
      (o) => o.iframe !== s
    ).map((o) => o.iframe);
    s && l.forEach((o) => {
      var n;
      o && ((n = o.contentWindow) == null || n.removeEventListener(
        "scroll",
        t
      ), E(this, g, pe).call(this, s, o), window.requestAnimationFrame(() => {
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
pe = function(e, t) {
  var i, r, s;
  if (!(!e || !t))
    try {
      const l = e.contentDocument || ((i = e.contentWindow) == null ? void 0 : i.document), o = t.contentDocument || ((r = t.contentWindow) == null ? void 0 : r.document);
      if (!l || !o) return;
      const n = l.documentElement || l.body, a = o.documentElement || o.body, p = n.scrollHeight - n.clientHeight, m = p > 0 ? n.scrollTop / p : 0, z = a.scrollHeight - a.clientHeight, O = m * z, Q = n.scrollWidth - n.clientWidth, fe = Q > 0 ? n.scrollLeft / Q : 0, ve = a.scrollWidth - a.clientWidth, me = fe * ve;
      (s = t.contentWindow) == null || s.scrollTo({
        top: O,
        left: me,
        behavior: "instant"
      });
    } catch (l) {
      console.error("Error syncing scroll:", l);
    }
};
k.styles = Ie;
Y([
  H("#rollbackPreviewerLeft")
], k.prototype, "rollbackPreviewerLeft", 2);
Y([
  H("#rollbackPreviewerRight")
], k.prototype, "rollbackPreviewerRight", 2);
k = Y([
  A("rp-rollback-modal")
], k);
console.log("Ran the ele");
const ot = k;
export {
  k as RpRollbackModalElement,
  ot as default
};
//# sourceMappingURL=rollback-previewer-modal.element-BZUFmt5u.js.map
