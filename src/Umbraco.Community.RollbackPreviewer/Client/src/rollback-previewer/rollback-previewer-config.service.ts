import { getUmbracoRollbackpreviewerApiV1Configuration, RollbackPreviewerConfigurationResponse } from "../api/index.js";

/**
 * Service for fetching Rollback Previewer configuration from the backend
 */
export class RollbackPreviewerConfigService {
    /**
     * Fetches the configuration settings from the backend API
     * @returns Promise with configuration data
     */
    static async getConfiguration(): Promise<RollbackPreviewerConfigurationResponse | null> {

        const { data, error } = await getUmbracoRollbackpreviewerApiV1Configuration();
        if (error) {
            console.error(error);
                return null;
            }

        if (data !== undefined) {
            return data;
        }

            return null;
        }
}
