(function () {
    'use strict';

    var app = angular.module('LoyaltyCardApp');

    app.service('currentCardService', function () {
        var card;

        var set = function (newCard) {
            card = newCard;
        };

        var get = function () {
            return card;
        };

        return {
            set: set,
            get: get
        };
    });
})();