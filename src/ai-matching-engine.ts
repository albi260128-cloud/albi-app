/**
 * 알비(ALBI) AI 매칭 엔진
 * 구직자와 공고를 퍼펙트하게 매칭하는 알고리즘
 */

import { 
  RESPONSE_SCORING, 
  JOB_REQUIREMENTS 
} from './ai-interview-database';

// ========================================
// 타입 정의
// ========================================

export interface UserProfile {
  // 기본 정보
  name?: string;
  age?: number;
  location?: string;

  // 경험
  experience: {
    hasExperience: boolean;
    industries: string[];      // ['cafe', 'convenience', ...]
    duration: number;          // 개월 수
    strengths: string[];
    weaknesses: string[];
  };

  // 성향 (빅파이브 모델)
  personality: {
    extraversion: number;      // 1-10: 외향성
    conscientiousness: number; // 1-10: 성실성
    openness: number;          // 1-10: 개방성
    agreeableness: number;     // 1-10: 친화성
    neuroticism: number;       // 1-10: 신경성 (높을수록 안정)
  };

  // 역량 점수
  skills: {
    communication: number;      // 1-10
    multitasking: number;
    learning_speed: number;
    teamwork: number;
    independence: number;
    physical_ability: number;
    stress_tolerance: number;
    problem_solving: number;
    attention_to_detail: number;
    customer_service: number;
  };

  // 선호 조건
  preferences: {
    industries: string[];       // 선호 업종
    workHours: string[];        // ['morning', 'afternoon', 'evening', 'night']
    weekends: boolean;
    minWage: number;
    maxDistance: number;        // km
  };

  // 회피 조건
  avoidance: {
    industries: string[];
    conditions: string[];       // ['night_shift', 'heavy_lifting', ...]
  };
}

export interface JobPosting {
  id: string;
  employerId: string;
  
  // 기본 정보
  title: string;
  industry: string;             // 'cafe', 'convenience', 'restaurant', ...
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  
  // 근무 조건
  workConditions: {
    hours: string[];            // ['morning', 'afternoon', ...]
    weekends: boolean;
    flexible: boolean;
    hourlyWage: number;
  };

  // 요구 역량
  requirements: {
    essential: Record<string, number>;  // 필수 역량
    preferred: Record<string, number>;  // 우대 역량
    experience: boolean;                // 경험 필수 여부
  };

  // 매장 특성
  workplace: {
    size: 'small' | 'medium' | 'large';
    atmosphere: 'calm' | 'moderate' | 'busy';
    teamSize: number;
    training: boolean;            // 교육 제공 여부
  };

  // 우대 사항
  benefits: string[];
}

export interface MatchResult {
  jobId: string;
  score: number;                  // 0-100 종합 점수
  breakdown: {
    personalityFit: number;       // 성향 적합도 (40%)
    skillMatch: number;           // 역량 적합도 (30%)
    conditionMatch: number;       // 조건 충족도 (20%)
    distance: number;             // 거리 편의성 (10%)
  };
  reasons: string[];              // 매칭 이유
  concerns: string[];             // 주의사항
  recommendation: 'high' | 'medium' | 'low';
}

// ========================================
// 매칭 엔진 클래스
// ========================================

export class AIMatchingEngine {
  /**
   * 메인 매칭 함수: 사용자와 공고를 매칭
   */
  static match(user: UserProfile, job: JobPosting): MatchResult {
    // 1. 성향 적합도 계산
    const personalityFit = this.calculatePersonalityFit(user, job);

    // 2. 역량 적합도 계산
    const skillMatch = this.calculateSkillMatch(user, job);

    // 3. 조건 충족도 계산
    const conditionMatch = this.calculateConditionMatch(user, job);

    // 4. 거리 점수 계산
    const distanceScore = this.calculateDistanceScore(user, job);

    // 5. 가중 평균으로 종합 점수 계산
    const totalScore = 
      personalityFit * 0.40 +
      skillMatch * 0.30 +
      conditionMatch * 0.20 +
      distanceScore * 0.10;

    // 6. 매칭 이유 생성
    const reasons = this.generateReasons(user, job, {
      personalityFit,
      skillMatch,
      conditionMatch,
      distance: distanceScore
    });

    // 7. 주의사항 생성
    const concerns = this.generateConcerns(user, job);

    // 8. 추천 등급 결정
    const recommendation = this.getRecommendationLevel(totalScore);

    return {
      jobId: job.id,
      score: Math.round(totalScore),
      breakdown: {
        personalityFit: Math.round(personalityFit),
        skillMatch: Math.round(skillMatch),
        conditionMatch: Math.round(conditionMatch),
        distance: Math.round(distanceScore)
      },
      reasons,
      concerns,
      recommendation
    };
  }

  /**
   * 1. 성향 적합도 계산 (40%)
   * 빅파이브 모델 기반으로 직무 적합성 평가
   */
  private static calculatePersonalityFit(user: UserProfile, job: JobPosting): number {
    const { industry, workplace } = job;
    const { personality } = user;

    let score = 50; // 기본 점수

    // 업종별 성향 요구사항
    switch (industry) {
      case 'cafe':
        // 카페: 외향성, 친화성, 스트레스 내성
        score += (personality.extraversion - 5) * 5;
        score += (personality.agreeableness - 5) * 5;
        score += (personality.neuroticism - 5) * 3;
        break;

      case 'convenience':
        // 편의점: 독립성 (낮은 외향성 OK), 성실성, 꼼꼼함
        score += (10 - personality.extraversion) * 3;  // 혼자 근무
        score += (personality.conscientiousness - 5) * 6;
        score += (personality.neuroticism - 5) * 4;
        break;

      case 'restaurant':
        // 음식점: 팀워크 (친화성), 스트레스 내성, 활동성 (외향성)
        score += (personality.agreeableness - 5) * 6;
        score += (personality.neuroticism - 5) * 5;
        score += (personality.extraversion - 5) * 4;
        break;

      case 'delivery':
        // 배달: 독립성, 스트레스 내성, 책임감
        score += (10 - personality.extraversion) * 4;
        score += (personality.neuroticism - 5) * 5;
        score += (personality.conscientiousness - 5) * 5;
        break;

      case 'retail':
        // 매장 판매: 외향성, 친화성, 개방성 (새로운 것 배우기)
        score += (personality.extraversion - 5) * 6;
        score += (personality.agreeableness - 5) * 5;
        score += (personality.openness - 5) * 4;
        break;
    }

    // 매장 분위기 반영
    if (workplace.atmosphere === 'busy') {
      score += (personality.neuroticism - 5) * 3; // 안정성 중요
      score += (personality.extraversion - 5) * 2; // 활발함 유리
    } else if (workplace.atmosphere === 'calm') {
      score += (10 - personality.extraversion) * 2; // 조용함 선호 OK
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 2. 역량 적합도 계산 (30%)
   * 필수/우대 역량 대비 사용자 역량 매칭
   */
  private static calculateSkillMatch(user: UserProfile, job: JobPosting): number {
    const { requirements } = job;
    const { skills, experience } = user;

    let essentialScore = 0;
    let essentialCount = 0;
    let preferredScore = 0;
    let preferredCount = 0;

    // 필수 역량 점수 (70% 가중치)
    for (const [skill, required] of Object.entries(requirements.essential)) {
      if (skill in skills) {
        const userLevel = skills[skill as keyof typeof skills];
        const gap = userLevel - required;
        
        if (gap >= 0) {
          essentialScore += 10; // 충족
        } else if (gap >= -2) {
          essentialScore += 7;  // 약간 부족하지만 학습 가능
        } else {
          essentialScore += 3;  // 많이 부족
        }
        essentialCount++;
      }
    }

    // 우대 역량 점수 (30% 가중치)
    for (const [skill, required] of Object.entries(requirements.preferred || {})) {
      if (skill in skills) {
        const userLevel = skills[skill as keyof typeof skills];
        if (userLevel >= required) {
          preferredScore += 10;
        } else {
          preferredScore += 5;
        }
        preferredCount++;
      }
    }

    // 경험 보너스
    let experienceBonus = 0;
    if (experience.hasExperience && experience.industries.includes(job.industry)) {
      experienceBonus = 20; // 동일 업종 경험
    } else if (experience.hasExperience) {
      experienceBonus = 10; // 다른 업종 경험
    } else if (!requirements.experience) {
      experienceBonus = 5;  // 신입 가능
    }

    const avgEssential = essentialCount > 0 ? essentialScore / essentialCount : 50;
    const avgPreferred = preferredCount > 0 ? preferredScore / preferredCount : 50;

    const totalScore = (avgEssential * 0.7) + (avgPreferred * 0.3) + experienceBonus;

    return Math.min(100, totalScore);
  }

  /**
   * 3. 조건 충족도 계산 (20%)
   * 근무 시간, 급여, 위치 등 조건 매칭
   */
  private static calculateConditionMatch(user: UserProfile, job: JobPosting): number {
    let score = 0;

    // 시간대 매칭 (40점)
    const timeMatch = job.workConditions.hours.some(hour => 
      user.preferences.workHours.includes(hour)
    );
    score += timeMatch ? 40 : 10;

    // 주말 근무 조건 (20점)
    if (job.workConditions.weekends === user.preferences.weekends) {
      score += 20;
    } else if (job.workConditions.flexible) {
      score += 15; // 유연 근무 가능하면 괜찮음
    } else {
      score += 5;
    }

    // 급여 조건 (30점)
    if (job.workConditions.hourlyWage >= user.preferences.minWage) {
      const excess = job.workConditions.hourlyWage - user.preferences.minWage;
      score += Math.min(30, 20 + (excess / 1000) * 2);
    } else {
      score += 10; // 미충족
    }

    // 회피 조건 체크 (10점)
    const hasAvoidance = user.avoidance.industries.includes(job.industry) ||
                         user.avoidance.conditions.some(c => this.checkCondition(c, job));
    score += hasAvoidance ? 0 : 10;

    return score;
  }

  /**
   * 4. 거리 점수 계산 (10%)
   * 집에서 직장까지의 거리 기반
   */
  private static calculateDistanceScore(user: UserProfile, job: JobPosting): number {
    // TODO: 실제 사용자 위치 정보가 있을 때 계산
    // 현재는 maxDistance 기준으로 가정
    
    const maxDist = user.preferences.maxDistance || 5;
    
    // 가정: jobDistance는 실제 계산 필요
    const assumedDistance = 3; // km (임시)
    
    if (assumedDistance <= maxDist * 0.5) {
      return 100; // 매우 가까움
    } else if (assumedDistance <= maxDist) {
      return 70;  // 적당한 거리
    } else if (assumedDistance <= maxDist * 1.5) {
      return 40;  // 약간 멈
    } else {
      return 10;  // 멀다
    }
  }

  /**
   * 매칭 이유 생성
   */
  private static generateReasons(
    user: UserProfile, 
    job: JobPosting,
    scores: MatchResult['breakdown']
  ): string[] {
    const reasons: string[] = [];

    // 성향 기반 이유
    if (scores.personalityFit >= 80) {
      const { industry } = job;
      const { personality } = user;

      if (industry === 'cafe' && personality.extraversion >= 7) {
        reasons.push('활발하고 친근한 성격이 카페 분위기와 잘 맞아요');
      }
      if (industry === 'convenience' && personality.conscientiousness >= 7) {
        reasons.push('꼼꼼하고 책임감 있는 성격이 편의점 업무에 적합해요');
      }
      if (industry === 'restaurant' && personality.agreeableness >= 7) {
        reasons.push('협력적인 태도가 팀워크가 중요한 음식점에서 빛날 거예요');
      }
    }

    // 역량 기반 이유
    if (scores.skillMatch >= 80) {
      if (user.experience.hasExperience && user.experience.industries.includes(job.industry)) {
        reasons.push(`${job.industry} 업종 경험이 있어 빠르게 적응할 수 있어요`);
      }
      if (user.skills.learning_speed >= 8) {
        reasons.push('학습 속도가 빨라 새로운 업무도 금방 익힐 수 있어요');
      }
    }

    // 조건 기반 이유
    if (scores.conditionMatch >= 80) {
      if (job.workConditions.hourlyWage > user.preferences.minWage + 1000) {
        reasons.push('희망 시급보다 높은 급여를 제공해요');
      }
      if (job.workConditions.flexible) {
        reasons.push('유연한 근무 시간으로 일정 조율이 가능해요');
      }
    }

    // 거리 기반 이유
    if (scores.distance >= 80) {
      reasons.push('집에서 가까워 통근이 편리해요');
    }

    // 추가 혜택
    if (job.workplace.training) {
      reasons.push('체계적인 교육 프로그램이 있어 신입도 환영해요');
    }
    if (job.benefits.length > 0) {
      reasons.push(`${job.benefits.join(', ')} 등의 혜택이 있어요`);
    }

    return reasons.length > 0 
      ? reasons.slice(0, 3) 
      : ['이 공고가 회원님의 조건과 잘 맞아요'];
  }

  /**
   * 주의사항 생성
   */
  private static generateConcerns(user: UserProfile, job: JobPosting): string[] {
    const concerns: string[] = [];

    // 역량 부족 주의
    const { requirements } = job;
    for (const [skill, required] of Object.entries(requirements.essential)) {
      if (skill in user.skills) {
        const userLevel = user.skills[skill as keyof typeof user.skills];
        if (userLevel < required - 2) {
          concerns.push(`${skill} 역량이 요구 수준보다 낮아요. 교육을 통해 보완하면 좋겠어요`);
        }
      }
    }

    // 경험 부족
    if (requirements.experience && !user.experience.hasExperience) {
      concerns.push('경험자 우대 공고예요. 교육 기간이 필요할 수 있어요');
    }

    // 근무 환경 주의
    if (job.workplace.atmosphere === 'busy' && user.personality.neuroticism < 5) {
      concerns.push('바쁜 시간대에 스트레스를 받을 수 있어요');
    }

    // 조건 불일치
    if (job.workConditions.weekends && !user.preferences.weekends) {
      concerns.push('주말 근무가 필요한 공고예요');
    }

    return concerns.slice(0, 2); // 최대 2개만 표시
  }

  /**
   * 추천 등급 결정
   */
  private static getRecommendationLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  }

  /**
   * 조건 체크 헬퍼
   */
  private static checkCondition(condition: string, job: JobPosting): boolean {
    switch (condition) {
      case 'night_shift':
        return job.workConditions.hours.includes('night');
      case 'heavy_lifting':
        return job.industry === 'restaurant' || job.industry === 'delivery';
      case 'weekend_required':
        return job.workConditions.weekends && !job.workConditions.flexible;
      default:
        return false;
    }
  }

  /**
   * 배치: 여러 공고 중 최적의 공고 찾기
   */
  static findBestMatches(user: UserProfile, jobs: JobPosting[], limit: number = 10): MatchResult[] {
    const matches = jobs
      .map(job => this.match(user, job))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return matches;
  }

  /**
   * 구인자용: 지원자 풀에서 최적 후보 찾기
   */
  static findBestCandidates(job: JobPosting, users: UserProfile[], limit: number = 20): MatchResult[] {
    const matches = users
      .map(user => this.match(user, job))
      .filter(match => match.score >= 60) // 60점 이상만
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return matches;
  }
}

export default AIMatchingEngine;
