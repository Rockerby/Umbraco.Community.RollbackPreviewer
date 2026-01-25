/////



(function () {
  'use strict';

  function rollbackpreviewerManager($rootScope, $q, assetsService, rollbackResource, notificationsService) {
    var resource = {
      insertPublishCmds: insertPublishCmds
    };

    var rollbackConfig = {};

    return resource;

    function insertPublishCmds(content) {

      if (content !== undefined) {
        //mgr.content = content;
      }

      var contentForm = angular.element(document).find('[name="contentForm"]');
      if (contentForm != null) {
        var formScope = findScope($rootScope);
        if (formScope != null) {

          if (formScope.previewSubButtons !== null) {
            if (!_.some(formScope.previewSubButtons, function (b) { return b.letter == 'RBPSHARE'; })) {

              rollbackResource.getConfiguration().then(
                function (config) {
                  rollbackConfig = config;

                  if (rollbackConfig.EnableFrontendPreviewAuthorisation) {
                    var button = {
                      letter: 'RBPSHARE',
                      label: 'Save and Share Preview',
                      handler: fetchAndCopyPreviewUrl,
                      alias: 'rollbackPreview',
                      addEllipsis: 'true'
                    };

                    formScope.previewSubButtons.splice(1, 0, button);
                  }
                });
            }
          }

        }
      }
    }

    function findScope(scope) {

      if (!scope) return null;

      var contentScope = null;
      if (scope.subButtons !== undefined && scope.content !== undefined) {
        return scope;
      }

      if (scope.$$childHead !== null) {
        contentScope = findScope(scope.$$childHead);
      }

      if (contentScope === null && scope.$$nextSibling !== null) {
        contentScope = findScope(scope.$$nextSibling);
      }

      return contentScope;
    }

    function fetchAndCopyPreviewUrl(outerE) {
      var formScope = findScope($rootScope);

      console.log("Saving", outerE);

      // Save it first
      formScope.save().then(function (e) {
        console.log("Saved", e);
        //Then go fetch the share URL
        rollbackResource.getPreviewUrl(formScope.contentId).then(function (data) {

          let dataToCopy = data;
          copyShareableUrl(dataToCopy.Url);

          //Not sure why... but we need to add the button back in here!
          insertPublishCmds();
        });

      }); // No need for fail here, let Umbraco deal with it


      async function copyShareableUrl(urlSegment) {
        //const buttonElement = $event.currentTarget;

        let dataToCopy = window.location.origin + urlSegment;

        const urlWithSecret = rollbackConfig.FrontendPreviewAuthorisationSecret
          ? `${dataToCopy}&secret=${encodeURIComponent(rollbackConfig.FrontendPreviewAuthorisationSecret)}`
          : dataToCopy;

        try {
          await navigator.clipboard.writeText(urlWithSecret);
          notificationsService.success("Preview URL copied to the clipboard", urlWithSecret);
        } catch (err) {
          notificationsService.error("Preview URL unable to copy to clipboard", urlWithSecret);
        }
      };
    }
  }

  angular.module('umbraco.resources')
    .factory('rollbackpreviewerManager', rollbackpreviewerManager);
})();
