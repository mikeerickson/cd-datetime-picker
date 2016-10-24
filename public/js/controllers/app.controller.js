
AppController.$inject = ['$scope','$element','$attrs'];
function AppController($scope, $element, $attrs) {
  let vm = this;

  let dateTimeDisplayFormat = 'LLLL'; // eg Thursday, October 20, 2016 12:56 PM
  let pivotYear = 1950;

  // override default datePicker options
  vm.dpOpts = {
    autoclose: true, // true
    weekStart: 2  // 0
  };

  // override default timePicker options
  vm.tpOpts = {
    step: 5 // default 15
  };

  let now = new Date();
  vm.timeValue = moment(now).format('h:mm A');
  vm.dateValue = moment(now).format('MM/DD/YYYY');
  vm.dateTimeValue = moment(now).format(dateTimeDisplayFormat);

  // events
  $scope.$on('dp.updateDateTime', function (event, data) {
    vm.dateValue = data.dateValue;
    vm.timeValue = data.timeValue;
    vm.dateTimeValue = vm.formatDateTimeDisplay(vm.dateValue, vm.timeValue);
    console.log(vm.dateTimeValue);
  });

  // application functions
  vm.updateTime = function (timeVal) {
    vm.dateValue = '1966-10-15';
    vm.timeValue = '14:30';
    vm.formatDateTimeDisplay(vm.dateValue, vm.timeValue);
  };

  vm.formatDateTimeDisplay = function (dateValue, timeValue) {
    let dt = moment(dateValue + ' ' + timeValue);
    let isValid = (dt.isValid() && (parseInt(dt.format('YYYY')) >= pivotYear));
    if (isValid) {
      vm.timeValue = dt.format('h:mm A');
      vm.dateValue = dt.format('MM/DD/YYYY');
      vm.dateTimeValue = dt.format(dateTimeDisplayFormat);
      return vm.dateTimeValue;
    }
    else {
      return 'Invalid Date';
    }
  };

}
