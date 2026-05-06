var v = (e) => {
  throw TypeError(e);
};
var w = (e, t, r) => t.has(e) || v("Cannot " + r);
var n = (e, t, r) => (w(e, t, "read from private field"), r ? r.call(e) : t.get(e)), d = (e, t, r) => t.has(e) ? v("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), h = (e, t, r, i) => (w(e, t, "write to private field"), i ? i.call(e, r) : t.set(e, r), r);
import { UMB_DOCUMENT_WORKSPACE_CONTEXT as l } from "@umbraco-cms/backoffice/document";
import { UMB_NOTIFICATION_CONTEXT as f } from "@umbraco-cms/backoffice/notification";
import { R as m } from "./bundle.manifests-CCn6FmEI.js";
import { UmbWorkspaceActionBase as g } from "@umbraco-cms/backoffice/workspace";
var o;
class u extends g {
  constructor() {
    super(...arguments);
    //@state() private _isEnabled = false;
    //@state() private _buttonState: string = '';
    //#config: RollbackPreviewerConfigurationResponse | null = null;
    d(this, o);
  }
  /*override connectedCallback() {
      super.connectedCallback();
      this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
          this.#workspaceContext = context;
      });
      this.#loadConfig();
  }*/
  /*async #loadConfig() {
      const config = await RollbackPreviewerConfigService.getConfiguration();
      //this.#config = config;
      this._isEnabled = config?.enableFrontendPreviewAuthorisation ?? false;
  }*/
  // async #execute() {
  async execute() {
    if (h(this, o, await this.getContext(l)), !!n(this, o))
      try {
        var r = await n(this, o).requestSave();
        console.log("Save response:", r);
        const i = await m.getConfiguration();
        if (!i)
          return;
        const a = n(this, o).getUnique();
        if (!a)
          return;
        const c = `${window.location.origin}/ucrbp?cid=${a}&vid=${a}&preview=true`, p = i.frontendPreviewAuthorisationSecret ? `${c}&secret=${encodeURIComponent(i.frontendPreviewAuthorisationSecret)}` : c;
        await navigator.clipboard.writeText(p);
        const s = await this.getContext(f);
        s == null || s.peek("positive", {
          data: {
            headline: "Preview URL copied",
            message: p
          }
        });
      } catch (i) {
        console.error("Save and share failed:", i);
      }
  }
}
o = new WeakMap();
const x = u;
export {
  u as RpSaveAndShareActionElement,
  x as api
};
//# sourceMappingURL=save-and-share-action.element-B3H7AIdH.js.map
