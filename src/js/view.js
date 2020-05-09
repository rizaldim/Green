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
			if (!expenses) hideElement(table);
			var row = constructRow(expense);
			table.appendChild(row);
		}
	};
})();
