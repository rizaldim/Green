import { formatISO } from 'date-fns';
import { DBClient } from './localDb.js';
import { view } from './view.js';

var dbClient = new DBClient();

var onDbOpened = function () {
	view.enableAddButton();
	dbClient.getAllExpenses()
		.then(function (expenses) {
			view.showExpenses(expenses);
			console.log(expenses);
		})
		.catch(function (err) {
			console.log('error getting all expenses');
			console.log(err);
		});
}

var onExpenseSaved = function (expense) {
	console.log('expense saved');
	console.log(expense);
	view.clearForm();
	view.addExpense(expense);
};

view.setEventHandler({
	onAddButtonClicked: function (amount, desc) {
		var expense = {
			time: formatISO(new Date()),
			amount: amount,
			description: desc
		};
		dbClient.saveExpense(expense)
			.then(onExpenseSaved)
			.catch(function (err) {
				console.log('Error when saving expense');
				console.log(err);
			});
	}
});

document.addEventListener('click', function (event) {
	view.handleEvent('click', event);
});

document.addEventListener('submit', function (event) {
	view.handleEvent('submit', event);
});

view.clearForm();

dbClient.open()
	.then(onDbOpened)
	.catch(function (err) {
		console.log(err);
	});

