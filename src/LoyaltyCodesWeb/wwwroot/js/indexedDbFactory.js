(function () {
    'use strict';


    var app = angular.module('LoyaltyCardApp');
    
    app.factory('indexedDbFactory', [indexedDbFactory]);


    function indexedDbFactory() {


        const DB_NAME = 'LoyaltyCodesDb';
        const DB_VERSION = 2; // Use a long long for this value (don't use a float)
        const DB_STORE_NAME = 'Cards';

        var db;

        function openDb() {
            var promise = new Promise(function (resolve, reject) {

                var req = indexedDB.open(DB_NAME, DB_VERSION);

                req.onsuccess = function (evt) {
                    db = this.result;
                    console.log('Db open');
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

        function getObjectStore(storeName, mode) {
            var tx = db.transaction(storeName, mode);
            return tx.objectStore(storeName);
        }

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
            console.log('Get all cards');
            var store = getObjectStore(DB_STORE_NAME, 'readonly');

            var promise = new Promise(function (resolve, reject) {
                var req = store.openCursor();
                var cardList = [];

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
                        console.log("No more entries. cardList:", cardList);
                        resolve(cardList);
                    }
                };

                req.onerror = function (e) {
                    console.error('openDb:', e.target.errorCode);
                    reject('Error opening db:', e.target.errorCode);
                }
            });
            return promise;
        }

        function getCard(id) {
            var store = getObjectStore(DB_STORE_NAME, 'readonly');

            var promise = new Promise(function (resolve, reject) {
                var key = parseInt(id);
                var req = store.get(key);

                req.onsuccess = function (event) {
                    // Do something with the request.result!
                    var value = event.target.result;

                    if (value)
                        resolve(value);
                    else {
                        console.log('no values returned for id:', id);
                    }
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
            addCard: addCard
        };
    }
})();