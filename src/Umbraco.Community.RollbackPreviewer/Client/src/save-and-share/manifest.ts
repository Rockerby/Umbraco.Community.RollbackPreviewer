import { UmbWorkspaceEntityUniqueCondition } from './UmbWorkspaceEntityRollbackPreviewerEnabledCondition.js';

export const manifests: Array<UmbExtensionManifest> = [
    
    {
        type: "condition",
        name: "My Condition",
        alias: "My.Condition.CustomName",
        api: UmbWorkspaceEntityUniqueCondition,
    },
    
    {
        type: 'workspaceAction',
	    kind: 'default',
        alias: 'UmbracoCommunityRollbackPreviewer.WorkspaceAction.SaveAndSharePreview',
        name: 'Save and Share Preview',
        api: () => import('./save-and-share-action.element.js'),
        meta: {
            label: 'Save and share preview',
            look: 'secondary',
            color: 'green',
        },
        conditions: [
            {
                alias: 'Umb.Condition.WorkspaceAlias',
                match: 'Umb.Workspace.Document',
            },
            {
                alias: 'My.Condition.CustomName',
            }
        ]
    }
];
