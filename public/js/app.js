/*
* Dependencies:
* - jQuery Timepicker        -- http://jonthornton.github.io/jquery-timepicker/
* - Bootstrap DateTimePicker -- https://github.com/uxsolutions/bootstrap-datepicker
* ================================================================================================
*/

const app = angular.module('app',['cd-datetime-picker']);
  app.directive('timeFormatMask', TimeFormatMaskDirective);
  app.controller('AppController', AppController);
  app.directive('dateTimePicker', DateTimePickerDirective);
