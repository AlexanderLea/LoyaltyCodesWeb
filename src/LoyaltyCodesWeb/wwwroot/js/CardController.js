(function () {
    'use strict';

    var app = angular.module('LoyaltyCardApp');

    app.controller('cardController', ['$scope', '$window', '$location', 'indexedDbFactory',
        function ($scope, $window, $location, indexedDbFactory) {
            var dbOpen = false;

            $scope.cardList = [];

            function loadData() {
                indexedDbFactory.openDb().then(function () {
                    dbOpen = true;
                    refreshCards();
                }, function (error) {
                    // log errors
                    console.log('error.', error);
                });
            }

            function refreshCards() {
                if (dbOpen) {
                    indexedDbFactory.getAllCards().then(function (data) {
                        $scope.cardList = data;
                        $scope.$apply();
                    }, function (error) {
                        // log errors
                        console.log('error.', error);
                    });
                }
                else
                {
                    loadData();
                }
            }

            function showCard(card) {
                $location.path('/view/' + card.Id);
            }

            $scope.showCard = showCard;
            $scope.refreshCards = refreshCards;
            $scope.loadData = loadData;
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

    app.controller('viewCardController', ['$scope', '$window', '$routeParams', 'indexedDbFactory',
        function ($scope, $window, $routeParams, indexedDbFactory) {
            var isDbOpen = false;

            //$scope.message = id;
            $scope.card = null;
            
            function loadCard() {
                var id = $routeParams.id;
                if (isDbOpen) {
                    indexedDbFactory.getCard(id).then(function (card) {
                        $scope.card = card;
                        $scope.$apply();
                    }, function (error) {
                        // log errors
                        console.log('error.', error);
                    });                    
                } else {
                    indexedDbFactory.openDb().then(function() {
                        isDbOpen = true;
                        loadCard();
                    }, function (error) {
                        // log errors
                        console.log('error.', error);
                    });
                }            
            }

            loadCard();
        }
    ]);


    app.directive('jsbarcode', function() {
        return {
            // Restrict it to be an attribute in this case
            restrict: 'EA',
            scope: {
                barcodeData: '='
            },
             //responsible for registering DOM listeners as well as updating the DOM
            link: function ($scope, element, attrs) {
                if(typeof ($scope.barcodeData) != 'undefined')
                    element.JsBarcode($scope.barcodeData);
            }
            //template: '{{cardDetails.Barcode}}'

        };
    });
})();

//$scope.cardList = [
//{ Name: "Nectar", Description: "Alexander's Nectar Card", Barcode: "1235495455" },
//{ Name: "Tesco Clubcard", Description: "Joint Clubcard", Barcode: "8798545121465181591891" },
//{ Name: "Oxford Brookes Climbing Wall", Description: "", Barcode: "7984561284956" }
//];