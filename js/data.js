/* IOSA Portal - Data Layer (localStorage) */

const DB_KEY = 'iosa_portal_data';

const DEFAULT_DATA = {
  airline: {
    name: '이스타항공',
    iataCode: 'ZE',
    icaoCode: 'ESR',
    country: 'Korea, Republic of',
  },
  certification: {
    auditStartDate: '2025-07-28',
    auditCloseDate: '2025-08-01',   // on-site closing meeting
    ismEdition: 17,
    auditType: 'initial',
    registrationExpiry: '2027-08-01', // 24 months from closing
    auditValidity: '2026-12-01',       // 16 months from closing
    capDeadline: '2025-09-15',         // 45 days from closing
    findingsCloseDeadline: '2025-12-31', // 15 days before 12-month mark
    renewalWindowStart: '2027-02-02',  // 180 days before expiry
    renewalWindowEnd: '2027-08-01',
    nextAuditType: 'rbi',
    nextIsmEdition: 18,
    status: 'active', // active, expired, suspended
  },
  ismVersions: [
    {
      id: 1, edition: 16, effectiveDate: '2023-01-01', status: 'superseded',
      notes: '이전 기준 (2023년 적용)'
    },
    {
      id: 2, edition: 17, effectiveDate: '2024-10-01', status: 'superseded_current',
      notes: '초도심사 적용 버전. 2026-01-01부터 Ed.18로 대체',
      keyChanges: ['IATA Connect 도입', 'IPM 4.8, 7.6 개정', 'RBI Maturity Assessment 도입']
    },
    {
      id: 3, edition: 18, revision: 1, effectiveDate: '2026-01-01', status: 'current',
      notes: '현재 적용 버전. 재인증 심사 적용 예정',
      keyChanges: ['ISM Ed.18 전면 개정', 'RBI 방식 본격 적용', '2026.01.01 발효']
    },
  ],
  rbiMaturityCriteria: {
    edition: 3,
    effectiveDate: '2025-06-01',
    applicability: '2025-05-01 이후 현장심사 시작 건에 적용',
    levels: ['Established', 'Mature', 'Leading'],
    keyIsarps: [
      'ORG 1.1.1', 'ORG 1.2.1', 'ORG 1.2.2', 'ORG 1.3.1', 'ORG 1.4.1',
      'ORG 1.4.2', 'ORG 1.6.1', 'ORG 2.1.1', 'ORG 2.1.7', 'ORG 2.1.9',
      'ORG 2.2.1', 'ORG 3.1.1', 'ORG 3.1.2', 'ORG 3.1.5', 'ORG 3.2.1',
      'ORG 3.3.1', 'ORG 3.5.1', 'ORG 4.1.3', 'ORG 4.2.1', 'ORG 4.3.1',
      'FLT 2.1.1A', 'FLT 2.1.2', 'FLT 2.1.27', 'FLT 2.1.35', 'FLT 3.4.3A'
    ]
  },
  preparation: {
    externalTrainings: [],
    trainingMaterials: [],
    auditorAppointments: [],
    propagationTrainings: [],
  },
  internalAudit: {
    audits: [],
    findings: [],
    crStatus: 'not_started', // not_started, in_progress, completed, submitted
    crCompletedDate: '',
  },
  application: {
    applicationDate: '',
    contactLog: [],
    documents: [],
    auditSchedule: {
      tentativeDate: '',
      confirmedDate: '',
      status: 'not_started'
    },
  },
  auditorCoordination: {
    auditors: [],
    flights: [],
    hotels: [],
    visas: [],
  },
  mainAudit: {
    status: 'completed', // for initial audit - it's done
    documentation: { status: 'completed', notes: '초도심사 완료' },
    implementation: { status: 'completed', notes: '초도심사 완료' },
    fieldAudit: { status: 'completed', notes: '초도심사 완료' },
    results: { receivedDate: '2025-08-01', findingsCount: 0, observationsCount: 0 },
  },
  cap: {
    submittedDate: '',
    approvedDate: '',
    findings: [],
    status: 'not_started', // not_started, submitted, under_review, approved, closed
  },
  fat: {
    submittedDate: '',
    approvedDate: '',
    items: [],
    status: 'not_started',
  },
  rbiPrep: {
    maturityAssessments: [],
    isarpPriorities: [],
    prepTasks: [
      { id: 1, category: 'SMS', task: 'Safety Management System 성숙도 평가 준비', status: 'not_started', dueDate: '2026-12-01', isarpRef: 'ORG 1.1.1~ORG 4.3.1' },
      { id: 2, category: 'QMS', task: 'Quality Assurance 프로그램 고도화', status: 'not_started', dueDate: '2026-12-01', isarpRef: 'ORG 2.1.1, ORG 2.1.7' },
      { id: 3, category: 'FLT', task: '비행운항 관련 ISM Ed.18 gap 분석', status: 'not_started', dueDate: '2026-10-01', isarpRef: 'FLT 2.1.1A, FLT 2.1.2' },
      { id: 4, category: '문서', task: 'ISM Ed.17→Ed.18 변경사항 문서 업데이트', status: 'not_started', dueDate: '2026-07-01', isarpRef: '전 부문' },
      { id: 5, category: 'CR', task: 'ISM Ed.18 기반 Conformance Report 준비', status: 'not_started', dueDate: '2026-09-01', isarpRef: '전 부문' },
      { id: 6, category: '내부심사', task: 'ISM Ed.18 기반 내부심사 실시', status: 'not_started', dueDate: '2026-11-01', isarpRef: '전 부문' },
      { id: 7, category: 'IATA Connect', task: '항공사 프로파일 업데이트 (6개월 주기)', status: 'not_started', dueDate: '2026-08-01', isarpRef: 'IPM 4.8' },
      { id: 8, category: '심사원 자격', task: '내부 심사원 역량 강화 교육 (5일 기본/5일 IOSA)', status: 'not_started', dueDate: '2026-10-01', isarpRef: 'ORG 2.1.9' },
    ]
  },
  tasks: [],
  iataConnectProfile: {
    lastUpdated: '',
    nextUpdateDue: '',
    status: 'unknown',
  }
};

const DB = {
  load() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
      const saved = JSON.parse(raw);
      // Merge with defaults to handle new fields
      return deepMerge(JSON.parse(JSON.stringify(DEFAULT_DATA)), saved);
    } catch(e) {
      console.error('DB load error:', e);
      return JSON.parse(JSON.stringify(DEFAULT_DATA));
    }
  },
  save(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch(e) {
      console.error('DB save error:', e);
    }
  },
  reset() {
    localStorage.removeItem(DB_KEY);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
};

function deepMerge(target, source) {
  if (!source) return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// Date utilities
const DateUtil = {
  today() { return new Date(); },
  parse(str) { return str ? new Date(str + 'T00:00:00') : null; },
  format(date, locale='ko-KR') {
    if (!date) return '-';
    const d = typeof date === 'string' ? this.parse(date) : date;
    if (!d || isNaN(d)) return '-';
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' });
  },
  formatShort(date) {
    if (!date) return '-';
    const d = typeof date === 'string' ? this.parse(date) : date;
    if (!d || isNaN(d)) return '-';
    return d.toISOString().split('T')[0];
  },
  daysUntil(dateStr) {
    if (!dateStr) return null;
    const target = this.parse(dateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    return Math.round((target - today) / (1000 * 60 * 60 * 24));
  },
  addDays(dateStr, days) {
    const d = this.parse(dateStr);
    d.setDate(d.getDate() + days);
    return this.formatShort(d);
  },
  addMonths(dateStr, months) {
    const d = this.parse(dateStr);
    d.setMonth(d.getMonth() + months);
    return this.formatShort(d);
  },
  urgencyClass(days) {
    if (days === null) return '';
    if (days < 0) return 'urgency-high';
    if (days <= 30) return 'urgency-high';
    if (days <= 90) return 'urgency-medium';
    return 'urgency-low';
  },
  urgencyBadge(days) {
    if (days === null) return '';
    if (days < 0) return `<span class="badge-status badge-danger">D+${Math.abs(days)}</span>`;
    if (days === 0) return `<span class="badge-status badge-danger">오늘</span>`;
    if (days <= 30) return `<span class="badge-status badge-danger">D-${days}</span>`;
    if (days <= 90) return `<span class="badge-status badge-warning">D-${days}</span>`;
    return `<span class="badge-status badge-active">D-${days}</span>`;
  }
};
