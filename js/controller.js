(function () {

    'use strict';

    /* Controllers */
    var controller = angular.module('musicVizController');

    controller.controller('musicVizController', ['$scope', '$timeout', 'soundcloudAPI', 'Audio', 'Graphics', function($scope, $timeout, SC, Audio, Graphics) {
        var self = this;
        self.searchQuery = '';
        self.searchResults = [];

        self.search = function(query) {
          if (query === '') return;
          console.log('search called');
          SC.search(query).then(function(response) {
            self.searchResults = response.data;
          });
        };

        self.selectTrack = function(track) {
          self.searchQuery = '';
          self.searchResults = [];
          Audio.loadFile(track.stream_url + '?client_id=5a890217b642c08738865e3687299be3');
          self.initGraphics();
        };

        self.initGraphics = function() {
          $timeout(function() {
            if (Audio.setup) {
              console.log('starting animation');
              Graphics.startAnimation();
            } else {
              console.log('loading...');
              self.initGraphics();
            }
          }, 200);
        };

        $scope.$watch(function() { return self.searchQuery; }, function(query) {
          // search if done typing
          $timeout(function() {
            if (query === self.searchQuery) {
              self.search(self.searchQuery);
            } 
          }, 500);
        }, true);

        Graphics.init();


    }]);
        
}());
