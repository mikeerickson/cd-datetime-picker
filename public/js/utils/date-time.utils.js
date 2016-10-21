
  var dateTimeUtils = {

    getTime: (datetime) => {
        var hours = parseInt(datetime.getHours());
        var mins = parseInt(datetime.getMinutes());
        var ampm = 'am';

        if (hours > 12) {
          hours -= 12;
          ampm = 'pm';
        }

        if (hours === 12) {
          ampm = 'pm';
        }

        if (hours === 0) {
          hours = 12;
        }

        if (hours > 24) {
          hours = 0;
          ampm = 'am';
        }

        return hours + ':' + dateTimeUtils.addZero(mins) + ampm;
    },

    addZero: (val) => {
      if (val < 10) {
        val = '0' + val;
      }
      return val;
    }
  };
