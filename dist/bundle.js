/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dateTimeUtils = __webpack_require__(1);
	var template = __webpack_require__(2);
	
	// import '!style!css!./datetime-picker.css';
	__webpack_require__(3);
	
	angular.module('ci-datetime-picker', []).directive('ciDateTimePicker', DateTimePickerDirective);
	
	DateTimePickerController.$inject = ['$scope', '$element', '$attrs'];
	function DateTimePickerController($scope, $element, $attrs) {
	
	  let $dateTimeCtrl = this;
	  let _DATETIMEVALUEFORMAT = 'LLLL';
	
	  $dateTimeCtrl.dpShow = $scope.dpShow === undefined || $scope.dpShow;
	  $dateTimeCtrl.tpShow = $scope.tpShow === undefined || $scope.tpShow;
	
	  if ($scope.datetimeValue === '') {
	    $scope.datetimeValue = new Date().toString();
	  }
	  $dateTimeCtrl.dateValue = dateTimeUtils.getDate($scope.datetimeValue);
	  $dateTimeCtrl.timeValue = dateTimeUtils.getTime($scope.datetimeValue);
	
	  $dateTimeCtrl.onDateBlur = evt => {
	    $dateTimeCtrl.dateValue = evt.target.value;
	    let dt = new Date($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
	    $scope.datetimeValue = moment(dt).format(_DATETIMEVALUEFORMAT);
	    $scope.$emit('dp.updateDateTime', { dateValue: $dateTimeCtrl.dateValue, timeValue: $dateTimeCtrl.timeValue });
	  };
	
	  $dateTimeCtrl.onTimeBlur = evt => {
	    $dateTimeCtrl.timeValue = evt.target.value;
	    let dt = new Date($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
	    $scope.datetimeValue = moment(dt).format(_DATETIMEVALUEFORMAT);
	    $scope.$emit('dp.updateDateTime', { dateValue: $dateTimeCtrl.dateValue, timeValue: $dateTimeCtrl.timeValue });
	  };
	
	  $scope.$on('dp.dateChange', (evt, value) => {
	    $dateTimeCtrl.dateValue = value.dateValue;
	    let dt = new Date($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
	    $scope.datetimeValue = moment(dt).format(_DATETIMEVALUEFORMAT);
	
	    // broadcast datetime change to controller
	    $scope.$emit('dp.updateDateTime', {
	      dateValue: $dateTimeCtrl.dateValue,
	      timeValue: $dateTimeCtrl.timeValue
	    });
	  });
	}
	
	function DateTimePickerDirective() {
	  return {
	    restrict: 'E',
	    require: '^ngModel',
	    scope: {
	      dpOptions: '=',
	      tpOptions: '=',
	      dpShow: '=',
	      tpShow: '=',
	      datetimeValue: '=ngModel'
	    },
	    link: DateTimePickerLinker,
	    controller: DateTimePickerController,
	    controllerAs: '$dateTimeCtrl',
	    template: template
	  };
	}
	
	function DateTimePickerLinker(scope, element, attrs, ngModel) {
	
	  let dpDefaultOpts = {
	    todayBtn: 'linked',
	    autoclose: true,
	    todayHighlight: true,
	    weekStart: 0
	  };
	
	  let tpDefaultOpts = {
	    'scrollDefault': 'now',
	    'timeFormat': 'g:i A',
	    'step': 15
	  };
	
	  // picker option defaults
	  let dpOpts = angular.extend(dpDefaultOpts, scope.dpOptions);
	  let tpOpts = angular.extend(tpDefaultOpts, scope.tpOptions);
	
	  // setup date and time pickers
	  this.tp = $(element).find('input.time-picker').timepicker(tpOpts);
	  this.dp = $(element).find('input.date-picker').datepicker(dpOpts);
	
	  let defaultDate = dateTimeUtils.getDate(scope.datetimeValue);
	  let defaultTime = dateTimeUtils.getTime(scope.datetimeValue); // this does not seem to be used anywhere
	
	  // set control default date (supplyed by ng-model)
	  $(this.dp).datepicker('setDate', defaultDate);
	
	  // attach event listener triggered when date change occurs
	  $(this.dp).datepicker().on('changeDate', evt => {
	    scope.$broadcast('dp.dateChange', { dateValue: evt.target.value });
	  });
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	let dateTimeUtils = {
	
	  getMonth: datetime => {
	    let dt = new Date(datetime);
	    return dt.getMonth() + 1;
	  },
	
	  getDay: datetime => {
	    let dt = new Date(datetime);
	    return dt.getDate();
	  },
	
	  getYear: datetime => {
	    let dt = new Date(datetime);
	    return dt.getFullYear();
	  },
	
	  getHours: datetime => {
	    if (typeof datetime !== 'string') {
	      return null;
	    }
	    let dt = new Date(datetime);
	    return dt.getHours();
	  },
	
	  getMinutes: datetime => {
	    if (typeof datetime !== 'string') {
	      return null;
	    }
	    let dt = new Date(datetime);
	    return dt.getMinutes();
	  },
	
	  getTime: datetime => {
	    let hours = parseInt(dateTimeUtils.getHours(datetime));
	    let mins = parseInt(dateTimeUtils.getMinutes(datetime));
	    let ampm = 'am';
	
	    if (hours > 12) {
	      hours -= 12;
	      ampm = 'pm';
	    }
	
	    if (hours === 12) {
	      ampm = 'pm';
	    }
	
	    if (hours === 0) {
	      hours = 12;
	    }
	
	    if (hours > 24) {
	      hours = 0;
	      ampm = 'am';
	    }
	
	    return hours + ':' + dateTimeUtils.addZero(mins) + ' ' + ampm.toUpperCase();
	  },
	
	  getDate: datetime => {
	    let mon = parseInt(dateTimeUtils.getMonth(datetime));
	    let day = parseInt(dateTimeUtils.getDay(datetime));
	    let year = parseInt(dateTimeUtils.getYear(datetime));
	    return dateTimeUtils.addZero(mon) + '/' + dateTimeUtils.addZero(day) + '/' + year;
	  },
	
	  isValidTime: value => {
	    let timeValue = value.toUpperCase().replace(' ', ':');
	    let ampm = 'AM';
	    let isValidTime = true;
	
	    if (typeof timeValue !== 'undefined') {
	      let parts = timeValue.split(':');
	      if (parts.length === 0) {
	        let timeValue24 = parseInt(timeValue);
	        if (timeValue > 0 && timeValue <= 2359) {
	          isValidTime = true;
	        }
	      }
	
	      let hours = parseInt(parts[0]);
	      let mins = parseInt(parts[1]);
	      ampm = parts.length > 1 ? parts[2] : ampm;
	
	      if (hours > 12) {
	        hours -= hours;
	        ampm = 'PM';
	      }
	      if (hours > 12 || mins > 59) {
	        isValidTime = false;
	      }
	    }
	
	    return isValidTime;
	  },
	
	  isValidDate: datetime => {},
	
	  addZero: val => {
	    if (val < 10) {
	      val = '0' + val;
	    }
	    return val;
	  }
	};
	
	module.exports = dateTimeUtils;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = "<!DOCTYPE html>\n<div class=\"ci-datetime-picker\">\n  <div ng-show=\"{{$dateTimeCtrl.dpShow}}\" class=\"input-group ci-datetime-picker-date\" style=\"width: 140px; float: left;\">\n    <input class=\"form-control date-picker\" type=\"text\" ng-model=\"$dateTimeCtrl.dateValue\" ng-blur=\"$dateTimeCtrl.onDateBlur($event)\" class=\"form-control date-picker\">\n    <span class=\"input-group-addon date-picker\"><i class=\"glyphicon glyphicon-calendar\"></i></span>\n  </div>\n\n  <div ng-show=\"{{$dateTimeCtrl.tpShow}}\" class=\"input-group ci-datetime-picker-time\" style=\"width: 140px; padding-left: 5px; padding-right: 10px;\">\n    <input type=\"text\" class=\"form-control time-picker\" ng-model=\"$dateTimeCtrl.timeValue\" ng-blur=\"$dateTimeCtrl.onTimeBlur($event)\">\n    <span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-time\"></i></span>\n  </div>\n</div>\n"

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./datetime-picker.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./datetime-picker.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports
	
	
	// module
	exports.push([module.id, ".ci-datetime-picker {\n  border-radius: 3px;\n}\n", ""]);
	
	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map