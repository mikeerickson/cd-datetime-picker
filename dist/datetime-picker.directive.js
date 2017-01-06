/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

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
	const moment = __webpack_require__(389); // This could possibly be removed

	__webpack_require__(500);
	__webpack_require__(504);
	__webpack_require__(506);

	angular.module('cd-datetime-picker', []).directive('cdDatetimePicker', DateTimePickerDirective);

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
	    $scope.$emit('dp.updateDateTime', { dateValue: $dateTimeCtrl.dateValue, timeValue: $dateTimeCtrl.timeValue });
	  };

	  $dateTimeCtrl.onDateKeyUp = evt => {
	    console.log('onDateKeyUp', evt);
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
	    weekStart: 0,
	    forceParse: false, // this is required to support human entry
	    startDate: new Date()
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
	  // dp.on('changeDate', () => {
	  // });

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
	    let dateValue = evt.target.value;
	    if (dateValue.length === 0) {
	      dateValue = dateTimeUtils.getDate(scope.datetimeValue);
	    }
	    scope.$broadcast('dp.dateChange', { dateValue: dateValue });
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

	  getRandomDate: (from, to) => {
	    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
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
	 *  Sugar v2.0.4
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
	  RANGE_REG_FRONT_DURATION: RegExp('(?:for)?\\s*'+ FULL_CAPTURED_DURATION +'\\s*(?:starting)?\\s(?:at\\s)?(.+)', 'i')
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
	    return countOnly ? NaN : [];
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

	/* WEBPACK VAR INJECTION */(function(module) {//! moment.js
	//! version : 2.17.1
	//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
	//! license : MIT
	//! momentjs.com

	;(function (global, factory) {
	     true ? module.exports = factory() :
	    typeof define === 'function' && define.amd ? define(factory) :
	    global.moment = factory()
	}(this, (function () { 'use strict';

	var hookCallback;

	function hooks () {
	    return hookCallback.apply(null, arguments);
	}

	// This is done to register the method called with moment()
	// without creating circular dependencies.
	function setHookCallback (callback) {
	    hookCallback = callback;
	}

	function isArray(input) {
	    return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
	}

	function isObject(input) {
	    // IE8 will treat undefined and null as object if it wasn't for
	    // input != null
	    return input != null && Object.prototype.toString.call(input) === '[object Object]';
	}

	function isObjectEmpty(obj) {
	    var k;
	    for (k in obj) {
	        // even if its not own property I'd still call it non-empty
	        return false;
	    }
	    return true;
	}

	function isNumber(input) {
	    return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
	}

	function isDate(input) {
	    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
	}

	function map(arr, fn) {
	    var res = [], i;
	    for (i = 0; i < arr.length; ++i) {
	        res.push(fn(arr[i], i));
	    }
	    return res;
	}

	function hasOwnProp(a, b) {
	    return Object.prototype.hasOwnProperty.call(a, b);
	}

	function extend(a, b) {
	    for (var i in b) {
	        if (hasOwnProp(b, i)) {
	            a[i] = b[i];
	        }
	    }

	    if (hasOwnProp(b, 'toString')) {
	        a.toString = b.toString;
	    }

	    if (hasOwnProp(b, 'valueOf')) {
	        a.valueOf = b.valueOf;
	    }

	    return a;
	}

	function createUTC (input, format, locale, strict) {
	    return createLocalOrUTC(input, format, locale, strict, true).utc();
	}

	function defaultParsingFlags() {
	    // We need to deep clone this object.
	    return {
	        empty           : false,
	        unusedTokens    : [],
	        unusedInput     : [],
	        overflow        : -2,
	        charsLeftOver   : 0,
	        nullInput       : false,
	        invalidMonth    : null,
	        invalidFormat   : false,
	        userInvalidated : false,
	        iso             : false,
	        parsedDateParts : [],
	        meridiem        : null
	    };
	}

	function getParsingFlags(m) {
	    if (m._pf == null) {
	        m._pf = defaultParsingFlags();
	    }
	    return m._pf;
	}

	var some;
	if (Array.prototype.some) {
	    some = Array.prototype.some;
	} else {
	    some = function (fun) {
	        var t = Object(this);
	        var len = t.length >>> 0;

	        for (var i = 0; i < len; i++) {
	            if (i in t && fun.call(this, t[i], i, t)) {
	                return true;
	            }
	        }

	        return false;
	    };
	}

	var some$1 = some;

	function isValid(m) {
	    if (m._isValid == null) {
	        var flags = getParsingFlags(m);
	        var parsedParts = some$1.call(flags.parsedDateParts, function (i) {
	            return i != null;
	        });
	        var isNowValid = !isNaN(m._d.getTime()) &&
	            flags.overflow < 0 &&
	            !flags.empty &&
	            !flags.invalidMonth &&
	            !flags.invalidWeekday &&
	            !flags.nullInput &&
	            !flags.invalidFormat &&
	            !flags.userInvalidated &&
	            (!flags.meridiem || (flags.meridiem && parsedParts));

	        if (m._strict) {
	            isNowValid = isNowValid &&
	                flags.charsLeftOver === 0 &&
	                flags.unusedTokens.length === 0 &&
	                flags.bigHour === undefined;
	        }

	        if (Object.isFrozen == null || !Object.isFrozen(m)) {
	            m._isValid = isNowValid;
	        }
	        else {
	            return isNowValid;
	        }
	    }
	    return m._isValid;
	}

	function createInvalid (flags) {
	    var m = createUTC(NaN);
	    if (flags != null) {
	        extend(getParsingFlags(m), flags);
	    }
	    else {
	        getParsingFlags(m).userInvalidated = true;
	    }

	    return m;
	}

	function isUndefined(input) {
	    return input === void 0;
	}

	// Plugins that add properties should also add the key here (null value),
	// so we can properly clone ourselves.
	var momentProperties = hooks.momentProperties = [];

	function copyConfig(to, from) {
	    var i, prop, val;

	    if (!isUndefined(from._isAMomentObject)) {
	        to._isAMomentObject = from._isAMomentObject;
	    }
	    if (!isUndefined(from._i)) {
	        to._i = from._i;
	    }
	    if (!isUndefined(from._f)) {
	        to._f = from._f;
	    }
	    if (!isUndefined(from._l)) {
	        to._l = from._l;
	    }
	    if (!isUndefined(from._strict)) {
	        to._strict = from._strict;
	    }
	    if (!isUndefined(from._tzm)) {
	        to._tzm = from._tzm;
	    }
	    if (!isUndefined(from._isUTC)) {
	        to._isUTC = from._isUTC;
	    }
	    if (!isUndefined(from._offset)) {
	        to._offset = from._offset;
	    }
	    if (!isUndefined(from._pf)) {
	        to._pf = getParsingFlags(from);
	    }
	    if (!isUndefined(from._locale)) {
	        to._locale = from._locale;
	    }

	    if (momentProperties.length > 0) {
	        for (i in momentProperties) {
	            prop = momentProperties[i];
	            val = from[prop];
	            if (!isUndefined(val)) {
	                to[prop] = val;
	            }
	        }
	    }

	    return to;
	}

	var updateInProgress = false;

	// Moment prototype object
	function Moment(config) {
	    copyConfig(this, config);
	    this._d = new Date(config._d != null ? config._d.getTime() : NaN);
	    if (!this.isValid()) {
	        this._d = new Date(NaN);
	    }
	    // Prevent infinite loop in case updateOffset creates new moment
	    // objects.
	    if (updateInProgress === false) {
	        updateInProgress = true;
	        hooks.updateOffset(this);
	        updateInProgress = false;
	    }
	}

	function isMoment (obj) {
	    return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
	}

	function absFloor (number) {
	    if (number < 0) {
	        // -0 -> 0
	        return Math.ceil(number) || 0;
	    } else {
	        return Math.floor(number);
	    }
	}

	function toInt(argumentForCoercion) {
	    var coercedNumber = +argumentForCoercion,
	        value = 0;

	    if (coercedNumber !== 0 && isFinite(coercedNumber)) {
	        value = absFloor(coercedNumber);
	    }

	    return value;
	}

	// compare two arrays, return the number of differences
	function compareArrays(array1, array2, dontConvert) {
	    var len = Math.min(array1.length, array2.length),
	        lengthDiff = Math.abs(array1.length - array2.length),
	        diffs = 0,
	        i;
	    for (i = 0; i < len; i++) {
	        if ((dontConvert && array1[i] !== array2[i]) ||
	            (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
	            diffs++;
	        }
	    }
	    return diffs + lengthDiff;
	}

	function warn(msg) {
	    if (hooks.suppressDeprecationWarnings === false &&
	            (typeof console !==  'undefined') && console.warn) {
	        console.warn('Deprecation warning: ' + msg);
	    }
	}

	function deprecate(msg, fn) {
	    var firstTime = true;

	    return extend(function () {
	        if (hooks.deprecationHandler != null) {
	            hooks.deprecationHandler(null, msg);
	        }
	        if (firstTime) {
	            var args = [];
	            var arg;
	            for (var i = 0; i < arguments.length; i++) {
	                arg = '';
	                if (typeof arguments[i] === 'object') {
	                    arg += '\n[' + i + '] ';
	                    for (var key in arguments[0]) {
	                        arg += key + ': ' + arguments[0][key] + ', ';
	                    }
	                    arg = arg.slice(0, -2); // Remove trailing comma and space
	                } else {
	                    arg = arguments[i];
	                }
	                args.push(arg);
	            }
	            warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
	            firstTime = false;
	        }
	        return fn.apply(this, arguments);
	    }, fn);
	}

	var deprecations = {};

	function deprecateSimple(name, msg) {
	    if (hooks.deprecationHandler != null) {
	        hooks.deprecationHandler(name, msg);
	    }
	    if (!deprecations[name]) {
	        warn(msg);
	        deprecations[name] = true;
	    }
	}

	hooks.suppressDeprecationWarnings = false;
	hooks.deprecationHandler = null;

	function isFunction(input) {
	    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
	}

	function set (config) {
	    var prop, i;
	    for (i in config) {
	        prop = config[i];
	        if (isFunction(prop)) {
	            this[i] = prop;
	        } else {
	            this['_' + i] = prop;
	        }
	    }
	    this._config = config;
	    // Lenient ordinal parsing accepts just a number in addition to
	    // number + (possibly) stuff coming from _ordinalParseLenient.
	    this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
	}

	function mergeConfigs(parentConfig, childConfig) {
	    var res = extend({}, parentConfig), prop;
	    for (prop in childConfig) {
	        if (hasOwnProp(childConfig, prop)) {
	            if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
	                res[prop] = {};
	                extend(res[prop], parentConfig[prop]);
	                extend(res[prop], childConfig[prop]);
	            } else if (childConfig[prop] != null) {
	                res[prop] = childConfig[prop];
	            } else {
	                delete res[prop];
	            }
	        }
	    }
	    for (prop in parentConfig) {
	        if (hasOwnProp(parentConfig, prop) &&
	                !hasOwnProp(childConfig, prop) &&
	                isObject(parentConfig[prop])) {
	            // make sure changes to properties don't modify parent config
	            res[prop] = extend({}, res[prop]);
	        }
	    }
	    return res;
	}

	function Locale(config) {
	    if (config != null) {
	        this.set(config);
	    }
	}

	var keys;

	if (Object.keys) {
	    keys = Object.keys;
	} else {
	    keys = function (obj) {
	        var i, res = [];
	        for (i in obj) {
	            if (hasOwnProp(obj, i)) {
	                res.push(i);
	            }
	        }
	        return res;
	    };
	}

	var keys$1 = keys;

	var defaultCalendar = {
	    sameDay : '[Today at] LT',
	    nextDay : '[Tomorrow at] LT',
	    nextWeek : 'dddd [at] LT',
	    lastDay : '[Yesterday at] LT',
	    lastWeek : '[Last] dddd [at] LT',
	    sameElse : 'L'
	};

	function calendar (key, mom, now) {
	    var output = this._calendar[key] || this._calendar['sameElse'];
	    return isFunction(output) ? output.call(mom, now) : output;
	}

	var defaultLongDateFormat = {
	    LTS  : 'h:mm:ss A',
	    LT   : 'h:mm A',
	    L    : 'MM/DD/YYYY',
	    LL   : 'MMMM D, YYYY',
	    LLL  : 'MMMM D, YYYY h:mm A',
	    LLLL : 'dddd, MMMM D, YYYY h:mm A'
	};

	function longDateFormat (key) {
	    var format = this._longDateFormat[key],
	        formatUpper = this._longDateFormat[key.toUpperCase()];

	    if (format || !formatUpper) {
	        return format;
	    }

	    this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
	        return val.slice(1);
	    });

	    return this._longDateFormat[key];
	}

	var defaultInvalidDate = 'Invalid date';

	function invalidDate () {
	    return this._invalidDate;
	}

	var defaultOrdinal = '%d';
	var defaultOrdinalParse = /\d{1,2}/;

	function ordinal (number) {
	    return this._ordinal.replace('%d', number);
	}

	var defaultRelativeTime = {
	    future : 'in %s',
	    past   : '%s ago',
	    s  : 'a few seconds',
	    m  : 'a minute',
	    mm : '%d minutes',
	    h  : 'an hour',
	    hh : '%d hours',
	    d  : 'a day',
	    dd : '%d days',
	    M  : 'a month',
	    MM : '%d months',
	    y  : 'a year',
	    yy : '%d years'
	};

	function relativeTime (number, withoutSuffix, string, isFuture) {
	    var output = this._relativeTime[string];
	    return (isFunction(output)) ?
	        output(number, withoutSuffix, string, isFuture) :
	        output.replace(/%d/i, number);
	}

	function pastFuture (diff, output) {
	    var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
	    return isFunction(format) ? format(output) : format.replace(/%s/i, output);
	}

	var aliases = {};

	function addUnitAlias (unit, shorthand) {
	    var lowerCase = unit.toLowerCase();
	    aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
	}

	function normalizeUnits(units) {
	    return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
	}

	function normalizeObjectUnits(inputObject) {
	    var normalizedInput = {},
	        normalizedProp,
	        prop;

	    for (prop in inputObject) {
	        if (hasOwnProp(inputObject, prop)) {
	            normalizedProp = normalizeUnits(prop);
	            if (normalizedProp) {
	                normalizedInput[normalizedProp] = inputObject[prop];
	            }
	        }
	    }

	    return normalizedInput;
	}

	var priorities = {};

	function addUnitPriority(unit, priority) {
	    priorities[unit] = priority;
	}

	function getPrioritizedUnits(unitsObj) {
	    var units = [];
	    for (var u in unitsObj) {
	        units.push({unit: u, priority: priorities[u]});
	    }
	    units.sort(function (a, b) {
	        return a.priority - b.priority;
	    });
	    return units;
	}

	function makeGetSet (unit, keepTime) {
	    return function (value) {
	        if (value != null) {
	            set$1(this, unit, value);
	            hooks.updateOffset(this, keepTime);
	            return this;
	        } else {
	            return get(this, unit);
	        }
	    };
	}

	function get (mom, unit) {
	    return mom.isValid() ?
	        mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
	}

	function set$1 (mom, unit, value) {
	    if (mom.isValid()) {
	        mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
	    }
	}

	// MOMENTS

	function stringGet (units) {
	    units = normalizeUnits(units);
	    if (isFunction(this[units])) {
	        return this[units]();
	    }
	    return this;
	}


	function stringSet (units, value) {
	    if (typeof units === 'object') {
	        units = normalizeObjectUnits(units);
	        var prioritized = getPrioritizedUnits(units);
	        for (var i = 0; i < prioritized.length; i++) {
	            this[prioritized[i].unit](units[prioritized[i].unit]);
	        }
	    } else {
	        units = normalizeUnits(units);
	        if (isFunction(this[units])) {
	            return this[units](value);
	        }
	    }
	    return this;
	}

	function zeroFill(number, targetLength, forceSign) {
	    var absNumber = '' + Math.abs(number),
	        zerosToFill = targetLength - absNumber.length,
	        sign = number >= 0;
	    return (sign ? (forceSign ? '+' : '') : '-') +
	        Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
	}

	var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

	var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

	var formatFunctions = {};

	var formatTokenFunctions = {};

	// token:    'M'
	// padded:   ['MM', 2]
	// ordinal:  'Mo'
	// callback: function () { this.month() + 1 }
	function addFormatToken (token, padded, ordinal, callback) {
	    var func = callback;
	    if (typeof callback === 'string') {
	        func = function () {
	            return this[callback]();
	        };
	    }
	    if (token) {
	        formatTokenFunctions[token] = func;
	    }
	    if (padded) {
	        formatTokenFunctions[padded[0]] = function () {
	            return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
	        };
	    }
	    if (ordinal) {
	        formatTokenFunctions[ordinal] = function () {
	            return this.localeData().ordinal(func.apply(this, arguments), token);
	        };
	    }
	}

	function removeFormattingTokens(input) {
	    if (input.match(/\[[\s\S]/)) {
	        return input.replace(/^\[|\]$/g, '');
	    }
	    return input.replace(/\\/g, '');
	}

	function makeFormatFunction(format) {
	    var array = format.match(formattingTokens), i, length;

	    for (i = 0, length = array.length; i < length; i++) {
	        if (formatTokenFunctions[array[i]]) {
	            array[i] = formatTokenFunctions[array[i]];
	        } else {
	            array[i] = removeFormattingTokens(array[i]);
	        }
	    }

	    return function (mom) {
	        var output = '', i;
	        for (i = 0; i < length; i++) {
	            output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
	        }
	        return output;
	    };
	}

	// format date using native date object
	function formatMoment(m, format) {
	    if (!m.isValid()) {
	        return m.localeData().invalidDate();
	    }

	    format = expandFormat(format, m.localeData());
	    formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

	    return formatFunctions[format](m);
	}

	function expandFormat(format, locale) {
	    var i = 5;

	    function replaceLongDateFormatTokens(input) {
	        return locale.longDateFormat(input) || input;
	    }

	    localFormattingTokens.lastIndex = 0;
	    while (i >= 0 && localFormattingTokens.test(format)) {
	        format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
	        localFormattingTokens.lastIndex = 0;
	        i -= 1;
	    }

	    return format;
	}

	var match1         = /\d/;            //       0 - 9
	var match2         = /\d\d/;          //      00 - 99
	var match3         = /\d{3}/;         //     000 - 999
	var match4         = /\d{4}/;         //    0000 - 9999
	var match6         = /[+-]?\d{6}/;    // -999999 - 999999
	var match1to2      = /\d\d?/;         //       0 - 99
	var match3to4      = /\d\d\d\d?/;     //     999 - 9999
	var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
	var match1to3      = /\d{1,3}/;       //       0 - 999
	var match1to4      = /\d{1,4}/;       //       0 - 9999
	var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

	var matchUnsigned  = /\d+/;           //       0 - inf
	var matchSigned    = /[+-]?\d+/;      //    -inf - inf

	var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
	var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

	var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

	// any word (or two) characters or numbers including two/three word month in arabic.
	// includes scottish gaelic two word and hyphenated months
	var matchWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;


	var regexes = {};

	function addRegexToken (token, regex, strictRegex) {
	    regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
	        return (isStrict && strictRegex) ? strictRegex : regex;
	    };
	}

	function getParseRegexForToken (token, config) {
	    if (!hasOwnProp(regexes, token)) {
	        return new RegExp(unescapeFormat(token));
	    }

	    return regexes[token](config._strict, config._locale);
	}

	// Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
	function unescapeFormat(s) {
	    return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
	        return p1 || p2 || p3 || p4;
	    }));
	}

	function regexEscape(s) {
	    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	}

	var tokens = {};

	function addParseToken (token, callback) {
	    var i, func = callback;
	    if (typeof token === 'string') {
	        token = [token];
	    }
	    if (isNumber(callback)) {
	        func = function (input, array) {
	            array[callback] = toInt(input);
	        };
	    }
	    for (i = 0; i < token.length; i++) {
	        tokens[token[i]] = func;
	    }
	}

	function addWeekParseToken (token, callback) {
	    addParseToken(token, function (input, array, config, token) {
	        config._w = config._w || {};
	        callback(input, config._w, config, token);
	    });
	}

	function addTimeToArrayFromToken(token, input, config) {
	    if (input != null && hasOwnProp(tokens, token)) {
	        tokens[token](input, config._a, config, token);
	    }
	}

	var YEAR = 0;
	var MONTH = 1;
	var DATE = 2;
	var HOUR = 3;
	var MINUTE = 4;
	var SECOND = 5;
	var MILLISECOND = 6;
	var WEEK = 7;
	var WEEKDAY = 8;

	var indexOf;

	if (Array.prototype.indexOf) {
	    indexOf = Array.prototype.indexOf;
	} else {
	    indexOf = function (o) {
	        // I know
	        var i;
	        for (i = 0; i < this.length; ++i) {
	            if (this[i] === o) {
	                return i;
	            }
	        }
	        return -1;
	    };
	}

	var indexOf$1 = indexOf;

	function daysInMonth(year, month) {
	    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	}

	// FORMATTING

	addFormatToken('M', ['MM', 2], 'Mo', function () {
	    return this.month() + 1;
	});

	addFormatToken('MMM', 0, 0, function (format) {
	    return this.localeData().monthsShort(this, format);
	});

	addFormatToken('MMMM', 0, 0, function (format) {
	    return this.localeData().months(this, format);
	});

	// ALIASES

	addUnitAlias('month', 'M');

	// PRIORITY

	addUnitPriority('month', 8);

	// PARSING

	addRegexToken('M',    match1to2);
	addRegexToken('MM',   match1to2, match2);
	addRegexToken('MMM',  function (isStrict, locale) {
	    return locale.monthsShortRegex(isStrict);
	});
	addRegexToken('MMMM', function (isStrict, locale) {
	    return locale.monthsRegex(isStrict);
	});

	addParseToken(['M', 'MM'], function (input, array) {
	    array[MONTH] = toInt(input) - 1;
	});

	addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
	    var month = config._locale.monthsParse(input, token, config._strict);
	    // if we didn't find a month name, mark the date as invalid.
	    if (month != null) {
	        array[MONTH] = month;
	    } else {
	        getParsingFlags(config).invalidMonth = input;
	    }
	});

	// LOCALES

	var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
	var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
	function localeMonths (m, format) {
	    if (!m) {
	        return this._months;
	    }
	    return isArray(this._months) ? this._months[m.month()] :
	        this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
	}

	var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
	function localeMonthsShort (m, format) {
	    if (!m) {
	        return this._monthsShort;
	    }
	    return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
	        this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
	}

	function handleStrictParse(monthName, format, strict) {
	    var i, ii, mom, llc = monthName.toLocaleLowerCase();
	    if (!this._monthsParse) {
	        // this is not used
	        this._monthsParse = [];
	        this._longMonthsParse = [];
	        this._shortMonthsParse = [];
	        for (i = 0; i < 12; ++i) {
	            mom = createUTC([2000, i]);
	            this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
	            this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
	        }
	    }

	    if (strict) {
	        if (format === 'MMM') {
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    } else {
	        if (format === 'MMM') {
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._longMonthsParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortMonthsParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    }
	}

	function localeMonthsParse (monthName, format, strict) {
	    var i, mom, regex;

	    if (this._monthsParseExact) {
	        return handleStrictParse.call(this, monthName, format, strict);
	    }

	    if (!this._monthsParse) {
	        this._monthsParse = [];
	        this._longMonthsParse = [];
	        this._shortMonthsParse = [];
	    }

	    // TODO: add sorting
	    // Sorting makes sure if one month (or abbr) is a prefix of another
	    // see sorting in computeMonthsParse
	    for (i = 0; i < 12; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, i]);
	        if (strict && !this._longMonthsParse[i]) {
	            this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
	            this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
	        }
	        if (!strict && !this._monthsParse[i]) {
	            regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
	            this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
	        }
	        // test the regex
	        if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
	            return i;
	        } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
	            return i;
	        } else if (!strict && this._monthsParse[i].test(monthName)) {
	            return i;
	        }
	    }
	}

	// MOMENTS

	function setMonth (mom, value) {
	    var dayOfMonth;

	    if (!mom.isValid()) {
	        // No op
	        return mom;
	    }

	    if (typeof value === 'string') {
	        if (/^\d+$/.test(value)) {
	            value = toInt(value);
	        } else {
	            value = mom.localeData().monthsParse(value);
	            // TODO: Another silent failure?
	            if (!isNumber(value)) {
	                return mom;
	            }
	        }
	    }

	    dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
	    mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
	    return mom;
	}

	function getSetMonth (value) {
	    if (value != null) {
	        setMonth(this, value);
	        hooks.updateOffset(this, true);
	        return this;
	    } else {
	        return get(this, 'Month');
	    }
	}

	function getDaysInMonth () {
	    return daysInMonth(this.year(), this.month());
	}

	var defaultMonthsShortRegex = matchWord;
	function monthsShortRegex (isStrict) {
	    if (this._monthsParseExact) {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            computeMonthsParse.call(this);
	        }
	        if (isStrict) {
	            return this._monthsShortStrictRegex;
	        } else {
	            return this._monthsShortRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_monthsShortRegex')) {
	            this._monthsShortRegex = defaultMonthsShortRegex;
	        }
	        return this._monthsShortStrictRegex && isStrict ?
	            this._monthsShortStrictRegex : this._monthsShortRegex;
	    }
	}

	var defaultMonthsRegex = matchWord;
	function monthsRegex (isStrict) {
	    if (this._monthsParseExact) {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            computeMonthsParse.call(this);
	        }
	        if (isStrict) {
	            return this._monthsStrictRegex;
	        } else {
	            return this._monthsRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_monthsRegex')) {
	            this._monthsRegex = defaultMonthsRegex;
	        }
	        return this._monthsStrictRegex && isStrict ?
	            this._monthsStrictRegex : this._monthsRegex;
	    }
	}

	function computeMonthsParse () {
	    function cmpLenRev(a, b) {
	        return b.length - a.length;
	    }

	    var shortPieces = [], longPieces = [], mixedPieces = [],
	        i, mom;
	    for (i = 0; i < 12; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, i]);
	        shortPieces.push(this.monthsShort(mom, ''));
	        longPieces.push(this.months(mom, ''));
	        mixedPieces.push(this.months(mom, ''));
	        mixedPieces.push(this.monthsShort(mom, ''));
	    }
	    // Sorting makes sure if one month (or abbr) is a prefix of another it
	    // will match the longer piece.
	    shortPieces.sort(cmpLenRev);
	    longPieces.sort(cmpLenRev);
	    mixedPieces.sort(cmpLenRev);
	    for (i = 0; i < 12; i++) {
	        shortPieces[i] = regexEscape(shortPieces[i]);
	        longPieces[i] = regexEscape(longPieces[i]);
	    }
	    for (i = 0; i < 24; i++) {
	        mixedPieces[i] = regexEscape(mixedPieces[i]);
	    }

	    this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	    this._monthsShortRegex = this._monthsRegex;
	    this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	    this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	}

	// FORMATTING

	addFormatToken('Y', 0, 0, function () {
	    var y = this.year();
	    return y <= 9999 ? '' + y : '+' + y;
	});

	addFormatToken(0, ['YY', 2], 0, function () {
	    return this.year() % 100;
	});

	addFormatToken(0, ['YYYY',   4],       0, 'year');
	addFormatToken(0, ['YYYYY',  5],       0, 'year');
	addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

	// ALIASES

	addUnitAlias('year', 'y');

	// PRIORITIES

	addUnitPriority('year', 1);

	// PARSING

	addRegexToken('Y',      matchSigned);
	addRegexToken('YY',     match1to2, match2);
	addRegexToken('YYYY',   match1to4, match4);
	addRegexToken('YYYYY',  match1to6, match6);
	addRegexToken('YYYYYY', match1to6, match6);

	addParseToken(['YYYYY', 'YYYYYY'], YEAR);
	addParseToken('YYYY', function (input, array) {
	    array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
	});
	addParseToken('YY', function (input, array) {
	    array[YEAR] = hooks.parseTwoDigitYear(input);
	});
	addParseToken('Y', function (input, array) {
	    array[YEAR] = parseInt(input, 10);
	});

	// HELPERS

	function daysInYear(year) {
	    return isLeapYear(year) ? 366 : 365;
	}

	function isLeapYear(year) {
	    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	}

	// HOOKS

	hooks.parseTwoDigitYear = function (input) {
	    return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
	};

	// MOMENTS

	var getSetYear = makeGetSet('FullYear', true);

	function getIsLeapYear () {
	    return isLeapYear(this.year());
	}

	function createDate (y, m, d, h, M, s, ms) {
	    //can't just apply() to create a date:
	    //http://stackoverflow.com/questions/181348/instantiating-a-javascript-object-by-calling-prototype-constructor-apply
	    var date = new Date(y, m, d, h, M, s, ms);

	    //the date constructor remaps years 0-99 to 1900-1999
	    if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
	        date.setFullYear(y);
	    }
	    return date;
	}

	function createUTCDate (y) {
	    var date = new Date(Date.UTC.apply(null, arguments));

	    //the Date.UTC function remaps years 0-99 to 1900-1999
	    if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
	        date.setUTCFullYear(y);
	    }
	    return date;
	}

	// start-of-first-week - start-of-year
	function firstWeekOffset(year, dow, doy) {
	    var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
	        fwd = 7 + dow - doy,
	        // first-week day local weekday -- which local weekday is fwd
	        fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

	    return -fwdlw + fwd - 1;
	}

	//http://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
	function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
	    var localWeekday = (7 + weekday - dow) % 7,
	        weekOffset = firstWeekOffset(year, dow, doy),
	        dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
	        resYear, resDayOfYear;

	    if (dayOfYear <= 0) {
	        resYear = year - 1;
	        resDayOfYear = daysInYear(resYear) + dayOfYear;
	    } else if (dayOfYear > daysInYear(year)) {
	        resYear = year + 1;
	        resDayOfYear = dayOfYear - daysInYear(year);
	    } else {
	        resYear = year;
	        resDayOfYear = dayOfYear;
	    }

	    return {
	        year: resYear,
	        dayOfYear: resDayOfYear
	    };
	}

	function weekOfYear(mom, dow, doy) {
	    var weekOffset = firstWeekOffset(mom.year(), dow, doy),
	        week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
	        resWeek, resYear;

	    if (week < 1) {
	        resYear = mom.year() - 1;
	        resWeek = week + weeksInYear(resYear, dow, doy);
	    } else if (week > weeksInYear(mom.year(), dow, doy)) {
	        resWeek = week - weeksInYear(mom.year(), dow, doy);
	        resYear = mom.year() + 1;
	    } else {
	        resYear = mom.year();
	        resWeek = week;
	    }

	    return {
	        week: resWeek,
	        year: resYear
	    };
	}

	function weeksInYear(year, dow, doy) {
	    var weekOffset = firstWeekOffset(year, dow, doy),
	        weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
	    return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
	}

	// FORMATTING

	addFormatToken('w', ['ww', 2], 'wo', 'week');
	addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

	// ALIASES

	addUnitAlias('week', 'w');
	addUnitAlias('isoWeek', 'W');

	// PRIORITIES

	addUnitPriority('week', 5);
	addUnitPriority('isoWeek', 5);

	// PARSING

	addRegexToken('w',  match1to2);
	addRegexToken('ww', match1to2, match2);
	addRegexToken('W',  match1to2);
	addRegexToken('WW', match1to2, match2);

	addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
	    week[token.substr(0, 1)] = toInt(input);
	});

	// HELPERS

	// LOCALES

	function localeWeek (mom) {
	    return weekOfYear(mom, this._week.dow, this._week.doy).week;
	}

	var defaultLocaleWeek = {
	    dow : 0, // Sunday is the first day of the week.
	    doy : 6  // The week that contains Jan 1st is the first week of the year.
	};

	function localeFirstDayOfWeek () {
	    return this._week.dow;
	}

	function localeFirstDayOfYear () {
	    return this._week.doy;
	}

	// MOMENTS

	function getSetWeek (input) {
	    var week = this.localeData().week(this);
	    return input == null ? week : this.add((input - week) * 7, 'd');
	}

	function getSetISOWeek (input) {
	    var week = weekOfYear(this, 1, 4).week;
	    return input == null ? week : this.add((input - week) * 7, 'd');
	}

	// FORMATTING

	addFormatToken('d', 0, 'do', 'day');

	addFormatToken('dd', 0, 0, function (format) {
	    return this.localeData().weekdaysMin(this, format);
	});

	addFormatToken('ddd', 0, 0, function (format) {
	    return this.localeData().weekdaysShort(this, format);
	});

	addFormatToken('dddd', 0, 0, function (format) {
	    return this.localeData().weekdays(this, format);
	});

	addFormatToken('e', 0, 0, 'weekday');
	addFormatToken('E', 0, 0, 'isoWeekday');

	// ALIASES

	addUnitAlias('day', 'd');
	addUnitAlias('weekday', 'e');
	addUnitAlias('isoWeekday', 'E');

	// PRIORITY
	addUnitPriority('day', 11);
	addUnitPriority('weekday', 11);
	addUnitPriority('isoWeekday', 11);

	// PARSING

	addRegexToken('d',    match1to2);
	addRegexToken('e',    match1to2);
	addRegexToken('E',    match1to2);
	addRegexToken('dd',   function (isStrict, locale) {
	    return locale.weekdaysMinRegex(isStrict);
	});
	addRegexToken('ddd',   function (isStrict, locale) {
	    return locale.weekdaysShortRegex(isStrict);
	});
	addRegexToken('dddd',   function (isStrict, locale) {
	    return locale.weekdaysRegex(isStrict);
	});

	addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
	    var weekday = config._locale.weekdaysParse(input, token, config._strict);
	    // if we didn't get a weekday name, mark the date as invalid
	    if (weekday != null) {
	        week.d = weekday;
	    } else {
	        getParsingFlags(config).invalidWeekday = input;
	    }
	});

	addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
	    week[token] = toInt(input);
	});

	// HELPERS

	function parseWeekday(input, locale) {
	    if (typeof input !== 'string') {
	        return input;
	    }

	    if (!isNaN(input)) {
	        return parseInt(input, 10);
	    }

	    input = locale.weekdaysParse(input);
	    if (typeof input === 'number') {
	        return input;
	    }

	    return null;
	}

	function parseIsoWeekday(input, locale) {
	    if (typeof input === 'string') {
	        return locale.weekdaysParse(input) % 7 || 7;
	    }
	    return isNaN(input) ? null : input;
	}

	// LOCALES

	var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
	function localeWeekdays (m, format) {
	    if (!m) {
	        return this._weekdays;
	    }
	    return isArray(this._weekdays) ? this._weekdays[m.day()] :
	        this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
	}

	var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
	function localeWeekdaysShort (m) {
	    return (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
	}

	var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
	function localeWeekdaysMin (m) {
	    return (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
	}

	function handleStrictParse$1(weekdayName, format, strict) {
	    var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
	    if (!this._weekdaysParse) {
	        this._weekdaysParse = [];
	        this._shortWeekdaysParse = [];
	        this._minWeekdaysParse = [];

	        for (i = 0; i < 7; ++i) {
	            mom = createUTC([2000, 1]).day(i);
	            this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
	            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
	            this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
	        }
	    }

	    if (strict) {
	        if (format === 'dddd') {
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else if (format === 'ddd') {
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    } else {
	        if (format === 'dddd') {
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else if (format === 'ddd') {
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        } else {
	            ii = indexOf$1.call(this._minWeekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._weekdaysParse, llc);
	            if (ii !== -1) {
	                return ii;
	            }
	            ii = indexOf$1.call(this._shortWeekdaysParse, llc);
	            return ii !== -1 ? ii : null;
	        }
	    }
	}

	function localeWeekdaysParse (weekdayName, format, strict) {
	    var i, mom, regex;

	    if (this._weekdaysParseExact) {
	        return handleStrictParse$1.call(this, weekdayName, format, strict);
	    }

	    if (!this._weekdaysParse) {
	        this._weekdaysParse = [];
	        this._minWeekdaysParse = [];
	        this._shortWeekdaysParse = [];
	        this._fullWeekdaysParse = [];
	    }

	    for (i = 0; i < 7; i++) {
	        // make the regex if we don't have it already

	        mom = createUTC([2000, 1]).day(i);
	        if (strict && !this._fullWeekdaysParse[i]) {
	            this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
	            this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
	            this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
	        }
	        if (!this._weekdaysParse[i]) {
	            regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
	            this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
	        }
	        // test the regex
	        if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
	            return i;
	        } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
	            return i;
	        }
	    }
	}

	// MOMENTS

	function getSetDayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
	    if (input != null) {
	        input = parseWeekday(input, this.localeData());
	        return this.add(input - day, 'd');
	    } else {
	        return day;
	    }
	}

	function getSetLocaleDayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
	    return input == null ? weekday : this.add(input - weekday, 'd');
	}

	function getSetISODayOfWeek (input) {
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }

	    // behaves the same as moment#day except
	    // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
	    // as a setter, sunday should belong to the previous week.

	    if (input != null) {
	        var weekday = parseIsoWeekday(input, this.localeData());
	        return this.day(this.day() % 7 ? weekday : weekday - 7);
	    } else {
	        return this.day() || 7;
	    }
	}

	var defaultWeekdaysRegex = matchWord;
	function weekdaysRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysStrictRegex;
	        } else {
	            return this._weekdaysRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            this._weekdaysRegex = defaultWeekdaysRegex;
	        }
	        return this._weekdaysStrictRegex && isStrict ?
	            this._weekdaysStrictRegex : this._weekdaysRegex;
	    }
	}

	var defaultWeekdaysShortRegex = matchWord;
	function weekdaysShortRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysShortStrictRegex;
	        } else {
	            return this._weekdaysShortRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysShortRegex')) {
	            this._weekdaysShortRegex = defaultWeekdaysShortRegex;
	        }
	        return this._weekdaysShortStrictRegex && isStrict ?
	            this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
	    }
	}

	var defaultWeekdaysMinRegex = matchWord;
	function weekdaysMinRegex (isStrict) {
	    if (this._weekdaysParseExact) {
	        if (!hasOwnProp(this, '_weekdaysRegex')) {
	            computeWeekdaysParse.call(this);
	        }
	        if (isStrict) {
	            return this._weekdaysMinStrictRegex;
	        } else {
	            return this._weekdaysMinRegex;
	        }
	    } else {
	        if (!hasOwnProp(this, '_weekdaysMinRegex')) {
	            this._weekdaysMinRegex = defaultWeekdaysMinRegex;
	        }
	        return this._weekdaysMinStrictRegex && isStrict ?
	            this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
	    }
	}


	function computeWeekdaysParse () {
	    function cmpLenRev(a, b) {
	        return b.length - a.length;
	    }

	    var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
	        i, mom, minp, shortp, longp;
	    for (i = 0; i < 7; i++) {
	        // make the regex if we don't have it already
	        mom = createUTC([2000, 1]).day(i);
	        minp = this.weekdaysMin(mom, '');
	        shortp = this.weekdaysShort(mom, '');
	        longp = this.weekdays(mom, '');
	        minPieces.push(minp);
	        shortPieces.push(shortp);
	        longPieces.push(longp);
	        mixedPieces.push(minp);
	        mixedPieces.push(shortp);
	        mixedPieces.push(longp);
	    }
	    // Sorting makes sure if one weekday (or abbr) is a prefix of another it
	    // will match the longer piece.
	    minPieces.sort(cmpLenRev);
	    shortPieces.sort(cmpLenRev);
	    longPieces.sort(cmpLenRev);
	    mixedPieces.sort(cmpLenRev);
	    for (i = 0; i < 7; i++) {
	        shortPieces[i] = regexEscape(shortPieces[i]);
	        longPieces[i] = regexEscape(longPieces[i]);
	        mixedPieces[i] = regexEscape(mixedPieces[i]);
	    }

	    this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
	    this._weekdaysShortRegex = this._weekdaysRegex;
	    this._weekdaysMinRegex = this._weekdaysRegex;

	    this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
	    this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
	    this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
	}

	// FORMATTING

	function hFormat() {
	    return this.hours() % 12 || 12;
	}

	function kFormat() {
	    return this.hours() || 24;
	}

	addFormatToken('H', ['HH', 2], 0, 'hour');
	addFormatToken('h', ['hh', 2], 0, hFormat);
	addFormatToken('k', ['kk', 2], 0, kFormat);

	addFormatToken('hmm', 0, 0, function () {
	    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
	});

	addFormatToken('hmmss', 0, 0, function () {
	    return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
	        zeroFill(this.seconds(), 2);
	});

	addFormatToken('Hmm', 0, 0, function () {
	    return '' + this.hours() + zeroFill(this.minutes(), 2);
	});

	addFormatToken('Hmmss', 0, 0, function () {
	    return '' + this.hours() + zeroFill(this.minutes(), 2) +
	        zeroFill(this.seconds(), 2);
	});

	function meridiem (token, lowercase) {
	    addFormatToken(token, 0, 0, function () {
	        return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
	    });
	}

	meridiem('a', true);
	meridiem('A', false);

	// ALIASES

	addUnitAlias('hour', 'h');

	// PRIORITY
	addUnitPriority('hour', 13);

	// PARSING

	function matchMeridiem (isStrict, locale) {
	    return locale._meridiemParse;
	}

	addRegexToken('a',  matchMeridiem);
	addRegexToken('A',  matchMeridiem);
	addRegexToken('H',  match1to2);
	addRegexToken('h',  match1to2);
	addRegexToken('HH', match1to2, match2);
	addRegexToken('hh', match1to2, match2);

	addRegexToken('hmm', match3to4);
	addRegexToken('hmmss', match5to6);
	addRegexToken('Hmm', match3to4);
	addRegexToken('Hmmss', match5to6);

	addParseToken(['H', 'HH'], HOUR);
	addParseToken(['a', 'A'], function (input, array, config) {
	    config._isPm = config._locale.isPM(input);
	    config._meridiem = input;
	});
	addParseToken(['h', 'hh'], function (input, array, config) {
	    array[HOUR] = toInt(input);
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('hmm', function (input, array, config) {
	    var pos = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos));
	    array[MINUTE] = toInt(input.substr(pos));
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('hmmss', function (input, array, config) {
	    var pos1 = input.length - 4;
	    var pos2 = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos1));
	    array[MINUTE] = toInt(input.substr(pos1, 2));
	    array[SECOND] = toInt(input.substr(pos2));
	    getParsingFlags(config).bigHour = true;
	});
	addParseToken('Hmm', function (input, array, config) {
	    var pos = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos));
	    array[MINUTE] = toInt(input.substr(pos));
	});
	addParseToken('Hmmss', function (input, array, config) {
	    var pos1 = input.length - 4;
	    var pos2 = input.length - 2;
	    array[HOUR] = toInt(input.substr(0, pos1));
	    array[MINUTE] = toInt(input.substr(pos1, 2));
	    array[SECOND] = toInt(input.substr(pos2));
	});

	// LOCALES

	function localeIsPM (input) {
	    // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
	    // Using charAt should be more compatible.
	    return ((input + '').toLowerCase().charAt(0) === 'p');
	}

	var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
	function localeMeridiem (hours, minutes, isLower) {
	    if (hours > 11) {
	        return isLower ? 'pm' : 'PM';
	    } else {
	        return isLower ? 'am' : 'AM';
	    }
	}


	// MOMENTS

	// Setting the hour should keep the time, because the user explicitly
	// specified which hour he wants. So trying to maintain the same hour (in
	// a new timezone) makes sense. Adding/subtracting hours does not follow
	// this rule.
	var getSetHour = makeGetSet('Hours', true);

	// months
	// week
	// weekdays
	// meridiem
	var baseConfig = {
	    calendar: defaultCalendar,
	    longDateFormat: defaultLongDateFormat,
	    invalidDate: defaultInvalidDate,
	    ordinal: defaultOrdinal,
	    ordinalParse: defaultOrdinalParse,
	    relativeTime: defaultRelativeTime,

	    months: defaultLocaleMonths,
	    monthsShort: defaultLocaleMonthsShort,

	    week: defaultLocaleWeek,

	    weekdays: defaultLocaleWeekdays,
	    weekdaysMin: defaultLocaleWeekdaysMin,
	    weekdaysShort: defaultLocaleWeekdaysShort,

	    meridiemParse: defaultLocaleMeridiemParse
	};

	// internal storage for locale config files
	var locales = {};
	var localeFamilies = {};
	var globalLocale;

	function normalizeLocale(key) {
	    return key ? key.toLowerCase().replace('_', '-') : key;
	}

	// pick the locale from the array
	// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
	// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
	function chooseLocale(names) {
	    var i = 0, j, next, locale, split;

	    while (i < names.length) {
	        split = normalizeLocale(names[i]).split('-');
	        j = split.length;
	        next = normalizeLocale(names[i + 1]);
	        next = next ? next.split('-') : null;
	        while (j > 0) {
	            locale = loadLocale(split.slice(0, j).join('-'));
	            if (locale) {
	                return locale;
	            }
	            if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
	                //the next array item is better than a shallower substring of this one
	                break;
	            }
	            j--;
	        }
	        i++;
	    }
	    return null;
	}

	function loadLocale(name) {
	    var oldLocale = null;
	    // TODO: Find a better way to register and load all the locales in Node
	    if (!locales[name] && (typeof module !== 'undefined') &&
	            module && module.exports) {
	        try {
	            oldLocale = globalLocale._abbr;
	            __webpack_require__(391)("./" + name);
	            // because defineLocale currently also sets the global locale, we
	            // want to undo that for lazy loaded locales
	            getSetGlobalLocale(oldLocale);
	        } catch (e) { }
	    }
	    return locales[name];
	}

	// This function will load locale and then set the global locale.  If
	// no arguments are passed in, it will simply return the current global
	// locale key.
	function getSetGlobalLocale (key, values) {
	    var data;
	    if (key) {
	        if (isUndefined(values)) {
	            data = getLocale(key);
	        }
	        else {
	            data = defineLocale(key, values);
	        }

	        if (data) {
	            // moment.duration._locale = moment._locale = data;
	            globalLocale = data;
	        }
	    }

	    return globalLocale._abbr;
	}

	function defineLocale (name, config) {
	    if (config !== null) {
	        var parentConfig = baseConfig;
	        config.abbr = name;
	        if (locales[name] != null) {
	            deprecateSimple('defineLocaleOverride',
	                    'use moment.updateLocale(localeName, config) to change ' +
	                    'an existing locale. moment.defineLocale(localeName, ' +
	                    'config) should only be used for creating a new locale ' +
	                    'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
	            parentConfig = locales[name]._config;
	        } else if (config.parentLocale != null) {
	            if (locales[config.parentLocale] != null) {
	                parentConfig = locales[config.parentLocale]._config;
	            } else {
	                if (!localeFamilies[config.parentLocale]) {
	                    localeFamilies[config.parentLocale] = [];
	                }
	                localeFamilies[config.parentLocale].push({
	                    name: name,
	                    config: config
	                });
	                return null;
	            }
	        }
	        locales[name] = new Locale(mergeConfigs(parentConfig, config));

	        if (localeFamilies[name]) {
	            localeFamilies[name].forEach(function (x) {
	                defineLocale(x.name, x.config);
	            });
	        }

	        // backwards compat for now: also set the locale
	        // make sure we set the locale AFTER all child locales have been
	        // created, so we won't end up with the child locale set.
	        getSetGlobalLocale(name);


	        return locales[name];
	    } else {
	        // useful for testing
	        delete locales[name];
	        return null;
	    }
	}

	function updateLocale(name, config) {
	    if (config != null) {
	        var locale, parentConfig = baseConfig;
	        // MERGE
	        if (locales[name] != null) {
	            parentConfig = locales[name]._config;
	        }
	        config = mergeConfigs(parentConfig, config);
	        locale = new Locale(config);
	        locale.parentLocale = locales[name];
	        locales[name] = locale;

	        // backwards compat for now: also set the locale
	        getSetGlobalLocale(name);
	    } else {
	        // pass null for config to unupdate, useful for tests
	        if (locales[name] != null) {
	            if (locales[name].parentLocale != null) {
	                locales[name] = locales[name].parentLocale;
	            } else if (locales[name] != null) {
	                delete locales[name];
	            }
	        }
	    }
	    return locales[name];
	}

	// returns locale data
	function getLocale (key) {
	    var locale;

	    if (key && key._locale && key._locale._abbr) {
	        key = key._locale._abbr;
	    }

	    if (!key) {
	        return globalLocale;
	    }

	    if (!isArray(key)) {
	        //short-circuit everything else
	        locale = loadLocale(key);
	        if (locale) {
	            return locale;
	        }
	        key = [key];
	    }

	    return chooseLocale(key);
	}

	function listLocales() {
	    return keys$1(locales);
	}

	function checkOverflow (m) {
	    var overflow;
	    var a = m._a;

	    if (a && getParsingFlags(m).overflow === -2) {
	        overflow =
	            a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
	            a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
	            a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
	            a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
	            a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
	            a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
	            -1;

	        if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
	            overflow = DATE;
	        }
	        if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
	            overflow = WEEK;
	        }
	        if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
	            overflow = WEEKDAY;
	        }

	        getParsingFlags(m).overflow = overflow;
	    }

	    return m;
	}

	// iso 8601 regex
	// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
	var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
	var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

	var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

	var isoDates = [
	    ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
	    ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
	    ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
	    ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
	    ['YYYY-DDD', /\d{4}-\d{3}/],
	    ['YYYY-MM', /\d{4}-\d\d/, false],
	    ['YYYYYYMMDD', /[+-]\d{10}/],
	    ['YYYYMMDD', /\d{8}/],
	    // YYYYMM is NOT allowed by the standard
	    ['GGGG[W]WWE', /\d{4}W\d{3}/],
	    ['GGGG[W]WW', /\d{4}W\d{2}/, false],
	    ['YYYYDDD', /\d{7}/]
	];

	// iso time formats and regexes
	var isoTimes = [
	    ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
	    ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
	    ['HH:mm:ss', /\d\d:\d\d:\d\d/],
	    ['HH:mm', /\d\d:\d\d/],
	    ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
	    ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
	    ['HHmmss', /\d\d\d\d\d\d/],
	    ['HHmm', /\d\d\d\d/],
	    ['HH', /\d\d/]
	];

	var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

	// date from iso format
	function configFromISO(config) {
	    var i, l,
	        string = config._i,
	        match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
	        allowTime, dateFormat, timeFormat, tzFormat;

	    if (match) {
	        getParsingFlags(config).iso = true;

	        for (i = 0, l = isoDates.length; i < l; i++) {
	            if (isoDates[i][1].exec(match[1])) {
	                dateFormat = isoDates[i][0];
	                allowTime = isoDates[i][2] !== false;
	                break;
	            }
	        }
	        if (dateFormat == null) {
	            config._isValid = false;
	            return;
	        }
	        if (match[3]) {
	            for (i = 0, l = isoTimes.length; i < l; i++) {
	                if (isoTimes[i][1].exec(match[3])) {
	                    // match[2] should be 'T' or space
	                    timeFormat = (match[2] || ' ') + isoTimes[i][0];
	                    break;
	                }
	            }
	            if (timeFormat == null) {
	                config._isValid = false;
	                return;
	            }
	        }
	        if (!allowTime && timeFormat != null) {
	            config._isValid = false;
	            return;
	        }
	        if (match[4]) {
	            if (tzRegex.exec(match[4])) {
	                tzFormat = 'Z';
	            } else {
	                config._isValid = false;
	                return;
	            }
	        }
	        config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
	        configFromStringAndFormat(config);
	    } else {
	        config._isValid = false;
	    }
	}

	// date from iso format or fallback
	function configFromString(config) {
	    var matched = aspNetJsonRegex.exec(config._i);

	    if (matched !== null) {
	        config._d = new Date(+matched[1]);
	        return;
	    }

	    configFromISO(config);
	    if (config._isValid === false) {
	        delete config._isValid;
	        hooks.createFromInputFallback(config);
	    }
	}

	hooks.createFromInputFallback = deprecate(
	    'value provided is not in a recognized ISO format. moment construction falls back to js Date(), ' +
	    'which is not reliable across all browsers and versions. Non ISO date formats are ' +
	    'discouraged and will be removed in an upcoming major release. Please refer to ' +
	    'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
	    function (config) {
	        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
	    }
	);

	// Pick the first defined of two or three arguments.
	function defaults(a, b, c) {
	    if (a != null) {
	        return a;
	    }
	    if (b != null) {
	        return b;
	    }
	    return c;
	}

	function currentDateArray(config) {
	    // hooks is actually the exported moment object
	    var nowValue = new Date(hooks.now());
	    if (config._useUTC) {
	        return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
	    }
	    return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
	}

	// convert an array to a date.
	// the array should mirror the parameters below
	// note: all values past the year are optional and will default to the lowest possible value.
	// [year, month, day , hour, minute, second, millisecond]
	function configFromArray (config) {
	    var i, date, input = [], currentDate, yearToUse;

	    if (config._d) {
	        return;
	    }

	    currentDate = currentDateArray(config);

	    //compute day of the year from weeks and weekdays
	    if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
	        dayOfYearFromWeekInfo(config);
	    }

	    //if the day of the year is set, figure out what it is
	    if (config._dayOfYear) {
	        yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

	        if (config._dayOfYear > daysInYear(yearToUse)) {
	            getParsingFlags(config)._overflowDayOfYear = true;
	        }

	        date = createUTCDate(yearToUse, 0, config._dayOfYear);
	        config._a[MONTH] = date.getUTCMonth();
	        config._a[DATE] = date.getUTCDate();
	    }

	    // Default to current date.
	    // * if no year, month, day of month are given, default to today
	    // * if day of month is given, default month and year
	    // * if month is given, default only year
	    // * if year is given, don't default anything
	    for (i = 0; i < 3 && config._a[i] == null; ++i) {
	        config._a[i] = input[i] = currentDate[i];
	    }

	    // Zero out whatever was not defaulted, including time
	    for (; i < 7; i++) {
	        config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
	    }

	    // Check for 24:00:00.000
	    if (config._a[HOUR] === 24 &&
	            config._a[MINUTE] === 0 &&
	            config._a[SECOND] === 0 &&
	            config._a[MILLISECOND] === 0) {
	        config._nextDay = true;
	        config._a[HOUR] = 0;
	    }

	    config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
	    // Apply timezone offset from input. The actual utcOffset can be changed
	    // with parseZone.
	    if (config._tzm != null) {
	        config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
	    }

	    if (config._nextDay) {
	        config._a[HOUR] = 24;
	    }
	}

	function dayOfYearFromWeekInfo(config) {
	    var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

	    w = config._w;
	    if (w.GG != null || w.W != null || w.E != null) {
	        dow = 1;
	        doy = 4;

	        // TODO: We need to take the current isoWeekYear, but that depends on
	        // how we interpret now (local, utc, fixed offset). So create
	        // a now version of current config (take local/utc/offset flags, and
	        // create now).
	        weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
	        week = defaults(w.W, 1);
	        weekday = defaults(w.E, 1);
	        if (weekday < 1 || weekday > 7) {
	            weekdayOverflow = true;
	        }
	    } else {
	        dow = config._locale._week.dow;
	        doy = config._locale._week.doy;

	        var curWeek = weekOfYear(createLocal(), dow, doy);

	        weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

	        // Default to current week.
	        week = defaults(w.w, curWeek.week);

	        if (w.d != null) {
	            // weekday -- low day numbers are considered next week
	            weekday = w.d;
	            if (weekday < 0 || weekday > 6) {
	                weekdayOverflow = true;
	            }
	        } else if (w.e != null) {
	            // local weekday -- counting starts from begining of week
	            weekday = w.e + dow;
	            if (w.e < 0 || w.e > 6) {
	                weekdayOverflow = true;
	            }
	        } else {
	            // default to begining of week
	            weekday = dow;
	        }
	    }
	    if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
	        getParsingFlags(config)._overflowWeeks = true;
	    } else if (weekdayOverflow != null) {
	        getParsingFlags(config)._overflowWeekday = true;
	    } else {
	        temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
	        config._a[YEAR] = temp.year;
	        config._dayOfYear = temp.dayOfYear;
	    }
	}

	// constant that refers to the ISO standard
	hooks.ISO_8601 = function () {};

	// date from string and format string
	function configFromStringAndFormat(config) {
	    // TODO: Move this to another part of the creation flow to prevent circular deps
	    if (config._f === hooks.ISO_8601) {
	        configFromISO(config);
	        return;
	    }

	    config._a = [];
	    getParsingFlags(config).empty = true;

	    // This array is used to make a Date, either with `new Date` or `Date.UTC`
	    var string = '' + config._i,
	        i, parsedInput, tokens, token, skipped,
	        stringLength = string.length,
	        totalParsedInputLength = 0;

	    tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

	    for (i = 0; i < tokens.length; i++) {
	        token = tokens[i];
	        parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
	        // console.log('token', token, 'parsedInput', parsedInput,
	        //         'regex', getParseRegexForToken(token, config));
	        if (parsedInput) {
	            skipped = string.substr(0, string.indexOf(parsedInput));
	            if (skipped.length > 0) {
	                getParsingFlags(config).unusedInput.push(skipped);
	            }
	            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
	            totalParsedInputLength += parsedInput.length;
	        }
	        // don't parse if it's not a known token
	        if (formatTokenFunctions[token]) {
	            if (parsedInput) {
	                getParsingFlags(config).empty = false;
	            }
	            else {
	                getParsingFlags(config).unusedTokens.push(token);
	            }
	            addTimeToArrayFromToken(token, parsedInput, config);
	        }
	        else if (config._strict && !parsedInput) {
	            getParsingFlags(config).unusedTokens.push(token);
	        }
	    }

	    // add remaining unparsed input length to the string
	    getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
	    if (string.length > 0) {
	        getParsingFlags(config).unusedInput.push(string);
	    }

	    // clear _12h flag if hour is <= 12
	    if (config._a[HOUR] <= 12 &&
	        getParsingFlags(config).bigHour === true &&
	        config._a[HOUR] > 0) {
	        getParsingFlags(config).bigHour = undefined;
	    }

	    getParsingFlags(config).parsedDateParts = config._a.slice(0);
	    getParsingFlags(config).meridiem = config._meridiem;
	    // handle meridiem
	    config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

	    configFromArray(config);
	    checkOverflow(config);
	}


	function meridiemFixWrap (locale, hour, meridiem) {
	    var isPm;

	    if (meridiem == null) {
	        // nothing to do
	        return hour;
	    }
	    if (locale.meridiemHour != null) {
	        return locale.meridiemHour(hour, meridiem);
	    } else if (locale.isPM != null) {
	        // Fallback
	        isPm = locale.isPM(meridiem);
	        if (isPm && hour < 12) {
	            hour += 12;
	        }
	        if (!isPm && hour === 12) {
	            hour = 0;
	        }
	        return hour;
	    } else {
	        // this is not supposed to happen
	        return hour;
	    }
	}

	// date from string and array of format strings
	function configFromStringAndArray(config) {
	    var tempConfig,
	        bestMoment,

	        scoreToBeat,
	        i,
	        currentScore;

	    if (config._f.length === 0) {
	        getParsingFlags(config).invalidFormat = true;
	        config._d = new Date(NaN);
	        return;
	    }

	    for (i = 0; i < config._f.length; i++) {
	        currentScore = 0;
	        tempConfig = copyConfig({}, config);
	        if (config._useUTC != null) {
	            tempConfig._useUTC = config._useUTC;
	        }
	        tempConfig._f = config._f[i];
	        configFromStringAndFormat(tempConfig);

	        if (!isValid(tempConfig)) {
	            continue;
	        }

	        // if there is any input that was not parsed add a penalty for that format
	        currentScore += getParsingFlags(tempConfig).charsLeftOver;

	        //or tokens
	        currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

	        getParsingFlags(tempConfig).score = currentScore;

	        if (scoreToBeat == null || currentScore < scoreToBeat) {
	            scoreToBeat = currentScore;
	            bestMoment = tempConfig;
	        }
	    }

	    extend(config, bestMoment || tempConfig);
	}

	function configFromObject(config) {
	    if (config._d) {
	        return;
	    }

	    var i = normalizeObjectUnits(config._i);
	    config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
	        return obj && parseInt(obj, 10);
	    });

	    configFromArray(config);
	}

	function createFromConfig (config) {
	    var res = new Moment(checkOverflow(prepareConfig(config)));
	    if (res._nextDay) {
	        // Adding is smart enough around DST
	        res.add(1, 'd');
	        res._nextDay = undefined;
	    }

	    return res;
	}

	function prepareConfig (config) {
	    var input = config._i,
	        format = config._f;

	    config._locale = config._locale || getLocale(config._l);

	    if (input === null || (format === undefined && input === '')) {
	        return createInvalid({nullInput: true});
	    }

	    if (typeof input === 'string') {
	        config._i = input = config._locale.preparse(input);
	    }

	    if (isMoment(input)) {
	        return new Moment(checkOverflow(input));
	    } else if (isDate(input)) {
	        config._d = input;
	    } else if (isArray(format)) {
	        configFromStringAndArray(config);
	    } else if (format) {
	        configFromStringAndFormat(config);
	    }  else {
	        configFromInput(config);
	    }

	    if (!isValid(config)) {
	        config._d = null;
	    }

	    return config;
	}

	function configFromInput(config) {
	    var input = config._i;
	    if (input === undefined) {
	        config._d = new Date(hooks.now());
	    } else if (isDate(input)) {
	        config._d = new Date(input.valueOf());
	    } else if (typeof input === 'string') {
	        configFromString(config);
	    } else if (isArray(input)) {
	        config._a = map(input.slice(0), function (obj) {
	            return parseInt(obj, 10);
	        });
	        configFromArray(config);
	    } else if (typeof(input) === 'object') {
	        configFromObject(config);
	    } else if (isNumber(input)) {
	        // from milliseconds
	        config._d = new Date(input);
	    } else {
	        hooks.createFromInputFallback(config);
	    }
	}

	function createLocalOrUTC (input, format, locale, strict, isUTC) {
	    var c = {};

	    if (locale === true || locale === false) {
	        strict = locale;
	        locale = undefined;
	    }

	    if ((isObject(input) && isObjectEmpty(input)) ||
	            (isArray(input) && input.length === 0)) {
	        input = undefined;
	    }
	    // object construction must be done this way.
	    // https://github.com/moment/moment/issues/1423
	    c._isAMomentObject = true;
	    c._useUTC = c._isUTC = isUTC;
	    c._l = locale;
	    c._i = input;
	    c._f = format;
	    c._strict = strict;

	    return createFromConfig(c);
	}

	function createLocal (input, format, locale, strict) {
	    return createLocalOrUTC(input, format, locale, strict, false);
	}

	var prototypeMin = deprecate(
	    'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
	    function () {
	        var other = createLocal.apply(null, arguments);
	        if (this.isValid() && other.isValid()) {
	            return other < this ? this : other;
	        } else {
	            return createInvalid();
	        }
	    }
	);

	var prototypeMax = deprecate(
	    'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
	    function () {
	        var other = createLocal.apply(null, arguments);
	        if (this.isValid() && other.isValid()) {
	            return other > this ? this : other;
	        } else {
	            return createInvalid();
	        }
	    }
	);

	// Pick a moment m from moments so that m[fn](other) is true for all
	// other. This relies on the function fn to be transitive.
	//
	// moments should either be an array of moment objects or an array, whose
	// first element is an array of moment objects.
	function pickBy(fn, moments) {
	    var res, i;
	    if (moments.length === 1 && isArray(moments[0])) {
	        moments = moments[0];
	    }
	    if (!moments.length) {
	        return createLocal();
	    }
	    res = moments[0];
	    for (i = 1; i < moments.length; ++i) {
	        if (!moments[i].isValid() || moments[i][fn](res)) {
	            res = moments[i];
	        }
	    }
	    return res;
	}

	// TODO: Use [].sort instead?
	function min () {
	    var args = [].slice.call(arguments, 0);

	    return pickBy('isBefore', args);
	}

	function max () {
	    var args = [].slice.call(arguments, 0);

	    return pickBy('isAfter', args);
	}

	var now = function () {
	    return Date.now ? Date.now() : +(new Date());
	};

	function Duration (duration) {
	    var normalizedInput = normalizeObjectUnits(duration),
	        years = normalizedInput.year || 0,
	        quarters = normalizedInput.quarter || 0,
	        months = normalizedInput.month || 0,
	        weeks = normalizedInput.week || 0,
	        days = normalizedInput.day || 0,
	        hours = normalizedInput.hour || 0,
	        minutes = normalizedInput.minute || 0,
	        seconds = normalizedInput.second || 0,
	        milliseconds = normalizedInput.millisecond || 0;

	    // representation for dateAddRemove
	    this._milliseconds = +milliseconds +
	        seconds * 1e3 + // 1000
	        minutes * 6e4 + // 1000 * 60
	        hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
	    // Because of dateAddRemove treats 24 hours as different from a
	    // day when working around DST, we need to store them separately
	    this._days = +days +
	        weeks * 7;
	    // It is impossible translate months into days without knowing
	    // which months you are are talking about, so we have to store
	    // it separately.
	    this._months = +months +
	        quarters * 3 +
	        years * 12;

	    this._data = {};

	    this._locale = getLocale();

	    this._bubble();
	}

	function isDuration (obj) {
	    return obj instanceof Duration;
	}

	function absRound (number) {
	    if (number < 0) {
	        return Math.round(-1 * number) * -1;
	    } else {
	        return Math.round(number);
	    }
	}

	// FORMATTING

	function offset (token, separator) {
	    addFormatToken(token, 0, 0, function () {
	        var offset = this.utcOffset();
	        var sign = '+';
	        if (offset < 0) {
	            offset = -offset;
	            sign = '-';
	        }
	        return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
	    });
	}

	offset('Z', ':');
	offset('ZZ', '');

	// PARSING

	addRegexToken('Z',  matchShortOffset);
	addRegexToken('ZZ', matchShortOffset);
	addParseToken(['Z', 'ZZ'], function (input, array, config) {
	    config._useUTC = true;
	    config._tzm = offsetFromString(matchShortOffset, input);
	});

	// HELPERS

	// timezone chunker
	// '+10:00' > ['10',  '00']
	// '-1530'  > ['-15', '30']
	var chunkOffset = /([\+\-]|\d\d)/gi;

	function offsetFromString(matcher, string) {
	    var matches = (string || '').match(matcher);

	    if (matches === null) {
	        return null;
	    }

	    var chunk   = matches[matches.length - 1] || [];
	    var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
	    var minutes = +(parts[1] * 60) + toInt(parts[2]);

	    return minutes === 0 ?
	      0 :
	      parts[0] === '+' ? minutes : -minutes;
	}

	// Return a moment from input, that is local/utc/zone equivalent to model.
	function cloneWithOffset(input, model) {
	    var res, diff;
	    if (model._isUTC) {
	        res = model.clone();
	        diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
	        // Use low-level api, because this fn is low-level api.
	        res._d.setTime(res._d.valueOf() + diff);
	        hooks.updateOffset(res, false);
	        return res;
	    } else {
	        return createLocal(input).local();
	    }
	}

	function getDateOffset (m) {
	    // On Firefox.24 Date#getTimezoneOffset returns a floating point.
	    // https://github.com/moment/moment/pull/1871
	    return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
	}

	// HOOKS

	// This function will be called whenever a moment is mutated.
	// It is intended to keep the offset in sync with the timezone.
	hooks.updateOffset = function () {};

	// MOMENTS

	// keepLocalTime = true means only change the timezone, without
	// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
	// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
	// +0200, so we adjust the time as needed, to be valid.
	//
	// Keeping the time actually adds/subtracts (one hour)
	// from the actual represented time. That is why we call updateOffset
	// a second time. In case it wants us to change the offset again
	// _changeInProgress == true case, then we have to adjust, because
	// there is no such time in the given timezone.
	function getSetOffset (input, keepLocalTime) {
	    var offset = this._offset || 0,
	        localAdjust;
	    if (!this.isValid()) {
	        return input != null ? this : NaN;
	    }
	    if (input != null) {
	        if (typeof input === 'string') {
	            input = offsetFromString(matchShortOffset, input);
	            if (input === null) {
	                return this;
	            }
	        } else if (Math.abs(input) < 16) {
	            input = input * 60;
	        }
	        if (!this._isUTC && keepLocalTime) {
	            localAdjust = getDateOffset(this);
	        }
	        this._offset = input;
	        this._isUTC = true;
	        if (localAdjust != null) {
	            this.add(localAdjust, 'm');
	        }
	        if (offset !== input) {
	            if (!keepLocalTime || this._changeInProgress) {
	                addSubtract(this, createDuration(input - offset, 'm'), 1, false);
	            } else if (!this._changeInProgress) {
	                this._changeInProgress = true;
	                hooks.updateOffset(this, true);
	                this._changeInProgress = null;
	            }
	        }
	        return this;
	    } else {
	        return this._isUTC ? offset : getDateOffset(this);
	    }
	}

	function getSetZone (input, keepLocalTime) {
	    if (input != null) {
	        if (typeof input !== 'string') {
	            input = -input;
	        }

	        this.utcOffset(input, keepLocalTime);

	        return this;
	    } else {
	        return -this.utcOffset();
	    }
	}

	function setOffsetToUTC (keepLocalTime) {
	    return this.utcOffset(0, keepLocalTime);
	}

	function setOffsetToLocal (keepLocalTime) {
	    if (this._isUTC) {
	        this.utcOffset(0, keepLocalTime);
	        this._isUTC = false;

	        if (keepLocalTime) {
	            this.subtract(getDateOffset(this), 'm');
	        }
	    }
	    return this;
	}

	function setOffsetToParsedOffset () {
	    if (this._tzm != null) {
	        this.utcOffset(this._tzm);
	    } else if (typeof this._i === 'string') {
	        var tZone = offsetFromString(matchOffset, this._i);
	        if (tZone != null) {
	            this.utcOffset(tZone);
	        }
	        else {
	            this.utcOffset(0, true);
	        }
	    }
	    return this;
	}

	function hasAlignedHourOffset (input) {
	    if (!this.isValid()) {
	        return false;
	    }
	    input = input ? createLocal(input).utcOffset() : 0;

	    return (this.utcOffset() - input) % 60 === 0;
	}

	function isDaylightSavingTime () {
	    return (
	        this.utcOffset() > this.clone().month(0).utcOffset() ||
	        this.utcOffset() > this.clone().month(5).utcOffset()
	    );
	}

	function isDaylightSavingTimeShifted () {
	    if (!isUndefined(this._isDSTShifted)) {
	        return this._isDSTShifted;
	    }

	    var c = {};

	    copyConfig(c, this);
	    c = prepareConfig(c);

	    if (c._a) {
	        var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
	        this._isDSTShifted = this.isValid() &&
	            compareArrays(c._a, other.toArray()) > 0;
	    } else {
	        this._isDSTShifted = false;
	    }

	    return this._isDSTShifted;
	}

	function isLocal () {
	    return this.isValid() ? !this._isUTC : false;
	}

	function isUtcOffset () {
	    return this.isValid() ? this._isUTC : false;
	}

	function isUtc () {
	    return this.isValid() ? this._isUTC && this._offset === 0 : false;
	}

	// ASP.NET json date format regex
	var aspNetRegex = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

	// from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
	// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
	// and further modified to allow for strings containing both week and day
	var isoRegex = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;

	function createDuration (input, key) {
	    var duration = input,
	        // matching against regexp is expensive, do it on demand
	        match = null,
	        sign,
	        ret,
	        diffRes;

	    if (isDuration(input)) {
	        duration = {
	            ms : input._milliseconds,
	            d  : input._days,
	            M  : input._months
	        };
	    } else if (isNumber(input)) {
	        duration = {};
	        if (key) {
	            duration[key] = input;
	        } else {
	            duration.milliseconds = input;
	        }
	    } else if (!!(match = aspNetRegex.exec(input))) {
	        sign = (match[1] === '-') ? -1 : 1;
	        duration = {
	            y  : 0,
	            d  : toInt(match[DATE])                         * sign,
	            h  : toInt(match[HOUR])                         * sign,
	            m  : toInt(match[MINUTE])                       * sign,
	            s  : toInt(match[SECOND])                       * sign,
	            ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
	        };
	    } else if (!!(match = isoRegex.exec(input))) {
	        sign = (match[1] === '-') ? -1 : 1;
	        duration = {
	            y : parseIso(match[2], sign),
	            M : parseIso(match[3], sign),
	            w : parseIso(match[4], sign),
	            d : parseIso(match[5], sign),
	            h : parseIso(match[6], sign),
	            m : parseIso(match[7], sign),
	            s : parseIso(match[8], sign)
	        };
	    } else if (duration == null) {// checks for null or undefined
	        duration = {};
	    } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
	        diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

	        duration = {};
	        duration.ms = diffRes.milliseconds;
	        duration.M = diffRes.months;
	    }

	    ret = new Duration(duration);

	    if (isDuration(input) && hasOwnProp(input, '_locale')) {
	        ret._locale = input._locale;
	    }

	    return ret;
	}

	createDuration.fn = Duration.prototype;

	function parseIso (inp, sign) {
	    // We'd normally use ~~inp for this, but unfortunately it also
	    // converts floats to ints.
	    // inp may be undefined, so careful calling replace on it.
	    var res = inp && parseFloat(inp.replace(',', '.'));
	    // apply sign while we're at it
	    return (isNaN(res) ? 0 : res) * sign;
	}

	function positiveMomentsDifference(base, other) {
	    var res = {milliseconds: 0, months: 0};

	    res.months = other.month() - base.month() +
	        (other.year() - base.year()) * 12;
	    if (base.clone().add(res.months, 'M').isAfter(other)) {
	        --res.months;
	    }

	    res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

	    return res;
	}

	function momentsDifference(base, other) {
	    var res;
	    if (!(base.isValid() && other.isValid())) {
	        return {milliseconds: 0, months: 0};
	    }

	    other = cloneWithOffset(other, base);
	    if (base.isBefore(other)) {
	        res = positiveMomentsDifference(base, other);
	    } else {
	        res = positiveMomentsDifference(other, base);
	        res.milliseconds = -res.milliseconds;
	        res.months = -res.months;
	    }

	    return res;
	}

	// TODO: remove 'name' arg after deprecation is removed
	function createAdder(direction, name) {
	    return function (val, period) {
	        var dur, tmp;
	        //invert the arguments, but complain about it
	        if (period !== null && !isNaN(+period)) {
	            deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
	            'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
	            tmp = val; val = period; period = tmp;
	        }

	        val = typeof val === 'string' ? +val : val;
	        dur = createDuration(val, period);
	        addSubtract(this, dur, direction);
	        return this;
	    };
	}

	function addSubtract (mom, duration, isAdding, updateOffset) {
	    var milliseconds = duration._milliseconds,
	        days = absRound(duration._days),
	        months = absRound(duration._months);

	    if (!mom.isValid()) {
	        // No op
	        return;
	    }

	    updateOffset = updateOffset == null ? true : updateOffset;

	    if (milliseconds) {
	        mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
	    }
	    if (days) {
	        set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
	    }
	    if (months) {
	        setMonth(mom, get(mom, 'Month') + months * isAdding);
	    }
	    if (updateOffset) {
	        hooks.updateOffset(mom, days || months);
	    }
	}

	var add      = createAdder(1, 'add');
	var subtract = createAdder(-1, 'subtract');

	function getCalendarFormat(myMoment, now) {
	    var diff = myMoment.diff(now, 'days', true);
	    return diff < -6 ? 'sameElse' :
	            diff < -1 ? 'lastWeek' :
	            diff < 0 ? 'lastDay' :
	            diff < 1 ? 'sameDay' :
	            diff < 2 ? 'nextDay' :
	            diff < 7 ? 'nextWeek' : 'sameElse';
	}

	function calendar$1 (time, formats) {
	    // We want to compare the start of today, vs this.
	    // Getting start-of-today depends on whether we're local/utc/offset or not.
	    var now = time || createLocal(),
	        sod = cloneWithOffset(now, this).startOf('day'),
	        format = hooks.calendarFormat(this, sod) || 'sameElse';

	    var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

	    return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
	}

	function clone () {
	    return new Moment(this);
	}

	function isAfter (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input);
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() > localInput.valueOf();
	    } else {
	        return localInput.valueOf() < this.clone().startOf(units).valueOf();
	    }
	}

	function isBefore (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input);
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() < localInput.valueOf();
	    } else {
	        return this.clone().endOf(units).valueOf() < localInput.valueOf();
	    }
	}

	function isBetween (from, to, units, inclusivity) {
	    inclusivity = inclusivity || '()';
	    return (inclusivity[0] === '(' ? this.isAfter(from, units) : !this.isBefore(from, units)) &&
	        (inclusivity[1] === ')' ? this.isBefore(to, units) : !this.isAfter(to, units));
	}

	function isSame (input, units) {
	    var localInput = isMoment(input) ? input : createLocal(input),
	        inputMs;
	    if (!(this.isValid() && localInput.isValid())) {
	        return false;
	    }
	    units = normalizeUnits(units || 'millisecond');
	    if (units === 'millisecond') {
	        return this.valueOf() === localInput.valueOf();
	    } else {
	        inputMs = localInput.valueOf();
	        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
	    }
	}

	function isSameOrAfter (input, units) {
	    return this.isSame(input, units) || this.isAfter(input,units);
	}

	function isSameOrBefore (input, units) {
	    return this.isSame(input, units) || this.isBefore(input,units);
	}

	function diff (input, units, asFloat) {
	    var that,
	        zoneDelta,
	        delta, output;

	    if (!this.isValid()) {
	        return NaN;
	    }

	    that = cloneWithOffset(input, this);

	    if (!that.isValid()) {
	        return NaN;
	    }

	    zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

	    units = normalizeUnits(units);

	    if (units === 'year' || units === 'month' || units === 'quarter') {
	        output = monthDiff(this, that);
	        if (units === 'quarter') {
	            output = output / 3;
	        } else if (units === 'year') {
	            output = output / 12;
	        }
	    } else {
	        delta = this - that;
	        output = units === 'second' ? delta / 1e3 : // 1000
	            units === 'minute' ? delta / 6e4 : // 1000 * 60
	            units === 'hour' ? delta / 36e5 : // 1000 * 60 * 60
	            units === 'day' ? (delta - zoneDelta) / 864e5 : // 1000 * 60 * 60 * 24, negate dst
	            units === 'week' ? (delta - zoneDelta) / 6048e5 : // 1000 * 60 * 60 * 24 * 7, negate dst
	            delta;
	    }
	    return asFloat ? output : absFloor(output);
	}

	function monthDiff (a, b) {
	    // difference in months
	    var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
	        // b is in (anchor - 1 month, anchor + 1 month)
	        anchor = a.clone().add(wholeMonthDiff, 'months'),
	        anchor2, adjust;

	    if (b - anchor < 0) {
	        anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
	        // linear across the month
	        adjust = (b - anchor) / (anchor - anchor2);
	    } else {
	        anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
	        // linear across the month
	        adjust = (b - anchor) / (anchor2 - anchor);
	    }

	    //check for negative zero, return zero if negative zero
	    return -(wholeMonthDiff + adjust) || 0;
	}

	hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
	hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

	function toString () {
	    return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
	}

	function toISOString () {
	    var m = this.clone().utc();
	    if (0 < m.year() && m.year() <= 9999) {
	        if (isFunction(Date.prototype.toISOString)) {
	            // native implementation is ~50x faster, use it when we can
	            return this.toDate().toISOString();
	        } else {
	            return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	        }
	    } else {
	        return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
	    }
	}

	/**
	 * Return a human readable representation of a moment that can
	 * also be evaluated to get a new moment which is the same
	 *
	 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
	 */
	function inspect () {
	    if (!this.isValid()) {
	        return 'moment.invalid(/* ' + this._i + ' */)';
	    }
	    var func = 'moment';
	    var zone = '';
	    if (!this.isLocal()) {
	        func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
	        zone = 'Z';
	    }
	    var prefix = '[' + func + '("]';
	    var year = (0 < this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
	    var datetime = '-MM-DD[T]HH:mm:ss.SSS';
	    var suffix = zone + '[")]';

	    return this.format(prefix + year + datetime + suffix);
	}

	function format (inputString) {
	    if (!inputString) {
	        inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
	    }
	    var output = formatMoment(this, inputString);
	    return this.localeData().postformat(output);
	}

	function from (time, withoutSuffix) {
	    if (this.isValid() &&
	            ((isMoment(time) && time.isValid()) ||
	             createLocal(time).isValid())) {
	        return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
	    } else {
	        return this.localeData().invalidDate();
	    }
	}

	function fromNow (withoutSuffix) {
	    return this.from(createLocal(), withoutSuffix);
	}

	function to (time, withoutSuffix) {
	    if (this.isValid() &&
	            ((isMoment(time) && time.isValid()) ||
	             createLocal(time).isValid())) {
	        return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
	    } else {
	        return this.localeData().invalidDate();
	    }
	}

	function toNow (withoutSuffix) {
	    return this.to(createLocal(), withoutSuffix);
	}

	// If passed a locale key, it will set the locale for this
	// instance.  Otherwise, it will return the locale configuration
	// variables for this instance.
	function locale (key) {
	    var newLocaleData;

	    if (key === undefined) {
	        return this._locale._abbr;
	    } else {
	        newLocaleData = getLocale(key);
	        if (newLocaleData != null) {
	            this._locale = newLocaleData;
	        }
	        return this;
	    }
	}

	var lang = deprecate(
	    'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
	    function (key) {
	        if (key === undefined) {
	            return this.localeData();
	        } else {
	            return this.locale(key);
	        }
	    }
	);

	function localeData () {
	    return this._locale;
	}

	function startOf (units) {
	    units = normalizeUnits(units);
	    // the following switch intentionally omits break keywords
	    // to utilize falling through the cases.
	    switch (units) {
	        case 'year':
	            this.month(0);
	            /* falls through */
	        case 'quarter':
	        case 'month':
	            this.date(1);
	            /* falls through */
	        case 'week':
	        case 'isoWeek':
	        case 'day':
	        case 'date':
	            this.hours(0);
	            /* falls through */
	        case 'hour':
	            this.minutes(0);
	            /* falls through */
	        case 'minute':
	            this.seconds(0);
	            /* falls through */
	        case 'second':
	            this.milliseconds(0);
	    }

	    // weeks are a special case
	    if (units === 'week') {
	        this.weekday(0);
	    }
	    if (units === 'isoWeek') {
	        this.isoWeekday(1);
	    }

	    // quarters are also special
	    if (units === 'quarter') {
	        this.month(Math.floor(this.month() / 3) * 3);
	    }

	    return this;
	}

	function endOf (units) {
	    units = normalizeUnits(units);
	    if (units === undefined || units === 'millisecond') {
	        return this;
	    }

	    // 'date' is an alias for 'day', so it should be considered as such.
	    if (units === 'date') {
	        units = 'day';
	    }

	    return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
	}

	function valueOf () {
	    return this._d.valueOf() - ((this._offset || 0) * 60000);
	}

	function unix () {
	    return Math.floor(this.valueOf() / 1000);
	}

	function toDate () {
	    return new Date(this.valueOf());
	}

	function toArray () {
	    var m = this;
	    return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
	}

	function toObject () {
	    var m = this;
	    return {
	        years: m.year(),
	        months: m.month(),
	        date: m.date(),
	        hours: m.hours(),
	        minutes: m.minutes(),
	        seconds: m.seconds(),
	        milliseconds: m.milliseconds()
	    };
	}

	function toJSON () {
	    // new Date(NaN).toJSON() === null
	    return this.isValid() ? this.toISOString() : null;
	}

	function isValid$1 () {
	    return isValid(this);
	}

	function parsingFlags () {
	    return extend({}, getParsingFlags(this));
	}

	function invalidAt () {
	    return getParsingFlags(this).overflow;
	}

	function creationData() {
	    return {
	        input: this._i,
	        format: this._f,
	        locale: this._locale,
	        isUTC: this._isUTC,
	        strict: this._strict
	    };
	}

	// FORMATTING

	addFormatToken(0, ['gg', 2], 0, function () {
	    return this.weekYear() % 100;
	});

	addFormatToken(0, ['GG', 2], 0, function () {
	    return this.isoWeekYear() % 100;
	});

	function addWeekYearFormatToken (token, getter) {
	    addFormatToken(0, [token, token.length], 0, getter);
	}

	addWeekYearFormatToken('gggg',     'weekYear');
	addWeekYearFormatToken('ggggg',    'weekYear');
	addWeekYearFormatToken('GGGG',  'isoWeekYear');
	addWeekYearFormatToken('GGGGG', 'isoWeekYear');

	// ALIASES

	addUnitAlias('weekYear', 'gg');
	addUnitAlias('isoWeekYear', 'GG');

	// PRIORITY

	addUnitPriority('weekYear', 1);
	addUnitPriority('isoWeekYear', 1);


	// PARSING

	addRegexToken('G',      matchSigned);
	addRegexToken('g',      matchSigned);
	addRegexToken('GG',     match1to2, match2);
	addRegexToken('gg',     match1to2, match2);
	addRegexToken('GGGG',   match1to4, match4);
	addRegexToken('gggg',   match1to4, match4);
	addRegexToken('GGGGG',  match1to6, match6);
	addRegexToken('ggggg',  match1to6, match6);

	addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
	    week[token.substr(0, 2)] = toInt(input);
	});

	addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
	    week[token] = hooks.parseTwoDigitYear(input);
	});

	// MOMENTS

	function getSetWeekYear (input) {
	    return getSetWeekYearHelper.call(this,
	            input,
	            this.week(),
	            this.weekday(),
	            this.localeData()._week.dow,
	            this.localeData()._week.doy);
	}

	function getSetISOWeekYear (input) {
	    return getSetWeekYearHelper.call(this,
	            input, this.isoWeek(), this.isoWeekday(), 1, 4);
	}

	function getISOWeeksInYear () {
	    return weeksInYear(this.year(), 1, 4);
	}

	function getWeeksInYear () {
	    var weekInfo = this.localeData()._week;
	    return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
	}

	function getSetWeekYearHelper(input, week, weekday, dow, doy) {
	    var weeksTarget;
	    if (input == null) {
	        return weekOfYear(this, dow, doy).year;
	    } else {
	        weeksTarget = weeksInYear(input, dow, doy);
	        if (week > weeksTarget) {
	            week = weeksTarget;
	        }
	        return setWeekAll.call(this, input, week, weekday, dow, doy);
	    }
	}

	function setWeekAll(weekYear, week, weekday, dow, doy) {
	    var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
	        date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

	    this.year(date.getUTCFullYear());
	    this.month(date.getUTCMonth());
	    this.date(date.getUTCDate());
	    return this;
	}

	// FORMATTING

	addFormatToken('Q', 0, 'Qo', 'quarter');

	// ALIASES

	addUnitAlias('quarter', 'Q');

	// PRIORITY

	addUnitPriority('quarter', 7);

	// PARSING

	addRegexToken('Q', match1);
	addParseToken('Q', function (input, array) {
	    array[MONTH] = (toInt(input) - 1) * 3;
	});

	// MOMENTS

	function getSetQuarter (input) {
	    return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
	}

	// FORMATTING

	addFormatToken('D', ['DD', 2], 'Do', 'date');

	// ALIASES

	addUnitAlias('date', 'D');

	// PRIOROITY
	addUnitPriority('date', 9);

	// PARSING

	addRegexToken('D',  match1to2);
	addRegexToken('DD', match1to2, match2);
	addRegexToken('Do', function (isStrict, locale) {
	    return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
	});

	addParseToken(['D', 'DD'], DATE);
	addParseToken('Do', function (input, array) {
	    array[DATE] = toInt(input.match(match1to2)[0], 10);
	});

	// MOMENTS

	var getSetDayOfMonth = makeGetSet('Date', true);

	// FORMATTING

	addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

	// ALIASES

	addUnitAlias('dayOfYear', 'DDD');

	// PRIORITY
	addUnitPriority('dayOfYear', 4);

	// PARSING

	addRegexToken('DDD',  match1to3);
	addRegexToken('DDDD', match3);
	addParseToken(['DDD', 'DDDD'], function (input, array, config) {
	    config._dayOfYear = toInt(input);
	});

	// HELPERS

	// MOMENTS

	function getSetDayOfYear (input) {
	    var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
	    return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
	}

	// FORMATTING

	addFormatToken('m', ['mm', 2], 0, 'minute');

	// ALIASES

	addUnitAlias('minute', 'm');

	// PRIORITY

	addUnitPriority('minute', 14);

	// PARSING

	addRegexToken('m',  match1to2);
	addRegexToken('mm', match1to2, match2);
	addParseToken(['m', 'mm'], MINUTE);

	// MOMENTS

	var getSetMinute = makeGetSet('Minutes', false);

	// FORMATTING

	addFormatToken('s', ['ss', 2], 0, 'second');

	// ALIASES

	addUnitAlias('second', 's');

	// PRIORITY

	addUnitPriority('second', 15);

	// PARSING

	addRegexToken('s',  match1to2);
	addRegexToken('ss', match1to2, match2);
	addParseToken(['s', 'ss'], SECOND);

	// MOMENTS

	var getSetSecond = makeGetSet('Seconds', false);

	// FORMATTING

	addFormatToken('S', 0, 0, function () {
	    return ~~(this.millisecond() / 100);
	});

	addFormatToken(0, ['SS', 2], 0, function () {
	    return ~~(this.millisecond() / 10);
	});

	addFormatToken(0, ['SSS', 3], 0, 'millisecond');
	addFormatToken(0, ['SSSS', 4], 0, function () {
	    return this.millisecond() * 10;
	});
	addFormatToken(0, ['SSSSS', 5], 0, function () {
	    return this.millisecond() * 100;
	});
	addFormatToken(0, ['SSSSSS', 6], 0, function () {
	    return this.millisecond() * 1000;
	});
	addFormatToken(0, ['SSSSSSS', 7], 0, function () {
	    return this.millisecond() * 10000;
	});
	addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
	    return this.millisecond() * 100000;
	});
	addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
	    return this.millisecond() * 1000000;
	});


	// ALIASES

	addUnitAlias('millisecond', 'ms');

	// PRIORITY

	addUnitPriority('millisecond', 16);

	// PARSING

	addRegexToken('S',    match1to3, match1);
	addRegexToken('SS',   match1to3, match2);
	addRegexToken('SSS',  match1to3, match3);

	var token;
	for (token = 'SSSS'; token.length <= 9; token += 'S') {
	    addRegexToken(token, matchUnsigned);
	}

	function parseMs(input, array) {
	    array[MILLISECOND] = toInt(('0.' + input) * 1000);
	}

	for (token = 'S'; token.length <= 9; token += 'S') {
	    addParseToken(token, parseMs);
	}
	// MOMENTS

	var getSetMillisecond = makeGetSet('Milliseconds', false);

	// FORMATTING

	addFormatToken('z',  0, 0, 'zoneAbbr');
	addFormatToken('zz', 0, 0, 'zoneName');

	// MOMENTS

	function getZoneAbbr () {
	    return this._isUTC ? 'UTC' : '';
	}

	function getZoneName () {
	    return this._isUTC ? 'Coordinated Universal Time' : '';
	}

	var proto = Moment.prototype;

	proto.add               = add;
	proto.calendar          = calendar$1;
	proto.clone             = clone;
	proto.diff              = diff;
	proto.endOf             = endOf;
	proto.format            = format;
	proto.from              = from;
	proto.fromNow           = fromNow;
	proto.to                = to;
	proto.toNow             = toNow;
	proto.get               = stringGet;
	proto.invalidAt         = invalidAt;
	proto.isAfter           = isAfter;
	proto.isBefore          = isBefore;
	proto.isBetween         = isBetween;
	proto.isSame            = isSame;
	proto.isSameOrAfter     = isSameOrAfter;
	proto.isSameOrBefore    = isSameOrBefore;
	proto.isValid           = isValid$1;
	proto.lang              = lang;
	proto.locale            = locale;
	proto.localeData        = localeData;
	proto.max               = prototypeMax;
	proto.min               = prototypeMin;
	proto.parsingFlags      = parsingFlags;
	proto.set               = stringSet;
	proto.startOf           = startOf;
	proto.subtract          = subtract;
	proto.toArray           = toArray;
	proto.toObject          = toObject;
	proto.toDate            = toDate;
	proto.toISOString       = toISOString;
	proto.inspect           = inspect;
	proto.toJSON            = toJSON;
	proto.toString          = toString;
	proto.unix              = unix;
	proto.valueOf           = valueOf;
	proto.creationData      = creationData;

	// Year
	proto.year       = getSetYear;
	proto.isLeapYear = getIsLeapYear;

	// Week Year
	proto.weekYear    = getSetWeekYear;
	proto.isoWeekYear = getSetISOWeekYear;

	// Quarter
	proto.quarter = proto.quarters = getSetQuarter;

	// Month
	proto.month       = getSetMonth;
	proto.daysInMonth = getDaysInMonth;

	// Week
	proto.week           = proto.weeks        = getSetWeek;
	proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
	proto.weeksInYear    = getWeeksInYear;
	proto.isoWeeksInYear = getISOWeeksInYear;

	// Day
	proto.date       = getSetDayOfMonth;
	proto.day        = proto.days             = getSetDayOfWeek;
	proto.weekday    = getSetLocaleDayOfWeek;
	proto.isoWeekday = getSetISODayOfWeek;
	proto.dayOfYear  = getSetDayOfYear;

	// Hour
	proto.hour = proto.hours = getSetHour;

	// Minute
	proto.minute = proto.minutes = getSetMinute;

	// Second
	proto.second = proto.seconds = getSetSecond;

	// Millisecond
	proto.millisecond = proto.milliseconds = getSetMillisecond;

	// Offset
	proto.utcOffset            = getSetOffset;
	proto.utc                  = setOffsetToUTC;
	proto.local                = setOffsetToLocal;
	proto.parseZone            = setOffsetToParsedOffset;
	proto.hasAlignedHourOffset = hasAlignedHourOffset;
	proto.isDST                = isDaylightSavingTime;
	proto.isLocal              = isLocal;
	proto.isUtcOffset          = isUtcOffset;
	proto.isUtc                = isUtc;
	proto.isUTC                = isUtc;

	// Timezone
	proto.zoneAbbr = getZoneAbbr;
	proto.zoneName = getZoneName;

	// Deprecations
	proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
	proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
	proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
	proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
	proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

	function createUnix (input) {
	    return createLocal(input * 1000);
	}

	function createInZone () {
	    return createLocal.apply(null, arguments).parseZone();
	}

	function preParsePostFormat (string) {
	    return string;
	}

	var proto$1 = Locale.prototype;

	proto$1.calendar        = calendar;
	proto$1.longDateFormat  = longDateFormat;
	proto$1.invalidDate     = invalidDate;
	proto$1.ordinal         = ordinal;
	proto$1.preparse        = preParsePostFormat;
	proto$1.postformat      = preParsePostFormat;
	proto$1.relativeTime    = relativeTime;
	proto$1.pastFuture      = pastFuture;
	proto$1.set             = set;

	// Month
	proto$1.months            =        localeMonths;
	proto$1.monthsShort       =        localeMonthsShort;
	proto$1.monthsParse       =        localeMonthsParse;
	proto$1.monthsRegex       = monthsRegex;
	proto$1.monthsShortRegex  = monthsShortRegex;

	// Week
	proto$1.week = localeWeek;
	proto$1.firstDayOfYear = localeFirstDayOfYear;
	proto$1.firstDayOfWeek = localeFirstDayOfWeek;

	// Day of Week
	proto$1.weekdays       =        localeWeekdays;
	proto$1.weekdaysMin    =        localeWeekdaysMin;
	proto$1.weekdaysShort  =        localeWeekdaysShort;
	proto$1.weekdaysParse  =        localeWeekdaysParse;

	proto$1.weekdaysRegex       =        weekdaysRegex;
	proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
	proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

	// Hours
	proto$1.isPM = localeIsPM;
	proto$1.meridiem = localeMeridiem;

	function get$1 (format, index, field, setter) {
	    var locale = getLocale();
	    var utc = createUTC().set(setter, index);
	    return locale[field](utc, format);
	}

	function listMonthsImpl (format, index, field) {
	    if (isNumber(format)) {
	        index = format;
	        format = undefined;
	    }

	    format = format || '';

	    if (index != null) {
	        return get$1(format, index, field, 'month');
	    }

	    var i;
	    var out = [];
	    for (i = 0; i < 12; i++) {
	        out[i] = get$1(format, i, field, 'month');
	    }
	    return out;
	}

	// ()
	// (5)
	// (fmt, 5)
	// (fmt)
	// (true)
	// (true, 5)
	// (true, fmt, 5)
	// (true, fmt)
	function listWeekdaysImpl (localeSorted, format, index, field) {
	    if (typeof localeSorted === 'boolean') {
	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';
	    } else {
	        format = localeSorted;
	        index = format;
	        localeSorted = false;

	        if (isNumber(format)) {
	            index = format;
	            format = undefined;
	        }

	        format = format || '';
	    }

	    var locale = getLocale(),
	        shift = localeSorted ? locale._week.dow : 0;

	    if (index != null) {
	        return get$1(format, (index + shift) % 7, field, 'day');
	    }

	    var i;
	    var out = [];
	    for (i = 0; i < 7; i++) {
	        out[i] = get$1(format, (i + shift) % 7, field, 'day');
	    }
	    return out;
	}

	function listMonths (format, index) {
	    return listMonthsImpl(format, index, 'months');
	}

	function listMonthsShort (format, index) {
	    return listMonthsImpl(format, index, 'monthsShort');
	}

	function listWeekdays (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
	}

	function listWeekdaysShort (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
	}

	function listWeekdaysMin (localeSorted, format, index) {
	    return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
	}

	getSetGlobalLocale('en', {
	    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (toInt(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    }
	});

	// Side effect imports
	hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
	hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

	var mathAbs = Math.abs;

	function abs () {
	    var data           = this._data;

	    this._milliseconds = mathAbs(this._milliseconds);
	    this._days         = mathAbs(this._days);
	    this._months       = mathAbs(this._months);

	    data.milliseconds  = mathAbs(data.milliseconds);
	    data.seconds       = mathAbs(data.seconds);
	    data.minutes       = mathAbs(data.minutes);
	    data.hours         = mathAbs(data.hours);
	    data.months        = mathAbs(data.months);
	    data.years         = mathAbs(data.years);

	    return this;
	}

	function addSubtract$1 (duration, input, value, direction) {
	    var other = createDuration(input, value);

	    duration._milliseconds += direction * other._milliseconds;
	    duration._days         += direction * other._days;
	    duration._months       += direction * other._months;

	    return duration._bubble();
	}

	// supports only 2.0-style add(1, 's') or add(duration)
	function add$1 (input, value) {
	    return addSubtract$1(this, input, value, 1);
	}

	// supports only 2.0-style subtract(1, 's') or subtract(duration)
	function subtract$1 (input, value) {
	    return addSubtract$1(this, input, value, -1);
	}

	function absCeil (number) {
	    if (number < 0) {
	        return Math.floor(number);
	    } else {
	        return Math.ceil(number);
	    }
	}

	function bubble () {
	    var milliseconds = this._milliseconds;
	    var days         = this._days;
	    var months       = this._months;
	    var data         = this._data;
	    var seconds, minutes, hours, years, monthsFromDays;

	    // if we have a mix of positive and negative values, bubble down first
	    // check: https://github.com/moment/moment/issues/2166
	    if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
	            (milliseconds <= 0 && days <= 0 && months <= 0))) {
	        milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
	        days = 0;
	        months = 0;
	    }

	    // The following code bubbles up values, see the tests for
	    // examples of what that means.
	    data.milliseconds = milliseconds % 1000;

	    seconds           = absFloor(milliseconds / 1000);
	    data.seconds      = seconds % 60;

	    minutes           = absFloor(seconds / 60);
	    data.minutes      = minutes % 60;

	    hours             = absFloor(minutes / 60);
	    data.hours        = hours % 24;

	    days += absFloor(hours / 24);

	    // convert days to months
	    monthsFromDays = absFloor(daysToMonths(days));
	    months += monthsFromDays;
	    days -= absCeil(monthsToDays(monthsFromDays));

	    // 12 months -> 1 year
	    years = absFloor(months / 12);
	    months %= 12;

	    data.days   = days;
	    data.months = months;
	    data.years  = years;

	    return this;
	}

	function daysToMonths (days) {
	    // 400 years have 146097 days (taking into account leap year rules)
	    // 400 years have 12 months === 4800
	    return days * 4800 / 146097;
	}

	function monthsToDays (months) {
	    // the reverse of daysToMonths
	    return months * 146097 / 4800;
	}

	function as (units) {
	    var days;
	    var months;
	    var milliseconds = this._milliseconds;

	    units = normalizeUnits(units);

	    if (units === 'month' || units === 'year') {
	        days   = this._days   + milliseconds / 864e5;
	        months = this._months + daysToMonths(days);
	        return units === 'month' ? months : months / 12;
	    } else {
	        // handle milliseconds separately because of floating point math errors (issue #1867)
	        days = this._days + Math.round(monthsToDays(this._months));
	        switch (units) {
	            case 'week'   : return days / 7     + milliseconds / 6048e5;
	            case 'day'    : return days         + milliseconds / 864e5;
	            case 'hour'   : return days * 24    + milliseconds / 36e5;
	            case 'minute' : return days * 1440  + milliseconds / 6e4;
	            case 'second' : return days * 86400 + milliseconds / 1000;
	            // Math.floor prevents floating point math errors here
	            case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
	            default: throw new Error('Unknown unit ' + units);
	        }
	    }
	}

	// TODO: Use this.as('ms')?
	function valueOf$1 () {
	    return (
	        this._milliseconds +
	        this._days * 864e5 +
	        (this._months % 12) * 2592e6 +
	        toInt(this._months / 12) * 31536e6
	    );
	}

	function makeAs (alias) {
	    return function () {
	        return this.as(alias);
	    };
	}

	var asMilliseconds = makeAs('ms');
	var asSeconds      = makeAs('s');
	var asMinutes      = makeAs('m');
	var asHours        = makeAs('h');
	var asDays         = makeAs('d');
	var asWeeks        = makeAs('w');
	var asMonths       = makeAs('M');
	var asYears        = makeAs('y');

	function get$2 (units) {
	    units = normalizeUnits(units);
	    return this[units + 's']();
	}

	function makeGetter(name) {
	    return function () {
	        return this._data[name];
	    };
	}

	var milliseconds = makeGetter('milliseconds');
	var seconds      = makeGetter('seconds');
	var minutes      = makeGetter('minutes');
	var hours        = makeGetter('hours');
	var days         = makeGetter('days');
	var months       = makeGetter('months');
	var years        = makeGetter('years');

	function weeks () {
	    return absFloor(this.days() / 7);
	}

	var round = Math.round;
	var thresholds = {
	    s: 45,  // seconds to minute
	    m: 45,  // minutes to hour
	    h: 22,  // hours to day
	    d: 26,  // days to month
	    M: 11   // months to year
	};

	// helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
	function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
	    return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
	}

	function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
	    var duration = createDuration(posNegDuration).abs();
	    var seconds  = round(duration.as('s'));
	    var minutes  = round(duration.as('m'));
	    var hours    = round(duration.as('h'));
	    var days     = round(duration.as('d'));
	    var months   = round(duration.as('M'));
	    var years    = round(duration.as('y'));

	    var a = seconds < thresholds.s && ['s', seconds]  ||
	            minutes <= 1           && ['m']           ||
	            minutes < thresholds.m && ['mm', minutes] ||
	            hours   <= 1           && ['h']           ||
	            hours   < thresholds.h && ['hh', hours]   ||
	            days    <= 1           && ['d']           ||
	            days    < thresholds.d && ['dd', days]    ||
	            months  <= 1           && ['M']           ||
	            months  < thresholds.M && ['MM', months]  ||
	            years   <= 1           && ['y']           || ['yy', years];

	    a[2] = withoutSuffix;
	    a[3] = +posNegDuration > 0;
	    a[4] = locale;
	    return substituteTimeAgo.apply(null, a);
	}

	// This function allows you to set the rounding function for relative time strings
	function getSetRelativeTimeRounding (roundingFunction) {
	    if (roundingFunction === undefined) {
	        return round;
	    }
	    if (typeof(roundingFunction) === 'function') {
	        round = roundingFunction;
	        return true;
	    }
	    return false;
	}

	// This function allows you to set a threshold for relative time strings
	function getSetRelativeTimeThreshold (threshold, limit) {
	    if (thresholds[threshold] === undefined) {
	        return false;
	    }
	    if (limit === undefined) {
	        return thresholds[threshold];
	    }
	    thresholds[threshold] = limit;
	    return true;
	}

	function humanize (withSuffix) {
	    var locale = this.localeData();
	    var output = relativeTime$1(this, !withSuffix, locale);

	    if (withSuffix) {
	        output = locale.pastFuture(+this, output);
	    }

	    return locale.postformat(output);
	}

	var abs$1 = Math.abs;

	function toISOString$1() {
	    // for ISO strings we do not use the normal bubbling rules:
	    //  * milliseconds bubble up until they become hours
	    //  * days do not bubble at all
	    //  * months bubble up until they become years
	    // This is because there is no context-free conversion between hours and days
	    // (think of clock changes)
	    // and also not between days and months (28-31 days per month)
	    var seconds = abs$1(this._milliseconds) / 1000;
	    var days         = abs$1(this._days);
	    var months       = abs$1(this._months);
	    var minutes, hours, years;

	    // 3600 seconds -> 60 minutes -> 1 hour
	    minutes           = absFloor(seconds / 60);
	    hours             = absFloor(minutes / 60);
	    seconds %= 60;
	    minutes %= 60;

	    // 12 months -> 1 year
	    years  = absFloor(months / 12);
	    months %= 12;


	    // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
	    var Y = years;
	    var M = months;
	    var D = days;
	    var h = hours;
	    var m = minutes;
	    var s = seconds;
	    var total = this.asSeconds();

	    if (!total) {
	        // this is the same as C#'s (Noda) and python (isodate)...
	        // but not other JS (goog.date)
	        return 'P0D';
	    }

	    return (total < 0 ? '-' : '') +
	        'P' +
	        (Y ? Y + 'Y' : '') +
	        (M ? M + 'M' : '') +
	        (D ? D + 'D' : '') +
	        ((h || m || s) ? 'T' : '') +
	        (h ? h + 'H' : '') +
	        (m ? m + 'M' : '') +
	        (s ? s + 'S' : '');
	}

	var proto$2 = Duration.prototype;

	proto$2.abs            = abs;
	proto$2.add            = add$1;
	proto$2.subtract       = subtract$1;
	proto$2.as             = as;
	proto$2.asMilliseconds = asMilliseconds;
	proto$2.asSeconds      = asSeconds;
	proto$2.asMinutes      = asMinutes;
	proto$2.asHours        = asHours;
	proto$2.asDays         = asDays;
	proto$2.asWeeks        = asWeeks;
	proto$2.asMonths       = asMonths;
	proto$2.asYears        = asYears;
	proto$2.valueOf        = valueOf$1;
	proto$2._bubble        = bubble;
	proto$2.get            = get$2;
	proto$2.milliseconds   = milliseconds;
	proto$2.seconds        = seconds;
	proto$2.minutes        = minutes;
	proto$2.hours          = hours;
	proto$2.days           = days;
	proto$2.weeks          = weeks;
	proto$2.months         = months;
	proto$2.years          = years;
	proto$2.humanize       = humanize;
	proto$2.toISOString    = toISOString$1;
	proto$2.toString       = toISOString$1;
	proto$2.toJSON         = toISOString$1;
	proto$2.locale         = locale;
	proto$2.localeData     = localeData;

	// Deprecations
	proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
	proto$2.lang = lang;

	// Side effect imports

	// FORMATTING

	addFormatToken('X', 0, 0, 'unix');
	addFormatToken('x', 0, 0, 'valueOf');

	// PARSING

	addRegexToken('x', matchSigned);
	addRegexToken('X', matchTimestamp);
	addParseToken('X', function (input, array, config) {
	    config._d = new Date(parseFloat(input, 10) * 1000);
	});
	addParseToken('x', function (input, array, config) {
	    config._d = new Date(toInt(input));
	});

	// Side effect imports


	hooks.version = '2.17.1';

	setHookCallback(createLocal);

	hooks.fn                    = proto;
	hooks.min                   = min;
	hooks.max                   = max;
	hooks.now                   = now;
	hooks.utc                   = createUTC;
	hooks.unix                  = createUnix;
	hooks.months                = listMonths;
	hooks.isDate                = isDate;
	hooks.locale                = getSetGlobalLocale;
	hooks.invalid               = createInvalid;
	hooks.duration              = createDuration;
	hooks.isMoment              = isMoment;
	hooks.weekdays              = listWeekdays;
	hooks.parseZone             = createInZone;
	hooks.localeData            = getLocale;
	hooks.isDuration            = isDuration;
	hooks.monthsShort           = listMonthsShort;
	hooks.weekdaysMin           = listWeekdaysMin;
	hooks.defineLocale          = defineLocale;
	hooks.updateLocale          = updateLocale;
	hooks.locales               = listLocales;
	hooks.weekdaysShort         = listWeekdaysShort;
	hooks.normalizeUnits        = normalizeUnits;
	hooks.relativeTimeRounding = getSetRelativeTimeRounding;
	hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
	hooks.calendarFormat        = getCalendarFormat;
	hooks.prototype             = proto;

	return hooks;

	})));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(390)(module)))

/***/ },
/* 390 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 391 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./af": 392,
		"./af.js": 392,
		"./ar": 393,
		"./ar-dz": 394,
		"./ar-dz.js": 394,
		"./ar-ly": 395,
		"./ar-ly.js": 395,
		"./ar-ma": 396,
		"./ar-ma.js": 396,
		"./ar-sa": 397,
		"./ar-sa.js": 397,
		"./ar-tn": 398,
		"./ar-tn.js": 398,
		"./ar.js": 393,
		"./az": 399,
		"./az.js": 399,
		"./be": 400,
		"./be.js": 400,
		"./bg": 401,
		"./bg.js": 401,
		"./bn": 402,
		"./bn.js": 402,
		"./bo": 403,
		"./bo.js": 403,
		"./br": 404,
		"./br.js": 404,
		"./bs": 405,
		"./bs.js": 405,
		"./ca": 406,
		"./ca.js": 406,
		"./cs": 407,
		"./cs.js": 407,
		"./cv": 408,
		"./cv.js": 408,
		"./cy": 409,
		"./cy.js": 409,
		"./da": 410,
		"./da.js": 410,
		"./de": 411,
		"./de-at": 412,
		"./de-at.js": 412,
		"./de.js": 411,
		"./dv": 413,
		"./dv.js": 413,
		"./el": 414,
		"./el.js": 414,
		"./en-au": 415,
		"./en-au.js": 415,
		"./en-ca": 416,
		"./en-ca.js": 416,
		"./en-gb": 417,
		"./en-gb.js": 417,
		"./en-ie": 418,
		"./en-ie.js": 418,
		"./en-nz": 419,
		"./en-nz.js": 419,
		"./eo": 420,
		"./eo.js": 420,
		"./es": 421,
		"./es-do": 422,
		"./es-do.js": 422,
		"./es.js": 421,
		"./et": 423,
		"./et.js": 423,
		"./eu": 424,
		"./eu.js": 424,
		"./fa": 425,
		"./fa.js": 425,
		"./fi": 426,
		"./fi.js": 426,
		"./fo": 427,
		"./fo.js": 427,
		"./fr": 428,
		"./fr-ca": 429,
		"./fr-ca.js": 429,
		"./fr-ch": 430,
		"./fr-ch.js": 430,
		"./fr.js": 428,
		"./fy": 431,
		"./fy.js": 431,
		"./gd": 432,
		"./gd.js": 432,
		"./gl": 433,
		"./gl.js": 433,
		"./he": 434,
		"./he.js": 434,
		"./hi": 435,
		"./hi.js": 435,
		"./hr": 436,
		"./hr.js": 436,
		"./hu": 437,
		"./hu.js": 437,
		"./hy-am": 438,
		"./hy-am.js": 438,
		"./id": 439,
		"./id.js": 439,
		"./is": 440,
		"./is.js": 440,
		"./it": 441,
		"./it.js": 441,
		"./ja": 442,
		"./ja.js": 442,
		"./jv": 443,
		"./jv.js": 443,
		"./ka": 444,
		"./ka.js": 444,
		"./kk": 445,
		"./kk.js": 445,
		"./km": 446,
		"./km.js": 446,
		"./ko": 447,
		"./ko.js": 447,
		"./ky": 448,
		"./ky.js": 448,
		"./lb": 449,
		"./lb.js": 449,
		"./lo": 450,
		"./lo.js": 450,
		"./lt": 451,
		"./lt.js": 451,
		"./lv": 452,
		"./lv.js": 452,
		"./me": 453,
		"./me.js": 453,
		"./mi": 454,
		"./mi.js": 454,
		"./mk": 455,
		"./mk.js": 455,
		"./ml": 456,
		"./ml.js": 456,
		"./mr": 457,
		"./mr.js": 457,
		"./ms": 458,
		"./ms-my": 459,
		"./ms-my.js": 459,
		"./ms.js": 458,
		"./my": 460,
		"./my.js": 460,
		"./nb": 461,
		"./nb.js": 461,
		"./ne": 462,
		"./ne.js": 462,
		"./nl": 463,
		"./nl-be": 464,
		"./nl-be.js": 464,
		"./nl.js": 463,
		"./nn": 465,
		"./nn.js": 465,
		"./pa-in": 466,
		"./pa-in.js": 466,
		"./pl": 467,
		"./pl.js": 467,
		"./pt": 468,
		"./pt-br": 469,
		"./pt-br.js": 469,
		"./pt.js": 468,
		"./ro": 470,
		"./ro.js": 470,
		"./ru": 471,
		"./ru.js": 471,
		"./se": 472,
		"./se.js": 472,
		"./si": 473,
		"./si.js": 473,
		"./sk": 474,
		"./sk.js": 474,
		"./sl": 475,
		"./sl.js": 475,
		"./sq": 476,
		"./sq.js": 476,
		"./sr": 477,
		"./sr-cyrl": 478,
		"./sr-cyrl.js": 478,
		"./sr.js": 477,
		"./ss": 479,
		"./ss.js": 479,
		"./sv": 480,
		"./sv.js": 480,
		"./sw": 481,
		"./sw.js": 481,
		"./ta": 482,
		"./ta.js": 482,
		"./te": 483,
		"./te.js": 483,
		"./tet": 484,
		"./tet.js": 484,
		"./th": 485,
		"./th.js": 485,
		"./tl-ph": 486,
		"./tl-ph.js": 486,
		"./tlh": 487,
		"./tlh.js": 487,
		"./tr": 488,
		"./tr.js": 488,
		"./tzl": 489,
		"./tzl.js": 489,
		"./tzm": 490,
		"./tzm-latn": 491,
		"./tzm-latn.js": 491,
		"./tzm.js": 490,
		"./uk": 492,
		"./uk.js": 492,
		"./uz": 493,
		"./uz.js": 493,
		"./vi": 494,
		"./vi.js": 494,
		"./x-pseudo": 495,
		"./x-pseudo.js": 495,
		"./yo": 496,
		"./yo.js": 496,
		"./zh-cn": 497,
		"./zh-cn.js": 497,
		"./zh-hk": 498,
		"./zh-hk.js": 498,
		"./zh-tw": 499,
		"./zh-tw.js": 499
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 391;


/***/ },
/* 392 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Afrikaans [af]
	//! author : Werner Mollentze : https://github.com/wernerm

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var af = moment.defineLocale('af', {
	    months : 'Januarie_Februarie_Maart_April_Mei_Junie_Julie_Augustus_September_Oktober_November_Desember'.split('_'),
	    monthsShort : 'Jan_Feb_Mrt_Apr_Mei_Jun_Jul_Aug_Sep_Okt_Nov_Des'.split('_'),
	    weekdays : 'Sondag_Maandag_Dinsdag_Woensdag_Donderdag_Vrydag_Saterdag'.split('_'),
	    weekdaysShort : 'Son_Maa_Din_Woe_Don_Vry_Sat'.split('_'),
	    weekdaysMin : 'So_Ma_Di_Wo_Do_Vr_Sa'.split('_'),
	    meridiemParse: /vm|nm/i,
	    isPM : function (input) {
	        return /^nm$/i.test(input);
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 12) {
	            return isLower ? 'vm' : 'VM';
	        } else {
	            return isLower ? 'nm' : 'NM';
	        }
	    },
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Vandag om] LT',
	        nextDay : '[Môre om] LT',
	        nextWeek : 'dddd [om] LT',
	        lastDay : '[Gister om] LT',
	        lastWeek : '[Laas] dddd [om] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'oor %s',
	        past : '%s gelede',
	        s : '\'n paar sekondes',
	        m : '\'n minuut',
	        mm : '%d minute',
	        h : '\'n uur',
	        hh : '%d ure',
	        d : '\'n dag',
	        dd : '%d dae',
	        M : '\'n maand',
	        MM : '%d maande',
	        y : '\'n jaar',
	        yy : '%d jaar'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de'); // Thanks to Joris Röling : https://github.com/jjupiter
	    },
	    week : {
	        dow : 1, // Maandag is die eerste dag van die week.
	        doy : 4  // Die week wat die 4de Januarie bevat is die eerste week van die jaar.
	    }
	});

	return af;

	})));


/***/ },
/* 393 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic [ar]
	//! author : Abdel Said: https://github.com/abdelsaid
	//! author : Ahmed Elkhatib
	//! author : forabi https://github.com/forabi

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '١',
	    '2': '٢',
	    '3': '٣',
	    '4': '٤',
	    '5': '٥',
	    '6': '٦',
	    '7': '٧',
	    '8': '٨',
	    '9': '٩',
	    '0': '٠'
	};
	var numberMap = {
	    '١': '1',
	    '٢': '2',
	    '٣': '3',
	    '٤': '4',
	    '٥': '5',
	    '٦': '6',
	    '٧': '7',
	    '٨': '8',
	    '٩': '9',
	    '٠': '0'
	};
	var pluralForm = function (n) {
	    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
	};
	var plurals = {
	    s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
	    m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
	    h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
	    d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
	    M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
	    y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
	};
	var pluralize = function (u) {
	    return function (number, withoutSuffix, string, isFuture) {
	        var f = pluralForm(number),
	            str = plurals[u][pluralForm(number)];
	        if (f === 2) {
	            str = str[withoutSuffix ? 0 : 1];
	        }
	        return str.replace(/%d/i, number);
	    };
	};
	var months = [
	    'كانون الثاني يناير',
	    'شباط فبراير',
	    'آذار مارس',
	    'نيسان أبريل',
	    'أيار مايو',
	    'حزيران يونيو',
	    'تموز يوليو',
	    'آب أغسطس',
	    'أيلول سبتمبر',
	    'تشرين الأول أكتوبر',
	    'تشرين الثاني نوفمبر',
	    'كانون الأول ديسمبر'
	];

	var ar = moment.defineLocale('ar', {
	    months : months,
	    monthsShort : months,
	    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'D/\u200FM/\u200FYYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /ص|م/,
	    isPM : function (input) {
	        return 'م' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'ص';
	        } else {
	            return 'م';
	        }
	    },
	    calendar : {
	        sameDay: '[اليوم عند الساعة] LT',
	        nextDay: '[غدًا عند الساعة] LT',
	        nextWeek: 'dddd [عند الساعة] LT',
	        lastDay: '[أمس عند الساعة] LT',
	        lastWeek: 'dddd [عند الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'بعد %s',
	        past : 'منذ %s',
	        s : pluralize('s'),
	        m : pluralize('m'),
	        mm : pluralize('m'),
	        h : pluralize('h'),
	        hh : pluralize('h'),
	        d : pluralize('d'),
	        dd : pluralize('d'),
	        M : pluralize('M'),
	        MM : pluralize('M'),
	        y : pluralize('y'),
	        yy : pluralize('y')
	    },
	    preparse: function (string) {
	        return string.replace(/\u200f/g, '').replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
	            return numberMap[match];
	        }).replace(/،/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '،');
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ar;

	})));


/***/ },
/* 394 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Algeria) [ar-dz]
	//! author : Noureddine LOUAHEDJ : https://github.com/noureddineme

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var arDz = moment.defineLocale('ar-dz', {
	    months : 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    monthsShort : 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort : 'احد_اثنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin : 'أح_إث_ثلا_أر_خم_جم_سب'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[اليوم على الساعة] LT',
	        nextDay: '[غدا على الساعة] LT',
	        nextWeek: 'dddd [على الساعة] LT',
	        lastDay: '[أمس على الساعة] LT',
	        lastWeek: 'dddd [على الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'في %s',
	        past : 'منذ %s',
	        s : 'ثوان',
	        m : 'دقيقة',
	        mm : '%d دقائق',
	        h : 'ساعة',
	        hh : '%d ساعات',
	        d : 'يوم',
	        dd : '%d أيام',
	        M : 'شهر',
	        MM : '%d أشهر',
	        y : 'سنة',
	        yy : '%d سنوات'
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 4  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return arDz;

	})));


/***/ },
/* 395 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Lybia) [ar-ly]
	//! author : Ali Hmer: https://github.com/kikoanis

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '1',
	    '2': '2',
	    '3': '3',
	    '4': '4',
	    '5': '5',
	    '6': '6',
	    '7': '7',
	    '8': '8',
	    '9': '9',
	    '0': '0'
	};
	var pluralForm = function (n) {
	    return n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5;
	};
	var plurals = {
	    s : ['أقل من ثانية', 'ثانية واحدة', ['ثانيتان', 'ثانيتين'], '%d ثوان', '%d ثانية', '%d ثانية'],
	    m : ['أقل من دقيقة', 'دقيقة واحدة', ['دقيقتان', 'دقيقتين'], '%d دقائق', '%d دقيقة', '%d دقيقة'],
	    h : ['أقل من ساعة', 'ساعة واحدة', ['ساعتان', 'ساعتين'], '%d ساعات', '%d ساعة', '%d ساعة'],
	    d : ['أقل من يوم', 'يوم واحد', ['يومان', 'يومين'], '%d أيام', '%d يومًا', '%d يوم'],
	    M : ['أقل من شهر', 'شهر واحد', ['شهران', 'شهرين'], '%d أشهر', '%d شهرا', '%d شهر'],
	    y : ['أقل من عام', 'عام واحد', ['عامان', 'عامين'], '%d أعوام', '%d عامًا', '%d عام']
	};
	var pluralize = function (u) {
	    return function (number, withoutSuffix, string, isFuture) {
	        var f = pluralForm(number),
	            str = plurals[u][pluralForm(number)];
	        if (f === 2) {
	            str = str[withoutSuffix ? 0 : 1];
	        }
	        return str.replace(/%d/i, number);
	    };
	};
	var months = [
	    'يناير',
	    'فبراير',
	    'مارس',
	    'أبريل',
	    'مايو',
	    'يونيو',
	    'يوليو',
	    'أغسطس',
	    'سبتمبر',
	    'أكتوبر',
	    'نوفمبر',
	    'ديسمبر'
	];

	var arLy = moment.defineLocale('ar-ly', {
	    months : months,
	    monthsShort : months,
	    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'D/\u200FM/\u200FYYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /ص|م/,
	    isPM : function (input) {
	        return 'م' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'ص';
	        } else {
	            return 'م';
	        }
	    },
	    calendar : {
	        sameDay: '[اليوم عند الساعة] LT',
	        nextDay: '[غدًا عند الساعة] LT',
	        nextWeek: 'dddd [عند الساعة] LT',
	        lastDay: '[أمس عند الساعة] LT',
	        lastWeek: 'dddd [عند الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'بعد %s',
	        past : 'منذ %s',
	        s : pluralize('s'),
	        m : pluralize('m'),
	        mm : pluralize('m'),
	        h : pluralize('h'),
	        hh : pluralize('h'),
	        d : pluralize('d'),
	        dd : pluralize('d'),
	        M : pluralize('M'),
	        MM : pluralize('M'),
	        y : pluralize('y'),
	        yy : pluralize('y')
	    },
	    preparse: function (string) {
	        return string.replace(/\u200f/g, '').replace(/،/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '،');
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return arLy;

	})));


/***/ },
/* 396 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Morocco) [ar-ma]
	//! author : ElFadili Yassine : https://github.com/ElFadiliY
	//! author : Abdel Said : https://github.com/abdelsaid

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var arMa = moment.defineLocale('ar-ma', {
	    months : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
	    monthsShort : 'يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر'.split('_'),
	    weekdays : 'الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort : 'احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[اليوم على الساعة] LT',
	        nextDay: '[غدا على الساعة] LT',
	        nextWeek: 'dddd [على الساعة] LT',
	        lastDay: '[أمس على الساعة] LT',
	        lastWeek: 'dddd [على الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'في %s',
	        past : 'منذ %s',
	        s : 'ثوان',
	        m : 'دقيقة',
	        mm : '%d دقائق',
	        h : 'ساعة',
	        hh : '%d ساعات',
	        d : 'يوم',
	        dd : '%d أيام',
	        M : 'شهر',
	        MM : '%d أشهر',
	        y : 'سنة',
	        yy : '%d سنوات'
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return arMa;

	})));


/***/ },
/* 397 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Arabic (Saudi Arabia) [ar-sa]
	//! author : Suhail Alkowaileet : https://github.com/xsoh

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '١',
	    '2': '٢',
	    '3': '٣',
	    '4': '٤',
	    '5': '٥',
	    '6': '٦',
	    '7': '٧',
	    '8': '٨',
	    '9': '٩',
	    '0': '٠'
	};
	var numberMap = {
	    '١': '1',
	    '٢': '2',
	    '٣': '3',
	    '٤': '4',
	    '٥': '5',
	    '٦': '6',
	    '٧': '7',
	    '٨': '8',
	    '٩': '9',
	    '٠': '0'
	};

	var arSa = moment.defineLocale('ar-sa', {
	    months : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    monthsShort : 'يناير_فبراير_مارس_أبريل_مايو_يونيو_يوليو_أغسطس_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    weekdays : 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort : 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin : 'ح_ن_ث_ر_خ_ج_س'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /ص|م/,
	    isPM : function (input) {
	        return 'م' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'ص';
	        } else {
	            return 'م';
	        }
	    },
	    calendar : {
	        sameDay: '[اليوم على الساعة] LT',
	        nextDay: '[غدا على الساعة] LT',
	        nextWeek: 'dddd [على الساعة] LT',
	        lastDay: '[أمس على الساعة] LT',
	        lastWeek: 'dddd [على الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'في %s',
	        past : 'منذ %s',
	        s : 'ثوان',
	        m : 'دقيقة',
	        mm : '%d دقائق',
	        h : 'ساعة',
	        hh : '%d ساعات',
	        d : 'يوم',
	        dd : '%d أيام',
	        M : 'شهر',
	        MM : '%d أشهر',
	        y : 'سنة',
	        yy : '%d سنوات'
	    },
	    preparse: function (string) {
	        return string.replace(/[١٢٣٤٥٦٧٨٩٠]/g, function (match) {
	            return numberMap[match];
	        }).replace(/،/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '،');
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return arSa;

	})));


/***/ },
/* 398 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale  :  Arabic (Tunisia) [ar-tn]
	//! author : Nader Toukabri : https://github.com/naderio

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var arTn = moment.defineLocale('ar-tn', {
	    months: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    monthsShort: 'جانفي_فيفري_مارس_أفريل_ماي_جوان_جويلية_أوت_سبتمبر_أكتوبر_نوفمبر_ديسمبر'.split('_'),
	    weekdays: 'الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت'.split('_'),
	    weekdaysShort: 'أحد_إثنين_ثلاثاء_أربعاء_خميس_جمعة_سبت'.split('_'),
	    weekdaysMin: 'ح_ن_ث_ر_خ_ج_س'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[اليوم على الساعة] LT',
	        nextDay: '[غدا على الساعة] LT',
	        nextWeek: 'dddd [على الساعة] LT',
	        lastDay: '[أمس على الساعة] LT',
	        lastWeek: 'dddd [على الساعة] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: 'في %s',
	        past: 'منذ %s',
	        s: 'ثوان',
	        m: 'دقيقة',
	        mm: '%d دقائق',
	        h: 'ساعة',
	        hh: '%d ساعات',
	        d: 'يوم',
	        dd: '%d أيام',
	        M: 'شهر',
	        MM: '%d أشهر',
	        y: 'سنة',
	        yy: '%d سنوات'
	    },
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4 // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return arTn;

	})));


/***/ },
/* 399 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Azerbaijani [az]
	//! author : topchiyev : https://github.com/topchiyev

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var suffixes = {
	    1: '-inci',
	    5: '-inci',
	    8: '-inci',
	    70: '-inci',
	    80: '-inci',
	    2: '-nci',
	    7: '-nci',
	    20: '-nci',
	    50: '-nci',
	    3: '-üncü',
	    4: '-üncü',
	    100: '-üncü',
	    6: '-ncı',
	    9: '-uncu',
	    10: '-uncu',
	    30: '-uncu',
	    60: '-ıncı',
	    90: '-ıncı'
	};

	var az = moment.defineLocale('az', {
	    months : 'yanvar_fevral_mart_aprel_may_iyun_iyul_avqust_sentyabr_oktyabr_noyabr_dekabr'.split('_'),
	    monthsShort : 'yan_fev_mar_apr_may_iyn_iyl_avq_sen_okt_noy_dek'.split('_'),
	    weekdays : 'Bazar_Bazar ertəsi_Çərşənbə axşamı_Çərşənbə_Cümə axşamı_Cümə_Şənbə'.split('_'),
	    weekdaysShort : 'Baz_BzE_ÇAx_Çər_CAx_Cüm_Şən'.split('_'),
	    weekdaysMin : 'Bz_BE_ÇA_Çə_CA_Cü_Şə'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[bugün saat] LT',
	        nextDay : '[sabah saat] LT',
	        nextWeek : '[gələn həftə] dddd [saat] LT',
	        lastDay : '[dünən] LT',
	        lastWeek : '[keçən həftə] dddd [saat] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s sonra',
	        past : '%s əvvəl',
	        s : 'birneçə saniyyə',
	        m : 'bir dəqiqə',
	        mm : '%d dəqiqə',
	        h : 'bir saat',
	        hh : '%d saat',
	        d : 'bir gün',
	        dd : '%d gün',
	        M : 'bir ay',
	        MM : '%d ay',
	        y : 'bir il',
	        yy : '%d il'
	    },
	    meridiemParse: /gecə|səhər|gündüz|axşam/,
	    isPM : function (input) {
	        return /^(gündüz|axşam)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'gecə';
	        } else if (hour < 12) {
	            return 'səhər';
	        } else if (hour < 17) {
	            return 'gündüz';
	        } else {
	            return 'axşam';
	        }
	    },
	    ordinalParse: /\d{1,2}-(ıncı|inci|nci|üncü|ncı|uncu)/,
	    ordinal : function (number) {
	        if (number === 0) {  // special case for zero
	            return number + '-ıncı';
	        }
	        var a = number % 10,
	            b = number % 100 - a,
	            c = number >= 100 ? 100 : null;
	        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return az;

	})));


/***/ },
/* 400 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Belarusian [be]
	//! author : Dmitry Demidov : https://github.com/demidov91
	//! author: Praleska: http://praleska.pro/
	//! Author : Menelion Elensúle : https://github.com/Oire

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function plural(word, num) {
	    var forms = word.split('_');
	    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': withoutSuffix ? 'хвіліна_хвіліны_хвілін' : 'хвіліну_хвіліны_хвілін',
	        'hh': withoutSuffix ? 'гадзіна_гадзіны_гадзін' : 'гадзіну_гадзіны_гадзін',
	        'dd': 'дзень_дні_дзён',
	        'MM': 'месяц_месяцы_месяцаў',
	        'yy': 'год_гады_гадоў'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? 'хвіліна' : 'хвіліну';
	    }
	    else if (key === 'h') {
	        return withoutSuffix ? 'гадзіна' : 'гадзіну';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}

	var be = moment.defineLocale('be', {
	    months : {
	        format: 'студзеня_лютага_сакавіка_красавіка_траўня_чэрвеня_ліпеня_жніўня_верасня_кастрычніка_лістапада_снежня'.split('_'),
	        standalone: 'студзень_люты_сакавік_красавік_травень_чэрвень_ліпень_жнівень_верасень_кастрычнік_лістапад_снежань'.split('_')
	    },
	    monthsShort : 'студ_лют_сак_крас_трав_чэрв_ліп_жнів_вер_каст_ліст_снеж'.split('_'),
	    weekdays : {
	        format: 'нядзелю_панядзелак_аўторак_сераду_чацвер_пятніцу_суботу'.split('_'),
	        standalone: 'нядзеля_панядзелак_аўторак_серада_чацвер_пятніца_субота'.split('_'),
	        isFormat: /\[ ?[Вв] ?(?:мінулую|наступную)? ?\] ?dddd/
	    },
	    weekdaysShort : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
	    weekdaysMin : 'нд_пн_ат_ср_чц_пт_сб'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY г.',
	        LLL : 'D MMMM YYYY г., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY г., HH:mm'
	    },
	    calendar : {
	        sameDay: '[Сёння ў] LT',
	        nextDay: '[Заўтра ў] LT',
	        lastDay: '[Учора ў] LT',
	        nextWeek: function () {
	            return '[У] dddd [ў] LT';
	        },
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 5:
	                case 6:
	                    return '[У мінулую] dddd [ў] LT';
	                case 1:
	                case 2:
	                case 4:
	                    return '[У мінулы] dddd [ў] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'праз %s',
	        past : '%s таму',
	        s : 'некалькі секунд',
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : relativeTimeWithPlural,
	        hh : relativeTimeWithPlural,
	        d : 'дзень',
	        dd : relativeTimeWithPlural,
	        M : 'месяц',
	        MM : relativeTimeWithPlural,
	        y : 'год',
	        yy : relativeTimeWithPlural
	    },
	    meridiemParse: /ночы|раніцы|дня|вечара/,
	    isPM : function (input) {
	        return /^(дня|вечара)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'ночы';
	        } else if (hour < 12) {
	            return 'раніцы';
	        } else if (hour < 17) {
	            return 'дня';
	        } else {
	            return 'вечара';
	        }
	    },
	    ordinalParse: /\d{1,2}-(і|ы|га)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	            case 'w':
	            case 'W':
	                return (number % 10 === 2 || number % 10 === 3) && (number % 100 !== 12 && number % 100 !== 13) ? number + '-і' : number + '-ы';
	            case 'D':
	                return number + '-га';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return be;

	})));


/***/ },
/* 401 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Bulgarian [bg]
	//! author : Krasen Borisov : https://github.com/kraz

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var bg = moment.defineLocale('bg', {
	    months : 'януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември'.split('_'),
	    monthsShort : 'янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек'.split('_'),
	    weekdays : 'неделя_понеделник_вторник_сряда_четвъртък_петък_събота'.split('_'),
	    weekdaysShort : 'нед_пон_вто_сря_чет_пет_съб'.split('_'),
	    weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'D.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd, D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay : '[Днес в] LT',
	        nextDay : '[Утре в] LT',
	        nextWeek : 'dddd [в] LT',
	        lastDay : '[Вчера в] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 6:
	                    return '[В изминалата] dddd [в] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[В изминалия] dddd [в] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'след %s',
	        past : 'преди %s',
	        s : 'няколко секунди',
	        m : 'минута',
	        mm : '%d минути',
	        h : 'час',
	        hh : '%d часа',
	        d : 'ден',
	        dd : '%d дни',
	        M : 'месец',
	        MM : '%d месеца',
	        y : 'година',
	        yy : '%d години'
	    },
	    ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
	    ordinal : function (number) {
	        var lastDigit = number % 10,
	            last2Digits = number % 100;
	        if (number === 0) {
	            return number + '-ев';
	        } else if (last2Digits === 0) {
	            return number + '-ен';
	        } else if (last2Digits > 10 && last2Digits < 20) {
	            return number + '-ти';
	        } else if (lastDigit === 1) {
	            return number + '-ви';
	        } else if (lastDigit === 2) {
	            return number + '-ри';
	        } else if (lastDigit === 7 || lastDigit === 8) {
	            return number + '-ми';
	        } else {
	            return number + '-ти';
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return bg;

	})));


/***/ },
/* 402 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Bengali [bn]
	//! author : Kaushik Gandhi : https://github.com/kaushikgandhi

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '১',
	    '2': '২',
	    '3': '৩',
	    '4': '৪',
	    '5': '৫',
	    '6': '৬',
	    '7': '৭',
	    '8': '৮',
	    '9': '৯',
	    '0': '০'
	};
	var numberMap = {
	    '১': '1',
	    '২': '2',
	    '৩': '3',
	    '৪': '4',
	    '৫': '5',
	    '৬': '6',
	    '৭': '7',
	    '৮': '8',
	    '৯': '9',
	    '০': '0'
	};

	var bn = moment.defineLocale('bn', {
	    months : 'জানুয়ারী_ফেব্রুয়ারি_মার্চ_এপ্রিল_মে_জুন_জুলাই_আগস্ট_সেপ্টেম্বর_অক্টোবর_নভেম্বর_ডিসেম্বর'.split('_'),
	    monthsShort : 'জানু_ফেব_মার্চ_এপ্র_মে_জুন_জুল_আগ_সেপ্ট_অক্টো_নভে_ডিসে'.split('_'),
	    weekdays : 'রবিবার_সোমবার_মঙ্গলবার_বুধবার_বৃহস্পতিবার_শুক্রবার_শনিবার'.split('_'),
	    weekdaysShort : 'রবি_সোম_মঙ্গল_বুধ_বৃহস্পতি_শুক্র_শনি'.split('_'),
	    weekdaysMin : 'রবি_সোম_মঙ্গ_বুধ_বৃহঃ_শুক্র_শনি'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm সময়',
	        LTS : 'A h:mm:ss সময়',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm সময়',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm সময়'
	    },
	    calendar : {
	        sameDay : '[আজ] LT',
	        nextDay : '[আগামীকাল] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[গতকাল] LT',
	        lastWeek : '[গত] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s পরে',
	        past : '%s আগে',
	        s : 'কয়েক সেকেন্ড',
	        m : 'এক মিনিট',
	        mm : '%d মিনিট',
	        h : 'এক ঘন্টা',
	        hh : '%d ঘন্টা',
	        d : 'এক দিন',
	        dd : '%d দিন',
	        M : 'এক মাস',
	        MM : '%d মাস',
	        y : 'এক বছর',
	        yy : '%d বছর'
	    },
	    preparse: function (string) {
	        return string.replace(/[১২৩৪৫৬৭৮৯০]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /রাত|সকাল|দুপুর|বিকাল|রাত/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if ((meridiem === 'রাত' && hour >= 4) ||
	                (meridiem === 'দুপুর' && hour < 5) ||
	                meridiem === 'বিকাল') {
	            return hour + 12;
	        } else {
	            return hour;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'রাত';
	        } else if (hour < 10) {
	            return 'সকাল';
	        } else if (hour < 17) {
	            return 'দুপুর';
	        } else if (hour < 20) {
	            return 'বিকাল';
	        } else {
	            return 'রাত';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return bn;

	})));


/***/ },
/* 403 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tibetan [bo]
	//! author : Thupten N. Chakrishar : https://github.com/vajradog

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '༡',
	    '2': '༢',
	    '3': '༣',
	    '4': '༤',
	    '5': '༥',
	    '6': '༦',
	    '7': '༧',
	    '8': '༨',
	    '9': '༩',
	    '0': '༠'
	};
	var numberMap = {
	    '༡': '1',
	    '༢': '2',
	    '༣': '3',
	    '༤': '4',
	    '༥': '5',
	    '༦': '6',
	    '༧': '7',
	    '༨': '8',
	    '༩': '9',
	    '༠': '0'
	};

	var bo = moment.defineLocale('bo', {
	    months : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
	    monthsShort : 'ཟླ་བ་དང་པོ_ཟླ་བ་གཉིས་པ_ཟླ་བ་གསུམ་པ_ཟླ་བ་བཞི་པ_ཟླ་བ་ལྔ་པ_ཟླ་བ་དྲུག་པ_ཟླ་བ་བདུན་པ_ཟླ་བ་བརྒྱད་པ_ཟླ་བ་དགུ་པ_ཟླ་བ་བཅུ་པ_ཟླ་བ་བཅུ་གཅིག་པ_ཟླ་བ་བཅུ་གཉིས་པ'.split('_'),
	    weekdays : 'གཟའ་ཉི་མ་_གཟའ་ཟླ་བ་_གཟའ་མིག་དམར་_གཟའ་ལྷག་པ་_གཟའ་ཕུར་བུ_གཟའ་པ་སངས་_གཟའ་སྤེན་པ་'.split('_'),
	    weekdaysShort : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
	    weekdaysMin : 'ཉི་མ་_ཟླ་བ་_མིག་དམར་_ལྷག་པ་_ཕུར་བུ_པ་སངས་_སྤེན་པ་'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm',
	        LTS : 'A h:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm'
	    },
	    calendar : {
	        sameDay : '[དི་རིང] LT',
	        nextDay : '[སང་ཉིན] LT',
	        nextWeek : '[བདུན་ཕྲག་རྗེས་མ], LT',
	        lastDay : '[ཁ་སང] LT',
	        lastWeek : '[བདུན་ཕྲག་མཐའ་མ] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ལ་',
	        past : '%s སྔན་ལ',
	        s : 'ལམ་སང',
	        m : 'སྐར་མ་གཅིག',
	        mm : '%d སྐར་མ',
	        h : 'ཆུ་ཚོད་གཅིག',
	        hh : '%d ཆུ་ཚོད',
	        d : 'ཉིན་གཅིག',
	        dd : '%d ཉིན་',
	        M : 'ཟླ་བ་གཅིག',
	        MM : '%d ཟླ་བ',
	        y : 'ལོ་གཅིག',
	        yy : '%d ལོ'
	    },
	    preparse: function (string) {
	        return string.replace(/[༡༢༣༤༥༦༧༨༩༠]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /མཚན་མོ|ཞོགས་ཀས|ཉིན་གུང|དགོང་དག|མཚན་མོ/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if ((meridiem === 'མཚན་མོ' && hour >= 4) ||
	                (meridiem === 'ཉིན་གུང' && hour < 5) ||
	                meridiem === 'དགོང་དག') {
	            return hour + 12;
	        } else {
	            return hour;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'མཚན་མོ';
	        } else if (hour < 10) {
	            return 'ཞོགས་ཀས';
	        } else if (hour < 17) {
	            return 'ཉིན་གུང';
	        } else if (hour < 20) {
	            return 'དགོང་དག';
	        } else {
	            return 'མཚན་མོ';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return bo;

	})));


/***/ },
/* 404 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Breton [br]
	//! author : Jean-Baptiste Le Duigou : https://github.com/jbleduigou

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function relativeTimeWithMutation(number, withoutSuffix, key) {
	    var format = {
	        'mm': 'munutenn',
	        'MM': 'miz',
	        'dd': 'devezh'
	    };
	    return number + ' ' + mutation(format[key], number);
	}
	function specialMutationForYears(number) {
	    switch (lastNumber(number)) {
	        case 1:
	        case 3:
	        case 4:
	        case 5:
	        case 9:
	            return number + ' bloaz';
	        default:
	            return number + ' vloaz';
	    }
	}
	function lastNumber(number) {
	    if (number > 9) {
	        return lastNumber(number % 10);
	    }
	    return number;
	}
	function mutation(text, number) {
	    if (number === 2) {
	        return softMutation(text);
	    }
	    return text;
	}
	function softMutation(text) {
	    var mutationTable = {
	        'm': 'v',
	        'b': 'v',
	        'd': 'z'
	    };
	    if (mutationTable[text.charAt(0)] === undefined) {
	        return text;
	    }
	    return mutationTable[text.charAt(0)] + text.substring(1);
	}

	var br = moment.defineLocale('br', {
	    months : 'Genver_C\'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu'.split('_'),
	    monthsShort : 'Gen_C\'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker'.split('_'),
	    weekdays : 'Sul_Lun_Meurzh_Merc\'her_Yaou_Gwener_Sadorn'.split('_'),
	    weekdaysShort : 'Sul_Lun_Meu_Mer_Yao_Gwe_Sad'.split('_'),
	    weekdaysMin : 'Su_Lu_Me_Mer_Ya_Gw_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'h[e]mm A',
	        LTS : 'h[e]mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D [a viz] MMMM YYYY',
	        LLL : 'D [a viz] MMMM YYYY h[e]mm A',
	        LLLL : 'dddd, D [a viz] MMMM YYYY h[e]mm A'
	    },
	    calendar : {
	        sameDay : '[Hiziv da] LT',
	        nextDay : '[Warc\'hoazh da] LT',
	        nextWeek : 'dddd [da] LT',
	        lastDay : '[Dec\'h da] LT',
	        lastWeek : 'dddd [paset da] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'a-benn %s',
	        past : '%s \'zo',
	        s : 'un nebeud segondennoù',
	        m : 'ur vunutenn',
	        mm : relativeTimeWithMutation,
	        h : 'un eur',
	        hh : '%d eur',
	        d : 'un devezh',
	        dd : relativeTimeWithMutation,
	        M : 'ur miz',
	        MM : relativeTimeWithMutation,
	        y : 'ur bloaz',
	        yy : specialMutationForYears
	    },
	    ordinalParse: /\d{1,2}(añ|vet)/,
	    ordinal : function (number) {
	        var output = (number === 1) ? 'añ' : 'vet';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return br;

	})));


/***/ },
/* 405 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Bosnian [bs]
	//! author : Nedim Cholich : https://github.com/frontyard
	//! based on (hr) translation by Bojan Marković

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function translate(number, withoutSuffix, key) {
	    var result = number + ' ';
	    switch (key) {
	        case 'm':
	            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
	        case 'mm':
	            if (number === 1) {
	                result += 'minuta';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'minute';
	            } else {
	                result += 'minuta';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'jedan sat' : 'jednog sata';
	        case 'hh':
	            if (number === 1) {
	                result += 'sat';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'sata';
	            } else {
	                result += 'sati';
	            }
	            return result;
	        case 'dd':
	            if (number === 1) {
	                result += 'dan';
	            } else {
	                result += 'dana';
	            }
	            return result;
	        case 'MM':
	            if (number === 1) {
	                result += 'mjesec';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'mjeseca';
	            } else {
	                result += 'mjeseci';
	            }
	            return result;
	        case 'yy':
	            if (number === 1) {
	                result += 'godina';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'godine';
	            } else {
	                result += 'godina';
	            }
	            return result;
	    }
	}

	var bs = moment.defineLocale('bs', {
	    months : 'januar_februar_mart_april_maj_juni_juli_august_septembar_oktobar_novembar_decembar'.split('_'),
	    monthsShort : 'jan._feb._mar._apr._maj._jun._jul._aug._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
	    weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
	    weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[danas u] LT',
	        nextDay  : '[sutra u] LT',
	        nextWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[jučer u] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                    return '[prošlu] dddd [u] LT';
	                case 6:
	                    return '[prošle] [subote] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[prošli] dddd [u] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'prije %s',
	        s      : 'par sekundi',
	        m      : translate,
	        mm     : translate,
	        h      : translate,
	        hh     : translate,
	        d      : 'dan',
	        dd     : translate,
	        M      : 'mjesec',
	        MM     : translate,
	        y      : 'godinu',
	        yy     : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return bs;

	})));


/***/ },
/* 406 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Catalan [ca]
	//! author : Juan G. Hurtado : https://github.com/juanghurtado

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ca = moment.defineLocale('ca', {
	    months : 'gener_febrer_març_abril_maig_juny_juliol_agost_setembre_octubre_novembre_desembre'.split('_'),
	    monthsShort : 'gen._febr._mar._abr._mai._jun._jul._ag._set._oct._nov._des.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'diumenge_dilluns_dimarts_dimecres_dijous_divendres_dissabte'.split('_'),
	    weekdaysShort : 'dg._dl._dt._dc._dj._dv._ds.'.split('_'),
	    weekdaysMin : 'Dg_Dl_Dt_Dc_Dj_Dv_Ds'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        nextDay : function () {
	            return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        lastDay : function () {
	            return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'd\'aquí %s',
	        past : 'fa %s',
	        s : 'uns segons',
	        m : 'un minut',
	        mm : '%d minuts',
	        h : 'una hora',
	        hh : '%d hores',
	        d : 'un dia',
	        dd : '%d dies',
	        M : 'un mes',
	        MM : '%d mesos',
	        y : 'un any',
	        yy : '%d anys'
	    },
	    ordinalParse: /\d{1,2}(r|n|t|è|a)/,
	    ordinal : function (number, period) {
	        var output = (number === 1) ? 'r' :
	            (number === 2) ? 'n' :
	            (number === 3) ? 'r' :
	            (number === 4) ? 't' : 'è';
	        if (period === 'w' || period === 'W') {
	            output = 'a';
	        }
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return ca;

	})));


/***/ },
/* 407 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Czech [cs]
	//! author : petrbela : https://github.com/petrbela

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var months = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_');
	var monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');
	function plural(n) {
	    return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':  // a few seconds / in a few seconds / a few seconds ago
	            return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
	        case 'm':  // a minute / in a minute / a minute ago
	            return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
	        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'minuty' : 'minut');
	            } else {
	                return result + 'minutami';
	            }
	            break;
	        case 'h':  // an hour / in an hour / an hour ago
	            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
	        case 'hh': // 9 hours / in 9 hours / 9 hours ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'hodiny' : 'hodin');
	            } else {
	                return result + 'hodinami';
	            }
	            break;
	        case 'd':  // a day / in a day / a day ago
	            return (withoutSuffix || isFuture) ? 'den' : 'dnem';
	        case 'dd': // 9 days / in 9 days / 9 days ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'dny' : 'dní');
	            } else {
	                return result + 'dny';
	            }
	            break;
	        case 'M':  // a month / in a month / a month ago
	            return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
	        case 'MM': // 9 months / in 9 months / 9 months ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'měsíce' : 'měsíců');
	            } else {
	                return result + 'měsíci';
	            }
	            break;
	        case 'y':  // a year / in a year / a year ago
	            return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
	        case 'yy': // 9 years / in 9 years / 9 years ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'roky' : 'let');
	            } else {
	                return result + 'lety';
	            }
	            break;
	    }
	}

	var cs = moment.defineLocale('cs', {
	    months : months,
	    monthsShort : monthsShort,
	    monthsParse : (function (months, monthsShort) {
	        var i, _monthsParse = [];
	        for (i = 0; i < 12; i++) {
	            // use custom parser to solve problem with July (červenec)
	            _monthsParse[i] = new RegExp('^' + months[i] + '$|^' + monthsShort[i] + '$', 'i');
	        }
	        return _monthsParse;
	    }(months, monthsShort)),
	    shortMonthsParse : (function (monthsShort) {
	        var i, _shortMonthsParse = [];
	        for (i = 0; i < 12; i++) {
	            _shortMonthsParse[i] = new RegExp('^' + monthsShort[i] + '$', 'i');
	        }
	        return _shortMonthsParse;
	    }(monthsShort)),
	    longMonthsParse : (function (months) {
	        var i, _longMonthsParse = [];
	        for (i = 0; i < 12; i++) {
	            _longMonthsParse[i] = new RegExp('^' + months[i] + '$', 'i');
	        }
	        return _longMonthsParse;
	    }(months)),
	    weekdays : 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
	    weekdaysShort : 'ne_po_út_st_čt_pá_so'.split('_'),
	    weekdaysMin : 'ne_po_út_st_čt_pá_so'.split('_'),
	    longDateFormat : {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd D. MMMM YYYY H:mm',
	        l : 'D. M. YYYY'
	    },
	    calendar : {
	        sameDay: '[dnes v] LT',
	        nextDay: '[zítra v] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[v neděli v] LT';
	                case 1:
	                case 2:
	                    return '[v] dddd [v] LT';
	                case 3:
	                    return '[ve středu v] LT';
	                case 4:
	                    return '[ve čtvrtek v] LT';
	                case 5:
	                    return '[v pátek v] LT';
	                case 6:
	                    return '[v sobotu v] LT';
	            }
	        },
	        lastDay: '[včera v] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[minulou neděli v] LT';
	                case 1:
	                case 2:
	                    return '[minulé] dddd [v] LT';
	                case 3:
	                    return '[minulou středu v] LT';
	                case 4:
	                case 5:
	                    return '[minulý] dddd [v] LT';
	                case 6:
	                    return '[minulou sobotu v] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past : 'před %s',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse : /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return cs;

	})));


/***/ },
/* 408 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chuvash [cv]
	//! author : Anatoly Mironov : https://github.com/mirontoli

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var cv = moment.defineLocale('cv', {
	    months : 'кӑрлач_нарӑс_пуш_ака_май_ҫӗртме_утӑ_ҫурла_авӑн_юпа_чӳк_раштав'.split('_'),
	    monthsShort : 'кӑр_нар_пуш_ака_май_ҫӗр_утӑ_ҫур_авн_юпа_чӳк_раш'.split('_'),
	    weekdays : 'вырсарникун_тунтикун_ытларикун_юнкун_кӗҫнерникун_эрнекун_шӑматкун'.split('_'),
	    weekdaysShort : 'выр_тун_ытл_юн_кӗҫ_эрн_шӑм'.split('_'),
	    weekdaysMin : 'вр_тн_ыт_юн_кҫ_эр_шм'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ]',
	        LLL : 'YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm',
	        LLLL : 'dddd, YYYY [ҫулхи] MMMM [уйӑхӗн] D[-мӗшӗ], HH:mm'
	    },
	    calendar : {
	        sameDay: '[Паян] LT [сехетре]',
	        nextDay: '[Ыран] LT [сехетре]',
	        lastDay: '[Ӗнер] LT [сехетре]',
	        nextWeek: '[Ҫитес] dddd LT [сехетре]',
	        lastWeek: '[Иртнӗ] dddd LT [сехетре]',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : function (output) {
	            var affix = /сехет$/i.exec(output) ? 'рен' : /ҫул$/i.exec(output) ? 'тан' : 'ран';
	            return output + affix;
	        },
	        past : '%s каялла',
	        s : 'пӗр-ик ҫеккунт',
	        m : 'пӗр минут',
	        mm : '%d минут',
	        h : 'пӗр сехет',
	        hh : '%d сехет',
	        d : 'пӗр кун',
	        dd : '%d кун',
	        M : 'пӗр уйӑх',
	        MM : '%d уйӑх',
	        y : 'пӗр ҫул',
	        yy : '%d ҫул'
	    },
	    ordinalParse: /\d{1,2}-мӗш/,
	    ordinal : '%d-мӗш',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return cv;

	})));


/***/ },
/* 409 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Welsh [cy]
	//! author : Robert Allen : https://github.com/robgallen
	//! author : https://github.com/ryangreaves

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var cy = moment.defineLocale('cy', {
	    months: 'Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr'.split('_'),
	    monthsShort: 'Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag'.split('_'),
	    weekdays: 'Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn'.split('_'),
	    weekdaysShort: 'Sul_Llun_Maw_Mer_Iau_Gwe_Sad'.split('_'),
	    weekdaysMin: 'Su_Ll_Ma_Me_Ia_Gw_Sa'.split('_'),
	    weekdaysParseExact : true,
	    // time formats are the same as en-gb
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[Heddiw am] LT',
	        nextDay: '[Yfory am] LT',
	        nextWeek: 'dddd [am] LT',
	        lastDay: '[Ddoe am] LT',
	        lastWeek: 'dddd [diwethaf am] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: 'mewn %s',
	        past: '%s yn ôl',
	        s: 'ychydig eiliadau',
	        m: 'munud',
	        mm: '%d munud',
	        h: 'awr',
	        hh: '%d awr',
	        d: 'diwrnod',
	        dd: '%d diwrnod',
	        M: 'mis',
	        MM: '%d mis',
	        y: 'blwyddyn',
	        yy: '%d flynedd'
	    },
	    ordinalParse: /\d{1,2}(fed|ain|af|il|ydd|ed|eg)/,
	    // traditional ordinal numbers above 31 are not commonly used in colloquial Welsh
	    ordinal: function (number) {
	        var b = number,
	            output = '',
	            lookup = [
	                '', 'af', 'il', 'ydd', 'ydd', 'ed', 'ed', 'ed', 'fed', 'fed', 'fed', // 1af to 10fed
	                'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'eg', 'fed', 'eg', 'fed' // 11eg to 20fed
	            ];
	        if (b > 20) {
	            if (b === 40 || b === 50 || b === 60 || b === 80 || b === 100) {
	                output = 'fed'; // not 30ain, 70ain or 90ain
	            } else {
	                output = 'ain';
	            }
	        } else if (b > 0) {
	            output = lookup[b];
	        }
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return cy;

	})));


/***/ },
/* 410 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Danish [da]
	//! author : Ulrik Nielsen : https://github.com/mrbase

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var da = moment.defineLocale('da', {
	    months : 'januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
	    weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
	    weekdaysShort : 'søn_man_tir_ons_tor_fre_lør'.split('_'),
	    weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY HH:mm',
	        LLLL : 'dddd [d.] D. MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[I dag kl.] LT',
	        nextDay : '[I morgen kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[I går kl.] LT',
	        lastWeek : '[sidste] dddd [kl] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : '%s siden',
	        s : 'få sekunder',
	        m : 'et minut',
	        mm : '%d minutter',
	        h : 'en time',
	        hh : '%d timer',
	        d : 'en dag',
	        dd : '%d dage',
	        M : 'en måned',
	        MM : '%d måneder',
	        y : 'et år',
	        yy : '%d år'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return da;

	})));


/***/ },
/* 411 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : German [de]
	//! author : lluchs : https://github.com/lluchs
	//! author: Menelion Elensúle: https://github.com/Oire
	//! author : Mikolaj Dadela : https://github.com/mik01aj

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        'm': ['eine Minute', 'einer Minute'],
	        'h': ['eine Stunde', 'einer Stunde'],
	        'd': ['ein Tag', 'einem Tag'],
	        'dd': [number + ' Tage', number + ' Tagen'],
	        'M': ['ein Monat', 'einem Monat'],
	        'MM': [number + ' Monate', number + ' Monaten'],
	        'y': ['ein Jahr', 'einem Jahr'],
	        'yy': [number + ' Jahre', number + ' Jahren']
	    };
	    return withoutSuffix ? format[key][0] : format[key][1];
	}

	var de = moment.defineLocale('de', {
	    months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
	    monthsShort : 'Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
	    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
	    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY HH:mm',
	        LLLL : 'dddd, D. MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[heute um] LT [Uhr]',
	        sameElse: 'L',
	        nextDay: '[morgen um] LT [Uhr]',
	        nextWeek: 'dddd [um] LT [Uhr]',
	        lastDay: '[gestern um] LT [Uhr]',
	        lastWeek: '[letzten] dddd [um] LT [Uhr]'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : 'vor %s',
	        s : 'ein paar Sekunden',
	        m : processRelativeTime,
	        mm : '%d Minuten',
	        h : processRelativeTime,
	        hh : '%d Stunden',
	        d : processRelativeTime,
	        dd : processRelativeTime,
	        M : processRelativeTime,
	        MM : processRelativeTime,
	        y : processRelativeTime,
	        yy : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return de;

	})));


/***/ },
/* 412 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : German (Austria) [de-at]
	//! author : lluchs : https://github.com/lluchs
	//! author: Menelion Elensúle: https://github.com/Oire
	//! author : Martin Groller : https://github.com/MadMG
	//! author : Mikolaj Dadela : https://github.com/mik01aj

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        'm': ['eine Minute', 'einer Minute'],
	        'h': ['eine Stunde', 'einer Stunde'],
	        'd': ['ein Tag', 'einem Tag'],
	        'dd': [number + ' Tage', number + ' Tagen'],
	        'M': ['ein Monat', 'einem Monat'],
	        'MM': [number + ' Monate', number + ' Monaten'],
	        'y': ['ein Jahr', 'einem Jahr'],
	        'yy': [number + ' Jahre', number + ' Jahren']
	    };
	    return withoutSuffix ? format[key][0] : format[key][1];
	}

	var deAt = moment.defineLocale('de-at', {
	    months : 'Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
	    monthsShort : 'Jän._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
	    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
	    weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY HH:mm',
	        LLLL : 'dddd, D. MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[heute um] LT [Uhr]',
	        sameElse: 'L',
	        nextDay: '[morgen um] LT [Uhr]',
	        nextWeek: 'dddd [um] LT [Uhr]',
	        lastDay: '[gestern um] LT [Uhr]',
	        lastWeek: '[letzten] dddd [um] LT [Uhr]'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : 'vor %s',
	        s : 'ein paar Sekunden',
	        m : processRelativeTime,
	        mm : '%d Minuten',
	        h : processRelativeTime,
	        hh : '%d Stunden',
	        d : processRelativeTime,
	        dd : processRelativeTime,
	        M : processRelativeTime,
	        MM : processRelativeTime,
	        y : processRelativeTime,
	        yy : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return deAt;

	})));


/***/ },
/* 413 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Maldivian [dv]
	//! author : Jawish Hameed : https://github.com/jawish

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var months = [
	    'ޖެނުއަރީ',
	    'ފެބްރުއަރީ',
	    'މާރިޗު',
	    'އޭޕްރީލު',
	    'މޭ',
	    'ޖޫން',
	    'ޖުލައި',
	    'އޯގަސްޓު',
	    'ސެޕްޓެމްބަރު',
	    'އޮކްޓޯބަރު',
	    'ނޮވެމްބަރު',
	    'ޑިސެމްބަރު'
	];
	var weekdays = [
	    'އާދިއްތަ',
	    'ހޯމަ',
	    'އަންގާރަ',
	    'ބުދަ',
	    'ބުރާސްފަތި',
	    'ހުކުރު',
	    'ހޮނިހިރު'
	];

	var dv = moment.defineLocale('dv', {
	    months : months,
	    monthsShort : months,
	    weekdays : weekdays,
	    weekdaysShort : weekdays,
	    weekdaysMin : 'އާދި_ހޯމަ_އަން_ބުދަ_ބުރާ_ހުކު_ހޮނި'.split('_'),
	    longDateFormat : {

	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'D/M/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /މކ|މފ/,
	    isPM : function (input) {
	        return 'މފ' === input;
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'މކ';
	        } else {
	            return 'މފ';
	        }
	    },
	    calendar : {
	        sameDay : '[މިއަދު] LT',
	        nextDay : '[މާދަމާ] LT',
	        nextWeek : 'dddd LT',
	        lastDay : '[އިއްޔެ] LT',
	        lastWeek : '[ފާއިތުވި] dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'ތެރޭގައި %s',
	        past : 'ކުރިން %s',
	        s : 'ސިކުންތުކޮޅެއް',
	        m : 'މިނިޓެއް',
	        mm : 'މިނިޓު %d',
	        h : 'ގަޑިއިރެއް',
	        hh : 'ގަޑިއިރު %d',
	        d : 'ދުވަހެއް',
	        dd : 'ދުވަސް %d',
	        M : 'މަހެއް',
	        MM : 'މަސް %d',
	        y : 'އަހަރެއް',
	        yy : 'އަހަރު %d'
	    },
	    preparse: function (string) {
	        return string.replace(/،/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/,/g, '،');
	    },
	    week : {
	        dow : 7,  // Sunday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return dv;

	})));


/***/ },
/* 414 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Greek [el]
	//! author : Aggelos Karalias : https://github.com/mehiel

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';

	function isFunction(input) {
	    return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
	}


	var el = moment.defineLocale('el', {
	    monthsNominativeEl : 'Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος'.split('_'),
	    monthsGenitiveEl : 'Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου'.split('_'),
	    months : function (momentToFormat, format) {
	        if (/D/.test(format.substring(0, format.indexOf('MMMM')))) { // if there is a day number before 'MMMM'
	            return this._monthsGenitiveEl[momentToFormat.month()];
	        } else {
	            return this._monthsNominativeEl[momentToFormat.month()];
	        }
	    },
	    monthsShort : 'Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ'.split('_'),
	    weekdays : 'Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο'.split('_'),
	    weekdaysShort : 'Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ'.split('_'),
	    weekdaysMin : 'Κυ_Δε_Τρ_Τε_Πε_Πα_Σα'.split('_'),
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'μμ' : 'ΜΜ';
	        } else {
	            return isLower ? 'πμ' : 'ΠΜ';
	        }
	    },
	    isPM : function (input) {
	        return ((input + '').toLowerCase()[0] === 'μ');
	    },
	    meridiemParse : /[ΠΜ]\.?Μ?\.?/i,
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendarEl : {
	        sameDay : '[Σήμερα {}] LT',
	        nextDay : '[Αύριο {}] LT',
	        nextWeek : 'dddd [{}] LT',
	        lastDay : '[Χθες {}] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 6:
	                    return '[το προηγούμενο] dddd [{}] LT';
	                default:
	                    return '[την προηγούμενη] dddd [{}] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    calendar : function (key, mom) {
	        var output = this._calendarEl[key],
	            hours = mom && mom.hours();
	        if (isFunction(output)) {
	            output = output.apply(mom);
	        }
	        return output.replace('{}', (hours % 12 === 1 ? 'στη' : 'στις'));
	    },
	    relativeTime : {
	        future : 'σε %s',
	        past : '%s πριν',
	        s : 'λίγα δευτερόλεπτα',
	        m : 'ένα λεπτό',
	        mm : '%d λεπτά',
	        h : 'μία ώρα',
	        hh : '%d ώρες',
	        d : 'μία μέρα',
	        dd : '%d μέρες',
	        M : 'ένας μήνας',
	        MM : '%d μήνες',
	        y : 'ένας χρόνος',
	        yy : '%d χρόνια'
	    },
	    ordinalParse: /\d{1,2}η/,
	    ordinal: '%dη',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4st is the first week of the year.
	    }
	});

	return el;

	})));


/***/ },
/* 415 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (Australia) [en-au]
	//! author : Jared Morse : https://github.com/jarcoal

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enAu = moment.defineLocale('en-au', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return enAu;

	})));


/***/ },
/* 416 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (Canada) [en-ca]
	//! author : Jonathan Abourbih : https://github.com/jonbca

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enCa = moment.defineLocale('en-ca', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'YYYY-MM-DD',
	        LL : 'MMMM D, YYYY',
	        LLL : 'MMMM D, YYYY h:mm A',
	        LLLL : 'dddd, MMMM D, YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    }
	});

	return enCa;

	})));


/***/ },
/* 417 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (United Kingdom) [en-gb]
	//! author : Chris Gedrim : https://github.com/chrisgedrim

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enGb = moment.defineLocale('en-gb', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return enGb;

	})));


/***/ },
/* 418 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (Ireland) [en-ie]
	//! author : Chris Cartlidge : https://github.com/chriscartlidge

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enIe = moment.defineLocale('en-ie', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return enIe;

	})));


/***/ },
/* 419 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : English (New Zealand) [en-nz]
	//! author : Luke McGregor : https://github.com/lukemcgregor

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var enNz = moment.defineLocale('en-nz', {
	    months : 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
	    weekdays : 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
	    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
	    weekdaysMin : 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Today at] LT',
	        nextDay : '[Tomorrow at] LT',
	        nextWeek : 'dddd [at] LT',
	        lastDay : '[Yesterday at] LT',
	        lastWeek : '[Last] dddd [at] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'in %s',
	        past : '%s ago',
	        s : 'a few seconds',
	        m : 'a minute',
	        mm : '%d minutes',
	        h : 'an hour',
	        hh : '%d hours',
	        d : 'a day',
	        dd : '%d days',
	        M : 'a month',
	        MM : '%d months',
	        y : 'a year',
	        yy : '%d years'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return enNz;

	})));


/***/ },
/* 420 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Esperanto [eo]
	//! author : Colin Dean : https://github.com/colindean
	//! komento: Mi estas malcerta se mi korekte traktis akuzativojn en tiu traduko.
	//!          Se ne, bonvolu korekti kaj avizi min por ke mi povas lerni!

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var eo = moment.defineLocale('eo', {
	    months : 'januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec'.split('_'),
	    weekdays : 'Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato'.split('_'),
	    weekdaysShort : 'Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Ĵa_Ve_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'D[-an de] MMMM, YYYY',
	        LLL : 'D[-an de] MMMM, YYYY HH:mm',
	        LLLL : 'dddd, [la] D[-an de] MMMM, YYYY HH:mm'
	    },
	    meridiemParse: /[ap]\.t\.m/i,
	    isPM: function (input) {
	        return input.charAt(0).toLowerCase() === 'p';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'p.t.m.' : 'P.T.M.';
	        } else {
	            return isLower ? 'a.t.m.' : 'A.T.M.';
	        }
	    },
	    calendar : {
	        sameDay : '[Hodiaŭ je] LT',
	        nextDay : '[Morgaŭ je] LT',
	        nextWeek : 'dddd [je] LT',
	        lastDay : '[Hieraŭ je] LT',
	        lastWeek : '[pasinta] dddd [je] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'je %s',
	        past : 'antaŭ %s',
	        s : 'sekundoj',
	        m : 'minuto',
	        mm : '%d minutoj',
	        h : 'horo',
	        hh : '%d horoj',
	        d : 'tago',//ne 'diurno', ĉar estas uzita por proksimumo
	        dd : '%d tagoj',
	        M : 'monato',
	        MM : '%d monatoj',
	        y : 'jaro',
	        yy : '%d jaroj'
	    },
	    ordinalParse: /\d{1,2}a/,
	    ordinal : '%da',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return eo;

	})));


/***/ },
/* 421 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Spanish [es]
	//! author : Julio Napurí : https://github.com/julionc

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
	var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

	var es = moment.defineLocale('es', {
	    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShort[m.month()];
	        } else {
	            return monthsShortDot[m.month()];
	        }
	    },
	    monthsParseExact : true,
	    weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
	    weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
	    weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY H:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextDay : function () {
	            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastDay : function () {
	            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'en %s',
	        past : 'hace %s',
	        s : 'unos segundos',
	        m : 'un minuto',
	        mm : '%d minutos',
	        h : 'una hora',
	        hh : '%d horas',
	        d : 'un día',
	        dd : '%d días',
	        M : 'un mes',
	        MM : '%d meses',
	        y : 'un año',
	        yy : '%d años'
	    },
	    ordinalParse : /\d{1,2}º/,
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return es;

	})));


/***/ },
/* 422 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Spanish (Dominican Republic) [es-do]

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsShortDot = 'ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.'.split('_');
	var monthsShort = 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_');

	var esDo = moment.defineLocale('es-do', {
	    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShort[m.month()];
	        } else {
	            return monthsShortDot[m.month()];
	        }
	    },
	    monthsParseExact : true,
	    weekdays : 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
	    weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.'.split('_'),
	    weekdaysMin : 'do_lu_ma_mi_ju_vi_sá'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY h:mm A',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextDay : function () {
	            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastDay : function () {
	            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'en %s',
	        past : 'hace %s',
	        s : 'unos segundos',
	        m : 'un minuto',
	        mm : '%d minutos',
	        h : 'una hora',
	        hh : '%d horas',
	        d : 'un día',
	        dd : '%d días',
	        M : 'un mes',
	        MM : '%d meses',
	        y : 'un año',
	        yy : '%d años'
	    },
	    ordinalParse : /\d{1,2}º/,
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return esDo;

	})));


/***/ },
/* 423 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Estonian [et]
	//! author : Henry Kehlmann : https://github.com/madhenry
	//! improvements : Illimar Tambek : https://github.com/ragulka

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        's' : ['mõne sekundi', 'mõni sekund', 'paar sekundit'],
	        'm' : ['ühe minuti', 'üks minut'],
	        'mm': [number + ' minuti', number + ' minutit'],
	        'h' : ['ühe tunni', 'tund aega', 'üks tund'],
	        'hh': [number + ' tunni', number + ' tundi'],
	        'd' : ['ühe päeva', 'üks päev'],
	        'M' : ['kuu aja', 'kuu aega', 'üks kuu'],
	        'MM': [number + ' kuu', number + ' kuud'],
	        'y' : ['ühe aasta', 'aasta', 'üks aasta'],
	        'yy': [number + ' aasta', number + ' aastat']
	    };
	    if (withoutSuffix) {
	        return format[key][2] ? format[key][2] : format[key][1];
	    }
	    return isFuture ? format[key][0] : format[key][1];
	}

	var et = moment.defineLocale('et', {
	    months        : 'jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember'.split('_'),
	    monthsShort   : 'jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets'.split('_'),
	    weekdays      : 'pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev'.split('_'),
	    weekdaysShort : 'P_E_T_K_N_R_L'.split('_'),
	    weekdaysMin   : 'P_E_T_K_N_R_L'.split('_'),
	    longDateFormat : {
	        LT   : 'H:mm',
	        LTS : 'H:mm:ss',
	        L    : 'DD.MM.YYYY',
	        LL   : 'D. MMMM YYYY',
	        LLL  : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[Täna,] LT',
	        nextDay  : '[Homme,] LT',
	        nextWeek : '[Järgmine] dddd LT',
	        lastDay  : '[Eile,] LT',
	        lastWeek : '[Eelmine] dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s pärast',
	        past   : '%s tagasi',
	        s      : processRelativeTime,
	        m      : processRelativeTime,
	        mm     : processRelativeTime,
	        h      : processRelativeTime,
	        hh     : processRelativeTime,
	        d      : processRelativeTime,
	        dd     : '%d päeva',
	        M      : processRelativeTime,
	        MM     : processRelativeTime,
	        y      : processRelativeTime,
	        yy     : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return et;

	})));


/***/ },
/* 424 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Basque [eu]
	//! author : Eneko Illarramendi : https://github.com/eillarra

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var eu = moment.defineLocale('eu', {
	    months : 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_'),
	    monthsShort : 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'.split('_'),
	    weekdaysShort : 'ig._al._ar._az._og._ol._lr.'.split('_'),
	    weekdaysMin : 'ig_al_ar_az_og_ol_lr'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'YYYY[ko] MMMM[ren] D[a]',
	        LLL : 'YYYY[ko] MMMM[ren] D[a] HH:mm',
	        LLLL : 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
	        l : 'YYYY-M-D',
	        ll : 'YYYY[ko] MMM D[a]',
	        lll : 'YYYY[ko] MMM D[a] HH:mm',
	        llll : 'ddd, YYYY[ko] MMM D[a] HH:mm'
	    },
	    calendar : {
	        sameDay : '[gaur] LT[etan]',
	        nextDay : '[bihar] LT[etan]',
	        nextWeek : 'dddd LT[etan]',
	        lastDay : '[atzo] LT[etan]',
	        lastWeek : '[aurreko] dddd LT[etan]',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s barru',
	        past : 'duela %s',
	        s : 'segundo batzuk',
	        m : 'minutu bat',
	        mm : '%d minutu',
	        h : 'ordu bat',
	        hh : '%d ordu',
	        d : 'egun bat',
	        dd : '%d egun',
	        M : 'hilabete bat',
	        MM : '%d hilabete',
	        y : 'urte bat',
	        yy : '%d urte'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return eu;

	})));


/***/ },
/* 425 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Persian [fa]
	//! author : Ebrahim Byagowi : https://github.com/ebraminio

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '۱',
	    '2': '۲',
	    '3': '۳',
	    '4': '۴',
	    '5': '۵',
	    '6': '۶',
	    '7': '۷',
	    '8': '۸',
	    '9': '۹',
	    '0': '۰'
	};
	var numberMap = {
	    '۱': '1',
	    '۲': '2',
	    '۳': '3',
	    '۴': '4',
	    '۵': '5',
	    '۶': '6',
	    '۷': '7',
	    '۸': '8',
	    '۹': '9',
	    '۰': '0'
	};

	var fa = moment.defineLocale('fa', {
	    months : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
	    monthsShort : 'ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر'.split('_'),
	    weekdays : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
	    weekdaysShort : 'یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_جمعه_شنبه'.split('_'),
	    weekdaysMin : 'ی_د_س_چ_پ_ج_ش'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /قبل از ظهر|بعد از ظهر/,
	    isPM: function (input) {
	        return /بعد از ظهر/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'قبل از ظهر';
	        } else {
	            return 'بعد از ظهر';
	        }
	    },
	    calendar : {
	        sameDay : '[امروز ساعت] LT',
	        nextDay : '[فردا ساعت] LT',
	        nextWeek : 'dddd [ساعت] LT',
	        lastDay : '[دیروز ساعت] LT',
	        lastWeek : 'dddd [پیش] [ساعت] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'در %s',
	        past : '%s پیش',
	        s : 'چندین ثانیه',
	        m : 'یک دقیقه',
	        mm : '%d دقیقه',
	        h : 'یک ساعت',
	        hh : '%d ساعت',
	        d : 'یک روز',
	        dd : '%d روز',
	        M : 'یک ماه',
	        MM : '%d ماه',
	        y : 'یک سال',
	        yy : '%d سال'
	    },
	    preparse: function (string) {
	        return string.replace(/[۰-۹]/g, function (match) {
	            return numberMap[match];
	        }).replace(/،/g, ',');
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        }).replace(/,/g, '،');
	    },
	    ordinalParse: /\d{1,2}م/,
	    ordinal : '%dم',
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12 // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return fa;

	})));


/***/ },
/* 426 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Finnish [fi]
	//! author : Tarmo Aidantausta : https://github.com/bleadof

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var numbersPast = 'nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän'.split(' ');
	var numbersFuture = [
	        'nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden', 'kuuden',
	        numbersPast[7], numbersPast[8], numbersPast[9]
	    ];
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = '';
	    switch (key) {
	        case 's':
	            return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
	        case 'm':
	            return isFuture ? 'minuutin' : 'minuutti';
	        case 'mm':
	            result = isFuture ? 'minuutin' : 'minuuttia';
	            break;
	        case 'h':
	            return isFuture ? 'tunnin' : 'tunti';
	        case 'hh':
	            result = isFuture ? 'tunnin' : 'tuntia';
	            break;
	        case 'd':
	            return isFuture ? 'päivän' : 'päivä';
	        case 'dd':
	            result = isFuture ? 'päivän' : 'päivää';
	            break;
	        case 'M':
	            return isFuture ? 'kuukauden' : 'kuukausi';
	        case 'MM':
	            result = isFuture ? 'kuukauden' : 'kuukautta';
	            break;
	        case 'y':
	            return isFuture ? 'vuoden' : 'vuosi';
	        case 'yy':
	            result = isFuture ? 'vuoden' : 'vuotta';
	            break;
	    }
	    result = verbalNumber(number, isFuture) + ' ' + result;
	    return result;
	}
	function verbalNumber(number, isFuture) {
	    return number < 10 ? (isFuture ? numbersFuture[number] : numbersPast[number]) : number;
	}

	var fi = moment.defineLocale('fi', {
	    months : 'tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu'.split('_'),
	    monthsShort : 'tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu'.split('_'),
	    weekdays : 'sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai'.split('_'),
	    weekdaysShort : 'su_ma_ti_ke_to_pe_la'.split('_'),
	    weekdaysMin : 'su_ma_ti_ke_to_pe_la'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD.MM.YYYY',
	        LL : 'Do MMMM[ta] YYYY',
	        LLL : 'Do MMMM[ta] YYYY, [klo] HH.mm',
	        LLLL : 'dddd, Do MMMM[ta] YYYY, [klo] HH.mm',
	        l : 'D.M.YYYY',
	        ll : 'Do MMM YYYY',
	        lll : 'Do MMM YYYY, [klo] HH.mm',
	        llll : 'ddd, Do MMM YYYY, [klo] HH.mm'
	    },
	    calendar : {
	        sameDay : '[tänään] [klo] LT',
	        nextDay : '[huomenna] [klo] LT',
	        nextWeek : 'dddd [klo] LT',
	        lastDay : '[eilen] [klo] LT',
	        lastWeek : '[viime] dddd[na] [klo] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s päästä',
	        past : '%s sitten',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return fi;

	})));


/***/ },
/* 427 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Faroese [fo]
	//! author : Ragnar Johannesen : https://github.com/ragnar123

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var fo = moment.defineLocale('fo', {
	    months : 'januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
	    weekdays : 'sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur'.split('_'),
	    weekdaysShort : 'sun_mán_týs_mik_hós_frí_ley'.split('_'),
	    weekdaysMin : 'su_má_tý_mi_hó_fr_le'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D. MMMM, YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Í dag kl.] LT',
	        nextDay : '[Í morgin kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[Í gjár kl.] LT',
	        lastWeek : '[síðstu] dddd [kl] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'um %s',
	        past : '%s síðani',
	        s : 'fá sekund',
	        m : 'ein minutt',
	        mm : '%d minuttir',
	        h : 'ein tími',
	        hh : '%d tímar',
	        d : 'ein dagur',
	        dd : '%d dagar',
	        M : 'ein mánaði',
	        MM : '%d mánaðir',
	        y : 'eitt ár',
	        yy : '%d ár'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return fo;

	})));


/***/ },
/* 428 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : French [fr]
	//! author : John Fischer : https://github.com/jfroffice

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var fr = moment.defineLocale('fr', {
	    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
	    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
	    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Aujourd\'hui à] LT',
	        nextDay: '[Demain à] LT',
	        nextWeek: 'dddd [à] LT',
	        lastDay: '[Hier à] LT',
	        lastWeek: 'dddd [dernier à] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dans %s',
	        past : 'il y a %s',
	        s : 'quelques secondes',
	        m : 'une minute',
	        mm : '%d minutes',
	        h : 'une heure',
	        hh : '%d heures',
	        d : 'un jour',
	        dd : '%d jours',
	        M : 'un mois',
	        MM : '%d mois',
	        y : 'un an',
	        yy : '%d ans'
	    },
	    ordinalParse: /\d{1,2}(er|)/,
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : '');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return fr;

	})));


/***/ },
/* 429 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : French (Canada) [fr-ca]
	//! author : Jonathan Abourbih : https://github.com/jonbca

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var frCa = moment.defineLocale('fr-ca', {
	    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
	    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
	    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Aujourd\'hui à] LT',
	        nextDay: '[Demain à] LT',
	        nextWeek: 'dddd [à] LT',
	        lastDay: '[Hier à] LT',
	        lastWeek: 'dddd [dernier à] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dans %s',
	        past : 'il y a %s',
	        s : 'quelques secondes',
	        m : 'une minute',
	        mm : '%d minutes',
	        h : 'une heure',
	        hh : '%d heures',
	        d : 'un jour',
	        dd : '%d jours',
	        M : 'un mois',
	        MM : '%d mois',
	        y : 'un an',
	        yy : '%d ans'
	    },
	    ordinalParse: /\d{1,2}(er|e)/,
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : 'e');
	    }
	});

	return frCa;

	})));


/***/ },
/* 430 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : French (Switzerland) [fr-ch]
	//! author : Gaspard Bucher : https://github.com/gaspard

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var frCh = moment.defineLocale('fr-ch', {
	    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
	    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
	    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
	    weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Aujourd\'hui à] LT',
	        nextDay: '[Demain à] LT',
	        nextWeek: 'dddd [à] LT',
	        lastDay: '[Hier à] LT',
	        lastWeek: 'dddd [dernier à] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dans %s',
	        past : 'il y a %s',
	        s : 'quelques secondes',
	        m : 'une minute',
	        mm : '%d minutes',
	        h : 'une heure',
	        hh : '%d heures',
	        d : 'un jour',
	        dd : '%d jours',
	        M : 'un mois',
	        MM : '%d mois',
	        y : 'un an',
	        yy : '%d ans'
	    },
	    ordinalParse: /\d{1,2}(er|e)/,
	    ordinal : function (number) {
	        return number + (number === 1 ? 'er' : 'e');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return frCh;

	})));


/***/ },
/* 431 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Frisian [fy]
	//! author : Robin van der Vliet : https://github.com/robin0van0der0v

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsShortWithDots = 'jan._feb._mrt._apr._mai_jun._jul._aug._sep._okt._nov._des.'.split('_');
	var monthsShortWithoutDots = 'jan_feb_mrt_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_');

	var fy = moment.defineLocale('fy', {
	    months : 'jannewaris_febrewaris_maart_april_maaie_juny_july_augustus_septimber_oktober_novimber_desimber'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShortWithoutDots[m.month()];
	        } else {
	            return monthsShortWithDots[m.month()];
	        }
	    },
	    monthsParseExact : true,
	    weekdays : 'snein_moandei_tiisdei_woansdei_tongersdei_freed_sneon'.split('_'),
	    weekdaysShort : 'si._mo._ti._wo._to._fr._so.'.split('_'),
	    weekdaysMin : 'Si_Mo_Ti_Wo_To_Fr_So'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[hjoed om] LT',
	        nextDay: '[moarn om] LT',
	        nextWeek: 'dddd [om] LT',
	        lastDay: '[juster om] LT',
	        lastWeek: '[ôfrûne] dddd [om] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'oer %s',
	        past : '%s lyn',
	        s : 'in pear sekonden',
	        m : 'ien minút',
	        mm : '%d minuten',
	        h : 'ien oere',
	        hh : '%d oeren',
	        d : 'ien dei',
	        dd : '%d dagen',
	        M : 'ien moanne',
	        MM : '%d moannen',
	        y : 'ien jier',
	        yy : '%d jierren'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return fy;

	})));


/***/ },
/* 432 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Scottish Gaelic [gd]
	//! author : Jon Ashdown : https://github.com/jonashdown

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var months = [
	    'Am Faoilleach', 'An Gearran', 'Am Màrt', 'An Giblean', 'An Cèitean', 'An t-Ògmhios', 'An t-Iuchar', 'An Lùnastal', 'An t-Sultain', 'An Dàmhair', 'An t-Samhain', 'An Dùbhlachd'
	];

	var monthsShort = ['Faoi', 'Gear', 'Màrt', 'Gibl', 'Cèit', 'Ògmh', 'Iuch', 'Lùn', 'Sult', 'Dàmh', 'Samh', 'Dùbh'];

	var weekdays = ['Didòmhnaich', 'Diluain', 'Dimàirt', 'Diciadain', 'Diardaoin', 'Dihaoine', 'Disathairne'];

	var weekdaysShort = ['Did', 'Dil', 'Dim', 'Dic', 'Dia', 'Dih', 'Dis'];

	var weekdaysMin = ['Dò', 'Lu', 'Mà', 'Ci', 'Ar', 'Ha', 'Sa'];

	var gd = moment.defineLocale('gd', {
	    months : months,
	    monthsShort : monthsShort,
	    monthsParseExact : true,
	    weekdays : weekdays,
	    weekdaysShort : weekdaysShort,
	    weekdaysMin : weekdaysMin,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[An-diugh aig] LT',
	        nextDay : '[A-màireach aig] LT',
	        nextWeek : 'dddd [aig] LT',
	        lastDay : '[An-dè aig] LT',
	        lastWeek : 'dddd [seo chaidh] [aig] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'ann an %s',
	        past : 'bho chionn %s',
	        s : 'beagan diogan',
	        m : 'mionaid',
	        mm : '%d mionaidean',
	        h : 'uair',
	        hh : '%d uairean',
	        d : 'latha',
	        dd : '%d latha',
	        M : 'mìos',
	        MM : '%d mìosan',
	        y : 'bliadhna',
	        yy : '%d bliadhna'
	    },
	    ordinalParse : /\d{1,2}(d|na|mh)/,
	    ordinal : function (number) {
	        var output = number === 1 ? 'd' : number % 10 === 2 ? 'na' : 'mh';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return gd;

	})));


/***/ },
/* 433 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Galician [gl]
	//! author : Juan G. Hurtado : https://github.com/juanghurtado

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var gl = moment.defineLocale('gl', {
	    months : 'xaneiro_febreiro_marzo_abril_maio_xuño_xullo_agosto_setembro_outubro_novembro_decembro'.split('_'),
	    monthsShort : 'xan._feb._mar._abr._mai._xuñ._xul._ago._set._out._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'domingo_luns_martes_mércores_xoves_venres_sábado'.split('_'),
	    weekdaysShort : 'dom._lun._mar._mér._xov._ven._sáb.'.split('_'),
	    weekdaysMin : 'do_lu_ma_mé_xo_ve_sá'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY H:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY H:mm'
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
	        },
	        nextDay : function () {
	            return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'á') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
	        },
	        lastDay : function () {
	            return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
	        },
	        lastWeek : function () {
	            return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : function (str) {
	            if (str.indexOf('un') === 0) {
	                return 'n' + str;
	            }
	            return 'en ' + str;
	        },
	        past : 'hai %s',
	        s : 'uns segundos',
	        m : 'un minuto',
	        mm : '%d minutos',
	        h : 'unha hora',
	        hh : '%d horas',
	        d : 'un día',
	        dd : '%d días',
	        M : 'un mes',
	        MM : '%d meses',
	        y : 'un ano',
	        yy : '%d anos'
	    },
	    ordinalParse : /\d{1,2}º/,
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return gl;

	})));


/***/ },
/* 434 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Hebrew [he]
	//! author : Tomer Cohen : https://github.com/tomer
	//! author : Moshe Simantov : https://github.com/DevelopmentIL
	//! author : Tal Ater : https://github.com/TalAter

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var he = moment.defineLocale('he', {
	    months : 'ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר'.split('_'),
	    monthsShort : 'ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳'.split('_'),
	    weekdays : 'ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת'.split('_'),
	    weekdaysShort : 'א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳'.split('_'),
	    weekdaysMin : 'א_ב_ג_ד_ה_ו_ש'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [ב]MMMM YYYY',
	        LLL : 'D [ב]MMMM YYYY HH:mm',
	        LLLL : 'dddd, D [ב]MMMM YYYY HH:mm',
	        l : 'D/M/YYYY',
	        ll : 'D MMM YYYY',
	        lll : 'D MMM YYYY HH:mm',
	        llll : 'ddd, D MMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[היום ב־]LT',
	        nextDay : '[מחר ב־]LT',
	        nextWeek : 'dddd [בשעה] LT',
	        lastDay : '[אתמול ב־]LT',
	        lastWeek : '[ביום] dddd [האחרון בשעה] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'בעוד %s',
	        past : 'לפני %s',
	        s : 'מספר שניות',
	        m : 'דקה',
	        mm : '%d דקות',
	        h : 'שעה',
	        hh : function (number) {
	            if (number === 2) {
	                return 'שעתיים';
	            }
	            return number + ' שעות';
	        },
	        d : 'יום',
	        dd : function (number) {
	            if (number === 2) {
	                return 'יומיים';
	            }
	            return number + ' ימים';
	        },
	        M : 'חודש',
	        MM : function (number) {
	            if (number === 2) {
	                return 'חודשיים';
	            }
	            return number + ' חודשים';
	        },
	        y : 'שנה',
	        yy : function (number) {
	            if (number === 2) {
	                return 'שנתיים';
	            } else if (number % 10 === 0 && number !== 10) {
	                return number + ' שנה';
	            }
	            return number + ' שנים';
	        }
	    },
	    meridiemParse: /אחה"צ|לפנה"צ|אחרי הצהריים|לפני הצהריים|לפנות בוקר|בבוקר|בערב/i,
	    isPM : function (input) {
	        return /^(אחה"צ|אחרי הצהריים|בערב)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 5) {
	            return 'לפנות בוקר';
	        } else if (hour < 10) {
	            return 'בבוקר';
	        } else if (hour < 12) {
	            return isLower ? 'לפנה"צ' : 'לפני הצהריים';
	        } else if (hour < 18) {
	            return isLower ? 'אחה"צ' : 'אחרי הצהריים';
	        } else {
	            return 'בערב';
	        }
	    }
	});

	return he;

	})));


/***/ },
/* 435 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Hindi [hi]
	//! author : Mayank Singhal : https://github.com/mayanksinghal

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '१',
	    '2': '२',
	    '3': '३',
	    '4': '४',
	    '5': '५',
	    '6': '६',
	    '7': '७',
	    '8': '८',
	    '9': '९',
	    '0': '०'
	};
	var numberMap = {
	    '१': '1',
	    '२': '2',
	    '३': '3',
	    '४': '4',
	    '५': '5',
	    '६': '6',
	    '७': '7',
	    '८': '8',
	    '९': '9',
	    '०': '0'
	};

	var hi = moment.defineLocale('hi', {
	    months : 'जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर'.split('_'),
	    monthsShort : 'जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
	    weekdaysShort : 'रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि'.split('_'),
	    weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm बजे',
	        LTS : 'A h:mm:ss बजे',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm बजे',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm बजे'
	    },
	    calendar : {
	        sameDay : '[आज] LT',
	        nextDay : '[कल] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[कल] LT',
	        lastWeek : '[पिछले] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s में',
	        past : '%s पहले',
	        s : 'कुछ ही क्षण',
	        m : 'एक मिनट',
	        mm : '%d मिनट',
	        h : 'एक घंटा',
	        hh : '%d घंटे',
	        d : 'एक दिन',
	        dd : '%d दिन',
	        M : 'एक महीने',
	        MM : '%d महीने',
	        y : 'एक वर्ष',
	        yy : '%d वर्ष'
	    },
	    preparse: function (string) {
	        return string.replace(/[१२३४५६७८९०]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    // Hindi notation for meridiems are quite fuzzy in practice. While there exists
	    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Hindi.
	    meridiemParse: /रात|सुबह|दोपहर|शाम/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'रात') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === 'सुबह') {
	            return hour;
	        } else if (meridiem === 'दोपहर') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === 'शाम') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'रात';
	        } else if (hour < 10) {
	            return 'सुबह';
	        } else if (hour < 17) {
	            return 'दोपहर';
	        } else if (hour < 20) {
	            return 'शाम';
	        } else {
	            return 'रात';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return hi;

	})));


/***/ },
/* 436 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Croatian [hr]
	//! author : Bojan Marković : https://github.com/bmarkovic

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function translate(number, withoutSuffix, key) {
	    var result = number + ' ';
	    switch (key) {
	        case 'm':
	            return withoutSuffix ? 'jedna minuta' : 'jedne minute';
	        case 'mm':
	            if (number === 1) {
	                result += 'minuta';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'minute';
	            } else {
	                result += 'minuta';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'jedan sat' : 'jednog sata';
	        case 'hh':
	            if (number === 1) {
	                result += 'sat';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'sata';
	            } else {
	                result += 'sati';
	            }
	            return result;
	        case 'dd':
	            if (number === 1) {
	                result += 'dan';
	            } else {
	                result += 'dana';
	            }
	            return result;
	        case 'MM':
	            if (number === 1) {
	                result += 'mjesec';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'mjeseca';
	            } else {
	                result += 'mjeseci';
	            }
	            return result;
	        case 'yy':
	            if (number === 1) {
	                result += 'godina';
	            } else if (number === 2 || number === 3 || number === 4) {
	                result += 'godine';
	            } else {
	                result += 'godina';
	            }
	            return result;
	    }
	}

	var hr = moment.defineLocale('hr', {
	    months : {
	        format: 'siječnja_veljače_ožujka_travnja_svibnja_lipnja_srpnja_kolovoza_rujna_listopada_studenoga_prosinca'.split('_'),
	        standalone: 'siječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac'.split('_')
	    },
	    monthsShort : 'sij._velj._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
	    weekdaysShort : 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
	    weekdaysMin : 'ne_po_ut_sr_če_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[danas u] LT',
	        nextDay  : '[sutra u] LT',
	        nextWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[jučer u] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                    return '[prošlu] dddd [u] LT';
	                case 6:
	                    return '[prošle] [subote] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[prošli] dddd [u] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'prije %s',
	        s      : 'par sekundi',
	        m      : translate,
	        mm     : translate,
	        h      : translate,
	        hh     : translate,
	        d      : 'dan',
	        dd     : translate,
	        M      : 'mjesec',
	        MM     : translate,
	        y      : 'godinu',
	        yy     : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return hr;

	})));


/***/ },
/* 437 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Hungarian [hu]
	//! author : Adam Brunner : https://github.com/adambrunner

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var weekEndings = 'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');
	function translate(number, withoutSuffix, key, isFuture) {
	    var num = number,
	        suffix;
	    switch (key) {
	        case 's':
	            return (isFuture || withoutSuffix) ? 'néhány másodperc' : 'néhány másodperce';
	        case 'm':
	            return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
	        case 'mm':
	            return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
	        case 'h':
	            return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
	        case 'hh':
	            return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
	        case 'd':
	            return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
	        case 'dd':
	            return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
	        case 'M':
	            return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
	        case 'MM':
	            return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
	        case 'y':
	            return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
	        case 'yy':
	            return num + (isFuture || withoutSuffix ? ' év' : ' éve');
	    }
	    return '';
	}
	function week(isFuture) {
	    return (isFuture ? '' : '[múlt] ') + '[' + weekEndings[this.day()] + '] LT[-kor]';
	}

	var hu = moment.defineLocale('hu', {
	    months : 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split('_'),
	    monthsShort : 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'.split('_'),
	    weekdays : 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
	    weekdaysShort : 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
	    weekdaysMin : 'v_h_k_sze_cs_p_szo'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'YYYY.MM.DD.',
	        LL : 'YYYY. MMMM D.',
	        LLL : 'YYYY. MMMM D. H:mm',
	        LLLL : 'YYYY. MMMM D., dddd H:mm'
	    },
	    meridiemParse: /de|du/i,
	    isPM: function (input) {
	        return input.charAt(1).toLowerCase() === 'u';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 12) {
	            return isLower === true ? 'de' : 'DE';
	        } else {
	            return isLower === true ? 'du' : 'DU';
	        }
	    },
	    calendar : {
	        sameDay : '[ma] LT[-kor]',
	        nextDay : '[holnap] LT[-kor]',
	        nextWeek : function () {
	            return week.call(this, true);
	        },
	        lastDay : '[tegnap] LT[-kor]',
	        lastWeek : function () {
	            return week.call(this, false);
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s múlva',
	        past : '%s',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return hu;

	})));


/***/ },
/* 438 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Armenian [hy-am]
	//! author : Armendarabyan : https://github.com/armendarabyan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var hyAm = moment.defineLocale('hy-am', {
	    months : {
	        format: 'հունվարի_փետրվարի_մարտի_ապրիլի_մայիսի_հունիսի_հուլիսի_օգոստոսի_սեպտեմբերի_հոկտեմբերի_նոյեմբերի_դեկտեմբերի'.split('_'),
	        standalone: 'հունվար_փետրվար_մարտ_ապրիլ_մայիս_հունիս_հուլիս_օգոստոս_սեպտեմբեր_հոկտեմբեր_նոյեմբեր_դեկտեմբեր'.split('_')
	    },
	    monthsShort : 'հնվ_փտր_մրտ_ապր_մյս_հնս_հլս_օգս_սպտ_հկտ_նմբ_դկտ'.split('_'),
	    weekdays : 'կիրակի_երկուշաբթի_երեքշաբթի_չորեքշաբթի_հինգշաբթի_ուրբաթ_շաբաթ'.split('_'),
	    weekdaysShort : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
	    weekdaysMin : 'կրկ_երկ_երք_չրք_հնգ_ուրբ_շբթ'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY թ.',
	        LLL : 'D MMMM YYYY թ., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY թ., HH:mm'
	    },
	    calendar : {
	        sameDay: '[այսօր] LT',
	        nextDay: '[վաղը] LT',
	        lastDay: '[երեկ] LT',
	        nextWeek: function () {
	            return 'dddd [օրը ժամը] LT';
	        },
	        lastWeek: function () {
	            return '[անցած] dddd [օրը ժամը] LT';
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '%s հետո',
	        past : '%s առաջ',
	        s : 'մի քանի վայրկյան',
	        m : 'րոպե',
	        mm : '%d րոպե',
	        h : 'ժամ',
	        hh : '%d ժամ',
	        d : 'օր',
	        dd : '%d օր',
	        M : 'ամիս',
	        MM : '%d ամիս',
	        y : 'տարի',
	        yy : '%d տարի'
	    },
	    meridiemParse: /գիշերվա|առավոտվա|ցերեկվա|երեկոյան/,
	    isPM: function (input) {
	        return /^(ցերեկվա|երեկոյան)$/.test(input);
	    },
	    meridiem : function (hour) {
	        if (hour < 4) {
	            return 'գիշերվա';
	        } else if (hour < 12) {
	            return 'առավոտվա';
	        } else if (hour < 17) {
	            return 'ցերեկվա';
	        } else {
	            return 'երեկոյան';
	        }
	    },
	    ordinalParse: /\d{1,2}|\d{1,2}-(ին|րդ)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'DDD':
	            case 'w':
	            case 'W':
	            case 'DDDo':
	                if (number === 1) {
	                    return number + '-ին';
	                }
	                return number + '-րդ';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return hyAm;

	})));


/***/ },
/* 439 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Indonesian [id]
	//! author : Mohammad Satrio Utomo : https://github.com/tyok
	//! reference: http://id.wikisource.org/wiki/Pedoman_Umum_Ejaan_Bahasa_Indonesia_yang_Disempurnakan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var id = moment.defineLocale('id', {
	    months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des'.split('_'),
	    weekdays : 'Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu'.split('_'),
	    weekdaysShort : 'Min_Sen_Sel_Rab_Kam_Jum_Sab'.split('_'),
	    weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sb'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /pagi|siang|sore|malam/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'pagi') {
	            return hour;
	        } else if (meridiem === 'siang') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'sore' || meridiem === 'malam') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'pagi';
	        } else if (hours < 15) {
	            return 'siang';
	        } else if (hours < 19) {
	            return 'sore';
	        } else {
	            return 'malam';
	        }
	    },
	    calendar : {
	        sameDay : '[Hari ini pukul] LT',
	        nextDay : '[Besok pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kemarin pukul] LT',
	        lastWeek : 'dddd [lalu pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'dalam %s',
	        past : '%s yang lalu',
	        s : 'beberapa detik',
	        m : 'semenit',
	        mm : '%d menit',
	        h : 'sejam',
	        hh : '%d jam',
	        d : 'sehari',
	        dd : '%d hari',
	        M : 'sebulan',
	        MM : '%d bulan',
	        y : 'setahun',
	        yy : '%d tahun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return id;

	})));


/***/ },
/* 440 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Icelandic [is]
	//! author : Hinrik Örn Sigurðsson : https://github.com/hinrik

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function plural(n) {
	    if (n % 100 === 11) {
	        return true;
	    } else if (n % 10 === 1) {
	        return false;
	    }
	    return true;
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':
	            return withoutSuffix || isFuture ? 'nokkrar sekúndur' : 'nokkrum sekúndum';
	        case 'm':
	            return withoutSuffix ? 'mínúta' : 'mínútu';
	        case 'mm':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'mínútur' : 'mínútum');
	            } else if (withoutSuffix) {
	                return result + 'mínúta';
	            }
	            return result + 'mínútu';
	        case 'hh':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'klukkustundir' : 'klukkustundum');
	            }
	            return result + 'klukkustund';
	        case 'd':
	            if (withoutSuffix) {
	                return 'dagur';
	            }
	            return isFuture ? 'dag' : 'degi';
	        case 'dd':
	            if (plural(number)) {
	                if (withoutSuffix) {
	                    return result + 'dagar';
	                }
	                return result + (isFuture ? 'daga' : 'dögum');
	            } else if (withoutSuffix) {
	                return result + 'dagur';
	            }
	            return result + (isFuture ? 'dag' : 'degi');
	        case 'M':
	            if (withoutSuffix) {
	                return 'mánuður';
	            }
	            return isFuture ? 'mánuð' : 'mánuði';
	        case 'MM':
	            if (plural(number)) {
	                if (withoutSuffix) {
	                    return result + 'mánuðir';
	                }
	                return result + (isFuture ? 'mánuði' : 'mánuðum');
	            } else if (withoutSuffix) {
	                return result + 'mánuður';
	            }
	            return result + (isFuture ? 'mánuð' : 'mánuði');
	        case 'y':
	            return withoutSuffix || isFuture ? 'ár' : 'ári';
	        case 'yy':
	            if (plural(number)) {
	                return result + (withoutSuffix || isFuture ? 'ár' : 'árum');
	            }
	            return result + (withoutSuffix || isFuture ? 'ár' : 'ári');
	    }
	}

	var is = moment.defineLocale('is', {
	    months : 'janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des'.split('_'),
	    weekdays : 'sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur'.split('_'),
	    weekdaysShort : 'sun_mán_þri_mið_fim_fös_lau'.split('_'),
	    weekdaysMin : 'Su_Má_Þr_Mi_Fi_Fö_La'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY [kl.] H:mm',
	        LLLL : 'dddd, D. MMMM YYYY [kl.] H:mm'
	    },
	    calendar : {
	        sameDay : '[í dag kl.] LT',
	        nextDay : '[á morgun kl.] LT',
	        nextWeek : 'dddd [kl.] LT',
	        lastDay : '[í gær kl.] LT',
	        lastWeek : '[síðasta] dddd [kl.] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'eftir %s',
	        past : 'fyrir %s síðan',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : 'klukkustund',
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return is;

	})));


/***/ },
/* 441 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Italian [it]
	//! author : Lorenzo : https://github.com/aliem
	//! author: Mattia Larentis: https://github.com/nostalgiaz

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var it = moment.defineLocale('it', {
	    months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
	    monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
	    weekdays : 'Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato'.split('_'),
	    weekdaysShort : 'Dom_Lun_Mar_Mer_Gio_Ven_Sab'.split('_'),
	    weekdaysMin : 'Do_Lu_Ma_Me_Gi_Ve_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Oggi alle] LT',
	        nextDay: '[Domani alle] LT',
	        nextWeek: 'dddd [alle] LT',
	        lastDay: '[Ieri alle] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[la scorsa] dddd [alle] LT';
	                default:
	                    return '[lo scorso] dddd [alle] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : function (s) {
	            return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
	        },
	        past : '%s fa',
	        s : 'alcuni secondi',
	        m : 'un minuto',
	        mm : '%d minuti',
	        h : 'un\'ora',
	        hh : '%d ore',
	        d : 'un giorno',
	        dd : '%d giorni',
	        M : 'un mese',
	        MM : '%d mesi',
	        y : 'un anno',
	        yy : '%d anni'
	    },
	    ordinalParse : /\d{1,2}º/,
	    ordinal: '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return it;

	})));


/***/ },
/* 442 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Japanese [ja]
	//! author : LI Long : https://github.com/baryon

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ja = moment.defineLocale('ja', {
	    months : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	    weekdays : '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
	    weekdaysShort : '日_月_火_水_木_金_土'.split('_'),
	    weekdaysMin : '日_月_火_水_木_金_土'.split('_'),
	    longDateFormat : {
	        LT : 'Ah時m分',
	        LTS : 'Ah時m分s秒',
	        L : 'YYYY/MM/DD',
	        LL : 'YYYY年M月D日',
	        LLL : 'YYYY年M月D日Ah時m分',
	        LLLL : 'YYYY年M月D日Ah時m分 dddd'
	    },
	    meridiemParse: /午前|午後/i,
	    isPM : function (input) {
	        return input === '午後';
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return '午前';
	        } else {
	            return '午後';
	        }
	    },
	    calendar : {
	        sameDay : '[今日] LT',
	        nextDay : '[明日] LT',
	        nextWeek : '[来週]dddd LT',
	        lastDay : '[昨日] LT',
	        lastWeek : '[前週]dddd LT',
	        sameElse : 'L'
	    },
	    ordinalParse : /\d{1,2}日/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd':
	            case 'D':
	            case 'DDD':
	                return number + '日';
	            default:
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s後',
	        past : '%s前',
	        s : '数秒',
	        m : '1分',
	        mm : '%d分',
	        h : '1時間',
	        hh : '%d時間',
	        d : '1日',
	        dd : '%d日',
	        M : '1ヶ月',
	        MM : '%dヶ月',
	        y : '1年',
	        yy : '%d年'
	    }
	});

	return ja;

	})));


/***/ },
/* 443 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Javanese [jv]
	//! author : Rony Lantip : https://github.com/lantip
	//! reference: http://jv.wikipedia.org/wiki/Basa_Jawa

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var jv = moment.defineLocale('jv', {
	    months : 'Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_Nopember_Desember'.split('_'),
	    monthsShort : 'Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nop_Des'.split('_'),
	    weekdays : 'Minggu_Senen_Seloso_Rebu_Kemis_Jemuwah_Septu'.split('_'),
	    weekdaysShort : 'Min_Sen_Sel_Reb_Kem_Jem_Sep'.split('_'),
	    weekdaysMin : 'Mg_Sn_Sl_Rb_Km_Jm_Sp'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /enjing|siyang|sonten|ndalu/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'enjing') {
	            return hour;
	        } else if (meridiem === 'siyang') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'sonten' || meridiem === 'ndalu') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'enjing';
	        } else if (hours < 15) {
	            return 'siyang';
	        } else if (hours < 19) {
	            return 'sonten';
	        } else {
	            return 'ndalu';
	        }
	    },
	    calendar : {
	        sameDay : '[Dinten puniko pukul] LT',
	        nextDay : '[Mbenjang pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kala wingi pukul] LT',
	        lastWeek : 'dddd [kepengker pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'wonten ing %s',
	        past : '%s ingkang kepengker',
	        s : 'sawetawis detik',
	        m : 'setunggal menit',
	        mm : '%d menit',
	        h : 'setunggal jam',
	        hh : '%d jam',
	        d : 'sedinten',
	        dd : '%d dinten',
	        M : 'sewulan',
	        MM : '%d wulan',
	        y : 'setaun',
	        yy : '%d taun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return jv;

	})));


/***/ },
/* 444 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Georgian [ka]
	//! author : Irakli Janiashvili : https://github.com/irakli-janiashvili

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ka = moment.defineLocale('ka', {
	    months : {
	        standalone: 'იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი'.split('_'),
	        format: 'იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს'.split('_')
	    },
	    monthsShort : 'იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ'.split('_'),
	    weekdays : {
	        standalone: 'კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი'.split('_'),
	        format: 'კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს'.split('_'),
	        isFormat: /(წინა|შემდეგ)/
	    },
	    weekdaysShort : 'კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ'.split('_'),
	    weekdaysMin : 'კვ_ორ_სა_ოთ_ხუ_პა_შა'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[დღეს] LT[-ზე]',
	        nextDay : '[ხვალ] LT[-ზე]',
	        lastDay : '[გუშინ] LT[-ზე]',
	        nextWeek : '[შემდეგ] dddd LT[-ზე]',
	        lastWeek : '[წინა] dddd LT-ზე',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : function (s) {
	            return (/(წამი|წუთი|საათი|წელი)/).test(s) ?
	                s.replace(/ი$/, 'ში') :
	                s + 'ში';
	        },
	        past : function (s) {
	            if ((/(წამი|წუთი|საათი|დღე|თვე)/).test(s)) {
	                return s.replace(/(ი|ე)$/, 'ის წინ');
	            }
	            if ((/წელი/).test(s)) {
	                return s.replace(/წელი$/, 'წლის წინ');
	            }
	        },
	        s : 'რამდენიმე წამი',
	        m : 'წუთი',
	        mm : '%d წუთი',
	        h : 'საათი',
	        hh : '%d საათი',
	        d : 'დღე',
	        dd : '%d დღე',
	        M : 'თვე',
	        MM : '%d თვე',
	        y : 'წელი',
	        yy : '%d წელი'
	    },
	    ordinalParse: /0|1-ლი|მე-\d{1,2}|\d{1,2}-ე/,
	    ordinal : function (number) {
	        if (number === 0) {
	            return number;
	        }
	        if (number === 1) {
	            return number + '-ლი';
	        }
	        if ((number < 20) || (number <= 100 && (number % 20 === 0)) || (number % 100 === 0)) {
	            return 'მე-' + number;
	        }
	        return number + '-ე';
	    },
	    week : {
	        dow : 1,
	        doy : 7
	    }
	});

	return ka;

	})));


/***/ },
/* 445 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Kazakh [kk]
	//! authors : Nurlan Rakhimzhanov : https://github.com/nurlan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var suffixes = {
	    0: '-ші',
	    1: '-ші',
	    2: '-ші',
	    3: '-ші',
	    4: '-ші',
	    5: '-ші',
	    6: '-шы',
	    7: '-ші',
	    8: '-ші',
	    9: '-шы',
	    10: '-шы',
	    20: '-шы',
	    30: '-шы',
	    40: '-шы',
	    50: '-ші',
	    60: '-шы',
	    70: '-ші',
	    80: '-ші',
	    90: '-шы',
	    100: '-ші'
	};

	var kk = moment.defineLocale('kk', {
	    months : 'қаңтар_ақпан_наурыз_сәуір_мамыр_маусым_шілде_тамыз_қыркүйек_қазан_қараша_желтоқсан'.split('_'),
	    monthsShort : 'қаң_ақп_нау_сәу_мам_мау_шіл_там_қыр_қаз_қар_жел'.split('_'),
	    weekdays : 'жексенбі_дүйсенбі_сейсенбі_сәрсенбі_бейсенбі_жұма_сенбі'.split('_'),
	    weekdaysShort : 'жек_дүй_сей_сәр_бей_жұм_сен'.split('_'),
	    weekdaysMin : 'жк_дй_сй_ср_бй_жм_сн'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Бүгін сағат] LT',
	        nextDay : '[Ертең сағат] LT',
	        nextWeek : 'dddd [сағат] LT',
	        lastDay : '[Кеше сағат] LT',
	        lastWeek : '[Өткен аптаның] dddd [сағат] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ішінде',
	        past : '%s бұрын',
	        s : 'бірнеше секунд',
	        m : 'бір минут',
	        mm : '%d минут',
	        h : 'бір сағат',
	        hh : '%d сағат',
	        d : 'бір күн',
	        dd : '%d күн',
	        M : 'бір ай',
	        MM : '%d ай',
	        y : 'бір жыл',
	        yy : '%d жыл'
	    },
	    ordinalParse: /\d{1,2}-(ші|шы)/,
	    ordinal : function (number) {
	        var a = number % 10,
	            b = number >= 100 ? 100 : null;
	        return number + (suffixes[number] || suffixes[a] || suffixes[b]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return kk;

	})));


/***/ },
/* 446 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Cambodian [km]
	//! author : Kruy Vanna : https://github.com/kruyvanna

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var km = moment.defineLocale('km', {
	    months: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
	    monthsShort: 'មករា_កុម្ភៈ_មីនា_មេសា_ឧសភា_មិថុនា_កក្កដា_សីហា_កញ្ញា_តុលា_វិច្ឆិកា_ធ្នូ'.split('_'),
	    weekdays: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
	    weekdaysShort: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
	    weekdaysMin: 'អាទិត្យ_ច័ន្ទ_អង្គារ_ពុធ_ព្រហស្បតិ៍_សុក្រ_សៅរ៍'.split('_'),
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[ថ្ងៃនេះ ម៉ោង] LT',
	        nextDay: '[ស្អែក ម៉ោង] LT',
	        nextWeek: 'dddd [ម៉ោង] LT',
	        lastDay: '[ម្សិលមិញ ម៉ោង] LT',
	        lastWeek: 'dddd [សប្តាហ៍មុន] [ម៉ោង] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: '%sទៀត',
	        past: '%sមុន',
	        s: 'ប៉ុន្មានវិនាទី',
	        m: 'មួយនាទី',
	        mm: '%d នាទី',
	        h: 'មួយម៉ោង',
	        hh: '%d ម៉ោង',
	        d: 'មួយថ្ងៃ',
	        dd: '%d ថ្ងៃ',
	        M: 'មួយខែ',
	        MM: '%d ខែ',
	        y: 'មួយឆ្នាំ',
	        yy: '%d ឆ្នាំ'
	    },
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4 // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return km;

	})));


/***/ },
/* 447 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Korean [ko]
	//! author : Kyungwook, Park : https://github.com/kyungw00k
	//! author : Jeeeyul Lee <jeeeyul@gmail.com>

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ko = moment.defineLocale('ko', {
	    months : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
	    monthsShort : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'.split('_'),
	    weekdays : '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
	    weekdaysShort : '일_월_화_수_목_금_토'.split('_'),
	    weekdaysMin : '일_월_화_수_목_금_토'.split('_'),
	    longDateFormat : {
	        LT : 'A h시 m분',
	        LTS : 'A h시 m분 s초',
	        L : 'YYYY.MM.DD',
	        LL : 'YYYY년 MMMM D일',
	        LLL : 'YYYY년 MMMM D일 A h시 m분',
	        LLLL : 'YYYY년 MMMM D일 dddd A h시 m분'
	    },
	    calendar : {
	        sameDay : '오늘 LT',
	        nextDay : '내일 LT',
	        nextWeek : 'dddd LT',
	        lastDay : '어제 LT',
	        lastWeek : '지난주 dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s 후',
	        past : '%s 전',
	        s : '몇 초',
	        ss : '%d초',
	        m : '일분',
	        mm : '%d분',
	        h : '한 시간',
	        hh : '%d시간',
	        d : '하루',
	        dd : '%d일',
	        M : '한 달',
	        MM : '%d달',
	        y : '일 년',
	        yy : '%d년'
	    },
	    ordinalParse : /\d{1,2}일/,
	    ordinal : '%d일',
	    meridiemParse : /오전|오후/,
	    isPM : function (token) {
	        return token === '오후';
	    },
	    meridiem : function (hour, minute, isUpper) {
	        return hour < 12 ? '오전' : '오후';
	    }
	});

	return ko;

	})));


/***/ },
/* 448 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Kyrgyz [ky]
	//! author : Chyngyz Arystan uulu : https://github.com/chyngyz

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';



	var suffixes = {
	    0: '-чү',
	    1: '-чи',
	    2: '-чи',
	    3: '-чү',
	    4: '-чү',
	    5: '-чи',
	    6: '-чы',
	    7: '-чи',
	    8: '-чи',
	    9: '-чу',
	    10: '-чу',
	    20: '-чы',
	    30: '-чу',
	    40: '-чы',
	    50: '-чү',
	    60: '-чы',
	    70: '-чи',
	    80: '-чи',
	    90: '-чу',
	    100: '-чү'
	};

	var ky = moment.defineLocale('ky', {
	    months : 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_'),
	    monthsShort : 'янв_фев_март_апр_май_июнь_июль_авг_сен_окт_ноя_дек'.split('_'),
	    weekdays : 'Жекшемби_Дүйшөмбү_Шейшемби_Шаршемби_Бейшемби_Жума_Ишемби'.split('_'),
	    weekdaysShort : 'Жек_Дүй_Шей_Шар_Бей_Жум_Ише'.split('_'),
	    weekdaysMin : 'Жк_Дй_Шй_Шр_Бй_Жм_Иш'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Бүгүн саат] LT',
	        nextDay : '[Эртең саат] LT',
	        nextWeek : 'dddd [саат] LT',
	        lastDay : '[Кече саат] LT',
	        lastWeek : '[Өткен аптанын] dddd [күнү] [саат] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ичинде',
	        past : '%s мурун',
	        s : 'бирнече секунд',
	        m : 'бир мүнөт',
	        mm : '%d мүнөт',
	        h : 'бир саат',
	        hh : '%d саат',
	        d : 'бир күн',
	        dd : '%d күн',
	        M : 'бир ай',
	        MM : '%d ай',
	        y : 'бир жыл',
	        yy : '%d жыл'
	    },
	    ordinalParse: /\d{1,2}-(чи|чы|чү|чу)/,
	    ordinal : function (number) {
	        var a = number % 10,
	            b = number >= 100 ? 100 : null;
	        return number + (suffixes[number] || suffixes[a] || suffixes[b]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ky;

	})));


/***/ },
/* 449 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Luxembourgish [lb]
	//! author : mweimerskirch : https://github.com/mweimerskirch
	//! author : David Raison : https://github.com/kwisatz

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        'm': ['eng Minutt', 'enger Minutt'],
	        'h': ['eng Stonn', 'enger Stonn'],
	        'd': ['een Dag', 'engem Dag'],
	        'M': ['ee Mount', 'engem Mount'],
	        'y': ['ee Joer', 'engem Joer']
	    };
	    return withoutSuffix ? format[key][0] : format[key][1];
	}
	function processFutureTime(string) {
	    var number = string.substr(0, string.indexOf(' '));
	    if (eifelerRegelAppliesToNumber(number)) {
	        return 'a ' + string;
	    }
	    return 'an ' + string;
	}
	function processPastTime(string) {
	    var number = string.substr(0, string.indexOf(' '));
	    if (eifelerRegelAppliesToNumber(number)) {
	        return 'viru ' + string;
	    }
	    return 'virun ' + string;
	}
	/**
	 * Returns true if the word before the given number loses the '-n' ending.
	 * e.g. 'an 10 Deeg' but 'a 5 Deeg'
	 *
	 * @param number {integer}
	 * @returns {boolean}
	 */
	function eifelerRegelAppliesToNumber(number) {
	    number = parseInt(number, 10);
	    if (isNaN(number)) {
	        return false;
	    }
	    if (number < 0) {
	        // Negative Number --> always true
	        return true;
	    } else if (number < 10) {
	        // Only 1 digit
	        if (4 <= number && number <= 7) {
	            return true;
	        }
	        return false;
	    } else if (number < 100) {
	        // 2 digits
	        var lastDigit = number % 10, firstDigit = number / 10;
	        if (lastDigit === 0) {
	            return eifelerRegelAppliesToNumber(firstDigit);
	        }
	        return eifelerRegelAppliesToNumber(lastDigit);
	    } else if (number < 10000) {
	        // 3 or 4 digits --> recursively check first digit
	        while (number >= 10) {
	            number = number / 10;
	        }
	        return eifelerRegelAppliesToNumber(number);
	    } else {
	        // Anything larger than 4 digits: recursively check first n-3 digits
	        number = number / 1000;
	        return eifelerRegelAppliesToNumber(number);
	    }
	}

	var lb = moment.defineLocale('lb', {
	    months: 'Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
	    monthsShort: 'Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.'.split('_'),
	    monthsParseExact : true,
	    weekdays: 'Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg'.split('_'),
	    weekdaysShort: 'So._Mé._Dë._Më._Do._Fr._Sa.'.split('_'),
	    weekdaysMin: 'So_Mé_Dë_Më_Do_Fr_Sa'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm [Auer]',
	        LTS: 'H:mm:ss [Auer]',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm [Auer]',
	        LLLL: 'dddd, D. MMMM YYYY H:mm [Auer]'
	    },
	    calendar: {
	        sameDay: '[Haut um] LT',
	        sameElse: 'L',
	        nextDay: '[Muer um] LT',
	        nextWeek: 'dddd [um] LT',
	        lastDay: '[Gëschter um] LT',
	        lastWeek: function () {
	            // Different date string for 'Dënschdeg' (Tuesday) and 'Donneschdeg' (Thursday) due to phonological rule
	            switch (this.day()) {
	                case 2:
	                case 4:
	                    return '[Leschten] dddd [um] LT';
	                default:
	                    return '[Leschte] dddd [um] LT';
	            }
	        }
	    },
	    relativeTime : {
	        future : processFutureTime,
	        past : processPastTime,
	        s : 'e puer Sekonnen',
	        m : processRelativeTime,
	        mm : '%d Minutten',
	        h : processRelativeTime,
	        hh : '%d Stonnen',
	        d : processRelativeTime,
	        dd : '%d Deeg',
	        M : processRelativeTime,
	        MM : '%d Méint',
	        y : processRelativeTime,
	        yy : '%d Joer'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal: '%d.',
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return lb;

	})));


/***/ },
/* 450 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Lao [lo]
	//! author : Ryan Hart : https://github.com/ryanhart2

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var lo = moment.defineLocale('lo', {
	    months : 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
	    monthsShort : 'ມັງກອນ_ກຸມພາ_ມີນາ_ເມສາ_ພຶດສະພາ_ມິຖຸນາ_ກໍລະກົດ_ສິງຫາ_ກັນຍາ_ຕຸລາ_ພະຈິກ_ທັນວາ'.split('_'),
	    weekdays : 'ອາທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
	    weekdaysShort : 'ທິດ_ຈັນ_ອັງຄານ_ພຸດ_ພະຫັດ_ສຸກ_ເສົາ'.split('_'),
	    weekdaysMin : 'ທ_ຈ_ອຄ_ພ_ພຫ_ສກ_ສ'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'ວັນdddd D MMMM YYYY HH:mm'
	    },
	    meridiemParse: /ຕອນເຊົ້າ|ຕອນແລງ/,
	    isPM: function (input) {
	        return input === 'ຕອນແລງ';
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'ຕອນເຊົ້າ';
	        } else {
	            return 'ຕອນແລງ';
	        }
	    },
	    calendar : {
	        sameDay : '[ມື້ນີ້ເວລາ] LT',
	        nextDay : '[ມື້ອື່ນເວລາ] LT',
	        nextWeek : '[ວັນ]dddd[ໜ້າເວລາ] LT',
	        lastDay : '[ມື້ວານນີ້ເວລາ] LT',
	        lastWeek : '[ວັນ]dddd[ແລ້ວນີ້ເວລາ] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'ອີກ %s',
	        past : '%sຜ່ານມາ',
	        s : 'ບໍ່ເທົ່າໃດວິນາທີ',
	        m : '1 ນາທີ',
	        mm : '%d ນາທີ',
	        h : '1 ຊົ່ວໂມງ',
	        hh : '%d ຊົ່ວໂມງ',
	        d : '1 ມື້',
	        dd : '%d ມື້',
	        M : '1 ເດືອນ',
	        MM : '%d ເດືອນ',
	        y : '1 ປີ',
	        yy : '%d ປີ'
	    },
	    ordinalParse: /(ທີ່)\d{1,2}/,
	    ordinal : function (number) {
	        return 'ທີ່' + number;
	    }
	});

	return lo;

	})));


/***/ },
/* 451 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Lithuanian [lt]
	//! author : Mindaugas Mozūras : https://github.com/mmozuras

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var units = {
	    'm' : 'minutė_minutės_minutę',
	    'mm': 'minutės_minučių_minutes',
	    'h' : 'valanda_valandos_valandą',
	    'hh': 'valandos_valandų_valandas',
	    'd' : 'diena_dienos_dieną',
	    'dd': 'dienos_dienų_dienas',
	    'M' : 'mėnuo_mėnesio_mėnesį',
	    'MM': 'mėnesiai_mėnesių_mėnesius',
	    'y' : 'metai_metų_metus',
	    'yy': 'metai_metų_metus'
	};
	function translateSeconds(number, withoutSuffix, key, isFuture) {
	    if (withoutSuffix) {
	        return 'kelios sekundės';
	    } else {
	        return isFuture ? 'kelių sekundžių' : 'kelias sekundes';
	    }
	}
	function translateSingular(number, withoutSuffix, key, isFuture) {
	    return withoutSuffix ? forms(key)[0] : (isFuture ? forms(key)[1] : forms(key)[2]);
	}
	function special(number) {
	    return number % 10 === 0 || (number > 10 && number < 20);
	}
	function forms(key) {
	    return units[key].split('_');
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    if (number === 1) {
	        return result + translateSingular(number, withoutSuffix, key[0], isFuture);
	    } else if (withoutSuffix) {
	        return result + (special(number) ? forms(key)[1] : forms(key)[0]);
	    } else {
	        if (isFuture) {
	            return result + forms(key)[1];
	        } else {
	            return result + (special(number) ? forms(key)[1] : forms(key)[2]);
	        }
	    }
	}
	var lt = moment.defineLocale('lt', {
	    months : {
	        format: 'sausio_vasario_kovo_balandžio_gegužės_birželio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio'.split('_'),
	        standalone: 'sausis_vasaris_kovas_balandis_gegužė_birželis_liepa_rugpjūtis_rugsėjis_spalis_lapkritis_gruodis'.split('_'),
	        isFormat: /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?|MMMM?(\[[^\[\]]*\]|\s)+D[oD]?/
	    },
	    monthsShort : 'sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd'.split('_'),
	    weekdays : {
	        format: 'sekmadienį_pirmadienį_antradienį_trečiadienį_ketvirtadienį_penktadienį_šeštadienį'.split('_'),
	        standalone: 'sekmadienis_pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis'.split('_'),
	        isFormat: /dddd HH:mm/
	    },
	    weekdaysShort : 'Sek_Pir_Ant_Tre_Ket_Pen_Šeš'.split('_'),
	    weekdaysMin : 'S_P_A_T_K_Pn_Š'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'YYYY [m.] MMMM D [d.]',
	        LLL : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
	        LLLL : 'YYYY [m.] MMMM D [d.], dddd, HH:mm [val.]',
	        l : 'YYYY-MM-DD',
	        ll : 'YYYY [m.] MMMM D [d.]',
	        lll : 'YYYY [m.] MMMM D [d.], HH:mm [val.]',
	        llll : 'YYYY [m.] MMMM D [d.], ddd, HH:mm [val.]'
	    },
	    calendar : {
	        sameDay : '[Šiandien] LT',
	        nextDay : '[Rytoj] LT',
	        nextWeek : 'dddd LT',
	        lastDay : '[Vakar] LT',
	        lastWeek : '[Praėjusį] dddd LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'po %s',
	        past : 'prieš %s',
	        s : translateSeconds,
	        m : translateSingular,
	        mm : translate,
	        h : translateSingular,
	        hh : translate,
	        d : translateSingular,
	        dd : translate,
	        M : translateSingular,
	        MM : translate,
	        y : translateSingular,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}-oji/,
	    ordinal : function (number) {
	        return number + '-oji';
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return lt;

	})));


/***/ },
/* 452 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Latvian [lv]
	//! author : Kristaps Karlsons : https://github.com/skakri
	//! author : Jānis Elmeris : https://github.com/JanisE

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var units = {
	    'm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
	    'mm': 'minūtes_minūtēm_minūte_minūtes'.split('_'),
	    'h': 'stundas_stundām_stunda_stundas'.split('_'),
	    'hh': 'stundas_stundām_stunda_stundas'.split('_'),
	    'd': 'dienas_dienām_diena_dienas'.split('_'),
	    'dd': 'dienas_dienām_diena_dienas'.split('_'),
	    'M': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
	    'MM': 'mēneša_mēnešiem_mēnesis_mēneši'.split('_'),
	    'y': 'gada_gadiem_gads_gadi'.split('_'),
	    'yy': 'gada_gadiem_gads_gadi'.split('_')
	};
	/**
	 * @param withoutSuffix boolean true = a length of time; false = before/after a period of time.
	 */
	function format(forms, number, withoutSuffix) {
	    if (withoutSuffix) {
	        // E.g. "21 minūte", "3 minūtes".
	        return number % 10 === 1 && number % 100 !== 11 ? forms[2] : forms[3];
	    } else {
	        // E.g. "21 minūtes" as in "pēc 21 minūtes".
	        // E.g. "3 minūtēm" as in "pēc 3 minūtēm".
	        return number % 10 === 1 && number % 100 !== 11 ? forms[0] : forms[1];
	    }
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    return number + ' ' + format(units[key], number, withoutSuffix);
	}
	function relativeTimeWithSingular(number, withoutSuffix, key) {
	    return format(units[key], number, withoutSuffix);
	}
	function relativeSeconds(number, withoutSuffix) {
	    return withoutSuffix ? 'dažas sekundes' : 'dažām sekundēm';
	}

	var lv = moment.defineLocale('lv', {
	    months : 'janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec'.split('_'),
	    weekdays : 'svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena'.split('_'),
	    weekdaysShort : 'Sv_P_O_T_C_Pk_S'.split('_'),
	    weekdaysMin : 'Sv_P_O_T_C_Pk_S'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY.',
	        LL : 'YYYY. [gada] D. MMMM',
	        LLL : 'YYYY. [gada] D. MMMM, HH:mm',
	        LLLL : 'YYYY. [gada] D. MMMM, dddd, HH:mm'
	    },
	    calendar : {
	        sameDay : '[Šodien pulksten] LT',
	        nextDay : '[Rīt pulksten] LT',
	        nextWeek : 'dddd [pulksten] LT',
	        lastDay : '[Vakar pulksten] LT',
	        lastWeek : '[Pagājušā] dddd [pulksten] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'pēc %s',
	        past : 'pirms %s',
	        s : relativeSeconds,
	        m : relativeTimeWithSingular,
	        mm : relativeTimeWithPlural,
	        h : relativeTimeWithSingular,
	        hh : relativeTimeWithPlural,
	        d : relativeTimeWithSingular,
	        dd : relativeTimeWithPlural,
	        M : relativeTimeWithSingular,
	        MM : relativeTimeWithPlural,
	        y : relativeTimeWithSingular,
	        yy : relativeTimeWithPlural
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return lv;

	})));


/***/ },
/* 453 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Montenegrin [me]
	//! author : Miodrag Nikač <miodrag@restartit.me> : https://github.com/miodragnikac

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var translator = {
	    words: { //Different grammatical cases
	        m: ['jedan minut', 'jednog minuta'],
	        mm: ['minut', 'minuta', 'minuta'],
	        h: ['jedan sat', 'jednog sata'],
	        hh: ['sat', 'sata', 'sati'],
	        dd: ['dan', 'dana', 'dana'],
	        MM: ['mjesec', 'mjeseca', 'mjeseci'],
	        yy: ['godina', 'godine', 'godina']
	    },
	    correctGrammaticalCase: function (number, wordKey) {
	        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	    },
	    translate: function (number, withoutSuffix, key) {
	        var wordKey = translator.words[key];
	        if (key.length === 1) {
	            return withoutSuffix ? wordKey[0] : wordKey[1];
	        } else {
	            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	        }
	    }
	};

	var me = moment.defineLocale('me', {
	    months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
	    monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact : true,
	    weekdays: 'nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota'.split('_'),
	    weekdaysShort: 'ned._pon._uto._sri._čet._pet._sub.'.split('_'),
	    weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm',
	        LLLL: 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar: {
	        sameDay: '[danas u] LT',
	        nextDay: '[sjutra u] LT',

	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedjelju] [u] LT';
	                case 3:
	                    return '[u] [srijedu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[juče u] LT',
	        lastWeek : function () {
	            var lastWeekDays = [
	                '[prošle] [nedjelje] [u] LT',
	                '[prošlog] [ponedjeljka] [u] LT',
	                '[prošlog] [utorka] [u] LT',
	                '[prošle] [srijede] [u] LT',
	                '[prošlog] [četvrtka] [u] LT',
	                '[prošlog] [petka] [u] LT',
	                '[prošle] [subote] [u] LT'
	            ];
	            return lastWeekDays[this.day()];
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'prije %s',
	        s      : 'nekoliko sekundi',
	        m      : translator.translate,
	        mm     : translator.translate,
	        h      : translator.translate,
	        hh     : translator.translate,
	        d      : 'dan',
	        dd     : translator.translate,
	        M      : 'mjesec',
	        MM     : translator.translate,
	        y      : 'godinu',
	        yy     : translator.translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return me;

	})));


/***/ },
/* 454 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Maori [mi]
	//! author : John Corrigan <robbiecloset@gmail.com> : https://github.com/johnideal

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var mi = moment.defineLocale('mi', {
	    months: 'Kohi-tāte_Hui-tanguru_Poutū-te-rangi_Paenga-whāwhā_Haratua_Pipiri_Hōngoingoi_Here-turi-kōkā_Mahuru_Whiringa-ā-nuku_Whiringa-ā-rangi_Hakihea'.split('_'),
	    monthsShort: 'Kohi_Hui_Pou_Pae_Hara_Pipi_Hōngoi_Here_Mahu_Whi-nu_Whi-ra_Haki'.split('_'),
	    monthsRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
	    monthsStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
	    monthsShortRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,3}/i,
	    monthsShortStrictRegex: /(?:['a-z\u0101\u014D\u016B]+\-?){1,2}/i,
	    weekdays: 'Rātapu_Mane_Tūrei_Wenerei_Tāite_Paraire_Hātarei'.split('_'),
	    weekdaysShort: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
	    weekdaysMin: 'Ta_Ma_Tū_We_Tāi_Pa_Hā'.split('_'),
	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY [i] HH:mm',
	        LLLL: 'dddd, D MMMM YYYY [i] HH:mm'
	    },
	    calendar: {
	        sameDay: '[i teie mahana, i] LT',
	        nextDay: '[apopo i] LT',
	        nextWeek: 'dddd [i] LT',
	        lastDay: '[inanahi i] LT',
	        lastWeek: 'dddd [whakamutunga i] LT',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: 'i roto i %s',
	        past: '%s i mua',
	        s: 'te hēkona ruarua',
	        m: 'he meneti',
	        mm: '%d meneti',
	        h: 'te haora',
	        hh: '%d haora',
	        d: 'he ra',
	        dd: '%d ra',
	        M: 'he marama',
	        MM: '%d marama',
	        y: 'he tau',
	        yy: '%d tau'
	    },
	    ordinalParse: /\d{1,2}º/,
	    ordinal: '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return mi;

	})));


/***/ },
/* 455 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Macedonian [mk]
	//! author : Borislav Mickov : https://github.com/B0k0

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var mk = moment.defineLocale('mk', {
	    months : 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
	    monthsShort : 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
	    weekdays : 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
	    weekdaysShort : 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
	    weekdaysMin : 'нe_пo_вт_ср_че_пе_сa'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'D.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd, D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay : '[Денес во] LT',
	        nextDay : '[Утре во] LT',
	        nextWeek : '[Во] dddd [во] LT',
	        lastDay : '[Вчера во] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 6:
	                    return '[Изминатата] dddd [во] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[Изминатиот] dddd [во] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'после %s',
	        past : 'пред %s',
	        s : 'неколку секунди',
	        m : 'минута',
	        mm : '%d минути',
	        h : 'час',
	        hh : '%d часа',
	        d : 'ден',
	        dd : '%d дена',
	        M : 'месец',
	        MM : '%d месеци',
	        y : 'година',
	        yy : '%d години'
	    },
	    ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
	    ordinal : function (number) {
	        var lastDigit = number % 10,
	            last2Digits = number % 100;
	        if (number === 0) {
	            return number + '-ев';
	        } else if (last2Digits === 0) {
	            return number + '-ен';
	        } else if (last2Digits > 10 && last2Digits < 20) {
	            return number + '-ти';
	        } else if (lastDigit === 1) {
	            return number + '-ви';
	        } else if (lastDigit === 2) {
	            return number + '-ри';
	        } else if (lastDigit === 7 || lastDigit === 8) {
	            return number + '-ми';
	        } else {
	            return number + '-ти';
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return mk;

	})));


/***/ },
/* 456 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Malayalam [ml]
	//! author : Floyd Pink : https://github.com/floydpink

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ml = moment.defineLocale('ml', {
	    months : 'ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ'.split('_'),
	    monthsShort : 'ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച'.split('_'),
	    weekdaysShort : 'ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി'.split('_'),
	    weekdaysMin : 'ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm -നു',
	        LTS : 'A h:mm:ss -നു',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm -നു',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm -നു'
	    },
	    calendar : {
	        sameDay : '[ഇന്ന്] LT',
	        nextDay : '[നാളെ] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[ഇന്നലെ] LT',
	        lastWeek : '[കഴിഞ്ഞ] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s കഴിഞ്ഞ്',
	        past : '%s മുൻപ്',
	        s : 'അൽപ നിമിഷങ്ങൾ',
	        m : 'ഒരു മിനിറ്റ്',
	        mm : '%d മിനിറ്റ്',
	        h : 'ഒരു മണിക്കൂർ',
	        hh : '%d മണിക്കൂർ',
	        d : 'ഒരു ദിവസം',
	        dd : '%d ദിവസം',
	        M : 'ഒരു മാസം',
	        MM : '%d മാസം',
	        y : 'ഒരു വർഷം',
	        yy : '%d വർഷം'
	    },
	    meridiemParse: /രാത്രി|രാവിലെ|ഉച്ച കഴിഞ്ഞ്|വൈകുന്നേരം|രാത്രി/i,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if ((meridiem === 'രാത്രി' && hour >= 4) ||
	                meridiem === 'ഉച്ച കഴിഞ്ഞ്' ||
	                meridiem === 'വൈകുന്നേരം') {
	            return hour + 12;
	        } else {
	            return hour;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'രാത്രി';
	        } else if (hour < 12) {
	            return 'രാവിലെ';
	        } else if (hour < 17) {
	            return 'ഉച്ച കഴിഞ്ഞ്';
	        } else if (hour < 20) {
	            return 'വൈകുന്നേരം';
	        } else {
	            return 'രാത്രി';
	        }
	    }
	});

	return ml;

	})));


/***/ },
/* 457 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Marathi [mr]
	//! author : Harshad Kale : https://github.com/kalehv
	//! author : Vivek Athalye : https://github.com/vnathalye

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '१',
	    '2': '२',
	    '3': '३',
	    '4': '४',
	    '5': '५',
	    '6': '६',
	    '7': '७',
	    '8': '८',
	    '9': '९',
	    '0': '०'
	};
	var numberMap = {
	    '१': '1',
	    '२': '2',
	    '३': '3',
	    '४': '4',
	    '५': '5',
	    '६': '6',
	    '७': '7',
	    '८': '8',
	    '९': '9',
	    '०': '0'
	};

	function relativeTimeMr(number, withoutSuffix, string, isFuture)
	{
	    var output = '';
	    if (withoutSuffix) {
	        switch (string) {
	            case 's': output = 'काही सेकंद'; break;
	            case 'm': output = 'एक मिनिट'; break;
	            case 'mm': output = '%d मिनिटे'; break;
	            case 'h': output = 'एक तास'; break;
	            case 'hh': output = '%d तास'; break;
	            case 'd': output = 'एक दिवस'; break;
	            case 'dd': output = '%d दिवस'; break;
	            case 'M': output = 'एक महिना'; break;
	            case 'MM': output = '%d महिने'; break;
	            case 'y': output = 'एक वर्ष'; break;
	            case 'yy': output = '%d वर्षे'; break;
	        }
	    }
	    else {
	        switch (string) {
	            case 's': output = 'काही सेकंदां'; break;
	            case 'm': output = 'एका मिनिटा'; break;
	            case 'mm': output = '%d मिनिटां'; break;
	            case 'h': output = 'एका तासा'; break;
	            case 'hh': output = '%d तासां'; break;
	            case 'd': output = 'एका दिवसा'; break;
	            case 'dd': output = '%d दिवसां'; break;
	            case 'M': output = 'एका महिन्या'; break;
	            case 'MM': output = '%d महिन्यां'; break;
	            case 'y': output = 'एका वर्षा'; break;
	            case 'yy': output = '%d वर्षां'; break;
	        }
	    }
	    return output.replace(/%d/i, number);
	}

	var mr = moment.defineLocale('mr', {
	    months : 'जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर'.split('_'),
	    monthsShort: 'जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार'.split('_'),
	    weekdaysShort : 'रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि'.split('_'),
	    weekdaysMin : 'र_सो_मं_बु_गु_शु_श'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm वाजता',
	        LTS : 'A h:mm:ss वाजता',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm वाजता',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm वाजता'
	    },
	    calendar : {
	        sameDay : '[आज] LT',
	        nextDay : '[उद्या] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[काल] LT',
	        lastWeek: '[मागील] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future: '%sमध्ये',
	        past: '%sपूर्वी',
	        s: relativeTimeMr,
	        m: relativeTimeMr,
	        mm: relativeTimeMr,
	        h: relativeTimeMr,
	        hh: relativeTimeMr,
	        d: relativeTimeMr,
	        dd: relativeTimeMr,
	        M: relativeTimeMr,
	        MM: relativeTimeMr,
	        y: relativeTimeMr,
	        yy: relativeTimeMr
	    },
	    preparse: function (string) {
	        return string.replace(/[१२३४५६७८९०]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /रात्री|सकाळी|दुपारी|सायंकाळी/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'रात्री') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === 'सकाळी') {
	            return hour;
	        } else if (meridiem === 'दुपारी') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === 'सायंकाळी') {
	            return hour + 12;
	        }
	    },
	    meridiem: function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'रात्री';
	        } else if (hour < 10) {
	            return 'सकाळी';
	        } else if (hour < 17) {
	            return 'दुपारी';
	        } else if (hour < 20) {
	            return 'सायंकाळी';
	        } else {
	            return 'रात्री';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return mr;

	})));


/***/ },
/* 458 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Malay [ms]
	//! author : Weldan Jamili : https://github.com/weldan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ms = moment.defineLocale('ms', {
	    months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
	    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
	    weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
	    weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
	    weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /pagi|tengahari|petang|malam/,
	    meridiemHour: function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'pagi') {
	            return hour;
	        } else if (meridiem === 'tengahari') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'petang' || meridiem === 'malam') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'pagi';
	        } else if (hours < 15) {
	            return 'tengahari';
	        } else if (hours < 19) {
	            return 'petang';
	        } else {
	            return 'malam';
	        }
	    },
	    calendar : {
	        sameDay : '[Hari ini pukul] LT',
	        nextDay : '[Esok pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kelmarin pukul] LT',
	        lastWeek : 'dddd [lepas pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'dalam %s',
	        past : '%s yang lepas',
	        s : 'beberapa saat',
	        m : 'seminit',
	        mm : '%d minit',
	        h : 'sejam',
	        hh : '%d jam',
	        d : 'sehari',
	        dd : '%d hari',
	        M : 'sebulan',
	        MM : '%d bulan',
	        y : 'setahun',
	        yy : '%d tahun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ms;

	})));


/***/ },
/* 459 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Malay [ms-my]
	//! note : DEPRECATED, the correct one is [ms]
	//! author : Weldan Jamili : https://github.com/weldan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var msMy = moment.defineLocale('ms-my', {
	    months : 'Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember'.split('_'),
	    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis'.split('_'),
	    weekdays : 'Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu'.split('_'),
	    weekdaysShort : 'Ahd_Isn_Sel_Rab_Kha_Jum_Sab'.split('_'),
	    weekdaysMin : 'Ah_Is_Sl_Rb_Km_Jm_Sb'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [pukul] HH.mm',
	        LLLL : 'dddd, D MMMM YYYY [pukul] HH.mm'
	    },
	    meridiemParse: /pagi|tengahari|petang|malam/,
	    meridiemHour: function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'pagi') {
	            return hour;
	        } else if (meridiem === 'tengahari') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'petang' || meridiem === 'malam') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'pagi';
	        } else if (hours < 15) {
	            return 'tengahari';
	        } else if (hours < 19) {
	            return 'petang';
	        } else {
	            return 'malam';
	        }
	    },
	    calendar : {
	        sameDay : '[Hari ini pukul] LT',
	        nextDay : '[Esok pukul] LT',
	        nextWeek : 'dddd [pukul] LT',
	        lastDay : '[Kelmarin pukul] LT',
	        lastWeek : 'dddd [lepas pukul] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'dalam %s',
	        past : '%s yang lepas',
	        s : 'beberapa saat',
	        m : 'seminit',
	        mm : '%d minit',
	        h : 'sejam',
	        hh : '%d jam',
	        d : 'sehari',
	        dd : '%d hari',
	        M : 'sebulan',
	        MM : '%d bulan',
	        y : 'setahun',
	        yy : '%d tahun'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return msMy;

	})));


/***/ },
/* 460 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Burmese [my]
	//! author : Squar team, mysquar.com
	//! author : David Rossellat : https://github.com/gholadr
	//! author : Tin Aung Lin : https://github.com/thanyawzinmin

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '၁',
	    '2': '၂',
	    '3': '၃',
	    '4': '၄',
	    '5': '၅',
	    '6': '၆',
	    '7': '၇',
	    '8': '၈',
	    '9': '၉',
	    '0': '၀'
	};
	var numberMap = {
	    '၁': '1',
	    '၂': '2',
	    '၃': '3',
	    '၄': '4',
	    '၅': '5',
	    '၆': '6',
	    '၇': '7',
	    '၈': '8',
	    '၉': '9',
	    '၀': '0'
	};

	var my = moment.defineLocale('my', {
	    months: 'ဇန်နဝါရီ_ဖေဖော်ဝါရီ_မတ်_ဧပြီ_မေ_ဇွန်_ဇူလိုင်_သြဂုတ်_စက်တင်ဘာ_အောက်တိုဘာ_နိုဝင်ဘာ_ဒီဇင်ဘာ'.split('_'),
	    monthsShort: 'ဇန်_ဖေ_မတ်_ပြီ_မေ_ဇွန်_လိုင်_သြ_စက်_အောက်_နို_ဒီ'.split('_'),
	    weekdays: 'တနင်္ဂနွေ_တနင်္လာ_အင်္ဂါ_ဗုဒ္ဓဟူး_ကြာသပတေး_သောကြာ_စနေ'.split('_'),
	    weekdaysShort: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),
	    weekdaysMin: 'နွေ_လာ_ဂါ_ဟူး_ကြာ_သော_နေ'.split('_'),

	    longDateFormat: {
	        LT: 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L: 'DD/MM/YYYY',
	        LL: 'D MMMM YYYY',
	        LLL: 'D MMMM YYYY HH:mm',
	        LLLL: 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar: {
	        sameDay: '[ယနေ.] LT [မှာ]',
	        nextDay: '[မနက်ဖြန်] LT [မှာ]',
	        nextWeek: 'dddd LT [မှာ]',
	        lastDay: '[မနေ.က] LT [မှာ]',
	        lastWeek: '[ပြီးခဲ့သော] dddd LT [မှာ]',
	        sameElse: 'L'
	    },
	    relativeTime: {
	        future: 'လာမည့် %s မှာ',
	        past: 'လွန်ခဲ့သော %s က',
	        s: 'စက္ကန်.အနည်းငယ်',
	        m: 'တစ်မိနစ်',
	        mm: '%d မိနစ်',
	        h: 'တစ်နာရီ',
	        hh: '%d နာရီ',
	        d: 'တစ်ရက်',
	        dd: '%d ရက်',
	        M: 'တစ်လ',
	        MM: '%d လ',
	        y: 'တစ်နှစ်',
	        yy: '%d နှစ်'
	    },
	    preparse: function (string) {
	        return string.replace(/[၁၂၃၄၅၆၇၈၉၀]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    week: {
	        dow: 1, // Monday is the first day of the week.
	        doy: 4 // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return my;

	})));


/***/ },
/* 461 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Norwegian Bokmål [nb]
	//! authors : Espen Hovlandsdal : https://github.com/rexxars
	//!           Sigurd Gartmann : https://github.com/sigurdga

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var nb = moment.defineLocale('nb', {
	    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
	    monthsShort : 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),
	    weekdaysShort : 'sø._ma._ti._on._to._fr._lø.'.split('_'),
	    weekdaysMin : 'sø_ma_ti_on_to_fr_lø'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY [kl.] HH:mm',
	        LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
	    },
	    calendar : {
	        sameDay: '[i dag kl.] LT',
	        nextDay: '[i morgen kl.] LT',
	        nextWeek: 'dddd [kl.] LT',
	        lastDay: '[i går kl.] LT',
	        lastWeek: '[forrige] dddd [kl.] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : '%s siden',
	        s : 'noen sekunder',
	        m : 'ett minutt',
	        mm : '%d minutter',
	        h : 'en time',
	        hh : '%d timer',
	        d : 'en dag',
	        dd : '%d dager',
	        M : 'en måned',
	        MM : '%d måneder',
	        y : 'ett år',
	        yy : '%d år'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return nb;

	})));


/***/ },
/* 462 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Nepalese [ne]
	//! author : suvash : https://github.com/suvash

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '१',
	    '2': '२',
	    '3': '३',
	    '4': '४',
	    '5': '५',
	    '6': '६',
	    '7': '७',
	    '8': '८',
	    '9': '९',
	    '0': '०'
	};
	var numberMap = {
	    '१': '1',
	    '२': '2',
	    '३': '3',
	    '४': '4',
	    '५': '5',
	    '६': '6',
	    '७': '7',
	    '८': '8',
	    '९': '9',
	    '०': '0'
	};

	var ne = moment.defineLocale('ne', {
	    months : 'जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर'.split('_'),
	    monthsShort : 'जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार'.split('_'),
	    weekdaysShort : 'आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.'.split('_'),
	    weekdaysMin : 'आ._सो._मं._बु._बि._शु._श.'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'Aको h:mm बजे',
	        LTS : 'Aको h:mm:ss बजे',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, Aको h:mm बजे',
	        LLLL : 'dddd, D MMMM YYYY, Aको h:mm बजे'
	    },
	    preparse: function (string) {
	        return string.replace(/[१२३४५६७८९०]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    meridiemParse: /राति|बिहान|दिउँसो|साँझ/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'राति') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === 'बिहान') {
	            return hour;
	        } else if (meridiem === 'दिउँसो') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === 'साँझ') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 3) {
	            return 'राति';
	        } else if (hour < 12) {
	            return 'बिहान';
	        } else if (hour < 16) {
	            return 'दिउँसो';
	        } else if (hour < 20) {
	            return 'साँझ';
	        } else {
	            return 'राति';
	        }
	    },
	    calendar : {
	        sameDay : '[आज] LT',
	        nextDay : '[भोलि] LT',
	        nextWeek : '[आउँदो] dddd[,] LT',
	        lastDay : '[हिजो] LT',
	        lastWeek : '[गएको] dddd[,] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%sमा',
	        past : '%s अगाडि',
	        s : 'केही क्षण',
	        m : 'एक मिनेट',
	        mm : '%d मिनेट',
	        h : 'एक घण्टा',
	        hh : '%d घण्टा',
	        d : 'एक दिन',
	        dd : '%d दिन',
	        M : 'एक महिना',
	        MM : '%d महिना',
	        y : 'एक बर्ष',
	        yy : '%d बर्ष'
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ne;

	})));


/***/ },
/* 463 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Dutch [nl]
	//! author : Joris Röling : https://github.com/jorisroling
	//! author : Jacob Middag : https://github.com/middagj

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
	var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

	var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
	var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

	var nl = moment.defineLocale('nl', {
	    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShortWithoutDots[m.month()];
	        } else {
	            return monthsShortWithDots[m.month()];
	        }
	    },

	    monthsRegex: monthsRegex,
	    monthsShortRegex: monthsRegex,
	    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
	    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

	    monthsParse : monthsParse,
	    longMonthsParse : monthsParse,
	    shortMonthsParse : monthsParse,

	    weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
	    weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
	    weekdaysMin : 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD-MM-YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[vandaag om] LT',
	        nextDay: '[morgen om] LT',
	        nextWeek: 'dddd [om] LT',
	        lastDay: '[gisteren om] LT',
	        lastWeek: '[afgelopen] dddd [om] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'over %s',
	        past : '%s geleden',
	        s : 'een paar seconden',
	        m : 'één minuut',
	        mm : '%d minuten',
	        h : 'één uur',
	        hh : '%d uur',
	        d : 'één dag',
	        dd : '%d dagen',
	        M : 'één maand',
	        MM : '%d maanden',
	        y : 'één jaar',
	        yy : '%d jaar'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return nl;

	})));


/***/ },
/* 464 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Dutch (Belgium) [nl-be]
	//! author : Joris Röling : https://github.com/jorisroling
	//! author : Jacob Middag : https://github.com/middagj

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_');
	var monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

	var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
	var monthsRegex = /^(januari|februari|maart|april|mei|april|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

	var nlBe = moment.defineLocale('nl-be', {
	    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
	    monthsShort : function (m, format) {
	        if (/-MMM-/.test(format)) {
	            return monthsShortWithoutDots[m.month()];
	        } else {
	            return monthsShortWithDots[m.month()];
	        }
	    },

	    monthsRegex: monthsRegex,
	    monthsShortRegex: monthsRegex,
	    monthsStrictRegex: /^(januari|februari|maart|mei|ju[nl]i|april|augustus|september|oktober|november|december)/i,
	    monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

	    monthsParse : monthsParse,
	    longMonthsParse : monthsParse,
	    shortMonthsParse : monthsParse,

	    weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
	    weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
	    weekdaysMin : 'Zo_Ma_Di_Wo_Do_Vr_Za'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[vandaag om] LT',
	        nextDay: '[morgen om] LT',
	        nextWeek: 'dddd [om] LT',
	        lastDay: '[gisteren om] LT',
	        lastWeek: '[afgelopen] dddd [om] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'over %s',
	        past : '%s geleden',
	        s : 'een paar seconden',
	        m : 'één minuut',
	        mm : '%d minuten',
	        h : 'één uur',
	        hh : '%d uur',
	        d : 'één dag',
	        dd : '%d dagen',
	        M : 'één maand',
	        MM : '%d maanden',
	        y : 'één jaar',
	        yy : '%d jaar'
	    },
	    ordinalParse: /\d{1,2}(ste|de)/,
	    ordinal : function (number) {
	        return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return nlBe;

	})));


/***/ },
/* 465 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Nynorsk [nn]
	//! author : https://github.com/mechuwind

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var nn = moment.defineLocale('nn', {
	    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des'.split('_'),
	    weekdays : 'sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag'.split('_'),
	    weekdaysShort : 'sun_mån_tys_ons_tor_fre_lau'.split('_'),
	    weekdaysMin : 'su_må_ty_on_to_fr_lø'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY [kl.] H:mm',
	        LLLL : 'dddd D. MMMM YYYY [kl.] HH:mm'
	    },
	    calendar : {
	        sameDay: '[I dag klokka] LT',
	        nextDay: '[I morgon klokka] LT',
	        nextWeek: 'dddd [klokka] LT',
	        lastDay: '[I går klokka] LT',
	        lastWeek: '[Føregåande] dddd [klokka] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : '%s sidan',
	        s : 'nokre sekund',
	        m : 'eit minutt',
	        mm : '%d minutt',
	        h : 'ein time',
	        hh : '%d timar',
	        d : 'ein dag',
	        dd : '%d dagar',
	        M : 'ein månad',
	        MM : '%d månader',
	        y : 'eit år',
	        yy : '%d år'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return nn;

	})));


/***/ },
/* 466 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Punjabi (India) [pa-in]
	//! author : Harpreet Singh : https://github.com/harpreetkhalsagtbit

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '੧',
	    '2': '੨',
	    '3': '੩',
	    '4': '੪',
	    '5': '੫',
	    '6': '੬',
	    '7': '੭',
	    '8': '੮',
	    '9': '੯',
	    '0': '੦'
	};
	var numberMap = {
	    '੧': '1',
	    '੨': '2',
	    '੩': '3',
	    '੪': '4',
	    '੫': '5',
	    '੬': '6',
	    '੭': '7',
	    '੮': '8',
	    '੯': '9',
	    '੦': '0'
	};

	var paIn = moment.defineLocale('pa-in', {
	    // There are months name as per Nanakshahi Calender but they are not used as rigidly in modern Punjabi.
	    months : 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
	    monthsShort : 'ਜਨਵਰੀ_ਫ਼ਰਵਰੀ_ਮਾਰਚ_ਅਪ੍ਰੈਲ_ਮਈ_ਜੂਨ_ਜੁਲਾਈ_ਅਗਸਤ_ਸਤੰਬਰ_ਅਕਤੂਬਰ_ਨਵੰਬਰ_ਦਸੰਬਰ'.split('_'),
	    weekdays : 'ਐਤਵਾਰ_ਸੋਮਵਾਰ_ਮੰਗਲਵਾਰ_ਬੁਧਵਾਰ_ਵੀਰਵਾਰ_ਸ਼ੁੱਕਰਵਾਰ_ਸ਼ਨੀਚਰਵਾਰ'.split('_'),
	    weekdaysShort : 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
	    weekdaysMin : 'ਐਤ_ਸੋਮ_ਮੰਗਲ_ਬੁਧ_ਵੀਰ_ਸ਼ੁਕਰ_ਸ਼ਨੀ'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm ਵਜੇ',
	        LTS : 'A h:mm:ss ਵਜੇ',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm ਵਜੇ',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm ਵਜੇ'
	    },
	    calendar : {
	        sameDay : '[ਅਜ] LT',
	        nextDay : '[ਕਲ] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[ਕਲ] LT',
	        lastWeek : '[ਪਿਛਲੇ] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s ਵਿੱਚ',
	        past : '%s ਪਿਛਲੇ',
	        s : 'ਕੁਝ ਸਕਿੰਟ',
	        m : 'ਇਕ ਮਿੰਟ',
	        mm : '%d ਮਿੰਟ',
	        h : 'ਇੱਕ ਘੰਟਾ',
	        hh : '%d ਘੰਟੇ',
	        d : 'ਇੱਕ ਦਿਨ',
	        dd : '%d ਦਿਨ',
	        M : 'ਇੱਕ ਮਹੀਨਾ',
	        MM : '%d ਮਹੀਨੇ',
	        y : 'ਇੱਕ ਸਾਲ',
	        yy : '%d ਸਾਲ'
	    },
	    preparse: function (string) {
	        return string.replace(/[੧੨੩੪੫੬੭੮੯੦]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    // Punjabi notation for meridiems are quite fuzzy in practice. While there exists
	    // a rigid notion of a 'Pahar' it is not used as rigidly in modern Punjabi.
	    meridiemParse: /ਰਾਤ|ਸਵੇਰ|ਦੁਪਹਿਰ|ਸ਼ਾਮ/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'ਰਾਤ') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === 'ਸਵੇਰ') {
	            return hour;
	        } else if (meridiem === 'ਦੁਪਹਿਰ') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === 'ਸ਼ਾਮ') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'ਰਾਤ';
	        } else if (hour < 10) {
	            return 'ਸਵੇਰ';
	        } else if (hour < 17) {
	            return 'ਦੁਪਹਿਰ';
	        } else if (hour < 20) {
	            return 'ਸ਼ਾਮ';
	        } else {
	            return 'ਰਾਤ';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return paIn;

	})));


/***/ },
/* 467 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Polish [pl]
	//! author : Rafal Hirsz : https://github.com/evoL

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var monthsNominative = 'styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień'.split('_');
	var monthsSubjective = 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia'.split('_');
	function plural(n) {
	    return (n % 10 < 5) && (n % 10 > 1) && ((~~(n / 10) % 10) !== 1);
	}
	function translate(number, withoutSuffix, key) {
	    var result = number + ' ';
	    switch (key) {
	        case 'm':
	            return withoutSuffix ? 'minuta' : 'minutę';
	        case 'mm':
	            return result + (plural(number) ? 'minuty' : 'minut');
	        case 'h':
	            return withoutSuffix  ? 'godzina'  : 'godzinę';
	        case 'hh':
	            return result + (plural(number) ? 'godziny' : 'godzin');
	        case 'MM':
	            return result + (plural(number) ? 'miesiące' : 'miesięcy');
	        case 'yy':
	            return result + (plural(number) ? 'lata' : 'lat');
	    }
	}

	var pl = moment.defineLocale('pl', {
	    months : function (momentToFormat, format) {
	        if (format === '') {
	            // Hack: if format empty we know this is used to generate
	            // RegExp by moment. Give then back both valid forms of months
	            // in RegExp ready format.
	            return '(' + monthsSubjective[momentToFormat.month()] + '|' + monthsNominative[momentToFormat.month()] + ')';
	        } else if (/D MMMM/.test(format)) {
	            return monthsSubjective[momentToFormat.month()];
	        } else {
	            return monthsNominative[momentToFormat.month()];
	        }
	    },
	    monthsShort : 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'.split('_'),
	    weekdays : 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),
	    weekdaysShort : 'ndz_pon_wt_śr_czw_pt_sob'.split('_'),
	    weekdaysMin : 'Nd_Pn_Wt_Śr_Cz_Pt_So'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Dziś o] LT',
	        nextDay: '[Jutro o] LT',
	        nextWeek: '[W] dddd [o] LT',
	        lastDay: '[Wczoraj o] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[W zeszłą niedzielę o] LT';
	                case 3:
	                    return '[W zeszłą środę o] LT';
	                case 6:
	                    return '[W zeszłą sobotę o] LT';
	                default:
	                    return '[W zeszły] dddd [o] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past : '%s temu',
	        s : 'kilka sekund',
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : '1 dzień',
	        dd : '%d dni',
	        M : 'miesiąc',
	        MM : translate,
	        y : 'rok',
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return pl;

	})));


/***/ },
/* 468 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Portuguese [pt]
	//! author : Jefferson : https://github.com/jalex79

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var pt = moment.defineLocale('pt', {
	    months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
	    weekdays : 'Domingo_Segunda-Feira_Terça-Feira_Quarta-Feira_Quinta-Feira_Sexta-Feira_Sábado'.split('_'),
	    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
	    weekdaysMin : 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY HH:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Hoje às] LT',
	        nextDay: '[Amanhã às] LT',
	        nextWeek: 'dddd [às] LT',
	        lastDay: '[Ontem às] LT',
	        lastWeek: function () {
	            return (this.day() === 0 || this.day() === 6) ?
	                '[Último] dddd [às] LT' : // Saturday + Sunday
	                '[Última] dddd [às] LT'; // Monday - Friday
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'em %s',
	        past : 'há %s',
	        s : 'segundos',
	        m : 'um minuto',
	        mm : '%d minutos',
	        h : 'uma hora',
	        hh : '%d horas',
	        d : 'um dia',
	        dd : '%d dias',
	        M : 'um mês',
	        MM : '%d meses',
	        y : 'um ano',
	        yy : '%d anos'
	    },
	    ordinalParse: /\d{1,2}º/,
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return pt;

	})));


/***/ },
/* 469 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Portuguese (Brazil) [pt-br]
	//! author : Caio Ribeiro Pereira : https://github.com/caio-ribeiro-pereira

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var ptBr = moment.defineLocale('pt-br', {
	    months : 'Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez'.split('_'),
	    weekdays : 'Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado'.split('_'),
	    weekdaysShort : 'Dom_Seg_Ter_Qua_Qui_Sex_Sáb'.split('_'),
	    weekdaysMin : 'Dom_2ª_3ª_4ª_5ª_6ª_Sáb'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D [de] MMMM [de] YYYY',
	        LLL : 'D [de] MMMM [de] YYYY [às] HH:mm',
	        LLLL : 'dddd, D [de] MMMM [de] YYYY [às] HH:mm'
	    },
	    calendar : {
	        sameDay: '[Hoje às] LT',
	        nextDay: '[Amanhã às] LT',
	        nextWeek: 'dddd [às] LT',
	        lastDay: '[Ontem às] LT',
	        lastWeek: function () {
	            return (this.day() === 0 || this.day() === 6) ?
	                '[Último] dddd [às] LT' : // Saturday + Sunday
	                '[Última] dddd [às] LT'; // Monday - Friday
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'em %s',
	        past : '%s atrás',
	        s : 'poucos segundos',
	        m : 'um minuto',
	        mm : '%d minutos',
	        h : 'uma hora',
	        hh : '%d horas',
	        d : 'um dia',
	        dd : '%d dias',
	        M : 'um mês',
	        MM : '%d meses',
	        y : 'um ano',
	        yy : '%d anos'
	    },
	    ordinalParse: /\d{1,2}º/,
	    ordinal : '%dº'
	});

	return ptBr;

	})));


/***/ },
/* 470 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Romanian [ro]
	//! author : Vlad Gurdiga : https://github.com/gurdiga
	//! author : Valentin Agachi : https://github.com/avaly

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	            'mm': 'minute',
	            'hh': 'ore',
	            'dd': 'zile',
	            'MM': 'luni',
	            'yy': 'ani'
	        },
	        separator = ' ';
	    if (number % 100 >= 20 || (number >= 100 && number % 100 === 0)) {
	        separator = ' de ';
	    }
	    return number + separator + format[key];
	}

	var ro = moment.defineLocale('ro', {
	    months : 'ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie'.split('_'),
	    monthsShort : 'ian._febr._mart._apr._mai_iun._iul._aug._sept._oct._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'duminică_luni_marți_miercuri_joi_vineri_sâmbătă'.split('_'),
	    weekdaysShort : 'Dum_Lun_Mar_Mie_Joi_Vin_Sâm'.split('_'),
	    weekdaysMin : 'Du_Lu_Ma_Mi_Jo_Vi_Sâ'.split('_'),
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY H:mm',
	        LLLL : 'dddd, D MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay: '[azi la] LT',
	        nextDay: '[mâine la] LT',
	        nextWeek: 'dddd [la] LT',
	        lastDay: '[ieri la] LT',
	        lastWeek: '[fosta] dddd [la] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'peste %s',
	        past : '%s în urmă',
	        s : 'câteva secunde',
	        m : 'un minut',
	        mm : relativeTimeWithPlural,
	        h : 'o oră',
	        hh : relativeTimeWithPlural,
	        d : 'o zi',
	        dd : relativeTimeWithPlural,
	        M : 'o lună',
	        MM : relativeTimeWithPlural,
	        y : 'un an',
	        yy : relativeTimeWithPlural
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ro;

	})));


/***/ },
/* 471 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Russian [ru]
	//! author : Viktorminator : https://github.com/Viktorminator
	//! Author : Menelion Elensúle : https://github.com/Oire
	//! author : Коренберг Марк : https://github.com/socketpair

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function plural(word, num) {
	    var forms = word.split('_');
	    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
	        'hh': 'час_часа_часов',
	        'dd': 'день_дня_дней',
	        'MM': 'месяц_месяца_месяцев',
	        'yy': 'год_года_лет'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? 'минута' : 'минуту';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}
	var monthsParse = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];

	// http://new.gramota.ru/spravka/rules/139-prop : § 103
	// Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
	// CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
	var ru = moment.defineLocale('ru', {
	    months : {
	        format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
	        standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
	    },
	    monthsShort : {
	        // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
	        format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
	        standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
	    },
	    weekdays : {
	        standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
	        format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
	        isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
	    },
	    weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
	    weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
	    monthsParse : monthsParse,
	    longMonthsParse : monthsParse,
	    shortMonthsParse : monthsParse,

	    // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
	    monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

	    // копия предыдущего
	    monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

	    // полные названия с падежами
	    monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,

	    // Выражение, которое соотвествует только сокращённым формам
	    monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY г.',
	        LLL : 'D MMMM YYYY г., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY г., HH:mm'
	    },
	    calendar : {
	        sameDay: '[Сегодня в] LT',
	        nextDay: '[Завтра в] LT',
	        lastDay: '[Вчера в] LT',
	        nextWeek: function (now) {
	            if (now.week() !== this.week()) {
	                switch (this.day()) {
	                    case 0:
	                        return '[В следующее] dddd [в] LT';
	                    case 1:
	                    case 2:
	                    case 4:
	                        return '[В следующий] dddd [в] LT';
	                    case 3:
	                    case 5:
	                    case 6:
	                        return '[В следующую] dddd [в] LT';
	                }
	            } else {
	                if (this.day() === 2) {
	                    return '[Во] dddd [в] LT';
	                } else {
	                    return '[В] dddd [в] LT';
	                }
	            }
	        },
	        lastWeek: function (now) {
	            if (now.week() !== this.week()) {
	                switch (this.day()) {
	                    case 0:
	                        return '[В прошлое] dddd [в] LT';
	                    case 1:
	                    case 2:
	                    case 4:
	                        return '[В прошлый] dddd [в] LT';
	                    case 3:
	                    case 5:
	                    case 6:
	                        return '[В прошлую] dddd [в] LT';
	                }
	            } else {
	                if (this.day() === 2) {
	                    return '[Во] dddd [в] LT';
	                } else {
	                    return '[В] dddd [в] LT';
	                }
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'через %s',
	        past : '%s назад',
	        s : 'несколько секунд',
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : 'час',
	        hh : relativeTimeWithPlural,
	        d : 'день',
	        dd : relativeTimeWithPlural,
	        M : 'месяц',
	        MM : relativeTimeWithPlural,
	        y : 'год',
	        yy : relativeTimeWithPlural
	    },
	    meridiemParse: /ночи|утра|дня|вечера/i,
	    isPM : function (input) {
	        return /^(дня|вечера)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'ночи';
	        } else if (hour < 12) {
	            return 'утра';
	        } else if (hour < 17) {
	            return 'дня';
	        } else {
	            return 'вечера';
	        }
	    },
	    ordinalParse: /\d{1,2}-(й|го|я)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	                return number + '-й';
	            case 'D':
	                return number + '-го';
	            case 'w':
	            case 'W':
	                return number + '-я';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ru;

	})));


/***/ },
/* 472 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Northern Sami [se]
	//! authors : Bård Rolstad Henriksen : https://github.com/karamell

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';



	var se = moment.defineLocale('se', {
	    months : 'ođđajagemánnu_guovvamánnu_njukčamánnu_cuoŋománnu_miessemánnu_geassemánnu_suoidnemánnu_borgemánnu_čakčamánnu_golggotmánnu_skábmamánnu_juovlamánnu'.split('_'),
	    monthsShort : 'ođđj_guov_njuk_cuo_mies_geas_suoi_borg_čakč_golg_skáb_juov'.split('_'),
	    weekdays : 'sotnabeaivi_vuossárga_maŋŋebárga_gaskavahkku_duorastat_bearjadat_lávvardat'.split('_'),
	    weekdaysShort : 'sotn_vuos_maŋ_gask_duor_bear_láv'.split('_'),
	    weekdaysMin : 's_v_m_g_d_b_L'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'MMMM D. [b.] YYYY',
	        LLL : 'MMMM D. [b.] YYYY [ti.] HH:mm',
	        LLLL : 'dddd, MMMM D. [b.] YYYY [ti.] HH:mm'
	    },
	    calendar : {
	        sameDay: '[otne ti] LT',
	        nextDay: '[ihttin ti] LT',
	        nextWeek: 'dddd [ti] LT',
	        lastDay: '[ikte ti] LT',
	        lastWeek: '[ovddit] dddd [ti] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '%s geažes',
	        past : 'maŋit %s',
	        s : 'moadde sekunddat',
	        m : 'okta minuhta',
	        mm : '%d minuhtat',
	        h : 'okta diimmu',
	        hh : '%d diimmut',
	        d : 'okta beaivi',
	        dd : '%d beaivvit',
	        M : 'okta mánnu',
	        MM : '%d mánut',
	        y : 'okta jahki',
	        yy : '%d jagit'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return se;

	})));


/***/ },
/* 473 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Sinhalese [si]
	//! author : Sampath Sitinamaluwa : https://github.com/sampathsris

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	/*jshint -W100*/
	var si = moment.defineLocale('si', {
	    months : 'ජනවාරි_පෙබරවාරි_මාර්තු_අප්‍රේල්_මැයි_ජූනි_ජූලි_අගෝස්තු_සැප්තැම්බර්_ඔක්තෝබර්_නොවැම්බර්_දෙසැම්බර්'.split('_'),
	    monthsShort : 'ජන_පෙබ_මාර්_අප්_මැයි_ජූනි_ජූලි_අගෝ_සැප්_ඔක්_නොවැ_දෙසැ'.split('_'),
	    weekdays : 'ඉරිදා_සඳුදා_අඟහරුවාදා_බදාදා_බ්‍රහස්පතින්දා_සිකුරාදා_සෙනසුරාදා'.split('_'),
	    weekdaysShort : 'ඉරි_සඳු_අඟ_බදා_බ්‍රහ_සිකු_සෙන'.split('_'),
	    weekdaysMin : 'ඉ_ස_අ_බ_බ්‍ර_සි_සෙ'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'a h:mm',
	        LTS : 'a h:mm:ss',
	        L : 'YYYY/MM/DD',
	        LL : 'YYYY MMMM D',
	        LLL : 'YYYY MMMM D, a h:mm',
	        LLLL : 'YYYY MMMM D [වැනි] dddd, a h:mm:ss'
	    },
	    calendar : {
	        sameDay : '[අද] LT[ට]',
	        nextDay : '[හෙට] LT[ට]',
	        nextWeek : 'dddd LT[ට]',
	        lastDay : '[ඊයේ] LT[ට]',
	        lastWeek : '[පසුගිය] dddd LT[ට]',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%sකින්',
	        past : '%sකට පෙර',
	        s : 'තත්පර කිහිපය',
	        m : 'මිනිත්තුව',
	        mm : 'මිනිත්තු %d',
	        h : 'පැය',
	        hh : 'පැය %d',
	        d : 'දිනය',
	        dd : 'දින %d',
	        M : 'මාසය',
	        MM : 'මාස %d',
	        y : 'වසර',
	        yy : 'වසර %d'
	    },
	    ordinalParse: /\d{1,2} වැනි/,
	    ordinal : function (number) {
	        return number + ' වැනි';
	    },
	    meridiemParse : /පෙර වරු|පස් වරු|පෙ.ව|ප.ව./,
	    isPM : function (input) {
	        return input === 'ප.ව.' || input === 'පස් වරු';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'ප.ව.' : 'පස් වරු';
	        } else {
	            return isLower ? 'පෙ.ව.' : 'පෙර වරු';
	        }
	    }
	});

	return si;

	})));


/***/ },
/* 474 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Slovak [sk]
	//! author : Martin Minka : https://github.com/k2s
	//! based on work of petrbela : https://github.com/petrbela

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var months = 'január_február_marec_apríl_máj_jún_júl_august_september_október_november_december'.split('_');
	var monthsShort = 'jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec'.split('_');
	function plural(n) {
	    return (n > 1) && (n < 5);
	}
	function translate(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':  // a few seconds / in a few seconds / a few seconds ago
	            return (withoutSuffix || isFuture) ? 'pár sekúnd' : 'pár sekundami';
	        case 'm':  // a minute / in a minute / a minute ago
	            return withoutSuffix ? 'minúta' : (isFuture ? 'minútu' : 'minútou');
	        case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'minúty' : 'minút');
	            } else {
	                return result + 'minútami';
	            }
	            break;
	        case 'h':  // an hour / in an hour / an hour ago
	            return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
	        case 'hh': // 9 hours / in 9 hours / 9 hours ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'hodiny' : 'hodín');
	            } else {
	                return result + 'hodinami';
	            }
	            break;
	        case 'd':  // a day / in a day / a day ago
	            return (withoutSuffix || isFuture) ? 'deň' : 'dňom';
	        case 'dd': // 9 days / in 9 days / 9 days ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'dni' : 'dní');
	            } else {
	                return result + 'dňami';
	            }
	            break;
	        case 'M':  // a month / in a month / a month ago
	            return (withoutSuffix || isFuture) ? 'mesiac' : 'mesiacom';
	        case 'MM': // 9 months / in 9 months / 9 months ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'mesiace' : 'mesiacov');
	            } else {
	                return result + 'mesiacmi';
	            }
	            break;
	        case 'y':  // a year / in a year / a year ago
	            return (withoutSuffix || isFuture) ? 'rok' : 'rokom';
	        case 'yy': // 9 years / in 9 years / 9 years ago
	            if (withoutSuffix || isFuture) {
	                return result + (plural(number) ? 'roky' : 'rokov');
	            } else {
	                return result + 'rokmi';
	            }
	            break;
	    }
	}

	var sk = moment.defineLocale('sk', {
	    months : months,
	    monthsShort : monthsShort,
	    weekdays : 'nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota'.split('_'),
	    weekdaysShort : 'ne_po_ut_st_št_pi_so'.split('_'),
	    weekdaysMin : 'ne_po_ut_st_št_pi_so'.split('_'),
	    longDateFormat : {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay: '[dnes o] LT',
	        nextDay: '[zajtra o] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[v nedeľu o] LT';
	                case 1:
	                case 2:
	                    return '[v] dddd [o] LT';
	                case 3:
	                    return '[v stredu o] LT';
	                case 4:
	                    return '[vo štvrtok o] LT';
	                case 5:
	                    return '[v piatok o] LT';
	                case 6:
	                    return '[v sobotu o] LT';
	            }
	        },
	        lastDay: '[včera o] LT',
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[minulú nedeľu o] LT';
	                case 1:
	                case 2:
	                    return '[minulý] dddd [o] LT';
	                case 3:
	                    return '[minulú stredu o] LT';
	                case 4:
	                case 5:
	                    return '[minulý] dddd [o] LT';
	                case 6:
	                    return '[minulú sobotu o] LT';
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past : 'pred %s',
	        s : translate,
	        m : translate,
	        mm : translate,
	        h : translate,
	        hh : translate,
	        d : translate,
	        dd : translate,
	        M : translate,
	        MM : translate,
	        y : translate,
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return sk;

	})));


/***/ },
/* 475 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Slovenian [sl]
	//! author : Robert Sedovšek : https://github.com/sedovsek

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var result = number + ' ';
	    switch (key) {
	        case 's':
	            return withoutSuffix || isFuture ? 'nekaj sekund' : 'nekaj sekundami';
	        case 'm':
	            return withoutSuffix ? 'ena minuta' : 'eno minuto';
	        case 'mm':
	            if (number === 1) {
	                result += withoutSuffix ? 'minuta' : 'minuto';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'minuti' : 'minutama';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'minute' : 'minutami';
	            } else {
	                result += withoutSuffix || isFuture ? 'minut' : 'minutami';
	            }
	            return result;
	        case 'h':
	            return withoutSuffix ? 'ena ura' : 'eno uro';
	        case 'hh':
	            if (number === 1) {
	                result += withoutSuffix ? 'ura' : 'uro';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'uri' : 'urama';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'ure' : 'urami';
	            } else {
	                result += withoutSuffix || isFuture ? 'ur' : 'urami';
	            }
	            return result;
	        case 'd':
	            return withoutSuffix || isFuture ? 'en dan' : 'enim dnem';
	        case 'dd':
	            if (number === 1) {
	                result += withoutSuffix || isFuture ? 'dan' : 'dnem';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'dni' : 'dnevoma';
	            } else {
	                result += withoutSuffix || isFuture ? 'dni' : 'dnevi';
	            }
	            return result;
	        case 'M':
	            return withoutSuffix || isFuture ? 'en mesec' : 'enim mesecem';
	        case 'MM':
	            if (number === 1) {
	                result += withoutSuffix || isFuture ? 'mesec' : 'mesecem';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'meseca' : 'mesecema';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'mesece' : 'meseci';
	            } else {
	                result += withoutSuffix || isFuture ? 'mesecev' : 'meseci';
	            }
	            return result;
	        case 'y':
	            return withoutSuffix || isFuture ? 'eno leto' : 'enim letom';
	        case 'yy':
	            if (number === 1) {
	                result += withoutSuffix || isFuture ? 'leto' : 'letom';
	            } else if (number === 2) {
	                result += withoutSuffix || isFuture ? 'leti' : 'letoma';
	            } else if (number < 5) {
	                result += withoutSuffix || isFuture ? 'leta' : 'leti';
	            } else {
	                result += withoutSuffix || isFuture ? 'let' : 'leti';
	            }
	            return result;
	    }
	}

	var sl = moment.defineLocale('sl', {
	    months : 'januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december'.split('_'),
	    monthsShort : 'jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota'.split('_'),
	    weekdaysShort : 'ned._pon._tor._sre._čet._pet._sob.'.split('_'),
	    weekdaysMin : 'ne_po_to_sr_če_pe_so'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM YYYY',
	        LLL : 'D. MMMM YYYY H:mm',
	        LLLL : 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar : {
	        sameDay  : '[danes ob] LT',
	        nextDay  : '[jutri ob] LT',

	        nextWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[v] [nedeljo] [ob] LT';
	                case 3:
	                    return '[v] [sredo] [ob] LT';
	                case 6:
	                    return '[v] [soboto] [ob] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[v] dddd [ob] LT';
	            }
	        },
	        lastDay  : '[včeraj ob] LT',
	        lastWeek : function () {
	            switch (this.day()) {
	                case 0:
	                    return '[prejšnjo] [nedeljo] [ob] LT';
	                case 3:
	                    return '[prejšnjo] [sredo] [ob] LT';
	                case 6:
	                    return '[prejšnjo] [soboto] [ob] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[prejšnji] dddd [ob] LT';
	            }
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'čez %s',
	        past   : 'pred %s',
	        s      : processRelativeTime,
	        m      : processRelativeTime,
	        mm     : processRelativeTime,
	        h      : processRelativeTime,
	        hh     : processRelativeTime,
	        d      : processRelativeTime,
	        dd     : processRelativeTime,
	        M      : processRelativeTime,
	        MM     : processRelativeTime,
	        y      : processRelativeTime,
	        yy     : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return sl;

	})));


/***/ },
/* 476 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Albanian [sq]
	//! author : Flakërim Ismani : https://github.com/flakerimi
	//! author : Menelion Elensúle : https://github.com/Oire
	//! author : Oerd Cukalla : https://github.com/oerd

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var sq = moment.defineLocale('sq', {
	    months : 'Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor'.split('_'),
	    monthsShort : 'Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj'.split('_'),
	    weekdays : 'E Diel_E Hënë_E Martë_E Mërkurë_E Enjte_E Premte_E Shtunë'.split('_'),
	    weekdaysShort : 'Die_Hën_Mar_Mër_Enj_Pre_Sht'.split('_'),
	    weekdaysMin : 'D_H_Ma_Më_E_P_Sh'.split('_'),
	    weekdaysParseExact : true,
	    meridiemParse: /PD|MD/,
	    isPM: function (input) {
	        return input.charAt(0) === 'M';
	    },
	    meridiem : function (hours, minutes, isLower) {
	        return hours < 12 ? 'PD' : 'MD';
	    },
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[Sot në] LT',
	        nextDay : '[Nesër në] LT',
	        nextWeek : 'dddd [në] LT',
	        lastDay : '[Dje në] LT',
	        lastWeek : 'dddd [e kaluar në] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'në %s',
	        past : '%s më parë',
	        s : 'disa sekonda',
	        m : 'një minutë',
	        mm : '%d minuta',
	        h : 'një orë',
	        hh : '%d orë',
	        d : 'një ditë',
	        dd : '%d ditë',
	        M : 'një muaj',
	        MM : '%d muaj',
	        y : 'një vit',
	        yy : '%d vite'
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return sq;

	})));


/***/ },
/* 477 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Serbian [sr]
	//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var translator = {
	    words: { //Different grammatical cases
	        m: ['jedan minut', 'jedne minute'],
	        mm: ['minut', 'minute', 'minuta'],
	        h: ['jedan sat', 'jednog sata'],
	        hh: ['sat', 'sata', 'sati'],
	        dd: ['dan', 'dana', 'dana'],
	        MM: ['mesec', 'meseca', 'meseci'],
	        yy: ['godina', 'godine', 'godina']
	    },
	    correctGrammaticalCase: function (number, wordKey) {
	        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	    },
	    translate: function (number, withoutSuffix, key) {
	        var wordKey = translator.words[key];
	        if (key.length === 1) {
	            return withoutSuffix ? wordKey[0] : wordKey[1];
	        } else {
	            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	        }
	    }
	};

	var sr = moment.defineLocale('sr', {
	    months: 'januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar'.split('_'),
	    monthsShort: 'jan._feb._mar._apr._maj_jun_jul_avg._sep._okt._nov._dec.'.split('_'),
	    monthsParseExact: true,
	    weekdays: 'nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota'.split('_'),
	    weekdaysShort: 'ned._pon._uto._sre._čet._pet._sub.'.split('_'),
	    weekdaysMin: 'ne_po_ut_sr_če_pe_su'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm',
	        LLLL: 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar: {
	        sameDay: '[danas u] LT',
	        nextDay: '[sutra u] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[u] [nedelju] [u] LT';
	                case 3:
	                    return '[u] [sredu] [u] LT';
	                case 6:
	                    return '[u] [subotu] [u] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[u] dddd [u] LT';
	            }
	        },
	        lastDay  : '[juče u] LT',
	        lastWeek : function () {
	            var lastWeekDays = [
	                '[prošle] [nedelje] [u] LT',
	                '[prošlog] [ponedeljka] [u] LT',
	                '[prošlog] [utorka] [u] LT',
	                '[prošle] [srede] [u] LT',
	                '[prošlog] [četvrtka] [u] LT',
	                '[prošlog] [petka] [u] LT',
	                '[prošle] [subote] [u] LT'
	            ];
	            return lastWeekDays[this.day()];
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'za %s',
	        past   : 'pre %s',
	        s      : 'nekoliko sekundi',
	        m      : translator.translate,
	        mm     : translator.translate,
	        h      : translator.translate,
	        hh     : translator.translate,
	        d      : 'dan',
	        dd     : translator.translate,
	        M      : 'mesec',
	        MM     : translator.translate,
	        y      : 'godinu',
	        yy     : translator.translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return sr;

	})));


/***/ },
/* 478 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Serbian Cyrillic [sr-cyrl]
	//! author : Milan Janačković<milanjanackovic@gmail.com> : https://github.com/milan-j

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var translator = {
	    words: { //Different grammatical cases
	        m: ['један минут', 'једне минуте'],
	        mm: ['минут', 'минуте', 'минута'],
	        h: ['један сат', 'једног сата'],
	        hh: ['сат', 'сата', 'сати'],
	        dd: ['дан', 'дана', 'дана'],
	        MM: ['месец', 'месеца', 'месеци'],
	        yy: ['година', 'године', 'година']
	    },
	    correctGrammaticalCase: function (number, wordKey) {
	        return number === 1 ? wordKey[0] : (number >= 2 && number <= 4 ? wordKey[1] : wordKey[2]);
	    },
	    translate: function (number, withoutSuffix, key) {
	        var wordKey = translator.words[key];
	        if (key.length === 1) {
	            return withoutSuffix ? wordKey[0] : wordKey[1];
	        } else {
	            return number + ' ' + translator.correctGrammaticalCase(number, wordKey);
	        }
	    }
	};

	var srCyrl = moment.defineLocale('sr-cyrl', {
	    months: 'јануар_фебруар_март_април_мај_јун_јул_август_септембар_октобар_новембар_децембар'.split('_'),
	    monthsShort: 'јан._феб._мар._апр._мај_јун_јул_авг._сеп._окт._нов._дец.'.split('_'),
	    monthsParseExact: true,
	    weekdays: 'недеља_понедељак_уторак_среда_четвртак_петак_субота'.split('_'),
	    weekdaysShort: 'нед._пон._уто._сре._чет._пет._суб.'.split('_'),
	    weekdaysMin: 'не_по_ут_ср_че_пе_су'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat: {
	        LT: 'H:mm',
	        LTS : 'H:mm:ss',
	        L: 'DD.MM.YYYY',
	        LL: 'D. MMMM YYYY',
	        LLL: 'D. MMMM YYYY H:mm',
	        LLLL: 'dddd, D. MMMM YYYY H:mm'
	    },
	    calendar: {
	        sameDay: '[данас у] LT',
	        nextDay: '[сутра у] LT',
	        nextWeek: function () {
	            switch (this.day()) {
	                case 0:
	                    return '[у] [недељу] [у] LT';
	                case 3:
	                    return '[у] [среду] [у] LT';
	                case 6:
	                    return '[у] [суботу] [у] LT';
	                case 1:
	                case 2:
	                case 4:
	                case 5:
	                    return '[у] dddd [у] LT';
	            }
	        },
	        lastDay  : '[јуче у] LT',
	        lastWeek : function () {
	            var lastWeekDays = [
	                '[прошле] [недеље] [у] LT',
	                '[прошлог] [понедељка] [у] LT',
	                '[прошлог] [уторка] [у] LT',
	                '[прошле] [среде] [у] LT',
	                '[прошлог] [четвртка] [у] LT',
	                '[прошлог] [петка] [у] LT',
	                '[прошле] [суботе] [у] LT'
	            ];
	            return lastWeekDays[this.day()];
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'за %s',
	        past   : 'пре %s',
	        s      : 'неколико секунди',
	        m      : translator.translate,
	        mm     : translator.translate,
	        h      : translator.translate,
	        hh     : translator.translate,
	        d      : 'дан',
	        dd     : translator.translate,
	        M      : 'месец',
	        MM     : translator.translate,
	        y      : 'годину',
	        yy     : translator.translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return srCyrl;

	})));


/***/ },
/* 479 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : siSwati [ss]
	//! author : Nicolai Davies<mail@nicolai.io> : https://github.com/nicolaidavies

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';



	var ss = moment.defineLocale('ss', {
	    months : "Bhimbidvwane_Indlovana_Indlov'lenkhulu_Mabasa_Inkhwekhweti_Inhlaba_Kholwane_Ingci_Inyoni_Imphala_Lweti_Ingongoni".split('_'),
	    monthsShort : 'Bhi_Ina_Inu_Mab_Ink_Inh_Kho_Igc_Iny_Imp_Lwe_Igo'.split('_'),
	    weekdays : 'Lisontfo_Umsombuluko_Lesibili_Lesitsatfu_Lesine_Lesihlanu_Umgcibelo'.split('_'),
	    weekdaysShort : 'Lis_Umb_Lsb_Les_Lsi_Lsh_Umg'.split('_'),
	    weekdaysMin : 'Li_Us_Lb_Lt_Ls_Lh_Ug'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Namuhla nga] LT',
	        nextDay : '[Kusasa nga] LT',
	        nextWeek : 'dddd [nga] LT',
	        lastDay : '[Itolo nga] LT',
	        lastWeek : 'dddd [leliphelile] [nga] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'nga %s',
	        past : 'wenteka nga %s',
	        s : 'emizuzwana lomcane',
	        m : 'umzuzu',
	        mm : '%d emizuzu',
	        h : 'lihora',
	        hh : '%d emahora',
	        d : 'lilanga',
	        dd : '%d emalanga',
	        M : 'inyanga',
	        MM : '%d tinyanga',
	        y : 'umnyaka',
	        yy : '%d iminyaka'
	    },
	    meridiemParse: /ekuseni|emini|entsambama|ebusuku/,
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 11) {
	            return 'ekuseni';
	        } else if (hours < 15) {
	            return 'emini';
	        } else if (hours < 19) {
	            return 'entsambama';
	        } else {
	            return 'ebusuku';
	        }
	    },
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'ekuseni') {
	            return hour;
	        } else if (meridiem === 'emini') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === 'entsambama' || meridiem === 'ebusuku') {
	            if (hour === 0) {
	                return 0;
	            }
	            return hour + 12;
	        }
	    },
	    ordinalParse: /\d{1,2}/,
	    ordinal : '%d',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return ss;

	})));


/***/ },
/* 480 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Swedish [sv]
	//! author : Jens Alm : https://github.com/ulmus

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var sv = moment.defineLocale('sv', {
	    months : 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december'.split('_'),
	    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'.split('_'),
	    weekdays : 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
	    weekdaysShort : 'sön_mån_tis_ons_tor_fre_lör'.split('_'),
	    weekdaysMin : 'sö_må_ti_on_to_fr_lö'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'YYYY-MM-DD',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY [kl.] HH:mm',
	        LLLL : 'dddd D MMMM YYYY [kl.] HH:mm',
	        lll : 'D MMM YYYY HH:mm',
	        llll : 'ddd D MMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Idag] LT',
	        nextDay: '[Imorgon] LT',
	        lastDay: '[Igår] LT',
	        nextWeek: '[På] dddd LT',
	        lastWeek: '[I] dddd[s] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'om %s',
	        past : 'för %s sedan',
	        s : 'några sekunder',
	        m : 'en minut',
	        mm : '%d minuter',
	        h : 'en timme',
	        hh : '%d timmar',
	        d : 'en dag',
	        dd : '%d dagar',
	        M : 'en månad',
	        MM : '%d månader',
	        y : 'ett år',
	        yy : '%d år'
	    },
	    ordinalParse: /\d{1,2}(e|a)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'e' :
	            (b === 1) ? 'a' :
	            (b === 2) ? 'a' :
	            (b === 3) ? 'e' : 'e';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return sv;

	})));


/***/ },
/* 481 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Swahili [sw]
	//! author : Fahad Kassim : https://github.com/fadsel

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var sw = moment.defineLocale('sw', {
	    months : 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba'.split('_'),
	    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'.split('_'),
	    weekdays : 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split('_'),
	    weekdaysShort : 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos'.split('_'),
	    weekdaysMin : 'J2_J3_J4_J5_Al_Ij_J1'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[leo saa] LT',
	        nextDay : '[kesho saa] LT',
	        nextWeek : '[wiki ijayo] dddd [saat] LT',
	        lastDay : '[jana] LT',
	        lastWeek : '[wiki iliyopita] dddd [saat] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s baadaye',
	        past : 'tokea %s',
	        s : 'hivi punde',
	        m : 'dakika moja',
	        mm : 'dakika %d',
	        h : 'saa limoja',
	        hh : 'masaa %d',
	        d : 'siku moja',
	        dd : 'masiku %d',
	        M : 'mwezi mmoja',
	        MM : 'miezi %d',
	        y : 'mwaka mmoja',
	        yy : 'miaka %d'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return sw;

	})));


/***/ },
/* 482 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tamil [ta]
	//! author : Arjunkumar Krishnamoorthy : https://github.com/tk120404

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var symbolMap = {
	    '1': '௧',
	    '2': '௨',
	    '3': '௩',
	    '4': '௪',
	    '5': '௫',
	    '6': '௬',
	    '7': '௭',
	    '8': '௮',
	    '9': '௯',
	    '0': '௦'
	};
	var numberMap = {
	    '௧': '1',
	    '௨': '2',
	    '௩': '3',
	    '௪': '4',
	    '௫': '5',
	    '௬': '6',
	    '௭': '7',
	    '௮': '8',
	    '௯': '9',
	    '௦': '0'
	};

	var ta = moment.defineLocale('ta', {
	    months : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
	    monthsShort : 'ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்'.split('_'),
	    weekdays : 'ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை'.split('_'),
	    weekdaysShort : 'ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி'.split('_'),
	    weekdaysMin : 'ஞா_தி_செ_பு_வி_வெ_ச'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, HH:mm',
	        LLLL : 'dddd, D MMMM YYYY, HH:mm'
	    },
	    calendar : {
	        sameDay : '[இன்று] LT',
	        nextDay : '[நாளை] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[நேற்று] LT',
	        lastWeek : '[கடந்த வாரம்] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s இல்',
	        past : '%s முன்',
	        s : 'ஒரு சில விநாடிகள்',
	        m : 'ஒரு நிமிடம்',
	        mm : '%d நிமிடங்கள்',
	        h : 'ஒரு மணி நேரம்',
	        hh : '%d மணி நேரம்',
	        d : 'ஒரு நாள்',
	        dd : '%d நாட்கள்',
	        M : 'ஒரு மாதம்',
	        MM : '%d மாதங்கள்',
	        y : 'ஒரு வருடம்',
	        yy : '%d ஆண்டுகள்'
	    },
	    ordinalParse: /\d{1,2}வது/,
	    ordinal : function (number) {
	        return number + 'வது';
	    },
	    preparse: function (string) {
	        return string.replace(/[௧௨௩௪௫௬௭௮௯௦]/g, function (match) {
	            return numberMap[match];
	        });
	    },
	    postformat: function (string) {
	        return string.replace(/\d/g, function (match) {
	            return symbolMap[match];
	        });
	    },
	    // refer http://ta.wikipedia.org/s/1er1
	    meridiemParse: /யாமம்|வைகறை|காலை|நண்பகல்|எற்பாடு|மாலை/,
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 2) {
	            return ' யாமம்';
	        } else if (hour < 6) {
	            return ' வைகறை';  // வைகறை
	        } else if (hour < 10) {
	            return ' காலை'; // காலை
	        } else if (hour < 14) {
	            return ' நண்பகல்'; // நண்பகல்
	        } else if (hour < 18) {
	            return ' எற்பாடு'; // எற்பாடு
	        } else if (hour < 22) {
	            return ' மாலை'; // மாலை
	        } else {
	            return ' யாமம்';
	        }
	    },
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'யாமம்') {
	            return hour < 2 ? hour : hour + 12;
	        } else if (meridiem === 'வைகறை' || meridiem === 'காலை') {
	            return hour;
	        } else if (meridiem === 'நண்பகல்') {
	            return hour >= 10 ? hour : hour + 12;
	        } else {
	            return hour + 12;
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return ta;

	})));


/***/ },
/* 483 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Telugu [te]
	//! author : Krishna Chaitanya Thota : https://github.com/kcthota

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var te = moment.defineLocale('te', {
	    months : 'జనవరి_ఫిబ్రవరి_మార్చి_ఏప్రిల్_మే_జూన్_జూలై_ఆగస్టు_సెప్టెంబర్_అక్టోబర్_నవంబర్_డిసెంబర్'.split('_'),
	    monthsShort : 'జన._ఫిబ్ర._మార్చి_ఏప్రి._మే_జూన్_జూలై_ఆగ._సెప్._అక్టో._నవ._డిసె.'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'ఆదివారం_సోమవారం_మంగళవారం_బుధవారం_గురువారం_శుక్రవారం_శనివారం'.split('_'),
	    weekdaysShort : 'ఆది_సోమ_మంగళ_బుధ_గురు_శుక్ర_శని'.split('_'),
	    weekdaysMin : 'ఆ_సో_మం_బు_గు_శు_శ'.split('_'),
	    longDateFormat : {
	        LT : 'A h:mm',
	        LTS : 'A h:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY, A h:mm',
	        LLLL : 'dddd, D MMMM YYYY, A h:mm'
	    },
	    calendar : {
	        sameDay : '[నేడు] LT',
	        nextDay : '[రేపు] LT',
	        nextWeek : 'dddd, LT',
	        lastDay : '[నిన్న] LT',
	        lastWeek : '[గత] dddd, LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s లో',
	        past : '%s క్రితం',
	        s : 'కొన్ని క్షణాలు',
	        m : 'ఒక నిమిషం',
	        mm : '%d నిమిషాలు',
	        h : 'ఒక గంట',
	        hh : '%d గంటలు',
	        d : 'ఒక రోజు',
	        dd : '%d రోజులు',
	        M : 'ఒక నెల',
	        MM : '%d నెలలు',
	        y : 'ఒక సంవత్సరం',
	        yy : '%d సంవత్సరాలు'
	    },
	    ordinalParse : /\d{1,2}వ/,
	    ordinal : '%dవ',
	    meridiemParse: /రాత్రి|ఉదయం|మధ్యాహ్నం|సాయంత్రం/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === 'రాత్రి') {
	            return hour < 4 ? hour : hour + 12;
	        } else if (meridiem === 'ఉదయం') {
	            return hour;
	        } else if (meridiem === 'మధ్యాహ్నం') {
	            return hour >= 10 ? hour : hour + 12;
	        } else if (meridiem === 'సాయంత్రం') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'రాత్రి';
	        } else if (hour < 10) {
	            return 'ఉదయం';
	        } else if (hour < 17) {
	            return 'మధ్యాహ్నం';
	        } else if (hour < 20) {
	            return 'సాయంత్రం';
	        } else {
	            return 'రాత్రి';
	        }
	    },
	    week : {
	        dow : 0, // Sunday is the first day of the week.
	        doy : 6  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return te;

	})));


/***/ },
/* 484 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tetun Dili (East Timor) [tet]
	//! author : Joshua Brooks : https://github.com/joshbrooks
	//! author : Onorio De J. Afonso : https://github.com/marobo

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var tet = moment.defineLocale('tet', {
	    months : 'Janeiru_Fevereiru_Marsu_Abril_Maiu_Juniu_Juliu_Augustu_Setembru_Outubru_Novembru_Dezembru'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Abr_Mai_Jun_Jul_Aug_Set_Out_Nov_Dez'.split('_'),
	    weekdays : 'Domingu_Segunda_Tersa_Kuarta_Kinta_Sexta_Sabadu'.split('_'),
	    weekdaysShort : 'Dom_Seg_Ters_Kua_Kint_Sext_Sab'.split('_'),
	    weekdaysMin : 'Do_Seg_Te_Ku_Ki_Sex_Sa'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Ohin iha] LT',
	        nextDay: '[Aban iha] LT',
	        nextWeek: 'dddd [iha] LT',
	        lastDay: '[Horiseik iha] LT',
	        lastWeek: 'dddd [semana kotuk] [iha] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'iha %s',
	        past : '%s liuba',
	        s : 'minutu balun',
	        m : 'minutu ida',
	        mm : 'minutus %d',
	        h : 'horas ida',
	        hh : 'horas %d',
	        d : 'loron ida',
	        dd : 'loron %d',
	        M : 'fulan ida',
	        MM : 'fulan %d',
	        y : 'tinan ida',
	        yy : 'tinan %d'
	    },
	    ordinalParse: /\d{1,2}(st|nd|rd|th)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return tet;

	})));


/***/ },
/* 485 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Thai [th]
	//! author : Kridsada Thanabulpong : https://github.com/sirn

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var th = moment.defineLocale('th', {
	    months : 'มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม'.split('_'),
	    monthsShort : 'ม.ค._ก.พ._มี.ค._เม.ย._พ.ค._มิ.ย._ก.ค._ส.ค._ก.ย._ต.ค._พ.ย._ธ.ค.'.split('_'),
	    monthsParseExact: true,
	    weekdays : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์'.split('_'),
	    weekdaysShort : 'อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์'.split('_'), // yes, three characters difference
	    weekdaysMin : 'อา._จ._อ._พ._พฤ._ศ._ส.'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'H:mm',
	        LTS : 'H:mm:ss',
	        L : 'YYYY/MM/DD',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY เวลา H:mm',
	        LLLL : 'วันddddที่ D MMMM YYYY เวลา H:mm'
	    },
	    meridiemParse: /ก่อนเที่ยง|หลังเที่ยง/,
	    isPM: function (input) {
	        return input === 'หลังเที่ยง';
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 12) {
	            return 'ก่อนเที่ยง';
	        } else {
	            return 'หลังเที่ยง';
	        }
	    },
	    calendar : {
	        sameDay : '[วันนี้ เวลา] LT',
	        nextDay : '[พรุ่งนี้ เวลา] LT',
	        nextWeek : 'dddd[หน้า เวลา] LT',
	        lastDay : '[เมื่อวานนี้ เวลา] LT',
	        lastWeek : '[วัน]dddd[ที่แล้ว เวลา] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'อีก %s',
	        past : '%sที่แล้ว',
	        s : 'ไม่กี่วินาที',
	        m : '1 นาที',
	        mm : '%d นาที',
	        h : '1 ชั่วโมง',
	        hh : '%d ชั่วโมง',
	        d : '1 วัน',
	        dd : '%d วัน',
	        M : '1 เดือน',
	        MM : '%d เดือน',
	        y : '1 ปี',
	        yy : '%d ปี'
	    }
	});

	return th;

	})));


/***/ },
/* 486 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Tagalog (Philippines) [tl-ph]
	//! author : Dan Hagman : https://github.com/hagmandan

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var tlPh = moment.defineLocale('tl-ph', {
	    months : 'Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre'.split('_'),
	    monthsShort : 'Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis'.split('_'),
	    weekdays : 'Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado'.split('_'),
	    weekdaysShort : 'Lin_Lun_Mar_Miy_Huw_Biy_Sab'.split('_'),
	    weekdaysMin : 'Li_Lu_Ma_Mi_Hu_Bi_Sab'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'MM/D/YYYY',
	        LL : 'MMMM D, YYYY',
	        LLL : 'MMMM D, YYYY HH:mm',
	        LLLL : 'dddd, MMMM DD, YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: 'LT [ngayong araw]',
	        nextDay: '[Bukas ng] LT',
	        nextWeek: 'LT [sa susunod na] dddd',
	        lastDay: 'LT [kahapon]',
	        lastWeek: 'LT [noong nakaraang] dddd',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'sa loob ng %s',
	        past : '%s ang nakalipas',
	        s : 'ilang segundo',
	        m : 'isang minuto',
	        mm : '%d minuto',
	        h : 'isang oras',
	        hh : '%d oras',
	        d : 'isang araw',
	        dd : '%d araw',
	        M : 'isang buwan',
	        MM : '%d buwan',
	        y : 'isang taon',
	        yy : '%d taon'
	    },
	    ordinalParse: /\d{1,2}/,
	    ordinal : function (number) {
	        return number;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return tlPh;

	})));


/***/ },
/* 487 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Klingon [tlh]
	//! author : Dominika Kruk : https://github.com/amaranthrose

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var numbersNouns = 'pagh_wa’_cha’_wej_loS_vagh_jav_Soch_chorgh_Hut'.split('_');

	function translateFuture(output) {
	    var time = output;
	    time = (output.indexOf('jaj') !== -1) ?
	    time.slice(0, -3) + 'leS' :
	    (output.indexOf('jar') !== -1) ?
	    time.slice(0, -3) + 'waQ' :
	    (output.indexOf('DIS') !== -1) ?
	    time.slice(0, -3) + 'nem' :
	    time + ' pIq';
	    return time;
	}

	function translatePast(output) {
	    var time = output;
	    time = (output.indexOf('jaj') !== -1) ?
	    time.slice(0, -3) + 'Hu’' :
	    (output.indexOf('jar') !== -1) ?
	    time.slice(0, -3) + 'wen' :
	    (output.indexOf('DIS') !== -1) ?
	    time.slice(0, -3) + 'ben' :
	    time + ' ret';
	    return time;
	}

	function translate(number, withoutSuffix, string, isFuture) {
	    var numberNoun = numberAsNoun(number);
	    switch (string) {
	        case 'mm':
	            return numberNoun + ' tup';
	        case 'hh':
	            return numberNoun + ' rep';
	        case 'dd':
	            return numberNoun + ' jaj';
	        case 'MM':
	            return numberNoun + ' jar';
	        case 'yy':
	            return numberNoun + ' DIS';
	    }
	}

	function numberAsNoun(number) {
	    var hundred = Math.floor((number % 1000) / 100),
	    ten = Math.floor((number % 100) / 10),
	    one = number % 10,
	    word = '';
	    if (hundred > 0) {
	        word += numbersNouns[hundred] + 'vatlh';
	    }
	    if (ten > 0) {
	        word += ((word !== '') ? ' ' : '') + numbersNouns[ten] + 'maH';
	    }
	    if (one > 0) {
	        word += ((word !== '') ? ' ' : '') + numbersNouns[one];
	    }
	    return (word === '') ? 'pagh' : word;
	}

	var tlh = moment.defineLocale('tlh', {
	    months : 'tera’ jar wa’_tera’ jar cha’_tera’ jar wej_tera’ jar loS_tera’ jar vagh_tera’ jar jav_tera’ jar Soch_tera’ jar chorgh_tera’ jar Hut_tera’ jar wa’maH_tera’ jar wa’maH wa’_tera’ jar wa’maH cha’'.split('_'),
	    monthsShort : 'jar wa’_jar cha’_jar wej_jar loS_jar vagh_jar jav_jar Soch_jar chorgh_jar Hut_jar wa’maH_jar wa’maH wa’_jar wa’maH cha’'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
	    weekdaysShort : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
	    weekdaysMin : 'lojmItjaj_DaSjaj_povjaj_ghItlhjaj_loghjaj_buqjaj_ghInjaj'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[DaHjaj] LT',
	        nextDay: '[wa’leS] LT',
	        nextWeek: 'LLL',
	        lastDay: '[wa’Hu’] LT',
	        lastWeek: 'LLL',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : translateFuture,
	        past : translatePast,
	        s : 'puS lup',
	        m : 'wa’ tup',
	        mm : translate,
	        h : 'wa’ rep',
	        hh : translate,
	        d : 'wa’ jaj',
	        dd : translate,
	        M : 'wa’ jar',
	        MM : translate,
	        y : 'wa’ DIS',
	        yy : translate
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return tlh;

	})));


/***/ },
/* 488 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Turkish [tr]
	//! authors : Erhan Gundogan : https://github.com/erhangundogan,
	//!           Burak Yiğit Kaya: https://github.com/BYK

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var suffixes = {
	    1: '\'inci',
	    5: '\'inci',
	    8: '\'inci',
	    70: '\'inci',
	    80: '\'inci',
	    2: '\'nci',
	    7: '\'nci',
	    20: '\'nci',
	    50: '\'nci',
	    3: '\'üncü',
	    4: '\'üncü',
	    100: '\'üncü',
	    6: '\'ncı',
	    9: '\'uncu',
	    10: '\'uncu',
	    30: '\'uncu',
	    60: '\'ıncı',
	    90: '\'ıncı'
	};

	var tr = moment.defineLocale('tr', {
	    months : 'Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık'.split('_'),
	    monthsShort : 'Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara'.split('_'),
	    weekdays : 'Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi'.split('_'),
	    weekdaysShort : 'Paz_Pts_Sal_Çar_Per_Cum_Cts'.split('_'),
	    weekdaysMin : 'Pz_Pt_Sa_Ça_Pe_Cu_Ct'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[bugün saat] LT',
	        nextDay : '[yarın saat] LT',
	        nextWeek : '[haftaya] dddd [saat] LT',
	        lastDay : '[dün] LT',
	        lastWeek : '[geçen hafta] dddd [saat] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : '%s sonra',
	        past : '%s önce',
	        s : 'birkaç saniye',
	        m : 'bir dakika',
	        mm : '%d dakika',
	        h : 'bir saat',
	        hh : '%d saat',
	        d : 'bir gün',
	        dd : '%d gün',
	        M : 'bir ay',
	        MM : '%d ay',
	        y : 'bir yıl',
	        yy : '%d yıl'
	    },
	    ordinalParse: /\d{1,2}'(inci|nci|üncü|ncı|uncu|ıncı)/,
	    ordinal : function (number) {
	        if (number === 0) {  // special case for zero
	            return number + '\'ıncı';
	        }
	        var a = number % 10,
	            b = number % 100 - a,
	            c = number >= 100 ? 100 : null;
	        return number + (suffixes[a] || suffixes[b] || suffixes[c]);
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return tr;

	})));


/***/ },
/* 489 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Talossan [tzl]
	//! author : Robin van der Vliet : https://github.com/robin0van0der0v
	//! author : Iustì Canun

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	// After the year there should be a slash and the amount of years since December 26, 1979 in Roman numerals.
	// This is currently too difficult (maybe even impossible) to add.
	var tzl = moment.defineLocale('tzl', {
	    months : 'Januar_Fevraglh_Març_Avrïu_Mai_Gün_Julia_Guscht_Setemvar_Listopäts_Noemvar_Zecemvar'.split('_'),
	    monthsShort : 'Jan_Fev_Mar_Avr_Mai_Gün_Jul_Gus_Set_Lis_Noe_Zec'.split('_'),
	    weekdays : 'Súladi_Lúneçi_Maitzi_Márcuri_Xhúadi_Viénerçi_Sáturi'.split('_'),
	    weekdaysShort : 'Súl_Lún_Mai_Már_Xhú_Vié_Sát'.split('_'),
	    weekdaysMin : 'Sú_Lú_Ma_Má_Xh_Vi_Sá'.split('_'),
	    longDateFormat : {
	        LT : 'HH.mm',
	        LTS : 'HH.mm.ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D. MMMM [dallas] YYYY',
	        LLL : 'D. MMMM [dallas] YYYY HH.mm',
	        LLLL : 'dddd, [li] D. MMMM [dallas] YYYY HH.mm'
	    },
	    meridiemParse: /d\'o|d\'a/i,
	    isPM : function (input) {
	        return 'd\'o' === input.toLowerCase();
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours > 11) {
	            return isLower ? 'd\'o' : 'D\'O';
	        } else {
	            return isLower ? 'd\'a' : 'D\'A';
	        }
	    },
	    calendar : {
	        sameDay : '[oxhi à] LT',
	        nextDay : '[demà à] LT',
	        nextWeek : 'dddd [à] LT',
	        lastDay : '[ieiri à] LT',
	        lastWeek : '[sür el] dddd [lasteu à] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'osprei %s',
	        past : 'ja%s',
	        s : processRelativeTime,
	        m : processRelativeTime,
	        mm : processRelativeTime,
	        h : processRelativeTime,
	        hh : processRelativeTime,
	        d : processRelativeTime,
	        dd : processRelativeTime,
	        M : processRelativeTime,
	        MM : processRelativeTime,
	        y : processRelativeTime,
	        yy : processRelativeTime
	    },
	    ordinalParse: /\d{1,2}\./,
	    ordinal : '%d.',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	function processRelativeTime(number, withoutSuffix, key, isFuture) {
	    var format = {
	        's': ['viensas secunds', '\'iensas secunds'],
	        'm': ['\'n míut', '\'iens míut'],
	        'mm': [number + ' míuts', '' + number + ' míuts'],
	        'h': ['\'n þora', '\'iensa þora'],
	        'hh': [number + ' þoras', '' + number + ' þoras'],
	        'd': ['\'n ziua', '\'iensa ziua'],
	        'dd': [number + ' ziuas', '' + number + ' ziuas'],
	        'M': ['\'n mes', '\'iens mes'],
	        'MM': [number + ' mesen', '' + number + ' mesen'],
	        'y': ['\'n ar', '\'iens ar'],
	        'yy': [number + ' ars', '' + number + ' ars']
	    };
	    return isFuture ? format[key][0] : (withoutSuffix ? format[key][0] : format[key][1]);
	}

	return tzl;

	})));


/***/ },
/* 490 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Central Atlas Tamazight [tzm]
	//! author : Abdel Said : https://github.com/abdelsaid

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var tzm = moment.defineLocale('tzm', {
	    months : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
	    monthsShort : 'ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ'.split('_'),
	    weekdays : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
	    weekdaysShort : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
	    weekdaysMin : 'ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS: 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[ⴰⵙⴷⵅ ⴴ] LT',
	        nextDay: '[ⴰⵙⴽⴰ ⴴ] LT',
	        nextWeek: 'dddd [ⴴ] LT',
	        lastDay: '[ⴰⵚⴰⵏⵜ ⴴ] LT',
	        lastWeek: 'dddd [ⴴ] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s',
	        past : 'ⵢⴰⵏ %s',
	        s : 'ⵉⵎⵉⴽ',
	        m : 'ⵎⵉⵏⵓⴺ',
	        mm : '%d ⵎⵉⵏⵓⴺ',
	        h : 'ⵙⴰⵄⴰ',
	        hh : '%d ⵜⴰⵙⵙⴰⵄⵉⵏ',
	        d : 'ⴰⵙⵙ',
	        dd : '%d oⵙⵙⴰⵏ',
	        M : 'ⴰⵢoⵓⵔ',
	        MM : '%d ⵉⵢⵢⵉⵔⵏ',
	        y : 'ⴰⵙⴳⴰⵙ',
	        yy : '%d ⵉⵙⴳⴰⵙⵏ'
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return tzm;

	})));


/***/ },
/* 491 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Central Atlas Tamazight Latin [tzm-latn]
	//! author : Abdel Said : https://github.com/abdelsaid

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var tzmLatn = moment.defineLocale('tzm-latn', {
	    months : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
	    monthsShort : 'innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir'.split('_'),
	    weekdays : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
	    weekdaysShort : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
	    weekdaysMin : 'asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[asdkh g] LT',
	        nextDay: '[aska g] LT',
	        nextWeek: 'dddd [g] LT',
	        lastDay: '[assant g] LT',
	        lastWeek: 'dddd [g] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'dadkh s yan %s',
	        past : 'yan %s',
	        s : 'imik',
	        m : 'minuḍ',
	        mm : '%d minuḍ',
	        h : 'saɛa',
	        hh : '%d tassaɛin',
	        d : 'ass',
	        dd : '%d ossan',
	        M : 'ayowr',
	        MM : '%d iyyirn',
	        y : 'asgas',
	        yy : '%d isgasn'
	    },
	    week : {
	        dow : 6, // Saturday is the first day of the week.
	        doy : 12  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return tzmLatn;

	})));


/***/ },
/* 492 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Ukrainian [uk]
	//! author : zemlanin : https://github.com/zemlanin
	//! Author : Menelion Elensúle : https://github.com/Oire

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	function plural(word, num) {
	    var forms = word.split('_');
	    return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
	}
	function relativeTimeWithPlural(number, withoutSuffix, key) {
	    var format = {
	        'mm': withoutSuffix ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
	        'hh': withoutSuffix ? 'година_години_годин' : 'годину_години_годин',
	        'dd': 'день_дні_днів',
	        'MM': 'місяць_місяці_місяців',
	        'yy': 'рік_роки_років'
	    };
	    if (key === 'm') {
	        return withoutSuffix ? 'хвилина' : 'хвилину';
	    }
	    else if (key === 'h') {
	        return withoutSuffix ? 'година' : 'годину';
	    }
	    else {
	        return number + ' ' + plural(format[key], +number);
	    }
	}
	function weekdaysCaseReplace(m, format) {
	    var weekdays = {
	        'nominative': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
	        'accusative': 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
	        'genitive': 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_')
	    },
	    nounCase = (/(\[[ВвУу]\]) ?dddd/).test(format) ?
	        'accusative' :
	        ((/\[?(?:минулої|наступної)? ?\] ?dddd/).test(format) ?
	            'genitive' :
	            'nominative');
	    return weekdays[nounCase][m.day()];
	}
	function processHoursFunction(str) {
	    return function () {
	        return str + 'о' + (this.hours() === 11 ? 'б' : '') + '] LT';
	    };
	}

	var uk = moment.defineLocale('uk', {
	    months : {
	        'format': 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
	        'standalone': 'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_')
	    },
	    monthsShort : 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
	    weekdays : weekdaysCaseReplace,
	    weekdaysShort : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
	    weekdaysMin : 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD.MM.YYYY',
	        LL : 'D MMMM YYYY р.',
	        LLL : 'D MMMM YYYY р., HH:mm',
	        LLLL : 'dddd, D MMMM YYYY р., HH:mm'
	    },
	    calendar : {
	        sameDay: processHoursFunction('[Сьогодні '),
	        nextDay: processHoursFunction('[Завтра '),
	        lastDay: processHoursFunction('[Вчора '),
	        nextWeek: processHoursFunction('[У] dddd ['),
	        lastWeek: function () {
	            switch (this.day()) {
	                case 0:
	                case 3:
	                case 5:
	                case 6:
	                    return processHoursFunction('[Минулої] dddd [').call(this);
	                case 1:
	                case 2:
	                case 4:
	                    return processHoursFunction('[Минулого] dddd [').call(this);
	            }
	        },
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : 'за %s',
	        past : '%s тому',
	        s : 'декілька секунд',
	        m : relativeTimeWithPlural,
	        mm : relativeTimeWithPlural,
	        h : 'годину',
	        hh : relativeTimeWithPlural,
	        d : 'день',
	        dd : relativeTimeWithPlural,
	        M : 'місяць',
	        MM : relativeTimeWithPlural,
	        y : 'рік',
	        yy : relativeTimeWithPlural
	    },
	    // M. E.: those two are virtually unused but a user might want to implement them for his/her website for some reason
	    meridiemParse: /ночі|ранку|дня|вечора/,
	    isPM: function (input) {
	        return /^(дня|вечора)$/.test(input);
	    },
	    meridiem : function (hour, minute, isLower) {
	        if (hour < 4) {
	            return 'ночі';
	        } else if (hour < 12) {
	            return 'ранку';
	        } else if (hour < 17) {
	            return 'дня';
	        } else {
	            return 'вечора';
	        }
	    },
	    ordinalParse: /\d{1,2}-(й|го)/,
	    ordinal: function (number, period) {
	        switch (period) {
	            case 'M':
	            case 'd':
	            case 'DDD':
	            case 'w':
	            case 'W':
	                return number + '-й';
	            case 'D':
	                return number + '-го';
	            default:
	                return number;
	        }
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 1st is the first week of the year.
	    }
	});

	return uk;

	})));


/***/ },
/* 493 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Uzbek [uz]
	//! author : Sardor Muminov : https://github.com/muminoff

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var uz = moment.defineLocale('uz', {
	    months : 'январ_феврал_март_апрел_май_июн_июл_август_сентябр_октябр_ноябр_декабр'.split('_'),
	    monthsShort : 'янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек'.split('_'),
	    weekdays : 'Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба'.split('_'),
	    weekdaysShort : 'Якш_Душ_Сеш_Чор_Пай_Жум_Шан'.split('_'),
	    weekdaysMin : 'Як_Ду_Се_Чо_Па_Жу_Ша'.split('_'),
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'D MMMM YYYY, dddd HH:mm'
	    },
	    calendar : {
	        sameDay : '[Бугун соат] LT [да]',
	        nextDay : '[Эртага] LT [да]',
	        nextWeek : 'dddd [куни соат] LT [да]',
	        lastDay : '[Кеча соат] LT [да]',
	        lastWeek : '[Утган] dddd [куни соат] LT [да]',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'Якин %s ичида',
	        past : 'Бир неча %s олдин',
	        s : 'фурсат',
	        m : 'бир дакика',
	        mm : '%d дакика',
	        h : 'бир соат',
	        hh : '%d соат',
	        d : 'бир кун',
	        dd : '%d кун',
	        M : 'бир ой',
	        MM : '%d ой',
	        y : 'бир йил',
	        yy : '%d йил'
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 7  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return uz;

	})));


/***/ },
/* 494 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Vietnamese [vi]
	//! author : Bang Nguyen : https://github.com/bangnk

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var vi = moment.defineLocale('vi', {
	    months : 'tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12'.split('_'),
	    monthsShort : 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy'.split('_'),
	    weekdaysShort : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
	    weekdaysMin : 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
	    weekdaysParseExact : true,
	    meridiemParse: /sa|ch/i,
	    isPM : function (input) {
	        return /^ch$/i.test(input);
	    },
	    meridiem : function (hours, minutes, isLower) {
	        if (hours < 12) {
	            return isLower ? 'sa' : 'SA';
	        } else {
	            return isLower ? 'ch' : 'CH';
	        }
	    },
	    longDateFormat : {
	        LT : 'HH:mm',
	        LTS : 'HH:mm:ss',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM [năm] YYYY',
	        LLL : 'D MMMM [năm] YYYY HH:mm',
	        LLLL : 'dddd, D MMMM [năm] YYYY HH:mm',
	        l : 'DD/M/YYYY',
	        ll : 'D MMM YYYY',
	        lll : 'D MMM YYYY HH:mm',
	        llll : 'ddd, D MMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay: '[Hôm nay lúc] LT',
	        nextDay: '[Ngày mai lúc] LT',
	        nextWeek: 'dddd [tuần tới lúc] LT',
	        lastDay: '[Hôm qua lúc] LT',
	        lastWeek: 'dddd [tuần rồi lúc] LT',
	        sameElse: 'L'
	    },
	    relativeTime : {
	        future : '%s tới',
	        past : '%s trước',
	        s : 'vài giây',
	        m : 'một phút',
	        mm : '%d phút',
	        h : 'một giờ',
	        hh : '%d giờ',
	        d : 'một ngày',
	        dd : '%d ngày',
	        M : 'một tháng',
	        MM : '%d tháng',
	        y : 'một năm',
	        yy : '%d năm'
	    },
	    ordinalParse: /\d{1,2}/,
	    ordinal : function (number) {
	        return number;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return vi;

	})));


/***/ },
/* 495 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Pseudo [x-pseudo]
	//! author : Andrew Hood : https://github.com/andrewhood125

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var xPseudo = moment.defineLocale('x-pseudo', {
	    months : 'J~áñúá~rý_F~ébrú~árý_~Márc~h_Áp~ríl_~Máý_~Júñé~_Júl~ý_Áú~gúst~_Sép~témb~ér_Ó~ctób~ér_Ñ~óvém~bér_~Décé~mbér'.split('_'),
	    monthsShort : 'J~áñ_~Féb_~Már_~Ápr_~Máý_~Júñ_~Júl_~Áúg_~Sép_~Óct_~Ñóv_~Déc'.split('_'),
	    monthsParseExact : true,
	    weekdays : 'S~úñdá~ý_Mó~ñdáý~_Túé~sdáý~_Wéd~ñésd~áý_T~húrs~dáý_~Fríd~áý_S~átúr~dáý'.split('_'),
	    weekdaysShort : 'S~úñ_~Móñ_~Túé_~Wéd_~Thú_~Frí_~Sát'.split('_'),
	    weekdaysMin : 'S~ú_Mó~_Tú_~Wé_T~h_Fr~_Sá'.split('_'),
	    weekdaysParseExact : true,
	    longDateFormat : {
	        LT : 'HH:mm',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY HH:mm',
	        LLLL : 'dddd, D MMMM YYYY HH:mm'
	    },
	    calendar : {
	        sameDay : '[T~ódá~ý át] LT',
	        nextDay : '[T~ómó~rró~w át] LT',
	        nextWeek : 'dddd [át] LT',
	        lastDay : '[Ý~ést~érdá~ý át] LT',
	        lastWeek : '[L~ást] dddd [át] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'í~ñ %s',
	        past : '%s á~gó',
	        s : 'á ~féw ~sécó~ñds',
	        m : 'á ~míñ~úté',
	        mm : '%d m~íñú~tés',
	        h : 'á~ñ hó~úr',
	        hh : '%d h~óúrs',
	        d : 'á ~dáý',
	        dd : '%d d~áýs',
	        M : 'á ~móñ~th',
	        MM : '%d m~óñt~hs',
	        y : 'á ~ýéár',
	        yy : '%d ý~éárs'
	    },
	    ordinalParse: /\d{1,2}(th|st|nd|rd)/,
	    ordinal : function (number) {
	        var b = number % 10,
	            output = (~~(number % 100 / 10) === 1) ? 'th' :
	            (b === 1) ? 'st' :
	            (b === 2) ? 'nd' :
	            (b === 3) ? 'rd' : 'th';
	        return number + output;
	    },
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return xPseudo;

	})));


/***/ },
/* 496 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Yoruba Nigeria [yo]
	//! author : Atolagbe Abisoye : https://github.com/andela-batolagbe

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var yo = moment.defineLocale('yo', {
	    months : 'Sẹ́rẹ́_Èrèlè_Ẹrẹ̀nà_Ìgbé_Èbibi_Òkùdu_Agẹmo_Ògún_Owewe_Ọ̀wàrà_Bélú_Ọ̀pẹ̀̀'.split('_'),
	    monthsShort : 'Sẹ́r_Èrl_Ẹrn_Ìgb_Èbi_Òkù_Agẹ_Ògú_Owe_Ọ̀wà_Bél_Ọ̀pẹ̀̀'.split('_'),
	    weekdays : 'Àìkú_Ajé_Ìsẹ́gun_Ọjọ́rú_Ọjọ́bọ_Ẹtì_Àbámẹ́ta'.split('_'),
	    weekdaysShort : 'Àìk_Ajé_Ìsẹ́_Ọjr_Ọjb_Ẹtì_Àbá'.split('_'),
	    weekdaysMin : 'Àì_Aj_Ìs_Ọr_Ọb_Ẹt_Àb'.split('_'),
	    longDateFormat : {
	        LT : 'h:mm A',
	        LTS : 'h:mm:ss A',
	        L : 'DD/MM/YYYY',
	        LL : 'D MMMM YYYY',
	        LLL : 'D MMMM YYYY h:mm A',
	        LLLL : 'dddd, D MMMM YYYY h:mm A'
	    },
	    calendar : {
	        sameDay : '[Ònì ni] LT',
	        nextDay : '[Ọ̀la ni] LT',
	        nextWeek : 'dddd [Ọsẹ̀ tón\'bọ] [ni] LT',
	        lastDay : '[Àna ni] LT',
	        lastWeek : 'dddd [Ọsẹ̀ tólọ́] [ni] LT',
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : 'ní %s',
	        past : '%s kọjá',
	        s : 'ìsẹjú aayá die',
	        m : 'ìsẹjú kan',
	        mm : 'ìsẹjú %d',
	        h : 'wákati kan',
	        hh : 'wákati %d',
	        d : 'ọjọ́ kan',
	        dd : 'ọjọ́ %d',
	        M : 'osù kan',
	        MM : 'osù %d',
	        y : 'ọdún kan',
	        yy : 'ọdún %d'
	    },
	    ordinalParse : /ọjọ́\s\d{1,2}/,
	    ordinal : 'ọjọ́ %d',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4 // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return yo;

	})));


/***/ },
/* 497 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chinese (China) [zh-cn]
	//! author : suupic : https://github.com/suupic
	//! author : Zeno Zeng : https://github.com/zenozeng

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var zhCn = moment.defineLocale('zh-cn', {
	    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
	    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
	    weekdaysShort : '周日_周一_周二_周三_周四_周五_周六'.split('_'),
	    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
	    longDateFormat : {
	        LT : 'Ah点mm分',
	        LTS : 'Ah点m分s秒',
	        L : 'YYYY-MM-DD',
	        LL : 'YYYY年MMMD日',
	        LLL : 'YYYY年MMMD日Ah点mm分',
	        LLLL : 'YYYY年MMMD日ddddAh点mm分',
	        l : 'YYYY-MM-DD',
	        ll : 'YYYY年MMMD日',
	        lll : 'YYYY年MMMD日Ah点mm分',
	        llll : 'YYYY年MMMD日ddddAh点mm分'
	    },
	    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
	    meridiemHour: function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '凌晨' || meridiem === '早上' ||
	                meridiem === '上午') {
	            return hour;
	        } else if (meridiem === '下午' || meridiem === '晚上') {
	            return hour + 12;
	        } else {
	            // '中午'
	            return hour >= 11 ? hour : hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        var hm = hour * 100 + minute;
	        if (hm < 600) {
	            return '凌晨';
	        } else if (hm < 900) {
	            return '早上';
	        } else if (hm < 1130) {
	            return '上午';
	        } else if (hm < 1230) {
	            return '中午';
	        } else if (hm < 1800) {
	            return '下午';
	        } else {
	            return '晚上';
	        }
	    },
	    calendar : {
	        sameDay : function () {
	            return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
	        },
	        nextDay : function () {
	            return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
	        },
	        lastDay : function () {
	            return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
	        },
	        nextWeek : function () {
	            var startOfWeek, prefix;
	            startOfWeek = moment().startOf('week');
	            prefix = this.diff(startOfWeek, 'days') >= 7 ? '[下]' : '[本]';
	            return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
	        },
	        lastWeek : function () {
	            var startOfWeek, prefix;
	            startOfWeek = moment().startOf('week');
	            prefix = this.unix() < startOfWeek.unix()  ? '[上]' : '[本]';
	            return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
	        },
	        sameElse : 'LL'
	    },
	    ordinalParse: /\d{1,2}(日|月|周)/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd':
	            case 'D':
	            case 'DDD':
	                return number + '日';
	            case 'M':
	                return number + '月';
	            case 'w':
	            case 'W':
	                return number + '周';
	            default:
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s内',
	        past : '%s前',
	        s : '几秒',
	        m : '1 分钟',
	        mm : '%d 分钟',
	        h : '1 小时',
	        hh : '%d 小时',
	        d : '1 天',
	        dd : '%d 天',
	        M : '1 个月',
	        MM : '%d 个月',
	        y : '1 年',
	        yy : '%d 年'
	    },
	    week : {
	        // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	return zhCn;

	})));


/***/ },
/* 498 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chinese (Hong Kong) [zh-hk]
	//! author : Ben : https://github.com/ben-lin
	//! author : Chris Lam : https://github.com/hehachris
	//! author : Konstantin : https://github.com/skfd

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var zhHk = moment.defineLocale('zh-hk', {
	    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
	    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
	    weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
	    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
	    longDateFormat : {
	        LT : 'Ah點mm分',
	        LTS : 'Ah點m分s秒',
	        L : 'YYYY年MMMD日',
	        LL : 'YYYY年MMMD日',
	        LLL : 'YYYY年MMMD日Ah點mm分',
	        LLLL : 'YYYY年MMMD日ddddAh點mm分',
	        l : 'YYYY年MMMD日',
	        ll : 'YYYY年MMMD日',
	        lll : 'YYYY年MMMD日Ah點mm分',
	        llll : 'YYYY年MMMD日ddddAh點mm分'
	    },
	    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
	            return hour;
	        } else if (meridiem === '中午') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === '下午' || meridiem === '晚上') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        var hm = hour * 100 + minute;
	        if (hm < 600) {
	            return '凌晨';
	        } else if (hm < 900) {
	            return '早上';
	        } else if (hm < 1130) {
	            return '上午';
	        } else if (hm < 1230) {
	            return '中午';
	        } else if (hm < 1800) {
	            return '下午';
	        } else {
	            return '晚上';
	        }
	    },
	    calendar : {
	        sameDay : '[今天]LT',
	        nextDay : '[明天]LT',
	        nextWeek : '[下]ddddLT',
	        lastDay : '[昨天]LT',
	        lastWeek : '[上]ddddLT',
	        sameElse : 'L'
	    },
	    ordinalParse: /\d{1,2}(日|月|週)/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd' :
	            case 'D' :
	            case 'DDD' :
	                return number + '日';
	            case 'M' :
	                return number + '月';
	            case 'w' :
	            case 'W' :
	                return number + '週';
	            default :
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s內',
	        past : '%s前',
	        s : '幾秒',
	        m : '1 分鐘',
	        mm : '%d 分鐘',
	        h : '1 小時',
	        hh : '%d 小時',
	        d : '1 天',
	        dd : '%d 天',
	        M : '1 個月',
	        MM : '%d 個月',
	        y : '1 年',
	        yy : '%d 年'
	    }
	});

	return zhHk;

	})));


/***/ },
/* 499 */
/***/ function(module, exports, __webpack_require__) {

	//! moment.js locale configuration
	//! locale : Chinese (Taiwan) [zh-tw]
	//! author : Ben : https://github.com/ben-lin
	//! author : Chris Lam : https://github.com/hehachris

	;(function (global, factory) {
	    true ? factory(__webpack_require__(389)) :
	   typeof define === 'function' && define.amd ? define(['../moment'], factory) :
	   factory(global.moment)
	}(this, (function (moment) { 'use strict';


	var zhTw = moment.defineLocale('zh-tw', {
	    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
	    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
	    weekdays : '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
	    weekdaysShort : '週日_週一_週二_週三_週四_週五_週六'.split('_'),
	    weekdaysMin : '日_一_二_三_四_五_六'.split('_'),
	    longDateFormat : {
	        LT : 'Ah點mm分',
	        LTS : 'Ah點m分s秒',
	        L : 'YYYY年MMMD日',
	        LL : 'YYYY年MMMD日',
	        LLL : 'YYYY年MMMD日Ah點mm分',
	        LLLL : 'YYYY年MMMD日ddddAh點mm分',
	        l : 'YYYY年MMMD日',
	        ll : 'YYYY年MMMD日',
	        lll : 'YYYY年MMMD日Ah點mm分',
	        llll : 'YYYY年MMMD日ddddAh點mm分'
	    },
	    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
	    meridiemHour : function (hour, meridiem) {
	        if (hour === 12) {
	            hour = 0;
	        }
	        if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
	            return hour;
	        } else if (meridiem === '中午') {
	            return hour >= 11 ? hour : hour + 12;
	        } else if (meridiem === '下午' || meridiem === '晚上') {
	            return hour + 12;
	        }
	    },
	    meridiem : function (hour, minute, isLower) {
	        var hm = hour * 100 + minute;
	        if (hm < 600) {
	            return '凌晨';
	        } else if (hm < 900) {
	            return '早上';
	        } else if (hm < 1130) {
	            return '上午';
	        } else if (hm < 1230) {
	            return '中午';
	        } else if (hm < 1800) {
	            return '下午';
	        } else {
	            return '晚上';
	        }
	    },
	    calendar : {
	        sameDay : '[今天]LT',
	        nextDay : '[明天]LT',
	        nextWeek : '[下]ddddLT',
	        lastDay : '[昨天]LT',
	        lastWeek : '[上]ddddLT',
	        sameElse : 'L'
	    },
	    ordinalParse: /\d{1,2}(日|月|週)/,
	    ordinal : function (number, period) {
	        switch (period) {
	            case 'd' :
	            case 'D' :
	            case 'DDD' :
	                return number + '日';
	            case 'M' :
	                return number + '月';
	            case 'w' :
	            case 'W' :
	                return number + '週';
	            default :
	                return number;
	        }
	    },
	    relativeTime : {
	        future : '%s內',
	        past : '%s前',
	        s : '幾秒',
	        m : '1 分鐘',
	        mm : '%d 分鐘',
	        h : '1 小時',
	        hh : '%d 小時',
	        d : '1 天',
	        dd : '%d 天',
	        M : '1 個月',
	        MM : '%d 個月',
	        y : '1 年',
	        yy : '%d 年'
	    }
	});

	return zhTw;

	})));


/***/ },
/* 500 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(501);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(503)(content, {});
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
/* 501 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(502)();
	// imports


	// module
	exports.push([module.id, ".ci-datetime-picker {\n  border-radius: 3px;\n}\n", ""]);

	// exports


/***/ },
/* 502 */
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
/* 503 */
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
/* 504 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(505);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(503)(content, {});
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
/* 505 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(502)();
	// imports


	// module
	exports.push([module.id, "/*!\n * Datepicker for Bootstrap v1.7.0-dev (https://github.com/uxsolutions/bootstrap-datepicker)\n *\n * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)\n */\n\n.datepicker {\n  padding: 4px;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n  direction: ltr;\n}\n.datepicker-inline {\n  width: 220px;\n}\n.datepicker.datepicker-rtl {\n  direction: rtl;\n}\n.datepicker.datepicker-rtl.dropdown-menu {\n  left: auto;\n}\n.datepicker.datepicker-rtl table tr td span {\n  float: right;\n}\n.datepicker-dropdown {\n  top: 0;\n  left: 0;\n}\n.datepicker-dropdown:before {\n  content: '';\n  display: inline-block;\n  border-left: 7px solid transparent;\n  border-right: 7px solid transparent;\n  border-bottom: 7px solid #999999;\n  border-top: 0;\n  border-bottom-color: rgba(0, 0, 0, 0.2);\n  position: absolute;\n}\n.datepicker-dropdown:after {\n  content: '';\n  display: inline-block;\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  border-bottom: 6px solid #ffffff;\n  border-top: 0;\n  position: absolute;\n}\n.datepicker-dropdown.datepicker-orient-left:before {\n  left: 6px;\n}\n.datepicker-dropdown.datepicker-orient-left:after {\n  left: 7px;\n}\n.datepicker-dropdown.datepicker-orient-right:before {\n  right: 6px;\n}\n.datepicker-dropdown.datepicker-orient-right:after {\n  right: 7px;\n}\n.datepicker-dropdown.datepicker-orient-bottom:before {\n  top: -7px;\n}\n.datepicker-dropdown.datepicker-orient-bottom:after {\n  top: -6px;\n}\n.datepicker-dropdown.datepicker-orient-top:before {\n  bottom: -7px;\n  border-bottom: 0;\n  border-top: 7px solid #999999;\n}\n.datepicker-dropdown.datepicker-orient-top:after {\n  bottom: -6px;\n  border-bottom: 0;\n  border-top: 6px solid #ffffff;\n}\n.datepicker table {\n  margin: 0;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.datepicker td,\n.datepicker th {\n  text-align: center;\n  width: 20px;\n  height: 20px;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n  border: none;\n}\n.table-striped .datepicker table tr td,\n.table-striped .datepicker table tr th {\n  background-color: transparent;\n}\n.datepicker table tr td.day:hover,\n.datepicker table tr td.day.focused {\n  background: #eeeeee;\n  cursor: pointer;\n}\n.datepicker table tr td.old,\n.datepicker table tr td.new {\n  color: #999999;\n}\n.datepicker table tr td.disabled,\n.datepicker table tr td.disabled:hover {\n  background: none;\n  color: #999999;\n  cursor: default;\n}\n.datepicker table tr td.highlighted {\n  background: #d9edf7;\n  border-radius: 0;\n}\n.datepicker table tr td.today,\n.datepicker table tr td.today:hover,\n.datepicker table tr td.today.disabled,\n.datepicker table tr td.today.disabled:hover {\n  background-color: #fde19a;\n  background-image: -moz-linear-gradient(to bottom, #fdd49a, #fdf59a);\n  background-image: -ms-linear-gradient(to bottom, #fdd49a, #fdf59a);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#fdd49a), to(#fdf59a));\n  background-image: -webkit-linear-gradient(to bottom, #fdd49a, #fdf59a);\n  background-image: -o-linear-gradient(to bottom, #fdd49a, #fdf59a);\n  background-image: linear-gradient(to bottom, #fdd49a, #fdf59a);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fdd49a', endColorstr='#fdf59a', GradientType=0);\n  border-color: #fdf59a #fdf59a #fbed50;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #000;\n}\n.datepicker table tr td.today:hover,\n.datepicker table tr td.today:hover:hover,\n.datepicker table tr td.today.disabled:hover,\n.datepicker table tr td.today.disabled:hover:hover,\n.datepicker table tr td.today:active,\n.datepicker table tr td.today:hover:active,\n.datepicker table tr td.today.disabled:active,\n.datepicker table tr td.today.disabled:hover:active,\n.datepicker table tr td.today.active,\n.datepicker table tr td.today:hover.active,\n.datepicker table tr td.today.disabled.active,\n.datepicker table tr td.today.disabled:hover.active,\n.datepicker table tr td.today.disabled,\n.datepicker table tr td.today:hover.disabled,\n.datepicker table tr td.today.disabled.disabled,\n.datepicker table tr td.today.disabled:hover.disabled,\n.datepicker table tr td.today[disabled],\n.datepicker table tr td.today:hover[disabled],\n.datepicker table tr td.today.disabled[disabled],\n.datepicker table tr td.today.disabled:hover[disabled] {\n  background-color: #fdf59a;\n}\n.datepicker table tr td.today:active,\n.datepicker table tr td.today:hover:active,\n.datepicker table tr td.today.disabled:active,\n.datepicker table tr td.today.disabled:hover:active,\n.datepicker table tr td.today.active,\n.datepicker table tr td.today:hover.active,\n.datepicker table tr td.today.disabled.active,\n.datepicker table tr td.today.disabled:hover.active {\n  background-color: #fbf069 \\9;\n}\n.datepicker table tr td.today:hover:hover {\n  color: #000;\n}\n.datepicker table tr td.today.active:hover {\n  color: #fff;\n}\n.datepicker table tr td.range,\n.datepicker table tr td.range:hover,\n.datepicker table tr td.range.disabled,\n.datepicker table tr td.range.disabled:hover {\n  background: #eeeeee;\n  -webkit-border-radius: 0;\n  -moz-border-radius: 0;\n  border-radius: 0;\n}\n.datepicker table tr td.range.today,\n.datepicker table tr td.range.today:hover,\n.datepicker table tr td.range.today.disabled,\n.datepicker table tr td.range.today.disabled:hover {\n  background-color: #f3d17a;\n  background-image: -moz-linear-gradient(to bottom, #f3c17a, #f3e97a);\n  background-image: -ms-linear-gradient(to bottom, #f3c17a, #f3e97a);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#f3c17a), to(#f3e97a));\n  background-image: -webkit-linear-gradient(to bottom, #f3c17a, #f3e97a);\n  background-image: -o-linear-gradient(to bottom, #f3c17a, #f3e97a);\n  background-image: linear-gradient(to bottom, #f3c17a, #f3e97a);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f3c17a', endColorstr='#f3e97a', GradientType=0);\n  border-color: #f3e97a #f3e97a #edde34;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  -webkit-border-radius: 0;\n  -moz-border-radius: 0;\n  border-radius: 0;\n}\n.datepicker table tr td.range.today:hover,\n.datepicker table tr td.range.today:hover:hover,\n.datepicker table tr td.range.today.disabled:hover,\n.datepicker table tr td.range.today.disabled:hover:hover,\n.datepicker table tr td.range.today:active,\n.datepicker table tr td.range.today:hover:active,\n.datepicker table tr td.range.today.disabled:active,\n.datepicker table tr td.range.today.disabled:hover:active,\n.datepicker table tr td.range.today.active,\n.datepicker table tr td.range.today:hover.active,\n.datepicker table tr td.range.today.disabled.active,\n.datepicker table tr td.range.today.disabled:hover.active,\n.datepicker table tr td.range.today.disabled,\n.datepicker table tr td.range.today:hover.disabled,\n.datepicker table tr td.range.today.disabled.disabled,\n.datepicker table tr td.range.today.disabled:hover.disabled,\n.datepicker table tr td.range.today[disabled],\n.datepicker table tr td.range.today:hover[disabled],\n.datepicker table tr td.range.today.disabled[disabled],\n.datepicker table tr td.range.today.disabled:hover[disabled] {\n  background-color: #f3e97a;\n}\n.datepicker table tr td.range.today:active,\n.datepicker table tr td.range.today:hover:active,\n.datepicker table tr td.range.today.disabled:active,\n.datepicker table tr td.range.today.disabled:hover:active,\n.datepicker table tr td.range.today.active,\n.datepicker table tr td.range.today:hover.active,\n.datepicker table tr td.range.today.disabled.active,\n.datepicker table tr td.range.today.disabled:hover.active {\n  background-color: #efe24b \\9;\n}\n.datepicker table tr td.selected,\n.datepicker table tr td.selected:hover,\n.datepicker table tr td.selected.disabled,\n.datepicker table tr td.selected.disabled:hover {\n  background-color: #9e9e9e;\n  background-image: -moz-linear-gradient(to bottom, #b3b3b3, #808080);\n  background-image: -ms-linear-gradient(to bottom, #b3b3b3, #808080);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#b3b3b3), to(#808080));\n  background-image: -webkit-linear-gradient(to bottom, #b3b3b3, #808080);\n  background-image: -o-linear-gradient(to bottom, #b3b3b3, #808080);\n  background-image: linear-gradient(to bottom, #b3b3b3, #808080);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#b3b3b3', endColorstr='#808080', GradientType=0);\n  border-color: #808080 #808080 #595959;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #fff;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\n.datepicker table tr td.selected:hover,\n.datepicker table tr td.selected:hover:hover,\n.datepicker table tr td.selected.disabled:hover,\n.datepicker table tr td.selected.disabled:hover:hover,\n.datepicker table tr td.selected:active,\n.datepicker table tr td.selected:hover:active,\n.datepicker table tr td.selected.disabled:active,\n.datepicker table tr td.selected.disabled:hover:active,\n.datepicker table tr td.selected.active,\n.datepicker table tr td.selected:hover.active,\n.datepicker table tr td.selected.disabled.active,\n.datepicker table tr td.selected.disabled:hover.active,\n.datepicker table tr td.selected.disabled,\n.datepicker table tr td.selected:hover.disabled,\n.datepicker table tr td.selected.disabled.disabled,\n.datepicker table tr td.selected.disabled:hover.disabled,\n.datepicker table tr td.selected[disabled],\n.datepicker table tr td.selected:hover[disabled],\n.datepicker table tr td.selected.disabled[disabled],\n.datepicker table tr td.selected.disabled:hover[disabled] {\n  background-color: #808080;\n}\n.datepicker table tr td.selected:active,\n.datepicker table tr td.selected:hover:active,\n.datepicker table tr td.selected.disabled:active,\n.datepicker table tr td.selected.disabled:hover:active,\n.datepicker table tr td.selected.active,\n.datepicker table tr td.selected:hover.active,\n.datepicker table tr td.selected.disabled.active,\n.datepicker table tr td.selected.disabled:hover.active {\n  background-color: #666666 \\9;\n}\n.datepicker table tr td.active,\n.datepicker table tr td.active:hover,\n.datepicker table tr td.active.disabled,\n.datepicker table tr td.active.disabled:hover {\n  background-color: #006dcc;\n  background-image: -moz-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -ms-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#0088cc), to(#0044cc));\n  background-image: -webkit-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -o-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: linear-gradient(to bottom, #0088cc, #0044cc);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0088cc', endColorstr='#0044cc', GradientType=0);\n  border-color: #0044cc #0044cc #002a80;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #fff;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\n.datepicker table tr td.active:hover,\n.datepicker table tr td.active:hover:hover,\n.datepicker table tr td.active.disabled:hover,\n.datepicker table tr td.active.disabled:hover:hover,\n.datepicker table tr td.active:active,\n.datepicker table tr td.active:hover:active,\n.datepicker table tr td.active.disabled:active,\n.datepicker table tr td.active.disabled:hover:active,\n.datepicker table tr td.active.active,\n.datepicker table tr td.active:hover.active,\n.datepicker table tr td.active.disabled.active,\n.datepicker table tr td.active.disabled:hover.active,\n.datepicker table tr td.active.disabled,\n.datepicker table tr td.active:hover.disabled,\n.datepicker table tr td.active.disabled.disabled,\n.datepicker table tr td.active.disabled:hover.disabled,\n.datepicker table tr td.active[disabled],\n.datepicker table tr td.active:hover[disabled],\n.datepicker table tr td.active.disabled[disabled],\n.datepicker table tr td.active.disabled:hover[disabled] {\n  background-color: #0044cc;\n}\n.datepicker table tr td.active:active,\n.datepicker table tr td.active:hover:active,\n.datepicker table tr td.active.disabled:active,\n.datepicker table tr td.active.disabled:hover:active,\n.datepicker table tr td.active.active,\n.datepicker table tr td.active:hover.active,\n.datepicker table tr td.active.disabled.active,\n.datepicker table tr td.active.disabled:hover.active {\n  background-color: #003399 \\9;\n}\n.datepicker table tr td span {\n  display: block;\n  width: 23%;\n  height: 54px;\n  line-height: 54px;\n  float: left;\n  margin: 1%;\n  cursor: pointer;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n}\n.datepicker table tr td span:hover,\n.datepicker table tr td span.focused {\n  background: #eeeeee;\n}\n.datepicker table tr td span.disabled,\n.datepicker table tr td span.disabled:hover {\n  background: none;\n  color: #999999;\n  cursor: default;\n}\n.datepicker table tr td span.active,\n.datepicker table tr td span.active:hover,\n.datepicker table tr td span.active.disabled,\n.datepicker table tr td span.active.disabled:hover {\n  background-color: #006dcc;\n  background-image: -moz-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -ms-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#0088cc), to(#0044cc));\n  background-image: -webkit-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: -o-linear-gradient(to bottom, #0088cc, #0044cc);\n  background-image: linear-gradient(to bottom, #0088cc, #0044cc);\n  background-repeat: repeat-x;\n  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0088cc', endColorstr='#0044cc', GradientType=0);\n  border-color: #0044cc #0044cc #002a80;\n  border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.25);\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  color: #fff;\n  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);\n}\n.datepicker table tr td span.active:hover,\n.datepicker table tr td span.active:hover:hover,\n.datepicker table tr td span.active.disabled:hover,\n.datepicker table tr td span.active.disabled:hover:hover,\n.datepicker table tr td span.active:active,\n.datepicker table tr td span.active:hover:active,\n.datepicker table tr td span.active.disabled:active,\n.datepicker table tr td span.active.disabled:hover:active,\n.datepicker table tr td span.active.active,\n.datepicker table tr td span.active:hover.active,\n.datepicker table tr td span.active.disabled.active,\n.datepicker table tr td span.active.disabled:hover.active,\n.datepicker table tr td span.active.disabled,\n.datepicker table tr td span.active:hover.disabled,\n.datepicker table tr td span.active.disabled.disabled,\n.datepicker table tr td span.active.disabled:hover.disabled,\n.datepicker table tr td span.active[disabled],\n.datepicker table tr td span.active:hover[disabled],\n.datepicker table tr td span.active.disabled[disabled],\n.datepicker table tr td span.active.disabled:hover[disabled] {\n  background-color: #0044cc;\n}\n.datepicker table tr td span.active:active,\n.datepicker table tr td span.active:hover:active,\n.datepicker table tr td span.active.disabled:active,\n.datepicker table tr td span.active.disabled:hover:active,\n.datepicker table tr td span.active.active,\n.datepicker table tr td span.active:hover.active,\n.datepicker table tr td span.active.disabled.active,\n.datepicker table tr td span.active.disabled:hover.active {\n  background-color: #003399 \\9;\n}\n.datepicker table tr td span.old,\n.datepicker table tr td span.new {\n  color: #999999;\n}\n.datepicker .datepicker-switch {\n  width: 145px;\n}\n.datepicker .datepicker-switch,\n.datepicker .prev,\n.datepicker .next,\n.datepicker tfoot tr th {\n  cursor: pointer;\n}\n.datepicker .datepicker-switch:hover,\n.datepicker .prev:hover,\n.datepicker .next:hover,\n.datepicker tfoot tr th:hover {\n  background: #eeeeee;\n}\n.datepicker .prev.disabled,\n.datepicker .next.disabled {\n  visibility: hidden;\n}\n.datepicker .cw {\n  font-size: 10px;\n  width: 12px;\n  padding: 0 2px 0 5px;\n  vertical-align: middle;\n}\n.input-append.date .add-on,\n.input-prepend.date .add-on {\n  cursor: pointer;\n}\n.input-append.date .add-on i,\n.input-prepend.date .add-on i {\n  margin-top: 3px;\n}\n.input-daterange input {\n  text-align: center;\n}\n.input-daterange input:first-child {\n  -webkit-border-radius: 3px 0 0 3px;\n  -moz-border-radius: 3px 0 0 3px;\n  border-radius: 3px 0 0 3px;\n}\n.input-daterange input:last-child {\n  -webkit-border-radius: 0 3px 3px 0;\n  -moz-border-radius: 0 3px 3px 0;\n  border-radius: 0 3px 3px 0;\n}\n.input-daterange .add-on {\n  display: inline-block;\n  width: auto;\n  min-width: 16px;\n  height: 18px;\n  padding: 4px 5px;\n  font-weight: normal;\n  line-height: 18px;\n  text-align: center;\n  text-shadow: 0 1px 0 #ffffff;\n  vertical-align: middle;\n  background-color: #eeeeee;\n  border: 1px solid #ccc;\n  margin-left: -5px;\n  margin-right: -5px;\n}\n/*# sourceMappingURL=bootstrap-datepicker.css.map */", ""]);

	// exports


/***/ },
/* 506 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(507);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(503)(content, {});
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
/* 507 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(502)();
	// imports


	// module
	exports.push([module.id, ".ui-timepicker-wrapper {\n\toverflow-y: auto;\n\theight: 150px;\n\twidth: 6.5em;\n\tbackground: #fff;\n\tborder: 1px solid #ddd;\n\t-webkit-box-shadow:0 5px 10px rgba(0,0,0,0.2);\n\t-moz-box-shadow:0 5px 10px rgba(0,0,0,0.2);\n\tbox-shadow:0 5px 10px rgba(0,0,0,0.2);\n\toutline: none;\n\tz-index: 10001;\n\tmargin: 0;\n}\n\n.ui-timepicker-wrapper.ui-timepicker-with-duration {\n\twidth: 13em;\n}\n\n.ui-timepicker-wrapper.ui-timepicker-with-duration.ui-timepicker-step-30,\n.ui-timepicker-wrapper.ui-timepicker-with-duration.ui-timepicker-step-60 {\n\twidth: 11em;\n}\n\n.ui-timepicker-list {\n\tmargin: 0;\n\tpadding: 0;\n\tlist-style: none;\n}\n\n.ui-timepicker-duration {\n\tmargin-left: 5px; color: #888;\n}\n\n.ui-timepicker-list:hover .ui-timepicker-duration {\n\tcolor: #888;\n}\n\n.ui-timepicker-list li {\n\tpadding: 3px 0 3px 5px;\n\tcursor: pointer;\n\twhite-space: nowrap;\n\tcolor: #000;\n\tlist-style: none;\n\tmargin: 0;\n}\n\n.ui-timepicker-list:hover .ui-timepicker-selected {\n\tbackground: #fff; color: #000;\n}\n\nli.ui-timepicker-selected,\n.ui-timepicker-list li:hover,\n.ui-timepicker-list .ui-timepicker-selected:hover {\n\tbackground: #1980EC; color: #fff;\n}\n\nli.ui-timepicker-selected .ui-timepicker-duration,\n.ui-timepicker-list li:hover .ui-timepicker-duration {\n\tcolor: #ccc;\n}\n\n.ui-timepicker-list li.ui-timepicker-disabled,\n.ui-timepicker-list li.ui-timepicker-disabled:hover,\n.ui-timepicker-list li.ui-timepicker-selected.ui-timepicker-disabled {\n\tcolor: #888;\n\tcursor: default;\n}\n\n.ui-timepicker-list li.ui-timepicker-disabled:hover,\n.ui-timepicker-list li.ui-timepicker-selected.ui-timepicker-disabled {\n\tbackground: #f2f2f2;\n}\n", ""]);

	// exports


/***/ }
/******/ ]);