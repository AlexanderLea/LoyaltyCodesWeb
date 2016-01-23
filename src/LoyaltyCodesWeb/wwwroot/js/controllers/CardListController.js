var loyaltyCardApp = angular.module('loyaltyCardApp', []);

loyaltyCardApp.controller('CardListCtrl', function ($scope) {
    $scope.cardList = [
        { Name: "Nectar", Description: "Alexander's Nectar Card", Barcode: "1235495455" },
        { Name: "Tesco Clubcard", Description: "Joint Clubcard", Barcode: "8798545121465181591891" },
        { Name: "Oxford Brookes Climbing Wall", Description: "", Barcode: "7984561284956" }
    ];
});