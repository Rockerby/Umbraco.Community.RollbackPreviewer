// adds the resource to umbraco.resources module:
angular.module('umbraco.resources').factory('rollbackResource',
    function($q, $http, umbRequestHelper) {
        // the factory object returned
        return {
            getConfiguration: function () {
            return umbRequestHelper.resourcePromise(
                $http.get("backoffice/RollbackPreviewerConfiguration/GetConfiguration"),
            "Unable to get rollback previwewer configuration");
            }
        };
    }
);