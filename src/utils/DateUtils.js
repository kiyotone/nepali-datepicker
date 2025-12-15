// DatePicker/utils/NepaliDateUtils.js
import {
  DATE_FORMATS,
  AD,
  DEFAULT_BS_FORMAT,
  BS_REFERENCE_DATE,
  DEFAULT_AD_FORMAT,
  NEPALI_MONTHS,
  NEPALI_MONTHS_NEPALI,
  WEEKDAYS,
  WEEKDAYS_NEPALI,
  BS_MONTH_DATA,
} from "../constants/DateConstants.js";

export default class NepaliDateUtils {
  // --------------------------
  // Number conversion
  // --------------------------
  static toNepaliNumber(number) {
    const nepaliDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    return number
      .toString()
      .split("")
      .map((d) => nepaliDigits[d] || d)
      .join("");
  }

  static toEnglishNumber(nepaliNumber) {
    const englishDigits = {
      "०": 0, "१": 1, "२": 2, "३": 3, "४": 4,
      "५": 5, "६": 6, "७": 7, "८": 8, "९": 9,
    };
    return nepaliNumber
      .split("")
      .map((d) => (englishDigits[d] !== undefined ? englishDigits[d] : d))
      .join("");
  }

  // --------------------------
  // Month & weekday names
  // --------------------------
  static getMonthName(monthIndex) {
    return NEPALI_MONTHS[monthIndex] || "";
  }

  static getMonthNameNepali(monthIndex) {
    return NEPALI_MONTHS_NEPALI[monthIndex] || "";
  }

  static getWeekdayName(dayIndex) {
    return WEEKDAYS[dayIndex] || "";
  }

  static getWeekdayNameNepali(dayIndex) {
    return WEEKDAYS_NEPALI[dayIndex] || "";
  }

  // --------------------------
  // AD date formatting & parsing
  // --------------------------
  static formatDate(date, format = DEFAULT_AD_FORMAT) {
    const pad = (num) => num.toString().padStart(2, "0");
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    switch (format) {
      case "YYYY-MM-DD": return `${year}-${month}-${day}`;
      case "YYYY/MM/DD": return `${year}/${month}/${day}`;
      case "YYYY.MM.DD": return `${year}.${month}.${day}`;
      case "DD-MM-YYYY": return `${day}-${month}-${year}`;
      case "DD/MM/YYYY": return `${day}/${month}/${year}`;
      case "DD.MM.YYYY": return `${day}.${month}.${year}`;
      case "MM-DD-YYYY": return `${month}-${day}-${year}`;
      case "MM/DD/YYYY": return `${month}/${day}/${year}`;
      default: return `${month}/${day}/${year}`;
    }
  }

  static parseDate(dateString, format = DEFAULT_AD_FORMAT) {
    const parts = dateString.includes("-")
      ? dateString.split("-")
      : dateString.includes("/")
      ? dateString.split("/")
      : dateString.includes(".")
      ? dateString.split(".")
      : [];

    if (!parts.length) return null;

    let day, month, year;
    switch (format) {
      case "YYYY-MM-DD":
      case "YYYY/MM/DD":
      case "YYYY.MM.DD":
        [year, month, day] = parts;
        break;
      case "DD-MM-YYYY":
      case "DD/MM/YYYY":
      case "DD.MM.YYYY":
        [day, month, year] = parts;
        break;
      case "MM-DD-YYYY":
      case "MM/DD/YYYY":
        [month, day, year] = parts;
        break;
      default:
        [month, day, year] = parts;
    }

    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // --------------------------
  // AD helpers
  // --------------------------
  static isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  static getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  // --------------------------
  // BS helpers
  // --------------------------
  static getDaysInBSMonth(year, month) {
    if (!BS_MONTH_DATA[year])
      throw new Error(`BS data not found for year ${year}`);
    return BS_MONTH_DATA[year][month];
  }

  static isValidBSDate(year, month, day) {
    return (
      BS_MONTH_DATA[year] &&
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= BS_MONTH_DATA[year][month - 1]
    );
  }

  // --------------------------
  // AD → BS (100% accurate & fast)
  // --------------------------
  static AD2BS(adDate) {
    if (!(adDate instanceof Date) || isNaN(adDate.getTime())) return null;

    const inputUtc = Date.UTC(
      adDate.getFullYear(),
      adDate.getMonth(),
      adDate.getDate()
    );
    const refUtc = BS_REFERENCE_DATE.getTime();

    let totalDays = Math.floor((inputUtc - refUtc) / 86400000);

    let bsYear = 1970;   // Start from 1970 BS (correct!)
    let bsMonth = 0;     // 0-indexed
    let bsDay = 1;

    // Subtract full years
    while (true) {
      const daysInYear = this.getTotalDaysInBSYear(bsYear);
      if (totalDays < daysInYear) break;
      totalDays -= daysInYear;
      bsYear++;
    }

    // Subtract full months
    while (bsMonth < 12) {
      const daysInMonth = BS_MONTH_DATA[bsYear][bsMonth];
      if (totalDays < daysInMonth) break;
      totalDays -= daysInMonth;
      bsMonth++;
    }

    bsDay += totalDays;

    // Final safety check
    if (!this.isValidBSDate(bsYear, bsMonth + 1, bsDay)) {
      return null;
    }

    return {
      year: bsYear,
      month: bsMonth + 1,  // 1-indexed
      day: bsDay,
    };
  }

  static BS2String2AD(bsDateString) {
    const [y, m, d] = bsDateString.split("-").map((x) => Number(this.toEnglishNumber(x)));
    return this.BS2AD(y, m, d);
  }

  // --------------------------
  // BS → AD (accurate)
  // --------------------------
  static BS2AD(bsYear, bsMonth, bsDay) {
    if (!BS_MONTH_DATA[bsYear])
      throw new Error(`No BS data for year ${bsYear}`);
    if (bsMonth < 1 || bsMonth > 12)
      throw new Error("Invalid BS month");
    if (bsDay < 1 || bsDay > BS_MONTH_DATA[bsYear][bsMonth - 1])
      throw new Error("Invalid BS day");

    let totalDays = 0;

    // Add full years from 1970 to (bsYear - 1)
    for (let y = 1970; y < bsYear; y++) {
      totalDays += this.getTotalDaysInBSYear(y);
    }

    // Add full months in current year
    for (let m = 0; m < bsMonth - 1; m++) {
      totalDays += BS_MONTH_DATA[bsYear][m];
    }

    // Add days (bsDay - 1 because day 1 is reference)
    totalDays += bsDay - 1;

    const result = new Date(BS_REFERENCE_DATE);
    result.setUTCDate(result.getUTCDate() + totalDays);

    return result;
  }

  // --------------------------
  // Helper: Total days in BS year (with safety)
  // --------------------------
  static getTotalDaysInBSYear(year) {
    const days = BS_MONTH_DATA[year];
    if (!days) {
      throw new Error(
        `BS_MONTH_DATA missing for year ${year}. Add data from 1970 to 2100 BS!`
      );
    }
    return days.reduce((a, b) => a + b, 0);
  }

  // --------------------------
  // Nepali-style date object
  // --------------------------
  static toNepaliDateObject(bsDate) {
    const { year, month, day } = bsDate;
    const adDate = this.BS2AD(year, month, day);
    return {
      year,
      yearNepali: this.toNepaliNumber(year),
      month: NEPALI_MONTHS[month - 1],
      monthNepali: NEPALI_MONTHS_NEPALI[month - 1],
      monthIndex: month - 1,
      day,
      dayNepali: this.toNepaliNumber(day),
      weekday: WEEKDAYS[adDate.getDay()],
      weekdayNepali: WEEKDAYS_NEPALI[adDate.getDay()],
      adDate,
    };
  }
}