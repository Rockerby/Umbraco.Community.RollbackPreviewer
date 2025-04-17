var Y = (e) => {
  throw TypeError(e);
};
var j = (e, t, i) => t.has(e) || Y("Cannot " + i);
var p = (e, t, i) => (j(e, t, "read from private field"), i ? i.call(e) : t.get(e)), R = (e, t, i) => t.has(e) ? Y("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), q = (e, t, i, s) => (j(e, t, "write to private field"), s ? s.call(e, i) : t.set(e, i), i);
import { html as n, repeat as F, unsafeHTML as pe, nothing as M, css as B, state as g, customElement as W, property as fe, LitElement as ve } from "@umbraco-cms/backoffice/external/lit";
import { UMB_DOCUMENT_ENTITY_TYPE as Q, UmbDocumentDetailRepository as be } from "@umbraco-cms/backoffice/document";
import { DocumentVersionService as E } from "@umbraco-cms/backoffice/external/backend-api";
import { tryExecuteAndNotify as D } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as me } from "@umbraco-cms/backoffice/class-api";
import { diffWords as K } from "@umbraco-cms/backoffice/external/diff";
import { UmbModalBaseElement as _e } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles as te } from "@umbraco-cms/backoffice/style";
import { UmbUserItemRepository as ye } from "@umbraco-cms/backoffice/user";
import { UMB_PROPERTY_DATASET_CONTEXT as ge } from "@umbraco-cms/backoffice/property";
import { UMB_APP_LANGUAGE_CONTEXT as we, UmbLanguageItemRepository as xe } from "@umbraco-cms/backoffice/language";
import { UMB_ENTITY_CONTEXT as ke } from "@umbraco-cms/backoffice/entity";
import { UmbVariantId as Ce } from "@umbraco-cms/backoffice/variant";
import { UMB_ACTION_EVENT_CONTEXT as $e } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as Ve, UmbEntityUpdatedEvent as Ee } from "@umbraco-cms/backoffice/entity-action";
import { UMB_APP_CONTEXT as De } from "@umbraco-cms/backoffice/app";
var b;
class Pe {
  /**
   * Creates an instance of UmbRollbackServerDataSource.
   * @param {UmbControllerHost} host - The controller host for this controller to be appended to
   * @memberof UmbRollbackServerDataSource
   */
  constructor(t) {
    R(this, b);
    q(this, b, t);
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
class ze extends me {
  constructor(i) {
    super(i);
    R(this, m);
    q(this, m, new Pe(this));
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
var Ie = Object.defineProperty, Se = Object.getOwnPropertyDescriptor, ie = (e) => {
  throw TypeError(e);
}, w = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Se(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Ie(t, i, r), r;
}, A = (e, t, i) => t.has(e) || ie("Cannot " + i), f = (e, t, i) => (A(e, t, "read from private field"), i ? i.call(e) : t.get(e)), k = (e, t, i) => t.has(e) ? ie("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Z = (e, t, i, s) => (A(e, t, "write to private field"), t.set(e, i), i), d = (e, t, i) => (A(e, t, "access private method"), i), C, H, P, S, U, c, z, J, X, re, se, ae, N, oe;
let h = class extends _e {
  constructor() {
    super(), k(this, c), this._versions = [], this._selectedCulture = null, this._isInvariant = !0, this._availableVariants = [], this._diffs = [], k(this, C, new ze(this)), k(this, H, new ye(this)), k(this, P, {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit"
    }), k(this, S), k(this, U), this.consumeContext(ge, (e) => {
      Z(this, U, e.getVariantId().culture ?? void 0), d(this, c, z).call(this);
    }), this.consumeContext(we, (e) => {
      Z(this, S, e.getAppCulture()), d(this, c, z).call(this);
    }), this.consumeContext(ke, async (e) => {
      var o;
      if (e.getEntityType() !== Q)
        throw new Error(`Entity type is not ${Q}`);
      const t = e == null ? void 0 : e.getUnique();
      if (!t)
        throw new Error("Document unique is not set");
      const { data: i } = await new be(this).requestByUnique(t);
      if (!i) return;
      this.currentDocument = i;
      const s = ((o = this.currentDocument) == null ? void 0 : o.variants) ?? [];
      this._isInvariant = s.length === 1 && new Ce(s[0].culture).isInvariant(), d(this, c, z).call(this);
      const r = s.map((l) => l.culture).filter((l) => l !== null), { data: a } = await new xe(this).requestItems(r);
      a ? this._availableVariants = a.map((l) => ({
        name: l.name,
        value: l.unique,
        selected: l.unique === this._selectedCulture
      })) : this._availableVariants = [], d(this, c, J).call(this);
    });
  }
  // Change Note - Converted to public method
  async onRollback() {
    var u, _, x;
    if (!this._selectedVersion) return;
    const e = this._selectedVersion.id, t = this._selectedCulture ?? void 0, { error: i } = await f(this, C).rollback(e, t);
    if (i) return;
    const s = (u = this.currentDocument) == null ? void 0 : u.unique, r = (_ = this.currentDocument) == null ? void 0 : _.entityType;
    if (!s || !r)
      throw new Error("Document unique or entity type is not set");
    const a = await this.getContext($e), o = new Ve({ unique: s, entityType: r });
    a.dispatchEvent(o);
    const l = new Ee({ unique: s, entityType: r });
    a.dispatchEvent(l), this.value = {}, (x = this.modalContext) == null || x.submit();
  }
  // Change Note - Converted to public method
  onCancel() {
    var e;
    (e = this.modalContext) == null || e.reject();
  }
  // Change Note - Converted to public method
  renderCultureSelect() {
    return n`
			<uui-select
				id="language-select"
				@change=${d(this, c, ae)}
				.options=${this._availableVariants}></uui-select>
		`;
  }
  // Change Note - Converted to public method
  renderVersions() {
    return this._versions.length ? n` <uui-box id="versions-box" headline=${this.localize.term("rollback_versions")}>
			${F(
      this._versions,
      (e) => e.id,
      (e) => {
        var t;
        return n`
						<div
							@click=${() => d(this, c, re).call(this, e.id)}
							@keydown=${() => {
        }}
							class="rollback-item ${((t = this._selectedVersion) == null ? void 0 : t.id) === e.id ? "active" : ""}">
							<div>
								<p class="rollback-item-date">
									<umb-localize-date date="${e.date}" .options=${f(this, P)}></umb-localize-date>
								</p>
								<p>${e.user}</p>
								<p>${e.isCurrentlyPublishedVersion ? this.localize.term("rollback_currentPublishedVersion") : ""}</p>
							</div>
							<uui-button
								look="secondary"
								@click=${(i) => d(this, c, se).call(this, i, e.id, !e.preventCleanup)}
								label=${e.preventCleanup ? this.localize.term("contentTypeEditor_historyCleanupEnableCleanup") : this.localize.term("contentTypeEditor_historyCleanupPreventCleanup")}></uui-button>
						</div>
					`;
      }
    )}</uui-box
		>` : n`<uui-box headline=${this.localize.term("rollback_versions")}>No versions available</uui-box>`;
  }
  // Change Note - Converted to public method
  renderSelectedVersion() {
    return this._selectedVersion ? n`
			<uui-box headline=${this.currentVersionHeader} id="box-right">
				${pe(this.localize.term("rollback_diffHelp"))}
				<uui-table>
					<uui-table-column style="width: 0"></uui-table-column>
					<uui-table-column></uui-table-column>

					<uui-table-head>
						<uui-table-head-cell>${this.localize.term("general_alias")}</uui-table-head-cell>
						<uui-table-head-cell>${this.localize.term("general_value")}</uui-table-head-cell>
					</uui-table-head>
					${F(
      this._diffs,
      (e) => e.alias,
      (e) => {
        const t = this._diffs.find((i) => (i == null ? void 0 : i.alias) === e.alias);
        return n`
								<uui-table-row>
									<uui-table-cell>${e.alias}</uui-table-cell>
									<uui-table-cell>
										${t ? t.diff.map(
          (i) => i.added ? n`<span class="diff-added">${i.value}</span>` : i.removed ? n`<span class="diff-removed">${i.value}</span>` : i.value
        ) : M}
									</uui-table-cell>
								</uui-table-row>
							`;
      }
    )}
				</uui-table>
			</uui-box>
		` : n`
				<uui-box id="box-right" style="display: flex; align-items: center; justify-content: center;"
					>No selected version</uui-box
				>
			`;
  }
  get currentVersionHeader() {
    var e, t;
    return this.localize.date(((e = this._selectedVersion) == null ? void 0 : e.date) ?? /* @__PURE__ */ new Date(), f(this, P)) + " - " + ((t = this._selectedVersion) == null ? void 0 : t.user);
  }
  render() {
    return n`
			<umb-body-layout headline="Rollback">
				<div id="main">
					<div id="box-left">
						${this._availableVariants.length ? n`
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
C = /* @__PURE__ */ new WeakMap();
H = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakMap();
S = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakSet();
z = function() {
  const e = f(this, U) ?? f(this, S) ?? null;
  this._selectedCulture = this._isInvariant ? null : e;
};
J = async function() {
  var a, o, l;
  if (!((a = this.currentDocument) != null && a.unique))
    throw new Error("Document unique is not set");
  const { data: e } = await f(this, C).requestVersionsByDocumentId(
    (o = this.currentDocument) == null ? void 0 : o.unique,
    this._selectedCulture ?? void 0
  );
  if (!e) return;
  const t = [], i = [...new Set(e == null ? void 0 : e.items.map((u) => u.user.id))], { data: s } = await f(this, H).requestItems(i);
  e == null || e.items.forEach((u) => {
    var _;
    u.isCurrentDraftVersion || t.push({
      date: u.versionDate,
      user: ((_ = s == null ? void 0 : s.find((x) => x.unique === u.user.id)) == null ? void 0 : _.name) || this.localize.term("general_unknownUser"),
      isCurrentlyPublishedVersion: u.isCurrentPublishedVersion,
      id: u.id,
      preventCleanup: u.preventCleanup
    });
  }), this._versions = t;
  const r = (l = t.find((u) => u.isCurrentlyPublishedVersion)) == null ? void 0 : l.id;
  r && d(this, c, X).call(this, r);
};
X = async function(e) {
  var s;
  const t = this._versions.find((r) => r.id === e);
  if (!t) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  const { data: i } = await f(this, C).requestVersionById(e);
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
  }, await d(this, c, oe).call(this);
};
re = function(e) {
  d(this, c, X).call(this, e);
};
se = function(e, t, i) {
  e.preventDefault(), e.stopImmediatePropagation(), f(this, C).setPreventCleanup(t, i);
  const s = this._versions.find((r) => r.id === t);
  s && (s.preventCleanup = i, this.requestUpdate("_versions"));
};
ae = function(e) {
  const t = e.target.value;
  this._selectedCulture = t.toString(), d(this, c, J).call(this);
};
N = function(e) {
  return e.replace(/^['"]|['"]$/g, "");
};
oe = async function() {
  var r, a, o;
  if (!this._selectedVersion) return;
  const e = (r = this.currentDocument) == null ? void 0 : r.values.filter(
    (l) => l.culture === this._selectedCulture || !l.culture
  );
  if (!e)
    throw new Error("Current property values are not set");
  const t = (o = (a = this.currentDocument) == null ? void 0 : a.variants.find((l) => l.culture === this._selectedCulture)) == null ? void 0 : o.name;
  if (!t)
    throw new Error("Current name is not set");
  const i = [], s = K(t, this._selectedVersion.name);
  i.push({ alias: "name", diff: s }), this._selectedVersion.properties.forEach((l) => {
    const u = e.find((he) => he.alias === l.alias);
    if (!u) return;
    const _ = d(this, c, N).call(this, JSON.stringify(u.value)), x = d(this, c, N).call(this, JSON.stringify(l.value)), de = K(_, x);
    i.push({ alias: l.alias, diff: de });
  }), this._diffs = [...i];
};
h.styles = [
  te,
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
  te,
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
      content: "";
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

    #versions-box {
      --uui-box-default-padding: 0;
    }

    .preview-view {
      #main {
        display: grid;
        place-content: start;
        grid-template-columns: 1fr;
        gap: var(--uui-size-space-5);
        container-type: inline-size;
        height: 100%;
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
      grid-template-columns: 1fr 1fr;
      gap: var(--uui-size-space-5);
    }

    .rp-container {
      overflow: hidden;
    }
  `
];
var Te = Object.defineProperty, Re = Object.getOwnPropertyDescriptor, G = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Re(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = (s ? o(t, i, r) : o(r)) || r);
  return s && r && Te(t, i, r), r;
};
const qe = {
  alias: "desktop",
  label: "Desktop",
  demensions: {
    width: 1920,
    height: 1080
  }
};
let V = class extends ve {
  constructor() {
    super(...arguments), this.src = "", this._device = qe;
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
    return this.src ? n`
      <div id="wrapper">
          <iframe src=${this.src}></iframe>
      </div>
    ` : null;
  }
};
V.styles = [
  B`
      :host {
        display: block;
        height: var(--rp-height, auto);
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
  fe({ type: String })
], V.prototype, "src", 2);
G([
  g()
], V.prototype, "_device", 2);
V = G([
  W("rp-iframe")
], V);
var Oe = Object.getOwnPropertyDescriptor, le = (e) => {
  throw TypeError(e);
}, Me = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Oe(t, i) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (r = o(r) || r);
  return r;
}, L = (e, t, i) => t.has(e) || le("Cannot " + i), y = (e, t, i) => (L(e, t, "read from private field"), i ? i.call(e) : t.get(e)), O = (e, t, i) => t.has(e) ? le("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), ne = (e, t, i, s) => (L(e, t, "write to private field"), t.set(e, i), i), ee = (e, t, i) => (L(e, t, "access private method"), i), v, $, I, ue, ce;
let T = class extends h {
  constructor() {
    super(), O(this, I), O(this, v, !1), O(this, $, ""), ee(this, I, ue).call(this);
  }
  renderSelectedVersionVisualPreview() {
    var e, t;
    return this._selectedVersion ? n`
      <uui-box headline=${this.currentVersionHeader} id="box-right">
        <div class="rp-wrapper">
          <div class="rp-container">
            <h3>Current version</h3>
            <rp-iframe
              src="${y(this, $)}/${(e = this.currentDocument) == null ? void 0 : e.unique}"
            >
            </rp-iframe>
          </div>
          <div class="rp-container">
            <h3>Selected version</h3>
            <rp-iframe
              src="${y(this, $)}?cid=${(t = this.currentDocument) == null ? void 0 : t.unique}&vid=${this._selectedVersion.id}"
            ></rp-iframe>
          </div>
        </div>
      </uui-box>
    ` : n`
        <uui-box
          style="display: flex; align-items: center; justify-content: center;"
          >No selected version</uui-box
        >
      `;
  }
  render() {
    return n`
      <umb-body-layout
        headline="Visual Rollback Preview"
        class=${y(this, v) ? "json-view" : "preview-view"}
      >
        <uui-button
          slot="action-menu"
          look="secondary"
          @click=${ee(this, I, ce)}
          style="margin-right:24px"
          label=${y(this, v) ? "Visual difference" : "JSON difference"}
        >
          <uui-icon name="icon-repeat" style="margin-right:4px"></uui-icon>
          ${y(this, v) ? "Visual difference" : "JSON difference"}</uui-button
        >

        <div id="main">
          <div id="box-left">
            ${this._availableVariants.length ? n`
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
            ${y(this, v) ? n` ${this.renderSelectedVersion()} ` : n` ${this.renderSelectedVersionVisualPreview()} `}
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
$ = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakSet();
ue = async function() {
  const e = await this.getContext(De);
  ne(this, $, e.getServerUrl());
};
ce = function() {
  ne(this, v, !y(this, v)), this.requestUpdate();
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
//# sourceMappingURL=rollback-previewer-modal.element-5ve9eboc.js.map
