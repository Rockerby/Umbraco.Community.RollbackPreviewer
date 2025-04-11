import { customElement, html } from '@umbraco-cms/backoffice/external/lit';
import { UmbRollbackModalData, UmbRollbackModalValue } from './token';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';


@customElement('pr-rollback-modal')
export class RbpRollbackModalElement extends UmbModalBaseElement<UmbRollbackModalData, UmbRollbackModalValue> {

  render() {
    return html`
        <div>
            <h1>Default headline</h1>
        </div>
    `;
  }
}
export default RbpRollbackModalElement;

declare global {
  interface HTMLElementTagNameMap {
    'pr-rollback-modal': RbpRollbackModalElement;
  }
}
