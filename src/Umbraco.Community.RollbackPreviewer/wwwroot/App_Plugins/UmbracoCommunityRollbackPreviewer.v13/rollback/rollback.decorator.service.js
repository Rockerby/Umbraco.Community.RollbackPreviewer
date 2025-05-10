(function () {
  "use strict";

  // Use a decorator to allow us to override core service functions
  angular.module("umbraco.services").decorator(
    "editorService",
    function editorServiceDecorator($delegate) {

      // We only want to use the overwrite the rollback function so we can change the view it uses
      function rollback(editor) {
          editor.view = "/App_Plugins/UmbracoCommunityRollbackPreviewer.v13/rollback/rollback.html";
          if (!editor.size) editor.size = "";

          // open is a window function, so tell it we want to use the editorService base function instead!
          $delegate.open(editor);
      }

      // And assign our custom function back to the base to overwrite its implementation
      $delegate.rollback = rollback;

      // Then return it to get pushed into the Angular registry
      return $delegate;
    }
  );
})();

