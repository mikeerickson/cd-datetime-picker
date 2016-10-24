'use strict';

angular.module('cd-datetime-picker', [])
  .directive('datetimePicker', DateTimePickerDirective);

DateTimePickerController.$inject = ['$scope', '$element', '$attrs'];
function DateTimePickerController($scope, $element, $attrs) {
  var $dateTimeCtrl = this;
  var _DATETIMEVALUEFORMAT = 'LLLL';

  $dateTimeCtrl.dpShow = $scope.dpShow === undefined || $scope.dpShow;
  $dateTimeCtrl.tpShow = $scope.tpShow === undefined || $scope.tpShow;

  if ($scope.datetimeValue === '') {
    $scope.datetimeValue = new Date().toString();
  }
  $dateTimeCtrl.dateValue = dateTimeUtils.getDate($scope.datetimeValue);
  $dateTimeCtrl.timeValue = dateTimeUtils.getTime($scope.datetimeValue);

  $dateTimeCtrl.onDateBlur = (evt) => {
    $dateTimeCtrl.dateValue = e.target.value;
    var dt = new Date($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
    $scope.datetimeValue = moment(dt).format(_DATETIMEVALUEFORMAT);
  };

  $dateTimeCtrl.onTimeBlur = (evt) => {
    $dateTimeCtrl.timeValue = e.target.value;
    var dt = new Date($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
    $scope.datetimeValue = moment(dt).format(_DATETIMEVALUEFORMAT);
  };

  $scope.$on('db.dateChange', (e, value) => {
    $dateTimeCtrl.dateValue = value.dateValue;
    var dt = new Date($dateTimeCtrl.dateValue + ' ' + $dateTimeCtrl.timeValue);
    $scope.datetimeValue = moment(dt).format(_DATETIMEVALUEFORMAT);
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

  var dpDefaultOpts = {
    todayBtn: 'linked',
    autoclose: true,
    todayHighlight: true,
    weekStart: 0
  };

  var tpDefaultOpts = {
    'scrollDefault': 'now',
    'timeFormat': 'g:i A',
    'step': 15
  };

  // picker option defaults
  var dpOpts = angular.extend(dpDefaultOpts, scope.dpOptions);
  var tpOpts = angular.extend(tpDefaultOpts, scope.tpOptions);

  // setup date and time pickers
  this.tp = $(element).find('input.time-picker').timepicker(tpOpts);
  this.dp = $(element).find('input.date-picker').datepicker(dpOpts);

  var defaultDate = dateTimeUtils.getDate(scope.datetimeValue);
  var defaultTime = dateTimeUtils.getTime(scope.datetimeValue);

  $(this.dp).datepicker('setDate', defaultDate);

  // attach event listener triggered when date change occurs
  $(this.dp).datepicker().on('changeDate', (evt) => {
    scope.$broadcast('db.dateChange', {dateValue: e.target.value});
  });
}
