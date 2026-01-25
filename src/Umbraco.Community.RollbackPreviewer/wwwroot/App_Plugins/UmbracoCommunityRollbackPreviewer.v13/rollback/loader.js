(function () {

  'use strict';

  function loader(eventsService, rollbackpreviewerManager) {

    eventsService.on('app.tabChange', function (evt, data) {
      update(data.content);
    });

    eventsService.on('content.loaded', function (evt, data) {
      update(data.content);
    });

    eventsService.on('content.newReady', function (evt, data) {
      update(data.content);
    });

    eventsService.on('content.saved', function (evt, data) {
      console.log("Saved");

      update(data.content);

      // When saving and previewing the button needs a few cracks to add the sub back in
      var countAttempt = 0;
      var interval = setInterval(function () {

        update(data.content);
        countAttempt++;

        if (countAttempt >= 4)
          clearInterval(interval);

      }, 500);
    });

    function update(content) {
      rollbackpreviewerManager.insertPublishCmds(content);
    }

  }

  angular.module('umbraco').run(loader);

})();
