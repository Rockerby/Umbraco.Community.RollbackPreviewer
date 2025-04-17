import { UmbModalToken } from '@umbraco-cms/backoffice/modal';
import type { UmbRollbackModalData, UmbRollbackModalValue } from '../umbraco/rollback/modal/types';


export const RP_ROLLBACK_MODAL_TOKEN = new UmbModalToken<UmbRollbackModalData, UmbRollbackModalValue>('Umb.Modal.Rollback', {
    modal: {
        type: 'sidebar',
        size: 'small'
    }
});
