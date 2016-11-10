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
	
	const dateTimeUtils = __webpack_require__(1);
	const Sugar = __webpack_require__(2);
	const template = __webpack_require__(388);
	
	__webpack_require__(389);
	__webpack_require__(393);
	__webpack_require__(395);
	
	angular.module('ci-datetime-picker', []).directive('ciDatetimePicker', DateTimePickerDirective);
	
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
	    let result = dateTimeUtils.convertHumanDate(evt.target.value);
	    if (dateTimeUtils.isValidDate(result)) {
	      $dateTimeCtrl.dateValue = dateTimeUtils.getDate(result);
	    } else {
	      $dateTimeCtrl.dateValue = evt.target.value;
	    }
	    let dt = new Date($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
	    $scope.datetimeValue = moment(dt).format(_DATETIMEVALUEFORMAT);
	    // $scope.$emit('dp.updateDateTime', {dateValue: $dateTimeCtrl.dateValue, timeValue: $dateTimeCtrl.timeValue});
	  };
	
	  $dateTimeCtrl.onDateKeyUp = evt => {
	    console.log(evt);
	  };
	
	  $dateTimeCtrl.onTimeBlur = evt => {
	    $dateTimeCtrl.timeValue = evt.target.value;
	    let dt = new Date($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
	    $scope.datetimeValue = moment(dt).format(_DATETIMEVALUEFORMAT);
	    // $scope.$emit('dp.updateDateTime', {dateValue: $dateTimeCtrl.dateValue, timeValue: $dateTimeCtrl.timeValue});
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
	
	  $scope.$on('destroy', () => {
	    $(element).find('span.time-picker-icon').unbind('click');
	    $(element).find('span.date-picker-icon').unbind('click');
	  });
	}
	
	function DateTimePickerDirective() {
	  return {
	    restrict: 'E',
	    require: '^ngModel',
	    scope: {
	      dpOptions: '<',
	      tpOptions: '<',
	      dpShow: '<',
	      tpShow: '<',
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
	    weekStart: 0,
	    forceParse: false // this is required to support human entry
	  };
	
	  let tpDefaultOpts = {
	    'scrollDefault': 'now',
	    'timeFormat': 'g:i A',
	    'step': 15
	  };
	
	  // picker option defaults
	  let dpOpts = angular.extend(dpDefaultOpts, scope.dpOptions);
	  let tpOpts = angular.extend(tpDefaultOpts, scope.tpOptions);
	
	  // setup date and time pickers with config options from attributes
	  let tp = $(element).find('input.time-picker');
	  let dp = $(element).find('input.date-picker');
	  tp.timepicker(tpOpts);
	  dp.datepicker(dpOpts);
	  dp.on('changeDate', () => {
	    console.log('changeDate');
	  });
	
	  // setup click handler if time-icon is clicked
	  $(element).find('span.time-picker-icon').on('click', () => {
	    tp.timepicker('show');
	  });
	
	  // setup click handler if date-icon is clicked
	  $(element).find('span.date-picker-icon').on('click', () => {
	    dp.datepicker('show');
	  });
	
	  let defaultDate = dateTimeUtils.getDate(scope.datetimeValue);
	  let defaultTime = dateTimeUtils.getTime(scope.datetimeValue);
	
	  // set control default date (supplyed by ng-model)
	  dp.datepicker('setDate', defaultDate);
	  tp.timepicker('setTime', defaultTime);
	
	  // attach event listener triggered when date change occurs
	  dp.datepicker().on('changeDate', evt => {
	    scope.$broadcast('dp.dateChange', { dateValue: evt.target.value });
	  });
	
	  ngModel.$render = () => {
	    var dateValue = dateTimeUtils.getDate(ngModel.$viewValue);
	    var timeValue = dateTimeUtils.getTime(ngModel.$viewValue);
	
	    if (dateTimeUtils.isValidTime(timeValue)) {
	      scope.$dateTimeCtrl.timeValue = timeValue;
	      tp.timepicker('setTime', timeValue);
	    }
	
	    if (dateTimeUtils.isValidDate(dateValue)) {
	      scope.$dateTimeCtrl.dateValue = dateValue;
	      dp.datepicker('setDate', dateValue);
	    }
	  };
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Sugar = __webpack_require__(2);
	
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
	    let dt = new Date(datetime);
	    return dt.getHours();
	  },
	
	  getMinutes: datetime => {
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
	
	    if (/nan/i.test(value)) {
	      return false;
	    }
	
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
	
	  isValidDate: datetime => {
	    // this needs further validation but this will suffice for now
	    if (!datetime) {
	      return false;
	    }
	    var dt = new Date(datetime);
	    return !isNaN(dt);
	  },
	
	  addZero: val => {
	    if (val < 10) {
	      val = '0' + val;
	    }
	    return val;
	  },
	
	  convertHumanDate: val => {
	    let dtResult = Sugar.Date.create(val);
	    if (!isNaN(dtResult)) {
	      return dtResult;
	    }
	    return null;
	  }
	};
	
	module.exports = dateTimeUtils;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(3);
	__webpack_require__(341);
	
	module.exports = __webpack_require__(5);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Static Methods
	__webpack_require__(4);
	__webpack_require__(64);
	__webpack_require__(110);
	__webpack_require__(112);
	__webpack_require__(113);
	__webpack_require__(114);
	__webpack_require__(115);
	
	// Instance Methods
	__webpack_require__(116);
	__webpack_require__(123);
	__webpack_require__(124);
	__webpack_require__(125);
	__webpack_require__(126);
	__webpack_require__(127);
	__webpack_require__(128);
	__webpack_require__(129);
	__webpack_require__(130);
	__webpack_require__(131);
	__webpack_require__(132);
	__webpack_require__(133);
	__webpack_require__(134);
	__webpack_require__(135);
	__webpack_require__(136);
	__webpack_require__(137);
	__webpack_require__(138);
	__webpack_require__(139);
	__webpack_require__(140);
	__webpack_require__(141);
	__webpack_require__(142);
	__webpack_require__(143);
	__webpack_require__(144);
	__webpack_require__(145);
	__webpack_require__(146);
	__webpack_require__(147);
	__webpack_require__(148);
	__webpack_require__(149);
	__webpack_require__(150);
	__webpack_require__(151);
	__webpack_require__(152);
	__webpack_require__(153);
	__webpack_require__(154);
	__webpack_require__(155);
	__webpack_require__(156);
	__webpack_require__(157);
	__webpack_require__(158);
	__webpack_require__(159);
	__webpack_require__(160);
	__webpack_require__(161);
	__webpack_require__(162);
	__webpack_require__(163);
	__webpack_require__(164);
	__webpack_require__(165);
	__webpack_require__(166);
	__webpack_require__(167);
	__webpack_require__(168);
	__webpack_require__(169);
	__webpack_require__(170);
	__webpack_require__(171);
	__webpack_require__(172);
	__webpack_require__(173);
	__webpack_require__(174);
	__webpack_require__(175);
	__webpack_require__(176);
	__webpack_require__(177);
	__webpack_require__(178);
	__webpack_require__(179);
	__webpack_require__(180);
	__webpack_require__(181);
	__webpack_require__(182);
	__webpack_require__(183);
	__webpack_require__(184);
	__webpack_require__(185);
	__webpack_require__(186);
	__webpack_require__(187);
	__webpack_require__(188);
	__webpack_require__(189);
	__webpack_require__(190);
	__webpack_require__(191);
	__webpack_require__(192);
	__webpack_require__(193);
	__webpack_require__(194);
	__webpack_require__(195);
	__webpack_require__(196);
	__webpack_require__(197);
	__webpack_require__(198);
	__webpack_require__(199);
	__webpack_require__(200);
	__webpack_require__(201);
	__webpack_require__(202);
	__webpack_require__(203);
	__webpack_require__(211);
	__webpack_require__(212);
	__webpack_require__(213);
	__webpack_require__(214);
	__webpack_require__(215);
	__webpack_require__(216);
	__webpack_require__(217);
	__webpack_require__(218);
	__webpack_require__(223);
	__webpack_require__(224);
	__webpack_require__(225);
	__webpack_require__(226);
	__webpack_require__(227);
	__webpack_require__(228);
	__webpack_require__(229);
	__webpack_require__(230);
	__webpack_require__(231);
	__webpack_require__(232);
	__webpack_require__(233);
	__webpack_require__(234);
	__webpack_require__(235);
	__webpack_require__(236);
	__webpack_require__(237);
	__webpack_require__(238);
	__webpack_require__(239);
	__webpack_require__(258);
	__webpack_require__(259);
	__webpack_require__(260);
	__webpack_require__(261);
	__webpack_require__(262);
	__webpack_require__(263);
	__webpack_require__(264);
	__webpack_require__(265);
	__webpack_require__(266);
	__webpack_require__(267);
	__webpack_require__(271);
	__webpack_require__(272);
	__webpack_require__(273);
	__webpack_require__(274);
	__webpack_require__(277);
	__webpack_require__(278);
	__webpack_require__(279);
	__webpack_require__(280);
	__webpack_require__(281);
	__webpack_require__(282);
	__webpack_require__(283);
	__webpack_require__(284);
	__webpack_require__(285);
	__webpack_require__(286);
	__webpack_require__(287);
	__webpack_require__(288);
	__webpack_require__(289);
	__webpack_require__(290);
	__webpack_require__(291);
	__webpack_require__(292);
	__webpack_require__(293);
	__webpack_require__(294);
	__webpack_require__(295);
	__webpack_require__(296);
	__webpack_require__(298);
	__webpack_require__(299);
	__webpack_require__(300);
	__webpack_require__(301);
	__webpack_require__(302);
	__webpack_require__(303);
	__webpack_require__(304);
	__webpack_require__(305);
	__webpack_require__(306);
	__webpack_require__(307);
	__webpack_require__(308);
	__webpack_require__(309);
	__webpack_require__(310);
	__webpack_require__(311);
	__webpack_require__(312);
	__webpack_require__(313);
	__webpack_require__(314);
	__webpack_require__(315);
	__webpack_require__(316);
	__webpack_require__(319);
	__webpack_require__(320);
	__webpack_require__(322);
	__webpack_require__(323);
	__webpack_require__(324);
	__webpack_require__(325);
	__webpack_require__(326);
	__webpack_require__(327);
	__webpack_require__(328);
	__webpack_require__(329);
	__webpack_require__(330);
	__webpack_require__(331);
	__webpack_require__(332);
	__webpack_require__(333);
	__webpack_require__(334);
	__webpack_require__(335);
	__webpack_require__(336);
	__webpack_require__(337);
	__webpack_require__(338);
	
	// Accessors
	__webpack_require__(339);
	__webpack_require__(340);
	
	module.exports = __webpack_require__(5);

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    LocaleHelpers = __webpack_require__(6);
	
	var localeManager = LocaleHelpers.localeManager;
	
	Sugar.Date.defineStatic({
	
	  'addLocale': function(code, set) {
	    return localeManager.add(code, set);
	  }
	
	});
	
	module.exports = Sugar.Date.addLocale;

/***/ },
/* 5 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/*
	 *  Sugar v2.0.2
	 *
	 *  Freely distributable and licensed under the MIT-style license.
	 *  Copyright (c) Andrew Plummer
	 *  https://sugarjs.com/
	 *
	 * ---------------------------- */
	(function() {
	  'use strict';
	
	  /***
	   * @module Core
	   * @description Core functionality including the ability to define methods and
	   *              extend onto natives.
	   *
	   ***/
	
	  // The global to export.
	  var Sugar;
	
	  // The name of Sugar in the global namespace.
	  var SUGAR_GLOBAL = 'Sugar';
	
	  // Natives available on initialization. Letting Object go first to ensure its
	  // global is set by the time the rest are checking for chainable Object methods.
	  var NATIVE_NAMES = 'Object Number String Array Date RegExp Function';
	
	  // Static method flag
	  var STATIC   = 0x1;
	
	  // Instance method flag
	  var INSTANCE = 0x2;
	
	  // IE8 has a broken defineProperty but no defineProperties so this saves a try/catch.
	  var PROPERTY_DESCRIPTOR_SUPPORT = !!(Object.defineProperty && Object.defineProperties);
	
	  // The global context. Rhino uses a different "global" keyword so
	  // do an extra check to be sure that it's actually the global context.
	  var globalContext = typeof global !== 'undefined' && global.Object === Object ? global : this;
	
	  // Is the environment node?
	  var hasExports = typeof module !== 'undefined' && module.exports;
	
	  // Whether object instance methods can be mapped to the prototype.
	  var allowObjectPrototype = false;
	
	  // A map from Array to SugarArray.
	  var namespacesByName = {};
	
	  // A map from [object Object] to namespace.
	  var namespacesByClassString = {};
	
	  // Defining properties.
	  var defineProperty = PROPERTY_DESCRIPTOR_SUPPORT ?  Object.defineProperty : definePropertyShim;
	
	  // A default chainable class for unknown types.
	  var DefaultChainable = getNewChainableClass('Chainable');
	
	
	  // Global methods
	
	  function setupGlobal() {
	    Sugar = globalContext[SUGAR_GLOBAL];
	    if (Sugar) {
	      // Reuse already defined Sugar global object.
	      return;
	    }
	    Sugar = function(arg) {
	      forEachProperty(Sugar, function(sugarNamespace, name) {
	        // Although only the only enumerable properties on the global
	        // object are Sugar namespaces, environments that can't set
	        // non-enumerable properties will step through the utility methods
	        // as well here, so use this check to only allow true namespaces.
	        if (hasOwn(namespacesByName, name)) {
	          sugarNamespace.extend(arg);
	        }
	      });
	      return Sugar;
	    };
	    if (hasExports) {
	      module.exports = Sugar;
	    } else {
	      try {
	        globalContext[SUGAR_GLOBAL] = Sugar;
	      } catch (e) {
	        // Contexts such as QML have a read-only global context.
	      }
	    }
	    forEachProperty(NATIVE_NAMES.split(' '), function(name) {
	      createNamespace(name);
	    });
	    setGlobalProperties();
	  }
	
	  /***
	   * @method createNamespace(name)
	   * @returns SugarNamespace
	   * @namespace Sugar
	   * @short Creates a new Sugar namespace.
	   * @extra This method is for plugin developers who want to define methods to be
	   *        used with natives that Sugar does not handle by default. The new
	   *        namespace will appear on the `Sugar` global with all the methods of
	   *        normal namespaces, including the ability to define new methods. When
	   *        extended, any defined methods will be mapped to `name` in the global
	   *        context.
	   *
	   * @example
	   *
	   *   Sugar.createNamespace('Boolean');
	   *
	   * @param {string} name - The namespace name.
	   *
	   ***/
	  function createNamespace(name) {
	
	    // Is the current namespace Object?
	    var isObject = name === 'Object';
	
	    // A Sugar namespace is also a chainable class: Sugar.Array, etc.
	    var sugarNamespace = getNewChainableClass(name, true);
	
	    /***
	     * @method extend([opts])
	     * @returns Sugar
	     * @namespace Sugar
	     * @short Extends Sugar defined methods onto natives.
	     * @extra This method can be called on individual namespaces like
	     *        `Sugar.Array` or on the `Sugar` global itself, in which case
	     *        [opts] will be forwarded to each `extend` call. For more,
	     *        see `extending`.
	     *
	     * @options
	     *
	     *   methods           An array of method names to explicitly extend.
	     *
	     *   except            An array of method names or global namespaces (`Array`,
	     *                     `String`) to explicitly exclude. Namespaces should be the
	     *                     actual global objects, not strings.
	     *
	     *   namespaces        An array of global namespaces (`Array`, `String`) to
	     *                     explicitly extend. Namespaces should be the actual
	     *                     global objects, not strings.
	     *
	     *   enhance           A shortcut to disallow all "enhance" flags at once
	     *                     (flags listed below). For more, see `enhanced methods`.
	     *                     Default is `true`.
	     *
	     *   enhanceString     A boolean allowing String enhancements. Default is `true`.
	     *
	     *   enhanceArray      A boolean allowing Array enhancements. Default is `true`.
	     *
	     *   objectPrototype   A boolean allowing Sugar to extend Object.prototype
	     *                     with instance methods. This option is off by default
	     *                     and should generally not be used except with caution.
	     *                     For more, see `object methods`.
	     *
	     * @example
	     *
	     *   Sugar.Array.extend();
	     *   Sugar.extend();
	     *
	     * @option {Array<string>} [methods]
	     * @option {Array<string|NativeConstructor>} [except]
	     * @option {Array<NativeConstructor>} [namespaces]
	     * @option {boolean} [enhance]
	     * @option {boolean} [enhanceString]
	     * @option {boolean} [enhanceArray]
	     * @option {boolean} [objectPrototype]
	     * @param {ExtendOptions} [opts]
	     *
	     ***
	     * @method extend([opts])
	     * @returns SugarNamespace
	     * @namespace SugarNamespace
	     * @short Extends Sugar defined methods for a specific namespace onto natives.
	     * @param {ExtendOptions} [opts]
	     *
	     ***/
	    var extend = function (opts) {
	
	      var nativeClass = globalContext[name], nativeProto = nativeClass.prototype;
	      var staticMethods = {}, instanceMethods = {}, methodsByName;
	
	      function objectRestricted(name, target) {
	        return isObject && target === nativeProto &&
	               (!allowObjectPrototype || name === 'get' || name === 'set');
	      }
	
	      function arrayOptionExists(field, val) {
	        var arr = opts[field];
	        if (arr) {
	          for (var i = 0, el; el = arr[i]; i++) {
	            if (el === val) {
	              return true;
	            }
	          }
	        }
	        return false;
	      }
	
	      function arrayOptionExcludes(field, val) {
	        return opts[field] && !arrayOptionExists(field, val);
	      }
	
	      function disallowedByFlags(methodName, target, flags) {
	        // Disallowing methods by flag currently only applies if methods already
	        // exist to avoid enhancing native methods, as aliases should still be
	        // extended (i.e. Array#all should still be extended even if Array#every
	        // is being disallowed by a flag).
	        if (!target[methodName] || !flags) {
	          return false;
	        }
	        for (var i = 0; i < flags.length; i++) {
	          if (opts[flags[i]] === false) {
	            return true;
	          }
	        }
	      }
	
	      function namespaceIsExcepted() {
	        return arrayOptionExists('except', nativeClass) ||
	               arrayOptionExcludes('namespaces', nativeClass);
	      }
	
	      function methodIsExcepted(methodName) {
	        return arrayOptionExists('except', methodName);
	      }
	
	      function canExtend(methodName, method, target) {
	        return !objectRestricted(methodName, target) &&
	               !disallowedByFlags(methodName, target, method.flags) &&
	               !methodIsExcepted(methodName);
	      }
	
	      opts = opts || {};
	      methodsByName = opts.methods;
	
	      if (namespaceIsExcepted()) {
	        return;
	      } else if (isObject && typeof opts.objectPrototype === 'boolean') {
	        // Store "objectPrototype" flag for future reference.
	        allowObjectPrototype = opts.objectPrototype;
	      }
	
	      forEachProperty(methodsByName || sugarNamespace, function(method, methodName) {
	        if (methodsByName) {
	          // If we have method names passed in an array,
	          // then we need to flip the key and value here
	          // and find the method in the Sugar namespace.
	          methodName = method;
	          method = sugarNamespace[methodName];
	        }
	        if (hasOwn(method, 'instance') && canExtend(methodName, method, nativeProto)) {
	          instanceMethods[methodName] = method.instance;
	        }
	        if(hasOwn(method, 'static') && canExtend(methodName, method, nativeClass)) {
	          staticMethods[methodName] = method;
	        }
	      });
	
	      // Accessing the extend target each time instead of holding a reference as
	      // it may have been overwritten (for example Date by Sinon). Also need to
	      // access through the global to allow extension of user-defined namespaces.
	      extendNative(nativeClass, staticMethods);
	      extendNative(nativeProto, instanceMethods);
	
	      if (!methodsByName) {
	        // If there are no method names passed, then
	        // all methods in the namespace will be extended
	        // to the native. This includes all future defined
	        // methods, so add a flag here to check later.
	        setProperty(sugarNamespace, 'active', true);
	      }
	      return sugarNamespace;
	    };
	
	    function defineWithOptionCollect(methodName, instance, args) {
	      setProperty(sugarNamespace, methodName, function(arg1, arg2, arg3) {
	        var opts = collectDefineOptions(arg1, arg2, arg3);
	        defineMethods(sugarNamespace, opts.methods, instance, args, opts.last);
	        return sugarNamespace;
	      });
	    }
	
	    /***
	     * @method defineStatic(methods)
	     * @returns SugarNamespace
	     * @namespace SugarNamespace
	     * @short Defines static methods on the namespace that can later be extended
	     *        onto the native globals.
	     * @extra Accepts either a single object mapping names to functions, or name
	     *        and function as two arguments. If `extend` was previously called
	     *        with no arguments, the method will be immediately mapped to its
	     *        native when defined.
	     *
	     * @example
	     *
	     *   Sugar.Number.defineStatic({
	     *     isOdd: function (num) {
	     *       return num % 2 === 1;
	     *     }
	     *   });
	     *
	     * @signature defineStatic(methodName, methodFn)
	     * @param {Object} methods - Methods to be defined.
	     * @param {string} methodName - Name of a single method to be defined.
	     * @param {Function} methodFn - Function body of a single method to be defined.
	     ***/
	    defineWithOptionCollect('defineStatic', STATIC);
	
	    /***
	     * @method defineInstance(methods)
	     * @returns SugarNamespace
	     * @namespace SugarNamespace
	     * @short Defines methods on the namespace that can later be extended as
	     *        instance methods onto the native prototype.
	     * @extra Accepts either a single object mapping names to functions, or name
	     *        and function as two arguments. All functions should accept the
	     *        native for which they are mapped as their first argument, and should
	     *        never refer to `this`. If `extend` was previously called with no
	     *        arguments, the method will be immediately mapped to its native when
	     *        defined.
	     *
	     *        Methods cannot accept more than 4 arguments in addition to the
	     *        native (5 arguments total). Any additional arguments will not be
	     *        mapped. If the method needs to accept unlimited arguments, use
	     *        `defineInstanceWithArguments`. Otherwise if more options are
	     *        required, use an options object instead.
	     *
	     * @example
	     *
	     *   Sugar.Number.defineInstance({
	     *     square: function (num) {
	     *       return num * num;
	     *     }
	     *   });
	     *
	     * @signature defineInstance(methodName, methodFn)
	     * @param {Object} methods - Methods to be defined.
	     * @param {string} methodName - Name of a single method to be defined.
	     * @param {Function} methodFn - Function body of a single method to be defined.
	     ***/
	    defineWithOptionCollect('defineInstance', INSTANCE);
	
	    /***
	     * @method defineInstanceAndStatic(methods)
	     * @returns SugarNamespace
	     * @namespace SugarNamespace
	     * @short A shortcut to define both static and instance methods on the namespace.
	     * @extra This method is intended for use with `Object` instance methods. Sugar
	     *        will not map any methods to `Object.prototype` by default, so defining
	     *        instance methods as static helps facilitate their proper use.
	     *
	     * @example
	     *
	     *   Sugar.Object.defineInstanceAndStatic({
	     *     isAwesome: function (obj) {
	     *       // check if obj is awesome!
	     *     }
	     *   });
	     *
	     * @signature defineInstanceAndStatic(methodName, methodFn)
	     * @param {Object} methods - Methods to be defined.
	     * @param {string} methodName - Name of a single method to be defined.
	     * @param {Function} methodFn - Function body of a single method to be defined.
	     ***/
	    defineWithOptionCollect('defineInstanceAndStatic', INSTANCE | STATIC);
	
	
	    /***
	     * @method defineStaticWithArguments(methods)
	     * @returns SugarNamespace
	     * @namespace SugarNamespace
	     * @short Defines static methods that collect arguments.
	     * @extra This method is identical to `defineStatic`, except that when defined
	     *        methods are called, they will collect any arguments past `n - 1`,
	     *        where `n` is the number of arguments that the method accepts.
	     *        Collected arguments will be passed to the method in an array
	     *        as the last argument defined on the function.
	     *
	     * @example
	     *
	     *   Sugar.Number.defineStaticWithArguments({
	     *     addAll: function (num, args) {
	     *       for (var i = 0; i < args.length; i++) {
	     *         num += args[i];
	     *       }
	     *       return num;
	     *     }
	     *   });
	     *
	     * @signature defineStaticWithArguments(methodName, methodFn)
	     * @param {Object} methods - Methods to be defined.
	     * @param {string} methodName - Name of a single method to be defined.
	     * @param {Function} methodFn - Function body of a single method to be defined.
	     ***/
	    defineWithOptionCollect('defineStaticWithArguments', STATIC, true);
	
	    /***
	     * @method defineInstanceWithArguments(methods)
	     * @returns SugarNamespace
	     * @namespace SugarNamespace
	     * @short Defines instance methods that collect arguments.
	     * @extra This method is identical to `defineInstance`, except that when
	     *        defined methods are called, they will collect any arguments past
	     *        `n - 1`, where `n` is the number of arguments that the method
	     *        accepts. Collected arguments will be passed to the method as the
	     *        last argument defined on the function.
	     *
	     * @example
	     *
	     *   Sugar.Number.defineInstanceWithArguments({
	     *     addAll: function (num, args) {
	     *       for (var i = 0; i < args.length; i++) {
	     *         num += args[i];
	     *       }
	     *       return num;
	     *     }
	     *   });
	     *
	     * @signature defineInstanceWithArguments(methodName, methodFn)
	     * @param {Object} methods - Methods to be defined.
	     * @param {string} methodName - Name of a single method to be defined.
	     * @param {Function} methodFn - Function body of a single method to be defined.
	     ***/
	    defineWithOptionCollect('defineInstanceWithArguments', INSTANCE, true);
	
	    /***
	     * @method defineStaticPolyfill(methods)
	     * @returns SugarNamespace
	     * @namespace SugarNamespace
	     * @short Defines static methods that are mapped onto the native if they do
	     *        not already exist.
	     * @extra Intended only for use creating polyfills that follow the ECMAScript
	     *        spec. Accepts either a single object mapping names to functions, or
	     *        name and function as two arguments.
	     *
	     * @example
	     *
	     *   Sugar.Object.defineStaticPolyfill({
	     *     keys: function (obj) {
	     *       // get keys!
	     *     }
	     *   });
	     *
	     * @signature defineStaticPolyfill(methodName, methodFn)
	     * @param {Object} methods - Methods to be defined.
	     * @param {string} methodName - Name of a single method to be defined.
	     * @param {Function} methodFn - Function body of a single method to be defined.
	     ***/
	    setProperty(sugarNamespace, 'defineStaticPolyfill', function(arg1, arg2, arg3) {
	      var opts = collectDefineOptions(arg1, arg2, arg3);
	      extendNative(globalContext[name], opts.methods, true, opts.last);
	      return sugarNamespace;
	    });
	
	    /***
	     * @method defineInstancePolyfill(methods)
	     * @returns SugarNamespace
	     * @namespace SugarNamespace
	     * @short Defines instance methods that are mapped onto the native prototype
	     *        if they do not already exist.
	     * @extra Intended only for use creating polyfills that follow the ECMAScript
	     *        spec. Accepts either a single object mapping names to functions, or
	     *        name and function as two arguments. This method differs from
	     *        `defineInstance` as there is no static signature (as the method
	     *        is mapped as-is to the native), so it should refer to its `this`
	     *        object.
	     *
	     * @example
	     *
	     *   Sugar.Array.defineInstancePolyfill({
	     *     indexOf: function (arr, el) {
	     *       // index finding code here!
	     *     }
	     *   });
	     *
	     * @signature defineInstancePolyfill(methodName, methodFn)
	     * @param {Object} methods - Methods to be defined.
	     * @param {string} methodName - Name of a single method to be defined.
	     * @param {Function} methodFn - Function body of a single method to be defined.
	     ***/
	    setProperty(sugarNamespace, 'defineInstancePolyfill', function(arg1, arg2, arg3) {
	      var opts = collectDefineOptions(arg1, arg2, arg3);
	      extendNative(globalContext[name].prototype, opts.methods, true, opts.last);
	      // Map instance polyfills to chainable as well.
	      forEachProperty(opts.methods, function(fn, methodName) {
	        defineChainableMethod(sugarNamespace, methodName, fn);
	      });
	      return sugarNamespace;
	    });
	
	    /***
	     * @method alias(toName, from)
	     * @returns SugarNamespace
	     * @namespace SugarNamespace
	     * @short Aliases one Sugar method to another.
	     *
	     * @example
	     *
	     *   Sugar.Array.alias('all', 'every');
	     *
	     * @signature alias(toName, fn)
	     * @param {string} toName - Name for new method.
	     * @param {string|Function} from - Method to alias, or string shortcut.
	     ***/
	    setProperty(sugarNamespace, 'alias', function(name, source) {
	      var method = typeof source === 'string' ? sugarNamespace[source] : source;
	      setMethod(sugarNamespace, name, method);
	      return sugarNamespace;
	    });
	
	    // Each namespace can extend only itself through its .extend method.
	    setProperty(sugarNamespace, 'extend', extend);
	
	    // Cache the class to namespace relationship for later use.
	    namespacesByName[name] = sugarNamespace;
	    namespacesByClassString['[object ' + name + ']'] = sugarNamespace;
	
	    mapNativeToChainable(name);
	    mapObjectChainablesToNamespace(sugarNamespace);
	
	
	    // Export
	    return Sugar[name] = sugarNamespace;
	  }
	
	  function setGlobalProperties() {
	    setProperty(Sugar, 'extend', Sugar);
	    setProperty(Sugar, 'toString', toString);
	    setProperty(Sugar, 'createNamespace', createNamespace);
	
	    setProperty(Sugar, 'util', {
	      'hasOwn': hasOwn,
	      'getOwn': getOwn,
	      'setProperty': setProperty,
	      'classToString': classToString,
	      'defineProperty': defineProperty,
	      'forEachProperty': forEachProperty,
	      'mapNativeToChainable': mapNativeToChainable
	    });
	  }
	
	  function toString() {
	    return SUGAR_GLOBAL;
	  }
	
	
	  // Defining Methods
	
	  function defineMethods(sugarNamespace, methods, type, args, flags) {
	    forEachProperty(methods, function(method, methodName) {
	      var instanceMethod, staticMethod = method;
	      if (args) {
	        staticMethod = wrapMethodWithArguments(method);
	      }
	      if (flags) {
	        staticMethod.flags = flags;
	      }
	
	      // A method may define its own custom implementation, so
	      // make sure that's not the case before creating one.
	      if (type & INSTANCE && !method.instance) {
	        instanceMethod = wrapInstanceMethod(method, args);
	        setProperty(staticMethod, 'instance', instanceMethod);
	      }
	
	      if (type & STATIC) {
	        setProperty(staticMethod, 'static', true);
	      }
	
	      setMethod(sugarNamespace, methodName, staticMethod);
	
	      if (sugarNamespace.active) {
	        // If the namespace has been activated (.extend has been called),
	        // then map this method as well.
	        sugarNamespace.extend(methodName);
	      }
	    });
	  }
	
	  function collectDefineOptions(arg1, arg2, arg3) {
	    var methods, last;
	    if (typeof arg1 === 'string') {
	      methods = {};
	      methods[arg1] = arg2;
	      last = arg3;
	    } else {
	      methods = arg1;
	      last = arg2;
	    }
	    return {
	      last: last,
	      methods: methods
	    };
	  }
	
	  function wrapInstanceMethod(fn, args) {
	    return args ? wrapMethodWithArguments(fn, true) : wrapInstanceMethodFixed(fn);
	  }
	
	  function wrapMethodWithArguments(fn, instance) {
	    // Functions accepting enumerated arguments will always have "args" as the
	    // last argument, so subtract one from the function length to get the point
	    // at which to start collecting arguments. If this is an instance method on
	    // a prototype, then "this" will be pushed into the arguments array so start
	    // collecting 1 argument earlier.
	    var startCollect = fn.length - 1 - (instance ? 1 : 0);
	    return function() {
	      var args = [], collectedArgs = [], len;
	      if (instance) {
	        args.push(this);
	      }
	      len = Math.max(arguments.length, startCollect);
	      // Optimized: no leaking arguments
	      for (var i = 0; i < len; i++) {
	        if (i < startCollect) {
	          args.push(arguments[i]);
	        } else {
	          collectedArgs.push(arguments[i]);
	        }
	      }
	      args.push(collectedArgs);
	      return fn.apply(this, args);
	    };
	  }
	
	  function wrapInstanceMethodFixed(fn) {
	    switch(fn.length) {
	      // Wrapped instance methods will always be passed the instance
	      // as the first argument, but requiring the argument to be defined
	      // may cause confusion here, so return the same wrapped function regardless.
	      case 0:
	      case 1:
	        return function() {
	          return fn(this);
	        };
	      case 2:
	        return function(a) {
	          return fn(this, a);
	        };
	      case 3:
	        return function(a, b) {
	          return fn(this, a, b);
	        };
	      case 4:
	        return function(a, b, c) {
	          return fn(this, a, b, c);
	        };
	      case 5:
	        return function(a, b, c, d) {
	          return fn(this, a, b, c, d);
	        };
	    }
	  }
	
	  // Method helpers
	
	  function extendNative(target, source, polyfill, override) {
	    forEachProperty(source, function(method, name) {
	      if (polyfill && !override && target[name]) {
	        // Method exists, so bail.
	        return;
	      }
	      setProperty(target, name, method);
	    });
	  }
	
	  function setMethod(sugarNamespace, methodName, method) {
	    sugarNamespace[methodName] = method;
	    if (method.instance) {
	      defineChainableMethod(sugarNamespace, methodName, method.instance, true);
	    }
	  }
	
	
	  // Chainables
	
	  function getNewChainableClass(name) {
	    var fn = function SugarChainable(obj, arg) {
	      if (!(this instanceof fn)) {
	        return new fn(obj, arg);
	      }
	      if (this.constructor !== fn) {
	        // Allow modules to define their own constructors.
	        obj = this.constructor.apply(obj, arguments);
	      }
	      this.raw = obj;
	    };
	    setProperty(fn, 'toString', function() {
	      return SUGAR_GLOBAL + name;
	    });
	    setProperty(fn.prototype, 'valueOf', function() {
	      return this.raw;
	    });
	    return fn;
	  }
	
	  function defineChainableMethod(sugarNamespace, methodName, fn) {
	    var wrapped = wrapWithChainableResult(fn), existing, collision, dcp;
	    dcp = DefaultChainable.prototype;
	    existing = dcp[methodName];
	
	    // If the method was previously defined on the default chainable, then a
	    // collision exists, so set the method to a disambiguation function that will
	    // lazily evaluate the object and find it's associated chainable. An extra
	    // check is required to avoid false positives from Object inherited methods.
	    collision = existing && existing !== Object.prototype[methodName];
	
	    // The disambiguation function is only required once.
	    if (!existing || !existing.disambiguate) {
	      dcp[methodName] = collision ? disambiguateMethod(methodName) : wrapped;
	    }
	
	    // The target chainable always receives the wrapped method. Additionally,
	    // if the target chainable is Sugar.Object, then map the wrapped method
	    // to all other namespaces as well if they do not define their own method
	    // of the same name. This way, a Sugar.Number will have methods like
	    // isEqual that can be called on any object without having to traverse up
	    // the prototype chain and perform disambiguation, which costs cycles.
	    // Note that the "if" block below actually does nothing on init as Object
	    // goes first and no other namespaces exist yet. However it needs to be
	    // here as Object instance methods defined later also need to be mapped
	    // back onto existing namespaces.
	    sugarNamespace.prototype[methodName] = wrapped;
	    if (sugarNamespace === Sugar.Object) {
	      mapObjectChainableToAllNamespaces(methodName, wrapped);
	    }
	  }
	
	  function mapObjectChainablesToNamespace(sugarNamespace) {
	    forEachProperty(Sugar.Object && Sugar.Object.prototype, function(val, methodName) {
	      if (typeof val === 'function') {
	        setObjectChainableOnNamespace(sugarNamespace, methodName, val);
	      }
	    });
	  }
	
	  function mapObjectChainableToAllNamespaces(methodName, fn) {
	    forEachProperty(namespacesByName, function(sugarNamespace) {
	      setObjectChainableOnNamespace(sugarNamespace, methodName, fn);
	    });
	  }
	
	  function setObjectChainableOnNamespace(sugarNamespace, methodName, fn) {
	    var proto = sugarNamespace.prototype;
	    if (!hasOwn(proto, methodName)) {
	      proto[methodName] = fn;
	    }
	  }
	
	  function wrapWithChainableResult(fn) {
	    return function() {
	      return new DefaultChainable(fn.apply(this.raw, arguments));
	    };
	  }
	
	  function disambiguateMethod(methodName) {
	    var fn = function() {
	      var raw = this.raw, sugarNamespace, fn;
	      if (raw != null) {
	        // Find the Sugar namespace for this unknown.
	        sugarNamespace = namespacesByClassString[classToString(raw)];
	      }
	      if (!sugarNamespace) {
	        // If no sugarNamespace can be resolved, then default
	        // back to Sugar.Object so that undefined and other
	        // non-supported types can still have basic object
	        // methods called on them, such as type checks.
	        sugarNamespace = Sugar.Object;
	      }
	
	      fn = new sugarNamespace(raw)[methodName];
	
	      if (fn.disambiguate) {
	        // If the method about to be called on this chainable is
	        // itself a disambiguation method, then throw an error to
	        // prevent infinite recursion.
	        throw new TypeError('Cannot resolve namespace for ' + raw);
	      }
	
	      return fn.apply(this, arguments);
	    };
	    fn.disambiguate = true;
	    return fn;
	  }
	
	  function mapNativeToChainable(name, methodNames) {
	    var sugarNamespace = namespacesByName[name],
	        nativeProto = globalContext[name].prototype;
	
	    if (!methodNames && ownPropertyNames) {
	      methodNames = ownPropertyNames(nativeProto);
	    }
	
	    forEachProperty(methodNames, function(methodName) {
	      if (nativeMethodProhibited(methodName)) {
	        // Sugar chainables have their own constructors as well as "valueOf"
	        // methods, so exclude them here. The __proto__ argument should be trapped
	        // by the function check below, however simply accessing this property on
	        // Object.prototype causes QML to segfault, so pre-emptively excluding it.
	        return;
	      }
	      try {
	        var fn = nativeProto[methodName];
	        if (typeof fn !== 'function') {
	          // Bail on anything not a function.
	          return;
	        }
	      } catch (e) {
	        // Function.prototype has properties that
	        // will throw errors when accessed.
	        return;
	      }
	      defineChainableMethod(sugarNamespace, methodName, fn);
	    });
	  }
	
	  function nativeMethodProhibited(methodName) {
	    return methodName === 'constructor' ||
	           methodName === 'valueOf' ||
	           methodName === '__proto__';
	  }
	
	
	  // Util
	
	  // Internal references
	  var ownPropertyNames = Object.getOwnPropertyNames,
	      internalToString = Object.prototype.toString,
	      internalHasOwnProperty = Object.prototype.hasOwnProperty;
	
	  // Defining this as a variable here as the ES5 module
	  // overwrites it to patch DONTENUM.
	  var forEachProperty = function (obj, fn) {
	    for(var key in obj) {
	      if (!hasOwn(obj, key)) continue;
	      if (fn.call(obj, obj[key], key, obj) === false) break;
	    }
	  };
	
	  function definePropertyShim(obj, prop, descriptor) {
	    obj[prop] = descriptor.value;
	  }
	
	  function setProperty(target, name, value, enumerable) {
	    defineProperty(target, name, {
	      value: value,
	      enumerable: !!enumerable,
	      configurable: true,
	      writable: true
	    });
	  }
	
	  // PERF: Attempts to speed this method up get very Heisenbergy. Quickly
	  // returning based on typeof works for primitives, but slows down object
	  // types. Even === checks on null and undefined (no typeof) will end up
	  // basically breaking even. This seems to be as fast as it can go.
	  function classToString(obj) {
	    return internalToString.call(obj);
	  }
	
	  function hasOwn(obj, prop) {
	    return !!obj && internalHasOwnProperty.call(obj, prop);
	  }
	
	  function getOwn(obj, prop) {
	    if (hasOwn(obj, prop)) {
	      return obj[prop];
	    }
	  }
	
	  setupGlobal();
	
	}).call(this);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LazyLoadedLocales = __webpack_require__(7),
	    AmericanEnglishDefinition = __webpack_require__(14),
	    getNewLocale = __webpack_require__(16);
	
	var English, localeManager;
	
	function buildLocales() {
	
	  function LocaleManager(loc) {
	    this.locales = {};
	    this.add(loc);
	  }
	
	  LocaleManager.prototype = {
	
	    get: function(code, fallback) {
	      var loc = this.locales[code];
	      if (!loc && LazyLoadedLocales[code]) {
	        loc = this.add(code, LazyLoadedLocales[code]);
	      } else if (!loc && code) {
	        loc = this.locales[code.slice(0, 2)];
	      }
	      return loc || fallback === false ? loc : this.current;
	    },
	
	    getAll: function() {
	      return this.locales;
	    },
	
	    set: function(code) {
	      var loc = this.get(code, false);
	      if (!loc) {
	        throw new TypeError('Invalid Locale: ' + code);
	      }
	      return this.current = loc;
	    },
	
	    add: function(code, def) {
	      if (!def) {
	        def = code;
	        code = def.code;
	      } else {
	        def.code = code;
	      }
	      var loc = def.compiledFormats ? def : getNewLocale(def);
	      this.locales[code] = loc;
	      if (!this.current) {
	        this.current = loc;
	      }
	      return loc;
	    },
	
	    remove: function(code) {
	      if (this.current.code === code) {
	        this.current = this.get('en');
	      }
	      return delete this.locales[code];
	    }
	
	  };
	
	  // Sorry about this guys...
	  English = getNewLocale(AmericanEnglishDefinition);
	  localeManager = new LocaleManager(English);
	}
	
	buildLocales();
	
	module.exports = {
	  English: English,
	  localeManager: localeManager
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var BritishEnglishDefinition = __webpack_require__(8),
	    AmericanEnglishDefinition = __webpack_require__(14),
	    CanadianEnglishDefinition = __webpack_require__(15);
	
	var LazyLoadedLocales = {
	  'en-US': AmericanEnglishDefinition,
	  'en-GB': BritishEnglishDefinition,
	  'en-AU': BritishEnglishDefinition,
	  'en-CA': CanadianEnglishDefinition
	};
	
	module.exports = LazyLoadedLocales;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getEnglishVariant = __webpack_require__(9);
	
	var BritishEnglishDefinition = getEnglishVariant({
	  'short':  '{dd}/{MM}/{yyyy}',
	  'medium': '{d} {Month} {yyyy}',
	  'long':   '{d} {Month} {yyyy} {H}:{mm}',
	  'full':   '{Weekday}, {d} {Month}, {yyyy} {time}',
	  'stamp':  '{Dow} {d} {Mon} {yyyy} {time}'
	});
	
	module.exports = BritishEnglishDefinition;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var EnglishLocaleBaseDefinition = __webpack_require__(10),
	    simpleMerge = __webpack_require__(11),
	    simpleClone = __webpack_require__(13);
	
	function getEnglishVariant(v) {
	  return simpleMerge(simpleClone(EnglishLocaleBaseDefinition), v);
	}
	
	module.exports = getEnglishVariant;

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	var EnglishLocaleBaseDefinition = {
	  'code': 'en',
	  'plural': true,
	  'timeMarkers': 'at',
	  'ampm': 'AM|A.M.|a,PM|P.M.|p',
	  'units': 'millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s',
	  'months': 'Jan:uary|,Feb:ruary|,Mar:ch|,Apr:il|,May,Jun:e|,Jul:y|,Aug:ust|,Sep:tember|t|,Oct:ober|,Nov:ember|,Dec:ember|',
	  'weekdays': 'Sun:day|,Mon:day|,Tue:sday|,Wed:nesday|,Thu:rsday|,Fri:day|,Sat:urday|+weekend',
	  'numerals': 'zero,one|first,two|second,three|third,four:|th,five|fifth,six:|th,seven:|th,eight:|h,nin:e|th,ten:|th',
	  'articles': 'a,an,the',
	  'tokens': 'the,st|nd|rd|th,of|in,a|an,on',
	  'time': '{H}:{mm}',
	  'past': '{num} {unit} {sign}',
	  'future': '{num} {unit} {sign}',
	  'duration': '{num} {unit}',
	  'modifiers': [
	    { 'name': 'half',   'src': 'half', 'value': .5 },
	    { 'name': 'midday', 'src': 'noon', 'value': 12 },
	    { 'name': 'midday', 'src': 'midnight', 'value': 24 },
	    { 'name': 'day',    'src': 'yesterday', 'value': -1 },
	    { 'name': 'day',    'src': 'today|tonight', 'value': 0 },
	    { 'name': 'day',    'src': 'tomorrow', 'value': 1 },
	    { 'name': 'sign',   'src': 'ago|before', 'value': -1 },
	    { 'name': 'sign',   'src': 'from now|after|from|in|later', 'value': 1 },
	    { 'name': 'edge',   'src': 'first day|first|beginning', 'value': -2 },
	    { 'name': 'edge',   'src': 'last day', 'value': 1 },
	    { 'name': 'edge',   'src': 'end|last', 'value': 2 },
	    { 'name': 'shift',  'src': 'last', 'value': -1 },
	    { 'name': 'shift',  'src': 'the|this', 'value': 0 },
	    { 'name': 'shift',  'src': 'next', 'value': 1 }
	  ],
	  'parse': [
	    '(?:just)? now',
	    '{shift} {unit:5-7}',
	    "{months?} (?:{year}|'{yy})",
	    '{midday} {4?} {day|weekday}',
	    '{months},?(?:[-.\\/\\s]{year})?',
	    '{edge} of (?:day)? {day|weekday}',
	    '{0} {num}{1?} {weekday} {2} {months},? {year?}',
	    '{shift?} {day?} {weekday?} {timeMarker?} {midday}',
	    '{sign?} {3?} {half} {3?} {unit:3-4|unit:7} {sign?}',
	    '{0?} {edge} {weekday?} {2} {shift?} {unit:4-7?} {months?},? {year?}'
	  ],
	  'timeParse': [
	    '{day|weekday}',
	    '{shift} {unit:5?} {weekday}',
	    '{0?} {date}{1?} {2?} {months?}',
	    '{weekday} {2?} {shift} {unit:5}',
	    '{0?} {num} {2?} {months}\\.?,? {year?}',
	    '{num?} {unit:4-5} {sign} {day|weekday}',
	    '{year}[-.\\/\\s]{months}[-.\\/\\s]{date}',
	    '{0|months} {date?}{1?} of {shift} {unit:6-7}',
	    '{0?} {num}{1?} {weekday} of {shift} {unit:6}',
	    "{date}[-.\\/\\s]{months}[-.\\/\\s](?:{year}|'?{yy})",
	    "{weekday?}\\.?,? {months}\\.?,? {date}{1?},? (?:{year}|'{yy})?"
	  ],
	  'timeFrontParse': [
	    '{sign} {num} {unit}',
	    '{num} {unit} {sign}',
	    '{4?} {day|weekday}'
	  ]
	};
	
	module.exports = EnglishLocaleBaseDefinition;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var coreUtilityAliases = __webpack_require__(12);
	
	var forEachProperty = coreUtilityAliases.forEachProperty;
	
	function simpleMerge(target, source) {
	  forEachProperty(source, function(val, key) {
	    target[key] = val;
	  });
	  return target;
	}
	
	module.exports = simpleMerge;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	module.exports = {
	  hasOwn: Sugar.util.hasOwn,
	  getOwn: Sugar.util.getOwn,
	  setProperty: Sugar.util.setProperty,
	  classToString: Sugar.util.classToString,
	  defineProperty: Sugar.util.defineProperty,
	  forEachProperty: Sugar.util.forEachProperty,
	  mapNativeToChainable: Sugar.util.mapNativeToChainable
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var simpleMerge = __webpack_require__(11);
	
	function simpleClone(obj) {
	  return simpleMerge({}, obj);
	}
	
	module.exports = simpleClone;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getEnglishVariant = __webpack_require__(9);
	
	var AmericanEnglishDefinition = getEnglishVariant({
	  'mdy': true,
	  'firstDayOfWeek': 0,
	  'firstDayOfWeekYear': 1,
	  'short':  '{MM}/{dd}/{yyyy}',
	  'medium': '{Month} {d}, {yyyy}',
	  'long':   '{Month} {d}, {yyyy} {time}',
	  'full':   '{Weekday}, {Month} {d}, {yyyy} {time}',
	  'stamp':  '{Dow} {Mon} {d} {yyyy} {time}',
	  'time':   '{h}:{mm} {TT}'
	});
	
	module.exports = AmericanEnglishDefinition;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getEnglishVariant = __webpack_require__(9);
	
	var CanadianEnglishDefinition = getEnglishVariant({
	  'short':  '{yyyy}-{MM}-{dd}',
	  'medium': '{d} {Month}, {yyyy}',
	  'long':   '{d} {Month}, {yyyy} {H}:{mm}',
	  'full':   '{Weekday}, {d} {Month}, {yyyy} {time}',
	  'stamp':  '{Dow} {d} {Mon} {yyyy} {time}'
	});
	
	module.exports = CanadianEnglishDefinition;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LOCALE_ARRAY_FIELDS = __webpack_require__(17),
	    ISODefaults = __webpack_require__(18),
	    ParsingTokens = __webpack_require__(19),
	    CoreParsingFormats = __webpack_require__(20),
	    LocalizedParsingTokens = __webpack_require__(21),
	    map = __webpack_require__(22),
	    filter = __webpack_require__(23),
	    forEach = __webpack_require__(24),
	    isDefined = __webpack_require__(28),
	    commaSplit = __webpack_require__(29),
	    classChecks = __webpack_require__(31),
	    isUndefined = __webpack_require__(39),
	    mathAliases = __webpack_require__(40),
	    simpleMerge = __webpack_require__(11),
	    getOrdinalSuffix = __webpack_require__(41),
	    getRegNonCapturing = __webpack_require__(42),
	    coreUtilityAliases = __webpack_require__(12),
	    getArrayWithOffset = __webpack_require__(43),
	    iterateOverDateUnits = __webpack_require__(44),
	    arrayToRegAlternates = __webpack_require__(54),
	    fullwidthNumberHelpers = __webpack_require__(56),
	    getAdjustedUnitForNumber = __webpack_require__(59),
	    getParsingTokenWithSuffix = __webpack_require__(63);
	
	var getOwn = coreUtilityAliases.getOwn,
	    forEachProperty = coreUtilityAliases.forEachProperty,
	    fullWidthNumberMap = fullwidthNumberHelpers.fullWidthNumberMap,
	    fullWidthNumbers = fullwidthNumberHelpers.fullWidthNumbers,
	    pow = mathAliases.pow,
	    max = mathAliases.max,
	    ISO_FIRST_DAY_OF_WEEK = ISODefaults.ISO_FIRST_DAY_OF_WEEK,
	    ISO_FIRST_DAY_OF_WEEK_YEAR = ISODefaults.ISO_FIRST_DAY_OF_WEEK_YEAR,
	    isString = classChecks.isString,
	    isFunction = classChecks.isFunction;
	
	function getNewLocale(def) {
	
	  function Locale(def) {
	    this.init(def);
	  }
	
	  Locale.prototype = {
	
	    getMonthName: function(n, alternate) {
	      if (this.monthSuffix) {
	        return (n + 1) + this.monthSuffix;
	      }
	      return getArrayWithOffset(this.months, n, alternate, 12);
	    },
	
	    getWeekdayName: function(n, alternate) {
	      return getArrayWithOffset(this.weekdays, n, alternate, 7);
	    },
	
	    getTokenValue: function(field, str) {
	      var map = this[field + 'Map'], val;
	      if (map) {
	        val = map[str];
	      }
	      if (isUndefined(val)) {
	        val = this.getNumber(str);
	        if (field === 'month') {
	          // Months are the only numeric date field
	          // whose value is not the same as its number.
	          val -= 1;
	        }
	      }
	      return val;
	    },
	
	    getNumber: function(str) {
	      var num = this.numeralMap[str];
	      if (isDefined(num)) {
	        return num;
	      }
	      // The unary plus operator here show better performance and handles
	      // every format that parseFloat does with the exception of trailing
	      // characters, which are guaranteed not to be in our string at this point.
	      num = +str.replace(/,/, '.');
	      if (!isNaN(num)) {
	        return num;
	      }
	      num = this.getNumeralValue(str);
	      if (!isNaN(num)) {
	        this.numeralMap[str] = num;
	        return num;
	      }
	      return num;
	    },
	
	    getNumeralValue: function(str) {
	      var place = 1, num = 0, lastWasPlace, isPlace, numeral, digit, arr;
	      // Note that "numerals" that need to be converted through this method are
	      // all considered to be single characters in order to handle CJK. This
	      // method is by no means unique to CJK, but the complexity of handling
	      // inflections in non-CJK languages adds too much overhead for not enough
	      // value, so avoiding for now.
	      arr = str.split('');
	      for (var i = arr.length - 1; numeral = arr[i]; i--) {
	        digit = getOwn(this.numeralMap, numeral);
	        if (isUndefined(digit)) {
	          digit = getOwn(fullWidthNumberMap, numeral) || 0;
	        }
	        isPlace = digit > 0 && digit % 10 === 0;
	        if (isPlace) {
	          if (lastWasPlace) {
	            num += place;
	          }
	          if (i) {
	            place = digit;
	          } else {
	            num += digit;
	          }
	        } else {
	          num += digit * place;
	          place *= 10;
	        }
	        lastWasPlace = isPlace;
	      }
	      return num;
	    },
	
	    getOrdinal: function(n) {
	      var suffix = this.ordinalSuffix;
	      return suffix || getOrdinalSuffix(n);
	    },
	
	    getRelativeFormat: function(adu, type) {
	      return this.convertAdjustedToFormat(adu, type);
	    },
	
	    getDuration: function(ms) {
	      return this.convertAdjustedToFormat(getAdjustedUnitForNumber(max(0, ms)), 'duration');
	    },
	
	    getFirstDayOfWeek: function() {
	      var val = this.firstDayOfWeek;
	      return isDefined(val) ? val : ISO_FIRST_DAY_OF_WEEK;
	    },
	
	    getFirstDayOfWeekYear: function() {
	      return this.firstDayOfWeekYear || ISO_FIRST_DAY_OF_WEEK_YEAR;
	    },
	
	    convertAdjustedToFormat: function(adu, type) {
	      var sign, unit, mult,
	          num    = adu[0],
	          u      = adu[1],
	          ms     = adu[2],
	          format = this[type] || this.relative;
	      if (isFunction(format)) {
	        return format.call(this, num, u, ms, type);
	      }
	      mult = !this.plural || num === 1 ? 0 : 1;
	      unit = this.units[mult * 8 + u] || this.units[u];
	      sign = this[ms > 0 ? 'fromNow' : 'ago'];
	      return format.replace(/\{(.*?)\}/g, function(full, match) {
	        switch(match) {
	          case 'num': return num;
	          case 'unit': return unit;
	          case 'sign': return sign;
	        }
	      });
	    },
	
	    cacheFormat: function(dif, i) {
	      this.compiledFormats.splice(i, 1);
	      this.compiledFormats.unshift(dif);
	    },
	
	    addFormat: function(src, to) {
	      var loc = this;
	
	      function getTokenSrc(str) {
	        var suffix, src, val,
	            opt   = str.match(/\?$/),
	            nc    = str.match(/^(\d+)\??$/),
	            slice = str.match(/(\d)(?:-(\d))?/),
	            key   = str.replace(/[^a-z]+$/i, '');
	
	        // Allowing alias tokens such as {time}
	        if (val = getOwn(loc.parsingAliases, key)) {
	          src = replaceParsingTokens(val);
	          if (opt) {
	            src = getRegNonCapturing(src, true);
	          }
	          return src;
	        }
	
	        if (nc) {
	          src = loc.tokens[nc[1]];
	        } else if (val = getOwn(ParsingTokens, key)) {
	          src = val.src;
	        } else {
	          val = getOwn(loc.parsingTokens, key) || getOwn(loc, key);
	
	          // Both the "months" array and the "month" parsing token can be accessed
	          // by either {month} or {months}, falling back as necessary, however
	          // regardless of whether or not a fallback occurs, the final field to
	          // be passed to addRawFormat must be normalized as singular.
	          key = key.replace(/s$/, '');
	
	          if (!val) {
	            val = getOwn(loc.parsingTokens, key) || getOwn(loc, key + 's');
	          }
	
	          if (isString(val)) {
	            src = val;
	            suffix = loc[key + 'Suffix'];
	          } else {
	            if (slice) {
	              val = filter(val, function(m, i) {
	                var mod = i % (loc.units ? 8 : val.length);
	                return mod >= slice[1] && mod <= (slice[2] || slice[1]);
	              });
	            }
	            src = arrayToRegAlternates(val);
	          }
	        }
	        if (!src) {
	          return '';
	        }
	        if (nc) {
	          // Non-capturing tokens like {0}
	          src = getRegNonCapturing(src);
	        } else {
	          // Capturing group and add to parsed tokens
	          to.push(key);
	          src = '(' + src + ')';
	        }
	        if (suffix) {
	          // Date/time suffixes such as those in CJK
	          src = getParsingTokenWithSuffix(key, src, suffix);
	        }
	        if (opt) {
	          src += '?';
	        }
	        return src;
	      }
	
	      function replaceParsingTokens(str) {
	
	        // Make spaces optional
	        str = str.replace(/ /g, ' ?');
	
	        return str.replace(/\{([^,]+?)\}/g, function(match, token) {
	          var tokens = token.split('|'), src;
	          if (tokens.length > 1) {
	            src = getRegNonCapturing(map(tokens, getTokenSrc).join('|'));
	          } else {
	            src = getTokenSrc(token);
	          }
	          return src;
	        });
	      }
	
	      if (!to) {
	        to = [];
	        src = replaceParsingTokens(src);
	      }
	
	      loc.addRawFormat(src, to);
	    },
	
	    addRawFormat: function(format, to) {
	      this.compiledFormats.unshift({
	        reg: RegExp('^ *' + format + ' *$', 'i'),
	        to: to
	      });
	    },
	
	    init: function(def) {
	      var loc = this;
	
	      // -- Initialization helpers
	
	      function initFormats() {
	        loc.compiledFormats = [];
	        loc.parsingAliases = {};
	        loc.parsingTokens = {};
	      }
	
	      function initDefinition() {
	        simpleMerge(loc, def);
	      }
	
	      function initArrayFields() {
	        forEach(LOCALE_ARRAY_FIELDS, function(name) {
	          var val = loc[name];
	          if (isString(val)) {
	            loc[name] = commaSplit(val);
	          } else if (!val) {
	            loc[name] = [];
	          }
	        });
	      }
	
	      // -- Value array build helpers
	
	      function buildValueArray(name, mod, map, fn) {
	        var field = name, all = [], setMap;
	        if (!loc[field]) {
	          field += 's';
	        }
	        if (!map) {
	          map = {};
	          setMap = true;
	        }
	        forAllAlternates(field, function(alt, j, i) {
	          var idx = j * mod + i, val;
	          val = fn ? fn(i) : i;
	          map[alt] = val;
	          map[alt.toLowerCase()] = val;
	          all[idx] = alt;
	        });
	        loc[field] = all;
	        if (setMap) {
	          loc[name + 'Map'] = map;
	        }
	      }
	
	      function forAllAlternates(field, fn) {
	        forEach(loc[field], function(str, i) {
	          forEachAlternate(str, function(alt, j) {
	            fn(alt, j, i);
	          });
	        });
	      }
	
	      function forEachAlternate(str, fn) {
	        var arr = map(str.split('+'), function(split) {
	          return split.replace(/(.+):(.+)$/, function(full, base, suffixes) {
	            return map(suffixes.split('|'), function(suffix) {
	              return base + suffix;
	            }).join('|');
	          });
	        }).join('|');
	        forEach(arr.split('|'), fn);
	      }
	
	      function buildNumerals() {
	        var map = {};
	        buildValueArray('numeral', 10, map);
	        buildValueArray('article', 1, map, function() {
	          return 1;
	        });
	        buildValueArray('placeholder', 4, map, function(n) {
	          return pow(10, n + 1);
	        });
	        loc.numeralMap = map;
	      }
	
	      function buildTimeFormats() {
	        loc.parsingAliases['time'] = getTimeFormat();
	        loc.parsingAliases['tzOffset'] = getTZOffsetFormat();
	      }
	
	      function getTimeFormat() {
	        var src;
	        if (loc.ampmFront) {
	          // "ampmFront" exists mostly for CJK locales, which also presume that
	          // time suffixes exist, allowing this to be a simpler regex.
	          src = '{ampm?} {hour} (?:{minute} (?::?{second})?)?';
	        } else if(loc.ampm.length) {
	          src = '{hour}(?:[.:]{minute}(?:[.:]{second})? {ampm?}| {ampm})';
	        } else {
	          src = '{hour}(?:[.:]{minute}(?:[.:]{second})?)';
	        }
	        return src;
	      }
	
	      function getTZOffsetFormat() {
	        return '(?:{Z}|{GMT?}(?:{tzSign}{tzHour}(?::?{tzMinute}(?: \\([\\w\\s]+\\))?)?)?)?';
	      }
	
	      function buildParsingTokens() {
	        forEachProperty(LocalizedParsingTokens, function(token, name) {
	          var src, arr;
	          src = token.base ? ParsingTokens[token.base].src : token.src;
	          if (token.requiresNumerals || loc.numeralUnits) {
	            src += getNumeralSrc();
	          }
	          arr = loc[name + 's'];
	          if (arr && arr.length) {
	            src += '|' + arrayToRegAlternates(arr);
	          }
	          loc.parsingTokens[name] = src;
	        });
	      }
	
	      function getNumeralSrc() {
	        var all, src = '';
	        all = loc.numerals.concat(loc.placeholders).concat(loc.articles);
	        if (loc.allowsFullWidth) {
	          all = all.concat(fullWidthNumbers.split(''));
	        }
	        if (all.length) {
	          src = '|(?:' + arrayToRegAlternates(all) + ')+';
	        }
	        return src;
	      }
	
	      function buildTimeSuffixes() {
	        iterateOverDateUnits(function(unit, i) {
	          var token = loc.timeSuffixes[i];
	          if (token) {
	            loc[(unit.alias || unit.name) + 'Suffix'] = token;
	          }
	        });
	      }
	
	      function buildModifiers() {
	        forEach(loc.modifiers, function(modifier) {
	          var name = modifier.name, mapKey = name + 'Map', map;
	          map = loc[mapKey] || {};
	          forEachAlternate(modifier.src, function(alt, j) {
	            var token = getOwn(loc.parsingTokens, name), val = modifier.value;
	            map[alt] = val;
	            loc.parsingTokens[name] = token ? token + '|' + alt : alt;
	            if (modifier.name === 'sign' && j === 0) {
	              // Hooking in here to set the first "fromNow" or "ago" modifier
	              // directly on the locale, so that it can be reused in the
	              // relative format.
	              loc[val === 1 ? 'fromNow' : 'ago'] = alt;
	            }
	          });
	          loc[mapKey] = map;
	        });
	      }
	
	      // -- Format adding helpers
	
	      function addCoreFormats() {
	        forEach(CoreParsingFormats, function(df) {
	          var src = df.src;
	          if (df.mdy && loc.mdy) {
	            // Use the mm/dd/yyyy variant if it
	            // exists and the locale requires it
	            src = df.mdy;
	          }
	          if (df.time) {
	            // Core formats that allow time require the time
	            // reg on both sides, so add both versions here.
	            loc.addFormat(getFormatWithTime(src, true));
	            loc.addFormat(getFormatWithTime(src));
	          } else {
	            loc.addFormat(src);
	          }
	        });
	        loc.addFormat('{time}');
	      }
	
	      function addLocaleFormats() {
	        addFormatSet('parse');
	        addFormatSet('timeParse', true);
	        addFormatSet('timeFrontParse', true, true);
	      }
	
	      function addFormatSet(field, allowTime, timeFront) {
	        forEach(loc[field], function(format) {
	          if (allowTime) {
	            format = getFormatWithTime(format, timeFront);
	          }
	          loc.addFormat(format);
	        });
	      }
	
	      function getFormatWithTime(baseFormat, timeBefore) {
	        if (timeBefore) {
	          return getTimeBefore() + baseFormat;
	        }
	        return baseFormat + getTimeAfter();
	      }
	
	      function getTimeBefore() {
	        return getRegNonCapturing('{time}[,\\s\\u3000]', true);
	      }
	
	      function getTimeAfter() {
	        var markers = ',?[\\s\\u3000]', localized;
	        localized = arrayToRegAlternates(loc.timeMarkers);
	        if (localized) {
	          markers += '| (?:' + localized + ') ';
	        }
	        markers = getRegNonCapturing(markers, loc.timeMarkerOptional);
	        return getRegNonCapturing(markers + '{time}', true);
	      }
	
	      initFormats();
	      initDefinition();
	      initArrayFields();
	
	      buildValueArray('month', 12);
	      buildValueArray('weekday', 7);
	      buildValueArray('unit', 8);
	      buildValueArray('ampm', 2);
	
	      buildNumerals();
	      buildTimeFormats();
	      buildParsingTokens();
	      buildTimeSuffixes();
	      buildModifiers();
	
	      // The order of these formats is important. Order is reversed so formats
	      // that are initialized later will take precedence. Generally, this means
	      // that more specific formats should come later.
	      addCoreFormats();
	      addLocaleFormats();
	
	    }
	
	  };
	
	  return new Locale(def);
	}
	
	module.exports = getNewLocale;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';
	
	var LOCALE_ARRAY_FIELDS = [
	  'months', 'weekdays', 'units', 'numerals', 'placeholders',
	  'articles', 'tokens', 'timeMarkers', 'ampm', 'timeSuffixes',
	  'parse', 'timeParse', 'timeFrontParse', 'modifiers'
	];
	
	module.exports = LOCALE_ARRAY_FIELDS;

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  ISO_FIRST_DAY_OF_WEEK: 1,
	  ISO_FIRST_DAY_OF_WEEK_YEAR: 4
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	var ParsingTokens = {
	  'yyyy': {
	    param: 'year',
	    src: '\\d{4}'
	  },
	  'MM': {
	    param: 'month',
	    src: '[01]?\\d'
	  },
	  'dd': {
	    param: 'date',
	    src: '[0123]?\\d'
	  },
	  'hh': {
	    param: 'hour',
	    src: '[0-2]?\\d'
	  },
	  'mm': {
	    param: 'minute',
	    src: '[0-5]\\d'
	  },
	  'ss': {
	    param: 'second',
	    src: '[0-5]\\d(?:[,.]\\d+)?'
	  },
	  'yy': {
	    param: 'year',
	    src: '\\d{2}'
	  },
	  'y': {
	    param: 'year',
	    src: '\\d'
	  },
	  'yearSign': {
	    src: '[+-]',
	    sign: true
	  },
	  'tzHour': {
	    src: '[0-1]\\d'
	  },
	  'tzMinute': {
	    src: '[0-5]\\d'
	  },
	  'tzSign': {
	    src: '[+−-]',
	    sign: true
	  },
	  'ihh': {
	    param: 'hour',
	    src: '[0-2]?\\d(?:[,.]\\d+)?'
	  },
	  'imm': {
	    param: 'minute',
	    src: '[0-5]\\d(?:[,.]\\d+)?'
	  },
	  'GMT': {
	    param: 'utc',
	    src: 'GMT',
	    val: 1
	  },
	  'Z': {
	    param: 'utc',
	    src: 'Z',
	    val: 1
	  },
	  'timestamp': {
	    src: '\\d+'
	  }
	};
	
	module.exports = ParsingTokens;

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';
	
	var CoreParsingFormats = [
	  {
	    // 12-1978
	    // 08-1978 (MDY)
	    src: '{MM}[-.\\/]{yyyy}'
	  },
	  {
	    // 12/08/1978
	    // 08/12/1978 (MDY)
	    time: true,
	    src: '{dd}[-.\\/]{MM}(?:[-.\\/]{yyyy|yy|y})?',
	    mdy: '{MM}[-.\\/]{dd}(?:[-.\\/]{yyyy|yy|y})?'
	  },
	  {
	    // 1975-08-25
	    time: true,
	    src: '{yyyy}[-.\\/]{MM}(?:[-.\\/]{dd})?'
	  },
	  {
	    // .NET JSON
	    src: '\\\\/Date\\({timestamp}(?:[+-]\\d{4,4})?\\)\\\\/'
	  },
	  {
	    // ISO-8601
	    src: '{yearSign?}{yyyy}(?:-?{MM}(?:-?{dd}(?:T{ihh}(?::?{imm}(?::?{ss})?)?)?)?)?{tzOffset?}'
	  }
	];
	
	module.exports = CoreParsingFormats;

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';
	
	var LocalizedParsingTokens = {
	  'year': {
	    base: 'yyyy',
	    requiresSuffix: true
	  },
	  'month': {
	    base: 'MM',
	    requiresSuffix: true
	  },
	  'date': {
	    base: 'dd',
	    requiresSuffix: true
	  },
	  'hour': {
	    base: 'hh',
	    requiresSuffixOr: ':'
	  },
	  'minute': {
	    base: 'mm'
	  },
	  'second': {
	    base: 'ss'
	  },
	  'num': {
	    src: '\\d+',
	    requiresNumerals: true
	  }
	};
	
	module.exports = LocalizedParsingTokens;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';
	
	function map(arr, fn) {
	  // perf: Not using fixed array len here as it may be sparse.
	  var result = [];
	  for (var i = 0, len = arr.length; i < len; i++) {
	    if (i in arr) {
	      result.push(fn(arr[i], i));
	    }
	  }
	  return result;
	}
	
	module.exports = map;

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';
	
	function filter(arr, fn) {
	  var result = [];
	  for (var i = 0, len = arr.length; i < len; i++) {
	    var el = arr[i];
	    if (i in arr && fn(el, i)) {
	      result.push(el);
	    }
	  }
	  return result;
	}
	
	module.exports = filter;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var iterateOverSparseArray = __webpack_require__(25);
	
	function forEach(arr, fn) {
	  for (var i = 0, len = arr.length; i < len; i++) {
	    if (!(i in arr)) {
	      return iterateOverSparseArray(arr, fn, i);
	    }
	    fn(arr[i], i);
	  }
	}
	
	module.exports = forEach;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getSparseArrayIndexes = __webpack_require__(26);
	
	function iterateOverSparseArray(arr, fn, fromIndex, loop) {
	  var indexes = getSparseArrayIndexes(arr, fromIndex, loop), index;
	  for (var i = 0, len = indexes.length; i < len; i++) {
	    index = indexes[i];
	    fn.call(arr, arr[index], index, arr);
	  }
	  return arr;
	}
	
	module.exports = iterateOverSparseArray;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isArrayIndex = __webpack_require__(27);
	
	function getSparseArrayIndexes(arr, fromIndex, loop, fromRight) {
	  var indexes = [], i;
	  for (i in arr) {
	    if (isArrayIndex(i) && (loop || (fromRight ? i <= fromIndex : i >= fromIndex))) {
	      indexes.push(+i);
	    }
	  }
	  indexes.sort(function(a, b) {
	    var aLoop = a > fromIndex;
	    var bLoop = b > fromIndex;
	    if (aLoop !== bLoop) {
	      return aLoop ? -1 : 1;
	    }
	    return a - b;
	  });
	  return indexes;
	}
	
	module.exports = getSparseArrayIndexes;

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	function isArrayIndex(n) {
	  return n >>> 0 == n && n != 0xFFFFFFFF;
	}
	
	module.exports = isArrayIndex;

/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	function isDefined(o) {
	  return o !== undefined;
	}
	
	module.exports = isDefined;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var CommonChars = __webpack_require__(30);
	
	var HALF_WIDTH_COMMA = CommonChars.HALF_WIDTH_COMMA;
	
	function commaSplit(str) {
	  return str.split(HALF_WIDTH_COMMA);
	}
	
	module.exports = commaSplit;

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  HALF_WIDTH_ZERO: 0x30,
	  FULL_WIDTH_ZERO: 0xff10,
	  HALF_WIDTH_PERIOD: '.',
	  FULL_WIDTH_PERIOD: '．',
	  HALF_WIDTH_COMMA: ',',
	  OPEN_BRACE: '{',
	  CLOSE_BRACE: '}'
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var NATIVE_TYPES = __webpack_require__(32),
	    forEach = __webpack_require__(24),
	    isClass = __webpack_require__(33),
	    spaceSplit = __webpack_require__(34),
	    isPlainObject = __webpack_require__(35),
	    coreUtilityAliases = __webpack_require__(12);
	
	var classToString = coreUtilityAliases.classToString;
	
	var isSerializable,
	    isBoolean, isNumber, isString,
	    isDate, isRegExp, isFunction,
	    isArray, isSet, isMap, isError;
	
	function buildClassChecks() {
	
	  var knownTypes = {};
	
	  function addCoreTypes() {
	
	    var names = spaceSplit(NATIVE_TYPES);
	
	    isBoolean = buildPrimitiveClassCheck(names[0]);
	    isNumber  = buildPrimitiveClassCheck(names[1]);
	    isString  = buildPrimitiveClassCheck(names[2]);
	
	    isDate   = buildClassCheck(names[3]);
	    isRegExp = buildClassCheck(names[4]);
	
	    // Wanted to enhance performance here by using simply "typeof"
	    // but Firefox has two major issues that make this impossible,
	    // one fixed, the other not, so perform a full class check here.
	    //
	    // 1. Regexes can be typeof "function" in FF < 3
	    //    https://bugzilla.mozilla.org/show_bug.cgi?id=61911 (fixed)
	    //
	    // 2. HTMLEmbedElement and HTMLObjectElement are be typeof "function"
	    //    https://bugzilla.mozilla.org/show_bug.cgi?id=268945 (won't fix)
	    isFunction = buildClassCheck(names[5]);
	
	
	    isArray = Array.isArray || buildClassCheck(names[6]);
	    isError = buildClassCheck(names[7]);
	
	    isSet = buildClassCheck(names[8], typeof Set !== 'undefined' && Set);
	    isMap = buildClassCheck(names[9], typeof Map !== 'undefined' && Map);
	
	    // Add core types as known so that they can be checked by value below,
	    // notably excluding Functions and adding Arguments and Error.
	    addKnownType('Arguments');
	    addKnownType(names[0]);
	    addKnownType(names[1]);
	    addKnownType(names[2]);
	    addKnownType(names[3]);
	    addKnownType(names[4]);
	    addKnownType(names[6]);
	
	  }
	
	  function addArrayTypes() {
	    var types = 'Int8 Uint8 Uint8Clamped Int16 Uint16 Int32 Uint32 Float32 Float64';
	    forEach(spaceSplit(types), function(str) {
	      addKnownType(str + 'Array');
	    });
	  }
	
	  function addKnownType(className) {
	    var str = '[object '+ className +']';
	    knownTypes[str] = true;
	  }
	
	  function isKnownType(className) {
	    return knownTypes[className];
	  }
	
	  function buildClassCheck(className, globalObject) {
	    if (globalObject && isClass(new globalObject, 'Object')) {
	      return getConstructorClassCheck(globalObject);
	    } else {
	      return getToStringClassCheck(className);
	    }
	  }
	
	  function getConstructorClassCheck(obj) {
	    var ctorStr = String(obj);
	    return function(obj) {
	      return String(obj.constructor) === ctorStr;
	    };
	  }
	
	  function getToStringClassCheck(className) {
	    return function(obj, str) {
	      // perf: Returning up front on instanceof appears to be slower.
	      return isClass(obj, className, str);
	    };
	  }
	
	  function buildPrimitiveClassCheck(className) {
	    var type = className.toLowerCase();
	    return function(obj) {
	      var t = typeof obj;
	      return t === type || t === 'object' && isClass(obj, className);
	    };
	  }
	
	  addCoreTypes();
	  addArrayTypes();
	
	  isSerializable = function(obj, className) {
	    // Only known objects can be serialized. This notably excludes functions,
	    // host objects, Symbols (which are matched by reference), and instances
	    // of classes. The latter can arguably be matched by value, but
	    // distinguishing between these and host objects -- which should never be
	    // compared by value -- is very tricky so not dealing with it here.
	    className = className || classToString(obj);
	    return isKnownType(className) || isPlainObject(obj, className);
	  };
	
	}
	
	buildClassChecks();
	
	module.exports = {
	  isSerializable: isSerializable,
	  isBoolean: isBoolean,
	  isNumber: isNumber,
	  isString: isString,
	  isDate: isDate,
	  isRegExp: isRegExp,
	  isFunction: isFunction,
	  isArray: isArray,
	  isSet: isSet,
	  isMap: isMap,
	  isError: isError
	};

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = 'Boolean Number String Date RegExp Function Array Error Set Map';

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var coreUtilityAliases = __webpack_require__(12);
	
	var classToString = coreUtilityAliases.classToString;
	
	function isClass(obj, className, str) {
	  if (!str) {
	    str = classToString(obj);
	  }
	  return str === '[object '+ className +']';
	}
	
	module.exports = isClass;

/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';
	
	function spaceSplit(str) {
	  return str.split(' ');
	}
	
	module.exports = spaceSplit;

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isClass = __webpack_require__(33),
	    isObjectType = __webpack_require__(36),
	    hasOwnEnumeratedProperties = __webpack_require__(37),
	    hasValidPlainObjectPrototype = __webpack_require__(38);
	
	function isPlainObject(obj, className) {
	  return isObjectType(obj) &&
	         isClass(obj, 'Object', className) &&
	         hasValidPlainObjectPrototype(obj) &&
	         hasOwnEnumeratedProperties(obj);
	}
	
	module.exports = isPlainObject;

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';
	
	function isObjectType(obj, type) {
	  return !!obj && (type || typeof obj) === 'object';
	}
	
	module.exports = isObjectType;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var coreUtilityAliases = __webpack_require__(12);
	
	var hasOwn = coreUtilityAliases.hasOwn;
	
	function hasOwnEnumeratedProperties(obj) {
	  // Plain objects are generally defined as having enumerated properties
	  // all their own, however in early IE environments without defineProperty,
	  // there may also be enumerated methods in the prototype chain, so check
	  // for both of these cases.
	  var objectProto = Object.prototype;
	  for (var key in obj) {
	    var val = obj[key];
	    if (!hasOwn(obj, key) && val !== objectProto[key]) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = hasOwnEnumeratedProperties;

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var coreUtilityAliases = __webpack_require__(12);
	
	var hasOwn = coreUtilityAliases.hasOwn;
	
	function hasValidPlainObjectPrototype(obj) {
	  var hasToString = 'toString' in obj;
	  var hasConstructor = 'constructor' in obj;
	  // An object created with Object.create(null) has no methods in the
	  // prototype chain, so check if any are missing. The additional hasToString
	  // check is for false positives on some host objects in old IE which have
	  // toString but no constructor. If the object has an inherited constructor,
	  // then check if it is Object (the "isPrototypeOf" tapdance here is a more
	  // robust way of ensuring this if the global has been hijacked). Note that
	  // accessing the constructor directly (without "in" or "hasOwnProperty")
	  // will throw a permissions error in IE8 on cross-domain windows.
	  return (!hasConstructor && !hasToString) ||
	          (hasConstructor && !hasOwn(obj, 'constructor') &&
	           hasOwn(obj.constructor.prototype, 'isPrototypeOf'));
	}
	
	module.exports = hasValidPlainObjectPrototype;

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';
	
	function isUndefined(o) {
	  return o === undefined;
	}
	
	module.exports = isUndefined;

/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  abs: Math.abs,
	  pow: Math.pow,
	  min: Math.min,
	  max: Math.max,
	  ceil: Math.ceil,
	  floor: Math.floor,
	  round: Math.round
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	'use strict';
	
	function getOrdinalSuffix(num) {
	  if (num >= 11 && num <= 13) {
	    return 'th';
	  } else {
	    switch(num % 10) {
	      case 1:  return 'st';
	      case 2:  return 'nd';
	      case 3:  return 'rd';
	      default: return 'th';
	    }
	  }
	}
	
	module.exports = getOrdinalSuffix;

/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';
	
	function getRegNonCapturing(src, opt) {
	  if (src.length > 1) {
	    src = '(?:' + src + ')';
	  }
	  if (opt) {
	    src += '?';
	  }
	  return src;
	}
	
	module.exports = getRegNonCapturing;

/***/ },
/* 43 */
/***/ function(module, exports) {

	'use strict';
	
	function getArrayWithOffset(arr, n, alternate, offset) {
	  var val;
	  if (alternate > 1) {
	    val = arr[n + (alternate - 1) * offset];
	  }
	  return val || arr[n];
	}
	
	module.exports = getArrayWithOffset;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnits = __webpack_require__(45),
	    DateUnitIndexes = __webpack_require__(53),
	    isUndefined = __webpack_require__(39);
	
	var YEAR_INDEX = DateUnitIndexes.YEAR_INDEX;
	
	function iterateOverDateUnits(fn, startIndex, endIndex) {
	  endIndex = endIndex || 0;
	  if (isUndefined(startIndex)) {
	    startIndex = YEAR_INDEX;
	  }
	  for (var index = startIndex; index >= endIndex; index--) {
	    if (fn(DateUnits[index], index) === false) {
	      break;
	    }
	  }
	}
	
	module.exports = iterateOverDateUnits;

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getDaysInMonth = __webpack_require__(46);
	
	var DateUnits = [
	  {
	    name: 'millisecond',
	    method: 'Milliseconds',
	    multiplier: 1,
	    start: 0,
	    end: 999
	  },
	  {
	    name: 'second',
	    method: 'Seconds',
	    multiplier: 1000,
	    start: 0,
	    end: 59
	  },
	  {
	    name: 'minute',
	    method: 'Minutes',
	    multiplier: 60 * 1000,
	    start: 0,
	    end: 59
	  },
	  {
	    name: 'hour',
	    method: 'Hours',
	    multiplier: 60 * 60 * 1000,
	    start: 0,
	    end: 23
	  },
	  {
	    name: 'day',
	    alias: 'date',
	    method: 'Date',
	    ambiguous: true,
	    multiplier: 24 * 60 * 60 * 1000,
	    start: 1,
	    end: function(d) {
	      return getDaysInMonth(d);
	    }
	  },
	  {
	    name: 'week',
	    method: 'ISOWeek',
	    ambiguous: true,
	    multiplier: 7 * 24 * 60 * 60 * 1000
	  },
	  {
	    name: 'month',
	    method: 'Month',
	    ambiguous: true,
	    multiplier: 30.4375 * 24 * 60 * 60 * 1000,
	    start: 0,
	    end: 11
	  },
	  {
	    name: 'year',
	    method: 'FullYear',
	    ambiguous: true,
	    multiplier: 365.25 * 24 * 60 * 60 * 1000,
	    start: 0
	  }
	];
	
	module.exports = DateUnits;

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getYear = __webpack_require__(47),
	    getMonth = __webpack_require__(52),
	    callDateGet = __webpack_require__(48);
	
	function getDaysInMonth(d) {
	  return 32 - callDateGet(new Date(getYear(d), getMonth(d), 32), 'Date');
	}
	
	module.exports = getDaysInMonth;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callDateGet = __webpack_require__(48);
	
	function getYear(d) {
	  return callDateGet(d, 'FullYear');
	}
	
	module.exports = getYear;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _utc = __webpack_require__(49);
	
	function callDateGet(d, method) {
	  return d['get' + (_utc(d) ? 'UTC' : '') + method]();
	}
	
	module.exports = callDateGet;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var privatePropertyAccessor = __webpack_require__(50);
	
	module.exports = privatePropertyAccessor('utc');

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var PRIVATE_PROP_PREFIX = __webpack_require__(51),
	    coreUtilityAliases = __webpack_require__(12);
	
	var setProperty = coreUtilityAliases.setProperty;
	
	function privatePropertyAccessor(key) {
	  var privateKey = PRIVATE_PROP_PREFIX + key;
	  return function(obj, val) {
	    if (arguments.length > 1) {
	      setProperty(obj, privateKey, val);
	      return obj;
	    }
	    return obj[privateKey];
	  };
	}
	
	module.exports = privatePropertyAccessor;

/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = '_sugar_';

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callDateGet = __webpack_require__(48);
	
	function getMonth(d) {
	  return callDateGet(d, 'Month');
	}
	
	module.exports = getMonth;

/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  HOURS_INDEX: 3,
	  DAY_INDEX: 4,
	  WEEK_INDEX: 5,
	  MONTH_INDEX: 6,
	  YEAR_INDEX: 7
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var map = __webpack_require__(22),
	    escapeRegExp = __webpack_require__(55);
	
	function arrayToRegAlternates(arr) {
	  var joined = arr.join('');
	  if (!arr || !arr.length) {
	    return '';
	  }
	  if (joined.length === arr.length) {
	    return '[' + joined + ']';
	  }
	  // map handles sparse arrays so no need to compact the array here.
	  return map(arr, escapeRegExp).join('|');
	}
	
	module.exports = arrayToRegAlternates;

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classChecks = __webpack_require__(31);
	
	var isString = classChecks.isString;
	
	function escapeRegExp(str) {
	  if (!isString(str)) str = String(str);
	  return str.replace(/([\\\/\'*+?|()\[\]{}.^$-])/g,'\\$1');
	}
	
	module.exports = escapeRegExp;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var CommonChars = __webpack_require__(30),
	    chr = __webpack_require__(57),
	    allCharsReg = __webpack_require__(58);
	
	var HALF_WIDTH_ZERO = CommonChars.HALF_WIDTH_ZERO,
	    FULL_WIDTH_ZERO = CommonChars.FULL_WIDTH_ZERO,
	    HALF_WIDTH_PERIOD = CommonChars.HALF_WIDTH_PERIOD,
	    FULL_WIDTH_PERIOD = CommonChars.FULL_WIDTH_PERIOD,
	    HALF_WIDTH_COMMA = CommonChars.HALF_WIDTH_COMMA;
	
	var fullWidthNumberReg, fullWidthNumberMap, fullWidthNumbers;
	
	function buildFullWidthNumber() {
	  var fwp = FULL_WIDTH_PERIOD, hwp = HALF_WIDTH_PERIOD, hwc = HALF_WIDTH_COMMA, fwn = '';
	  fullWidthNumberMap = {};
	  for (var i = 0, digit; i <= 9; i++) {
	    digit = chr(i + FULL_WIDTH_ZERO);
	    fwn += digit;
	    fullWidthNumberMap[digit] = chr(i + HALF_WIDTH_ZERO);
	  }
	  fullWidthNumberMap[hwc] = '';
	  fullWidthNumberMap[fwp] = hwp;
	  // Mapping this to itself to capture it easily
	  // in stringToNumber to detect decimals later.
	  fullWidthNumberMap[hwp] = hwp;
	  fullWidthNumberReg = allCharsReg(fwn + fwp + hwc + hwp);
	  fullWidthNumbers = fwn;
	}
	
	buildFullWidthNumber();
	
	module.exports = {
	  fullWidthNumberReg: fullWidthNumberReg,
	  fullWidthNumberMap: fullWidthNumberMap,
	  fullWidthNumbers: fullWidthNumbers
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = String.fromCharCode;

/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';
	
	function allCharsReg(src) {
	  return RegExp('[' + src + ']', 'g');
	}
	
	module.exports = allCharsReg;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var trunc = __webpack_require__(60),
	    withPrecision = __webpack_require__(61),
	    getAdjustedUnit = __webpack_require__(62);
	
	function getAdjustedUnitForNumber(ms) {
	  return getAdjustedUnit(ms, function(unit) {
	    return trunc(withPrecision(ms / unit.multiplier, 1));
	  });
	}
	
	module.exports = getAdjustedUnitForNumber;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var mathAliases = __webpack_require__(40);
	
	var ceil = mathAliases.ceil,
	    floor = mathAliases.floor;
	
	var trunc = Math.trunc || function(n) {
	  if (n === 0 || !isFinite(n)) return n;
	  return n < 0 ? ceil(n) : floor(n);
	};
	
	module.exports = trunc;

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var mathAliases = __webpack_require__(40);
	
	var abs = mathAliases.abs,
	    pow = mathAliases.pow,
	    round = mathAliases.round;
	
	function withPrecision(val, precision, fn) {
	  var multiplier = pow(10, abs(precision || 0));
	  fn = fn || round;
	  if (precision < 0) multiplier = 1 / multiplier;
	  return fn(val * multiplier) / multiplier;
	}
	
	module.exports = withPrecision;

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var mathAliases = __webpack_require__(40),
	    iterateOverDateUnits = __webpack_require__(44);
	
	var abs = mathAliases.abs;
	
	function getAdjustedUnit(ms, fn) {
	  var unitIndex = 0, value = 0;
	  iterateOverDateUnits(function(unit, i) {
	    value = abs(fn(unit));
	    if (value >= 1) {
	      unitIndex = i;
	      return false;
	    }
	  });
	  return [value, unitIndex, ms];
	}
	
	module.exports = getAdjustedUnit;

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LocalizedParsingTokens = __webpack_require__(21),
	    getRegNonCapturing = __webpack_require__(42);
	
	function getParsingTokenWithSuffix(field, src, suffix) {
	  var token = LocalizedParsingTokens[field];
	  if (token.requiresSuffix) {
	    src = getRegNonCapturing(src + getRegNonCapturing(suffix));
	  } else if (token.requiresSuffixOr) {
	    src += getRegNonCapturing(token.requiresSuffixOr + '|' + suffix);
	  } else {
	    src += getRegNonCapturing(suffix, true);
	  }
	  return src;
	}
	
	module.exports = getParsingTokenWithSuffix;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    createDate = __webpack_require__(65);
	
	__webpack_require__(107);
	
	Sugar.Date.defineStatic({
	
	  'create': function(d, options) {
	    return createDate(d, options);
	  }
	
	});
	
	module.exports = Sugar.Date.create;

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getExtendedDate = __webpack_require__(66);
	
	function createDate(d, options, forceClone) {
	  return getExtendedDate(null, d, options, forceClone).date;
	}
	
	module.exports = createDate;

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var MINUTES = __webpack_require__(67),
	    ParsingTokens = __webpack_require__(19),
	    LocaleHelpers = __webpack_require__(6),
	    DateUnitIndexes = __webpack_require__(53),
	    _utc = __webpack_require__(49),
	    trunc = __webpack_require__(60),
	    forEach = __webpack_require__(24),
	    tzOffset = __webpack_require__(68),
	    resetTime = __webpack_require__(69),
	    isDefined = __webpack_require__(28),
	    setWeekday = __webpack_require__(74),
	    updateDate = __webpack_require__(78),
	    getNewDate = __webpack_require__(79),
	    isUndefined = __webpack_require__(39),
	    classChecks = __webpack_require__(31),
	    advanceDate = __webpack_require__(99),
	    simpleClone = __webpack_require__(13),
	    isObjectType = __webpack_require__(36),
	    moveToEndOfUnit = __webpack_require__(100),
	    deleteDateParam = __webpack_require__(102),
	    coreUtilityAliases = __webpack_require__(12),
	    getParsingTokenValue = __webpack_require__(103),
	    moveToBeginningOfUnit = __webpack_require__(104),
	    iterateOverDateParams = __webpack_require__(95),
	    getYearFromAbbreviation = __webpack_require__(105),
	    iterateOverHigherDateParams = __webpack_require__(106);
	
	var isNumber = classChecks.isNumber,
	    isString = classChecks.isString,
	    isDate = classChecks.isDate,
	    hasOwn = coreUtilityAliases.hasOwn,
	    getOwn = coreUtilityAliases.getOwn,
	    English = LocaleHelpers.English,
	    localeManager = LocaleHelpers.localeManager,
	    DAY_INDEX = DateUnitIndexes.DAY_INDEX,
	    WEEK_INDEX = DateUnitIndexes.WEEK_INDEX,
	    MONTH_INDEX = DateUnitIndexes.MONTH_INDEX,
	    YEAR_INDEX = DateUnitIndexes.YEAR_INDEX;
	
	function getExtendedDate(contextDate, d, opt, forceClone) {
	
	  var date, set, loc, options, afterCallbacks, relative, weekdayDir;
	
	  afterCallbacks = [];
	  options = getDateOptions(opt);
	
	  function getDateOptions(opt) {
	    var options = isString(opt) ? { locale: opt } : opt || {};
	    options.prefer = +!!getOwn(options, 'future') - +!!getOwn(options, 'past');
	    return options;
	  }
	
	  function getFormatParams(match, dif) {
	    var set = getOwn(options, 'params') || {};
	    forEach(dif.to, function(field, i) {
	      var str = match[i + 1], token, val;
	      if (!str) return;
	      if (field === 'yy' || field === 'y') {
	        field = 'year';
	        val = getYearFromAbbreviation(str, date, getOwn(options, 'prefer'));
	      } else if (token = getOwn(ParsingTokens, field)) {
	        field = token.param || field;
	        val = getParsingTokenValue(token, str);
	      } else {
	        val = loc.getTokenValue(field, str);
	      }
	      set[field] = val;
	    });
	    return set;
	  }
	
	  // Clone date will set the utc flag, but it will
	  // be overriden later, so set option flags instead.
	  function cloneDateByFlag(d, clone) {
	    if (_utc(d) && !isDefined(getOwn(options, 'fromUTC'))) {
	      options.fromUTC = true;
	    }
	    if (_utc(d) && !isDefined(getOwn(options, 'setUTC'))) {
	      options.setUTC = true;
	    }
	    if (clone) {
	      d = new Date(d.getTime());
	    }
	    return d;
	  }
	
	  function afterDateSet(fn) {
	    afterCallbacks.push(fn);
	  }
	
	  function fireCallbacks() {
	    forEach(afterCallbacks, function(fn) {
	      fn.call();
	    });
	  }
	
	  function parseStringDate(str) {
	
	    str = str.toLowerCase();
	
	    // The act of getting the locale will initialize
	    // if it is missing and add the required formats.
	    loc = localeManager.get(getOwn(options, 'locale'));
	
	    for (var i = 0, dif, match; dif = loc.compiledFormats[i]; i++) {
	      match = str.match(dif.reg);
	      if (match) {
	
	        // Note that caching the format will modify the compiledFormats array
	        // which is not a good idea to do inside its for loop, however we
	        // know at this point that we have a matched format and that we will
	        // break out below, so simpler to do it here.
	        loc.cacheFormat(dif, i);
	
	        set = getFormatParams(match, dif);
	
	        if (isDefined(set.timestamp)) {
	          str = set.timestamp;
	          set = null;
	          break;
	        }
	
	        if (isDefined(set.ampm)) {
	          handleAmpm(set.ampm);
	        }
	
	        if (set.utc || isDefined(set.tzHour)) {
	          handleTimezoneOffset(set.tzHour, set.tzMinute, set.tzSign);
	        }
	
	        if (isDefined(set.shift) && isUndefined(set.unit)) {
	          // "next january", "next monday", etc
	          handleUnitlessShift();
	        }
	
	        if (isDefined(set.num) && isUndefined(set.unit)) {
	          // "the second of January", etc
	          handleUnitlessNum(set.num);
	        }
	
	        if (set.midday) {
	          // "noon" and "midnight"
	          handleMidday(set.midday);
	        }
	
	        if (isDefined(set.day)) {
	          // Relative day localizations such as "today" and "tomorrow".
	          handleRelativeDay(set.day);
	        }
	
	        if (isDefined(set.unit)) {
	          // "3 days ago", etc
	          handleRelativeUnit(set.unit);
	        }
	
	        if (set.edge) {
	          // "the end of January", etc
	          handleEdge(set.edge, set);
	        }
	
	        if (set.yearSign) {
	          set.year *= set.yearSign;
	        }
	
	        break;
	      }
	    }
	
	    if (!set) {
	      // Fall back to native parsing
	      date = new Date(str);
	      if (getOwn(options, 'fromUTC')) {
	        // Falling back to system date here which cannot be parsed as UTC,
	        // so if we're forcing UTC then simply add the offset.
	        date.setTime(date.getTime() + (tzOffset(date) * MINUTES));
	      }
	    } else if (relative) {
	      updateDate(date, set, false, 1);
	    } else {
	      if (_utc(date)) {
	        // UTC times can traverse into other days or even months,
	        // so preemtively reset the time here to prevent this.
	        resetTime(date);
	      }
	      updateDate(date, set, true, 0, getOwn(options, 'prefer'), weekdayDir);
	    }
	    fireCallbacks();
	    return date;
	  }
	
	  function handleAmpm(ampm) {
	    if (ampm === 1 && set.hour < 12) {
	      // If the time is 1pm-11pm advance the time by 12 hours.
	      set.hour += 12;
	    } else if (ampm === 0 && set.hour === 12) {
	      // If it is 12:00am then set the hour to 0.
	      set.hour = 0;
	    }
	  }
	
	  function handleTimezoneOffset(tzHour, tzMinute, tzSign) {
	    // Adjust for timezone offset
	    _utc(date, true);
	    var offset = (tzSign || 1) * ((tzHour || 0) * 60 + (tzMinute || 0));
	    if (offset) {
	      set.minute = (set.minute || 0) - offset;
	    }
	  }
	
	  function handleUnitlessShift() {
	    if (isDefined(set.month)) {
	      // "next January"
	      set.unit = YEAR_INDEX;
	    } else if (isDefined(set.weekday)) {
	      // "next Monday"
	      set.unit = WEEK_INDEX;
	    }
	  }
	
	  function handleUnitlessNum(num) {
	    if (isDefined(set.weekday)) {
	      // "The second Tuesday of March"
	      setOrdinalWeekday(num);
	    } else if (isDefined(set.month)) {
	      // "The second of March"
	      set.date = set.num;
	    }
	  }
	
	  function handleMidday(hour) {
	    set.hour = hour % 24;
	    if (hour > 23) {
	      // If the date has hours past 24, we need to prevent it from traversing
	      // into a new day as that would make it being part of a new week in
	      // ambiguous dates such as "Monday".
	      afterDateSet(function() {
	        advanceDate(date, 'date', trunc(hour / 24));
	      });
	    }
	  }
	
	  function handleRelativeDay() {
	    resetTime(date);
	    if (isUndefined(set.unit)) {
	      set.unit = DAY_INDEX;
	      set.num  = set.day;
	      delete set.day;
	    }
	  }
	
	  function handleRelativeUnit(unitIndex) {
	    var num = isDefined(set.num) ? set.num : 1;
	
	    // If a weekday is defined, there are 3 possible formats being applied:
	    //
	    // 1. "the day after monday": unit is days
	    // 2. "next monday": short for "next week monday", unit is weeks
	    // 3. "the 2nd monday of next month": unit is months
	    //
	    // In the first case, we need to set the weekday up front, as the day is
	    // relative to it. The second case also needs to be handled up front for
	    // formats like "next monday at midnight" which will have its weekday reset
	    // if not set up front. The last case will set up the params necessary to
	    // shift the weekday and allow separateAbsoluteUnits below to handle setting
	    // it after the date has been shifted.
	    if(isDefined(set.weekday)) {
	      if(unitIndex === MONTH_INDEX) {
	        setOrdinalWeekday(num);
	        num = 1;
	      } else {
	        updateDate(date, { weekday: set.weekday }, true);
	        delete set.weekday;
	      }
	    }
	
	    if (set.half) {
	      // Allow localized "half" as a standalone colloquialism. Purposely avoiding
	      // the locale number system to reduce complexity. The units "month" and
	      // "week" are purposely excluded in the English date formats below, as
	      // "half a week" and "half a month" are meaningless as exact dates.
	      num *= set.half;
	    }
	
	    if (isDefined(set.shift)) {
	      // Shift and unit, ie "next month", "last week", etc.
	      num *= set.shift;
	    } else if (set.sign) {
	      // Unit and sign, ie "months ago", "weeks from now", etc.
	      num *= set.sign;
	    }
	
	    if (isDefined(set.day)) {
	      // "the day after tomorrow"
	      num += set.day;
	      delete set.day;
	    }
	
	    // Formats like "the 15th of last month" or "6:30pm of next week"
	    // contain absolute units in addition to relative ones, so separate
	    // them here, remove them from the params, and set up a callback to
	    // set them after the relative ones have been set.
	    separateAbsoluteUnits(unitIndex);
	
	    // Finally shift the unit.
	    set[English.units[unitIndex]] = num;
	    relative = true;
	  }
	
	  function handleEdge(edge, params) {
	    var edgeIndex = params.unit, weekdayOfMonth;
	    if (!edgeIndex) {
	      // If we have "the end of January", then we need to find the unit index.
	      iterateOverHigherDateParams(params, function(unitName, val, unit, i) {
	        if (unitName === 'weekday' && isDefined(params.month)) {
	          // If both a month and weekday exist, then we have a format like
	          // "the last tuesday in November, 2012", where the "last" is still
	          // relative to the end of the month, so prevent the unit "weekday"
	          // from taking over.
	          return;
	        }
	        edgeIndex = i;
	      });
	    }
	    if (edgeIndex === MONTH_INDEX && isDefined(params.weekday)) {
	      // If a weekday in a month exists (as described above),
	      // then set it up to be set after the date has been shifted.
	      weekdayOfMonth = params.weekday;
	      delete params.weekday;
	    }
	    afterDateSet(function() {
	      var stopIndex;
	      // "edge" values that are at the very edge are "2" so the beginning of the
	      // year is -2 and the end of the year is 2. Conversely, the "last day" is
	      // actually 00:00am so it is 1. -1 is reserved but unused for now.
	      if (edge < 0) {
	        moveToBeginningOfUnit(date, edgeIndex, getOwn(options, 'locale'));
	      } else if (edge > 0) {
	        if (edge === 1) {
	          stopIndex = DAY_INDEX;
	          moveToBeginningOfUnit(date, DAY_INDEX);
	        }
	        moveToEndOfUnit(date, edgeIndex, getOwn(options, 'locale'), stopIndex);
	      }
	      if (isDefined(weekdayOfMonth)) {
	        setWeekday(date, weekdayOfMonth, -edge);
	        resetTime(date);
	      }
	    });
	    if (edgeIndex === MONTH_INDEX) {
	      params.specificity = DAY_INDEX;
	    } else {
	      params.specificity = edgeIndex - 1;
	    }
	  }
	
	  function setOrdinalWeekday(num) {
	    // If we have "the 2nd Tuesday of June", then pass the "weekdayDir"
	    // flag along to updateDate so that the date does not accidentally traverse
	    // into the previous month. This needs to be independent of the "prefer"
	    // flag because we are only ensuring that the weekday is in the future, not
	    // the entire date.
	    set.weekday = 7 * (num - 1) + set.weekday;
	    set.date = 1;
	    weekdayDir = 1;
	  }
	
	  function separateAbsoluteUnits(unitIndex) {
	    var params;
	
	    iterateOverDateParams(set, function(name, val, unit, i) {
	      // If there is a time unit set that is more specific than
	      // the matched unit we have a string like "5:30am in 2 minutes",
	      // which is meaningless, so invalidate the date...
	      if (i >= unitIndex) {
	        date.setTime(NaN);
	        return false;
	      } else if (i < unitIndex) {
	        // ...otherwise set the params to set the absolute date
	        // as a callback after the relative date has been set.
	        params = params || {};
	        params[name] = val;
	        deleteDateParam(set, name);
	      }
	    });
	    if (params) {
	      afterDateSet(function() {
	        updateDate(date, params, true, false, getOwn(options, 'prefer'), weekdayDir);
	      });
	      if (set.edge) {
	        // "the end of March of next year"
	        handleEdge(set.edge, params);
	        delete set.edge;
	      }
	    }
	  }
	
	  if (contextDate && d) {
	    // If a context date is passed ("get" and "unitsFromNow"),
	    // then use it as the starting point.
	    date = cloneDateByFlag(contextDate, true);
	  } else {
	    date = getNewDate();
	  }
	
	  _utc(date, getOwn(options, 'fromUTC'));
	
	  if (isString(d)) {
	    date = parseStringDate(d);
	  } else if (isDate(d)) {
	    date = cloneDateByFlag(d, hasOwn(options, 'clone') || forceClone);
	  } else if (isObjectType(d)) {
	    set = simpleClone(d);
	    updateDate(date, set, true);
	  } else if (isNumber(d) || d === null) {
	    date.setTime(d);
	  }
	  // A date created by parsing a string presumes that the format *itself* is
	  // UTC, but not that the date, once created, should be manipulated as such. In
	  // other words, if you are creating a date object from a server time
	  // "2012-11-15T12:00:00Z", in the majority of cases you are using it to create
	  // a date that will, after creation, be manipulated as local, so reset the utc
	  // flag here unless "setUTC" is also set.
	  _utc(date, !!getOwn(options, 'setUTC'));
	  return {
	    set: set,
	    date: date
	  };
	}
	
	module.exports = getExtendedDate;

/***/ },
/* 67 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = 60 * 1000;

/***/ },
/* 68 */
/***/ function(module, exports) {

	'use strict';
	
	function tzOffset(d) {
	  return d.getTimezoneOffset();
	}
	
	module.exports = tzOffset;

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnitIndexes = __webpack_require__(53),
	    setUnitAndLowerToEdge = __webpack_require__(70);
	
	var HOURS_INDEX = DateUnitIndexes.HOURS_INDEX;
	
	function resetTime(d) {
	  return setUnitAndLowerToEdge(d, HOURS_INDEX);
	}
	
	module.exports = resetTime;

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isDefined = __webpack_require__(28),
	    classChecks = __webpack_require__(31),
	    callDateSet = __webpack_require__(71),
	    walkUnitDown = __webpack_require__(72);
	
	var isFunction = classChecks.isFunction;
	
	function setUnitAndLowerToEdge(d, startIndex, stopIndex, end) {
	  walkUnitDown(startIndex, function(unit, i) {
	    var val = end ? unit.end : unit.start;
	    if (isFunction(val)) {
	      val = val(d);
	    }
	    callDateSet(d, unit.method, val);
	    return !isDefined(stopIndex) || i > stopIndex;
	  });
	  return d;
	}
	
	module.exports = setUnitAndLowerToEdge;

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _utc = __webpack_require__(49),
	    callDateGet = __webpack_require__(48);
	
	function callDateSet(d, method, value, safe) {
	  // "Safe" denotes not setting the date if the value is the same as what is
	  // currently set. In theory this should be a noop, however it will cause
	  // timezone shifts when in the middle of a DST fallback. This is unavoidable
	  // as the notation itself is ambiguous (i.e. there are two "1:00ams" on
	  // November 1st, 2015 in northern hemisphere timezones that follow DST),
	  // however when advancing or rewinding dates this can throw off calculations
	  // so avoiding this unintentional shifting on an opt-in basis.
	  if (safe && value === callDateGet(d, method, value)) {
	    return;
	  }
	  d['set' + (_utc(d) ? 'UTC' : '') + method](value);
	}
	
	module.exports = callDateSet;

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnits = __webpack_require__(45),
	    getLowerUnitIndex = __webpack_require__(73);
	
	function walkUnitDown(unitIndex, fn) {
	  while (unitIndex >= 0) {
	    if (fn(DateUnits[unitIndex], unitIndex) === false) {
	      break;
	    }
	    unitIndex = getLowerUnitIndex(unitIndex);
	  }
	}
	
	module.exports = walkUnitDown;

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnitIndexes = __webpack_require__(53);
	
	var HOURS_INDEX = DateUnitIndexes.HOURS_INDEX,
	    DAY_INDEX = DateUnitIndexes.DAY_INDEX,
	    WEEK_INDEX = DateUnitIndexes.WEEK_INDEX,
	    MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
	
	function getLowerUnitIndex(index) {
	  if (index === MONTH_INDEX) {
	    return DAY_INDEX;
	  } else if (index === WEEK_INDEX) {
	    return HOURS_INDEX;
	  }
	  return index - 1;
	}
	
	module.exports = getLowerUnitIndex;

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var setDate = __webpack_require__(75),
	    getDate = __webpack_require__(76),
	    getWeekday = __webpack_require__(77),
	    classChecks = __webpack_require__(31),
	    mathAliases = __webpack_require__(40);
	
	var isNumber = classChecks.isNumber,
	    abs = mathAliases.abs;
	
	function setWeekday(d, dow, dir) {
	  if (!isNumber(dow)) return;
	  var currentWeekday = getWeekday(d);
	  if (dir) {
	    // Allow a "direction" parameter to determine whether a weekday can
	    // be set beyond the current weekday in either direction.
	    var ndir = dir > 0 ? 1 : -1;
	    var offset = dow % 7 - currentWeekday;
	    if (offset && offset / abs(offset) !== ndir) {
	      dow += 7 * ndir;
	    }
	  }
	  setDate(d, getDate(d) + dow - currentWeekday);
	  return d.getTime();
	}
	
	module.exports = setWeekday;

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callDateSet = __webpack_require__(71);
	
	function setDate(d, val) {
	  callDateSet(d, 'Date', val);
	}
	
	module.exports = setDate;

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callDateGet = __webpack_require__(48);
	
	function getDate(d) {
	  return callDateGet(d, 'Date');
	}
	
	module.exports = getDate;

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callDateGet = __webpack_require__(48);
	
	function getWeekday(d) {
	  return callDateGet(d, 'Day');
	}
	
	module.exports = getWeekday;

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnits = __webpack_require__(45),
	    DateUnitIndexes = __webpack_require__(53),
	    trunc = __webpack_require__(60),
	    setDate = __webpack_require__(75),
	    getDate = __webpack_require__(76),
	    getMonth = __webpack_require__(52),
	    getNewDate = __webpack_require__(79),
	    setWeekday = __webpack_require__(74),
	    mathAliases = __webpack_require__(40),
	    callDateGet = __webpack_require__(48),
	    classChecks = __webpack_require__(31),
	    resetLowerUnits = __webpack_require__(86),
	    getLowerUnitIndex = __webpack_require__(73),
	    getHigherUnitIndex = __webpack_require__(87),
	    callDateSetWithWeek = __webpack_require__(88),
	    iterateOverDateParams = __webpack_require__(95);
	
	var DAY_INDEX = DateUnitIndexes.DAY_INDEX,
	    WEEK_INDEX = DateUnitIndexes.WEEK_INDEX,
	    MONTH_INDEX = DateUnitIndexes.MONTH_INDEX,
	    YEAR_INDEX = DateUnitIndexes.YEAR_INDEX,
	    round = mathAliases.round,
	    isNumber = classChecks.isNumber;
	
	function updateDate(d, params, reset, advance, prefer, weekdayDir) {
	  var upperUnitIndex;
	
	  function setUpperUnit(unitName, unitIndex) {
	    if (prefer && !upperUnitIndex) {
	      if (unitName === 'weekday') {
	        upperUnitIndex = WEEK_INDEX;
	      } else {
	        upperUnitIndex = getHigherUnitIndex(unitIndex);
	      }
	    }
	  }
	
	  function setSpecificity(unitIndex) {
	    // Other functions may preemptively set the specificity before arriving
	    // here so concede to them if they have already set more specific units.
	    if (unitIndex > params.specificity) {
	      return;
	    }
	    params.specificity = unitIndex;
	  }
	
	  function canDisambiguate() {
	    if (!upperUnitIndex || upperUnitIndex > YEAR_INDEX) {
	      return;
	    }
	    switch(prefer) {
	      case -1: return d > getNewDate();
	      case  1: return d < getNewDate();
	    }
	  }
	
	  function disambiguateHigherUnit() {
	    var unit = DateUnits[upperUnitIndex];
	    advance = prefer;
	    setUnit(unit.name, 1, unit, upperUnitIndex);
	  }
	
	  function handleFraction(unit, unitIndex, fraction) {
	    if (unitIndex) {
	      var lowerUnit = DateUnits[getLowerUnitIndex(unitIndex)];
	      var val = round(unit.multiplier / lowerUnit.multiplier * fraction);
	      params[lowerUnit.name] = val;
	    }
	  }
	
	  function monthHasShifted(d, targetMonth) {
	    if (targetMonth < 0) {
	      targetMonth = targetMonth % 12 + 12;
	    }
	    return targetMonth % 12 !== getMonth(d);
	  }
	
	  function setUnit(unitName, value, unit, unitIndex) {
	    var method = unit.method, checkMonth, fraction;
	
	    setUpperUnit(unitName, unitIndex);
	    setSpecificity(unitIndex);
	
	    fraction = value % 1;
	    if (fraction) {
	      handleFraction(unit, unitIndex, fraction);
	      value = trunc(value);
	    }
	
	    if (unitName === 'weekday') {
	      if (!advance) {
	        // Weekdays are always considered absolute units so simply set them
	        // here even if it is an "advance" operation. This is to help avoid
	        // ambiguous meanings in "advance" as well as to neatly allow formats
	        // like "Wednesday of next week" without more complex logic.
	        setWeekday(d, value, weekdayDir);
	      }
	      return;
	    }
	    checkMonth = unitIndex === MONTH_INDEX && getDate(d) > 28;
	
	    // If we are advancing or rewinding, then we need we need to set the
	    // absolute time if the unit is "hours" or less. This is due to the fact
	    // that setting by method is ambiguous during DST shifts. For example,
	    // 1:00am on November 1st 2015 occurs twice in North American timezones
	    // with DST, the second time being after the clocks are rolled back at
	    // 2:00am. When springing forward this is automatically handled as there
	    // is no 2:00am so the date automatically jumps to 3:00am. However, when
	    // rolling back, setHours(2) will always choose the first "2am" even if
	    // the date is currently set to the second, causing unintended jumps.
	    // This ambiguity is unavoidable when setting dates as the notation is
	    // ambiguous. However when advancing, we clearly want the resulting date
	    // to be an acutal hour ahead, which can only be accomplished by setting
	    // the absolute time. Conversely, any unit higher than "hours" MUST use
	    // the internal set methods, as they are ambiguous as absolute units of
	    // time. Years may be 365 or 366 days depending on leap years, months are
	    // all over the place, and even days may be 23-25 hours depending on DST
	    // shifts. Finally, note that the kind of jumping described above will
	    // occur when calling ANY "set" method on the date and will occur even if
	    // the value being set is identical to the one currently set (i.e.
	    // setHours(2) on a date at 2am may not be a noop). This is precarious,
	    // so avoiding this situation in callDateSet by checking up front that
	    // the value is not the same before setting.
	    if (advance && !unit.ambiguous) {
	      d.setTime(d.getTime() + (value * advance * unit.multiplier));
	      return;
	    } else if (advance) {
	      if (unitIndex === WEEK_INDEX) {
	        value *= 7;
	        method = DateUnits[DAY_INDEX].method;
	      }
	      value = (value * advance) + callDateGet(d, method);
	    }
	    callDateSetWithWeek(d, method, value, advance);
	    if (checkMonth && monthHasShifted(d, value)) {
	      // As we are setting the units in reverse order, there is a chance that
	      // our date may accidentally traverse into a new month, such as setting
	      // { month: 1, date 15 } on January 31st. Check for this here and reset
	      // the date to the last day of the previous month if this has happened.
	      setDate(d, 0);
	    }
	  }
	
	  if (isNumber(params) && advance) {
	    // If param is a number and advancing, the number is in milliseconds.
	    params = { millisecond: params };
	  } else if (isNumber(params)) {
	    // Otherwise just set the timestamp and return.
	    d.setTime(params);
	    return d;
	  }
	
	  iterateOverDateParams(params, setUnit);
	
	  if (reset && params.specificity) {
	    resetLowerUnits(d, params.specificity);
	  }
	
	  // If past or future is preferred, then the process of "disambiguation" will
	  // ensure that an ambiguous time/date ("4pm", "thursday", "June", etc.) will
	  // be in the past or future. Weeks are only considered ambiguous if there is
	  // a weekday, i.e. "thursday" is an ambiguous week, but "the 4th" is an
	  // ambiguous month.
	  if (canDisambiguate()) {
	    disambiguateHigherUnit();
	  }
	  return d;
	}
	
	module.exports = updateDate;

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _dateOptions = __webpack_require__(80);
	
	function getNewDate() {
	  return _dateOptions('newDateInternal')();
	}
	
	module.exports = getNewDate;

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DATE_OPTIONS = __webpack_require__(81),
	    namespaceAliases = __webpack_require__(83),
	    defineOptionsAccessor = __webpack_require__(84);
	
	var sugarDate = namespaceAliases.sugarDate;
	
	module.exports = defineOptionsAccessor(sugarDate, DATE_OPTIONS);

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var defaultNewDate = __webpack_require__(82);
	
	var DATE_OPTIONS = {
	  'newDateInternal': defaultNewDate
	};
	
	module.exports = DATE_OPTIONS;

/***/ },
/* 82 */
/***/ function(module, exports) {

	'use strict';
	
	function defaultNewDate() {
	  return new Date;
	}
	
	module.exports = defaultNewDate;

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	module.exports = {
	  sugarObject: Sugar.Object,
	  sugarArray: Sugar.Array,
	  sugarDate: Sugar.Date,
	  sugarString: Sugar.String,
	  sugarNumber: Sugar.Number,
	  sugarFunction: Sugar.Function,
	  sugarRegExp: Sugar.RegExp
	};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var simpleClone = __webpack_require__(13),
	    defineAccessor = __webpack_require__(85),
	    coreUtilityAliases = __webpack_require__(12);
	
	var forEachProperty = coreUtilityAliases.forEachProperty;
	
	function defineOptionsAccessor(namespace, defaults) {
	  var obj = simpleClone(defaults);
	
	  function getOption(name) {
	    return obj[name];
	  }
	
	  function setOption(arg1, arg2) {
	    var options;
	    if (arguments.length === 1) {
	      options = arg1;
	    } else {
	      options = {};
	      options[arg1] = arg2;
	    }
	    forEachProperty(options, function(val, name) {
	      if (val === null) {
	        val = defaults[name];
	      }
	      obj[name] = val;
	    });
	  }
	
	  defineAccessor(namespace, 'getOption', getOption);
	  defineAccessor(namespace, 'setOption', setOption);
	  return getOption;
	}
	
	module.exports = defineOptionsAccessor;

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var coreUtilityAliases = __webpack_require__(12);
	
	var setProperty = coreUtilityAliases.setProperty;
	
	function defineAccessor(namespace, name, fn) {
	  setProperty(namespace, name, fn);
	}
	
	module.exports = defineAccessor;

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getLowerUnitIndex = __webpack_require__(73),
	    setUnitAndLowerToEdge = __webpack_require__(70);
	
	function resetLowerUnits(d, unitIndex) {
	  return setUnitAndLowerToEdge(d, getLowerUnitIndex(unitIndex));
	}
	
	module.exports = resetLowerUnits;

/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnitIndexes = __webpack_require__(53);
	
	var DAY_INDEX = DateUnitIndexes.DAY_INDEX,
	    MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
	
	function getHigherUnitIndex(index) {
	  return index === DAY_INDEX ? MONTH_INDEX : index + 1;
	}
	
	module.exports = getHigherUnitIndex;

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callDateSet = __webpack_require__(71),
	    setISOWeekNumber = __webpack_require__(89);
	
	function callDateSetWithWeek(d, method, value, safe) {
	  if (method === 'ISOWeek') {
	    setISOWeekNumber(d, value);
	  } else {
	    callDateSet(d, method, value, safe);
	  }
	}
	
	module.exports = callDateSetWithWeek;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ISODefaults = __webpack_require__(18),
	    getDate = __webpack_require__(76),
	    setDate = __webpack_require__(75),
	    setYear = __webpack_require__(90),
	    getYear = __webpack_require__(47),
	    getMonth = __webpack_require__(52),
	    setMonth = __webpack_require__(91),
	    cloneDate = __webpack_require__(92),
	    getWeekday = __webpack_require__(77),
	    setWeekday = __webpack_require__(74),
	    classChecks = __webpack_require__(31),
	    moveToFirstDayOfWeekYear = __webpack_require__(93);
	
	var isNumber = classChecks.isNumber,
	    ISO_FIRST_DAY_OF_WEEK = ISODefaults.ISO_FIRST_DAY_OF_WEEK,
	    ISO_FIRST_DAY_OF_WEEK_YEAR = ISODefaults.ISO_FIRST_DAY_OF_WEEK_YEAR;
	
	function setISOWeekNumber(d, num) {
	  if (isNumber(num)) {
	    // Intentionally avoiding updateDate here to prevent circular dependencies.
	    var isoWeek = cloneDate(d), dow = getWeekday(d);
	    moveToFirstDayOfWeekYear(isoWeek, ISO_FIRST_DAY_OF_WEEK, ISO_FIRST_DAY_OF_WEEK_YEAR);
	    setDate(isoWeek, getDate(isoWeek) + 7 * (num - 1));
	    setYear(d, getYear(isoWeek));
	    setMonth(d, getMonth(isoWeek));
	    setDate(d, getDate(isoWeek));
	    setWeekday(d, dow || 7);
	  }
	  return d.getTime();
	}
	
	module.exports = setISOWeekNumber;

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callDateSet = __webpack_require__(71);
	
	function setYear(d, val) {
	  callDateSet(d, 'FullYear', val);
	}
	
	module.exports = setYear;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callDateSet = __webpack_require__(71);
	
	function setMonth(d, val) {
	  callDateSet(d, 'Month', val);
	}
	
	module.exports = setMonth;

/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _utc = __webpack_require__(49);
	
	function cloneDate(d) {
	  // Rhino environments have a bug where new Date(d) truncates
	  // milliseconds so need to call getTime() here.
	  var clone = new Date(d.getTime());
	  _utc(clone, !!_utc(d));
	  return clone;
	}
	
	module.exports = cloneDate;

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnitIndexes = __webpack_require__(53),
	    setDate = __webpack_require__(75),
	    setUnitAndLowerToEdge = __webpack_require__(70),
	    moveToBeginningOfWeek = __webpack_require__(94);
	
	var MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
	
	function moveToFirstDayOfWeekYear(d, firstDayOfWeek, firstDayOfWeekYear) {
	  setUnitAndLowerToEdge(d, MONTH_INDEX);
	  setDate(d, firstDayOfWeekYear);
	  moveToBeginningOfWeek(d, firstDayOfWeek);
	}
	
	module.exports = moveToFirstDayOfWeekYear;

/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var setWeekday = __webpack_require__(74),
	    getWeekday = __webpack_require__(77),
	    mathAliases = __webpack_require__(40);
	
	var floor = mathAliases.floor;
	
	function moveToBeginningOfWeek(d, firstDayOfWeek) {
	  setWeekday(d, floor((getWeekday(d) - firstDayOfWeek) / 7) * 7 + firstDayOfWeek);
	  return d;
	}
	
	module.exports = moveToBeginningOfWeek;

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnitIndexes = __webpack_require__(53),
	    isDefined = __webpack_require__(28),
	    getDateParam = __webpack_require__(96),
	    iterateOverDateUnits = __webpack_require__(44);
	
	var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
	
	function iterateOverDateParams(params, fn, startIndex, endIndex) {
	
	  function run(name, unit, i) {
	    var val = getDateParam(params, name);
	    if (isDefined(val)) {
	      fn(name, val, unit, i);
	    }
	  }
	
	  iterateOverDateUnits(function (unit, i) {
	    var result = run(unit.name, unit, i);
	    if (result !== false && i === DAY_INDEX) {
	      // Check for "weekday", which has a distinct meaning
	      // in the context of setting a date, but has the same
	      // meaning as "day" as a unit of time.
	      result = run('weekday', unit, i);
	    }
	    return result;
	  }, startIndex, endIndex);
	
	}
	
	module.exports = iterateOverDateParams;

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getDateParamKey = __webpack_require__(97),
	    coreUtilityAliases = __webpack_require__(12);
	
	var getOwn = coreUtilityAliases.getOwn;
	
	function getDateParam(params, key) {
	  return getOwn(params, getDateParamKey(params, key));
	}
	
	module.exports = getDateParam;

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getOwnKey = __webpack_require__(98);
	
	function getDateParamKey(params, key) {
	  return getOwnKey(params, key) ||
	         getOwnKey(params, key + 's') ||
	         (key === 'day' && getOwnKey(params, 'date'));
	}
	
	module.exports = getDateParamKey;

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var coreUtilityAliases = __webpack_require__(12);
	
	var hasOwn = coreUtilityAliases.hasOwn;
	
	function getOwnKey(obj, key) {
	  if (hasOwn(obj, key)) {
	    return key;
	  }
	}
	
	module.exports = getOwnKey;

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var updateDate = __webpack_require__(78);
	
	function advanceDate(d, unit, num, reset) {
	  var set = {};
	  set[unit] = num;
	  return updateDate(d, set, reset, 1);
	}
	
	module.exports = advanceDate;

/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LocaleHelpers = __webpack_require__(6),
	    DateUnitIndexes = __webpack_require__(53),
	    moveToEndOfWeek = __webpack_require__(101),
	    getLowerUnitIndex = __webpack_require__(73),
	    setUnitAndLowerToEdge = __webpack_require__(70);
	
	var WEEK_INDEX = DateUnitIndexes.WEEK_INDEX,
	    localeManager = LocaleHelpers.localeManager;
	
	function moveToEndOfUnit(d, unitIndex, localeCode, stopIndex) {
	  if (unitIndex === WEEK_INDEX) {
	    moveToEndOfWeek(d, localeManager.get(localeCode).getFirstDayOfWeek());
	  }
	  return setUnitAndLowerToEdge(d, getLowerUnitIndex(unitIndex), stopIndex, true);
	}
	
	module.exports = moveToEndOfUnit;

/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var setWeekday = __webpack_require__(74),
	    getWeekday = __webpack_require__(77),
	    mathAliases = __webpack_require__(40);
	
	var ceil = mathAliases.ceil;
	
	function moveToEndOfWeek(d, firstDayOfWeek) {
	  var target = firstDayOfWeek - 1;
	  setWeekday(d, ceil((getWeekday(d) - target) / 7) * 7 + target);
	  return d;
	}
	
	module.exports = moveToEndOfWeek;

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getDateParamKey = __webpack_require__(97);
	
	function deleteDateParam(params, key) {
	  delete params[getDateParamKey(params, key)];
	}
	
	module.exports = deleteDateParam;

/***/ },
/* 103 */
/***/ function(module, exports) {

	'use strict';
	
	function getParsingTokenValue(token, str) {
	  var val;
	  if (token.val) {
	    val = token.val;
	  } else if (token.sign) {
	    val = str === '+' ? 1 : -1;
	  } else if (token.bool) {
	    val = !!val;
	  } else {
	    val = +str.replace(/,/, '.');
	  }
	  if (token.param === 'month') {
	    val -= 1;
	  }
	  return val;
	}
	
	module.exports = getParsingTokenValue;

/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LocaleHelpers = __webpack_require__(6),
	    DateUnitIndexes = __webpack_require__(53),
	    getLowerUnitIndex = __webpack_require__(73),
	    moveToBeginningOfWeek = __webpack_require__(94),
	    setUnitAndLowerToEdge = __webpack_require__(70);
	
	var WEEK_INDEX = DateUnitIndexes.WEEK_INDEX,
	    localeManager = LocaleHelpers.localeManager;
	
	function moveToBeginningOfUnit(d, unitIndex, localeCode) {
	  if (unitIndex === WEEK_INDEX) {
	    moveToBeginningOfWeek(d, localeManager.get(localeCode).getFirstDayOfWeek());
	  }
	  return setUnitAndLowerToEdge(d, getLowerUnitIndex(unitIndex));
	}
	
	module.exports = moveToBeginningOfUnit;

/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getYear = __webpack_require__(47),
	    mathAliases = __webpack_require__(40);
	
	var abs = mathAliases.abs;
	
	function getYearFromAbbreviation(str, d, prefer) {
	  // Following IETF here, adding 1900 or 2000 depending on the last two digits.
	  // Note that this makes no accordance for what should happen after 2050, but
	  // intentionally ignoring this for now. https://www.ietf.org/rfc/rfc2822.txt
	  var val = +str, delta;
	  val += val < 50 ? 2000 : 1900;
	  if (prefer) {
	    delta = val - getYear(d);
	    if (delta / abs(delta) !== prefer) {
	      val += prefer * 100;
	    }
	  }
	  return val;
	}
	
	module.exports = getYearFromAbbreviation;

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnitIndexes = __webpack_require__(53),
	    iterateOverDateParams = __webpack_require__(95);
	
	var DAY_INDEX = DateUnitIndexes.DAY_INDEX,
	    YEAR_INDEX = DateUnitIndexes.YEAR_INDEX;
	
	function iterateOverHigherDateParams(params, fn) {
	  iterateOverDateParams(params, fn, YEAR_INDEX, DAY_INDEX);
	}
	
	module.exports = iterateOverHigherDateParams;

/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var setDateChainableConstructor = __webpack_require__(108);
	
	setDateChainableConstructor();

/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var createDate = __webpack_require__(65),
	    namespaceAliases = __webpack_require__(83),
	    setChainableConstructor = __webpack_require__(109);
	
	var sugarDate = namespaceAliases.sugarDate;
	
	function setDateChainableConstructor() {
	  setChainableConstructor(sugarDate, createDate);
	}
	
	module.exports = setDateChainableConstructor;

/***/ },
/* 109 */
/***/ function(module, exports) {

	'use strict';
	
	function setChainableConstructor(sugarNamespace, createFn) {
	  sugarNamespace.prototype.constructor = function() {
	    return createFn.apply(this, arguments);
	  };
	}
	
	module.exports = setChainableConstructor;

/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    LocaleHelpers = __webpack_require__(6),
	    getKeys = __webpack_require__(111);
	
	var localeManager = LocaleHelpers.localeManager;
	
	Sugar.Date.defineStatic({
	
	  'getAllLocaleCodes': function() {
	    return getKeys(localeManager.getAll());
	  }
	
	});
	
	module.exports = Sugar.Date.getAllLocaleCodes;

/***/ },
/* 111 */
/***/ function(module, exports) {

	'use strict';
	
	function getKeys(obj) {
	  return Object.keys(obj);
	}
	
	module.exports = getKeys;

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    LocaleHelpers = __webpack_require__(6);
	
	var localeManager = LocaleHelpers.localeManager;
	
	Sugar.Date.defineStatic({
	
	  'getAllLocales': function() {
	    return localeManager.getAll();
	  }
	
	});
	
	module.exports = Sugar.Date.getAllLocales;

/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    LocaleHelpers = __webpack_require__(6);
	
	var localeManager = LocaleHelpers.localeManager;
	
	Sugar.Date.defineStatic({
	
	  'getLocale': function(code) {
	    return localeManager.get(code, !code);
	  }
	
	});
	
	module.exports = Sugar.Date.getLocale;

/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    LocaleHelpers = __webpack_require__(6);
	
	var localeManager = LocaleHelpers.localeManager;
	
	Sugar.Date.defineStatic({
	
	  'removeLocale': function(code) {
	    return localeManager.remove(code);
	  }
	
	});
	
	module.exports = Sugar.Date.removeLocale;

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    LocaleHelpers = __webpack_require__(6);
	
	var localeManager = LocaleHelpers.localeManager;
	
	Sugar.Date.defineStatic({
	
	  'setLocale': function(code) {
	    return localeManager.set(code);
	  }
	
	});
	
	module.exports = Sugar.Date.setLocale;

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.day;

/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var buildNumberUnitMethods = __webpack_require__(118);
	
	buildNumberUnitMethods();

/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnits = __webpack_require__(45),
	    createDate = __webpack_require__(65),
	    mathAliases = __webpack_require__(40),
	    advanceDate = __webpack_require__(99),
	    namespaceAliases = __webpack_require__(83),
	    defineInstanceSimilar = __webpack_require__(119);
	
	var sugarNumber = namespaceAliases.sugarNumber,
	    round = mathAliases.round;
	
	function buildNumberUnitMethods() {
	  defineInstanceSimilar(sugarNumber, DateUnits, function(methods, unit) {
	    var name = unit.name, base, after, before;
	    base = function(n) {
	      return round(n * unit.multiplier);
	    };
	    after = function(n, d, options) {
	      return advanceDate(createDate(d, options, true), name, n);
	    };
	    before = function(n, d, options) {
	      return advanceDate(createDate(d, options, true), name, -n);
	    };
	    methods[name] = base;
	    methods[name + 's'] = base;
	    methods[name + 'Before'] = before;
	    methods[name + 'sBefore'] = before;
	    methods[name + 'Ago'] = before;
	    methods[name + 'sAgo'] = before;
	    methods[name + 'After'] = after;
	    methods[name + 'sAfter'] = after;
	    methods[name + 'FromNow'] = after;
	    methods[name + 'sFromNow'] = after;
	  });
	}
	
	module.exports = buildNumberUnitMethods;

/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var methodDefineAliases = __webpack_require__(120),
	    collectSimilarMethods = __webpack_require__(122);
	
	var defineInstance = methodDefineAliases.defineInstance;
	
	function defineInstanceSimilar(sugarNamespace, set, fn, flags) {
	  defineInstance(sugarNamespace, collectSimilarMethods(set, fn), flags);
	}
	
	module.exports = defineInstanceSimilar;

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var wrapNamespace = __webpack_require__(121);
	
	module.exports = {
	  alias: wrapNamespace('alias'),
	  defineStatic: wrapNamespace('defineStatic'),
	  defineInstance: wrapNamespace('defineInstance'),
	  defineStaticPolyfill: wrapNamespace('defineStaticPolyfill'),
	  defineInstancePolyfill: wrapNamespace('defineInstancePolyfill'),
	  defineInstanceAndStatic: wrapNamespace('defineInstanceAndStatic'),
	  defineInstanceWithArguments: wrapNamespace('defineInstanceWithArguments')
	};

/***/ },
/* 121 */
/***/ function(module, exports) {

	'use strict';
	
	function wrapNamespace(method) {
	  return function(sugarNamespace, arg1, arg2) {
	    sugarNamespace[method](arg1, arg2);
	  };
	}
	
	module.exports = wrapNamespace;

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var forEach = __webpack_require__(24),
	    spaceSplit = __webpack_require__(34),
	    classChecks = __webpack_require__(31);
	
	var isString = classChecks.isString;
	
	function collectSimilarMethods(set, fn) {
	  var methods = {};
	  if (isString(set)) {
	    set = spaceSplit(set);
	  }
	  forEach(set, function(el, i) {
	    fn(methods, el, i);
	  });
	  return methods;
	}
	
	module.exports = collectSimilarMethods;

/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.dayAfter;

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.dayAgo;

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.dayBefore;

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.dayFromNow;

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.days;

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.daysAfter;

/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.daysAgo;

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.daysBefore;

/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.daysFromNow;

/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    LocaleHelpers = __webpack_require__(6);
	
	var localeManager = LocaleHelpers.localeManager;
	
	Sugar.Number.defineInstance({
	
	  'duration': function(n, localeCode) {
	    return localeManager.get(localeCode).getDuration(n);
	  }
	
	});
	
	module.exports = Sugar.Number.duration;

/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.hour;

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.hourAfter;

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.hourAgo;

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.hourBefore;

/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.hourFromNow;

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.hours;

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.hoursAfter;

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.hoursAgo;

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.hoursBefore;

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.hoursFromNow;

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.millisecond;

/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.millisecondAfter;

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.millisecondAgo;

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.millisecondBefore;

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.millisecondFromNow;

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.milliseconds;

/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.millisecondsAfter;

/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.millisecondsAgo;

/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.millisecondsBefore;

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.millisecondsFromNow;

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.minute;

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.minuteAfter;

/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.minuteAgo;

/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.minuteBefore;

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.minuteFromNow;

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.minutes;

/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.minutesAfter;

/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.minutesAgo;

/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.minutesBefore;

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.minutesFromNow;

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.month;

/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.monthAfter;

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.monthAgo;

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.monthBefore;

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.monthFromNow;

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.months;

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.monthsAfter;

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.monthsAgo;

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.monthsBefore;

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.monthsFromNow;

/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.second;

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.secondAfter;

/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.secondAgo;

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.secondBefore;

/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.secondFromNow;

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.seconds;

/***/ },
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.secondsAfter;

/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.secondsAgo;

/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.secondsBefore;

/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.secondsFromNow;

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.week;

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.weekAfter;

/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.weekAgo;

/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.weekBefore;

/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.weekFromNow;

/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.weeks;

/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.weeksAfter;

/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.weeksAgo;

/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.weeksBefore;

/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.weeksFromNow;

/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.year;

/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.yearAfter;

/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.yearAgo;

/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.yearBefore;

/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.yearFromNow;

/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.years;

/***/ },
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.yearsAfter;

/***/ },
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.yearsAgo;

/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.yearsBefore;

/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(117);
	
	module.exports = Sugar.Number.yearsFromNow;

/***/ },
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.addDays;

/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var buildDateUnitMethods = __webpack_require__(205);
	
	buildDateUnitMethods();

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnits = __webpack_require__(45),
	    DateUnitIndexes = __webpack_require__(53),
	    forEach = __webpack_require__(24),
	    compareDate = __webpack_require__(206),
	    advanceDate = __webpack_require__(99),
	    moveToEndOfUnit = __webpack_require__(100),
	    simpleCapitalize = __webpack_require__(208),
	    namespaceAliases = __webpack_require__(83),
	    defineInstanceSimilar = __webpack_require__(119),
	    moveToBeginningOfUnit = __webpack_require__(104),
	    createDateWithContext = __webpack_require__(209),
	    getTimeDistanceForUnit = __webpack_require__(210);
	
	var sugarDate = namespaceAliases.sugarDate,
	    HOURS_INDEX = DateUnitIndexes.HOURS_INDEX,
	    DAY_INDEX = DateUnitIndexes.DAY_INDEX;
	
	function buildDateUnitMethods() {
	
	  defineInstanceSimilar(sugarDate, DateUnits, function(methods, unit, index) {
	    var name = unit.name, caps = simpleCapitalize(name);
	
	    if (index > DAY_INDEX) {
	      forEach(['Last','This','Next'], function(shift) {
	        methods['is' + shift + caps] = function(d, localeCode) {
	          return compareDate(d, shift + ' ' + name, 0, localeCode, { locale: 'en' });
	        };
	      });
	    }
	    if (index > HOURS_INDEX) {
	      methods['beginningOf' + caps] = function(d, localeCode) {
	        return moveToBeginningOfUnit(d, index, localeCode);
	      };
	      methods['endOf' + caps] = function(d, localeCode) {
	        return moveToEndOfUnit(d, index, localeCode);
	      };
	    }
	
	    methods['add' + caps + 's'] = function(d, num, reset) {
	      return advanceDate(d, name, num, reset);
	    };
	
	    var since = function(date, d, options) {
	      return getTimeDistanceForUnit(date, createDateWithContext(date, d, options, true), unit);
	    };
	    var until = function(date, d, options) {
	      return getTimeDistanceForUnit(createDateWithContext(date, d, options, true), date, unit);
	    };
	
	    methods[name + 'sAgo']   = methods[name + 'sUntil']   = until;
	    methods[name + 'sSince'] = methods[name + 'sFromNow'] = since;
	
	  });
	
	}
	
	module.exports = buildDateUnitMethods;

/***/ },
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var MINUTES = __webpack_require__(67),
	    DateUnits = __webpack_require__(45),
	    DateUnitIndexes = __webpack_require__(53),
	    _utc = __webpack_require__(49),
	    tzOffset = __webpack_require__(68),
	    cloneDate = __webpack_require__(92),
	    isDefined = __webpack_require__(28),
	    advanceDate = __webpack_require__(99),
	    dateIsValid = __webpack_require__(207),
	    moveToEndOfUnit = __webpack_require__(100),
	    getExtendedDate = __webpack_require__(66),
	    moveToBeginningOfUnit = __webpack_require__(104);
	
	var MONTH_INDEX = DateUnitIndexes.MONTH_INDEX;
	
	function compareDate(date, d, margin, localeCode, options) {
	  var loMargin = 0, hiMargin = 0, timezoneShift, compareEdges, override, min, max, p, t;
	
	  function getTimezoneShift() {
	    // If there is any specificity in the date then we're implicitly not
	    // checking absolute time, so ignore timezone shifts.
	    if (p.set && p.set.specificity) {
	      return 0;
	    }
	    return (tzOffset(p.date) - tzOffset(date)) * MINUTES;
	  }
	
	  function addSpecificUnit() {
	    var unit = DateUnits[p.set.specificity];
	    return advanceDate(cloneDate(p.date), unit.name, 1).getTime() - 1;
	  }
	
	  if (_utc(date)) {
	    options = options || {};
	    options.fromUTC = true;
	    options.setUTC = true;
	  }
	
	  p = getExtendedDate(null, d, options, true);
	
	  if (margin > 0) {
	    loMargin = hiMargin = margin;
	    override = true;
	  }
	  if (!dateIsValid(p.date)) return false;
	  if (p.set && p.set.specificity) {
	    if (isDefined(p.set.edge) || isDefined(p.set.shift)) {
	      compareEdges = true;
	      moveToBeginningOfUnit(p.date, p.set.specificity, localeCode);
	    }
	    if (compareEdges || p.set.specificity === MONTH_INDEX) {
	      max = moveToEndOfUnit(cloneDate(p.date), p.set.specificity, localeCode).getTime();
	    } else {
	      max = addSpecificUnit();
	    }
	    if (!override && isDefined(p.set.sign) && p.set.specificity) {
	      // If the time is relative, there can occasionally be an disparity between
	      // the relative date and "now", which it is being compared to, so set an
	      // extra margin to account for this.
	      loMargin = 50;
	      hiMargin = -50;
	    }
	  }
	  t   = date.getTime();
	  min = p.date.getTime();
	  max = max || min;
	  timezoneShift = getTimezoneShift();
	  if (timezoneShift) {
	    min -= timezoneShift;
	    max -= timezoneShift;
	  }
	  return t >= (min - loMargin) && t <= (max + hiMargin);
	}
	
	module.exports = compareDate;

/***/ },
/* 207 */
/***/ function(module, exports) {

	'use strict';
	
	function dateIsValid(d) {
	  return !isNaN(d.getTime());
	}
	
	module.exports = dateIsValid;

/***/ },
/* 208 */
/***/ function(module, exports) {

	'use strict';
	
	function simpleCapitalize(str) {
	  return str.charAt(0).toUpperCase() + str.slice(1);
	}
	
	module.exports = simpleCapitalize;

/***/ },
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getExtendedDate = __webpack_require__(66);
	
	function createDateWithContext(contextDate, d, options, forceClone) {
	  return getExtendedDate(contextDate, d, options, forceClone).date;
	}
	
	module.exports = createDateWithContext;

/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var trunc = __webpack_require__(60),
	    cloneDate = __webpack_require__(92),
	    advanceDate = __webpack_require__(99);
	
	function getTimeDistanceForUnit(d1, d2, unit) {
	  var fwd = d2 > d1, num, tmp;
	  if (!fwd) {
	    tmp = d2;
	    d2  = d1;
	    d1  = tmp;
	  }
	  num = d2 - d1;
	  if (unit.multiplier > 1) {
	    num = trunc(num / unit.multiplier);
	  }
	  // For higher order with potential ambiguity, use the numeric calculation
	  // as a starting point, then iterate until we pass the target date.
	  if (unit.ambiguous) {
	    d1 = cloneDate(d1);
	    if (num) {
	      advanceDate(d1, unit.name, num);
	    }
	    while (d1 < d2) {
	      advanceDate(d1, unit.name, 1);
	      if (d1 > d2) {
	        break;
	      }
	      num += 1;
	    }
	  }
	  return fwd ? -num : num;
	}
	
	module.exports = getTimeDistanceForUnit;

/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.addHours;

/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.addMilliseconds;

/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.addMinutes;

/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.addMonths;

/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.addSeconds;

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.addWeeks;

/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.addYears;

/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    advanceDateWithArgs = __webpack_require__(219);
	
	Sugar.Date.defineInstanceWithArguments({
	
	  'advance': function(d, args) {
	    return advanceDateWithArgs(d, args, 1);
	  }
	
	});
	
	module.exports = Sugar.Date.advance;

/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var updateDate = __webpack_require__(78),
	    collectDateArguments = __webpack_require__(220);
	
	function advanceDateWithArgs(d, args, dir) {
	  args = collectDateArguments(args, true);
	  return updateDate(d, args[0], args[1], dir);
	}
	
	module.exports = advanceDateWithArgs;

/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classChecks = __webpack_require__(31),
	    simpleClone = __webpack_require__(13),
	    isObjectType = __webpack_require__(36),
	    getDateParamsFromString = __webpack_require__(221),
	    collectDateParamsFromArguments = __webpack_require__(222);
	
	var isNumber = classChecks.isNumber,
	    isString = classChecks.isString;
	
	function collectDateArguments(args, allowDuration) {
	  var arg1 = args[0], arg2 = args[1];
	  if (allowDuration && isString(arg1)) {
	    arg1 = getDateParamsFromString(arg1);
	  } else if (isNumber(arg1) && isNumber(arg2)) {
	    arg1 = collectDateParamsFromArguments(args);
	    arg2 = null;
	  } else {
	    if (isObjectType(arg1)) {
	      arg1 = simpleClone(arg1);
	    }
	  }
	  return [arg1, arg2];
	}
	
	module.exports = collectDateArguments;

/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isUndefined = __webpack_require__(39);
	
	function getDateParamsFromString(str) {
	  var match, num, params = {};
	  match = str.match(/^(-?\d*[\d.]\d*)?\s?(\w+?)s?$/i);
	  if (match) {
	    if (isUndefined(num)) {
	      num = +match[1];
	      if (isNaN(num)) {
	        num = 1;
	      }
	    }
	    params[match[2].toLowerCase()] = num;
	  }
	  return params;
	}
	
	module.exports = getDateParamsFromString;

/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnitIndexes = __webpack_require__(53),
	    isDefined = __webpack_require__(28),
	    walkUnitDown = __webpack_require__(72);
	
	var YEAR_INDEX = DateUnitIndexes.YEAR_INDEX;
	
	function collectDateParamsFromArguments(args) {
	  var params = {}, index = 0;
	  walkUnitDown(YEAR_INDEX, function(unit) {
	    var arg = args[index++];
	    if (isDefined(arg)) {
	      params[unit.name] = arg;
	    }
	  });
	  return params;
	}
	
	module.exports = collectDateParamsFromArguments;

/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.beginningOfDay;

/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    resetTime = __webpack_require__(69),
	    getWeekday = __webpack_require__(77),
	    setWeekday = __webpack_require__(74);
	
	Sugar.Date.defineInstance({
	
	  'beginningOfISOWeek': function(date) {
	    var day = getWeekday(date);
	    if (day === 0) {
	      day = -6;
	    } else if (day !== 1) {
	      day = 1;
	    }
	    setWeekday(date, day);
	    return resetTime(date);
	  }
	
	});
	
	module.exports = Sugar.Date.beginningOfISOWeek;

/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.beginningOfMonth;

/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.beginningOfWeek;

/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.beginningOfYear;

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    cloneDate = __webpack_require__(92);
	
	Sugar.Date.defineInstance({
	
	  'clone': function(date) {
	    return cloneDate(date);
	  }
	
	});
	
	module.exports = Sugar.Date.clone;

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.daysAgo;

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.daysFromNow;

/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    getDaysInMonth = __webpack_require__(46);
	
	Sugar.Date.defineInstance({
	
	  'daysInMonth': function(date) {
	    return getDaysInMonth(date);
	  }
	
	});
	
	module.exports = Sugar.Date.daysInMonth;

/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.daysSince;

/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.daysUntil;

/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.endOfDay;

/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    DateUnitIndexes = __webpack_require__(53),
	    getWeekday = __webpack_require__(77),
	    setWeekday = __webpack_require__(74),
	    moveToEndOfUnit = __webpack_require__(100);
	
	var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
	
	Sugar.Date.defineInstance({
	
	  'endOfISOWeek': function(date) {
	    if (getWeekday(date) !== 0) {
	      setWeekday(date, 7);
	    }
	    return moveToEndOfUnit(date, DAY_INDEX);
	  }
	
	});
	
	module.exports = Sugar.Date.endOfISOWeek;

/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.endOfMonth;

/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.endOfWeek;

/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.endOfYear;

/***/ },
/* 239 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    dateFormat = __webpack_require__(240);
	
	Sugar.Date.defineInstance({
	
	  'format': function(date, f, localeCode) {
	    return dateFormat(date, f, localeCode);
	  }
	
	});
	
	module.exports = Sugar.Date.format;

/***/ },
/* 240 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var CoreOutputFormats = __webpack_require__(241),
	    formattingTokens = __webpack_require__(242),
	    assertDateIsValid = __webpack_require__(257);
	
	var dateFormatMatcher = formattingTokens.dateFormatMatcher;
	
	function dateFormat(d, format, localeCode) {
	  assertDateIsValid(d);
	  format = CoreOutputFormats[format] || format || '{long}';
	  return dateFormatMatcher(format, d, localeCode);
	}
	
	module.exports = dateFormat;

/***/ },
/* 241 */
/***/ function(module, exports) {

	'use strict';
	
	var CoreOutputFormats = {
	  'ISO8601': '{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{SSS}{Z}',
	  'RFC1123': '{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {ZZ}',
	  'RFC1036': '{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {ZZ}'
	};
	
	module.exports = CoreOutputFormats;

/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LocaleHelpers = __webpack_require__(6),
	    FormatTokensBase = __webpack_require__(243),
	    CoreOutputFormats = __webpack_require__(241),
	    forEach = __webpack_require__(24),
	    padNumber = __webpack_require__(246),
	    spaceSplit = __webpack_require__(34),
	    namespaceAliases = __webpack_require__(83),
	    coreUtilityAliases = __webpack_require__(12),
	    createFormatMatcher = __webpack_require__(253),
	    defineInstanceSimilar = __webpack_require__(119);
	
	var localeManager = LocaleHelpers.localeManager,
	    hasOwn = coreUtilityAliases.hasOwn,
	    getOwn = coreUtilityAliases.getOwn,
	    forEachProperty = coreUtilityAliases.forEachProperty,
	    sugarDate = namespaceAliases.sugarDate;
	
	var ldmlTokens, strfTokens;
	
	function buildDateFormatTokens() {
	
	  function addFormats(target, tokens, fn) {
	    if (tokens) {
	      forEach(spaceSplit(tokens), function(token) {
	        target[token] = fn;
	      });
	    }
	  }
	
	  function buildLowercase(get) {
	    return function(d, localeCode) {
	      return get(d, localeCode).toLowerCase();
	    };
	  }
	
	  function buildOrdinal(get) {
	    return function(d, localeCode) {
	      var n = get(d, localeCode);
	      return n + localeManager.get(localeCode).getOrdinal(n);
	    };
	  }
	
	  function buildPadded(get, padding) {
	    return function(d, localeCode) {
	      return padNumber(get(d, localeCode), padding);
	    };
	  }
	
	  function buildTwoDigits(get) {
	    return function(d, localeCode) {
	      return get(d, localeCode) % 100;
	    };
	  }
	
	  function buildAlias(alias) {
	    return function(d, localeCode) {
	      return dateFormatMatcher(alias, d, localeCode);
	    };
	  }
	
	  function buildAlternates(f) {
	    for (var n = 1; n <= 5; n++) {
	      buildAlternate(f, n);
	    }
	  }
	
	  function buildAlternate(f, n) {
	    var alternate = function(d, localeCode) {
	      return f.get(d, localeCode, n);
	    };
	    addFormats(ldmlTokens, f.ldml + n, alternate);
	    if (f.lowerToken) {
	      ldmlTokens[f.lowerToken + n] = buildLowercase(alternate);
	    }
	  }
	
	  function getIdentityFormat(name) {
	    return function(d, localeCode) {
	      var loc = localeManager.get(localeCode);
	      return dateFormatMatcher(loc[name], d, localeCode);
	    };
	  }
	
	  ldmlTokens = {};
	  strfTokens = {};
	
	  forEach(FormatTokensBase, function(f) {
	    var get = f.get, getPadded;
	    if (f.lowerToken) {
	      ldmlTokens[f.lowerToken] = buildLowercase(get);
	    }
	    if (f.ordinalToken) {
	      ldmlTokens[f.ordinalToken] = buildOrdinal(get, f);
	    }
	    if (f.ldmlPaddedToken) {
	      ldmlTokens[f.ldmlPaddedToken] = buildPadded(get, f.ldmlPaddedToken.length);
	    }
	    if (f.ldmlTwoDigitToken) {
	      ldmlTokens[f.ldmlTwoDigitToken] = buildPadded(buildTwoDigits(get), 2);
	    }
	    if (f.strfTwoDigitToken) {
	      strfTokens[f.strfTwoDigitToken] = buildPadded(buildTwoDigits(get), 2);
	    }
	    if (f.strfPadding) {
	      getPadded = buildPadded(get, f.strfPadding);
	    }
	    if (f.alias) {
	      get = buildAlias(f.alias);
	    }
	    if (f.allowAlternates) {
	      buildAlternates(f);
	    }
	    addFormats(ldmlTokens, f.ldml, get);
	    addFormats(strfTokens, f.strf, getPadded || get);
	  });
	
	  forEachProperty(CoreOutputFormats, function(src, name) {
	    addFormats(ldmlTokens, name, buildAlias(src));
	  });
	
	  defineInstanceSimilar(sugarDate, 'short medium long full', function(methods, name) {
	    var fn = getIdentityFormat(name);
	    addFormats(ldmlTokens, name, fn);
	    methods[name] = fn;
	  });
	
	  addFormats(ldmlTokens, 'time', getIdentityFormat('time'));
	  addFormats(ldmlTokens, 'stamp', getIdentityFormat('stamp'));
	}
	
	var dateFormatMatcher;
	
	function buildDateFormatMatcher() {
	
	  function getLdml(d, token, localeCode) {
	    return getOwn(ldmlTokens, token)(d, localeCode);
	  }
	
	  function getStrf(d, token, localeCode) {
	    return getOwn(strfTokens, token)(d, localeCode);
	  }
	
	  function checkDateToken(ldml, strf) {
	    return hasOwn(ldmlTokens, ldml) || hasOwn(strfTokens, strf);
	  }
	
	  // Format matcher for LDML or STRF tokens.
	  dateFormatMatcher = createFormatMatcher(getLdml, getStrf, checkDateToken);
	}
	
	buildDateFormatTokens();
	
	buildDateFormatMatcher();
	
	module.exports = {
	  ldmlTokens: ldmlTokens,
	  strfTokens: strfTokens,
	  dateFormatMatcher: dateFormatMatcher
	};

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var TIMEZONE_ABBREVIATION_REG = __webpack_require__(244),
	    LocaleHelpers = __webpack_require__(6),
	    DateUnitIndexes = __webpack_require__(53),
	    trunc = __webpack_require__(60),
	    getDate = __webpack_require__(76),
	    getYear = __webpack_require__(47),
	    getHours = __webpack_require__(245),
	    getMonth = __webpack_require__(52),
	    cloneDate = __webpack_require__(92),
	    padNumber = __webpack_require__(246),
	    getWeekday = __webpack_require__(77),
	    callDateGet = __webpack_require__(48),
	    mathAliases = __webpack_require__(40),
	    getWeekYear = __webpack_require__(248),
	    getUTCOffset = __webpack_require__(250),
	    getDaysSince = __webpack_require__(251),
	    getWeekNumber = __webpack_require__(249),
	    getMeridiemToken = __webpack_require__(252),
	    setUnitAndLowerToEdge = __webpack_require__(70);
	
	var localeManager = LocaleHelpers.localeManager,
	    MONTH_INDEX = DateUnitIndexes.MONTH_INDEX,
	    ceil = mathAliases.ceil;
	
	var FormatTokensBase = [
	  {
	    ldml: 'Dow',
	    strf: 'a',
	    lowerToken: 'dow',
	    get: function(d, localeCode) {
	      return localeManager.get(localeCode).getWeekdayName(getWeekday(d), 2);
	    }
	  },
	  {
	    ldml: 'Weekday',
	    strf: 'A',
	    lowerToken: 'weekday',
	    allowAlternates: true,
	    get: function(d, localeCode, alternate) {
	      return localeManager.get(localeCode).getWeekdayName(getWeekday(d), alternate);
	    }
	  },
	  {
	    ldml: 'Mon',
	    strf: 'b h',
	    lowerToken: 'mon',
	    get: function(d, localeCode) {
	      return localeManager.get(localeCode).getMonthName(getMonth(d), 2);
	    }
	  },
	  {
	    ldml: 'Month',
	    strf: 'B',
	    lowerToken: 'month',
	    allowAlternates: true,
	    get: function(d, localeCode, alternate) {
	      return localeManager.get(localeCode).getMonthName(getMonth(d), alternate);
	    }
	  },
	  {
	    strf: 'C',
	    get: function(d) {
	      return getYear(d).toString().slice(0, 2);
	    }
	  },
	  {
	    ldml: 'd date day',
	    strf: 'd',
	    strfPadding: 2,
	    ldmlPaddedToken: 'dd',
	    ordinalToken: 'do',
	    get: function(d) {
	      return getDate(d);
	    }
	  },
	  {
	    strf: 'e',
	    get: function(d) {
	      return padNumber(getDate(d), 2, false, 10, ' ');
	    }
	  },
	  {
	    ldml: 'H 24hr',
	    strf: 'H',
	    strfPadding: 2,
	    ldmlPaddedToken: 'HH',
	    get: function(d) {
	      return getHours(d);
	    }
	  },
	  {
	    ldml: 'h hours 12hr',
	    strf: 'I',
	    strfPadding: 2,
	    ldmlPaddedToken: 'hh',
	    get: function(d) {
	      return getHours(d) % 12 || 12;
	    }
	  },
	  {
	    ldml: 'D',
	    strf: 'j',
	    strfPadding: 3,
	    ldmlPaddedToken: 'DDD',
	    get: function(d) {
	      var s = setUnitAndLowerToEdge(cloneDate(d), MONTH_INDEX);
	      return getDaysSince(d, s) + 1;
	    }
	  },
	  {
	    ldml: 'M',
	    strf: 'm',
	    strfPadding: 2,
	    ordinalToken: 'Mo',
	    ldmlPaddedToken: 'MM',
	    get: function(d) {
	      return getMonth(d) + 1;
	    }
	  },
	  {
	    ldml: 'm minutes',
	    strf: 'M',
	    strfPadding: 2,
	    ldmlPaddedToken: 'mm',
	    get: function(d) {
	      return callDateGet(d, 'Minutes');
	    }
	  },
	  {
	    ldml: 'Q',
	    get: function(d) {
	      return ceil((getMonth(d) + 1) / 3);
	    }
	  },
	  {
	    ldml: 'TT',
	    strf: 'p',
	    get: function(d, localeCode) {
	      return getMeridiemToken(d, localeCode);
	    }
	  },
	  {
	    ldml: 'tt',
	    strf: 'P',
	    get: function(d, localeCode) {
	      return getMeridiemToken(d, localeCode).toLowerCase();
	    }
	  },
	  {
	    ldml: 'T',
	    lowerToken: 't',
	    get: function(d, localeCode) {
	      return getMeridiemToken(d, localeCode).charAt(0);
	    }
	  },
	  {
	    ldml: 's seconds',
	    strf: 'S',
	    strfPadding: 2,
	    ldmlPaddedToken: 'ss',
	    get: function(d) {
	      return callDateGet(d, 'Seconds');
	    }
	  },
	  {
	    ldml: 'S ms',
	    strfPadding: 3,
	    ldmlPaddedToken: 'SSS',
	    get: function(d) {
	      return callDateGet(d, 'Milliseconds');
	    }
	  },
	  {
	    ldml: 'e',
	    strf: 'u',
	    ordinalToken: 'eo',
	    get: function(d) {
	      return getWeekday(d) || 7;
	    }
	  },
	  {
	    strf: 'U',
	    strfPadding: 2,
	    get: function(d) {
	      // Sunday first, 0-53
	      return getWeekNumber(d, false, 0);
	    }
	  },
	  {
	    ldml: 'W',
	    strf: 'V',
	    strfPadding: 2,
	    ordinalToken: 'Wo',
	    ldmlPaddedToken: 'WW',
	    get: function(d) {
	      // Monday first, 1-53 (ISO8601)
	      return getWeekNumber(d, true);
	    }
	  },
	  {
	    strf: 'w',
	    get: function(d) {
	      return getWeekday(d);
	    }
	  },
	  {
	    ldml: 'w',
	    ordinalToken: 'wo',
	    ldmlPaddedToken: 'ww',
	    get: function(d, localeCode) {
	      // Locale dependent, 1-53
	      var loc = localeManager.get(localeCode),
	          dow = loc.getFirstDayOfWeek(localeCode),
	          doy = loc.getFirstDayOfWeekYear(localeCode);
	      return getWeekNumber(d, true, dow, doy);
	    }
	  },
	  {
	    strf: 'W',
	    strfPadding: 2,
	    get: function(d) {
	      // Monday first, 0-53
	      return getWeekNumber(d, false);
	    }
	  },
	  {
	    ldmlPaddedToken: 'gggg',
	    ldmlTwoDigitToken: 'gg',
	    get: function(d, localeCode) {
	      return getWeekYear(d, localeCode);
	    }
	  },
	  {
	    strf: 'G',
	    strfPadding: 4,
	    strfTwoDigitToken: 'g',
	    ldmlPaddedToken: 'GGGG',
	    ldmlTwoDigitToken: 'GG',
	    get: function(d, localeCode) {
	      return getWeekYear(d, localeCode, true);
	    }
	  },
	  {
	    ldml: 'year',
	    ldmlPaddedToken: 'yyyy',
	    ldmlTwoDigitToken: 'yy',
	    strf: 'Y',
	    strfPadding: 4,
	    strfTwoDigitToken: 'y',
	    get: function(d) {
	      return getYear(d);
	    }
	  },
	  {
	    ldml: 'ZZ',
	    strf: 'z',
	    get: function(d) {
	      return getUTCOffset(d);
	    }
	  },
	  {
	    ldml: 'X',
	    get: function(d) {
	      return trunc(d.getTime() / 1000);
	    }
	  },
	  {
	    ldml: 'x',
	    get: function(d) {
	      return d.getTime();
	    }
	  },
	  {
	    ldml: 'Z',
	    get: function(d) {
	      return getUTCOffset(d, true);
	    }
	  },
	  {
	    ldml: 'z',
	    strf: 'Z',
	    get: function(d) {
	      // Note that this is not accurate in all browsing environments!
	      // https://github.com/moment/moment/issues/162
	      // It will continue to be supported for Node and usage with the
	      // understanding that it may be blank.
	      var match = d.toString().match(TIMEZONE_ABBREVIATION_REG);
	      return match ? match[1]: '';
	    }
	  },
	  {
	    strf: 'D',
	    alias: '%m/%d/%y'
	  },
	  {
	    strf: 'F',
	    alias: '%Y-%m-%d'
	  },
	  {
	    strf: 'r',
	    alias: '%I:%M:%S %p'
	  },
	  {
	    strf: 'R',
	    alias: '%H:%M'
	  },
	  {
	    strf: 'T',
	    alias: '%H:%M:%S'
	  },
	  {
	    strf: 'x',
	    alias: '{short}'
	  },
	  {
	    strf: 'X',
	    alias: '{time}'
	  },
	  {
	    strf: 'c',
	    alias: '{stamp}'
	  }
	];
	
	module.exports = FormatTokensBase;

/***/ },
/* 244 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = /(\w{3})[()\s\d]*$/;

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var callDateGet = __webpack_require__(48);
	
	function getHours(d) {
	  return callDateGet(d, 'Hours');
	}
	
	module.exports = getHours;

/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var mathAliases = __webpack_require__(40),
	    repeatString = __webpack_require__(247);
	
	var abs = mathAliases.abs;
	
	function padNumber(num, place, sign, base, replacement) {
	  var str = abs(num).toString(base || 10);
	  str = repeatString(replacement || '0', place - str.replace(/\.\d+/, '').length) + str;
	  if (sign || num < 0) {
	    str = (num < 0 ? '-' : '+') + str;
	  }
	  return str;
	}
	
	module.exports = padNumber;

/***/ },
/* 247 */
/***/ function(module, exports) {

	'use strict';
	
	function repeatString(str, num) {
	  var result = '';
	  str = str.toString();
	  while (num > 0) {
	    if (num & 1) {
	      result += str;
	    }
	    if (num >>= 1) {
	      str += str;
	    }
	  }
	  return result;
	}
	
	module.exports = repeatString;

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LocaleHelpers = __webpack_require__(6),
	    getYear = __webpack_require__(47),
	    getMonth = __webpack_require__(52),
	    getWeekNumber = __webpack_require__(249);
	
	var localeManager = LocaleHelpers.localeManager;
	
	function getWeekYear(d, localeCode, iso) {
	  var year, month, firstDayOfWeek, firstDayOfWeekYear, week, loc;
	  year = getYear(d);
	  month = getMonth(d);
	  if (month === 0 || month === 11) {
	    if (!iso) {
	      loc = localeManager.get(localeCode);
	      firstDayOfWeek = loc.getFirstDayOfWeek(localeCode);
	      firstDayOfWeekYear = loc.getFirstDayOfWeekYear(localeCode);
	    }
	    week = getWeekNumber(d, false, firstDayOfWeek, firstDayOfWeekYear);
	    if (month === 0 && week === 0) {
	      year -= 1;
	    } else if (month === 11 && week === 1) {
	      year += 1;
	    }
	  }
	  return year;
	}
	
	module.exports = getWeekYear;

/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ISODefaults = __webpack_require__(18),
	    setDate = __webpack_require__(75),
	    getDate = __webpack_require__(76),
	    cloneDate = __webpack_require__(92),
	    isUndefined = __webpack_require__(39),
	    moveToEndOfWeek = __webpack_require__(101),
	    moveToBeginningOfWeek = __webpack_require__(94),
	    moveToFirstDayOfWeekYear = __webpack_require__(93);
	
	var ISO_FIRST_DAY_OF_WEEK = ISODefaults.ISO_FIRST_DAY_OF_WEEK,
	    ISO_FIRST_DAY_OF_WEEK_YEAR = ISODefaults.ISO_FIRST_DAY_OF_WEEK_YEAR;
	
	function getWeekNumber(d, allowPrevious, firstDayOfWeek, firstDayOfWeekYear) {
	  var isoWeek, n = 0;
	  if (isUndefined(firstDayOfWeek)) {
	    firstDayOfWeek = ISO_FIRST_DAY_OF_WEEK;
	  }
	  if (isUndefined(firstDayOfWeekYear)) {
	    firstDayOfWeekYear = ISO_FIRST_DAY_OF_WEEK_YEAR;
	  }
	  // Moving to the end of the week allows for forward year traversal, ie
	  // Dec 29 2014 is actually week 01 of 2015.
	  isoWeek = moveToEndOfWeek(cloneDate(d), firstDayOfWeek);
	  moveToFirstDayOfWeekYear(isoWeek, firstDayOfWeek, firstDayOfWeekYear);
	  if (allowPrevious && d < isoWeek) {
	    // If the date is still before the start of the year, then it should be
	    // the last week of the previous year, ie Jan 1 2016 is actually week 53
	    // of 2015, so move to the beginning of the week to traverse the year.
	    isoWeek = moveToBeginningOfWeek(cloneDate(d), firstDayOfWeek);
	    moveToFirstDayOfWeekYear(isoWeek, firstDayOfWeek, firstDayOfWeekYear);
	  }
	  while (isoWeek <= d) {
	    // Doing a very simple walk to get the week number.
	    setDate(isoWeek, getDate(isoWeek) + 7);
	    n++;
	  }
	  return n;
	}
	
	module.exports = getWeekNumber;

/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _utc = __webpack_require__(49),
	    trunc = __webpack_require__(60),
	    tzOffset = __webpack_require__(68),
	    padNumber = __webpack_require__(246),
	    mathAliases = __webpack_require__(40);
	
	var abs = mathAliases.abs;
	
	function getUTCOffset(d, iso) {
	  var offset = _utc(d) ? 0 : tzOffset(d), hours, mins, colon;
	  colon  = iso === true ? ':' : '';
	  if (!offset && iso) return 'Z';
	  hours = padNumber(trunc(-offset / 60), 2, true);
	  mins = padNumber(abs(offset % 60), 2);
	  return  hours + colon + mins;
	}
	
	module.exports = getUTCOffset;

/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DateUnits = __webpack_require__(45),
	    DateUnitIndexes = __webpack_require__(53),
	    getTimeDistanceForUnit = __webpack_require__(210);
	
	var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
	
	function getDaysSince(d1, d2) {
	  return getTimeDistanceForUnit(d1, d2, DateUnits[DAY_INDEX]);
	}
	
	module.exports = getDaysSince;

/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LocaleHelpers = __webpack_require__(6),
	    trunc = __webpack_require__(60),
	    getHours = __webpack_require__(245);
	
	var localeManager = LocaleHelpers.localeManager;
	
	function getMeridiemToken(d, localeCode) {
	  var hours = getHours(d);
	  return localeManager.get(localeCode).ampm[trunc(hours / 12)] || '';
	}
	
	module.exports = getMeridiemToken;

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var STRING_FORMAT_REG = __webpack_require__(254),
	    CommonChars = __webpack_require__(30),
	    memoizeFunction = __webpack_require__(255);
	
	var OPEN_BRACE = CommonChars.OPEN_BRACE,
	    CLOSE_BRACE = CommonChars.CLOSE_BRACE;
	
	function createFormatMatcher(bracketMatcher, percentMatcher, precheck) {
	
	  var reg = STRING_FORMAT_REG;
	  var compileMemoized = memoizeFunction(compile);
	
	  function getToken(format, match) {
	    var get, token, literal, fn;
	    var bKey = match[2];
	    var pLit = match[3];
	    var pKey = match[5];
	    if (match[4] && percentMatcher) {
	      token = pKey;
	      get = percentMatcher;
	    } else if (bKey) {
	      token = bKey;
	      get = bracketMatcher;
	    } else if (pLit && percentMatcher) {
	      literal = pLit;
	    } else {
	      literal = match[1] || match[0];
	    }
	    if (get) {
	      assertPassesPrecheck(precheck, bKey, pKey);
	      fn = function(obj, opt) {
	        return get(obj, token, opt);
	      };
	    }
	    format.push(fn || getLiteral(literal));
	  }
	
	  function getSubstring(format, str, start, end) {
	    if (end > start) {
	      var sub = str.slice(start, end);
	      assertNoUnmatched(sub, OPEN_BRACE);
	      assertNoUnmatched(sub, CLOSE_BRACE);
	      format.push(function() {
	        return sub;
	      });
	    }
	  }
	
	  function getLiteral(str) {
	    return function() {
	      return str;
	    };
	  }
	
	  function assertPassesPrecheck(precheck, bt, pt) {
	    if (precheck && !precheck(bt, pt)) {
	      throw new TypeError('Invalid token '+ (bt || pt) +' in format string');
	    }
	  }
	
	  function assertNoUnmatched(str, chr) {
	    if (str.indexOf(chr) !== -1) {
	      throw new TypeError('Unmatched '+ chr +' in format string');
	    }
	  }
	
	  function compile(str) {
	    var format = [], lastIndex = 0, match;
	    reg.lastIndex = 0;
	    while(match = reg.exec(str)) {
	      getSubstring(format, str, lastIndex, match.index);
	      getToken(format, match);
	      lastIndex = reg.lastIndex;
	    }
	    getSubstring(format, str, lastIndex, str.length);
	    return format;
	  }
	
	  return function(str, obj, opt) {
	    var format = compileMemoized(str), result = '';
	    for (var i = 0; i < format.length; i++) {
	      result += format[i](obj, opt);
	    }
	    return result;
	  };
	}
	
	module.exports = createFormatMatcher;

/***/ },
/* 254 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = /([{}])\1|\{([^}]*)\}|(%)%|(%(\w*))/g;

/***/ },
/* 255 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var INTERNAL_MEMOIZE_LIMIT = __webpack_require__(256),
	    coreUtilityAliases = __webpack_require__(12);
	
	var hasOwn = coreUtilityAliases.hasOwn;
	
	function memoizeFunction(fn) {
	  var memo = {}, counter = 0;
	
	  return function(key) {
	    if (hasOwn(memo, key)) {
	      return memo[key];
	    }
	    if (counter === INTERNAL_MEMOIZE_LIMIT) {
	      memo = {};
	      counter = 0;
	    }
	    counter++;
	    return memo[key] = fn(key);
	  };
	}
	
	module.exports = memoizeFunction;

/***/ },
/* 256 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = 1000;

/***/ },
/* 257 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var dateIsValid = __webpack_require__(207);
	
	function assertDateIsValid(d) {
	  if (!dateIsValid(d)) {
	    throw new TypeError('Date is not valid');
	  }
	}
	
	module.exports = assertDateIsValid;

/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    createDateWithContext = __webpack_require__(209);
	
	Sugar.Date.defineInstance({
	
	  'get': function(date, d, options) {
	    return createDateWithContext(date, d, options);
	  }
	
	});
	
	module.exports = Sugar.Date.get;

/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    getWeekNumber = __webpack_require__(249);
	
	Sugar.Date.defineInstance({
	
	  'getISOWeek': function(date) {
	    return getWeekNumber(date, true);
	  }
	
	});
	
	module.exports = Sugar.Date.getISOWeek;

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    getUTCOffset = __webpack_require__(250);
	
	Sugar.Date.defineInstance({
	
	  'getUTCOffset': function(date, iso) {
	    return getUTCOffset(date, iso);
	  }
	
	});
	
	module.exports = Sugar.Date.getUTCOffset;

/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	Sugar.Date.defineInstance({
	
	  'getUTCWeekday': function(date) {
	    return date.getUTCDay();
	  }
	
	});
	
	module.exports = Sugar.Date.getUTCWeekday;

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    getWeekday = __webpack_require__(77);
	
	Sugar.Date.defineInstance({
	
	  'getWeekday': function(date) {
	    return getWeekday(date);
	  }
	
	});
	
	module.exports = Sugar.Date.getWeekday;

/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.hoursAgo;

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.hoursFromNow;

/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.hoursSince;

/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.hoursUntil;

/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    fullCompareDate = __webpack_require__(268);
	
	Sugar.Date.defineInstance({
	
	  'is': function(date, d, margin) {
	    return fullCompareDate(date, d, margin);
	  }
	
	});
	
	module.exports = Sugar.Date.is;

/***/ },
/* 268 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LocaleHelpers = __webpack_require__(6),
	    trim = __webpack_require__(269),
	    getMonth = __webpack_require__(52),
	    isDefined = __webpack_require__(28),
	    getNewDate = __webpack_require__(79),
	    compareDay = __webpack_require__(270),
	    getWeekday = __webpack_require__(77),
	    dateIsValid = __webpack_require__(207),
	    classChecks = __webpack_require__(31),
	    compareDate = __webpack_require__(206);
	
	var isString = classChecks.isString,
	    English = LocaleHelpers.English;
	
	function fullCompareDate(date, d, margin) {
	  var tmp;
	  if (!dateIsValid(date)) return;
	  if (isString(d)) {
	    d = trim(d).toLowerCase();
	    switch(true) {
	      case d === 'future':    return date.getTime() > getNewDate().getTime();
	      case d === 'past':      return date.getTime() < getNewDate().getTime();
	      case d === 'today':     return compareDay(date);
	      case d === 'tomorrow':  return compareDay(date,  1);
	      case d === 'yesterday': return compareDay(date, -1);
	      case d === 'weekday':   return getWeekday(date) > 0 && getWeekday(date) < 6;
	      case d === 'weekend':   return getWeekday(date) === 0 || getWeekday(date) === 6;
	
	      case (isDefined(tmp = English.weekdayMap[d])):
	        return getWeekday(date) === tmp;
	      case (isDefined(tmp = English.monthMap[d])):
	        return getMonth(date) === tmp;
	    }
	  }
	  return compareDate(date, d, margin);
	}
	
	module.exports = fullCompareDate;

/***/ },
/* 269 */
/***/ function(module, exports) {

	'use strict';
	
	function trim(str) {
	  return str.trim();
	}
	
	module.exports = trim;

/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var setDate = __webpack_require__(75),
	    getDate = __webpack_require__(76),
	    getYear = __webpack_require__(47),
	    getMonth = __webpack_require__(52),
	    getNewDate = __webpack_require__(79);
	
	function compareDay(d, shift) {
	  var comp = getNewDate();
	  if (shift) {
	    setDate(comp, getDate(comp) + shift);
	  }
	  return getYear(d) === getYear(comp) &&
	         getMonth(d) === getMonth(comp) &&
	         getDate(d) === getDate(comp);
	}
	
	module.exports = compareDay;

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    createDate = __webpack_require__(65);
	
	Sugar.Date.defineInstance({
	
	  'isAfter': function(date, d, margin) {
	    return date.getTime() > createDate(d).getTime() - (margin || 0);
	  }
	
	});
	
	module.exports = Sugar.Date.isAfter;

/***/ },
/* 272 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    createDate = __webpack_require__(65);
	
	Sugar.Date.defineInstance({
	
	  'isBefore': function(date, d, margin) {
	    return date.getTime() < createDate(d).getTime() + (margin || 0);
	  }
	
	});
	
	module.exports = Sugar.Date.isBefore;

/***/ },
/* 273 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    createDate = __webpack_require__(65),
	    mathAliases = __webpack_require__(40);
	
	var min = mathAliases.min,
	    max = mathAliases.max;
	
	Sugar.Date.defineInstance({
	
	  'isBetween': function(date, d1, d2, margin) {
	    var t  = date.getTime();
	    var t1 = createDate(d1).getTime();
	    var t2 = createDate(d2).getTime();
	    var lo = min(t1, t2);
	    var hi = max(t1, t2);
	    margin = margin || 0;
	    return (lo - margin <= t) && (hi + margin >= t);
	  }
	
	});
	
	module.exports = Sugar.Date.isBetween;

/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isFriday;

/***/ },
/* 275 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var buildRelativeAliases = __webpack_require__(276);
	
	buildRelativeAliases();

/***/ },
/* 276 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LocaleHelpers = __webpack_require__(6),
	    spaceSplit = __webpack_require__(34),
	    fullCompareDate = __webpack_require__(268),
	    namespaceAliases = __webpack_require__(83),
	    defineInstanceSimilar = __webpack_require__(119);
	
	var English = LocaleHelpers.English,
	    sugarDate = namespaceAliases.sugarDate;
	
	function buildRelativeAliases() {
	  var special  = spaceSplit('Today Yesterday Tomorrow Weekday Weekend Future Past');
	  var weekdays = English.weekdays.slice(0, 7);
	  var months   = English.months.slice(0, 12);
	  var together = special.concat(weekdays).concat(months);
	  defineInstanceSimilar(sugarDate, together, function(methods, name) {
	    methods['is'+ name] = function(d) {
	      return fullCompareDate(d, name);
	    };
	  });
	}
	
	module.exports = buildRelativeAliases;

/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isFuture;

/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.isLastMonth;

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.isLastWeek;

/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.isLastYear;

/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    getYear = __webpack_require__(47);
	
	Sugar.Date.defineInstance({
	
	  'isLeapYear': function(date) {
	    var year = getYear(date);
	    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
	  }
	
	});
	
	module.exports = Sugar.Date.isLeapYear;

/***/ },
/* 282 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isMonday;

/***/ },
/* 283 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.isNextMonth;

/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.isNextWeek;

/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.isNextYear;

/***/ },
/* 286 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isPast;

/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isSaturday;

/***/ },
/* 288 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isSunday;

/***/ },
/* 289 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.isThisMonth;

/***/ },
/* 290 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.isThisWeek;

/***/ },
/* 291 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.isThisYear;

/***/ },
/* 292 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isThursday;

/***/ },
/* 293 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isToday;

/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isTomorrow;

/***/ },
/* 295 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isTuesday;

/***/ },
/* 296 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    isUTC = __webpack_require__(297);
	
	Sugar.Date.defineInstance({
	
	  'isUTC': function(date) {
	    return isUTC(date);
	  }
	
	});
	
	module.exports = Sugar.Date.isUTC;

/***/ },
/* 297 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _utc = __webpack_require__(49),
	    tzOffset = __webpack_require__(68);
	
	function isUTC(d) {
	  return !!_utc(d) || tzOffset(d) === 0;
	}
	
	module.exports = isUTC;

/***/ },
/* 298 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    dateIsValid = __webpack_require__(207);
	
	Sugar.Date.defineInstance({
	
	  'isValid': function(date) {
	    return dateIsValid(date);
	  }
	
	});
	
	module.exports = Sugar.Date.isValid;

/***/ },
/* 299 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isWednesday;

/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isWeekday;

/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isWeekend;

/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(275);
	
	module.exports = Sugar.Date.isYesterday;

/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	Sugar.Date.defineInstance({
	
	  'iso': function(date) {
	    return date.toISOString();
	  }
	
	});
	
	module.exports = Sugar.Date.iso;

/***/ },
/* 304 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.millisecondsAgo;

/***/ },
/* 305 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.millisecondsFromNow;

/***/ },
/* 306 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.millisecondsSince;

/***/ },
/* 307 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.millisecondsUntil;

/***/ },
/* 308 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.minutesAgo;

/***/ },
/* 309 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.minutesFromNow;

/***/ },
/* 310 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.minutesSince;

/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.minutesUntil;

/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.monthsAgo;

/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.monthsFromNow;

/***/ },
/* 314 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.monthsSince;

/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.monthsUntil;

/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    dateRelative = __webpack_require__(317);
	
	Sugar.Date.defineInstance({
	
	  'relative': function(date, localeCode, fn) {
	    return dateRelative(date, null, localeCode, fn);
	  }
	
	});
	
	module.exports = Sugar.Date.relative;

/***/ },
/* 317 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var LocaleHelpers = __webpack_require__(6),
	    dateFormat = __webpack_require__(240),
	    classChecks = __webpack_require__(31),
	    assertDateIsValid = __webpack_require__(257),
	    getAdjustedUnitForDate = __webpack_require__(318);
	
	var isFunction = classChecks.isFunction,
	    localeManager = LocaleHelpers.localeManager;
	
	function dateRelative(d, dRelative, arg1, arg2) {
	  var adu, format, type, localeCode, fn;
	  assertDateIsValid(d);
	  if (isFunction(arg1)) {
	    fn = arg1;
	  } else {
	    localeCode = arg1;
	    fn = arg2;
	  }
	  adu = getAdjustedUnitForDate(d, dRelative);
	  if (fn) {
	    format = fn.apply(d, adu.concat(localeManager.get(localeCode)));
	    if (format) {
	      return dateFormat(d, format, localeCode);
	    }
	  }
	  // Adjust up if time is in ms, as this doesn't
	  // look very good for a standard relative date.
	  if (adu[1] === 0) {
	    adu[1] = 1;
	    adu[0] = 1;
	  }
	  if (dRelative) {
	    type = 'duration';
	  } else if (adu[2] > 0) {
	    type = 'future';
	  } else {
	    type = 'past';
	  }
	  return localeManager.get(localeCode).getRelativeFormat(adu, type);
	}
	
	module.exports = dateRelative;

/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var getNewDate = __webpack_require__(79),
	    mathAliases = __webpack_require__(40),
	    getAdjustedUnit = __webpack_require__(62),
	    getTimeDistanceForUnit = __webpack_require__(210);
	
	var abs = mathAliases.abs;
	
	function getAdjustedUnitForDate(d, dRelative) {
	  var ms;
	  if (!dRelative) {
	    dRelative = getNewDate();
	    if (d > dRelative) {
	      // If our date is greater than the one that we got from getNewDate, it
	      // means that we are finding the unit for a date that is in the future
	      // relative to now. However, often the incoming date was created in
	      // the same cycle as our comparison, but our "now" date will have been
	      // created an instant after it, creating situations where "5 minutes from
	      // now" becomes "4 minutes from now" in the same tick. To prevent this,
	      // subtract a buffer of 10ms to compensate.
	      dRelative = new Date(dRelative.getTime() - 10);
	    }
	  }
	  ms = d - dRelative;
	  return getAdjustedUnit(ms, function(u) {
	    return abs(getTimeDistanceForUnit(d, dRelative, u));
	  });
	}
	
	module.exports = getAdjustedUnitForDate;

/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    createDate = __webpack_require__(65),
	    dateRelative = __webpack_require__(317);
	
	Sugar.Date.defineInstance({
	
	  'relativeTo': function(date, d, localeCode) {
	    return dateRelative(date, createDate(d), localeCode);
	  }
	
	});
	
	module.exports = Sugar.Date.relativeTo;

/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    DateUnitIndexes = __webpack_require__(53),
	    moveToBeginningOfUnit = __webpack_require__(104),
	    getUnitIndexForParamName = __webpack_require__(321);
	
	var DAY_INDEX = DateUnitIndexes.DAY_INDEX;
	
	Sugar.Date.defineInstance({
	
	  'reset': function(date, unit, localeCode) {
	    var unitIndex = unit ? getUnitIndexForParamName(unit) : DAY_INDEX;
	    moveToBeginningOfUnit(date, unitIndex, localeCode);
	    return date;
	  }
	
	});
	
	module.exports = Sugar.Date.reset;

/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var iterateOverDateParams = __webpack_require__(95);
	
	function getUnitIndexForParamName(name) {
	  var params = {}, unitIndex;
	  params[name] = 1;
	  iterateOverDateParams(params, function(name, val, unit, i) {
	    unitIndex = i;
	    return false;
	  });
	  return unitIndex;
	}
	
	module.exports = getUnitIndexForParamName;

/***/ },
/* 322 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    advanceDateWithArgs = __webpack_require__(219);
	
	Sugar.Date.defineInstanceWithArguments({
	
	  'rewind': function(d, args) {
	    return advanceDateWithArgs(d, args, -1);
	  }
	
	});
	
	module.exports = Sugar.Date.rewind;

/***/ },
/* 323 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.secondsAgo;

/***/ },
/* 324 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.secondsFromNow;

/***/ },
/* 325 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.secondsSince;

/***/ },
/* 326 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.secondsUntil;

/***/ },
/* 327 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    updateDate = __webpack_require__(78),
	    collectDateArguments = __webpack_require__(220);
	
	Sugar.Date.defineInstanceWithArguments({
	
	  'set': function(d, args) {
	    args = collectDateArguments(args);
	    return updateDate(d, args[0], args[1]);
	  }
	
	});
	
	module.exports = Sugar.Date.set;

/***/ },
/* 328 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    setISOWeekNumber = __webpack_require__(89);
	
	Sugar.Date.defineInstance({
	
	  'setISOWeek': function(date, num) {
	    return setISOWeekNumber(date, num);
	  }
	
	});
	
	module.exports = Sugar.Date.setISOWeek;

/***/ },
/* 329 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    _utc = __webpack_require__(49);
	
	Sugar.Date.defineInstance({
	
	  'setUTC': function(date, on) {
	    return _utc(date, on);
	  }
	
	});
	
	module.exports = Sugar.Date.setUTC;

/***/ },
/* 330 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    setWeekday = __webpack_require__(74);
	
	Sugar.Date.defineInstance({
	
	  'setWeekday': function(date, dow) {
	    return setWeekday(date, dow);
	  }
	
	});
	
	module.exports = Sugar.Date.setWeekday;

/***/ },
/* 331 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.weeksAgo;

/***/ },
/* 332 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.weeksFromNow;

/***/ },
/* 333 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.weeksSince;

/***/ },
/* 334 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.weeksUntil;

/***/ },
/* 335 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.yearsAgo;

/***/ },
/* 336 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.yearsFromNow;

/***/ },
/* 337 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.yearsSince;

/***/ },
/* 338 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5);
	
	__webpack_require__(204);
	
	module.exports = Sugar.Date.yearsUntil;

/***/ },
/* 339 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    _dateOptions = __webpack_require__(80);
	
	module.exports = Sugar.Date.getOption;

/***/ },
/* 340 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    _dateOptions = __webpack_require__(80);
	
	module.exports = Sugar.Date.setOption;

/***/ },
/* 341 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// Static Methods
	__webpack_require__(342);
	
	// Prototype Methods
	__webpack_require__(356);
	__webpack_require__(359);
	__webpack_require__(360);
	__webpack_require__(361);
	__webpack_require__(373);
	__webpack_require__(374);
	__webpack_require__(375);
	__webpack_require__(376);
	__webpack_require__(377);
	__webpack_require__(378);
	__webpack_require__(379);
	__webpack_require__(380);
	__webpack_require__(381);
	__webpack_require__(383);
	__webpack_require__(384);
	__webpack_require__(385);
	__webpack_require__(386);
	__webpack_require__(387);
	
	module.exports = __webpack_require__(5);

/***/ },
/* 342 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Sugar = __webpack_require__(5),
	    DateRangeConstructor = __webpack_require__(343);
	
	Sugar.Date.defineStatic({
	
	  'range': DateRangeConstructor
	
	});
	
	module.exports = Sugar.Date.range;

/***/ },
/* 343 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    classChecks = __webpack_require__(31),
	    getDateForRange = __webpack_require__(347),
	    createDateRangeFromString = __webpack_require__(348);
	
	var isString = classChecks.isString;
	
	var DateRangeConstructor = function(start, end) {
	  if (arguments.length === 1 && isString(start)) {
	    return createDateRangeFromString(start);
	  }
	  return new Range(getDateForRange(start), getDateForRange(end));
	};
	
	module.exports = DateRangeConstructor;

/***/ },
/* 344 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var cloneRangeMember = __webpack_require__(345);
	
	function Range(start, end) {
	  this.start = cloneRangeMember(start);
	  this.end   = cloneRangeMember(end);
	}
	
	module.exports = Range;

/***/ },
/* 345 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classChecks = __webpack_require__(31),
	    getRangeMemberPrimitiveValue = __webpack_require__(346);
	
	var isDate = classChecks.isDate;
	
	function cloneRangeMember(m) {
	  if (isDate(m)) {
	    return new Date(m.getTime());
	  } else {
	    return getRangeMemberPrimitiveValue(m);
	  }
	}
	
	module.exports = cloneRangeMember;

/***/ },
/* 346 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classChecks = __webpack_require__(31);
	
	var isDate = classChecks.isDate;
	
	function getRangeMemberPrimitiveValue(m) {
	  if (m == null) return m;
	  return isDate(m) ? m.getTime() : m.valueOf();
	}
	
	module.exports = getRangeMemberPrimitiveValue;

/***/ },
/* 347 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classChecks = __webpack_require__(31),
	    namespaceAliases = __webpack_require__(83);
	
	var isDate = classChecks.isDate,
	    sugarDate = namespaceAliases.sugarDate;
	
	function getDateForRange(d) {
	  if (isDate(d)) {
	    return d;
	  } else if (d == null) {
	    return new Date();
	  } else if (sugarDate.create) {
	    return sugarDate.create(d);
	  }
	  return new Date(d);
	}
	
	module.exports = getDateForRange;

/***/ },
/* 348 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    DurationTextFormats = __webpack_require__(349),
	    incrementDate = __webpack_require__(352),
	    getDateForRange = __webpack_require__(347),
	    namespaceAliases = __webpack_require__(83),
	    getDateIncrementObject = __webpack_require__(354);
	
	var sugarDate = namespaceAliases.sugarDate,
	    RANGE_REG_FROM_TO = DurationTextFormats.RANGE_REG_FROM_TO,
	    RANGE_REG_REAR_DURATION = DurationTextFormats.RANGE_REG_REAR_DURATION,
	    RANGE_REG_FRONT_DURATION = DurationTextFormats.RANGE_REG_FRONT_DURATION;
	
	function createDateRangeFromString(str) {
	  var match, datetime, duration, dio, start, end;
	  if (sugarDate.get && (match = str.match(RANGE_REG_FROM_TO))) {
	    start = getDateForRange(match[1].replace('from', 'at'));
	    end = sugarDate.get(start, match[2]);
	    return new Range(start, end);
	  }
	  if (match = str.match(RANGE_REG_FRONT_DURATION)) {
	    duration = match[1];
	    datetime = match[2];
	  }
	  if (match = str.match(RANGE_REG_REAR_DURATION)) {
	    datetime = match[1];
	    duration = match[2];
	  }
	  if (datetime && duration) {
	    start = getDateForRange(datetime);
	    dio = getDateIncrementObject(duration);
	    end = incrementDate(start, dio[0], dio[1]);
	  } else {
	    start = str;
	  }
	  return new Range(getDateForRange(start), getDateForRange(end));
	}
	
	module.exports = createDateRangeFromString;

/***/ },
/* 349 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var FULL_CAPTURED_DURATION = __webpack_require__(350);
	
	module.exports = {
	  RANGE_REG_FROM_TO: /(?:from)?\s*(.+)\s+(?:to|until)\s+(.+)$/i,
	  RANGE_REG_REAR_DURATION: RegExp('(.+)\\s*for\\s*' + FULL_CAPTURED_DURATION, 'i'),
	  RANGE_REG_FRONT_DURATION: RegExp('(?:for)?\\s*'+ FULL_CAPTURED_DURATION +'\\s*(?:starting)?\\s*at\\s*(.+)', 'i')
	};

/***/ },
/* 350 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DURATION_UNITS = __webpack_require__(351);
	
	module.exports = '((?:\\d+)?\\s*(?:' + DURATION_UNITS + '))s?';

/***/ },
/* 351 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = 'year|month|week|day|hour|minute|second|millisecond';

/***/ },
/* 352 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var MULTIPLIERS = __webpack_require__(353),
	    callDateSet = __webpack_require__(71),
	    callDateGet = __webpack_require__(48);
	
	function incrementDate(src, amount, unit) {
	  var mult = MULTIPLIERS[unit], d;
	  if (mult) {
	    d = new Date(src.getTime() + (amount * mult));
	  } else {
	    d = new Date(src);
	    callDateSet(d, unit, callDateGet(src, unit) + amount);
	  }
	  return d;
	}
	
	module.exports = incrementDate;

/***/ },
/* 353 */
/***/ function(module, exports) {

	'use strict';
	
	var MULTIPLIERS = {
	  'Hours': 60 * 60 * 1000,
	  'Minutes': 60 * 1000,
	  'Seconds': 1000,
	  'Milliseconds': 1
	};
	
	module.exports = MULTIPLIERS;

/***/ },
/* 354 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DURATION_REG = __webpack_require__(355),
	    classChecks = __webpack_require__(31),
	    simpleCapitalize = __webpack_require__(208);
	
	var isNumber = classChecks.isNumber;
	
	function getDateIncrementObject(amt) {
	  var match, val, unit;
	  if (isNumber(amt)) {
	    return [amt, 'Milliseconds'];
	  }
	  match = amt.match(DURATION_REG);
	  val = +match[1] || 1;
	  unit = simpleCapitalize(match[2].toLowerCase());
	  if (unit.match(/hour|minute|second/i)) {
	    unit += 's';
	  } else if (unit === 'Year') {
	    unit = 'FullYear';
	  } else if (unit === 'Week') {
	    unit = 'Date';
	    val *= 7;
	  } else if (unit === 'Day') {
	    unit = 'Date';
	  }
	  return [val, unit];
	}
	
	module.exports = getDateIncrementObject;

/***/ },
/* 355 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var DURATION_UNITS = __webpack_require__(351);
	
	module.exports = RegExp('(\\d+)?\\s*('+ DURATION_UNITS +')s?', 'i');

/***/ },
/* 356 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    rangeClamp = __webpack_require__(357),
	    defineOnPrototype = __webpack_require__(358);
	
	defineOnPrototype(Range, {
	
	  'clamp': function(el) {
	    return rangeClamp(this, el);
	  }
	
	});
	
	// This package does not export anything as it is
	// simply defining "clamp" on Range.prototype.

/***/ },
/* 357 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var cloneRangeMember = __webpack_require__(345);
	
	function rangeClamp(range, obj) {
	  var clamped,
	      start = range.start,
	      end = range.end,
	      min = end < start ? end : start,
	      max = start > end ? start : end;
	  if (obj < min) {
	    clamped = min;
	  } else if (obj > max) {
	    clamped = max;
	  } else {
	    clamped = obj;
	  }
	  return cloneRangeMember(clamped);
	}
	
	module.exports = rangeClamp;

/***/ },
/* 358 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var coreUtilityAliases = __webpack_require__(12);
	
	var forEachProperty = coreUtilityAliases.forEachProperty;
	
	function defineOnPrototype(ctor, methods) {
	  var proto = ctor.prototype;
	  forEachProperty(methods, function(val, key) {
	    proto[key] = val;
	  });
	}
	
	module.exports = defineOnPrototype;

/***/ },
/* 359 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    defineOnPrototype = __webpack_require__(358);
	
	defineOnPrototype(Range, {
	
	  'clone': function() {
	    return new Range(this.start, this.end);
	  }
	
	});
	
	// This package does not export anything as it is
	// simply defining "clone" on Range.prototype.

/***/ },
/* 360 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    defineOnPrototype = __webpack_require__(358);
	
	defineOnPrototype(Range, {
	
	  'contains': function(el) {
	    if (el == null) return false;
	    if (el.start && el.end) {
	      return el.start >= this.start && el.start <= this.end &&
	             el.end   >= this.start && el.end   <= this.end;
	    } else {
	      return el >= this.start && el <= this.end;
	    }
	  }
	
	});
	
	// This package does not export anything as it is
	// simply defining "contains" on Range.prototype.

/***/ },
/* 361 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(362);
	
	// This package does not export anything as it is
	// simply defining "days" on Range.prototype.

/***/ },
/* 362 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var buildDateRangeUnits = __webpack_require__(363);
	
	buildDateRangeUnits();

/***/ },
/* 363 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var MULTIPLIERS = __webpack_require__(353),
	    DURATION_UNITS = __webpack_require__(351),
	    Range = __webpack_require__(344),
	    trunc = __webpack_require__(60),
	    forEach = __webpack_require__(24),
	    rangeEvery = __webpack_require__(364),
	    simpleCapitalize = __webpack_require__(208),
	    defineOnPrototype = __webpack_require__(358);
	
	function buildDateRangeUnits() {
	  var methods = {};
	  forEach(DURATION_UNITS.split('|'), function(unit, i) {
	    var name = unit + 's', mult, fn;
	    if (i < 4) {
	      fn = function() {
	        return rangeEvery(this, unit, true);
	      };
	    } else {
	      mult = MULTIPLIERS[simpleCapitalize(name)];
	      fn = function() {
	        return trunc((this.end - this.start) / mult);
	      };
	    }
	    methods[name] = fn;
	  });
	  defineOnPrototype(Range, methods);
	}
	
	module.exports = buildDateRangeUnits;

/***/ },
/* 364 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classChecks = __webpack_require__(31),
	    rangeIsValid = __webpack_require__(365),
	    incrementDate = __webpack_require__(352),
	    incrementNumber = __webpack_require__(368),
	    incrementString = __webpack_require__(369),
	    getGreaterPrecision = __webpack_require__(370),
	    getDateIncrementObject = __webpack_require__(354);
	
	var isNumber = classChecks.isNumber,
	    isString = classChecks.isString,
	    isDate = classChecks.isDate,
	    isFunction = classChecks.isFunction;
	
	function rangeEvery(range, step, countOnly, fn) {
	  var increment,
	      precision,
	      dio,
	      unit,
	      start   = range.start,
	      end     = range.end,
	      inverse = end < start,
	      current = start,
	      index   = 0,
	      result  = [];
	
	  if (!rangeIsValid(range)) {
	    return [];
	  }
	  if (isFunction(step)) {
	    fn = step;
	    step = null;
	  }
	  step = step || 1;
	  if (isNumber(start)) {
	    precision = getGreaterPrecision(start, step);
	    increment = function() {
	      return incrementNumber(current, step, precision);
	    };
	  } else if (isString(start)) {
	    increment = function() {
	      return incrementString(current, step);
	    };
	  } else if (isDate(start)) {
	    dio  = getDateIncrementObject(step);
	    step = dio[0];
	    unit = dio[1];
	    increment = function() {
	      return incrementDate(current, step, unit);
	    };
	  }
	  // Avoiding infinite loops
	  if (inverse && step > 0) {
	    step *= -1;
	  }
	  while(inverse ? current >= end : current <= end) {
	    if (!countOnly) {
	      result.push(current);
	    }
	    if (fn) {
	      fn(current, index, range);
	    }
	    current = increment();
	    index++;
	  }
	  return countOnly ? index - 1 : result;
	}
	
	module.exports = rangeEvery;

/***/ },
/* 365 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isValidRangeMember = __webpack_require__(366);
	
	function rangeIsValid(range) {
	  return isValidRangeMember(range.start) &&
	         isValidRangeMember(range.end) &&
	         typeof range.start === typeof range.end;
	}
	
	module.exports = rangeIsValid;

/***/ },
/* 366 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var valueIsNotInfinite = __webpack_require__(367),
	    getRangeMemberPrimitiveValue = __webpack_require__(346);
	
	function isValidRangeMember(m) {
	  var val = getRangeMemberPrimitiveValue(m);
	  return (!!val || val === 0) && valueIsNotInfinite(m);
	}
	
	module.exports = isValidRangeMember;

/***/ },
/* 367 */
/***/ function(module, exports) {

	'use strict';
	
	function valueIsNotInfinite(m) {
	  return m !== -Infinity && m !== Infinity;
	}
	
	module.exports = valueIsNotInfinite;

/***/ },
/* 368 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var withPrecision = __webpack_require__(61);
	
	function incrementNumber(current, amount, precision) {
	  return withPrecision(current + amount, precision);
	}
	
	module.exports = incrementNumber;

/***/ },
/* 369 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var chr = __webpack_require__(57);
	
	function incrementString(current, amount) {
	  return chr(current.charCodeAt(0) + amount);
	}
	
	module.exports = incrementString;

/***/ },
/* 370 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var mathAliases = __webpack_require__(40),
	    getPrecision = __webpack_require__(371);
	
	var max = mathAliases.max;
	
	function getGreaterPrecision(n1, n2) {
	  return max(getPrecision(n1), getPrecision(n2));
	}
	
	module.exports = getGreaterPrecision;

/***/ },
/* 371 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var periodSplit = __webpack_require__(372);
	
	function getPrecision(n) {
	  var split = periodSplit(n.toString());
	  return split[1] ? split[1].length : 0;
	}
	
	module.exports = getPrecision;

/***/ },
/* 372 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var CommonChars = __webpack_require__(30);
	
	var HALF_WIDTH_PERIOD = CommonChars.HALF_WIDTH_PERIOD;
	
	function periodSplit(str) {
	  return str.split(HALF_WIDTH_PERIOD);
	}
	
	module.exports = periodSplit;

/***/ },
/* 373 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    rangeEvery = __webpack_require__(364),
	    defineOnPrototype = __webpack_require__(358);
	
	defineOnPrototype(Range, {
	
	  'every': function(amount, fn) {
	    return rangeEvery(this, amount, false, fn);
	  }
	
	});
	
	// This package does not export anything as it is
	// simply defining "every" on Range.prototype.

/***/ },
/* 374 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(362);
	
	// This package does not export anything as it is
	// simply defining "hours" on Range.prototype.

/***/ },
/* 375 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    defineOnPrototype = __webpack_require__(358);
	
	defineOnPrototype(Range, {
	
	  'intersect': function(range) {
	    if (range.start > this.end || range.end < this.start) {
	      return new Range(NaN, NaN);
	    }
	    return new Range(
	      this.start > range.start ? this.start : range.start,
	      this.end   < range.end   ? this.end   : range.end
	    );
	  }
	
	});
	
	// This package does not export anything as it is
	// simply defining "intersect" on Range.prototype.

/***/ },
/* 376 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    rangeIsValid = __webpack_require__(365),
	    defineOnPrototype = __webpack_require__(358);
	
	defineOnPrototype(Range, {
	
	  'isValid': function() {
	    return rangeIsValid(this);
	  }
	
	});
	
	// This package does not export anything as it is
	// simply defining "isValid" on Range.prototype.

/***/ },
/* 377 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(362);
	
	// This package does not export anything as it is
	// simply defining "milliseconds" on Range.prototype.

/***/ },
/* 378 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(362);
	
	// This package does not export anything as it is
	// simply defining "minutes" on Range.prototype.

/***/ },
/* 379 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(362);
	
	// This package does not export anything as it is
	// simply defining "months" on Range.prototype.

/***/ },
/* 380 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(362);
	
	// This package does not export anything as it is
	// simply defining "seconds" on Range.prototype.

/***/ },
/* 381 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    mathAliases = __webpack_require__(40),
	    rangeIsValid = __webpack_require__(365),
	    defineOnPrototype = __webpack_require__(358),
	    getRangeMemberNumericValue = __webpack_require__(382);
	
	var abs = mathAliases.abs;
	
	defineOnPrototype(Range, {
	
	  'span': function() {
	    var n = getRangeMemberNumericValue(this.end) - getRangeMemberNumericValue(this.start);
	    return rangeIsValid(this) ? abs(n) + 1 : NaN;
	  }
	
	});
	
	// This package does not export anything as it is
	// simply defining "span" on Range.prototype.

/***/ },
/* 382 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var classChecks = __webpack_require__(31);
	
	var isString = classChecks.isString;
	
	function getRangeMemberNumericValue(m) {
	  return isString(m) ? m.charCodeAt(0) : m;
	}
	
	module.exports = getRangeMemberNumericValue;

/***/ },
/* 383 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    rangeEvery = __webpack_require__(364),
	    defineOnPrototype = __webpack_require__(358);
	
	defineOnPrototype(Range, {
	
	  'toArray': function() {
	    return rangeEvery(this);
	  }
	
	});
	
	// This package does not export anything as it is
	// simply defining "toArray" on Range.prototype.

/***/ },
/* 384 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    rangeIsValid = __webpack_require__(365),
	    defineOnPrototype = __webpack_require__(358);
	
	defineOnPrototype(Range, {
	
	  'toString': function() {
	    return rangeIsValid(this) ? this.start + '..' + this.end : 'Invalid Range';
	  }
	
	});
	
	// This package does not export anything as it is
	// simply defining "toString" on Range.prototype.

/***/ },
/* 385 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Range = __webpack_require__(344),
	    defineOnPrototype = __webpack_require__(358);
	
	defineOnPrototype(Range, {
	
	  'union': function(range) {
	    return new Range(
	      this.start < range.start ? this.start : range.start,
	      this.end   > range.end   ? this.end   : range.end
	    );
	  }
	
	});
	
	// This package does not export anything as it is
	// simply defining "union" on Range.prototype.

/***/ },
/* 386 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(362);
	
	// This package does not export anything as it is
	// simply defining "weeks" on Range.prototype.

/***/ },
/* 387 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(362);
	
	// This package does not export anything as it is
	// simply defining "years" on Range.prototype.

/***/ },
/* 388 */
/***/ function(module, exports) {

	module.exports = "<!DOCTYPE html>\n<div class=\"ci-datetime-picker\">\n  <div ng-show=\"{{$dateTimeCtrl.dpShow}}\" class=\"input-group ci-datetime-picker-date\" style=\"width: 140px; float: left;\">\n    <input type=\"text\"\n      class=\"form-control date-picker\"\n      ng-model=\"$dateTimeCtrl.dateValue\"\n      ng-blur=\"$dateTimeCtrl.onDateBlur($event)\"\n    >\n    <span class=\"input-group-addon date-picker-icon\"><i class=\"glyphicon glyphicon-calendar\"></i></span>\n  </div>\n\n  <div ng-show=\"{{$dateTimeCtrl.tpShow}}\" class=\"input-group ci-datetime-picker-time\" style=\"width: 140px; padding-left: 5px; padding-right: 10px;\">\n    <input type=\"text\"\n      class=\"form-control time-picker\"\n      ng-model=\"$dateTimeCtrl.timeValue\"\n      ng-blur=\"$dateTimeCtrl.onTimeBlur($event)\"\n    >\n    <span class=\"input-group-addon time-picker-icon\"><i class=\"glyphicon glyphicon-time\"></i></span>\n  </div>\n</div>\n"

/***/ },
/* 389 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(390);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(392)(content, {});
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
/* 390 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(391)();
	// imports
	
	
	// module
	exports.push([module.id, ".ci-datetime-picker {\n  border-radius: 3px;\n}\n", ""]);
	
	// exports


/***/ },
/* 391 */
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
/* 392 */
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


/***/ },
/* 393 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(394);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(392)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./datepicker.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./datepicker.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 394 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(391)();
	// imports
	
	
	// module
	exports.push([module.id, "/*!\n * Datepicker for Bootstrap v1.7.0-dev (https://github.com/uxsolutions/bootstrap-datepicker)\n *\n * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)\n */\n\n.datepicker {\n  padding: 4px;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n  direction: ltr;\n}\n.datepicker-inline {\n  width: 220px;\n}\n.datepicker.datepicker-rtl {\n  direction: rtl;\n}\n.datepicker.datepicker-rtl.dropdown-menu {\n  left: auto;\n}\n.datepicker.datepicker-rtl table tr td span {\n  float: right;\n}\n.datepicker-dropdown {\n  top: 0;\n  left: 0;\n}\n.datepicker-dropdown:before {\n  content: '';\n  display: inline-block;\n  border-left: 7px solid transparent;\n  border-right: 7px solid transparent;\n  border-bottom: 7px solid #999999;\n  border-top: 0;\n  border-bottom-color: rgba(0, 0, 0, 0.2);\n  position: absolute;\n}\n.datepicker-dropdown:after {\n  content: '';\n  display: inline-block;\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  border-bottom: 6px solid #ffffff;\n  border-top: 0;\n  position: absolute;\n}\n.datepicker-dropdown.datepicker-orient-left:before {\n  left: 6px;\n}\n.datepicker-dropdown.datepicker-orient-left:after {\n  left: 7px;\n}\n.datepicker-dropdown.datepicker-orient-right:before {\n  right: 6px;\n}\n.datepicker-dropdown.datepicker-orient-right:after {\n  right: 7px;\n}\n.datepicker-dropdown.datepicker-orient-bottom:before {\n  top: -7px;\n}\n.datepicker-dropdown.datepicker-orient-bottom:after {\n  top: -6px;\n}\n.datepicker-dropdown.datepicker-orient-top:before {\n  bottom: -7px;\n  border-bottom: 0;\n  border-top: 7px solid #999999;\n}\n.datepicker-dropdown.datepicker-orient-top:after {\n  bottom: -6px;\n  border-bottom: 0;\n  border-top: 6px solid #ffffff;\n}\n.datepicker table {\n  margin: 0;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.datepicker td,\n.datepicker th {\n  text-align: center;\n  width: 20px;\n  height: 20px;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n  border: none;\n}\n.table-striped .datepicker table tr td,\n.table-striped .datepicker table tr th {\n  background-color: transparent;\n}\n.datepicker table tr td.day:hover,\n.datepicker table tr td.day.focused {\n  background: #eeeeee;\n  cursor: pointer;\n}\n.datepicker table tr td.old,\n.datepicker table tr td.new {\n  color: #999999;\n}\n.datepicker table tr td.disabled,\n.datepicker table tr td.disabled:hover {\n  background: none;\n  color: #999999;\n  cursor: default;\n}\n.datepicker table tr td.highlighted {\n  background: #d9edf7;\n  border-radius: 0;\n}\n.datepicker table tr td.today,\n.datepicker table tr td.today:hover,\n.datepicker table tr td.today.disabled,\n.datepicker table tr td.today.disabled:hover {\n  background-color: #fde19a;\n  background-image: -moz-linear-gradient(to bottom, #fdd49a, #fdf59a);\n  background-image: -ms-linear-gradient(to bottom, #fdd49a, #fdf59a);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fdd49a), to(#fdf59a));\n  background-image: -webkit-linear-gradient(to bottom, #fdd49a, #fdf59a);\n  background-image: -o-linear-gradient(to bottom, #fdd49a, #fdf59a);\n  background-image: linear-gradient(to bottom, #fdd49a, #fdf59a);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fdd49a', endColorstr='#fdf59a', GradientType=0);\n  border-color: #fdf59a #fdf59a #fbed50;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #000;\n}\n.datepicker table tr td.today:hover,\n.datepicker table tr td.today:hover:hover,\n.datepicker table tr td.today.disabled:hover,\n.datepicker table tr td.today.disabled:hover:hover,\n.datepicker table tr td.today:active,\n.datepicker table tr td.today:hover:active,\n.datepicker table tr td.today.disabled:active,\n.datepicker table tr td.today.disabled:hover:active,\n.datepicker table tr td.today.active,\n.datepicker table tr td.today:hover.active,\n.datepicker table tr td.today.disabled.active,\n.datepicker table tr td.today.disabled:hover.active,\n.datepicker table tr td.today.disabled,\n.datepicker table tr td.today:hover.disabled,\n.datepicker table tr td.today.disabled.disabled,\n.datepicker table tr td.today.disabled:hover.disabled,\n.datepicker table tr td.today[disabled],\n.datepicker table tr td.today:hover[disabled],\n.datepicker table tr td.today.disabled[disabled],\n.datepicker table tr td.today.disabled:hover[disabled] {\n  background-color: #fdf59a;\n}\n.datepicker table tr td.today:active,\n.datepicker table tr td.today:hover:active,\n.datepicker table tr td.today.disabled:active,\n.datepicker table tr td.today.disabled:hover:active,\n.datepicker table tr td.today.active,\n.datepicker table tr td.today:hover.active,\n.datepicker table tr td.today.disabled.active,\n.datepicker table tr td.today.disabled:hover.active {\n  background-color: #fbf069 \\9;\n}\n.datepicker table tr td.today:hover:hover {\n  color: #000;\n}\n.datepicker table tr td.today.active:hover {\n  color: #fff;\n}\n.datepicker table tr td.range,\n.datepicker table tr td.range:hover,\n.datepicker table tr td.range.disabled,\n.datepicker table tr td.range.disabled:hover {\n  background: #eeeeee;\n  -webkit-border-radius: 0;\n  -moz-border-radius: 0;\n  border-radius: 0;\n}\n.datepicker table tr td.range.today,\n.datepicker table tr td.range.today:hover,\n.datepicker table tr td.range.today.disabled,\n.datepicker table tr td.range.today.disabled:hover {\n  background-color: #f3d17a;\n  background-image: -moz-linear-gradient(to bottom, #f3c17a, #f3e97a);\n  background-image: -ms-linear-gradient(to bottom, #f3c17a, #f3e97a);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#f3c17a), to(#f3e97a));\n  background-image: -webkit-linear-gradient(to bottom, #f3c17a, #f3e97a);\n  background-image: -o-linear-gradient(to bottom, #f3c17a, #f3e97a);\n  background-image: linear-gradient(to bottom, #f3c17a, #f3e97a);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f3c17a', endColorstr='#f3e97a', GradientType=0);\n  border-color: #f3e97a #f3e97a #edde34;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  -webkit-border-radius: 0;\n  -moz-border-radius: 0;\n  border-radius: 0;\n}\n.datepicker table tr td.range.today:hover,\n.datepicker table tr td.range.today:hover:hover,\n.datepicker table tr td.range.today.disabled:hover,\n.datepicker table tr td.range.today.disabled:hover:hover,\n.datepicker table tr td.range.today:active,\n.datepicker table tr td.range.today:hover:active,\n.datepicker table tr td.range.today.disabled:active,\n.datepicker table tr td.range.today.disabled:hover:active,\n.datepicker table tr td.range.today.active,\n.datepicker table tr td.range.today:hover.active,\n.datepicker table tr td.range.today.disabled.active,\n.datepicker table tr td.range.today.disabled:hover.active,\n.datepicker table tr td.range.today.disabled,\n.datepicker table tr td.range.today:hover.disabled,\n.datepicker table tr td.range.today.disabled.disabled,\n.datepicker table tr td.range.today.disabled:hover.disabled,\n.datepicker table tr td.range.today[disabled],\n.datepicker table tr td.range.today:hover[disabled],\n.datepicker table tr td.range.today.disabled[disabled],\n.datepicker table tr td.range.today.disabled:hover[disabled] {\n  background-color: #f3e97a;\n}\n.datepicker table tr td.range.today:active,\n.datepicker table tr td.range.today:hover:active,\n.datepicker table tr td.range.today.disabled:active,\n.datepicker table tr td.range.today.disabled:hover:active,\n.datepicker table tr td.range.today.active,\n.datepicker table tr td.range.today:hover.active,\n.datepicker table tr td.range.today.disabled.active,\n.datepicker table tr td.range.today.disabled:hover.active {\n  background-color: #efe24b \\9;\n}\n.datepicker table tr td.selected,\n.datepicker table tr td.selected:hover,\n.datepicker table tr td.selected.disabled,\n.datepicker table tr td.selected.disabled:hover {\n  background-color: #9e9e9e;\n  background-image: -moz-linear-gradient(to bottom, #b3b3b3, #808080);\n  background-image: -ms-linear-gradient(to bottom, #b3b3b3, #808080);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#b3b3b3), to(#808080));\n  background-image: -webkit-linear-gradient(to bottom, #b3b3b3, #808080);\n  background-image: -o-linear-gradient(to bottom, #b3b3b3, #808080);\n  background-image: linear-gradient(to bottom, #b3b3b3, #808080);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#b3b3b3', endColorstr='#808080', GradientType=0);\n  border-color: #808080 #808080 #595959;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #fff;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\n.datepicker table tr td.selected:hover,\n.datepicker table tr td.selected:hover:hover,\n.datepicker table tr td.selected.disabled:hover,\n.datepicker table tr td.selected.disabled:hover:hover,\n.datepicker table tr td.selected:active,\n.datepicker table tr td.selected:hover:active,\n.datepicker table tr td.selected.disabled:active,\n.datepicker table tr td.selected.disabled:hover:active,\n.datepicker table tr td.selected.active,\n.datepicker table tr td.selected:hover.active,\n.datepicker table tr td.selected.disabled.active,\n.datepicker table tr td.selected.disabled:hover.active,\n.datepicker table tr td.selected.disabled,\n.datepicker table tr td.selected:hover.disabled,\n.datepicker table tr td.selected.disabled.disabled,\n.datepicker table tr td.selected.disabled:hover.disabled,\n.datepicker table tr td.selected[disabled],\n.datepicker table tr td.selected:hover[disabled],\n.datepicker table tr td.selected.disabled[disabled],\n.datepicker table tr td.selected.disabled:hover[disabled] {\n  background-color: #808080;\n}\n.datepicker table tr td.selected:active,\n.datepicker table tr td.selected:hover:active,\n.datepicker table tr td.selected.disabled:active,\n.datepicker table tr td.selected.disabled:hover:active,\n.datepicker table tr td.selected.active,\n.datepicker table tr td.selected:hover.active,\n.datepicker table tr td.selected.disabled.active,\n.datepicker table tr td.selected.disabled:hover.active {\n  background-color: #666666 \\9;\n}\n.datepicker table tr td.active,\n.datepicker table tr td.active:hover,\n.datepicker table tr td.active.disabled,\n.datepicker table tr td.active.disabled:hover {\n  background-color: #006dcc;\n  background-image: -moz-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -ms-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#0088cc), to(#0044cc));\n  background-image: -webkit-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -o-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: linear-gradient(to bottom, #0088cc, #0044cc);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0088cc', endColorstr='#0044cc', GradientType=0);\n  border-color: #0044cc #0044cc #002a80;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #fff;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\n.datepicker table tr td.active:hover,\n.datepicker table tr td.active:hover:hover,\n.datepicker table tr td.active.disabled:hover,\n.datepicker table tr td.active.disabled:hover:hover,\n.datepicker table tr td.active:active,\n.datepicker table tr td.active:hover:active,\n.datepicker table tr td.active.disabled:active,\n.datepicker table tr td.active.disabled:hover:active,\n.datepicker table tr td.active.active,\n.datepicker table tr td.active:hover.active,\n.datepicker table tr td.active.disabled.active,\n.datepicker table tr td.active.disabled:hover.active,\n.datepicker table tr td.active.disabled,\n.datepicker table tr td.active:hover.disabled,\n.datepicker table tr td.active.disabled.disabled,\n.datepicker table tr td.active.disabled:hover.disabled,\n.datepicker table tr td.active[disabled],\n.datepicker table tr td.active:hover[disabled],\n.datepicker table tr td.active.disabled[disabled],\n.datepicker table tr td.active.disabled:hover[disabled] {\n  background-color: #0044cc;\n}\n.datepicker table tr td.active:active,\n.datepicker table tr td.active:hover:active,\n.datepicker table tr td.active.disabled:active,\n.datepicker table tr td.active.disabled:hover:active,\n.datepicker table tr td.active.active,\n.datepicker table tr td.active:hover.active,\n.datepicker table tr td.active.disabled.active,\n.datepicker table tr td.active.disabled:hover.active {\n  background-color: #003399 \\9;\n}\n.datepicker table tr td span {\n  display: block;\n  width: 23%;\n  height: 54px;\n  line-height: 54px;\n  float: left;\n  margin: 1%;\n  cursor: pointer;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n}\n.datepicker table tr td span:hover,\n.datepicker table tr td span.focused {\n  background: #eeeeee;\n}\n.datepicker table tr td span.disabled,\n.datepicker table tr td span.disabled:hover {\n  background: none;\n  color: #999999;\n  cursor: default;\n}\n.datepicker table tr td span.active,\n.datepicker table tr td span.active:hover,\n.datepicker table tr td span.active.disabled,\n.datepicker table tr td span.active.disabled:hover {\n  background-color: #006dcc;\n  background-image: -moz-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -ms-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#0088cc), to(#0044cc));\n  background-image: -webkit-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -o-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: linear-gradient(to bottom, #0088cc, #0044cc);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0088cc', endColorstr='#0044cc', GradientType=0);\n  border-color: #0044cc #0044cc #002a80;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #fff;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\n.datepicker table tr td span.active:hover,\n.datepicker table tr td span.active:hover:hover,\n.datepicker table tr td span.active.disabled:hover,\n.datepicker table tr td span.active.disabled:hover:hover,\n.datepicker table tr td span.active:active,\n.datepicker table tr td span.active:hover:active,\n.datepicker table tr td span.active.disabled:active,\n.datepicker table tr td span.active.disabled:hover:active,\n.datepicker table tr td span.active.active,\n.datepicker table tr td span.active:hover.active,\n.datepicker table tr td span.active.disabled.active,\n.datepicker table tr td span.active.disabled:hover.active,\n.datepicker table tr td span.active.disabled,\n.datepicker table tr td span.active:hover.disabled,\n.datepicker table tr td span.active.disabled.disabled,\n.datepicker table tr td span.active.disabled:hover.disabled,\n.datepicker table tr td span.active[disabled],\n.datepicker table tr td span.active:hover[disabled],\n.datepicker table tr td span.active.disabled[disabled],\n.datepicker table tr td span.active.disabled:hover[disabled] {\n  background-color: #0044cc;\n}\n.datepicker table tr td span.active:active,\n.datepicker table tr td span.active:hover:active,\n.datepicker table tr td span.active.disabled:active,\n.datepicker table tr td span.active.disabled:hover:active,\n.datepicker table tr td span.active.active,\n.datepicker table tr td span.active:hover.active,\n.datepicker table tr td span.active.disabled.active,\n.datepicker table tr td span.active.disabled:hover.active {\n  background-color: #003399 \\9;\n}\n.datepicker table tr td span.old,\n.datepicker table tr td span.new {\n  color: #999999;\n}\n.datepicker .datepicker-switch {\n  width: 145px;\n}\n.datepicker .datepicker-switch,\n.datepicker .prev,\n.datepicker .next,\n.datepicker tfoot tr th {\n  cursor: pointer;\n}\n.datepicker .datepicker-switch:hover,\n.datepicker .prev:hover,\n.datepicker .next:hover,\n.datepicker tfoot tr th:hover {\n  background: #eeeeee;\n}\n.datepicker .prev.disabled,\n.datepicker .next.disabled {\n  visibility: hidden;\n}\n.datepicker .cw {\n  font-size: 10px;\n  width: 12px;\n  padding: 0 2px 0 5px;\n  vertical-align: middle;\n}\n.input-append.date .add-on,\n.input-prepend.date .add-on {\n  cursor: pointer;\n}\n.input-append.date .add-on i,\n.input-prepend.date .add-on i {\n  margin-top: 3px;\n}\n.input-daterange input {\n  text-align: center;\n}\n.input-daterange input:first-child {\n  -webkit-border-radius: 3px 0 0 3px;\n  -moz-border-radius: 3px 0 0 3px;\n  border-radius: 3px 0 0 3px;\n}\n.input-daterange input:last-child {\n  -webkit-border-radius: 0 3px 3px 0;\n  -moz-border-radius: 0 3px 3px 0;\n  border-radius: 0 3px 3px 0;\n}\n.input-daterange .add-on {\n  display: inline-block;\n  width: auto;\n  min-width: 16px;\n  height: 18px;\n  padding: 4px 5px;\n  font-weight: normal;\n  line-height: 18px;\n  text-align: center;\n  text-shadow: 0 1px 0 #ffffff;\n  vertical-align: middle;\n  background-color: #eeeeee;\n  border: 1px solid #ccc;\n  margin-left: -5px;\n  margin-right: -5px;\n}\n/*# sourceMappingURL=bootstrap-datepicker.css.map */", ""]);
	
	// exports


/***/ },
/* 395 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(396);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(392)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./timepicker.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./timepicker.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 396 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(391)();
	// imports
	
	
	// module
	exports.push([module.id, ".ui-timepicker-wrapper {\n\toverflow-y: auto;\n\theight: 150px;\n\twidth: 6.5em;\n\tbackground: #fff;\n\tborder: 1px solid #ddd;\n\t-webkit-box-shadow:0 5px 10px rgba(0,0,0,0.2);\n\t-moz-box-shadow:0 5px 10px rgba(0,0,0,0.2);\n\tbox-shadow:0 5px 10px rgba(0,0,0,0.2);\n\toutline: none;\n\tz-index: 10001;\n\tmargin: 0;\n}\n\n.ui-timepicker-wrapper.ui-timepicker-with-duration {\n\twidth: 13em;\n}\n\n.ui-timepicker-wrapper.ui-timepicker-with-duration.ui-timepicker-step-30,\n.ui-timepicker-wrapper.ui-timepicker-with-duration.ui-timepicker-step-60 {\n\twidth: 11em;\n}\n\n.ui-timepicker-list {\n\tmargin: 0;\n\tpadding: 0;\n\tlist-style: none;\n}\n\n.ui-timepicker-duration {\n\tmargin-left: 5px; color: #888;\n}\n\n.ui-timepicker-list:hover .ui-timepicker-duration {\n\tcolor: #888;\n}\n\n.ui-timepicker-list li {\n\tpadding: 3px 0 3px 5px;\n\tcursor: pointer;\n\twhite-space: nowrap;\n\tcolor: #000;\n\tlist-style: none;\n\tmargin: 0;\n}\n\n.ui-timepicker-list:hover .ui-timepicker-selected {\n\tbackground: #fff; color: #000;\n}\n\nli.ui-timepicker-selected,\n.ui-timepicker-list li:hover,\n.ui-timepicker-list .ui-timepicker-selected:hover {\n\tbackground: #1980EC; color: #fff;\n}\n\nli.ui-timepicker-selected .ui-timepicker-duration,\n.ui-timepicker-list li:hover .ui-timepicker-duration {\n\tcolor: #ccc;\n}\n\n.ui-timepicker-list li.ui-timepicker-disabled,\n.ui-timepicker-list li.ui-timepicker-disabled:hover,\n.ui-timepicker-list li.ui-timepicker-selected.ui-timepicker-disabled {\n\tcolor: #888;\n\tcursor: default;\n}\n\n.ui-timepicker-list li.ui-timepicker-disabled:hover,\n.ui-timepicker-list li.ui-timepicker-selected.ui-timepicker-disabled {\n\tbackground: #f2f2f2;\n}\n", ""]);
	
	// exports


/***/ }
/******/ ]);
//# sourceMappingURL=datetime-picker.directive.js.map