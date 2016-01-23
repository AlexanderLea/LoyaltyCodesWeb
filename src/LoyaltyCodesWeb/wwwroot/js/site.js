// Write your Javascript code.

if (!window.indexedDB) {
    window.alert("Your browser doesn't support IndexedDB. ");
}

var Database_Name = "LoyaltyCodesDb";
var request = indexedDB.open(Database_Name);
request.onsuccess = function (e) {
    console.log("Database Open.", request.result);
}
request.onerror = function (e) {
    console.log("Error:=.", e.target.errorCode);
}