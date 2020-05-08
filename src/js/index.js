import { format, formatISO, parseISO } from 'date-fns';
import { DBClient } from './localDb.js';
import { view } from './view.js';

var dbClient = new DBClient({
	onSuccess: function (event) {
		view.enableAddButton();
	},
	onError: function (event) {
	}
});

view.setEventHandler({
	onAddButtonClicked: function (amount, desc) {
		dbClient.saveExpense({
			time: formatISO(new Date()),
			amount: amount,
			description: desc
		}, function (expense) {
			console.log('expense saved:');
			console.log(expense);
		});
	}
});

document.addEventListener('click', function (event) {
	view.handleEvent(event);
});

dbClient.open();
view.clearForm();
