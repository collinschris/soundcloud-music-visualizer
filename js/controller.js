(function () {

    'use strict';
    const CLIENT_ID = '5a890217b642c08738865e3687299be3';

    /* Controllers */
    var controller = angular.module('musicVizController');

    controller.controller('musicVizController', ['$scope', '$timeout', 'soundcloudAPI', 'Audio', 'Graphics', '$window', 'Alert', function($scope, $timeout, SC, Audio, Graphics, $window, Alert) {
        var self = this;
        self.searchQuery = '';
        self.searchResults = [];
        self.trackQueue = [];
        self.showMenus = true;
        self.mouseTimeout;
        self.currentTrack = null;
        self.nextTrackAvailable = false;
        self.currentStyle = 0;

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
            Alert.removeError();
            Audio.loadTrack(track.stream_url + '?client_id=' + CLIENT_ID, true);
            Graphics.stopAnimation();
            Graphics.startAnimation();
            self.currentTrack = track;
            localStorage.setItem('currentTrack', JSON.stringify(self.currentTrack));
        };

        self.addToTrackQueue = function(track) {
            self.trackQueue.push(track);
            if (self.trackQueue.length === 1 && !Audio.configured) {
                self.selectTrack(self.trackQueue.shift());
            }
            self.nextTrackAvailable = self.trackQueue.length > 0;
            localStorage.setItem('trackQueue', JSON.stringify(self.trackQueue));
        };

        self.handleMouseMove = function() {
            $timeout.cancel(self.mouseTimeout);
            self.showMenus = true;
            self.mouseTimeout = $timeout(function() {
                self.showMenus = false;
            }, 6000);
        };

        self.nextTrack = function() {
            self.currentTrack = null;
            if (self.trackQueue.length > 0) {
                self.selectTrack(self.trackQueue.shift());
            } 
            self.nextTrackAvailable = self.trackQueue.length > 0;
            localStorage.setItem('trackQueue', JSON.stringify(self.trackQueue));
        };

        self.selectStyle = function(styleID) {
            self.currentStyle = styleID;
            localStorage.setItem('currentStyle', JSON.stringify(self.currentStyle));
            Graphics.stopAnimation();
            Graphics.selectStyle(self.currentStyle);
            Graphics.startAnimation();
        };

        $scope.$watch(function() { return self.searchQuery; }, function(query) {
            self.handleMouseMove(); // prevent menu from hidding while typing 
            // search if done typing
            $timeout(function() {
                if (query === self.searchQuery) {
                    self.search(self.searchQuery);
                } 
            }, 500);
        }, true);

        $scope.$on('trackFinished', function(event) {
            self.currentTrack = null;
            localStorage.setItem('currentTrack', JSON.stringify(self.currentTrack));
            self.nextTrack();
            $scope.$apply();
        });

        $scope.$on('noTrackAnalyser', function(event) {
            Audio.loadTrack(self.currentTrack.stream_url + '?client_id=' + CLIENT_ID, false);
            Graphics.stopAnimation();
            Alert.error('Sorry! SoundCloud does not allow this song to be visualized.');
        }); 

        $window.onresize = function() {
            Graphics.updateCanvasSize($window.innerWidth, $window.innerHeight);
        };

        // call on load
        (function() {
            self.currentTrack = localStorage.currentTrack ? JSON.parse(localStorage.currentTrack) : null;
            self.trackQueue = localStorage.trackQueue ? JSON.parse(localStorage.trackQueue) : [];
            self.currentStyle = localStorage.currentStyle ? JSON.parse(localStorage.currentStyle) : 0;
            self.nextTrackAvailable = self.trackQueue.length > 0;
            Graphics.selectStyle(self.currentStyle);
            Graphics.init();
            if (self.currentTrack) {
                self.selectTrack(self.currentTrack);
            }
        }());

    }]);
        
}());
