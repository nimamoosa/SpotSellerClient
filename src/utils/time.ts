import { toJalaali } from "jalaali-js";
import moment from "moment-timezone";

// Current date in Gregorian calendar
const date = moment().tz("Asia/Tehran").toDate();

// Convert the current date to Jalali (Persian) calendar
export const time = toJalaali(date);

// Interface for Jalali date object
interface JalaaliDate {
  jy: number; // Year
  jm: number; // Month
  jd: number; // Day
}

export const subtractOneDayFromJalaali = (
  jalaaliDate: JalaaliDate
): JalaaliDate => {
  let { jy, jm, jd } = jalaaliDate;

  if (jd > 1) {
    jd -= 1; // کم کردن یک روز اگر در همان ماه باشد
  } else {
    // اگر روز اول ماه باشد
    if (jm > 1) {
      jm -= 1; // به ماه قبل بروید
    } else {
      jm = 12; // به آخرین ماه سال قبل بروید
      jy -= 1; // سال را یک سال کم کنید
    }
    jd = getDaysInJalaaliMonth(jm, jy); // تعداد روزهای ماه قبل را تنظیم کنید
  }

  return { jy, jm, jd };
};

// Function to get the number of days in a given month of the Jalali calendar
const getDaysInJalaaliMonth = (month: number, year: number): number => {
  const daysInMonth = [
    31, // Farvardin
    31, // Ordibehesht
    31, // Khordad
    31, // Tir
    31, // Mordad
    31, // Shahrivar
    30, // Mehr
    30, // Aban
    30, // Azar
    30, // Dey
    30, // Bahman
    29, // Esfand (29 or 30 depending on leap year)
  ];

  return month === 12 && year % 4 === 3 ? 30 : daysInMonth[month - 1];
};
