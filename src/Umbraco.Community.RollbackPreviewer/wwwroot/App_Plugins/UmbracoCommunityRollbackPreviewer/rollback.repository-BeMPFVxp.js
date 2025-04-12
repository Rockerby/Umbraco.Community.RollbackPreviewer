var d = (r) => {
  throw TypeError(r);
};
var m = (r, t, e) => t.has(r) || d("Cannot " + e);
var s = (r, t, e) => (m(r, t, "read from private field"), e ? e.call(r) : t.get(r)), c = (r, t, e) => t.has(r) ? d("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(r) : t.set(r, e), l = (r, t, e, n) => (m(r, t, "write to private field"), n ? n.call(r, e) : t.set(r, e), e);
import { DocumentVersionService as a } from "@umbraco-cms/backoffice/external/backend-api";
import { tryExecuteAndNotify as u } from "@umbraco-cms/backoffice/resources";
import { UmbControllerBase as y } from "@umbraco-cms/backoffice/class-api";
var o;
class h {
  /**
   * Creates an instance of UmbRollbackServerDataSource.
   * @param {UmbControllerHost} host - The controller host for this controller to be appended to
   * @memberof UmbRollbackServerDataSource
   */
  constructor(t) {
    c(this, o);
    l(this, o, t);
  }
  /**
   * Get a list of versions for a document
   * @param id
   * @param culture
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionsByDocumentId(t, e) {
    return u(s(this, o), a.getDocumentVersion({ documentId: t, culture: e }));
  }
  /**
   * Get a specific version by id
   * @param versionId
   * @returns {*}
   * @memberof UmbRollbackServerDataSource
   */
  getVersionById(t) {
    return u(s(this, o), a.getDocumentVersionById({ id: t }));
  }
  setPreventCleanup(t, e) {
    return u(
      s(this, o),
      a.putDocumentVersionByIdPreventCleanup({ id: t, preventCleanup: e })
    );
  }
  rollback(t, e) {
    return u(
      s(this, o),
      a.postDocumentVersionByIdRollback({ id: t, culture: e })
    );
  }
}
o = new WeakMap();
var i;
class b extends y {
  constructor(e) {
    super(e);
    c(this, i);
    l(this, i, new h(this));
  }
  async requestVersionsByDocumentId(e, n) {
    return await s(this, i).getVersionsByDocumentId(e, n);
  }
  async requestVersionById(e) {
    return await s(this, i).getVersionById(e);
  }
  async setPreventCleanup(e, n) {
    return await s(this, i).setPreventCleanup(e, n);
  }
  async rollback(e, n) {
    return await s(this, i).rollback(e, n);
  }
}
i = new WeakMap();
export {
  b as UmbRollbackRepository,
  b as default
};
//# sourceMappingURL=rollback.repository-BeMPFVxp.js.map
