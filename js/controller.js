(function () {

    'use strict';
    const CLIENT_ID = '5a890217b642c08738865e3687299be3';

    /* Controllers */
    var controller = angular.module('musicVizController');

    controller.controller('musicVizController', ['$scope', '$timeout', 'soundcloudAPI', 'Audio', 'Graphics', function($scope, $timeout, SC, Audio, Graphics) {
        var self = this;
        self.searchQuery = '';
        self.searchResults = [];
        self.trackQueue = [];
        self.showMenus = true;
        self.mouseTimeout;
        self.currentTrack = null;

        // TODO: make trackQueue save to local storage

        self.search = function(query) {
            if (query === '') {
                self.searchResults = [];
            } else {
                SC.search(query).then(function(response) {
                    self.searchResults = response.data;
                });
            }
        };

        self.selectTrack = function(track) {
            console.log(track);
            self.searchQuery = '';
            self.searchResults = [];
            Audio.loadTrack(track.stream_url + '?client_id=' + CLIENT_ID, true);
            Graphics.startAnimation();
            self.currentTrack = track;
        };

        self.addToTrackQueue = function(track) {
            self.trackQueue.push(track);
            console.log('song added to queue');
            if (self.trackQueue.length === 1 && !Audio.configured) {
                self.selectTrack(self.trackQueue.shift());
            }
        };

        self.handleMouseMove = function() {
            $timeout.cancel(self.mouseTimeout);
            self.showMenus = true;
            self.mouseTimeout = $timeout(function() {
                self.showMenus = false;
            }, 6000);
        };

        $scope.$watch(function() { return self.searchQuery; }, function(query) {
            self.handleMouseMove(); // preven menu from hidding while typing 
            // search if done typing
            $timeout(function() {
                if (query === self.searchQuery) {
                    self.search(self.searchQuery);
                } 
            }, 500);
        }, true);

        $scope.$on('trackFinished', function(event) {
            if (self.trackQueue.length > 0) {
                console.log('selecting track from queue');
                self.selectTrack(self.trackQueue.shift());
                $scope.$apply();
            }
        });

        $scope.$on('noTrackAnalyser', function(event) {
            Audio.loadTrack(self.currentTrack.stream_url + '?client_id=' + CLIENT_ID, false);
            Graphics.stopAnimation();
            // display some message to user
        }); 

        Graphics.init();

    }]);
        
}());
