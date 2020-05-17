import { format, parseISO } from 'date-fns';
import { util } from './util.js';

export var view = (function () {
	var eventHandler;

	var eventType = {
		clickButton: 0,
		submitForm: 1
	}

	document.addEventListener('click', function (event) {
		event.preventDefault();
		if (!eventHandler) return;
		if (event.target == elements.button.el) {
			eventHandler.handle(eventType.clickButton, {
				amount: elements.amountInput.el.value,
				description: elements.descInput.el.value
			});
		}
	});

	document.addEventListener('submit', function (event) {
		event.preventDefault();
		if (!eventHandler) return;
		eventHandler.handle(eventType.submitForm, {
			amount: elements.amountInput.el.value,
			description: elements.descInput.el.value
		});
	});

	var elements = {
		amountInput: util.element('input#amount', 'amountInput',
			function (el, state) {
				el.value = state.amountInput;
			}
		),
		descInput: util.element('input#description', 'descInput',
			function (el, state) {
				el.value = state.descInput;
			}
		),
		button: util.element('button', 'isButtonEnabled',
			function (el, state) {
				if (state.isButtonEnabled) {
					el.removeAttribute('disabled');
				} else {
					el.setAttribute('disabled', true);
				}
			}
		),
		p: util.element('p', 'expenses',
			function (el, state) {
				if (state.expenses.length == 0) {
					el.style.removeProperty('display');
				} else {
					util.view.hide(el);
				}
			}
		),
		table: util.tableElement('table', 'expenses',
			function (el, state) {
				if (state.expenses.length == 0) {
					util.view.hide(el);
				} else {
					el.style.removeProperty('display');
					for (var expense of state.expenses) {
						el.appendChild(constructRow(expense));
					}
				}
			}, {
				onPush: function (newItem) {
					this.el.appendChild(constructRow(newItem));
				}
			}
		)
	};

	var render = function (state, prop) {
		for (var name in elements) {
			elements[name].render(state, prop);
		}
	}

	var stateHandler = util.createProxyHandler(render, {
		onPush: function (prop, newItem) {
			if (prop == 'expenses') {
				elements.table.onPush(newItem);
			}
		}
	});

	var stateProxy;

	function constructRow (expense) {
		var time = format(parseISO(expense.time), 'dd/MMM/yyyy HH:mm');
		var row = document.createElement('tr');
		row.innerHTML = '<td>' + time + '</td>' +
			'<td>' + expense.amount + '</td>' +
			'<td>' + expense.description + '</td>';
		return row;
	}

	return {
		eventType: eventType,
		setState: function (state) {
			render(state);
			return new Proxy(state, stateHandler);
		},
		setEventHandler: function (obj) {
			eventHandler = obj;
		},
	};
})();
