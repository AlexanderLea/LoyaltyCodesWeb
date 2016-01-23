var app = angular.module('LoyaltyCardApp', []);

app.factory('$database', function () {
    const DB_NAME = 'LoyaltyCodesDb';
    const DB_VERSION = 2; // Use a long long for this value (don't use a float)
    const DB_STORE_NAME = 'Cards';

    var db;

    function openDb() {
        var promise = new Promise(function (resolve, reject) {
            var req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onsuccess = function (evt) {
                // Better use "this" than "req" to get the result to avoid problems with
                // garbage collection.
                // db = req.result;
                db = this.result;
                console.log('openDb DONE');
                resolve();
            };

            req.onerror = function (evt) {
                console.error('openDb:', evt.target.errorCode);
                reject('Error opening db:', evt.target.errorCode);
            };

            req.onupgradeneeded = function (evt) {
                console.log("openDb.onupgradeneeded");
                var store = evt.currentTarget.result.createObjectStore(
                    DB_STORE_NAME, { keyPath: 'Id', autoIncrement: true });

                store.createIndex("Name", "Name", { unique: false });
                store.createIndex("Description", "Description", { unique: false });
                store.createIndex("Barcode", "Barcode", { unique: false });
            };
        });
        return promise;
    }

    /**
       * @param {string} store_name
       * @param {string} mode either "readonly" or "readwrite"
       */
    function getObjectStore(store_name, mode) {
        var tx = db.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }

    /**
   * @param {object} Card
   */
    function addCard(card) {

        var store = getObjectStore(DB_STORE_NAME, 'readwrite');

        var promise = new Promise(function (resolve, reject) {
            var req = store.add(card);

            req.onsuccess = function (evt) {
                console.log("Insertion in DB successful");
                resolve();
            };
            req.onerror = function () {
                console.error("Error Inserting into db", this.error);
                reject("Error Inserting into db", this.error);
            };
        });

        return promise;
    }

    function getAllCards() {
        console.log("Get all cards");
        var store = getObjectStore(DB_STORE_NAME, 'readonly');
        var cardList = [];

        var promise = new Promise(function (resolve, reject) {
            var req = store.openCursor();

            req.onsuccess = function (evt) {
                var cursor = evt.target.result;

                // If the cursor is pointing at something, ask for the data
                if (cursor) {
                    req = store.get(cursor.key);
                    req.onsuccess = function (evt) {
                        var value = evt.target.result;

                        var card = {
                            Id: value.Id,
                            Name: value.Name,
                            Description: value.Description,
                            Barcode: value.Barcode
                        }

                        cardList.push(card);
                    };

                    // Move on to the next object in store
                    cursor.continue();
                } else {
                    console.log("No more entries");
                    resolve(cardList);
                }
            };

            req.onerror = function (e) {
                console.error('openDb:', evt.target.errorCode);
                reject('Error opening db:', evt.target.errorCode);
            }
        });
        return promise;
    }

    function getCard(id) {
        var store = getObjectStore(DB_STORE_NAME, 'readonly');

        var promise = new Promise(function (resolve, reject) {
            var req = store.get(id);

            req.onsuccess = function (event) {
                // Do something with the request.result!
                resolve(req.result);
            };

            req.onerror = function (event) {
                // Handle errors!
                console.error("Error getting data for", id);
                reject("Error getting data for", id);
            };

        });

        return promise;
    }

    return {
        openDb: openDb,
        getCard: getCard,
        getAllCards: getAllCards,
    };
});

app.controller('CardController', function ($scope, $database) {
    $scope.cardList = null;

    var getCardList = function () {
        $database.getAllCards().then(function (data) {
            $scope.cardList = data;
        }, function(err) {
            $window.alert(err);
            return null;
        });
    };

    //var addCard = function () {
    //    $database.addCard(vm.card).then(function () {
    //        vm.refreshList();
    //        vm.todoText = "";
    //    }, function (err) {
    //        $window.alert(err);
    //    });
    //};        

    function init() {
      
        $database.openDb().then(function () {
            getCardList();
    //        $scope.cardList = [
    //{ Name: "Nectar", Description: "Alexander's Nectar Card", Barcode: "1235495455" },
    //{ Name: "Tesco Clubcard", Description: "Joint Clubcard", Barcode: "8798545121465181591891" },
    //{ Name: "Oxford Brookes Climbing Wall", Description: "", Barcode: "7984561284956" }
     //       ];
        });
    }

    init();
});