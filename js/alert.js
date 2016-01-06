(function () {
    'use strict';

    angular.module('Alert').factory('Alert', ['$timeout', '$compile', function($timeout, $compile) {

        return {
            error: function(message) {
                // remove any existing alerts
                // $('.alert').remove();
                var element = "<div style='margin-top: 6em;' class='alert alert-danger' role='alert'>" +
                                "<span class='glyphicon glyphicon-exclamation-sign'></span>" +
                                "<span> " + message + "</span>" +
                              "</div>";
                element = angular.element(element);
                $('body').prepend(element);
                $timeout(function() {
                    // $('.alert').remove();
                }, 5000);
            }
        }
    }]);
}());