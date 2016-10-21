
AppController.$inject = ['$scope'];

function AppController($scope) {
  var vm = this;
  var dateTimeDisplayFormat = 'LLLL'; // eg Thursday, October 20, 2016 12:56 PM
  var pivotYear = 1950;

  var now = new Date();
  vm.timeValue = moment(now).format('h:mm A');
  vm.dateValue = moment(now).format('MM/DD/YYYY');
  // YYYY-MM-DD hh:mm:ss
  vm.dateTimeValue = moment(now).format(dateTimeDisplayFormat);

  // events
  $scope.$on('updateDateTime', function (event, data) {
    vm.dateValue = data.date;
    vm.formatDateTimeDisplay();
  });

  // functions
  vm.updateTime = function (timeVal) {
    vm.dateValue = '1966-10-15';
    vm.timeValue = '14:30';
    vm.formatDateTimeDisplay();
  };

  vm.isValidDate = function (value) {}

  vm.isValidTime = function (value) {
    var timeValue = value.toUpperCase().replace(' ',':');
    var ampm = 'AM';
    var isValidTime = true;

    if (typeof value !== 'undefined') {
      var parts = timeValue.split(':');
      if (parts.length === 0) {
        var timeValue24 = parseInt(timeValue);
        if ((timeValue > 0) && (timeValue <= 2359)) {
          isValidTime = true;
        }
      }

      var hours = parseInt(parts[0]);
      var mins = parseInt(parts[1]);
      ampm = parts.length > 1 ? parts[2] : ampm;

      if (hours > 12) {
        hours -= hours;
        ampm = 'PM'
      }
      if ((hours > 12) || (mins > 59)) {
        isValidTime = false;
      }
    }

    console.log('Valid Time', isValidTime);
    return isValidTime;
  }

  vm.formatDateTimeDisplay = function () {
    var dt = moment(vm.dateValue + ' ' + vm.timeValue);
    var isValid = (dt.isValid() && (parseInt(dt.format('YYYY')) >= pivotYear));
    if (isValid) {
      vm.timeValue = dt.format('h:mm A');
      vm.dateValue = dt.format('MM/DD/YYYY');
      vm.dateTimeValue = dt.format(dateTimeDisplayFormat);
    }
    else {
      return true;
    }
  }
}
