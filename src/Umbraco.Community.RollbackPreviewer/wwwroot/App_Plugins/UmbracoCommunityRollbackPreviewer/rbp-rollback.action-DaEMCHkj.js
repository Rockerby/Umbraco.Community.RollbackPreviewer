var n = (t) => {
  throw TypeError(t);
};
var m = (t, o, i) => o.has(t) || n("Cannot " + i);
var a = (t, o, i) => (m(t, o, "read from private field"), i ? i.call(t) : o.get(t)), r = (t, o, i) => o.has(t) ? n("Cannot add the same private member more than once") : o instanceof WeakSet ? o.add(t) : o.set(t, i);
import { UMB_ROLLBACK_MODAL as c } from "@umbraco-cms/backoffice/document";
import { UmbEntityActionBase as s } from "@umbraco-cms/backoffice/entity-action";
import { umbOpenModal as l } from "@umbraco-cms/backoffice/modal";
import { UMB_NOTIFICATION_CONTEXT as p } from "@umbraco-cms/backoffice/notification";
import { UmbLocalizationController as f } from "@umbraco-cms/backoffice/localization-api";
var e;
class h extends s {
  constructor() {
    super(...arguments);
    r(this, e, new f(this));
  }
  async execute() {
    await l(this, c, {});
    const i = await this.getContext(p);
    if (!i)
      throw new Error("Notification context not found");
    i.peek("positive", {
      data: { message: a(this, e).term("rollback_documentRolledBack") }
    });
  }
}
e = new WeakMap();
export {
  h as YourRollbackDocumentEntityAction,
  h as api
};
//# sourceMappingURL=rbp-rollback.action-DaEMCHkj.js.map
