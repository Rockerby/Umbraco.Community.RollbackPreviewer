import { UMB_ROLLBACK_MODAL } from '@umbraco-cms/backoffice/document';
import { UmbEntityActionBase } from '@umbraco-cms/backoffice/entity-action';
import { umbOpenModal } from '@umbraco-cms/backoffice/modal';
import { UMB_NOTIFICATION_CONTEXT } from '@umbraco-cms/backoffice/notification';
import { UmbLocalizationController } from '@umbraco-cms/backoffice/localization-api';

/** @deprecated Not usable from v19. */
export class YourRollbackDocumentEntityAction extends UmbEntityActionBase<never> {
  #localize = new UmbLocalizationController(this);

  override async execute() {
    await umbOpenModal(this, UMB_ROLLBACK_MODAL, {});
    const notificationContext = await this.getContext(UMB_NOTIFICATION_CONTEXT);
    if (!notificationContext) {
      throw new Error('Notification context not found');
    }
    notificationContext.peek('positive', {
      data: { message: this.#localize.term('rollback_documentRolledBack') },
    });
  }
}

export { YourRollbackDocumentEntityAction as api };