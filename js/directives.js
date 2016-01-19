(function() {
    'use strict';


    var directives = angular.module('musicVizDirectives');

    directives.directive('track', ['$compile', function($compile) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                track: '=',
                elemClasses: '=',
                inline: '='
            },
            template:
                    "<div class='row {{ classStr }}' style='padding:0.5em;'>" +
                        "<div class='col-md-2'>" +
                          "<img ng-show='track' class='media-object' src='{{ track.user.avatar_url }}'>" +
                        "</div>" + 
                    "</div>",
            link: function(scope, element, attrs) {
                var standardFormat, inlineFormat, trackInfoElem;
                standardFormat = "<a class='track-link-white' href='{{ track.user.permalink_url }}'>" +
                                    "{{ track.user.username || '' }}" +
                                  "</a>" + 
                                  "<br/>" +
                                  "<a class='track-link-white' href='{{ track.permalink_url }}'>" +
                                    "{{ track.title || ''}}" + 
                                  "</a>";
                inlineFormat = "<a class='track-link-gray' href='{{ track.user.permalink_url }}'>" +
                                    "{{ track.user.username + ' -- ' || '' }}" +
                                  "</a>" + 
                                  "<a class='track-link-black' href='{{ track.permalink_url }}'>" +
                                    "{{ track.title || ''}}" + 
                                  "</a>";
                if (scope.inline) {
                    trackInfoElem = angular.element(
                                                    "<div class='col-md-10 track-name-link'>" + 
                                                    inlineFormat + 
                                                    "</div>"
                                                    );
                } else {
                    trackInfoElem = angular.element(
                                                    "<div class='col-md-10 track-name-link'>" + 
                                                    standardFormat +
                                                    "</div>"
                                                    );    
                }
                
                element.append(trackInfoElem);
                $compile(trackInfoElem)(scope);

                scope.$watch(function() { return scope.elemClasses; }, function() {
                    // update classes
                    scope.classStr = '';
                    if (!scope.elemClasses) return;
                    for (var i = 0; i < scope.elemClasses.length; i++) {
                        scope.classStr += scope.elemClasses[i] + ' ';
                    }
                }, true);


            }

        }
    }]);

    directives.directive('keyControls', ['$compile', function($compile) {
        return {
            restrict: 'A',
            scope: {},
            link: function(scope, element, attrs) {
                // improves ui
                var key = {left: 37, up: 38, right: 39, down: 40 , enter: 13, esc: 27, tab: 9};
                var searchResultList = document.getElementById('autocomplete-search-results');
                var searchBar = document.getElementById('search-soundcloud');

                // escape dropdown soundcloud search
                document.addEventListener('keydown', function(e) {
                    var keycode = e.keyCode || e.which;

                    if (keycode === key.esc) {
                        e.preventDefault();
                        searchResultList.classList.add('ng-hide');
                    }
                }, true);

                // escape dropdown soundcloud search 
                document.addEventListener('blur', function(e){
                    // disable suggestions on blur
                    setTimeout(function() {
                        searchResultList.classList.add('ng-hide');        
                    }, 150);
                  }, true);

                // show dropdown soundcloud search
                element[0].addEventListener('mouseenter', function(e) {
                    searchResultList.classList.remove('ng-hide');
                });

                // highlight text in search bar
                searchBar.addEventListener('focus', function(e) {
                    searchBar.select();
                }, true);
            }

        }
    }]);

}());