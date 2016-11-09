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
  this.tp = $(element).find('input.time-picker').timepicker(tpOpts);
  this.dp = $(element).find('input.date-picker').datepicker(dpOpts);

  let defaultDate = dateTimeUtils.getDate(scope.datetimeValue);
  let defaultTime = dateTimeUtils.getTime(scope.datetimeValue);  // this does not seem to be used anywhere

  // set control default date (supplyed by ng-model)
  $(this.dp).datepicker('setDate', defaultDate);

  // attach event listener triggered when date change occurs
  $(this.dp).datepicker().on('changeDate', (evt) => {
    scope.$broadcast('dp.dateChange', {dateValue: evt.target.value});
  });

}
