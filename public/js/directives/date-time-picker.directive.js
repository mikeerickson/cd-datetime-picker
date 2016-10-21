'use strict';

function dateTimePickerController() {
  console.log('dateTimePickerController');
}
function DateTimePickerDirective() {
  return {
    restrict: 'AE',
    require: '^ngModel',
    scope: {
      datetimeValue: '=ngModel'
    },
    link: DateTimePickerLinker,
    controller: dateTimePickerController,
    template: ''
              + '<div class="date-picker">'
              + '<input type="text" class="date-picker">'
              + '<input type="text" class="time-picker">'
              + '<span>{{ datetimeValue }}</span>'
              + '</div>'

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
