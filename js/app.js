(function () {
  'use strict';

  /* App Module */


    var musicViz = angular.module('musicViz', [
        'musicVizController',
        'soundcloudAPI',
        'Audio',
        'Graphics',
    ]);


    // this sets up all the dependencies here
    // next time you need to access these you don't need to include the []
    // ex: var d3AppControllers = angular.module('d3AppControllers');
    angular.module('musicVizController', []);
    angular.module('soundcloudAPI', []);
    angular.module('Audio', []);
    angular.module('Graphics', []);
    
}());
