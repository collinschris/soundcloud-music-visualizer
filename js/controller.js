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

        // TODO: fix bug only allow 1 song to be played at a time
        // TODO: make song queue

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
            // TODO: check that this song can be streamed... may be related to login
            console.log('track is streamable:', track.streamable);
            console.log(track);
            console.log(track.stream_url + '?client_id=' + CLIENT_ID);
            // if (Audio.setup) Audio.src.stop(); 
            self.searchQuery = '';
            self.searchResults = [];
            Audio.loadTrack(track.stream_url + '?client_id=' + CLIENT_ID);
            self.initGraphics();
        };

        self.initGraphics = function() {
            $timeout(function() {
                if (Audio.configured) {
                    console.log('CONFIGURED!!!');
                    Graphics.startAnimation();
                } else {
                    console.log('waiting...');
                    self.initGraphics();
                }
            }, 200);
        };

        self.addToTrackQueue = function(track) {
            self.trackQueue.push(track);
            console.log('song added to queue');
            if (!Audio.setup && self.trackQueue.length === 1) {
                self.selectTrack(self.trackQueue.shift());
            }
        };

        // TODO: move to next song

        $scope.$watch(function() { return self.searchQuery; }, function(query) {
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
            }
        });

        Graphics.init();


    }]);
        
}());
