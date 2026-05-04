import { UmbConditionBase } from '@umbraco-cms/backoffice/extension-registry';
import type {
    UmbConditionConfigBase,
    UmbConditionControllerArguments,
    UmbExtensionCondition,
} from '@umbraco-cms/backoffice/extension-api';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import { UMB_ENTITY_WORKSPACE_CONTEXT } from '@umbraco-cms/backoffice/workspace';
import { RollbackPreviewerConfigService } from '../rollback-previewer/rollback-previewer-config.service';

export type MyExtensionConditionConfig =
    UmbConditionConfigBase<"My.Condition.CustomName"> & {
        match?: string;
    };

export class UmbWorkspaceEntityUniqueCondition
    extends UmbConditionBase<MyExtensionConditionConfig>
    implements UmbExtensionCondition
{
    constructor(host: UmbControllerHost, args: UmbConditionControllerArguments<MyExtensionConditionConfig>) {
        super(host, args);
        console.log("UmbWorkspaceEntityUniqueCondition constructor", { host, args });
        this.consumeContext(UMB_ENTITY_WORKSPACE_CONTEXT, async () => {

            var config = await this.#loadConfig();
            console.log("config", config);
            this.permitted = config?.enableFrontendPreviewAuthorisation ?? false;
        });
    }

    async #loadConfig() {
        return await RollbackPreviewerConfigService.getConfiguration();
    }
}

declare global {
    interface UmbExtensionConditionConfigMap {
        MyExtensionConditionConfig: MyExtensionConditionConfig;
    }
}
