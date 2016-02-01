(function () {
    'use strict';
    var app = angular.module('LoyaltyCardApp', ['ngRoute']);

    // configure our routes
    app.config(function ($routeProvider, $locationProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl: 'pages/cards.html',
                controller: 'cardController'
            })

            //// route for the about page
            .when('/create', {
                templateUrl: 'pages/createCard.html',
                controller: 'createCardController'
            });

        //// route for the contact page
        //.when('/contact', {
        //    templateUrl: 'pages/contact.html',
        //    controller: 'contactController'
        //});


        // use the HTML5 History API
        $locationProvider.html5Mode(true);
    });
})();