/**
 * 알비 유틸리티 함수 모음
 */

import type { WageCalculation } from './types';

/**
 * 주휴수당 계산 함수
 * @param hourlyWage 시급 (원)
 * @param weeklyHours 주간 근무 시간
 * @returns 급여 계산 결과
 */
export function calculateWage(hourlyWage: number, weeklyHours: number): WageCalculation {
  const weeklyBasePay = hourlyWage * weeklyHours;
  const hasHolidayPay = weeklyHours >= 15;
  
  let weeklyHolidayPay = 0;
  if (hasHolidayPay) {
    const holidayHours = Math.min(weeklyHours / 40, 1) * 8;
    weeklyHolidayPay = holidayHours * hourlyWage;
  }
  
  const weeklyTotal = weeklyBasePay + weeklyHolidayPay;
  const monthlyEstimate = weeklyTotal * 4.345; // 평균 주수
  
  return {
    weeklyHours: Math.round(weeklyHours * 10) / 10,
    weeklyBasePay: Math.round(weeklyBasePay),
    weeklyHolidayPay: Math.round(weeklyHolidayPay),
    weeklyTotal: Math.round(weeklyTotal),
    monthlyEstimate: Math.round(monthlyEstimate),
    hasHolidayPay,
    explanation: hasHolidayPay
      ? `주 ${weeklyHours}시간 근무로 주휴수당 적용\n주휴수당 = (${weeklyHours} ÷ 40) × 8 × ${hourlyWage.toLocaleString()}원 = ${Math.round(weeklyHolidayPay).toLocaleString()}원`
      : `주 ${weeklyHours}시간 근무로 주휴수당 미적용 (15시간 이상 시 적용)`
  };
}

/**
 * 시급 <-> 월급 변환 함수
 * @param mode 변환 모드
 * @param value 변환할 값
 * @param weeklyHours 주간 근무 시간
 * @returns 변환 결과
 */
export function convertSalary(
  mode: 'hourly-to-monthly' | 'monthly-to-hourly',
  value: number,
  weeklyHours: number
): { output: number; explanation: string } {
  const WEEKS_PER_MONTH = 4.345;
  const hasHolidayPay = weeklyHours >= 15;
  
  if (mode === 'hourly-to-monthly') {
    const result = calculateWage(value, weeklyHours);
    return {
      output: result.monthlyEstimate,
      explanation: `시급 ${value.toLocaleString()}원 기준\n예상 월급: ${result.monthlyEstimate.toLocaleString()}원\n${hasHolidayPay ? '(주휴수당 포함)' : '(주휴수당 없음)'}`
    };
  } else {
    const targetMonthly = value;
    let totalWeeklyHours = weeklyHours;
    
    if (hasHolidayPay) {
      const holidayHours = Math.min(weeklyHours / 40, 1) * 8;
      totalWeeklyHours += holidayHours;
    }
    
    const totalMonthlyHours = totalWeeklyHours * WEEKS_PER_MONTH;
    const requiredHourlyWage = Math.ceil(targetMonthly / totalMonthlyHours / 10) * 10;
    
    return {
      output: requiredHourlyWage,
      explanation: `월 ${targetMonthly.toLocaleString()}원 달성을 위해\n필요한 시급: ${requiredHourlyWage.toLocaleString()}원\n${hasHolidayPay ? '(주휴수당 포함 계산)' : '(주휴수당 없음)'}`
    };
  }
}

/**
 * 숫자를 한국어 통화 형식으로 포맷팅
 * @param num 숫자
 * @returns 포맷팅된 문자열
 */
export function formatCurrency(num: number): string {
  return num.toLocaleString('ko-KR') + '원';
}

/**
 * Unix 타임스탬프를 한국 시간으로 변환
 * @param timestamp Unix 타임스탬프 (초)
 * @returns 날짜 문자열
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * HTML 특수문자 이스케이프
 * @param text 텍스트
 * @returns 이스케이프된 텍스트
 */
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * 알비포인트 유효성 검증
 * @param points 포인트
 * @returns 유효 여부
 */
export function isValidPoints(points: number): boolean {
  return Number.isInteger(points) && points >= 0;
}

/**
 * 시급 유효성 검증 (2025년 최저시급 기준)
 * @param wage 시급
 * @returns 유효 여부
 */
export function isValidWage(wage: number): boolean {
  const MIN_WAGE_2025 = 10030;
  return wage >= MIN_WAGE_2025;
}

/**
 * 이메일 유효성 검증
 * @param email 이메일 주소
 * @returns 유효 여부
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
