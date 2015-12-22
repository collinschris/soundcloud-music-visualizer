(function(){
    'use strict';

    var filters = angular.module('Filters');

    filters.filter('streamable', function() {
         return function(tracks) {
            var streamableTracks = [];
            for (var i = 0; i < tracks.length; i++) {
                if (tracks[i].streamable) streamableTracks.push(tracks[i]);
            }
            return streamableTracks;
         }
    });
}());