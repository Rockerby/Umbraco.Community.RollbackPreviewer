import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UmbRollbackModalData {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UmbRollbackModalValue {}


export const MY_MODAL_TOKEN = new UmbModalToken<UmbRollbackModalData, UmbRollbackModalValue>('Umb.Modal.Rollback', {
    modal: {
        type: 'sidebar',
        size: 'small'
    }
});