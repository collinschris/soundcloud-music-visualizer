(function(){

    'use strict';

    /* backend soundcloud search */
    angular.module('soundcloudAPI').factory('soundcloudAPI', ['$http', function($http) {
      return {
        search: function(queryStr) {
          return $http.get('https://api.soundcloud.com/tracks?', {params: {
                        client_id: '5a890217b642c08738865e3687299be3',
                        q: queryStr, 
                      }}).then(function(tracks) {
                          return tracks;
                      });
        }
      }
    }]);
    
}());


