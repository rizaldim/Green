import { format, parseISO } from 'date-fns';

export var view = (function () {
	var button = document.querySelector('button');
	var amountInput = document.querySelector('input#amount');
	var descInput = document.querySelector('input#description');
	var table = document.querySelector('table');
	var p = document.querySelector('p');

	var hideElement = function (el) {
		el.style.display = 'none';
	}

	var handler;

	return {
		setEventHandler: function (obj) {
			handler = obj;
		},
		handleEvent: function (type, ev) {
			ev.preventDefault();
			if (type == 'click') {
				if (ev.target == button) {
					handler.onAddButtonClicked(amountInput.value, descInput.value);
				}
				return;
			}
			if (type == 'submit') {
				handler.onAddButtonClicked(amountInput.value, descInput.value);
			}
		},
		clearForm: function () {
			amountInput.value = '';
			descInput.value = '';
		},
		showParagraph: function () {
			p.style.display = 'block';
		},
		hideParagraph: function () {
			hideElement(p);
		},
		showTable: function () {
			table.style.display = 'block';
		},
		enableAddButton: function () {
			button.removeAttribute('disabled');
		},
		constructRow: function (expense) {
			var time = format(parseISO(expense.time), 'dd/MMM/yyyy HH:mm');
			var row = document.createElement('tr');
			row.innerHTML = '<td>' + time + '</td>' +
				'<td>' + expense.amount + '</td>' +
				'<td>' + expense.description + '</td>';
			return row;
		},
		addTableRow: function (expense) {
			var row = this.constructRow(expense);
			table.appendChild(row);
		},
		addExpense: function (expense) {
			this.hideParagraph();
			this.addTableRow(expense);
			this.showTable();
		},
		showExpenses: function (expenses) {
			if (expenses.length == 0) {
				p.textContent = 'No expenses recorded';
				this.showParagraph();
				return;
			}

			this.showTable();
			for (var i = 0; i < expenses.length; i++) {
				this.addTableRow(expenses[i]);
			}
		}
	};
})();
