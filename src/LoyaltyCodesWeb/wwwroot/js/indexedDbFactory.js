(function () {
    'use strict';


    var app = angular.module('LoyaltyCardApp');

    app.factory('indexedDbFactory', [indexedDbFactory]);

    function indexedDbFactory() {
        var db = new PouchDB('offlineLoyaltyCards');

        function addCard(card) {

            var promise = new Promise(function (resolve, reject) {

                db.post(card).then(function (response) {
                    // handle response
                    resolve();
                }).catch(function (err) {
                    console.log(err);
                    reject("Error Inserting into db", this.error);
                });
            });

            return promise;
        }

        function getAllCards() {
            console.log('Get all cards');
            var promise = new Promise(function (resolve, reject) {


                db.allDocs({
                    include_docs: true,
                    attachments: true
                }).then(function (result) {
                    // handle result
                    var cards = [];

                    result.rows.forEach(function (e) {
                        cards.push(e.doc);
                    });

                    resolve(cards);
                }).catch(function (err) {
                    console.log(err);
                    reject('Error opening db:', e.target.errorCode)
                });
            });
            return promise;
        }

        function getCard(id) {
            //var store = getObjectStore(DB_STORE_NAME, 'readonly');

            var promise = new Promise(function (resolve, reject) {

                db.get(id).then(function (doc) {
                    // handle doc
                    resolve(doc);
                }).catch(function (err) {
                    console.log(err);
                    reject("Error getting data for", id);
                });
            });

            return promise;
        }

        return {
            getCard: getCard,
            getAllCards: getAllCards,
            addCard: addCard
        };
    }
})();