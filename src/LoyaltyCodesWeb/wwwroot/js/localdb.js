(function() {
    var COMPAT_ENVS = [
        ['Firefox', ">= 16.0"],
        [
            'Google Chrome',
            ">= 24.0 (you may need to get Google Chrome Canary), NO Blob storage support"
        ]
    ];
    var compat = $('#compat');
    compat.empty();
    compat.append('<ul id="compat-list"></ul>');
    COMPAT_ENVS.forEach(function(val, idx, array) {
        $('#compat-list').append('<li>' + val[0] + ': ' + val[1] + '</li>');
    });

    const DB_NAME = 'LoyaltyCodesDb';
    const DB_VERSION = 2; // Use a long long for this value (don't use a float)
    const DB_STORE_NAME = 'Cards';

    var db;

    function openDb() {
        console.log("openDb ...");
        var req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onsuccess = function(evt) {
            // Better use "this" than "req" to get the result to avoid problems with
            // garbage collection.
            // db = req.result;
            db = this.result;
            console.log('openDb DONE');
        };
        req.onerror = function(evt) {
            console.error('openDb:', evt.target.errorCode);
        };

        req.onupgradeneeded = function(evt) {
            console.log("openDb.onupgradeneeded");
            var store = evt.currentTarget.result.createObjectStore(
                DB_STORE_NAME, { keyPath: 'Id', autoIncrement: true });

            store.createIndex("Name", "Name", { unique: false });
            store.createIndex("Description", "Description", { unique: false });
            store.createIndex("Barcode", "Barcode", { unique: false });
        };
    }

    /**
       * @param {string} store_name
       * @param {string} mode either "readonly" or "readwrite"
       */
    function getObjectStore(store_name, mode) {
        var tx = db.transaction(store_name, mode);
        return tx.objectStore(store_name);
    }

    function clearObjectStore(store_name) {
        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var req = store.clear();
        req.onsuccess = function(evt) {
            displayActionSuccess("Store cleared");
            displayPubList(store);
        };
        req.onerror = function(evt) {
            console.error("clearObjectStore:", evt.target.errorCode);
            displayActionFailure(this.error);
        };
    }

    function getBlob(key, store, success_callback) {
        var req = store.get(key);
        req.onsuccess = function (evt) {
            var value = evt.target.result;
            if (value)
                success_callback(value.blob);
        };
    }

    /**
   * @param {object} Card
   */
    function addCard(card) {

        var store = getObjectStore(DB_STORE_NAME, 'readwrite');
        var req = store.add(card);
 
        req.onsuccess = function (evt) {
            console.log("Insertion in DB successful");
        };
        req.onerror = function () {
            console.error("Error Inserting into db", this.error);
        };
    }

    function getAllCards() {
        console.log("Get all cards");
        var store = getObjectStore(DB_STORE_NAME, 'readonly');

        var req = store.openCursor();

        req.onsuccess = function (evt) {
            var cardList = [];
            var cursor = evt.target.result;

            // If the cursor is pointing at something, ask for the data
            if (cursor) {
                console.log("getAllCards cursor:", cursor);
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
            }

            return cardList;
        };
    }

    function getCard(id) {
        var store = getObjectStore(DB_STORE_NAME, 'readonly');

        var req = store.get(id);

        req.onerror = function (event) {
            // Handle errors!
            console.error("Error getting data for", id);
        };
        req.onsuccess = function (event) {
            // Do something with the request.result!
            return req.result;
        };
    }


    openDb();
})();