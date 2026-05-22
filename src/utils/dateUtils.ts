/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Returns today's date in Korean Standard Time (KST - Asia/Seoul).
 * Uses robust local ISO string parsing to work regardless of server localization.
 */
export function getTodayKST(): Date {
  const now = new Date();
  const kstString = now.toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  return new Date(kstString);
}

/**
 * Formats a Date object to "M월 D일 요일" (e.g., "5월 15일 금요일").
 */
export function formatKoreanDate(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayOfWeek = days[date.getDay()];
  return `${month}월 ${day}일 ${dayOfWeek}`;
}

/**
 * Formats a Date object to "YYYYMMDD" 형식 for database key or NEIS API query.
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Returns an array of 5 Date objects (Monday to Friday) representing the school week
 * containing the given date.
 */
export function getWeekDates(date: Date): Date[] {
  const current = new Date(date);
  const day = current.getDay();
  
  // If the date is Sunday (0), the Monday of that week is 6 days ago.
  // Otherwise, the Monday is (1 - day) days relative to current date.
  const diffToMonday = day === 0 ? -6 : 1 - day;
  
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);
  
  const dates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const nextDate = new Date(monday);
    nextDate.setDate(monday.getDate() + i);
    dates.push(nextDate);
  }
  return dates;
}

/**
 * Calculates the week of the month ("M월 N주차") based on the given date.
 * Formats correctly according to standard Korean calendar calculations.
 */
export function getWeekOfMonth(date: Date): string {
  const tempDate = new Date(date);
  const day = tempDate.getDate();
  
  // Get the 1st day of this month
  const firstDay = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);
  const firstDayOfWeek = firstDay.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
  
  // Offset to calculate how many days are in the partial week preceding the first Monday
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const week = Math.ceil((day + offset) / 7);
  
  return `${tempDate.getMonth() + 1}월 ${week}주차`;
}

/**
 * Returns the default day to display on the schedules menu:
 * - If today is a weekday (Monday-Friday), return today.
 * - If today is Saturday or Sunday, return the following Monday.
 */
export function getDefaultSelectedDate(today: Date): Date {
  const day = today.getDay();
  if (day === 6) { // Saturday
    const nextMon = new Date(today);
    nextMon.setDate(today.getDate() + 2);
    return nextMon;
  } else if (day === 0) { // Sunday
    const nextMon = new Date(today);
    nextMon.setDate(today.getDate() + 1);
    return nextMon;
  }
  return today;
}

/**
 * Simple helper to safely get day name shorthand (월, 화, 수, 목, 금)
 */
export function getKoreanDayOfWeek(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}
