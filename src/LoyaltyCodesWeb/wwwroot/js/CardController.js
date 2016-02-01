(function () {
    'use strict';

    var app = angular.module('LoyaltyCardApp');

    app.controller('cardController', ['$scope', 'indexedDbFactory', function ($scope, indexedDbFactory) {
        var dbOpen = false;

        $scope.cardList = [];        

        indexedDbFactory.openDb().then(function () {
            dbOpen = true;
            refreshCards();
        }, function (error) {
            // log errors
            console.log('error.', error);
        });

        function refreshCards() {
            if (dbOpen) {
                indexedDbFactory.getAllCards().then(function (data) {
                    $scope.cardList = data;
                }, function (error) {
                    // log errors
                    console.log('error.', error);
                });
            }
        }

        function showCard() {
            //$scope.cardDetails = "";
            alert("Hello!");
        }
    }]);

    app.controller('createCardController', [
        '$scope', '$window', 'indexedDbFactory', function ($scope, $window, indexedDbFactory) {
            var dbOpen = false;

            indexedDbFactory.openDb().then(function () {
                dbOpen = true;
            }, function (error) {
                // log errors
                console.log('error.', error);
            });

            $scope.addCard = function () {
                var card = {
                    Name: $scope.Name,
                    Description: $scope.Description,
                    Barcode: $scope.Barcode
                }

                indexedDbFactory.addCard(card).then(function () {
                    $window.location.href = '/';
                }, function (err) {
                    //do something on error
                });
            };
        }
    ]);
})();

//$scope.cardList = [
//{ Name: "Nectar", Description: "Alexander's Nectar Card", Barcode: "1235495455" },
//{ Name: "Tesco Clubcard", Description: "Joint Clubcard", Barcode: "8798545121465181591891" },
//{ Name: "Oxford Brookes Climbing Wall", Description: "", Barcode: "7984561284956" }
//];