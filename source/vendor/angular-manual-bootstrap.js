window.gapiOnLoadCallback = function() {
  angular.element(document).ready(function() {
    angular.bootstrap(document, ['helium'])
  })
}