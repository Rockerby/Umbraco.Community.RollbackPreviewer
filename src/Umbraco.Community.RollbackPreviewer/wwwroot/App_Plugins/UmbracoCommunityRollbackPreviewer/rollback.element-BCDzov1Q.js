import { UMB_DOCUMENT_ENTITY_TYPE as P, UmbDocumentDetailRepository as Y } from "@umbraco-cms/backoffice/document";
import { UmbRollbackRepository as G } from "./rollback.repository-BeMPFVxp.js";
import { diffWords as I } from "@umbraco-cms/backoffice/external/diff";
import { nothing as L, html as f, repeat as J, unsafeHTML as j, css as F, state as y, customElement as Q } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement as K } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles as Z } from "@umbraco-cms/backoffice/style";
import { UmbUserItemRepository as ee } from "@umbraco-cms/backoffice/user";
import { UMB_PROPERTY_DATASET_CONTEXT as te } from "@umbraco-cms/backoffice/property";
import { UMB_APP_LANGUAGE_CONTEXT as ie, UmbLanguageItemRepository as re } from "@umbraco-cms/backoffice/language";
import { UMB_ENTITY_CONTEXT as se } from "@umbraco-cms/backoffice/entity";
import { UmbVariantId as ne } from "@umbraco-cms/backoffice/variant";
import { UMB_ACTION_EVENT_CONTEXT as oe } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as ae, UmbEntityUpdatedEvent as le } from "@umbraco-cms/backoffice/entity-action";
var ue = Object.defineProperty, ce = Object.getOwnPropertyDescriptor, D = (e) => {
  throw TypeError(e);
}, _ = (e, t, i, s) => {
  for (var r = s > 1 ? void 0 : s ? ce(t, i) : t, c = e.length - 1, d; c >= 0; c--)
    (d = e[c]) && (r = (s ? d(t, i, r) : d(r)) || r);
  return s && r && ue(t, i, r), r;
}, $ = (e, t, i) => t.has(e) || D("Cannot " + i), a = (e, t, i) => ($(e, t, "read from private field"), t.get(e)), m = (e, t, i) => t.has(e) ? D("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), E = (e, t, i, s) => ($(e, t, "write to private field"), t.set(e, i), i), l = (e, t, i) => ($(e, t, "access private method"), i), w, T, C, h, V, k, o, g, q, U, R, z, M, S, N, x, O, A, B, W;
let p = class extends K {
  constructor() {
    super(), m(this, o), this._versions = [], this._selectedCulture = null, this._isInvariant = !0, this._availableVariants = [], this._diffs = [], m(this, w, new G(this)), m(this, T, new ee(this)), m(this, C, {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit"
    }), m(this, h), m(this, V), m(this, k), this.consumeContext(te, (e) => {
      E(this, k, e.getVariantId().culture ?? void 0), l(this, o, g).call(this);
    }), this.consumeContext(ie, (e) => {
      E(this, V, e.getAppCulture()), l(this, o, g).call(this);
    }), this.consumeContext(se, async (e) => {
      var d;
      if (e.getEntityType() !== P)
        throw new Error(`Entity type is not ${P}`);
      const t = e == null ? void 0 : e.getUnique();
      if (!t)
        throw new Error("Document unique is not set");
      const { data: i } = await new Y(this).requestByUnique(t);
      if (!i) return;
      E(this, h, i);
      const s = ((d = a(this, h)) == null ? void 0 : d.variants) ?? [];
      this._isInvariant = s.length === 1 && new ne(s[0].culture).isInvariant(), l(this, o, g).call(this);
      const r = s.map((n) => n.culture).filter((n) => n !== null), { data: c } = await new re(this).requestItems(r);
      c ? this._availableVariants = c.map((n) => ({
        name: n.name,
        value: n.unique,
        selected: n.unique === this._selectedCulture
      })) : this._availableVariants = [], l(this, o, q).call(this);
    });
  }
  get currentVersionHeader() {
    var e, t;
    return this.localize.date(((e = this._selectedVersion) == null ? void 0 : e.date) ?? /* @__PURE__ */ new Date(), a(this, C)) + " - " + ((t = this._selectedVersion) == null ? void 0 : t.user);
  }
  render() {
    return f`
			<umb-body-layout headline="Visual Rollback Preview">
				<div id="main">
					<div id="box-left">
						${this._availableVariants.length ? f`
									<uui-box id="language-box" headline=${this.localize.term("general_language")}>
										${l(this, o, O).call(this)}
									</uui-box>
								` : L}
						${l(this, o, A).call(this)}
					${l(this, o, W).call(this)}
					</div>

				</div>
				<umb-footer-layout slot="footer">
					<uui-button
						slot="actions"
						look="secondary"
						@click=${l(this, o, z)}
						label=${this.localize.term("general_cancel")}></uui-button>
					<uui-button
						slot="actions"
						look="primary"
						@click=${l(this, o, R)}
						label=${this.localize.term("actions_rollback")}
						?disabled=${!this._selectedVersion}></uui-button>
				</umb-footer-layout>
			</umb-body-layout>
		`;
  }
};
w = /* @__PURE__ */ new WeakMap();
T = /* @__PURE__ */ new WeakMap();
C = /* @__PURE__ */ new WeakMap();
h = /* @__PURE__ */ new WeakMap();
V = /* @__PURE__ */ new WeakMap();
k = /* @__PURE__ */ new WeakMap();
o = /* @__PURE__ */ new WeakSet();
g = function() {
  const e = a(this, k) ?? a(this, V) ?? null;
  this._selectedCulture = this._isInvariant ? null : e;
};
q = async function() {
  var c, d, n;
  if (!((c = a(this, h)) != null && c.unique))
    throw new Error("Document unique is not set");
  const { data: e } = await a(this, w).requestVersionsByDocumentId(
    (d = a(this, h)) == null ? void 0 : d.unique,
    this._selectedCulture ?? void 0
  );
  if (!e) return;
  const t = [], i = [...new Set(e == null ? void 0 : e.items.map((u) => u.user.id))], { data: s } = await a(this, T).requestItems(i);
  e == null || e.items.forEach((u) => {
    var v;
    u.isCurrentDraftVersion || t.push({
      date: u.versionDate,
      user: ((v = s == null ? void 0 : s.find((b) => b.unique === u.user.id)) == null ? void 0 : v.name) || this.localize.term("general_unknownUser"),
      isCurrentlyPublishedVersion: u.isCurrentPublishedVersion,
      id: u.id,
      preventCleanup: u.preventCleanup
    });
  }), this._versions = t;
  const r = (n = t.find((u) => u.isCurrentlyPublishedVersion)) == null ? void 0 : n.id;
  r && l(this, o, U).call(this, r);
};
U = async function(e) {
  var s;
  const t = this._versions.find((r) => r.id === e);
  if (!t) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  const { data: i } = await a(this, w).requestVersionById(e);
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
  }, await l(this, o, B).call(this);
};
R = async function() {
  var u, v, b;
  if (!this._selectedVersion) return;
  const e = this._selectedVersion.id, t = this._selectedCulture ?? void 0, { error: i } = await a(this, w).rollback(e, t);
  if (i) return;
  const s = (u = a(this, h)) == null ? void 0 : u.unique, r = (v = a(this, h)) == null ? void 0 : v.entityType;
  if (!s || !r)
    throw new Error("Document unique or entity type is not set");
  const c = await this.getContext(oe), d = new ae({ unique: s, entityType: r });
  c.dispatchEvent(d);
  const n = new le({ unique: s, entityType: r });
  c.dispatchEvent(n), (b = this.modalContext) == null || b.submit();
};
z = function() {
  var e;
  (e = this.modalContext) == null || e.reject();
};
M = function(e) {
  l(this, o, U).call(this, e);
};
S = function(e, t, i) {
  e.preventDefault(), e.stopImmediatePropagation(), a(this, w).setPreventCleanup(t, i);
  const s = this._versions.find((r) => r.id === t);
  s && (s.preventCleanup = i, this.requestUpdate("versions"));
};
N = function(e) {
  const t = e.target.value;
  this._selectedCulture = t.toString(), l(this, o, q).call(this);
};
x = function(e) {
  return e.replace(/^['"]|['"]$/g, "");
};
O = function() {
  return f`
			<uui-select
				id="language-select"
				@change=${l(this, o, N)}
				.options=${this._availableVariants}></uui-select>
		`;
};
A = function() {
  return this._versions.length ? f` <uui-box id="versions-box" headline=${this.localize.term("rollback_versions")}>
			${J(
    this._versions,
    (e) => e.id,
    (e) => {
      var t;
      return f`
						<div
							@click=${() => l(this, o, M).call(this, e.id)}
							@keydown=${() => {
      }}
							class="rollback-item ${((t = this._selectedVersion) == null ? void 0 : t.id) === e.id ? "active" : ""}">
							<div>
								<p class="rollback-item-date">
									<umb-localize-date date="${e.date}" .options=${a(this, C)}></umb-localize-date>
								</p>
								<p>${e.user}</p>
								<p>${e.isCurrentlyPublishedVersion ? this.localize.term("rollback_currentPublishedVersion") : ""}</p>
							</div>
							<uui-button
								look="secondary"
								@click=${(i) => l(this, o, S).call(this, i, e.id, !e.preventCleanup)}
								label=${e.preventCleanup ? this.localize.term("contentTypeEditor_historyCleanupEnableCleanup") : this.localize.term("contentTypeEditor_historyCleanupPreventCleanup")}></uui-button>
						</div>
					`;
    }
  )}</uui-box
		>` : f`<uui-box headline=${this.localize.term("rollback_versions")}>No versions available</uui-box>`;
};
B = async function() {
  var r, c, d;
  if (!this._selectedVersion) return;
  const e = (r = a(this, h)) == null ? void 0 : r.values.filter(
    (n) => n.culture === this._selectedCulture || !n.culture
  );
  if (!e)
    throw new Error("Current property values are not set");
  const t = (d = (c = a(this, h)) == null ? void 0 : c.variants.find((n) => n.culture === this._selectedCulture)) == null ? void 0 : d.name;
  if (!t)
    throw new Error("Current name is not set");
  const i = [], s = I(t, this._selectedVersion.name);
  i.push({ alias: "name", diff: s }), this._selectedVersion.properties.forEach((n) => {
    const u = e.find((X) => X.alias === n.alias);
    if (!u) return;
    const v = l(this, o, x).call(this, JSON.stringify(u.value)), b = l(this, o, x).call(this, JSON.stringify(n.value)), H = I(v, b);
    i.push({ alias: n.alias, diff: H });
  }), this._diffs = [...i];
};
W = function() {
  var e, t;
  return console.log("vers", this._selectedVersion), console.log("doc", a(this, h)), this._selectedVersion ? f`
			<uui-box headline=${this.currentVersionHeader} id="box-right">
				<div>
          ${j(this.localize.term("rollback_diffHelp"))}
        </div>
        <div class="rollback-preview-wrapper">
          <div>
            <h3>Current version</h3>
            <div class="iframe-wrapper">
  				    <iframe src="https://localhost:44355/?cid=${(e = a(this, h)) == null ? void 0 : e.unique}"></iframe>
            </div>
          </div>
          <div>
            <h3>Selected version</h3>
            <div class="iframe-wrapper">
    				  <iframe src="https://localhost:44355/?cid=${(t = a(this, h)) == null ? void 0 : t.unique}&vid=${this._selectedVersion.id}"></iframe>
            </div>

          </div>
        </div>
			</uui-box>
		` : f`
				<uui-box id="box-right" style="display: flex; align-items: center; justify-content: center;"
					>No selected version</uui-box
				>
			`;
};
p.styles = [
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
				flex: 1;
				overflow: auto;
				height: 100%;
			}

      .rollback-preview-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--uui-size-space-5);
      }
      .rollback-preview-wrapper .iframe-wrapper {
      }
      .rollback-preview-wrapper .iframe-wrapper iframe {
        width:100%;
        height:600px;
        border: none;
      }

		`
];
_([
  y()
], p.prototype, "_versions", 2);
_([
  y()
], p.prototype, "_selectedVersion", 2);
_([
  y()
], p.prototype, "_selectedCulture", 2);
_([
  y()
], p.prototype, "_isInvariant", 2);
_([
  y()
], p.prototype, "_availableVariants", 2);
_([
  y()
], p.prototype, "_diffs", 2);
p = _([
  Q("pr-rollback-modal")
], p);
const ke = p;
export {
  p as RbpRollbackModalElement,
  ke as default
};
//# sourceMappingURL=rollback.element-BCDzov1Q.js.map
