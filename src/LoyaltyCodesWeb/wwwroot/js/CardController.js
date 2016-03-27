(function () {
    'use strict';

    var app = angular.module('LoyaltyCardApp');

    app.controller('cardController', ['$rootScope', '$scope', '$window', '$location', 'indexedDbFactory',
        function ($rootScope, $scope, $window, $location, indexedDbFactory) {
            $rootScope.title = 'Loyalty Cards - View Cards';

            $scope.cardList = [];

            function loadData() {
                refreshCards();
            }

            function refreshCards() {
                indexedDbFactory.getAllCards().then(function (data) {
                    $scope.cardList = data;
                    $scope.$apply();
                }, function (error) {
                    // log errors
                    console.log('error.', error);
                });
            }

            function showCard(card) {
                $location.path('/view/' + card._id);
            }

            $scope.showCard = showCard;
            $scope.refreshCards = refreshCards;
            $scope.loadData = loadData;
        }]);

    app.controller('createCardController', [
        '$rootScope', '$scope', '$window', 'indexedDbFactory',
        function ($rootScope, $scope, $window, indexedDbFactory) {
            $rootScope.title = 'Loyalty Cards - Create Card';

            $scope.addCard = function () {
                var card = {
                    Name: $scope.Name,
                    Description: $scope.Description,
                    Barcode: $scope.Barcode,
                    Colour: $scope.Colour
                }

                indexedDbFactory.addCard(card).then(function () {
                    $window.location.href = '/';
                }, function (err) {
                    //do something on error
                });
            };
        }
    ]);

    app.controller('viewCardController', ['$rootScope', '$scope', '$window', '$routeParams', 'indexedDbFactory',
        function ($rootScope, $scope, $window, $routeParams, indexedDbFactory) {
            $rootScope.title = 'Loyalty Cards - Card Details';

            //$scope.message = id;
            $scope.card = null;

            function loadCard() {
                var id = $routeParams.id;

                indexedDbFactory.getCard(id).then(function (card) {
                    $scope.card = card;
                    $scope.$apply();
                }, function (error) {
                    // log errors
                    $scope.error = 'There was an error loading the selected card';
                    console.log('error.', error);
                    $scope.$apply();
                });

            }

            loadCard();
        }
    ]);
})();

//$scope.cardList = [
//{ Name: "Nectar", Description: "Alexander's Nectar Card", Barcode: "1235495455" },
//{ Name: "Tesco Clubcard", Description: "Joint Clubcard", Barcode: "8798545121465181591891" },
//{ Name: "Oxford Brookes Climbing Wall", Description: "", Barcode: "7984561284956" }
//];