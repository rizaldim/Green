import { formatISO } from 'date-fns';
import { DBClient } from './localDb.js';
import { view } from './view.js';

var viewState = view.setState({
	isButtonEnabled: false,
	expenses: [],
	amountInput: '',
	descInput: ''
});

var dbClient = new DBClient();

var onDbOpened = function () {
	viewState.isButtonEnabled = true;
	dbClient.getAllExpenses()
		.then(function (expenses) {
			viewState.expenses = expenses;
		})
		.catch(function (err) {
			console.log('error getting all expenses');
			console.log(err);
		});
}

var onExpenseSaved = function (expense) {
	viewState.amountInput = '';
	viewState.descInput = '';
	viewState.expenses.push(expense);
};

var saveExpense = function (userInput) {
	var expense = {
		time: formatISO(new Date()),
		amount: userInput.amount,
		description: userInput.description
	};
	dbClient.saveExpense(expense)
		.then(onExpenseSaved)
		.catch(function (err) {
			console.log('Error when saving expense');
			console.log(err);
		});
}

var eventHandler = (function () {
	var onClickButton = function (obj) {
		saveExpense(obj);
	};

	var onSubmitForm = function (obj) {
		saveExpense(obj);
	}

	return {
		handle: function (eventType, obj) {
			if (eventType == view.eventType.clickButton) {
				onClickButton(obj);
			}
			if (eventType == view.eventType.submitForm) {
				onSubmitForm(obj);
			}
		}
	}
})();

view.setEventHandler(eventHandler);

dbClient.open()
	.then(onDbOpened)
	.catch(function (err) {
		console.log(err);
	});

