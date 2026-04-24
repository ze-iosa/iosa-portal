/**
 * ISM Edition 18 — ISARP Reference List
 * IOSA Standards Manual Ed.18 (Effective 2026-01-01)
 * 내부심사 Conformance Report 초기화용
 */
const ISM18_ISARPS = {

  // ════════════════════════════════════════════════════════
  //  ORG  조직 및 안전 관리  (Organization & Safety Mgmt)
  // ════════════════════════════════════════════════════════
  ORG: [
    // 1. Governance and Management Commitment
    'ORG 1.1.1','ORG 1.1.2','ORG 1.1.3','ORG 1.1.4','ORG 1.1.5',
    'ORG 1.2.1','ORG 1.2.2','ORG 1.2.3','ORG 1.2.4',
    'ORG 1.3.1','ORG 1.3.2','ORG 1.3.3','ORG 1.3.4',
    'ORG 1.4.1','ORG 1.4.2','ORG 1.4.3','ORG 1.4.4',
    'ORG 1.5.1','ORG 1.5.2','ORG 1.5.3','ORG 1.5.4',
    'ORG 1.6.1','ORG 1.6.2',                            // Ed.18 신설

    // 2. Safety Management System (SMS)
    'ORG 2.1.1','ORG 2.1.2','ORG 2.1.3','ORG 2.1.4','ORG 2.1.5',
    'ORG 2.1.6','ORG 2.1.7','ORG 2.1.8','ORG 2.1.9',
    'ORG 2.2.1','ORG 2.2.2','ORG 2.2.3',
    'ORG 2.3.1','ORG 2.3.2','ORG 2.3.3','ORG 2.3.4',
    'ORG 2.4.1','ORG 2.4.2','ORG 2.4.3','ORG 2.4.4','ORG 2.4.5',

    // 3. Quality Management System (QMS)
    'ORG 3.1.1','ORG 3.1.2','ORG 3.1.3','ORG 3.1.4','ORG 3.1.5',
    'ORG 3.2.1','ORG 3.2.2','ORG 3.2.3',
    'ORG 3.3.1','ORG 3.3.2','ORG 3.3.3',
    'ORG 3.4.1','ORG 3.4.2',
    'ORG 3.5.1','ORG 3.5.2','ORG 3.5.3',
    'ORG 3.6.1','ORG 3.6.2',

    // 4. Risk-Based Inspection Readiness (Ed.18 신설)
    'ORG 4.1.1','ORG 4.1.2','ORG 4.1.3',
    'ORG 4.2.1','ORG 4.2.2',
    'ORG 4.3.1','ORG 4.3.2',
  ],

  // ════════════════════════════════════════════════════════
  //  FLT  운항  (Flight Operations)
  // ════════════════════════════════════════════════════════
  FLT: [
    // 1. Organization and Authority
    'FLT 1.1.1','FLT 1.1.2','FLT 1.1.3','FLT 1.1.4','FLT 1.1.5',
    'FLT 1.2.1','FLT 1.2.2','FLT 1.2.3',
    'FLT 1.3.1','FLT 1.3.2','FLT 1.3.3',

    // 2. Crew Qualification, Training and Currency
    'FLT 2.1.1','FLT 2.1.1A','FLT 2.1.2','FLT 2.1.3','FLT 2.1.4',
    'FLT 2.1.5','FLT 2.1.6','FLT 2.1.7','FLT 2.1.8','FLT 2.1.9',
    'FLT 2.1.10','FLT 2.1.11','FLT 2.1.12','FLT 2.1.13','FLT 2.1.14',
    'FLT 2.1.15','FLT 2.1.16','FLT 2.1.17','FLT 2.1.18','FLT 2.1.19',
    'FLT 2.1.20','FLT 2.1.21','FLT 2.1.22','FLT 2.1.23','FLT 2.1.24',
    'FLT 2.1.25','FLT 2.1.26','FLT 2.1.27','FLT 2.1.28','FLT 2.1.29',
    'FLT 2.1.30','FLT 2.1.31','FLT 2.1.32','FLT 2.1.33','FLT 2.1.34',
    'FLT 2.1.35','FLT 2.1.36','FLT 2.1.37',
    'FLT 2.2.1','FLT 2.2.2','FLT 2.2.3','FLT 2.2.4','FLT 2.2.5',
    'FLT 2.2.6','FLT 2.2.7','FLT 2.2.8',
    'FLT 2.3.1','FLT 2.3.2','FLT 2.3.3','FLT 2.3.4',
    'FLT 2.4.1','FLT 2.4.2','FLT 2.4.3','FLT 2.4.4','FLT 2.4.5',
    'FLT 2.5.1','FLT 2.5.2','FLT 2.5.3','FLT 2.5.4',

    // 3. Flight Operations Procedures
    'FLT 3.1.1','FLT 3.1.2','FLT 3.1.3','FLT 3.1.4',
    'FLT 3.2.1','FLT 3.2.2','FLT 3.2.3','FLT 3.2.4','FLT 3.2.5',
    'FLT 3.3.1','FLT 3.3.2','FLT 3.3.3','FLT 3.3.4','FLT 3.3.5',
    'FLT 3.4.1','FLT 3.4.2','FLT 3.4.3','FLT 3.4.3A','FLT 3.4.4','FLT 3.4.5',
    'FLT 3.5.1','FLT 3.5.2','FLT 3.5.3','FLT 3.5.4','FLT 3.5.5',
    'FLT 3.6.1','FLT 3.6.2','FLT 3.6.3','FLT 3.6.4',
    'FLT 3.7.1','FLT 3.7.2','FLT 3.7.3','FLT 3.7.4',
    'FLT 3.8.1','FLT 3.8.2','FLT 3.8.3',
    'FLT 3.9.1','FLT 3.9.2','FLT 3.9.3',
    'FLT 3.10.1','FLT 3.10.2','FLT 3.10.3',

    // 4. Performance, Weather and Navigation
    'FLT 4.1.1','FLT 4.1.2','FLT 4.1.3','FLT 4.1.4',
    'FLT 4.2.1','FLT 4.2.2','FLT 4.2.3',
    'FLT 4.3.1','FLT 4.3.2','FLT 4.3.3',
    'FLT 4.4.1','FLT 4.4.2','FLT 4.4.3','FLT 4.4.4',

    // 5. Fatigue Risk Management
    'FLT 5.1.1','FLT 5.1.2','FLT 5.1.3','FLT 5.1.4','FLT 5.1.5',
    'FLT 5.2.1','FLT 5.2.2','FLT 5.2.3',
  ],

  // ════════════════════════════════════════════════════════
  //  DSP  종합통제  (Dispatch / Operational Control)
  // ════════════════════════════════════════════════════════
  DSP: [
    // 1. Organization
    'DSP 1.1.1','DSP 1.1.2','DSP 1.1.3','DSP 1.1.4',
    'DSP 1.2.1','DSP 1.2.2','DSP 1.2.3',

    // 2. Dispatcher Qualification and Training
    'DSP 2.1.1','DSP 2.1.2','DSP 2.1.3','DSP 2.1.4','DSP 2.1.5',
    'DSP 2.2.1','DSP 2.2.2','DSP 2.2.3',

    // 3. Flight Watch and Operations Control
    'DSP 3.1.1','DSP 3.1.2','DSP 3.1.3','DSP 3.1.4','DSP 3.1.5',
    'DSP 3.2.1','DSP 3.2.2','DSP 3.2.3','DSP 3.2.4',
    'DSP 3.3.1','DSP 3.3.2','DSP 3.3.3',
    'DSP 3.4.1','DSP 3.4.2','DSP 3.4.3',

    // 4. Dispatch Procedures
    'DSP 4.1.1','DSP 4.1.2','DSP 4.1.3','DSP 4.1.4',
    'DSP 4.2.1','DSP 4.2.2','DSP 4.2.3',
    'DSP 4.3.1','DSP 4.3.2',
  ],

  // ════════════════════════════════════════════════════════
  //  MNT  정비  (Aircraft Airworthiness & Maintenance)
  // ════════════════════════════════════════════════════════
  MNT: [
    // 1. Organization and Authority
    'MNT 1.1.1','MNT 1.1.2','MNT 1.1.3','MNT 1.1.4','MNT 1.1.5',
    'MNT 1.2.1','MNT 1.2.2','MNT 1.2.3','MNT 1.2.4',
    'MNT 1.3.1','MNT 1.3.2','MNT 1.3.3',

    // 2. Airworthiness Management
    'MNT 2.1.1','MNT 2.1.2','MNT 2.1.3','MNT 2.1.4','MNT 2.1.5',
    'MNT 2.1.6','MNT 2.1.7',
    'MNT 2.2.1','MNT 2.2.2','MNT 2.2.3','MNT 2.2.4',
    'MNT 2.3.1','MNT 2.3.2','MNT 2.3.3',

    // 3. Maintenance Programs
    'MNT 3.1.1','MNT 3.1.2','MNT 3.1.3','MNT 3.1.4',
    'MNT 3.2.1','MNT 3.2.2','MNT 3.2.3',
    'MNT 3.3.1','MNT 3.3.2','MNT 3.3.3','MNT 3.3.4',

    // 4. Training and Qualification
    'MNT 4.1.1','MNT 4.1.2','MNT 4.1.3','MNT 4.1.4','MNT 4.1.5',
    'MNT 4.2.1','MNT 4.2.2','MNT 4.2.3','MNT 4.2.4',
    'MNT 4.3.1','MNT 4.3.2','MNT 4.3.3',

    // 5. Technical Records and Documentation
    'MNT 5.1.1','MNT 5.1.2','MNT 5.1.3','MNT 5.1.4',
    'MNT 5.2.1','MNT 5.2.2','MNT 5.2.3',
    'MNT 5.3.1','MNT 5.3.2','MNT 5.3.3',

    // 6. Maintenance Procedures
    'MNT 6.1.1','MNT 6.1.2','MNT 6.1.3','MNT 6.1.4',
    'MNT 6.2.1','MNT 6.2.2','MNT 6.2.3',
    'MNT 6.3.1','MNT 6.3.2','MNT 6.3.3',
    'MNT 6.4.1','MNT 6.4.2','MNT 6.4.3',
  ],

  // ════════════════════════════════════════════════════════
  //  CAB  객실  (Cabin Operations)
  // ════════════════════════════════════════════════════════
  CAB: [
    // 1. Organization and Authority
    'CAB 1.1.1','CAB 1.1.2','CAB 1.1.3','CAB 1.1.4',
    'CAB 1.2.1','CAB 1.2.2','CAB 1.2.3',
    'CAB 1.3.1','CAB 1.3.2','CAB 1.3.3',

    // 2. Crew Qualification and Training
    'CAB 2.1.1','CAB 2.1.2','CAB 2.1.3','CAB 2.1.4','CAB 2.1.5',
    'CAB 2.1.6','CAB 2.1.7','CAB 2.1.8',
    'CAB 2.2.1','CAB 2.2.2','CAB 2.2.3','CAB 2.2.4',
    'CAB 2.3.1','CAB 2.3.2','CAB 2.3.3',

    // 3. Cabin Operations Procedures
    'CAB 3.1.1','CAB 3.1.2','CAB 3.1.3','CAB 3.1.4','CAB 3.1.5',
    'CAB 3.2.1','CAB 3.2.2','CAB 3.2.3',
    'CAB 3.3.1','CAB 3.3.2','CAB 3.3.3','CAB 3.3.4',
    'CAB 3.4.1','CAB 3.4.2','CAB 3.4.3',
    'CAB 3.5.1','CAB 3.5.2','CAB 3.5.3',

    // 4. Emergency Procedures
    'CAB 4.1.1','CAB 4.1.2','CAB 4.1.3',
    'CAB 4.2.1','CAB 4.2.2','CAB 4.2.3','CAB 4.2.4',
  ],

  // ════════════════════════════════════════════════════════
  //  GRH  운송  (Ground Handling)
  // ════════════════════════════════════════════════════════
  GRH: [
    // 1. Organization and Authority
    'GRH 1.1.1','GRH 1.1.2','GRH 1.1.3','GRH 1.1.4',
    'GRH 1.2.1','GRH 1.2.2','GRH 1.2.3',

    // 2. Training and Qualification
    'GRH 2.1.1','GRH 2.1.2','GRH 2.1.3','GRH 2.1.4','GRH 2.1.5',
    'GRH 2.2.1','GRH 2.2.2','GRH 2.2.3',

    // 3. Ground Operations Procedures
    'GRH 3.1.1','GRH 3.1.2','GRH 3.1.3','GRH 3.1.4','GRH 3.1.5',
    'GRH 3.2.1','GRH 3.2.2','GRH 3.2.3','GRH 3.2.4',
    'GRH 3.3.1','GRH 3.3.2','GRH 3.3.3',
    'GRH 3.4.1','GRH 3.4.2','GRH 3.4.3','GRH 3.4.4',
    'GRH 3.5.1','GRH 3.5.2','GRH 3.5.3',
    'GRH 3.6.1','GRH 3.6.2','GRH 3.6.3',

    // 4. Load Planning and Control
    'GRH 4.1.1','GRH 4.1.2','GRH 4.1.3','GRH 4.1.4',
    'GRH 4.2.1','GRH 4.2.2','GRH 4.2.3',
    'GRH 4.3.1','GRH 4.3.2',

    // 5. Aircraft Fueling
    'GRH 5.1.1','GRH 5.1.2','GRH 5.1.3','GRH 5.1.4',
    'GRH 5.2.1','GRH 5.2.2','GRH 5.2.3',
  ],

  // ════════════════════════════════════════════════════════
  //  CGO  화물운송  (Cargo Operations)
  // ════════════════════════════════════════════════════════
  CGO: [
    // 1. Organization
    'CGO 1.1.1','CGO 1.1.2','CGO 1.1.3','CGO 1.1.4',
    'CGO 1.2.1','CGO 1.2.2','CGO 1.2.3',

    // 2. Training and Qualification
    'CGO 2.1.1','CGO 2.1.2','CGO 2.1.3','CGO 2.1.4',
    'CGO 2.2.1','CGO 2.2.2','CGO 2.2.3',

    // 3. Dangerous Goods
    'CGO 3.1.1','CGO 3.1.2','CGO 3.1.3','CGO 3.1.4','CGO 3.1.5',
    'CGO 3.2.1','CGO 3.2.2','CGO 3.2.3',

    // 4. Cargo Operations Procedures
    'CGO 4.1.1','CGO 4.1.2','CGO 4.1.3',
    'CGO 4.2.1','CGO 4.2.2','CGO 4.2.3','CGO 4.2.4',
  ],

  // ════════════════════════════════════════════════════════
  //  SEC  항공보안  (Security)
  // ════════════════════════════════════════════════════════
  SEC: [
    // 1. Organization and Authority
    'SEC 1.1.1','SEC 1.1.2','SEC 1.1.3','SEC 1.1.4',
    'SEC 1.2.1','SEC 1.2.2','SEC 1.2.3',

    // 2. Training and Qualification
    'SEC 2.1.1','SEC 2.1.2','SEC 2.1.3','SEC 2.1.4',
    'SEC 2.2.1','SEC 2.2.2',

    // 3. Security Procedures
    'SEC 3.1.1','SEC 3.1.2','SEC 3.1.3','SEC 3.1.4',
    'SEC 3.2.1','SEC 3.2.2','SEC 3.2.3',
    'SEC 3.3.1','SEC 3.3.2','SEC 3.3.3',
    'SEC 3.4.1','SEC 3.4.2',
  ],
};
