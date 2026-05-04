import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/document';
import { UMB_NOTIFICATION_CONTEXT } from '@umbraco-cms/backoffice/notification';
import { RollbackPreviewerConfigService } from '../rollback-previewer/rollback-previewer-config.service.js';
import { UmbWorkspaceAction, UmbWorkspaceActionBase } from '@umbraco-cms/backoffice/workspace';
//import type { RollbackPreviewerConfigurationResponse } from '../api/index.js';

// @customElement('rp-save-and-share-action')
export class RpSaveAndShareActionElement extends UmbWorkspaceActionBase implements UmbWorkspaceAction {
    //@state() private _isEnabled = false;
    //@state() private _buttonState: string = '';

    //#config: RollbackPreviewerConfigurationResponse | null = null;
    #workspaceContext?: typeof UMB_DOCUMENT_WORKSPACE_CONTEXT.TYPE;

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
    override async execute() {
	// 	const context = await this.getContext(EXAMPLE_COUNTER_CONTEXT);
	// 	if (!context) {
	// 		throw new Error('Could not get the counter context');
	// 	}
	// 	context.increment();
	// }
	    this.#workspaceContext = await this.getContext(UMB_DOCUMENT_WORKSPACE_CONTEXT);
        if (!this.#workspaceContext) return;

        //this._buttonState = 'waiting';
        try {
            //var validateResp = await this.#workspaceContext.validate();
            var resp = await this.#workspaceContext.requestSave();
console.log('Save response:', resp);
            // Re-fetch to get a fresh time-limited secret if applicable
            const config = await RollbackPreviewerConfigService.getConfiguration();
            if (!config) {
                //this._buttonState = 'failed';
                return;
            }

            const contentKey = this.#workspaceContext.getUnique();
            if (!contentKey) {
                //this._buttonState = 'failed';
                return;
            }

            // vid=cid is intentional — in ?preview=true mode the content finder loads the
            // latest draft by contentKey and ignores the version GUID
            const previewUrl = `${window.location.origin}/ucrbp?cid=${contentKey}&vid=${contentKey}&preview=true`;
            const shareUrl = config.frontendPreviewAuthorisationSecret
                ? `${previewUrl}&secret=${encodeURIComponent(config.frontendPreviewAuthorisationSecret)}`
                : previewUrl;

            await navigator.clipboard.writeText(shareUrl);
            //this._buttonState = 'success';

            const notifContext = await this.getContext(UMB_NOTIFICATION_CONTEXT);
            notifContext?.peek('positive', {
                data: {
                    headline: 'Preview URL copied',
                    message: shareUrl,
                }
            });

            //setTimeout(() => { this._buttonState = ''; }, 3000);
        } catch (err) {
            console.error('Save and share failed:', err);
            //this._buttonState = 'failed';
            //setTimeout(() => { this._buttonState = ''; }, 3000);
        }
    }
}

export const api = RpSaveAndShareActionElement;
