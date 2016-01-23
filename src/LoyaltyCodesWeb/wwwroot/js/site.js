// Write your Javascript code.

if (!window.indexedDB) {
    window.alert("Your browser doesn't support IndexedDB. ");
}

var databaseName = "LoyaltyCodesDb";
var objectStoreName = "Cards";
var dbVersion = "2";
var db;

//Data which we want to store inside the database.  
var data = [
    { Name: "Nectar", Description: "Alexander's Nectar Card", Barcode: "1235495455" },
    { Name: "Tesco Clubcard", Description: "Joint Clubcard", Barcode: "8798545121465181591891" },
    { Name: "Oxford Brookes Climbing Wall", Description: "", Barcode: "7984561284956" }
];

initDB();

function initDB() {
    var request = indexedDB.open(databaseName, dbVersion);
    request.onsuccess = function (e) {
        console.log("Database open");
        db = request.result;
    }
    request.onerror = function (e) {
        console.log("Error:" + e.target.errorCode);        
    }

    //the onupgradeneeded event is fire when a database is opened with a new version number  
    request.onupgradeneeded = function (e) {

        //creating Object Store  
        var objectStore = db.createObjectStore(objectStoreName, { keyPath: "id", autoIncrement: true });

        //creating Indexes  
        objectStore.createIndex("Name", "Name", { unique: false });
        objectStore.createIndex("Description", "Description", { unique: false });
        objectStore.createIndex("Barcode", "Barcode", { unique: false });

        objectStore.transaction.oncomplete = function () {
            //To store the Data  
            var cardsObjectStore = db.transaction(objectStoreName, "readwrite").objectStore(objectStoreName);

            for (i in data) {
                cardsObjectStore.add(data[i]);
            }
        }
    };
}

function get(id) {
    var transaction = db.transaction([objectStoreName]);
    var objectStore = transaction.objectStore(objectStoreName);
    var request = objectStore.get(id);

    request.onerror = function (event) {
        // Handle errors!
        console.error("Error getting data for", id);
    };
    request.onsuccess = function (event) {
        // Do something with the request.result!
        return request.result;
    };
}