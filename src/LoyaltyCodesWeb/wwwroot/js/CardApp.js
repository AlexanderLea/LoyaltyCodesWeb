(function () {
    'use strict';
    var app = angular.module('LoyaltyCardApp', [
        'ngRoute',
        'ui.router',
        'io-barcode']);

    // configure our routes
    app.config(function ($routeProvider, $locationProvider, $stateProvider) {
        // use the HTML5 History API
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'pages/cards.html',
                controller: 'cardController'
            })

            .when('/create', {
                templateUrl: 'pages/createCard.html',
                controller: 'createCardController'
            })

            .when('/view/:id', {
                templateUrl: 'pages/viewCard.html',
                controller: 'viewCardController'
            });
    });
})();