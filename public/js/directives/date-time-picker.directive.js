'use strict';

DateTimePickerController.$inject = ['$scope']
function DateTimePickerController($scope) {
  var $dateTimeCtrl = this;
  // var $dateTimeCtrl.dateValue = '';

  $dateTimeCtrl.updateDateTime = function(e) {
    $scope.datetimeValue = '10/31/2016';
  };
}
function DateTimePickerDirective() {
  return {
    restrict: 'AE',
    require: '^ngModel',
    scope: {
      datetimeValue: '=ngModel'
    },
    link: DateTimePickerLinker,
    controller: DateTimePickerController,
    controllerAs: '$dateTimeCtrl',
    template: ''
              + '<div class="cd-datetime-picker">'
              +   '<div class="input-group" style="width: 140px; float: left;">'
              +     '<input type="text" ng-model="$dateTimeCtrl.dateValue" ng-blur="$dateTimeCtrl.updateDateTime(this)" class="form-control date-picker">'
              +     '<span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>'
              +   '</div>'

              +   '<div class="input-group" style="width: 140px; padding-left: 5px; padding-right: 10px;">'
              +     '<input type="text" class="form-control time-picker">'
              +     '<span class="input-group-addon"><i class="glyphicon glyphicon-time"></i></span>'
              +   '</div>'
              + '</div>'
              + '{{ datetimeValue }}'
  };
}

function DateTimePickerLinker(scope, element, attrs, ngModel) {

  var dpOpts = {
    todayBtn: 'linked',
    autoclose: true,
    todayHighlight: true
  };

  var tpOpts = {
    'scrollDefault': 'now',
    'timeFormat': 'g:i A',
    'step': 15
  };

  console.log('scope', scope);
  console.log('element', element);
  console.log('attrs', attrs);
  console.log('ngModel', ngModel);
  var tp = $(element).find('input.time-picker').timepicker(tpOpts).val('4:30 PM');
  var dp = $(element).find('input.date-picker').datepicker(dpOpts).val('10/15/1966');
}
