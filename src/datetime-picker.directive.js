'use strict';

import template      from './datetime-picker.template.html';
import DateTimeUtils from './utils/DateTimeUtils';
import Sugar         from 'sugar-date';

import './datetime-picker.css';
import './lib/datepicker.css';
import './lib/timepicker.css';

let dateTimeUtils = new DateTimeUtils();

angular.module('cd-datetime-picker', [])
  .directive('cdDatetimePicker', DateTimePickerDirective);

/* @ngInject */
function DateTimePickerController($scope, $element, $attrs) {

  const $dateTimeCtrl = this;

  $dateTimeCtrl.dpShow = $scope.dpShow === undefined || $scope.dpShow;
  $dateTimeCtrl.tpShow = $scope.tpShow === undefined || $scope.tpShow;

  if ($scope.datetimeValue === '') {
    $scope.datetimeValue = new Date().toString();
  }
  $dateTimeCtrl.dateValue = dateTimeUtils.getDate($scope.datetimeValue);
  $dateTimeCtrl.timeValue = dateTimeUtils.getTime($scope.datetimeValue);

  $dateTimeCtrl.onDateBlur = (evt) => {
    let result = dateTimeUtils.convertHumanDate(evt.target.value);
    if (dateTimeUtils.isValidDate(result)) {
      $dateTimeCtrl.dateValue = dateTimeUtils.getDate(result);
    }
    else {
      $dateTimeCtrl.dateValue = evt.target.value;
    }
    $scope.datetimeValue = dateTimeUtils.formatDateTime($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
    $scope.$emit('dp.updateDateTime', {dateValue: $dateTimeCtrl.dateValue, timeValue: $dateTimeCtrl.timeValue});
  };

  $dateTimeCtrl.onDateKeyUp = (evt) => {
    // TODO: *** NOT WORKING AS OF YET ***
    //$dateTimeCtrl.onDateBlur(evt);
  };

  $dateTimeCtrl.onTimeBlur = (evt) => {
    $dateTimeCtrl.timeValue = evt.target.value;
    $scope.datetimeValue = dateTimeUtils.formatDateTime($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
    $scope.$emit('dp.updateDateTime', {dateValue: $dateTimeCtrl.dateValue, timeValue: $dateTimeCtrl.timeValue});
  };

  $scope.$on('dp.dateChange', (evt, value) => {
    $dateTimeCtrl.dateValue = value.dateValue;
    $scope.datetimeValue = dateTimeUtils.formatDateTime($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);

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
    forceParse: false,       // this is required to support human entry
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
  $(element).find('span.time-picker-icon')
    .on('click', () => {
      tp.timepicker('show');
    });

  // setup click handler if date-icon is clicked
  $(element).find('span.date-picker-icon')
    .on('click', () => {
      dp.datepicker('show');
    });

  let defaultDate = dateTimeUtils.getDate(scope.datetimeValue);
  let defaultTime = dateTimeUtils.getTime(scope.datetimeValue);

  // set control default date (supplyed by ng-model)
  dp.datepicker('setDate', defaultDate);
  tp.timepicker('setTime', defaultTime);

  // attach event listener triggered when date change occurs
  dp.datepicker().on('changeDate', (evt) => {
    let dateValue = evt.target.value;
    if (dateValue.length === 0) {
      dateValue = dateTimeUtils.getDate(scope.datetimeValue);
    }
    scope.$broadcast('dp.dateChange', {dateValue: dateValue});
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
