
  var dateTimeUtils = {

    getMonth: (datetime) => {
      var dt = new Date(datetime);
      return dt.getMonth() + 1;
    },

    getDay: (datetime) => {
      var dt = new Date(datetime);
      return dt.getDate();
    },

    getYear: (datetime) => {
      var dt = new Date(datetime);
      return dt.getFullYear();
    },

    getHours: (datetime) => {
      if (typeof datetime !== 'string') { return null; }
      var dt = new Date(datetime);
      return dt.getHours();
    },

    getMinutes: (datetime) => {
      if (typeof datetime !== 'string') { return null; }
      var dt = new Date(datetime);
      return dt.getMinutes();
    },

    getTime: (datetime) => {
        var hours = parseInt(dateTimeUtils.getHours(datetime));
        var mins = parseInt(dateTimeUtils.getMinutes(datetime));
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

        return hours + ':' + dateTimeUtils.addZero(mins) + ' ' + ampm.toUpperCase();
    },

    getDate: (datetime) => {
      var mon = parseInt(dateTimeUtils.getMonth(datetime));
      var day = parseInt(dateTimeUtils.getDay(datetime));
      var year = parseInt(dateTimeUtils.getYear(datetime));
      return dateTimeUtils.addZero(mon) + '/' + dateTimeUtils.addZero(day) + '/' + year;
    },

    isValidTime: (value) => {
      var timeValue = value.toUpperCase().replace(' ',':');
      var ampm = 'AM';
      var isValidTime = true;

      if (typeof timeValue !== 'undefined') {
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
          ampm = 'PM';
        }
        if ((hours > 12) || (mins > 59)) {
          isValidTime = false;
        }
      }

      return isValidTime;
    },

    isValidDate: (datetime) => {},

    addZero: (val) => {
      if (val < 10) {
        val = '0' + val;
      }
      return val;
    }
  };
