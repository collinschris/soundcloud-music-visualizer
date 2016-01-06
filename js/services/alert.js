(function () {
    'use strict';

    angular.module('Alert').factory('Alert', ['$timeout', '$compile', function($timeout, $compile) {

        return {
            error: function(message) {
                // remove any existing alerts
                var errorWrapper = document.getElementById('error-wrapper');
                if (errorWrapper.childNodes[0]) errorWrapper.removeChild(errorWrapper.childNodes[0]);
                var element = "<div class='alert alert-danger' role='alert'>" +
                                "<span class='glyphicon glyphicon-exclamation-sign'></span>" +
                                "<span> " + message + "</span>" +
                              "</div>";
                element = angular.element(element);

                errorWrapper.appendChild(element[0]);

                $timeout(function() {
                    if (errorWrapper.childNodes[0]) {
                        errorWrapper.removeChild(errorWrapper.childNodes[0]);
                    }
                }, 10000);
            },
            removeError: function() {
                var errorWrapper = document.getElementById('error-wrapper');
                if (errorWrapper.childNodes[0]) errorWrapper.removeChild(errorWrapper.childNodes[0]);
            }
        }
    }]);
}());