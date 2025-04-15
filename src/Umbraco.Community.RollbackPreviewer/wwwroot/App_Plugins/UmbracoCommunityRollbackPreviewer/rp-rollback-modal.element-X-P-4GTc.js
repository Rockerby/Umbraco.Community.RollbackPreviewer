var W = (e) => {
  throw TypeError(e);
};
var H = (e, t, i) => t.has(e) || W("Cannot " + i);
var p = (e, t, i) => (H(e, t, "read from private field"), i ? i.call(e) : t.get(e)), U = (e, t, i) => t.has(e) ? W("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), P = (e, t, i, r) => (H(e, t, "write to private field"), r ? r.call(e, i) : t.set(e, i), i);
import { css as F, html as n, repeat as G, unsafeHTML as Q, nothing as T, state as x, customElement as K } from "@umbraco-cms/backoffice/external/lit";
import { UmbTextStyles as Z } from "@umbraco-cms/backoffice/style";
import { UMB_DOCUMENT_ENTITY_TYPE as J, UmbDocumentDetailRepository as ne } from "@umbraco-cms/backoffice/document";
import { DocumentVersionService as C } from "@umbraco-cms/backoffice/external/backend-api";
import { tryExecuteAndNotify as $ } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as ue } from "@umbraco-cms/backoffice/class-api";
import { diffWords as X } from "@umbraco-cms/backoffice/external/diff";
import { UmbModalBaseElement as ce } from "@umbraco-cms/backoffice/modal";
import { UmbUserItemRepository as de } from "@umbraco-cms/backoffice/user";
import { UMB_PROPERTY_DATASET_CONTEXT as he } from "@umbraco-cms/backoffice/property";
import { UMB_APP_LANGUAGE_CONTEXT as pe, UmbLanguageItemRepository as be } from "@umbraco-cms/backoffice/language";
import { UMB_ENTITY_CONTEXT as fe } from "@umbraco-cms/backoffice/entity";
import { UmbVariantId as ve } from "@umbraco-cms/backoffice/variant";
import { UMB_ACTION_EVENT_CONTEXT as me } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as _e, UmbEntityUpdatedEvent as ye } from "@umbraco-cms/backoffice/entity-action";
const ge = [
  Z,
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
      display: grid;
      grid-template-columns: 500px 1fr;
      gap: var(--uui-size-space-5);
      width: 100%;
      height: 100%;
    }
    .preview-view #main {
      flex-direction: column;
      grid-template-columns: 1fr;
    }
    .preview-view #box-left {
      height: 300px;
      max-width: 100%;
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
    }

    .rollback-preview-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--uui-size-space-5);
    }
    .rollback-preview-wrapper .iframe-wrapper {
    }
    .rollback-preview-wrapper .iframe-wrapper iframe {
      width: 100%;
      height: 600px;
      border: none;
    }
  `
];
var f;
class we {
  /**
   * Creates an instance of UmbRollbackServerDataSource.
   * @param {UmbControllerHost} host - The controller host for this controller to be appended to
   * @memberof UmbRollbackServerDataSource
   */
  constructor(t) {
    U(this, f);
    P(this, f, t);
  }
  /**
   * Get a list of versions for a document
   * @param id
   * @param culture
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionsByDocumentId(t, i) {
    return $(p(this, f), C.getDocumentVersion({ documentId: t, culture: i }));
  }
  /**
   * Get a specific version by id
   * @param versionId
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionById(t) {
    return $(p(this, f), C.getDocumentVersionById({ id: t }));
  }
  setPreventCleanup(t, i) {
    return $(
      p(this, f),
      C.putDocumentVersionByIdPreventCleanup({ id: t, preventCleanup: i })
    );
  }
  rollback(t, i) {
    return $(
      p(this, f),
      C.postDocumentVersionByIdRollback({ id: t, culture: i })
    );
  }
}
f = new WeakMap();
var v;
class ke extends ue {
  constructor(i) {
    super(i);
    U(this, v);
    P(this, v, new we(this));
  }
  async requestVersionsByDocumentId(i, r) {
    return await p(this, v).getVersionsByDocumentId(i, r);
  }
  async requestVersionById(i) {
    return await p(this, v).getVersionById(i);
  }
  async setPreventCleanup(i, r) {
    return await p(this, v).setPreventCleanup(i, r);
  }
  async rollback(i, r) {
    return await p(this, v).rollback(i, r);
  }
}
v = new WeakMap();
var xe = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, j = (e) => {
  throw TypeError(e);
}, y = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? Ve(t, i) : t, o = e.length - 1, l; o >= 0; o--)
    (l = e[o]) && (a = (r ? l(t, i, a) : l(a)) || a);
  return r && a && xe(t, i, a), a;
}, M = (e, t, i) => t.has(e) || j("Cannot " + i), b = (e, t, i) => (M(e, t, "read from private field"), i ? i.call(e) : t.get(e)), w = (e, t, i) => t.has(e) ? j("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Y = (e, t, i, r) => (M(e, t, "write to private field"), t.set(e, i), i), d = (e, t, i) => (M(e, t, "access private method"), i), k, B, E, S, z, c, D, N, O, ee, te, ie, q, re;
let h = class extends ce {
  constructor() {
    super(), w(this, c), this._versions = [], this._selectedCulture = null, this._isInvariant = !0, this._availableVariants = [], this._diffs = [], w(this, k, new ke(this)), w(this, B, new de(this)), w(this, E, {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit"
    }), w(this, S), w(this, z), this.consumeContext(he, (e) => {
      Y(this, z, e.getVariantId().culture ?? void 0), d(this, c, D).call(this);
    }), this.consumeContext(pe, (e) => {
      Y(this, S, e.getAppCulture()), d(this, c, D).call(this);
    }), this.consumeContext(fe, async (e) => {
      var l;
      if (e.getEntityType() !== J)
        throw new Error(`Entity type is not ${J}`);
      const t = e == null ? void 0 : e.getUnique();
      if (!t)
        throw new Error("Document unique is not set");
      const { data: i } = await new ne(this).requestByUnique(t);
      if (!i) return;
      this.currentDocument = i;
      const r = ((l = this.currentDocument) == null ? void 0 : l.variants) ?? [];
      this._isInvariant = r.length === 1 && new ve(r[0].culture).isInvariant(), d(this, c, D).call(this);
      const a = r.map((s) => s.culture).filter((s) => s !== null), { data: o } = await new be(this).requestItems(a);
      o ? this._availableVariants = o.map((s) => ({
        name: s.name,
        value: s.unique,
        selected: s.unique === this._selectedCulture
      })) : this._availableVariants = [], d(this, c, N).call(this);
    });
  }
  // Change Note - Converted to public method
  async onRollback() {
    var u, _, g;
    if (!this._selectedVersion) return;
    const e = this._selectedVersion.id, t = this._selectedCulture ?? void 0, { error: i } = await b(this, k).rollback(e, t);
    if (i) return;
    const r = (u = this.currentDocument) == null ? void 0 : u.unique, a = (_ = this.currentDocument) == null ? void 0 : _.entityType;
    if (!r || !a)
      throw new Error("Document unique or entity type is not set");
    const o = await this.getContext(me), l = new _e({ unique: r, entityType: a });
    o.dispatchEvent(l);
    const s = new ye({ unique: r, entityType: a });
    o.dispatchEvent(s), this.value = {}, (g = this.modalContext) == null || g.submit();
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
				@change=${d(this, c, ie)}
				.options=${this._availableVariants}></uui-select>
		`;
  }
  // Change Note - Converted to public method
  renderVersions() {
    return this._versions.length ? n` <uui-box id="versions-box" headline=${this.localize.term("rollback_versions")}>
			${G(
      this._versions,
      (e) => e.id,
      (e) => {
        var t;
        return n`
						<div
							@click=${() => d(this, c, ee).call(this, e.id)}
							@keydown=${() => {
        }}
							class="rollback-item ${((t = this._selectedVersion) == null ? void 0 : t.id) === e.id ? "active" : ""}">
							<div>
								<p class="rollback-item-date">
									<umb-localize-date date="${e.date}" .options=${b(this, E)}></umb-localize-date>
								</p>
								<p>${e.user}</p>
								<p>${e.isCurrentlyPublishedVersion ? this.localize.term("rollback_currentPublishedVersion") : ""}</p>
							</div>
							<uui-button
								look="secondary"
								@click=${(i) => d(this, c, te).call(this, i, e.id, !e.preventCleanup)}
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
				${Q(this.localize.term("rollback_diffHelp"))}
				<uui-table>
					<uui-table-column style="width: 0"></uui-table-column>
					<uui-table-column></uui-table-column>

					<uui-table-head>
						<uui-table-head-cell>${this.localize.term("general_alias")}</uui-table-head-cell>
						<uui-table-head-cell>${this.localize.term("general_value")}</uui-table-head-cell>
					</uui-table-head>
					${G(
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
        ) : T}
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
    return this.localize.date(((e = this._selectedVersion) == null ? void 0 : e.date) ?? /* @__PURE__ */ new Date(), b(this, E)) + " - " + ((t = this._selectedVersion) == null ? void 0 : t.user);
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
								` : T}
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
B = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakMap();
S = /* @__PURE__ */ new WeakMap();
z = /* @__PURE__ */ new WeakMap();
c = /* @__PURE__ */ new WeakSet();
D = function() {
  const e = b(this, z) ?? b(this, S) ?? null;
  this._selectedCulture = this._isInvariant ? null : e;
};
N = async function() {
  var o, l, s;
  if (!((o = this.currentDocument) != null && o.unique))
    throw new Error("Document unique is not set");
  const { data: e } = await b(this, k).requestVersionsByDocumentId(
    (l = this.currentDocument) == null ? void 0 : l.unique,
    this._selectedCulture ?? void 0
  );
  if (!e) return;
  const t = [], i = [...new Set(e == null ? void 0 : e.items.map((u) => u.user.id))], { data: r } = await b(this, B).requestItems(i);
  e == null || e.items.forEach((u) => {
    var _;
    u.isCurrentDraftVersion || t.push({
      date: u.versionDate,
      user: ((_ = r == null ? void 0 : r.find((g) => g.unique === u.user.id)) == null ? void 0 : _.name) || this.localize.term("general_unknownUser"),
      isCurrentlyPublishedVersion: u.isCurrentPublishedVersion,
      id: u.id,
      preventCleanup: u.preventCleanup
    });
  }), this._versions = t;
  const a = (s = t.find((u) => u.isCurrentlyPublishedVersion)) == null ? void 0 : s.id;
  a && d(this, c, O).call(this, a);
};
O = async function(e) {
  var r;
  const t = this._versions.find((a) => a.id === e);
  if (!t) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  const { data: i } = await b(this, k).requestVersionById(e);
  if (!i) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  this._selectedVersion = {
    date: t.date,
    user: t.user,
    name: ((r = i.variants.find((a) => a.culture === this._selectedCulture)) == null ? void 0 : r.name) || i.variants[0].name,
    id: i.id,
    properties: i.values.filter((a) => a.culture === this._selectedCulture || !a.culture).map((a) => ({
      alias: a.alias,
      value: a.value
    }))
  }, await d(this, c, re).call(this);
};
ee = function(e) {
  d(this, c, O).call(this, e);
};
te = function(e, t, i) {
  e.preventDefault(), e.stopImmediatePropagation(), b(this, k).setPreventCleanup(t, i);
  const r = this._versions.find((a) => a.id === t);
  r && (r.preventCleanup = i, this.requestUpdate("_versions"));
};
ie = function(e) {
  const t = e.target.value;
  this._selectedCulture = t.toString(), d(this, c, N).call(this);
};
q = function(e) {
  return e.replace(/^['"]|['"]$/g, "");
};
re = async function() {
  var a, o, l;
  if (!this._selectedVersion) return;
  const e = (a = this.currentDocument) == null ? void 0 : a.values.filter(
    (s) => s.culture === this._selectedCulture || !s.culture
  );
  if (!e)
    throw new Error("Current property values are not set");
  const t = (l = (o = this.currentDocument) == null ? void 0 : o.variants.find((s) => s.culture === this._selectedCulture)) == null ? void 0 : l.name;
  if (!t)
    throw new Error("Current name is not set");
  const i = [], r = X(t, this._selectedVersion.name);
  i.push({ alias: "name", diff: r }), this._selectedVersion.properties.forEach((s) => {
    const u = e.find((le) => le.alias === s.alias);
    if (!u) return;
    const _ = d(this, c, q).call(this, JSON.stringify(u.value)), g = d(this, c, q).call(this, JSON.stringify(s.value)), oe = X(_, g);
    i.push({ alias: s.alias, diff: oe });
  }), this._diffs = [...i];
};
h.styles = [
  Z,
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
y([
  x()
], h.prototype, "_versions", 2);
y([
  x()
], h.prototype, "_selectedVersion", 2);
y([
  x()
], h.prototype, "_selectedCulture", 2);
y([
  x()
], h.prototype, "_isInvariant", 2);
y([
  x()
], h.prototype, "_availableVariants", 2);
y([
  x()
], h.prototype, "_diffs", 2);
h = y([
  K("umb-rollback-modal")
], h);
var Ce = Object.getOwnPropertyDescriptor, ae = (e) => {
  throw TypeError(e);
}, $e = (e, t, i, r) => {
  for (var a = r > 1 ? void 0 : r ? Ce(t, i) : t, o = e.length - 1, l; o >= 0; o--)
    (l = e[o]) && (a = l(a) || a);
  return a;
}, A = (e, t, i) => t.has(e) || ae("Cannot " + i), V = (e, t, i) => (A(e, t, "read from private field"), i ? i.call(e) : t.get(e)), L = (e, t, i) => t.has(e) ? ae("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), Ee = (e, t, i, r) => (A(e, t, "write to private field"), t.set(e, i), i), De = (e, t, i) => (A(e, t, "access private method"), i), m, R, se;
let I = class extends h {
  constructor() {
    super(), L(this, R), L(this, m, !1);
  }
  renderSelectedVersionVisualPreview() {
    var e, t;
    return this._selectedVersion ? n`
			<uui-box headline=${this.currentVersionHeader} id="box-right">
				 <div>
           ${Q(this.localize.term("rollback_diffHelp"))}
         </div>
        <div class="rollback-preview-wrapper">
          <div>
            <h3>Current version</h3>
            <div class="iframe-wrapper">
  				    <iframe src="https://localhost:44355/?cid=${(e = this.currentDocument) == null ? void 0 : e.unique}"></iframe>
            </div>
          </div>
          <div>
            <h3>Selected version</h3>
            <div class="iframe-wrapper">
    				  <iframe src="https://localhost:44355/?cid=${(t = this.currentDocument) == null ? void 0 : t.unique}&vid=${this._selectedVersion.id}"></iframe>
            </div>

          </div>
        </div>
			</uui-box>
		` : n`
				<uui-box style="display: flex; align-items: center; justify-content: center;"
					>No selected version</uui-box
				>
			`;
  }
  render() {
    return n`
			<umb-body-layout headline="Visual Rollback Preview" class=${V(this, m) ? "json-view" : "preview-view"}>
      <uui-button slot="action-menu" look="secondary" @click=${De(this, R, se)} style="margin-right:24px">
        <uui-icon name="icon-repeat" style="margin-right:4px"></uui-icon> ${V(this, m) ? "Visual difference" : "JSON difference"}</uui-button>

				<div id="main">
					<div id="box-left">
						${this._availableVariants.length ? n`
									<uui-box id="language-box" headline=${this.localize.term("general_language")}>
										${this.renderCultureSelect()}
									</uui-box>
								` : T}
						${this.renderVersions()}
					</div>
					<div id="box-right">

            ${V(this, m) ? n`
              ${this.renderSelectedVersion()}
              ` : n`
              ${this.renderSelectedVersionVisualPreview()}
            `}
					</div>

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
m = /* @__PURE__ */ new WeakMap();
R = /* @__PURE__ */ new WeakSet();
se = function() {
  Ee(this, m, !V(this, m)), console.log(V(this, m)), this.requestUpdate();
};
I.styles = ge;
I = $e([
  K("rp-rollback-modal")
], I);
const Je = I;
export {
  I as RpRollbackModalElement,
  Je as default
};
//# sourceMappingURL=rp-rollback-modal.element-X-P-4GTc.js.map
