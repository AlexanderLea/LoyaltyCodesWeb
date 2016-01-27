(function () {
    'use strict';

    var controllerId = 'cardController';

    angular.module('LoyaltyCardApp').controller(controllerId,
        ['$scope', 'indexedDbFactory', cardController]);

    function cardController($scope, indexedDbFactory) {
        var dbOpen = false;

        $scope.cardList = [];

        indexedDbFactory.openDb().then(function () {
            dbOpen = true;
            refreshCards();
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

            indexedDbFactory.addCard(card).then(function() {
                refreshCards();
            }, function(err) {
                //do something on error
            });
        };

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
    }
})();

//$scope.cardList = [
//{ Name: "Nectar", Description: "Alexander's Nectar Card", Barcode: "1235495455" },
//{ Name: "Tesco Clubcard", Description: "Joint Clubcard", Barcode: "8798545121465181591891" },
//{ Name: "Oxford Brookes Climbing Wall", Description: "", Barcode: "7984561284956" }
//];