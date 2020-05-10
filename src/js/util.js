export var util = (function () {

	var element = function (identifier, stateProps, renderFunction) {
		if (typeof(stateProps) == 'string') {
			stateProps = [stateProps];
		}
		return {
			el: document.querySelector(identifier),
			stateProps: stateProps,
			render: function (state, changedProp) {
				if (!changedProp || this.stateProps.indexOf(changedProp) > -1) {
					renderFunction(this.el, state);
				}
			}
		}
	};

	var view = {
		hide: function (el) {
			el.style.display = 'none';
		}
	}

	var ArrayProxyHandler = (function () {
		var Constructor = function (arr, parentProp, callback) {

			var state;
			var currentLength = arr.length;
			var newItem;

			var reset = function () {
				state = undefined;
				newItem = undefined;
			}

			return {
				get: function (obj, prop) {
					var propType = Object.prototype.toString.call(obj[prop]);
					if (propType == '[object Function]') {
						if (prop == 'push') {
							state = 'pushing';
						}
					}
					return obj[prop];
				},
				set: function (obj, prop, value) {
					var propType = Object.prototype.toString.call(obj[prop]);
					if (state == 'pushing') {
						if (propType == '[object Undefined]' &&
							prop == currentLength) {
							newItem = value;
						} else if (prop == 'length') {
							callback.onPush(parentProp, newItem);
							currentLength = obj[prop];
							reset();
						}
					}
					obj[prop] = value;
					return true;
				}
			}
		}

		return Constructor;
	})();

	var createProxyHandler = function (renderFunction, arrayCallback) {
		return {
			get: function (obj, prop) {
				var propType = Object.prototype.toString.call(obj[prop]);
				if (propType == '[object Array]') {
					return new Proxy(obj[prop], new ArrayProxyHandler(prop, arrayCallback));
				}
				if (propType == '[object Object]') {
					return new Proxy(obj[prop], createProxyHandler(renderFunction));
				}
				return obj[prop];
			},
			set: function (obj, prop, value) {
				if (!obj.hasOwnProperty(prop)) return false;

				obj[prop] = value;
				renderFunction(obj, prop);
				return true;
			},
			deleteProperty: function (obj, prop) {
				// Not allowed
				return false;
			}
		};
	};

	return {
		view: view,
		element: element,
		createProxyHandler: createProxyHandler
	};

})();

