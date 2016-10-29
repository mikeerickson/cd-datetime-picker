'use strict';

// FIXME:10 Refactor so this uses browserify so we can make sure it will work with CI
// TODO:30 Also test with webpack
// FIXME:20 This is a FIXME
// BUG: This is a bug
// REVIEW: This is a REVIEW
// NOTE: This is a note
// FEATURE: This is a feature

angular.module('cd-datetime-picker', [])
  .directive('datetimePicker', DateTimePickerDirective);

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
    template: ''
              + '<div class="cd-datetime-picker">'
              +   '<div ng-show={{$dateTimeCtrl.dpShow}} class="input-group cd-datetime-picker-date" style="width: 140px; float: left;">'
              +     '<input class="form-control date-picker" type="text" ng-model="$dateTimeCtrl.dateValue" ng-blur="$dateTimeCtrl.onDateBlur($event)" class="form-control date-picker">'
              +     '<span class="input-group-addon date-picker"><i class="glyphicon glyphicon-calendar"></i></span>'
              +   '</div>'

              +   '<div ng-show={{$dateTimeCtrl.tpShow}} class="input-group cd-datetime-picker-time" style="width: 140px; padding-left: 5px; padding-right: 10px;">'
              +     '<input type="text" class="form-control time-picker" ng-model="$dateTimeCtrl.timeValue" ng-blur="$dateTimeCtrl.onTimeBlur($event)">'
              +     '<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>'
              +   '</div>'
              + '</div>'
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
  let defaultTime = dateTimeUtils.getTime(scope.datetimeValue);

  // set control default date (supplyed by ng-model)
  $(this.dp).datepicker('setDate', defaultDate);

  // attach event listener triggered when date change occurs
  $(this.dp).datepicker().on('changeDate', (evt) => {
    scope.$broadcast('dp.dateChange', {dateValue: evt.target.value});
  });

}
