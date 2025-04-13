import { UMB_DOCUMENT_ENTITY_TYPE as P, UmbDocumentDetailRepository as Q } from "@umbraco-cms/backoffice/document";
import { UmbRollbackRepository as K } from "./rollback.repository-BeMPFVxp.js";
import { diffWords as I } from "@umbraco-cms/backoffice/external/diff";
import { nothing as D, html as d, repeat as M, unsafeHTML as R, css as Z, state as y, customElement as ee } from "@umbraco-cms/backoffice/external/lit";
import { UmbModalBaseElement as te } from "@umbraco-cms/backoffice/modal";
import { UmbTextStyles as ie } from "@umbraco-cms/backoffice/style";
import { UmbUserItemRepository as se } from "@umbraco-cms/backoffice/user";
import { UMB_PROPERTY_DATASET_CONTEXT as re } from "@umbraco-cms/backoffice/property";
import { UMB_APP_LANGUAGE_CONTEXT as ne, UmbLanguageItemRepository as ae } from "@umbraco-cms/backoffice/language";
import { UMB_ENTITY_CONTEXT as le } from "@umbraco-cms/backoffice/entity";
import { UmbVariantId as oe } from "@umbraco-cms/backoffice/variant";
import { UMB_ACTION_EVENT_CONTEXT as ue } from "@umbraco-cms/backoffice/action";
import { UmbRequestReloadStructureForEntityEvent as ce, UmbEntityUpdatedEvent as de } from "@umbraco-cms/backoffice/entity-action";
var he = Object.defineProperty, pe = Object.getOwnPropertyDescriptor, S = (e) => {
  throw TypeError(e);
}, _ = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? pe(t, i) : t, c = e.length - 1, h; c >= 0; c--)
    (h = e[c]) && (s = (r ? h(t, i, s) : h(s)) || s);
  return r && s && he(t, i, s), s;
}, T = (e, t, i) => t.has(e) || S("Cannot " + i), n = (e, t, i) => (T(e, t, "read from private field"), t.get(e)), v = (e, t, i) => t.has(e) ? S("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, i), C = (e, t, i, r) => (T(e, t, "write to private field"), t.set(e, i), i), o = (e, t, i) => (T(e, t, "access private method"), i), g, q, k, p, x, $, m, a, V, U, z, N, O, W, A, B, H, E, J, X, Y, j, G;
let f = class extends te {
  constructor() {
    super(), v(this, a), this._versions = [], this._selectedCulture = null, this._isInvariant = !0, this._availableVariants = [], this._diffs = [], v(this, g, new K(this)), v(this, q, new se(this)), v(this, k, {
      day: "numeric",
      month: "long",
      hour: "numeric",
      minute: "2-digit"
    }), v(this, p), v(this, x), v(this, $), v(this, m, !1), this.consumeContext(re, (e) => {
      C(this, $, e.getVariantId().culture ?? void 0), o(this, a, V).call(this);
    }), this.consumeContext(ne, (e) => {
      C(this, x, e.getAppCulture()), o(this, a, V).call(this);
    }), this.consumeContext(le, async (e) => {
      var h;
      if (e.getEntityType() !== P)
        throw new Error(`Entity type is not ${P}`);
      const t = e == null ? void 0 : e.getUnique();
      if (!t)
        throw new Error("Document unique is not set");
      const { data: i } = await new Q(this).requestByUnique(t);
      if (!i) return;
      C(this, p, i);
      const r = ((h = n(this, p)) == null ? void 0 : h.variants) ?? [];
      this._isInvariant = r.length === 1 && new oe(r[0].culture).isInvariant(), o(this, a, V).call(this);
      const s = r.map((l) => l.culture).filter((l) => l !== null), { data: c } = await new ae(this).requestItems(s);
      c ? this._availableVariants = c.map((l) => ({
        name: l.name,
        value: l.unique,
        selected: l.unique === this._selectedCulture
      })) : this._availableVariants = [], o(this, a, U).call(this);
    });
  }
  get currentVersionHeader() {
    var e, t;
    return this.localize.date(((e = this._selectedVersion) == null ? void 0 : e.date) ?? /* @__PURE__ */ new Date(), n(this, k)) + " - " + ((t = this._selectedVersion) == null ? void 0 : t.user);
  }
  render() {
    return d`
			<umb-body-layout headline="Visual Rollback Preview" class=${n(this, m) ? "json-view" : "preview-view"}>
      <uui-button slot="action-menu" look="secondary" @click=${o(this, a, W)} style="margin-right:24px">
        <uui-icon name="icon-repeat" style="margin-right:4px"></uui-icon> ${n(this, m) ? "Visual difference" : "JSON difference"}</uui-button>

				<div id="main">
					<div id="box-left">
						${this._availableVariants.length ? d`
									<uui-box id="language-box" headline=${this.localize.term("general_language")}>
										${o(this, a, J).call(this)}
									</uui-box>
								` : D}
						${o(this, a, X).call(this)}
					</div>
					<div id="box-right">
            
            ${n(this, m) ? d`
              ${o(this, a, j).call(this)}
              ` : d`
              ${o(this, a, G).call(this)}
            `}
					</div>

				</div>
				<umb-footer-layout slot="footer">
					<uui-button
						slot="actions"
						look="secondary"
						@click=${o(this, a, O)}
						label=${this.localize.term("general_cancel")}></uui-button>
					<uui-button
						slot="actions"
						look="primary"
						@click=${o(this, a, N)}
						label=${this.localize.term("actions_rollback")}
						?disabled=${!this._selectedVersion}></uui-button>
				</umb-footer-layout>
			</umb-body-layout>
		`;
  }
};
g = /* @__PURE__ */ new WeakMap();
q = /* @__PURE__ */ new WeakMap();
k = /* @__PURE__ */ new WeakMap();
p = /* @__PURE__ */ new WeakMap();
x = /* @__PURE__ */ new WeakMap();
$ = /* @__PURE__ */ new WeakMap();
m = /* @__PURE__ */ new WeakMap();
a = /* @__PURE__ */ new WeakSet();
V = function() {
  const e = n(this, $) ?? n(this, x) ?? null;
  this._selectedCulture = this._isInvariant ? null : e;
};
U = async function() {
  var c, h, l;
  if (!((c = n(this, p)) != null && c.unique))
    throw new Error("Document unique is not set");
  const { data: e } = await n(this, g).requestVersionsByDocumentId(
    (h = n(this, p)) == null ? void 0 : h.unique,
    this._selectedCulture ?? void 0
  );
  if (!e) return;
  const t = [], i = [...new Set(e == null ? void 0 : e.items.map((u) => u.user.id))], { data: r } = await n(this, q).requestItems(i);
  e == null || e.items.forEach((u) => {
    var b;
    u.isCurrentDraftVersion || t.push({
      date: u.versionDate,
      user: ((b = r == null ? void 0 : r.find((w) => w.unique === u.user.id)) == null ? void 0 : b.name) || this.localize.term("general_unknownUser"),
      isCurrentlyPublishedVersion: u.isCurrentPublishedVersion,
      id: u.id,
      preventCleanup: u.preventCleanup
    });
  }), this._versions = t;
  const s = (l = t.find((u) => u.isCurrentlyPublishedVersion)) == null ? void 0 : l.id;
  s && o(this, a, z).call(this, s);
};
z = async function(e) {
  var r;
  const t = this._versions.find((s) => s.id === e);
  if (!t) {
    this._selectedVersion = void 0, this._diffs = [];
    return;
  }
  const { data: i } = await n(this, g).requestVersionById(e);
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
  }, await o(this, a, Y).call(this);
};
N = async function() {
  var u, b, w;
  if (!this._selectedVersion) return;
  const e = this._selectedVersion.id, t = this._selectedCulture ?? void 0, { error: i } = await n(this, g).rollback(e, t);
  if (i) return;
  const r = (u = n(this, p)) == null ? void 0 : u.unique, s = (b = n(this, p)) == null ? void 0 : b.entityType;
  if (!r || !s)
    throw new Error("Document unique or entity type is not set");
  const c = await this.getContext(ue), h = new ce({ unique: r, entityType: s });
  c.dispatchEvent(h);
  const l = new de({ unique: r, entityType: s });
  c.dispatchEvent(l), (w = this.modalContext) == null || w.submit();
};
O = function() {
  var e;
  (e = this.modalContext) == null || e.reject();
};
W = function() {
  C(this, m, !n(this, m)), console.log(n(this, m)), this.requestUpdate();
};
A = function(e) {
  o(this, a, z).call(this, e);
};
B = function(e, t, i) {
  e.preventDefault(), e.stopImmediatePropagation(), n(this, g).setPreventCleanup(t, i);
  const r = this._versions.find((s) => s.id === t);
  r && (r.preventCleanup = i, this.requestUpdate("versions"));
};
H = function(e) {
  const t = e.target.value;
  this._selectedCulture = t.toString(), o(this, a, U).call(this);
};
E = function(e) {
  return e.replace(/^['"]|['"]$/g, "");
};
J = function() {
  return d`
			<uui-select
				id="language-select"
				@change=${o(this, a, H)}
				.options=${this._availableVariants}></uui-select>
		`;
};
X = function() {
  return this._versions.length ? d` <uui-box id="versions-box" headline=${this.localize.term("rollback_versions")}>
			${M(
    this._versions,
    (e) => e.id,
    (e) => {
      var t;
      return d`
						<div
							@click=${() => o(this, a, A).call(this, e.id)}
							@keydown=${() => {
      }}
							class="rollback-item ${((t = this._selectedVersion) == null ? void 0 : t.id) === e.id ? "active" : ""}">
							<div>
								<p class="rollback-item-date">
									<umb-localize-date date="${e.date}" .options=${n(this, k)}></umb-localize-date>
								</p>
								<p>${e.user}</p>
								<p>${e.isCurrentlyPublishedVersion ? this.localize.term("rollback_currentPublishedVersion") : ""}</p>
							</div>
							<uui-button
								look="secondary"
								@click=${(i) => o(this, a, B).call(this, i, e.id, !e.preventCleanup)}
								label=${e.preventCleanup ? this.localize.term("contentTypeEditor_historyCleanupEnableCleanup") : this.localize.term("contentTypeEditor_historyCleanupPreventCleanup")}></uui-button>
						</div>
					`;
    }
  )}</uui-box
		>` : d`<uui-box headline=${this.localize.term("rollback_versions")}>No versions available</uui-box>`;
};
Y = async function() {
  var s, c, h;
  if (!this._selectedVersion) return;
  const e = (s = n(this, p)) == null ? void 0 : s.values.filter(
    (l) => l.culture === this._selectedCulture || !l.culture
  );
  if (!e)
    throw new Error("Current property values are not set");
  const t = (h = (c = n(this, p)) == null ? void 0 : c.variants.find((l) => l.culture === this._selectedCulture)) == null ? void 0 : h.name;
  if (!t)
    throw new Error("Current name is not set");
  const i = [], r = I(t, this._selectedVersion.name);
  i.push({ alias: "name", diff: r }), this._selectedVersion.properties.forEach((l) => {
    const u = e.find((F) => F.alias === l.alias);
    if (!u) return;
    const b = o(this, a, E).call(this, JSON.stringify(u.value)), w = o(this, a, E).call(this, JSON.stringify(l.value)), L = I(b, w);
    i.push({ alias: l.alias, diff: L });
  }), this._diffs = [...i];
};
j = function() {
  return this._selectedVersion ? d`
			<uui-box headline=${this.currentVersionHeader}>
				${R(this.localize.term("rollback_diffHelp"))}
				<uui-table>
					<uui-table-column style="width: 0"></uui-table-column>
					<uui-table-column></uui-table-column>

					<uui-table-head>
						<uui-table-head-cell>${this.localize.term("general_alias")}</uui-table-head-cell>
						<uui-table-head-cell>${this.localize.term("general_value")}</uui-table-head-cell>
					</uui-table-head>
					${M(
    this._diffs,
    (e) => e.alias,
    (e) => {
      const t = this._diffs.find((i) => (i == null ? void 0 : i.alias) === e.alias);
      return d`
								<uui-table-row>
									<uui-table-cell>${e.alias}</uui-table-cell>
									<uui-table-cell>
										${t ? t.diff.map(
        (i) => i.added ? d`<span class="diff-added">${i.value}</span>` : i.removed ? d`<span class="diff-removed">${i.value}</span>` : i.value
      ) : D}
									</uui-table-cell>
								</uui-table-row>
							`;
    }
  )}
				</uui-table>
			</uui-box>
		` : d`
				<uui-box style="display: flex; align-items: center; justify-content: center;"
					>No selected version</uui-box
				>
			`;
};
G = function() {
  var e, t;
  return this._selectedVersion ? d`
			<uui-box headline=${this.currentVersionHeader} id="box-right">
				<div>
          ${R(this.localize.term("rollback_diffHelp"))}
        </div>
        <div class="rollback-preview-wrapper">
          <div>
            <h3>Current version</h3>
            <div class="iframe-wrapper">
  				    <iframe src="https://localhost:44355/?cid=${(e = n(this, p)) == null ? void 0 : e.unique}"></iframe>
            </div>
          </div>
          <div>
            <h3>Selected version</h3>
            <div class="iframe-wrapper">
    				  <iframe src="https://localhost:44355/?cid=${(t = n(this, p)) == null ? void 0 : t.unique}&vid=${this._selectedVersion.id}"></iframe>
            </div>

          </div>
        </div>
			</uui-box>
		` : d`
				<uui-box style="display: flex; align-items: center; justify-content: center;"
					>No selected version</uui-box
				>
			`;
};
f.styles = [
  ie,
  Z`
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
        display: grid;
        grid-template-columns: 500px 1fr;
				gap: var(--uui-size-space-5);
				width: 100%;
				height: 100%;
			}
      .preview-view #main {
        flex-direction:column;
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
        width:100%;
        height:600px;
        border: none;
      }

		`
];
_([
  y()
], f.prototype, "_versions", 2);
_([
  y()
], f.prototype, "_selectedVersion", 2);
_([
  y()
], f.prototype, "_selectedCulture", 2);
_([
  y()
], f.prototype, "_isInvariant", 2);
_([
  y()
], f.prototype, "_availableVariants", 2);
_([
  y()
], f.prototype, "_diffs", 2);
f = _([
  ee("pr-rollback-modal")
], f);
const Ee = f;
export {
  f as RbpRollbackModalElement,
  Ee as default
};
//# sourceMappingURL=rollback.element-BFiYJxuL.js.map
