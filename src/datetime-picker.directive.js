'use strict';

var dateTimeUtils = require('./utils/datetime.utils.js');
var template      = require('./datetime-picker.template.html');

require('./datetime-picker.css');
require('./lib/timepicker.css');
require('./lib/datepicker.css');

angular.module('ci-datetime-picker', [])
  .directive('ciDateTimePicker', DateTimePickerDirective);

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

  $dateTimeCtrl.onDateBlur = (evt) => {
    $dateTimeCtrl.dateValue = evt.target.value;
    let dt = new Date($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
    $scope.datetimeValue = moment(dt).format(_DATETIMEVALUEFORMAT);
    $scope.$emit('dp.updateDateTime', {dateValue: $dateTimeCtrl.dateValue, timeValue: $dateTimeCtrl.timeValue});
  };

  $dateTimeCtrl.onTimeBlur = (evt) => {
    $dateTimeCtrl.timeValue = evt.target.value;
    let dt = new Date($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
    $scope.datetimeValue = moment(dt).format(_DATETIMEVALUEFORMAT);
    $scope.$emit('dp.updateDateTime', {dateValue: $dateTimeCtrl.dateValue, timeValue: $dateTimeCtrl.timeValue});
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

  $scope.$on('destroy', function () {
    console.log('destroyed');
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
  let tp = $(element).find('input.time-picker');
  let dp = $(element).find('input.date-picker');
  tp.timepicker(tpOpts);
  dp.datepicker(dpOpts);

  // setup click handler if time-icon is clicked
  $(element).find('span.time-picker-icon')
    .on('click', function () {
      tp.timepicker('show');
    });

  // setup click handler if date-icon is clicked
  $(element).find('span.date-picker-icon')
    .on('click', function () {
      dp.datepicker('show');
    });

  let defaultDate = dateTimeUtils.getDate(scope.datetimeValue);
  let defaultTime = dateTimeUtils.getTime(scope.datetimeValue);  // this does not seem to be used anywhere

  // set control default date (supplyed by ng-model)
  dp.datepicker('setDate', defaultDate);

  // attach event listener triggered when date change occurs
  dp.datepicker().on('changeDate', (evt) => {
    scope.$broadcast('dp.dateChange', {dateValue: evt.target.value});
  });

  ngModel.$render = function () {

    var dateValue = dateTimeUtils.getDate(ngModel.$viewValue);
    var timeValue = dateTimeUtils.getTime(ngModel.$viewValue);

    scope.$dateTimeCtrl.timeValue = timeValue;
    scope.$dateTimeCtrl.dateValue = dateValue;

    dp.datepicker('setDate', dateValue);

  };

}
