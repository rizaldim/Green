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

		var createTransaction = function () {
			var transaction = db.transaction(['expense'], 'readwrite');
			transaction.oncomplete = onTransactionComplete;
			transaction.onerror = onTransactionError;
			return transaction;
		}

		return {
			open: function () {
				var req = indexedDB.open(dbName, version);

				req.onerror = function (event) {
					onOpenDbError(event);
					if (!!handler.onError) handler.onError();
				}

				req.onsuccess = function (event) {
					onOpenDbSuccess(event);
					if (!!handler.onSuccess) handler.onSuccess();
				}

				req.onupgradeneeded = function (event) {
					db = event.target.result;
					var store = db.createObjectStore('expense', { autoIncrement: true });
					store.createIndex('timestamp', 'timestamp', { unique: true });
				}
			},
			saveExpense: function (expense, callback) {
				var request = createTransaction()
					.objectStore('expense')
					.add(expense);
				request.onsuccess = function (ev) {
					expense.id = ev.target.result;
					callback(expense);
				}
			}
		};
	}

	return Constructor;
})();
