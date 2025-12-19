var re = (e) => {
  throw TypeError(e);
};
var se = (e, t, i) => t.has(e) || re("Cannot " + i);
var v = (e, t, i) => (se(e, t, "read from private field"), i ? i.call(e) : t.get(e)), N = (e, t, i) => t.has(e) ? re("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), A = (e, t, i, r) => (se(e, t, "write to private field"), r ? r.call(e, i) : t.set(e, i), i);
import { html as u, repeat as oe, unsafeHTML as Ce, nothing as L, css as G, state as $, customElement as J, property as ue, query as X, LitElement as $e } from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_ENTITY_TYPE as ne, UmbDocumentDetailRepository as ke } from "@umbraco-cms/backoffice/document";
import { DocumentVersionService as R } from "@umbraco-cms/backoffice/external/backend-api";
import { tryExecute as U } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as xe } from "@umbraco-cms/backoffice/class-api";
import { diffWords as le } from "@umbraco-cms/backoffice/utils";
import { UmbModalBaseElement as Ve } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles as Ee } from "@umbraco-cms/backoffice/style";
import { UmbUserItemRepository as Pe } from "@umbraco-cms/backoffice/user";
import { UMB_PROPERTY_DATASET_CONTEXT as Se } from "@umbraco-cms/backoffice/property";
import { UMB_APP_LANGUAGE_CONTEXT as De, UmbLanguageItemRepository as Te } from "@umbraco-cms/backoffice/language";
import { UMB_ENTITY_CONTEXT as Re } from "@umbraco-cms/backoffice/entity";
import { UmbVariantId as Ue } from "@umbraco-cms/backoffice/variant";
import { UMB_ACTION_EVENT_CONTEXT as qe } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as ze, UmbEntityUpdatedEvent as Oe } from "@umbraco-cms/backoffice/entity-action";
var y;
class We {
  /**
   * Creates an instance of UmbRollbackServerDataSource.
   * @param {UmbControllerHost} host - The controller host for this controller to be appended to
   * @memberof UmbRollbackServerDataSource
   */
  constructor(t) {
    N(this, y);
    A(this, y, t);
  }
  /**
   * Get a list of versions for a document
   * @param id
   * @param culture
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionsByDocumentId(t, i) {
    return U(v(this, y), R.getDocumentVersion({ query: { documentId: t, culture: i } }));
  }
  /**
   * Get a specific version by id
   * @param versionId
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionById(t) {
    return U(v(this, y), R.getDocumentVersionById({ path: { id: t } }));
  }
  setPreventCleanup(t, i) {
    return U(
      v(this, y),
      R.putDocumentVersionByIdPreventCleanup({
        path: { id: t },
        query: { preventCleanup: i }
      })
    );
  }
  rollback(t, i) {
    return U(
      v(this, y),
      R.postDocumentVersionByIdRollback({ path: { id: t }, query: { culture: i } })
    );
  }
}
y = new WeakMap();
var w;
class Ie extends xe {
  constructor(i) {
    super(i);
    N(this, w);
    A(this, w, new We(this));
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
var Me = Object.defineProperty, Be = Object.getOwnPropertyDescriptor, ce = (e) => {
  throw TypeError(e);
}, k = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Be(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Me(t, i, s), s;
}, Y = (e, t, i) => t.has(e) || ce("Cannot " + i), m = (e, t, i) => (Y(e, t, "read from private field"), i ? i.call(e) : t.get(e)), x = (e, t, i) => t.has(e) ? ce("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ae = (e, t, i, r) => (Y(e, t, "write to private field"), t.set(e, i), i), d = (e, t, i) => (Y(e, t, "access private method"), i), V, j, z, W, I, c, O, Q, K, de, he, pe, H, fe;
let h = class extends Ve {
  constructor() {
    super(), x(this, c), this._versions = [], this._selectedCulture = null, this._isInvariant = !0, this._availableVariants = [], this._diffs = [], x(this, V, new Ie(this)), x(this, j, new Pe(this)), x(this, z, {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit"
    }), x(this, W), x(this, I), this.consumeContext(Se, (e) => {
      ae(this, I, (e == null ? void 0 : e.getVariantId().culture) ?? void 0), d(this, c, O).call(this);
    }), this.consumeContext(De, (e) => {
      ae(this, W, e == null ? void 0 : e.getAppCulture()), d(this, c, O).call(this);
    }), this.consumeContext(Re, async (e) => {
      var o;
      if (!e) return;
      if (e.getEntityType() !== ne)
        throw new Error(`Entity type is not ${ne}`);
      const t = e.getUnique();
      if (!t)
        throw new Error("Document unique is not set");
      const { data: i } = await new ke(this).requestByUnique(t);
      if (!i) return;
      this.currentDocument = i;
      const r = ((o = this.currentDocument) == null ? void 0 : o.variants) ?? [];
      this._isInvariant = r.length === 1 && new Ue(r[0].culture).isInvariant(), d(this, c, O).call(this);
      const s = r.map((l) => l.culture).filter((l) => l !== null), { data: n } = await new Te(this).requestItems(s);
      n ? this._availableVariants = n.map((l) => ({
        name: l.name,
        value: l.unique,
        selected: l.unique === this._selectedCulture
      })) : this._availableVariants = [], d(this, c, Q).call(this);
    });
  }
  async onRollback() {
    var a, p, _;
    if (!this._selectedVersion) return;
    const e = this._selectedVersion.id, t = this._selectedCulture ?? void 0, { error: i } = await m(this, V).rollback(e, t);
    if (i) return;
    const r = (a = this.currentDocument) == null ? void 0 : a.unique, s = (p = this.currentDocument) == null ? void 0 : p.entityType;
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
				@change=${d(this, c, pe)}
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
							@click=${() => d(this, c, de).call(this, e.id)}
							@keydown=${() => {
        }}
							class="rollback-item ${((t = this._selectedVersion) == null ? void 0 : t.id) === e.id ? "active" : ""}">
							<div>
								<p class="rollback-item-date">
									<umb-localize-date date="${e.date}" .options=${m(this, z)}></umb-localize-date>
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
    return this.localize.date(((e = this._selectedVersion) == null ? void 0 : e.date) ?? /* @__PURE__ */ new Date(), m(this, z)) + " - " + ((t = this._selectedVersion) == null ? void 0 : t.user);
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
V = /* @__PURE__ */ new WeakMap();
j = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakMap();
W = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakSet();
O = function() {
  const e = m(this, I) ?? m(this, W) ?? null;
  this._selectedCulture = this._isInvariant ? null : e;
};
Q = async function() {
  var n, o, l;
  if (!((n = this.currentDocument) != null && n.unique))
    throw new Error("Document unique is not set");
  const { data: e } = await m(this, V).requestVersionsByDocumentId(
    (o = this.currentDocument) == null ? void 0 : o.unique,
    this._selectedCulture ?? void 0
  );
  if (!e) return;
  const t = [], i = [...new Set(e == null ? void 0 : e.items.map((a) => a.user.id))], { data: r } = await m(this, j).requestItems(i);
  e == null || e.items.forEach((a) => {
    var p;
    a.isCurrentDraftVersion || t.push({
      date: a.versionDate,
      user: ((p = r == null ? void 0 : r.find((_) => _.unique === a.user.id)) == null ? void 0 : p.name) || this.localize.term("general_unknownUser"),
      isCurrentlyPublishedVersion: a.isCurrentPublishedVersion,
      id: a.id,
      preventCleanup: a.preventCleanup
    });
  }), this._versions = t;
  const s = (l = t.find((a) => a.isCurrentlyPublishedVersion)) == null ? void 0 : l.id;
  s && d(this, c, K).call(this, s);
};
K = async function(e) {
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
  }, await d(this, c, fe).call(this);
};
de = function(e) {
  d(this, c, K).call(this, e);
};
he = function(e, t, i) {
  e.preventDefault(), e.stopImmediatePropagation(), m(this, V).setPreventCleanup(t, i);
  const r = this._versions.find((s) => s.id === t);
  r && (r.preventCleanup = i, this.requestUpdate("_versions"));
};
pe = function(e) {
  const t = e.target.value;
  this._selectedCulture = t.toString(), d(this, c, Q).call(this);
};
H = function(e) {
  return e.replace(/^['"]|['"]$/g, "");
};
fe = async function() {
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
    const a = e.find((B) => B.alias === l.alias);
    if (!a) return;
    const p = d(this, c, H).call(this, JSON.stringify(a.value)), _ = d(this, c, H).call(this, JSON.stringify(l.value)), M = le(p, _);
    i.push({ alias: l.alias, diff: M });
  }), this._diffs = [...i];
};
h.styles = [
  Ee,
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
k([
  $()
], h.prototype, "_versions", 2);
k([
  $()
], h.prototype, "_selectedVersion", 2);
k([
  $()
], h.prototype, "_selectedCulture", 2);
k([
  $()
], h.prototype, "_isInvariant", 2);
k([
  $()
], h.prototype, "_availableVariants", 2);
k([
  $()
], h.prototype, "_diffs", 2);
h = k([
  J("umb-rollback-modal")
], h);
const Ne = [
  ...h.styles,
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
  `
];
var Ae = Object.defineProperty, Le = Object.getOwnPropertyDescriptor, T = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Le(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Ae(t, i, s), s;
};
const He = {
  alias: "desktop",
  label: "Desktop",
  demensions: {
    width: 1920,
    height: 1080
  }
};
let C = class extends $e {
  constructor() {
    super(...arguments), this.src = "", this.secret = null, this._device = He;
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
  async copyUrlToClipboard() {
    if (!this.src) return;
    const e = this.secret ? `${this.src}&secret=${encodeURIComponent(this.secret)}` : this.src;
    try {
      await navigator.clipboard.writeText(e);
    } catch (t) {
      console.error("Failed to copy URL to clipboard:", t);
    }
  }
  // This is a LitElement specific method that is called when the element is first rendered
  firstUpdated() {
    this.updateIframeDevice();
  }
  render() {
    return this.src ? u`
      <div id="wrapper">
          <uui-button
            id="copy-url-btn"
            @click=${this.copyUrlToClipboard}
            look="secondary"
            label="Copy shareable preview URL to clipboard"
            compact>
            <uui-icon name="icon-link"></uui-icon>
          </uui-button>
          <iframe src=${this.src}></iframe>
      </div>
    ` : null;
  }
};
C.styles = [
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
T([
  ue({ type: String })
], C.prototype, "src", 2);
T([
  ue({ type: String })
], C.prototype, "secret", 2);
T([
  $()
], C.prototype, "_device", 2);
T([
  X("iframe")
], C.prototype, "iframe", 2);
C = T([
  J("rp-iframe")
], C);
class Fe {
  /**
   * Fetches the configuration settings from the backend API
   * @returns Promise with configuration data
   */
  static async getConfiguration() {
    try {
      const t = await fetch(
        "/umbraco/management/api/v1/umbraco-community-rollback-previewer/configuration",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
          // Include cookies for authentication
        }
      );
      if (!t.ok)
        return console.error("Failed to fetch Rollback Previewer configuration:", t.statusText), null;
      const i = await t.json();
      return {
        enableFrontendPreviewAuthorisation: i.enableFrontendPreviewAuthorisation ?? !1,
        frontendPreviewAuthorisationSecret: i.frontendPreviewAuthorisationSecret ?? null
      };
    } catch (t) {
      return console.error("Error fetching Rollback Previewer configuration:", t), null;
    }
  }
}
var Ge = Object.defineProperty, Je = Object.getOwnPropertyDescriptor, ve = (e) => {
  throw TypeError(e);
}, Z = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Je(t, i) : t, n = e.length - 1, o; n >= 0; n--)
    (o = e[n]) && (s = (r ? o(t, i, s) : o(s)) || s);
  return r && s && Ge(t, i, s), s;
}, ee = (e, t, i) => t.has(e) || ve("Cannot " + i), f = (e, t, i) => (ee(e, t, "read from private field"), i ? i.call(e) : t.get(e)), q = (e, t, i) => t.has(e) ? ve("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), F = (e, t, i, r) => (ee(e, t, "write to private field"), t.set(e, i), i), P = (e, t, i) => (ee(e, t, "access private method"), i), b, S, D, g, be, me, te, _e;
let E = class extends h {
  constructor() {
    super(), q(this, g), q(this, b, !1), q(this, S, ""), q(this, D, null), P(this, g, be).call(this);
  }
  // This is a LitElement specific method that is called when the element is first rendered
  updated() {
    setTimeout(() => {
      P(this, g, te).call(this);
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
              src="${f(this, S)}/${(e = this.currentDocument) == null ? void 0 : e.unique}?culture=${this._selectedCulture}"
              .secret=${f(this, D)}
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
              src="${f(this, S)}/ucrbp?cid=${(t = this.currentDocument) == null ? void 0 : t.unique}&vid=${this._selectedVersion.id}&culture=${this._selectedCulture}"
              .secret=${f(this, D)}
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
        class=${f(this, b) ? "json-view" : "preview-view"}
      >
        <uui-button
          slot="action-menu"
          look="secondary"
          @click=${P(this, g, me)}
          style="margin-right:24px"
          label=${f(this, b) ? "Visual difference" : "JSON difference"}
        >
          <uui-icon name="icon-repeat" style="margin-right:4px"></uui-icon>
          ${f(this, b) ? "Visual difference" : "JSON difference"}</uui-button
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
            ${f(this, b) ? u` ${this.renderSelectedVersion()} ` : u` ${this.renderSelectedVersionVisualPreview()} `}
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
S = /* @__PURE__ */ new WeakMap();
D = /* @__PURE__ */ new WeakMap();
g = /* @__PURE__ */ new WeakSet();
be = async function() {
  F(this, S, window.location.origin);
  const e = await Fe.getConfiguration();
  e != null && e.enableFrontendPreviewAuthorisation && F(this, D, e.frontendPreviewAuthorisationSecret);
};
me = async function() {
  F(this, b, !f(this, b)), this.requestUpdate(), f(this, b) || (await this.updateComplete, setTimeout(() => {
    P(this, g, te).call(this);
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
      ), P(this, g, _e).call(this, s, o), window.requestAnimationFrame(() => {
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
      const l = n.documentElement || n.body, a = o.documentElement || o.body, p = l.scrollHeight - l.clientHeight, _ = p > 0 ? l.scrollTop / p : 0, M = a.scrollHeight - a.clientHeight, B = _ * M, ie = l.scrollWidth - l.clientWidth, ye = ie > 0 ? l.scrollLeft / ie : 0, we = a.scrollWidth - a.clientWidth, ge = ye * we;
      (s = t.contentWindow) == null || s.scrollTo({
        top: B,
        left: ge,
        behavior: "instant"
      });
    } catch (n) {
      console.error("Error syncing scroll:", n);
    }
};
E.styles = Ne;
Z([
  X("#rollbackPreviewerLeft")
], E.prototype, "rollbackPreviewerLeft", 2);
Z([
  X("#rollbackPreviewerRight")
], E.prototype, "rollbackPreviewerRight", 2);
E = Z([
  J("rp-rollback-modal")
], E);
const ct = E;
export {
  E as RpRollbackModalElement,
  ct as default
};
//# sourceMappingURL=rollback-previewer-modal.element-C9dSykk1.js.map
