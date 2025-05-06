(function () {
  "use strict";

  function RollbackPreviewerController($scope, contentResource, localizationService, assetsService, dateHelper, userService, notificationsService) {

    var vm = this;

    vm.rollback = rollback;
    vm.changeLanguage = changeLanguage;
    vm.changeVersion = changeVersion;
    vm.submit = submit;
    vm.close = close;
    vm.pinVersion = pinVersion;
    vm.goToPage = goToPage;
    vm.paginationCount = { from: 0, to: 0, total: 0 };

    vm.showJsonDiff = false;
    vm.containerClasses = 'top-down';
    vm.switchView = switchView;
    vm.visualDiffContainerStyles = "";
    vm.currentIframeUrl = '';

    //////////

    function onInit() {

      vm.loading = true;
      vm.variantVersions = [];
      vm.diff = null;
      vm.currentVersion = null;
      vm.rollbackButtonDisabled = true;
      vm.labels = {};

      vm.pageSize = 15;
      vm.pageNumber = 1;
      vm.totalPages = 1;
      vm.totalItems = 0;

      let baseUrl = '/';

      // find the current version for invariant nodes
      if ($scope.model.node.variants.length === 1) {
        vm.currentVersion = $scope.model.node.variants[0];
        baseUrl = $scope.model.node.urls[0].text;
      }

      // find the current version for nodes with variants
      if ($scope.model.node.variants.length > 1) {
        var active = _.find($scope.model.node.variants, function (v) {
          return v.active;
        });

        // preselect the language in the dropdown
        if (active) {

          vm.selectedLanguage = active;
          vm.currentVersion = active;

          var url = _.find($scope.model.node.urls, function (v) {
            return v.culture == active.language.culture;
          });
          baseUrl = url.text;
        }
      }

      localizationService.localizeMany(["actions_rollback", "general_choose"]).then(function (data) {
        // set default title
        if (!$scope.model.title) {
          $scope.model.title = data[0];
        }
        vm.labels.choose = data[1];
      });

      let query = ``;
      if (vm.selectedLanguage) {
        query += `?culture=${vm.selectedLanguage.language.culture}`;
      }
      vm.currentIframeUrl = `/${$scope.model.node.id}${query}`;

      // Load in diff library
      assetsService.loadJs('lib/jsdiff/diff.js', $scope).then(function () {
        getVersions().then(function () {
          vm.loading = false;
        });

      });
    }

    function changeLanguage(language) {
      vm.currentVersion = language;
      vm.pageNumber = 1;

      let query = ``;

      if (language.language) {
        query += `?culture=${language.language.culture}`;
      }
      vm.currentIframeUrl = `/${$scope.model.node.id}${query}`;

      // Set the previous URL too
      let prevQuery = `cid=${$scope.model.node.id}&vid=${vm.previousVersion.versionId}`;
      if (language.language) {
        prevQuery += `&culture=${language.language.culture}`;
      }

      vm.previousVersion.iframeUrl = `/?${prevQuery}`;

      getVersions();
      setupScrollSync();
    }

    function canRollback(version) {
      return !version.currentDraftVersion;
    }

    function changeVersion(version) {

      if (canRollback(version) === false) {
        return;
      }

      if (vm.previousVersion && version && vm.previousVersion.versionId === version.versionId) {
        vm.previousVersion = null;
        vm.diff = null;
        vm.rollbackButtonDisabled = true;
        return;
      }

      if (version && version.versionId) {
        vm.loadingDiff = true;
        const culture = $scope.model.node.variants.length > 1 ? vm.currentVersion.language.culture : null;

        vm.previousVersion = null;

        contentResource.getRollbackVersion(version.versionId, culture)
          .then(function (data) {
            vm.previousVersion = data;
            vm.previousVersion.versionId = version.versionId;
            vm.previousVersion.displayValue = version.displayValue + ' - ' + version.username;

            let query = `cid=${$scope.model.node.id}&vid=${version.versionId}`;

            if (culture) {
              query += `&culture=${culture}`;
            }

            vm.previousVersion.iframeUrl = `/?${query}`;
            createDiff(vm.currentVersion, vm.previousVersion);

            const changed = (part) => part.added || part.removed;
            vm.diffHasChanges = vm.diff.name.some(changed) || vm.diff.properties.some((property) => property.diff.some(changed));

            vm.loadingDiff = false;
            vm.rollbackButtonDisabled = !vm.diffHasChanges;

             if (!vm.showJsonDiff) {
              setupScrollSync();
            }

          }, function () {
            vm.loadingDiff = false;
          });

      } else {
        vm.diff = null;
        vm.rollbackButtonDisabled = true;
      }
    }

    function getVersions() {

      const nodeId = $scope.model.node.id;
      const culture = vm.currentVersion.language ? vm.currentVersion.language.culture : null;

      return contentResource.getPagedContentVersions(nodeId, vm.pageNumber, vm.pageSize, culture)
        .then(function (data) {
          vm.totalPages = data.totalPages;
          vm.totalItems = data.totalItems;

          const possibleTotalItems = vm.pageNumber * vm.pageSize;

          vm.paginationCount = {
            from: (vm.pageNumber * vm.pageSize - vm.pageSize) + 1,
            to: vm.totalItems < possibleTotalItems ? vm.totalItems : possibleTotalItems,
            total: vm.totalItems
          };

          // get current backoffice user and format dates
          userService.getCurrentUser().then(function (currentUser) {
            vm.previousVersions = data.items
              // we don't ever want to show the draft version in the rollback list
              .filter(version => version.currentDraftVersion === false)
              .map(version => {
                var timestampFormatted = dateHelper.getLocalDate(version.versionDate, currentUser.locale, 'LLL');
                version.displayValue = timestampFormatted;
                return version;
              });
          });
        });
    }

    /**
     * This will load in a new version
     */
    function createDiff(currentVersion, previousVersion) {
      vm.diff = {};
      vm.diff.properties = [];

      // find diff in name
      vm.diff.name = Diff.diffWords(currentVersion.name, previousVersion.name);

      // extract all properties from the tabs and create new object for the diff
      currentVersion.tabs.forEach(function (tab) {
        tab.properties.forEach(function (property) {
          let oldTabIndex = -1;
          let oldTabPropertyIndex = -1;
          const previousVersionTabs = previousVersion.tabs;

          // find the property by alias, but only search until we find it
          for (var oti = 0, length = previousVersionTabs.length; oti < length; oti++) {
            const opi = previousVersionTabs[oti].properties.findIndex(p => p.alias === property.alias);
            if (opi !== -1) {
              oldTabIndex = oti;
              oldTabPropertyIndex = opi;
              break;
            }
          }

          if (oldTabIndex !== -1 && oldTabPropertyIndex !== -1) {
            let oldProperty = previousVersion.tabs[oldTabIndex].properties[oldTabPropertyIndex];

            // copy existing properties, so it doesn't manipulate existing properties on page
            oldProperty = Utilities.copy(oldProperty);
            property = Utilities.copy(property);

            // we have to make properties storing values as object into strings (Grid, nested content, etc.)
            if (property.value instanceof Object) {
              property.value = JSON.stringify(property.value, null, 1);
              property.isObject = true;
            }

            if (oldProperty.value instanceof Object) {
              oldProperty.value = JSON.stringify(oldProperty.value, null, 1);
              oldProperty.isObject = true;
            }

            // diff requires a string
            property.value = property.value ? property.value + '' : '';
            oldProperty.value = oldProperty.value ? oldProperty.value + '' : '';

            const diffProperty = {
              'alias': property.alias,
              'label': property.label,
              'diff': property.isObject ? Diff.diffJson(property.value, oldProperty.value) : Diff.diffWords(property.value, oldProperty.value),
              'isObject': property.isObject || oldProperty.isObject
            };

            vm.diff.properties.push(diffProperty);
          }
        });
      });
    }

    function rollback() {

      vm.rollbackButtonState = "busy";

      const nodeId = $scope.model.node.id;
      const versionId = vm.previousVersion.versionId;
      const culture = $scope.model.node.variants.length > 1 ? vm.currentVersion.language.culture : null;

      return contentResource.rollback(nodeId, versionId, culture)
        .then(data => {
          vm.rollbackButtonState = "success";
          submit();
        }, error => {
          vm.rollbackButtonState = "error";
        });

    }

    function submit() {
      if ($scope.model.submit) {
        $scope.model.submit($scope.model.submit);
      }
    }

    function close() {
      if ($scope.model.close) {
        $scope.model.close();
      }
    }

    function pinVersion(version, event) {
      if (!version) {
        return;
      }

      version.pinningState = 'busy';

      const nodeId = $scope.model.node.id;
      const versionId = version.versionId;
      const preventCleanup = !version.preventCleanup;

      contentResource.contentVersionPreventCleanup(nodeId, versionId, preventCleanup)
        .then(() => {
          version.pinningState = 'success';
          version.preventCleanup = preventCleanup;
        }, () => {
          version.pinningState = 'error';

          const localizationKey = preventCleanup ? 'speechBubbles_preventCleanupEnableError' : 'speechBubbles_preventCleanupDisableError';

          localizationService.localize(localizationKey).then(value => {
            notificationsService.error(value);
          });
        });

      event.stopPropagation();
    }

    function goToPage(pageNumber) {
      vm.pageNumber = pageNumber;
      getVersions();
    }
    const device = {
      alias: "desktop",
      label: "Desktop",
      demensions: {
        width: 1920,
        height: 1080,
      },
    };
    this._device = device;

    function switchView() {
      vm.showJsonDiff = !vm.showJsonDiff;
      vm.containerClasses = vm.showJsonDiff ? 'side-by-side' : 'top-down';

      // If switching to visual diff view, setup scroll sync after a small delay to allow for rendering
      if (!vm.showJsonDiff) {
        setTimeout(setupScrollSync, 100);
      }
    }

    // Setup scroll synchronization between left and right iframes
    const setupScrollSync = () => {
      // Wait a bit to ensure iframes are fully loaded
      setTimeout(() => {
        const iframes = [
          document.getElementById('rollbackPreviewerLeft'),
          document.getElementById('rollbackPreviewerRight')
        ];

        // Make sure both iframes exist
        if (!iframes[0] || !iframes[1]) return;

        // Set up onload handlers to reset scroll positions
        iframes.forEach(iframe => {
          iframe.onload = () => {
            resetScrollPositions(iframes);
          };
        });

        // Create a named function for the event listener so it can be removed
        function handleScroll(e) {
          const scrolledIframe = e.currentTarget.frameElement;
          const otherIframes = iframes.filter(item => item !== scrolledIframe);

          otherIframes.forEach(otherIframe => {
            otherIframe.contentWindow.removeEventListener('scroll', handleScroll);
            syncScroll(scrolledIframe, otherIframe);
            window.requestAnimationFrame(() => {
              otherIframe.contentWindow.addEventListener('scroll', handleScroll);
            });
          });
        }

        // Add scroll event listeners to both iframes
        iframes.forEach(iframe => {
          iframe.contentWindow.addEventListener('scroll', handleScroll);
        });
      }, 300);
    };

    // Reset scroll positions of all iframes to top
    const resetScrollPositions = (iframes) => {
      try {
        iframes.forEach(iframe => {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.scrollTo({
              top: 0,
              left: 0,
              behavior: 'instant'
            });
          }
        });
      } catch (e) {
        console.error('Error resetting scroll positions:', e);
      }
    };

    // Synchronize scroll between source and target iframes using percentage-based calculation
    const syncScroll = (scrolledIframe, targetIframe) => {
      if (!scrolledIframe || !targetIframe) return;

      try {
        // Get document objects
        const scrolledDoc = scrolledIframe.contentDocument || scrolledIframe.contentWindow.document;
        const targetDoc = targetIframe.contentDocument || targetIframe.contentWindow.document;

        if (!scrolledDoc || !targetDoc) return;

        // Calculate vertical scroll percentage
        const scrolledEle = scrolledDoc.documentElement || scrolledDoc.body;
        const targetEle = targetDoc.documentElement || targetDoc.body;

        const maxScrollTop = scrolledEle.scrollHeight - scrolledEle.clientHeight;
        const scrolledPercent = maxScrollTop > 0 ? scrolledEle.scrollTop / maxScrollTop : 0;

        const targetMaxScrollTop = targetEle.scrollHeight - targetEle.clientHeight;
        const targetTop = scrolledPercent * targetMaxScrollTop;

        // Calculate horizontal scroll percentage if needed
        const maxScrollLeft = scrolledEle.scrollWidth - scrolledEle.clientWidth;
        const scrolledWidthPercent = maxScrollLeft > 0 ? scrolledEle.scrollLeft / maxScrollLeft : 0;

        const targetMaxScrollLeft = targetEle.scrollWidth - targetEle.clientWidth;
        const targetLeft = scrolledWidthPercent * targetMaxScrollLeft;

        // Apply scroll to target iframe
        targetIframe.contentWindow.scrollTo({
          top: targetTop,
          left: targetLeft,
          behavior: 'instant'
        });
      } catch (e) {
        console.error('Error syncing scroll:', e);
      }
    };

    const updateIframeDevice = () => {
      const leftPreview = document.querySelector('.rp-container.current');
      let clientWidth = (window.outerWidth - 200) / 2;
      if (leftPreview) {
        clientWidth = leftPreview.clientWidth;
      }
      let scale = clientWidth / this._device.demensions.width;

      if (isNaN(scale) || scale > 1) {
        scale = 1;
      }

      vm.visualDiffContainerStyles = `--rp-device-width: ${this._device.demensions.width}px;`;
      vm.visualDiffContainerStyles += `--rp-device-height: ${this._device.demensions.height}px;`;
      vm.visualDiffContainerStyles += `--rp-iframe-scale: ${scale};`;
      vm.visualDiffContainerStyles += `--rp-height: ${this._device.demensions.height * scale}px;`;
    }
      onInit();

    // Use proper addEventListener for resize events
    window.addEventListener('resize', updateIframeDevice);
    updateIframeDevice();

    // Setup scroll sync after initial load if we're in visual diff mode
    if (!vm.showJsonDiff) {
      setTimeout(setupScrollSync, 1000);
    }

  }

  angular.module("umbraco").controller("Umbraco.Community.RollbackPreviewerController", RollbackPreviewerController);

})();
