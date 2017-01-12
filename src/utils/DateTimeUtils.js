import Sugar from 'sugar-date';

export default class DateTimeUtils {
  constructor() {
  }

  getMonth(datetime = '') {
    let dt = new Date(datetime);
    return dt.getMonth() + 1;
  }

  getDay(datetime = '') {
    let dt = new Date(datetime);
    return dt.getDate();
  }

  getYear(datetime = '') {
    let dt = new Date(datetime);
    return dt.getFullYear();
  }

  getHours(datetime = '') {
    let dt = new Date(datetime);
    return dt.getHours();
  }

  getMinutes(datetime = '') {
    let dt = new Date(datetime);
    return dt.getMinutes();
  }

  getTime(datetime = '') {
      let hours = parseInt(this.getHours(datetime));
      let mins = parseInt(this.getMinutes(datetime));
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

      return hours + ':' + this.addZero(mins) + ' ' + ampm.toUpperCase();
  }

  getDate(datetime = '') {
    let mon = parseInt(this.getMonth(datetime));
    let day = parseInt(this.getDay(datetime));
    let year = parseInt(this.getYear(datetime));
    return this.addZero(mon) + '/' + this.addZero(day) + '/' + year;
  }

  isValidTime(value = '') {
    if (value === '') {
      return false;
    }
    let timeValue = value.toUpperCase().replace(' ',':');
    let ampm = 'AM';
    let isValidTime = true;

    if (/nan/i.test(value)) {
      return false;
    }

    if (typeof timeValue !== 'undefined') {
      let parts = timeValue.split(':');
      if (parts.length === 0) {
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
  }

  isValidDate(datetime) {
    // this needs further validation but this will suffice for now
    if (!datetime) {
      return false;
    }
    var dt = new Date(datetime);
    return !isNaN(dt);
  }

  addZero(val = 0) {
    if (val < 10) {
      val = '0' + val;
    }
    return val;
  }

  getRandomDate(from, to) {
    return new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime()));
  }

  convertHumanDate(val) {
    let dtResult = Sugar.Date.create(val);
    if (!isNaN(dtResult)) {
      return dtResult;
    }
    return null;
  }

  formatDateTime(val) {
    let dtResult = Sugar.Date(val);
    if (dtResult.hasOwnProperty('raw')) {
      return dtResult.full().raw;
    }
    return null;
  }

}
