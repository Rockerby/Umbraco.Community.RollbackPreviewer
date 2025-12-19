/**
 * Configuration response from the Rollback Previewer API
 */
export interface RollbackPreviewerConfiguration {
    enableFrontendPreviewAuthorisation: boolean;
    frontendPreviewAuthorisationSecret: string | null;
    isTimeLimited: boolean;
    expirationMinutes: number | null;
}

/**
 * Service for fetching Rollback Previewer configuration from the backend
 */
export class RollbackPreviewerConfigService {
    /**
     * Fetches the configuration settings from the backend API
     * @returns Promise with configuration data
     */
    static async getConfiguration(): Promise<RollbackPreviewerConfiguration | null> {
        try {
            const response = await fetch(
                '/umbraco/management/api/v1/umbraco-community-rollback-previewer/configuration',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies for authentication
                }
            );

            if (!response.ok) {
                console.error('Failed to fetch Rollback Previewer configuration:', response.statusText);
                return null;
            }

            const data = await response.json();
            return {
                enableFrontendPreviewAuthorisation: data.enableFrontendPreviewAuthorisation ?? false,
                frontendPreviewAuthorisationSecret: data.frontendPreviewAuthorisationSecret ?? null,
                isTimeLimited: data.isTimeLimited ?? false,
                expirationMinutes: data.expirationMinutes ?? null,
            };
        } catch (error) {
            console.error('Error fetching Rollback Previewer configuration:', error);
            return null;
        }
    }
}
