// Cloudflare Workers 환경 타입
export interface Env {
  DB: D1Database;
  AI: any;
  ENVIRONMENT?: string;
}

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 사용자 타입
export interface User {
  id: string;
  email: string;
  user_type: 'jobseeker' | 'employer';
  name: string;
  albi_points: number;
  trust_score: number;
  level: number;
  created_at: number;
}

// 구인 공고 타입
export interface Job {
  id: string;
  employer_id: string;
  title: string;
  hourly_wage: number;
  location: string;
  description: string;
  work_schedule: string;
  requirements?: string;
  benefits?: string;
  status: string;
  created_at: number;
}

// 체험 예약 타입
export interface Experience {
  id: string;
  job_id: string;
  jobseeker_id: string;
  employer_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduled_date: string;
  scheduled_time: string;
  observation_missions?: string;
  wants_to_work?: number;
  wants_to_hire?: number;
  jobseeker_review?: string;
  employer_review?: string;
  created_at: number;
}

// 포인트 거래 타입
export interface PointTransaction {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  description: string;
  balance_after: number;
  created_at: number;
}

// AI 면접 타입
export interface AIInterview {
  id: string;
  user_id: string;
  conversation_data: string;
  analysis_result?: string;
  completed_at: number;
}

// 채팅 메시지 타입
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 급여 계산 결과 타입
export interface WageCalculation {
  weeklyHours: number;
  weeklyBasePay: number;
  weeklyHolidayPay: number;
  weeklyTotal: number;
  monthlyEstimate: number;
  hasHolidayPay: boolean;
  explanation: string;
}
