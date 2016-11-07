/*
* Dependencies:
* - jQuery Timepicker        -- http://jonthornton.github.io/jquery-timepicker/
* - Bootstrap DateTimePicker -- https://github.com/uxsolutions/bootstrap-datepicker
* - date.time.utils.js       -- /js/utils/date-time.utils.js
* - moment.js                -- http://momentjs.com/
* ================================================================================================
*/

angular.module('app',['cd-datetime-picker'])
  .controller('AppController', AppController)
  .directive('dateTimePicker', DateTimePickerDirective)
