
AppController.$inject = ['$scope','$element','$attrs'];
function AppController($scope, $element, $attrs) {

  let vm = this;

  let _DATETIMEVALUEFORMAT = 'LLLL'; // eg Thursday, October 20, 2016 12:56 PM
  let pivotYear = 1950;

  // override default datePicker options
  vm.dpOpts = {
    autoclose: true, // true
  };

  // override default timePicker options
  vm.tpOpts = {
    step: 5 // default 15
  };

  vm.dateTime      = new Date();
  vm.timeValue     = moment(vm.dateTime).format('h:mm A');
  vm.dateValue     = moment(vm.dateTime).format('MM/DD/YYYY');
  vm.dateTimeValue = moment(vm.dateTime).format(_DATETIMEVALUEFORMAT);
  vm.displayDateTime = '';

  // events
  $scope.$on('dp.updateDateTime', function (event, data) {
    vm.dateValue = data.dateValue;
    vm.timeValue = data.timeValue;
    vm.dateTimeValue = vm.formatDateTimeDisplay(vm.dateValue, vm.timeValue);
  });

  // application functions
  vm.updateTime = function () {
    vm.dateValue = '1966-10-15';
    vm.timeValue = '14:30';
    vm.dateTimeValue = vm.formatDateTimeDisplay(vm.dateValue, vm.timeValue);
    vm.dateTime = new Date(vm.dateTimeValue);
  };

  vm.randomDateTime = function() {
    vm.dateTime = getRandomDate(new Date('01-01-70'), new Date());
    vm.dateTimeValue = moment(vm.dateTime).format(_DATETIMEVALUEFORMAT);
  }

  vm.formatDateTimeDisplay = function (dateValue, timeValue) {
    let dt = moment(new Date(dateValue + ' ' + timeValue));
    let isValid = (dt.isValid() && (parseInt(dt.format('YYYY')) >= pivotYear));
    if (isValid) {
      vm.timeValue = dt.format('h:mm A');
      vm.dateValue = dt.format('MM/DD/YYYY');
      vm.dateTimeValue = dt.format(_DATETIMEVALUEFORMAT);
      return vm.dateTimeValue;
    }
    else {
      return 'Invalid Date';
    }
  };

  function getRandomDate(from = new Date(), to = new Date()) {
    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
  }

}
