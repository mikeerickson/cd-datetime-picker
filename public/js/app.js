/*
* Uses
* jQuery Timepicker -- http://jonthornton.github.io/jquery-timepicker/
* Bootstrap DateTimePicker -- https://github.com/uxsolutions/bootstrap-datepicker
* ================================================================================================
* The version of datepicker used is not the same as installed version on current system
* Bootstrap 3 Datepicker -- http://eonasdan.github.io/bootstrap-datetimepicker/Options/#options
* - No `Today` button (only a lame icon, may override but cant find it)
* - No way to hide (disable) the associated time picker
 */


var app = angular.module('app',[]);
  app.directive('timeFormatMask', TimeFormatMaskDirective);
  app.controller('AppController', AppController);
  app.directive('dateTimePicker', DateTimePickerDirective);

  $('.date-picker').datepicker({
    todayBtn: 'linked',
    autoclose: true,
    todayHighlight: true,
  });

  $('.date-picker').datepicker().on('changeDate', function(e) {
    var $scope = angular.element(document.body).scope();
    $scope.$broadcast('updateDateTime', {date: e.target.value})
  });

  $('input.time-picker').timepicker({
    'scrollDefault': 'now',
    'timeFormat': 'g:i A',
    'step': 15
  });

  $('input.time-picker').on('blur', (evt) => {
    var timeValue = evt.target.value;
  });

  // $('input.time-picker').timepicker('setTime', dateTimeUtils.getTime(new Date()));
  $('span.time-picker').timepicker({ 'setTime': new Date() });
  $('span.time-picker').on('changeTime', (evt) => {
    var val = $(this).timepicker('getTime');
    // $('input.time-picker').val(dateTimeUtils.getTime(val));
  });
