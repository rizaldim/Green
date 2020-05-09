export var DBClient = (function () {

	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	if (!indexedDB) {
		throw new Error("Browser doesn't support a stable version of IndexedDB.");
	}

	var Constructor = function (handler) {
		var dbName = 'app';
		var version = 1;
		var db;

		var onOpenDbSuccess = function (ev) {
			db = ev.target.result;
		}

		var onOpenDbError = function (ev) {
		}

		var onTransactionComplete = function (ev) { }

		var onTransactionError = function (ev) { }

		var createTransaction = function (opType) {
			var transaction;
			if (!!opType) {
				transaction = db.transaction('expense', opType);
			} else {
				transaction = db.transaction('expense');
			}
			transaction.oncomplete = onTransactionComplete;
			transaction.onerror = onTransactionError;
			return transaction;
		}

		var getObjectStore = function (name, operationType) {
			return createTransaction(operationType).objectStore(name);
		}

		return {
			open: function () {
				var f = function (resolve, reject) {
					var req = indexedDB.open(dbName, version);

					req.onerror = function (event) {
						onOpenDbError(event);
						reject(event);
					}

					req.onsuccess = function (event) {
						onOpenDbSuccess(event);
						resolve();
					}

					req.onupgradeneeded = function (event) {
						db = event.target.result;
						var store = db.createObjectStore('expense', { autoIncrement: true });
						store.createIndex('timestamp', 'timestamp', { unique: true });
					}
				}
				return new Promise(f);
			},
			saveExpense: function (expense) {
				var f = function (resolve, reject) {
					var request = getObjectStore('expense', 'readwrite').add(expense);
					request.onsuccess = function (ev) {
						expense.id = ev.target.result;
						resolve(expense);
					}
					request.onerror = function (ev) {
						reject(ev);
					}
				}
				return new Promise(f);
			},
			getAllExpenses: function () {
				return new Promise(function (resolve, reject) {
					var req = getObjectStore('expense').getAll();
					req.onsuccess = function (ev) {
						resolve(ev.target.result);
					}
					req.onerror = function (ev) {
						reject(ev);
					}
				});
			}
		};
	}

	return Constructor;
})();
