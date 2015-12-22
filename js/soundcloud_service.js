(function(){

    'use strict';

    /* backend */
    angular.module('soundcloudAPI').factory('soundcloudAPI', ['$http', function($http) {
      return {
        search: function(queryStr) {
            // TODO: improve soundcloud search quality... need to have people login i think
          return $http.get('https://api.soundcloud.com/tracks?', {params: {
                        client_id: '5a890217b642c08738865e3687299be3',
                        q: queryStr, 
                      }}).then(function(tracks) {
                          return tracks
                      });
        }
      }
    }]);
    
}());


