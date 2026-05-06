import { UMB_USER_PERMISSION_DOCUMENT_ROLLBACK, UMB_DOCUMENT_ENTITY_TYPE } from '@umbraco-cms/backoffice/document';
import { UMB_ENTITY_IS_NOT_TRASHED_CONDITION_ALIAS } from '@umbraco-cms/backoffice/recycle-bin';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';

umbExtensionsRegistry.unregister('Umb.EntityAction.Document.Rollback');
umbExtensionsRegistry.unregister('Umb.AuditLogAction.Document.Rollback');




export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'entityAction',
		kind: 'default',
		alias: 'Umb.EntityAction.Document.Rollback',
		name: 'Rollback Document Entity Action',
		weight: 450,
		api: () => import('./rbp-rollback.action.js'),
		forEntityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
		meta: {
			icon: 'icon-history',
			label: '#actions_rollback',
			additionalOptions: true,
		},
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission.Document',
				allOf: [UMB_USER_PERMISSION_DOCUMENT_ROLLBACK],
			},
			{
				alias: UMB_ENTITY_IS_NOT_TRASHED_CONDITION_ALIAS,
			},
		],
	},
	{
		type: 'auditLogAction',
		kind: 'default',
		alias: 'Umb.AuditLogAction.Document.Rollback',
		name: 'Rollback Document Entity Action',
		weight: 450,
		api: () => import('./rbp-rollback.action.js'),
		forEntityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
		meta: {
			icon: 'icon-history',
			label: '#actions_rollback',
			additionalOptions: true,
		},
		conditions: [
			{
				alias: 'Umb.Condition.UserPermission.Document',
				allOf: [UMB_USER_PERMISSION_DOCUMENT_ROLLBACK],
			},
			{
				alias: UMB_ENTITY_IS_NOT_TRASHED_CONDITION_ALIAS,
			},
		],
	},
];