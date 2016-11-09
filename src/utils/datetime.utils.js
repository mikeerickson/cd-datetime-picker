let dateTimeUtils = {

  getMonth: (datetime) => {
    let dt = new Date(datetime);
    return dt.getMonth() + 1;
  },

  getDay: (datetime) => {
    let dt = new Date(datetime);
    return dt.getDate();
  },

  getYear: (datetime) => {
    let dt = new Date(datetime);
    return dt.getFullYear();
  },

  getHours: (datetime) => {
    let dt = new Date(datetime);
    return dt.getHours();
  },

  getMinutes: (datetime) => {
    let dt = new Date(datetime);
    return dt.getMinutes();
  },

  getTime: (datetime) => {
      let hours = parseInt(dateTimeUtils.getHours(datetime));
      let mins = parseInt(dateTimeUtils.getMinutes(datetime));
      let ampm = 'am';

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
    let mon = parseInt(dateTimeUtils.getMonth(datetime));
    let day = parseInt(dateTimeUtils.getDay(datetime));
    let year = parseInt(dateTimeUtils.getYear(datetime));
    return dateTimeUtils.addZero(mon) + '/' + dateTimeUtils.addZero(day) + '/' + year;
  },

  isValidTime: (value) => {
    let timeValue = value.toUpperCase().replace(' ',':');
    let ampm = 'AM';
    let isValidTime = true;

    if (typeof timeValue !== 'undefined') {
      let parts = timeValue.split(':');
      if (parts.length === 0) {
        let timeValue24 = parseInt(timeValue);
        if ((timeValue > 0) && (timeValue <= 2359)) {
          isValidTime = true;
        }
      }

      let hours = parseInt(parts[0]);
      let mins = parseInt(parts[1]);
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

module.exports = dateTimeUtils;
