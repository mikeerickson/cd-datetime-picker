/*
* Dependencies:
* - jQuery Timepicker        -- http://jonthornton.github.io/jquery-timepicker/
* - Bootstrap DateTimePicker -- https://github.com/uxsolutions/bootstrap-datepicker
* - date.time.utils.js       -- /js/utils/date-time.utils.js
* - moment.js                -- http://momentjs.com/
* ================================================================================================
*/

/*
 * any advantage to use this directive -- http://recras.github.io/angular-jquery-timepicker/
 */

angular.module('app',['ci-datetime-picker'])
  .controller('AppController', AppController);
