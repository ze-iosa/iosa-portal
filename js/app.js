/* IOSA Portal - Main Application */
let APP_DATA = DB.load();

// ─── Navigation ───────────────────────────────────────────────
function navigate(section) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const el = document.getElementById('section-' + section);
  if (el) el.classList.add('active');
  const navEl = document.querySelector(`[data-section="${section}"]`);
  if (navEl) navEl.classList.add('active');
  const titles = {
    dashboard: '대시보드',
    certification: 'IOSA 인증 정보',
    ism: 'ISM 개정 관리',
    preparation: '준비 단계 관리',
    internal: '내부심사 관리',
    application: 'IOSA 신청 관리',
    coordination: '심사원 코디네이션',
    mainaudit: '본점검 관리',
    cap: 'CAP / FAT 관리',
    rbi: 'RBI 재인증 준비',
    cr:  'Conformance Report 작성',
  };
  document.getElementById('page-title').textContent = titles[section] || '';
  renderSection(section);
}

function renderSection(s) {
  const map = {
    dashboard: renderDashboard,
    certification: renderCertification,
    ism: renderISM,
    preparation: renderPreparation,
    internal: renderInternal,
    application: renderApplication,
    coordination: renderCoordination,
    mainaudit: renderMainAudit,
    cap: renderCAP,
    rbi: renderRBI,
  };
  if (map[s]) map[s]();
}

// ─── DASHBOARD ────────────────────────────────────────────────
function renderDashboard() {
  const c = APP_DATA.certification;
  const daysToExpiry = DateUtil.daysUntil(c.registrationExpiry);
  const daysToRenewalWindow = DateUtil.daysUntil(c.renewalWindowStart);
  const daysToFindingsDeadline = DateUtil.daysUntil(c.findingsCloseDeadline);
  const totalDays = DateUtil.daysUntil(c.registrationExpiry) + (DateUtil.daysUntil(c.auditCloseDate) < 0 ? Math.abs(DateUtil.daysUntil(c.auditCloseDate)) : 0);
  const elapsed = 24*30 - daysToExpiry; // approximate days elapsed

  // Expiry color
  let expiryColor = '#198754', expiryBg = 'rgba(25,135,84,0.15)';
  if (daysToExpiry < 180) { expiryColor = '#fd7e14'; expiryBg = 'rgba(253,126,20,0.15)'; }
  if (daysToExpiry < 60)  { expiryColor = '#dc3545'; expiryBg = 'rgba(220,53,69,0.15)'; }

  // CAP status
  const capStatus = APP_DATA.cap.status;
  const fatStatus = APP_DATA.fat.status;

  // Upcoming deadlines
  const deadlines = [
    { label: 'CAP 합의 마감', date: c.capDeadline, icon: 'fa-handshake' },
    { label: '모든 지적사항 종결 마감', date: c.findingsCloseDeadline, icon: 'fa-check-circle' },
    { label: 'IATA Connect 프로파일 갱신', date: DateUtil.addMonths(c.auditCloseDate, 6), icon: 'fa-user-circle' },
    { label: '재인증 심사 윈도우 시작', date: c.renewalWindowStart, icon: 'fa-calendar-alt' },
    { label: '인증 만료', date: c.registrationExpiry, icon: 'fa-certificate' },
  ].map(d => ({ ...d, days: DateUtil.daysUntil(d.date) }))
   .sort((a,b) => a.days - b.days);

  document.getElementById('section-dashboard').innerHTML = `
<div class="row g-3 mb-3">
  <!-- Cert Banner -->
  <div class="col-12">
    <div class="cert-banner">
      <div class="row align-items-center">
        <div class="col-md-7">
          <div class="d-flex align-items-center gap-3 mb-3">
            <span class="iata-logo" style="background:rgba(255,255,255,0.15);color:white;font-size:0.8rem;">IOSA</span>
            <div>
              <div style="font-size:1.3rem;font-weight:800;">이스타항공 (ZE)</div>
              <div style="opacity:0.8;font-size:0.85rem;">IOSA 등록 항공사 · Initial Audit 완료</div>
            </div>
          </div>
          <div class="row g-3">
            <div class="col-6 col-md-3">
              <div style="opacity:0.7;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;">초도심사</div>
              <div style="font-weight:700;font-size:0.9rem;">${DateUtil.format(c.auditCloseDate)}</div>
            </div>
            <div class="col-6 col-md-3">
              <div style="opacity:0.7;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;">적용 ISM</div>
              <div style="font-weight:700;font-size:0.9rem;">Ed. ${c.ismEdition}</div>
            </div>
            <div class="col-6 col-md-3">
              <div style="opacity:0.7;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;">재인증 방식</div>
              <div style="font-weight:700;font-size:0.9rem;">RBI (위험기반)</div>
            </div>
            <div class="col-6 col-md-3">
              <div style="opacity:0.7;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;">인증 만료</div>
              <div style="font-weight:700;font-size:0.9rem;">${DateUtil.format(c.registrationExpiry)}</div>
            </div>
          </div>
        </div>
        <div class="col-md-5 text-md-end mt-3 mt-md-0">
          <div class="d-flex justify-content-md-end align-items-center gap-3">
            <div class="text-end">
              <div style="opacity:0.7;font-size:0.75rem;">인증 만료까지</div>
              <div style="font-size:2.5rem;font-weight:900;line-height:1;">${daysToExpiry}</div>
              <div style="opacity:0.7;font-size:0.75rem;">일 남음</div>
            </div>
            <div class="countdown-circle" style="border-color:${expiryColor}50;">
              <div class="countdown-number" style="color:${expiryColor};">${Math.round(daysToExpiry/30)}</div>
              <div class="countdown-unit">개월</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Quick metrics -->
<div class="row g-3 mb-3">
  <div class="col-6 col-md-3">
    <div class="metric-card">
      <div class="metric-icon" style="background:#dbeafe;color:var(--eastar-red);"><i class="fas fa-flag-checkered"></i></div>
      <div>
        <div class="metric-value">${daysToRenewalWindow > 0 ? daysToRenewalWindow : 0}</div>
        <div class="metric-label">재인증 윈도우까지 (일)</div>
      </div>
    </div>
  </div>
  <div class="col-6 col-md-3">
    <div class="metric-card">
      <div class="metric-icon" style="background:#fef3c7;color:#92400e;"><i class="fas fa-exclamation-triangle"></i></div>
      <div>
        <div class="metric-value">${APP_DATA.cap.findings.filter(f=>f.status!=='closed').length}</div>
        <div class="metric-label">미결 지적사항</div>
      </div>
    </div>
  </div>
  <div class="col-6 col-md-3">
    <div class="metric-card">
      <div class="metric-icon" style="background:#d1fae5;color:#065f46;"><i class="fas fa-tasks"></i></div>
      <div>
        <div class="metric-value">${APP_DATA.rbiPrep.prepTasks.filter(t=>t.status==='completed').length}/${APP_DATA.rbiPrep.prepTasks.length}</div>
        <div class="metric-label">RBI 준비 완료</div>
      </div>
    </div>
  </div>
  <div class="col-6 col-md-3">
    <div class="metric-card">
      <div class="metric-icon" style="background:#fce7f3;color:#9d174d;"><i class="fas fa-book-open"></i></div>
      <div>
        <div class="metric-value">Ed.18</div>
        <div class="metric-label">현행 ISM (2026.01 발효)</div>
      </div>
    </div>
  </div>
</div>

<div class="row g-3">
  <!-- Deadlines -->
  <div class="col-md-5">
    <div class="status-card h-100">
      <div class="d-flex align-items-center gap-2 mb-3">
        <i class="fas fa-bell text-warning"></i>
        <strong>주요 데드라인</strong>
      </div>
      ${deadlines.map(d => {
        const isPast = d.days < 0;
        const cls = d.days < 0 ? 'alert-urgent' : d.days <= 90 ? 'alert-deadline' : 'alert-info-custom';
        return `<div class="${cls}">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <i class="fas ${d.icon} me-2" style="opacity:0.7;"></i>
              <span style="font-size:0.85rem;font-weight:600;">${d.label}</span>
              <div style="font-size:0.75rem;color:#64748b;margin-top:2px;">${DateUtil.format(d.date)}</div>
            </div>
            ${DateUtil.urgencyBadge(d.days)}
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- Phase Progress -->
  <div class="col-md-4">
    <div class="status-card h-100">
      <div class="d-flex align-items-center gap-2 mb-3">
        <i class="fas fa-route" style="color:var(--eastar-red);"></i>
        <strong>IOSA 전체 진행 현황</strong>
      </div>
      <div class="phase-timeline">
        ${[
          { label: 'IATA 외부교육', sub: 'ISM Ed.17 이수', status: 'done', date: '2025 초도심사 前' },
          { label: '전파교육 & 내부심사', sub: 'CR 작성 완료', status: 'done', date: '2025.07 이전' },
          { label: '초도심사 수검', sub: '2025.07.28~08.01 완료', status: 'done', date: '2025-08-01' },
          { label: 'CAP 합의', sub: `마감: ${DateUtil.format(c.capDeadline)}`, status: capStatus === 'approved' || capStatus === 'closed' ? 'done' : capStatus === 'submitted' || capStatus === 'under_review' ? 'active' : 'pending', date: c.capDeadline },
          { label: 'FAT 제출 & 최종승인', sub: '증빙자료 제출 후 QC', status: fatStatus === 'approved' ? 'done' : fatStatus === 'submitted' ? 'active' : 'pending', date: '' },
          { label: 'ISM Ed.18 Gap 분석', sub: '2026.01 발효 대응', status: 'active', date: '2026-07-01' },
          { label: 'RBI 재인증 내부심사', sub: 'Ed.18 기반 CR 작성', status: 'pending', date: '2026-11-01' },
          { label: 'RBI 재인증 심사', sub: '2027.02~08 (Maturity 포함)', status: 'pending', date: '2027-06-01' },
        ].map(p => `
          <div class="phase-item">
            <div class="phase-dot ${p.status}">
              <i class="fas ${p.status==='done'?'fa-check':p.status==='active'?'fa-circle-notch fa-spin':'fa-clock'}"></i>
            </div>
            <div class="phase-content">
              <div class="phase-title">${p.label}</div>
              <div class="phase-desc">${p.sub}</div>
              ${p.date ? `<div class="phase-date"><i class="fas fa-calendar-alt me-1"></i>${p.date.includes('-') ? DateUtil.format(p.date) : p.date}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- RBI 준비 현황 -->
  <div class="col-md-3">
    <div class="status-card h-100">
      <div class="d-flex align-items-center gap-2 mb-3">
        <i class="fas fa-chart-line" style="color:var(--eastar-red);"></i>
        <strong>RBI 재인증 준비</strong>
      </div>
      <div style="font-size:0.75rem;color:#64748b;margin-bottom:12px;">
        심사방식: Risk-Based Inspection (위험기반)<br>
        성숙도 평가: Established / Mature / Leading
      </div>
      ${APP_DATA.rbiPrep.prepTasks.map(t => {
        const badgeMap = { not_started: 'badge-notstarted', in_progress: 'badge-inprogress', completed: 'badge-done' };
        const labelMap = { not_started: '미시작', in_progress: '진행중', completed: '완료' };
        return `<div class="d-flex justify-content-between align-items-center py-2 border-bottom">
          <div style="font-size:0.8rem;">${t.task.length > 22 ? t.task.substring(0,22)+'...' : t.task}</div>
          <span class="badge-status ${badgeMap[t.status]}">${labelMap[t.status]}</span>
        </div>`;
      }).join('')}
      <div class="mt-3">
        <div class="d-flex justify-content-between mb-1">
          <span style="font-size:0.75rem;color:#64748b;">전체 진행률</span>
          <span style="font-size:0.75rem;font-weight:700;">${Math.round(APP_DATA.rbiPrep.prepTasks.filter(t=>t.status==='completed').length/APP_DATA.rbiPrep.prepTasks.length*100)}%</span>
        </div>
        <div class="progress-custom">
          <div class="progress-bar bg-primary" style="width:${Math.round(APP_DATA.rbiPrep.prepTasks.filter(t=>t.status==='completed').length/APP_DATA.rbiPrep.prepTasks.length*100)}%"></div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ─── CERTIFICATION INFO ────────────────────────────────────────
function renderCertification() {
  const c = APP_DATA.certification;
  const daysToExpiry = DateUtil.daysUntil(c.registrationExpiry);

  // Safe fallback to defaults if certPhases is missing
  const DEFAULT_PHASES = {
    phase1: {
      period: '2025년 7월 28일 ~ 8월 1일',
      auditor: 'Perry Chou',
      ism: 'ISM Ed.17 (17.1)',
      findings: '21 Findings / 7 Observations',
      cert: '2025.08.01 ~ 2027.08.01',
      notes: 'CAP/FAT 전체 종결 완료'
    },
    phase2: {
      item1title: '심사원 교육', item1desc: '내부심사원 역량강화 교육 실시',
      item2title: '내부심사 실시', item2desc: 'ISM Ed.18 기준 내부심사 수행',
      item3title: '사전 준비', item3desc: 'CR 작성 · IATA Connect 프로파일 업데이트',
      item4title: 'ISM Ed.18 Gap 분석', item4desc: '개정 사항 분석 및 운영 문서 개정',
      notes: ''
    },
    phase3: {
      period: '2027년 3월 중순',
      type: 'RBI (Risk-Based Inspection)',
      ism: 'ISM Ed.18 Rev.1',
      notes: ''
    }
  };
  if (!APP_DATA.certPhases) APP_DATA.certPhases = JSON.parse(JSON.stringify(DEFAULT_PHASES));
  const p1 = APP_DATA.certPhases.phase1 || DEFAULT_PHASES.phase1;
  const p2 = APP_DATA.certPhases.phase2 || DEFAULT_PHASES.phase2;
  const p3 = APP_DATA.certPhases.phase3 || DEFAULT_PHASES.phase3;

  const showAdmin = typeof isAdmin !== 'undefined' && isAdmin;
  const editBtn = (phase) => showAdmin
    ? `<button onclick="editCertPhase('${phase}')" style="position:absolute;top:14px;right:14px;background:#fff;border:1px solid #e0e0e0;border-radius:4px;padding:3px 10px;font-size:0.68rem;font-weight:700;color:#555;cursor:pointer;"><i class="fas fa-pen me-1"></i>수정</button>`
    : '';

  document.getElementById('section-certification').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">IOSA 인증 정보</h2>
    <p class="sect-sub">IOSA 인증 라이프사이클 로드맵 · 이스타항공 ZE</p>
  </div>
</div>

<!-- Compact info row -->
<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px;">
  <div style="flex:1;min-width:160px;background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:12px 16px;">
    <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:4px;">인증 유효기간</div>
    <div style="font-size:0.9rem;font-weight:700;">${p1.cert || '2025.08.01 ~ 2027.08.01'}</div>
  </div>
  <div style="flex:1;min-width:160px;background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:12px 16px;">
    <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:4px;">재인증 윈도우</div>
    <div style="font-size:0.9rem;font-weight:700;">${DateUtil.format(c.renewalWindowStart)} ~ ${DateUtil.format(c.renewalWindowEnd)}</div>
  </div>
  <div style="flex:1;min-width:160px;background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:12px 16px;">
    <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:4px;">인증 만료까지</div>
    <div style="font-size:0.9rem;font-weight:700;color:${daysToExpiry < 180 ? '#fd7e14' : '#198754'};">${daysToExpiry}일 남음</div>
  </div>
  <div style="flex:1;min-width:160px;background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:12px 16px;">
    <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:4px;">적용 ISM (초도)</div>
    <div style="font-size:0.9rem;font-weight:700;">Ed. ${c.ismEdition}</div>
  </div>
</div>

<!-- Timeline -->
<div style="position:relative;padding-left:32px;">
  <!-- Vertical line -->
  <div style="position:absolute;left:11px;top:16px;bottom:16px;width:2px;background:#e0e0e0;border-radius:1px;"></div>

  <!-- Phase 1: 2025 완료 -->
  <div style="position:relative;margin-bottom:24px;">
    <div style="position:absolute;left:-32px;top:16px;width:22px;height:22px;border-radius:50%;background:var(--eastar-red);border:3px solid #fff;box-shadow:0 0 0 2px var(--eastar-red);display:flex;align-items:center;justify-content:center;">
      <i class="fas fa-check" style="color:#fff;font-size:0.6rem;"></i>
    </div>
    <div style="position:relative;background:#fff;border:1px solid #e8e8e8;border-radius:8px;padding:20px 22px;">
      ${editBtn('phase1')}
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <span style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:var(--eastar-red);">Phase 1 — 2025년</span>
        <span style="background:#d1fae5;color:#065f46;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:3px;">완료 ✓</span>
      </div>
      <div style="font-size:1.05rem;font-weight:800;color:#1a1a1a;margin-bottom:14px;">Initial IOSA 완료</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">
        <div style="background:#fafafa;border:1px solid #f0f0f0;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#888;margin-bottom:6px;text-transform:uppercase;">심사 기간</div>
          <div style="font-size:0.85rem;font-weight:600;">${p1.period}</div>
          <div style="font-size:0.75rem;color:#64748b;margin-top:3px;">IOSA 초도심사 (Initial Audit)</div>
          <div style="font-size:0.75rem;color:#64748b;">Lead Auditor: ${p1.auditor}</div>
        </div>
        <div style="background:#fafafa;border:1px solid #f0f0f0;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#888;margin-bottom:6px;text-transform:uppercase;">심사 결과</div>
          <div style="font-size:0.85rem;font-weight:600;">${p1.ism} 적용</div>
          <div style="font-size:0.75rem;color:#64748b;margin-top:3px;">${p1.findings}</div>
        </div>
        <div style="background:#fafafa;border:1px solid #f0f0f0;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#888;margin-bottom:6px;text-transform:uppercase;">인증서 취득</div>
          <div style="font-size:0.85rem;font-weight:600;">유효 ${p1.cert}</div>
          <div style="font-size:0.75rem;color:#64748b;margin-top:3px;">${p1.notes}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Phase 2: 2026 진행중 -->
  <div style="position:relative;margin-bottom:24px;">
    <div style="position:absolute;left:-32px;top:16px;width:22px;height:22px;border-radius:50%;background:#f59e0b;border:3px solid #fff;box-shadow:0 0 0 2px #f59e0b;display:flex;align-items:center;justify-content:center;">
      <i class="fas fa-spinner fa-spin" style="color:#fff;font-size:0.55rem;"></i>
    </div>
    <div style="position:relative;background:#fff;border:2px solid #fbbf24;border-radius:8px;padding:20px 22px;box-shadow:0 2px 12px rgba(251,191,36,0.15);">
      ${editBtn('phase2')}
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <span style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#92400e;">Phase 2 — 2026년</span>
        <span style="background:#fef3c7;color:#92400e;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:3px;">진행중</span>
      </div>
      <div style="font-size:1.05rem;font-weight:800;color:#1a1a1a;margin-bottom:14px;">재인증 준비</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#92400e;margin-bottom:5px;"><i class="fas fa-user-graduate me-1"></i>${p2.item1title}</div>
          <div style="font-size:0.78rem;color:#78350f;">${p2.item1desc}</div>
        </div>
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#92400e;margin-bottom:5px;"><i class="fas fa-clipboard-check me-1"></i>${p2.item2title}</div>
          <div style="font-size:0.78rem;color:#78350f;">${p2.item2desc}</div>
        </div>
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#92400e;margin-bottom:5px;"><i class="fas fa-file-alt me-1"></i>${p2.item3title}</div>
          <div style="font-size:0.78rem;color:#78350f;">${p2.item3desc}</div>
        </div>
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#92400e;margin-bottom:5px;"><i class="fas fa-search me-1"></i>${p2.item4title}</div>
          <div style="font-size:0.78rem;color:#78350f;">${p2.item4desc}</div>
        </div>
      </div>
      ${p2.notes ? `<div style="margin-top:10px;font-size:0.76rem;color:#78350f;padding:6px 10px;background:#fef3c7;border-radius:4px;">${p2.notes}</div>` : ''}
    </div>
  </div>

  <!-- Phase 3: 2027 예정 -->
  <div style="position:relative;">
    <div style="position:absolute;left:-32px;top:16px;width:22px;height:22px;border-radius:50%;background:#d0d0d0;border:3px solid #fff;box-shadow:0 0 0 2px #d0d0d0;display:flex;align-items:center;justify-content:center;">
      <i class="fas fa-flag" style="color:#fff;font-size:0.55rem;"></i>
    </div>
    <div style="position:relative;background:#fff;border:1px solid #e8e8e8;border-radius:8px;padding:20px 22px;opacity:0.85;">
      ${editBtn('phase3')}
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
        <span style="font-size:0.75rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#888;">Phase 3 — ${p3.period}</span>
        <span style="background:#f3f4f6;color:#6b7280;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:3px;">예정</span>
      </div>
      <div style="font-size:1.05rem;font-weight:800;color:#1a1a1a;margin-bottom:14px;">Renewal IOSA 예정</div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
        <div style="background:#fafafa;border:1px solid #f0f0f0;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#888;margin-bottom:5px;"><i class="fas fa-shield-alt me-1"></i>심사 방식</div>
          <div style="font-size:0.78rem;color:#64748b;">${p3.type}</div>
        </div>
        <div style="background:#fafafa;border:1px solid #f0f0f0;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#888;margin-bottom:5px;"><i class="fas fa-book me-1"></i>적용 기준</div>
          <div style="font-size:0.78rem;color:#64748b;">${p3.ism} 적용</div>
        </div>
        <div style="background:#fafafa;border:1px solid #f0f0f0;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#888;margin-bottom:5px;"><i class="fas fa-calendar me-1"></i>심사 예정 시기</div>
          <div style="font-size:0.78rem;color:#64748b;">${p3.period}</div>
        </div>
        ${p3.notes ? `<div style="background:#fafafa;border:1px solid #f0f0f0;border-radius:6px;padding:12px;">
          <div style="font-size:0.7rem;font-weight:700;color:#888;margin-bottom:5px;"><i class="fas fa-sticky-note me-1"></i>비고</div>
          <div style="font-size:0.78rem;color:#64748b;">${p3.notes}</div>
        </div>` : ''}
      </div>
    </div>
  </div>
</div>

<!-- ── Phase Edit Modals ── -->

<!-- Modal Phase 1 -->
<div class="modal fade" id="modal-cert-phase1" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title fw-bold">Phase 1 — 2025 Initial IOSA 수정</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">심사기간</label>
          <input type="text" class="form-control" id="cp1-period">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">Lead Auditor</label>
          <input type="text" class="form-control" id="cp1-auditor">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">ISM 버전</label>
          <input type="text" class="form-control" id="cp1-ism">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">Findings / OBS</label>
          <input type="text" class="form-control" id="cp1-findings">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">인증 유효기간</label>
          <input type="text" class="form-control" id="cp1-cert">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">비고</label>
          <textarea class="form-control" id="cp1-notes" rows="2"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
        <button type="button" class="btn btn-danger fw-bold" onclick="saveCertPhase('phase1')">저장</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Phase 2 -->
<div class="modal fade" id="modal-cert-phase2" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title fw-bold">Phase 2 — 2026 재인증 준비 수정</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">항목 1 제목</label>
          <input type="text" class="form-control" id="cp2-item1title">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">항목 1 설명</label>
          <input type="text" class="form-control" id="cp2-item1desc">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">항목 2 제목</label>
          <input type="text" class="form-control" id="cp2-item2title">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">항목 2 설명</label>
          <input type="text" class="form-control" id="cp2-item2desc">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">항목 3 제목</label>
          <input type="text" class="form-control" id="cp2-item3title">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">항목 3 설명</label>
          <input type="text" class="form-control" id="cp2-item3desc">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">항목 4 제목</label>
          <input type="text" class="form-control" id="cp2-item4title">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">항목 4 설명</label>
          <input type="text" class="form-control" id="cp2-item4desc">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">비고</label>
          <textarea class="form-control" id="cp2-notes" rows="2"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
        <button type="button" class="btn btn-danger fw-bold" onclick="saveCertPhase('phase2')">저장</button>
      </div>
    </div>
  </div>
</div>

<!-- Modal Phase 3 -->
<div class="modal fade" id="modal-cert-phase3" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title fw-bold">Phase 3 — 2027 Renewal IOSA 수정</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">심사 예정 시기</label>
          <input type="text" class="form-control" id="cp3-period">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">심사 방식</label>
          <input type="text" class="form-control" id="cp3-type">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">적용 ISM</label>
          <input type="text" class="form-control" id="cp3-ism">
        </div>
        <div class="mb-3">
          <label class="form-label fw-bold" style="font-size:0.8rem;">비고</label>
          <textarea class="form-control" id="cp3-notes" rows="2"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
        <button type="button" class="btn btn-danger fw-bold" onclick="saveCertPhase('phase3')">저장</button>
      </div>
    </div>
  </div>
</div>`;
}

function editCertPhase(phase) {
  if (!APP_DATA.certPhases || !APP_DATA.certPhases[phase]) return;
  const d = APP_DATA.certPhases[phase];
  if (phase === 'phase1') {
    document.getElementById('cp1-period').value   = d.period   || '';
    document.getElementById('cp1-auditor').value  = d.auditor  || '';
    document.getElementById('cp1-ism').value      = d.ism      || '';
    document.getElementById('cp1-findings').value = d.findings || '';
    document.getElementById('cp1-cert').value     = d.cert     || '';
    document.getElementById('cp1-notes').value    = d.notes    || '';
  } else if (phase === 'phase2') {
    document.getElementById('cp2-item1title').value = d.item1title || '';
    document.getElementById('cp2-item1desc').value  = d.item1desc  || '';
    document.getElementById('cp2-item2title').value = d.item2title || '';
    document.getElementById('cp2-item2desc').value  = d.item2desc  || '';
    document.getElementById('cp2-item3title').value = d.item3title || '';
    document.getElementById('cp2-item3desc').value  = d.item3desc  || '';
    document.getElementById('cp2-item4title').value = d.item4title || '';
    document.getElementById('cp2-item4desc').value  = d.item4desc  || '';
    document.getElementById('cp2-notes').value      = d.notes      || '';
  } else if (phase === 'phase3') {
    document.getElementById('cp3-period').value = d.period || '';
    document.getElementById('cp3-type').value   = d.type   || '';
    document.getElementById('cp3-ism').value    = d.ism    || '';
    document.getElementById('cp3-notes').value  = d.notes  || '';
  }
  new bootstrap.Modal(document.getElementById('modal-cert-' + phase)).show();
}

function saveCertPhase(phase) {
  if (!APP_DATA.certPhases) APP_DATA.certPhases = {};
  if (!APP_DATA.certPhases[phase]) APP_DATA.certPhases[phase] = {};
  const d = APP_DATA.certPhases[phase];
  if (phase === 'phase1') {
    d.period   = document.getElementById('cp1-period').value;
    d.auditor  = document.getElementById('cp1-auditor').value;
    d.ism      = document.getElementById('cp1-ism').value;
    d.findings = document.getElementById('cp1-findings').value;
    d.cert     = document.getElementById('cp1-cert').value;
    d.notes    = document.getElementById('cp1-notes').value;
  } else if (phase === 'phase2') {
    d.item1title = document.getElementById('cp2-item1title').value;
    d.item1desc  = document.getElementById('cp2-item1desc').value;
    d.item2title = document.getElementById('cp2-item2title').value;
    d.item2desc  = document.getElementById('cp2-item2desc').value;
    d.item3title = document.getElementById('cp2-item3title').value;
    d.item3desc  = document.getElementById('cp2-item3desc').value;
    d.item4title = document.getElementById('cp2-item4title').value;
    d.item4desc  = document.getElementById('cp2-item4desc').value;
    d.notes      = document.getElementById('cp2-notes').value;
  } else if (phase === 'phase3') {
    d.period = document.getElementById('cp3-period').value;
    d.type   = document.getElementById('cp3-type').value;
    d.ism    = document.getElementById('cp3-ism').value;
    d.notes  = document.getElementById('cp3-notes').value;
  }
  DB.save(APP_DATA);
  const modalEl = document.getElementById('modal-cert-' + phase);
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();
  renderCertification();
}

// ─── ISM REVISIONS ────────────────────────────────────────────
function renderISM() {
  const versions = APP_DATA.ismVersions;
  document.getElementById('section-ism').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">ISM 개정 관리</h2>
    <p class="sect-sub">IOSA Standards Manual 버전 이력 및 변경 사항</p>
  </div>
</div>
<div class="row g-3">
  <div class="col-12">
    <div class="alert-info-custom">
      <i class="fas fa-info-circle me-2"></i>
      <strong>ISM 개정 주기:</strong> 연 1회 (통상 10월 발효). ISM Ed.18은 2026년 1월 1일 발효 — 재인증 심사 적용 버전.
      <strong>RBI Maturity Criteria Ed.3</strong>은 2025년 6월 1일 발효 (2025.05.01 이후 현장심사 시작 건 적용).
    </div>
  </div>
  ${versions.map(v => `
  <div class="col-md-4">
    <div class="ism-card ${v.status === 'current' ? 'current' : ''}">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div>
          <span style="font-size:1.5rem;font-weight:900;color:var(--eastar-red);">Ed. ${v.edition}${v.revision ? ' Rev.'+v.revision : ''}</span>
          <div style="font-size:0.72rem;color:#64748b;">발효: ${DateUtil.format(v.effectiveDate)}</div>
        </div>
        <span class="badge-status ${v.status==='current'?'badge-active':v.status==='superseded_current'?'badge-warning':'badge-notstarted'}">
          ${v.status==='current'?'현행':v.status==='superseded_current'?'현행(전환중)':'구버전'}
        </span>
      </div>
      <div style="font-size:0.82rem;color:#475569;margin-bottom:10px;">${v.notes}</div>
      ${v.keyChanges ? `<div class="fw-bold mb-1" style="font-size:0.75rem;color:#64748b;">주요 변경사항</div>
      <ul style="font-size:0.78rem;padding-left:16px;margin:0;">
        ${v.keyChanges.map(c=>`<li>${c}</li>`).join('')}
      </ul>` : ''}
    </div>
  </div>`).join('')}

  <div class="col-12">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-tasks me-2" style="color:var(--eastar-red);"></i>ISM Ed.18 전환 대응 체크리스트</h6>
        <button class="btn btn-sm btn-iata" onclick="addISMTask()"><i class="fas fa-plus me-1"></i>항목 추가</button>
      </div>
      <div id="ism-checklist">
        ${renderISMChecklist()}
      </div>
    </div>
  </div>

  <div class="col-12">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-balance-scale me-2" style="color:#7c3aed;"></i>ISM Ed.17 → Ed.18 Gap 분석 현황</h6>
      <div class="table-responsive">
        <table class="table data-table">
          <thead><tr><th>부문</th><th>주요 변경사항</th><th>대응 상태</th><th>담당자</th><th>완료 기한</th></tr></thead>
          <tbody id="ism-gap-tbody">
            ${renderISMGapRows()}
          </tbody>
        </table>
      </div>
      <button class="btn btn-sm btn-outline-primary mt-2" onclick="addGapItem()"><i class="fas fa-plus me-1"></i>항목 추가</button>
    </div>
  </div>
</div>`;
}

function renderISMChecklist() {
  const checks = APP_DATA.ismTasks || [
    { id:1, text:'ISM Ed.18 접수 및 내부 배포', done: false },
    { id:2, text:'Ed.17 대비 개정사항 비교 분석 완료', done: false },
    { id:3, text:'변경사항 전파교육 계획 수립', done: false },
    { id:4, text:'관련 내부 문서/절차서 개정', done: false },
    { id:5, text:'Conformance Report (CR) Ed.18 버전 준비', done: false },
    { id:6, text:'내부심사 체크리스트 Ed.18 버전 적용', done: false },
  ];
  APP_DATA.ismTasks = checks;
  return checks.map(c => `
    <div class="check-item">
      <input type="checkbox" id="ism-chk-${c.id}" ${c.done?'checked':''} onchange="toggleISMCheck(${c.id})">
      <label for="ism-chk-${c.id}" style="font-size:0.875rem;cursor:pointer;${c.done?'text-decoration:line-through;color:#94a3b8;':''}">${c.text}</label>
    </div>`).join('');
}

function renderISMGapRows() {
  const gaps = APP_DATA.ismGaps || [
    { dept:'ORG', change:'Management System 요건 강화', status:'not_started', owner:'', due:'2026-06-01' },
    { dept:'FLT', change:'비행운항 표준 업데이트', status:'not_started', owner:'', due:'2026-07-01' },
    { dept:'DSP', change:'Dispatch 절차 개정', status:'not_started', owner:'', due:'2026-07-01' },
    { dept:'MNT', change:'정비 관련 요건 변경', status:'not_started', owner:'', due:'2026-07-01' },
    { dept:'GRH', change:'지상조업 표준 업데이트', status:'not_started', owner:'', due:'2026-08-01' },
    { dept:'CAB', change:'객실 안전 요건 변경', status:'not_started', owner:'', due:'2026-08-01' },
  ];
  APP_DATA.ismGaps = gaps;
  const badgeMap = { not_started:'badge-notstarted', in_progress:'badge-inprogress', completed:'badge-done' };
  const labelMap = { not_started:'미시작', in_progress:'진행중', completed:'완료' };
  return gaps.map((g,i) => `
    <tr>
      <td><span class="badge bg-secondary">${g.dept}</span></td>
      <td>${g.change}</td>
      <td>
        <select class="form-select form-select-sm" style="width:auto;" onchange="updateGapStatus(${i}, this.value)">
          <option value="not_started" ${g.status==='not_started'?'selected':''}>미시작</option>
          <option value="in_progress" ${g.status==='in_progress'?'selected':''}>진행중</option>
          <option value="completed" ${g.status==='completed'?'selected':''}>완료</option>
        </select>
      </td>
      <td><input type="text" class="form-control form-control-sm" value="${g.owner}" placeholder="담당자" style="width:100px;" onchange="updateGapOwner(${i}, this.value)"></td>
      <td>${DateUtil.format(g.due)}</td>
    </tr>`).join('');
}

function toggleISMCheck(id) {
  const task = (APP_DATA.ismTasks||[]).find(t=>t.id===id);
  if(task) { task.done = !task.done; DB.save(APP_DATA); renderISM(); }
}
function updateGapStatus(i, val) {
  if(APP_DATA.ismGaps && APP_DATA.ismGaps[i]) { APP_DATA.ismGaps[i].status = val; DB.save(APP_DATA); }
}
function updateGapOwner(i, val) {
  if(APP_DATA.ismGaps && APP_DATA.ismGaps[i]) { APP_DATA.ismGaps[i].owner = val; DB.save(APP_DATA); }
}

// ─── PREPARATION ──────────────────────────────────────────────
function renderPreparation() {
  const p = APP_DATA.preparation;
  document.getElementById('section-preparation').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">심사 준비 관리</h2>
    <p class="sect-sub">교육 이수 · 내부심사 · 신청 준비 현황</p>
  </div>
</div>
<div class="row g-3">
  <!-- 외부교육 -->
  <div class="col-md-6">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-graduation-cap me-2" style="color:var(--eastar-red);"></i>IATA 외부교육 이수</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-training')"><i class="fas fa-plus me-1"></i>추가</button>
      </div>
      <div id="training-list">
        ${p.externalTrainings.length === 0
          ? '<div class="empty-state"><i class="fas fa-graduation-cap"></i><p>교육 이수 기록을 추가하세요</p></div>'
          : p.externalTrainings.map((t,i) => `
            <div class="cap-item">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="fw-bold" style="font-size:0.875rem;">${t.courseName}</div>
                  <div style="font-size:0.78rem;color:#64748b;">${t.provider} · ${DateUtil.format(t.date)}</div>
                  <div style="font-size:0.75rem;color:#64748b;">${t.attendee}</div>
                </div>
                <div class="d-flex align-items-start gap-2">
                  <span class="badge-status badge-done">이수완료</span>
                  <button class="btn btn-sm btn-outline-danger" onclick="deleteTraining(${i})"><i class="fas fa-trash"></i></button>
                </div>
              </div>
            </div>`).join('')
        }
      </div>
    </div>
  </div>

  <!-- 교육자료 작성 -->
  <div class="col-md-6">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-file-powerpoint me-2" style="color:#c0392b;"></i>전파교육 자료 작성</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-material')"><i class="fas fa-plus me-1"></i>추가</button>
      </div>
      <div id="material-list">
        ${p.trainingMaterials.length === 0
          ? '<div class="empty-state"><i class="fas fa-file-alt"></i><p>교육자료를 추가하세요</p></div>'
          : p.trainingMaterials.map((m,i) => `
            <div class="cap-item">
              <div class="d-flex justify-content-between">
                <div>
                  <div class="fw-bold" style="font-size:0.875rem;">${m.title}</div>
                  <div style="font-size:0.78rem;color:#64748b;">${m.dept} · ${DateUtil.format(m.date)}</div>
                </div>
                <span class="badge-status ${m.status==='completed'?'badge-done':'badge-inprogress'}">${m.status==='completed'?'완료':'작성중'}</span>
              </div>
            </div>`).join('')
        }
      </div>
    </div>
  </div>

  <!-- 부문별 심사원/담당자 발령 -->
  <div class="col-md-6">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-user-tie me-2" style="color:#065f46;"></i>부문별 심사원 & 담당자 발령</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-appointment')"><i class="fas fa-plus me-1"></i>추가</button>
      </div>
      <div class="table-responsive">
        <table class="table data-table">
          <thead><tr><th>부문</th><th>심사원/담당자</th><th>직위</th><th>발령일</th><th>상태</th></tr></thead>
          <tbody>
            ${p.auditorAppointments.length === 0
              ? `<tr><td colspan="5" class="text-center text-muted py-3">발령 내역이 없습니다</td></tr>`
              : p.auditorAppointments.map((a,i) => `
                <tr>
                  <td><span class="badge bg-primary">${a.dept}</span></td>
                  <td>${a.name}</td>
                  <td>${a.position}</td>
                  <td>${DateUtil.format(a.date)}</td>
                  <td><span class="badge-status badge-active">발령완료</span></td>
                </tr>`).join('')
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- 전파교육 실시 -->
  <div class="col-md-6">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-chalkboard-teacher me-2" style="color:#7c3aed;"></i>전파교육 실시 현황</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-propagation')"><i class="fas fa-plus me-1"></i>추가</button>
      </div>
      ${p.propagationTrainings.length === 0
        ? '<div class="empty-state"><i class="fas fa-chalkboard-teacher"></i><p>전파교육 실시 기록을 추가하세요</p></div>'
        : p.propagationTrainings.map((t,i) => `
          <div class="cap-item">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="fw-bold" style="font-size:0.875rem;">${t.dept} 부문</div>
                <div style="font-size:0.78rem;color:#64748b;">${DateUtil.format(t.date)} · 참석: ${t.attendeeCount}명</div>
                <div style="font-size:0.75rem;color:#64748b;">${t.instructor}</div>
              </div>
              <span class="badge-status badge-done">완료</span>
            </div>
          </div>`).join('')
      }
    </div>
  </div>
</div>

<!-- Modals -->
${buildPrepModals()}`;
}

function buildPrepModals() {
  return `
<!-- Training Modal -->
<div class="modal fade" id="modal-training" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">IATA 외부교육 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">교육명</label><input type="text" class="form-control" id="t-courseName" placeholder="예: IOSA Standards Training"></div>
      <div class="mb-3"><label class="form-label">교육기관</label><input type="text" class="form-control" id="t-provider" placeholder="예: IATA"></div>
      <div class="mb-3"><label class="form-label">이수일</label><input type="date" class="form-control" id="t-date"></div>
      <div class="mb-3"><label class="form-label">이수자</label><input type="text" class="form-control" id="t-attendee" placeholder="이름/직책"></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveTraining()">저장</button></div>
  </div></div>
</div>
<!-- Material Modal -->
<div class="modal fade" id="modal-material" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">교육자료 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">자료명</label><input type="text" class="form-control" id="m-title" placeholder="예: FLT 부문 ISM Ed.17 전파교육 자료"></div>
      <div class="mb-3"><label class="form-label">담당 부문</label><input type="text" class="form-control" id="m-dept" placeholder="예: FLT, MNT, CAB..."></div>
      <div class="mb-3"><label class="form-label">작성일</label><input type="date" class="form-control" id="m-date"></div>
      <div class="mb-3"><label class="form-label">상태</label><select class="form-select" id="m-status"><option value="in_progress">작성중</option><option value="completed">완료</option></select></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveMaterial()">저장</button></div>
  </div></div>
</div>
<!-- Appointment Modal -->
<div class="modal fade" id="modal-appointment" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">심사원/담당자 발령</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">부문</label><select class="form-select" id="a-dept"><option>ORG</option><option>FLT</option><option>DSP</option><option>MNT</option><option>CAB</option><option>GRH</option><option>CGO</option><option>SEC</option></select></div>
      <div class="mb-3"><label class="form-label">성명</label><input type="text" class="form-control" id="a-name"></div>
      <div class="mb-3"><label class="form-label">직위</label><input type="text" class="form-control" id="a-position"></div>
      <div class="mb-3"><label class="form-label">발령일</label><input type="date" class="form-control" id="a-date"></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveAppointment()">저장</button></div>
  </div></div>
</div>
<!-- Propagation Modal -->
<div class="modal fade" id="modal-propagation" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">전파교육 기록 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">부문</label><input type="text" class="form-control" id="p-dept"></div>
      <div class="mb-3"><label class="form-label">교육일</label><input type="date" class="form-control" id="p-date"></div>
      <div class="mb-3"><label class="form-label">강사</label><input type="text" class="form-control" id="p-instructor"></div>
      <div class="mb-3"><label class="form-label">참석 인원</label><input type="number" class="form-control" id="p-count" min="1"></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="savePropagation()">저장</button></div>
  </div></div>
</div>`;
}

// Preparation save functions
function saveTraining() {
  const t = {
    courseName: document.getElementById('t-courseName').value,
    provider: document.getElementById('t-provider').value,
    date: document.getElementById('t-date').value,
    attendee: document.getElementById('t-attendee').value,
  };
  if (!t.courseName) return alert('교육명을 입력하세요');
  APP_DATA.preparation.externalTrainings.push(t);
  DB.save(APP_DATA);
  bootstrap.Modal.getInstance(document.getElementById('modal-training')).hide();
  renderPreparation();
}
function saveMaterial() {
  APP_DATA.preparation.trainingMaterials.push({
    title: document.getElementById('m-title').value,
    dept: document.getElementById('m-dept').value,
    date: document.getElementById('m-date').value,
    status: document.getElementById('m-status').value,
  });
  DB.save(APP_DATA);
  bootstrap.Modal.getInstance(document.getElementById('modal-material')).hide();
  renderPreparation();
}
function saveAppointment() {
  APP_DATA.preparation.auditorAppointments.push({
    dept: document.getElementById('a-dept').value,
    name: document.getElementById('a-name').value,
    position: document.getElementById('a-position').value,
    date: document.getElementById('a-date').value,
  });
  DB.save(APP_DATA);
  bootstrap.Modal.getInstance(document.getElementById('modal-appointment')).hide();
  renderPreparation();
}
function savePropagation() {
  APP_DATA.preparation.propagationTrainings.push({
    dept: document.getElementById('p-dept').value,
    date: document.getElementById('p-date').value,
    instructor: document.getElementById('p-instructor').value,
    attendeeCount: document.getElementById('p-count').value,
  });
  DB.save(APP_DATA);
  bootstrap.Modal.getInstance(document.getElementById('modal-propagation')).hide();
  renderPreparation();
}
function deleteTraining(i) {
  APP_DATA.preparation.externalTrainings.splice(i,1);
  DB.save(APP_DATA);
  renderPreparation();
}

// ─── INTERNAL AUDIT ───────────────────────────────────────────
function renderInternal() {
  const ia = APP_DATA.internalAudit;
  const crStatusMap = { not_started:'미시작', in_progress:'작성중', completed:'작성완료', submitted:'제출완료' };
  const crBadgeMap = { not_started:'badge-notstarted', in_progress:'badge-inprogress', completed:'badge-done', submitted:'badge-active' };
  document.getElementById('section-internal').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">내부심사 / CR</h2>
    <p class="sect-sub">Conformance Report 작성 현황 및 내부심사 결과</p>
  </div>
</div>
<div class="row g-3">
  <div class="col-12">
    <div class="alert-info-custom">
      <i class="fas fa-info-circle me-2"></i>
      현재 유효한 ISM을 기준으로 내부심사를 실시하고, 결과를 <strong>Conformance Report (CR)</strong>에 기록합니다. CR은 IOSA 신청 시 제출 필수 서류입니다.
    </div>
  </div>
  <!-- CR Status -->
  <div class="col-md-4">
    <div class="status-card text-center">
      <div style="font-size:0.8rem;color:#64748b;margin-bottom:8px;">Conformance Report (CR)</div>
      <span class="badge-status ${crBadgeMap[ia.crStatus]}" style="font-size:0.9rem;padding:8px 16px;">${crStatusMap[ia.crStatus]}</span>
      <div class="mt-3">
        <select class="form-select form-select-sm" onchange="updateCRStatus(this.value)">
          <option value="not_started" ${ia.crStatus==='not_started'?'selected':''}>미시작</option>
          <option value="in_progress" ${ia.crStatus==='in_progress'?'selected':''}>작성중</option>
          <option value="completed" ${ia.crStatus==='completed'?'selected':''}>작성완료</option>
          <option value="submitted" ${ia.crStatus==='submitted'?'selected':''}>IOSA 제출완료</option>
        </select>
      </div>
      <div class="mt-2" style="font-size:0.75rem;color:#64748b;">
        적용 CR 템플릿: Conformance Report-Template-ISM-Ed-17 (ORG버전 v59)
      </div>
    </div>
  </div>
  <!-- Audit stats -->
  <div class="col-md-8">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-clipboard-list me-2" style="color:var(--eastar-red);"></i>내부심사 실시 현황</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-internalaudit')"><i class="fas fa-plus me-1"></i>심사 추가</button>
      </div>
      <div class="table-responsive">
        <table class="table data-table">
          <thead><tr><th>심사일</th><th>부문</th><th>심사원</th><th>지적사항</th><th>관찰사항</th><th>상태</th></tr></thead>
          <tbody>
            ${ia.audits.length === 0
              ? '<tr><td colspan="6" class="text-center text-muted py-3">내부심사 기록이 없습니다</td></tr>'
              : ia.audits.map((a,i)=>`<tr>
                  <td>${DateUtil.format(a.date)}</td>
                  <td><span class="badge bg-secondary">${a.dept}</span></td>
                  <td>${a.auditor}</td>
                  <td><span class="badge bg-danger">${a.findings}</span></td>
                  <td><span class="badge bg-warning text-dark">${a.observations}</span></td>
                  <td><span class="badge-status ${a.status==='completed'?'badge-done':'badge-inprogress'}">${a.status==='completed'?'완료':'진행중'}</span></td>
                </tr>`).join('')
            }
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- Findings -->
  <div class="col-12">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-exclamation-circle me-2 text-danger"></i>내부심사 지적사항 관리</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-finding')"><i class="fas fa-plus me-1"></i>지적사항 추가</button>
      </div>
      ${ia.findings.length === 0
        ? '<div class="empty-state"><i class="fas fa-check-circle" style="color:#198754;"></i><p>지적사항이 없거나 아직 추가되지 않았습니다</p></div>'
        : `<div class="table-responsive"><table class="table data-table">
          <thead><tr><th>번호</th><th>부문</th><th>ISARP</th><th>내용</th><th>시정조치</th><th>상태</th></tr></thead>
          <tbody>${ia.findings.map((f,i)=>`<tr>
            <td>F-${String(i+1).padStart(3,'0')}</td>
            <td><span class="badge bg-secondary">${f.dept}</span></td>
            <td>${f.isarp}</td>
            <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.desc}</td>
            <td style="max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${f.action||'-'}</td>
            <td>
              <select class="form-select form-select-sm" style="width:auto;" onchange="updateFindingStatus(${i},this.value)">
                <option value="open" ${f.status==='open'?'selected':''}>미결</option>
                <option value="in_progress" ${f.status==='in_progress'?'selected':''}>조치중</option>
                <option value="closed" ${f.status==='closed'?'selected':''}>종결</option>
              </select>
            </td>
          </tr>`).join('')}</tbody>
        </table></div>`
      }
    </div>
  </div>
</div>

<!-- Internal Audit Modal -->
<div class="modal fade" id="modal-internalaudit" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">내부심사 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">심사일</label><input type="date" class="form-control" id="ia-date"></div>
      <div class="mb-3"><label class="form-label">부문</label><select class="form-select" id="ia-dept"><option>ORG</option><option>FLT</option><option>DSP</option><option>MNT</option><option>CAB</option><option>GRH</option><option>CGO</option><option>SEC</option></select></div>
      <div class="mb-3"><label class="form-label">심사원</label><input type="text" class="form-control" id="ia-auditor"></div>
      <div class="row"><div class="col-6 mb-3"><label class="form-label">지적사항 수</label><input type="number" class="form-control" id="ia-findings" value="0" min="0"></div>
      <div class="col-6 mb-3"><label class="form-label">관찰사항 수</label><input type="number" class="form-control" id="ia-observations" value="0" min="0"></div></div>
      <div class="mb-3"><label class="form-label">상태</label><select class="form-select" id="ia-status"><option value="in_progress">진행중</option><option value="completed">완료</option></select></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveInternalAudit()">저장</button></div>
  </div></div>
</div>
<!-- Finding Modal -->
<div class="modal fade" id="modal-finding" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">지적사항 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">부문</label><select class="form-select" id="f-dept"><option>ORG</option><option>FLT</option><option>DSP</option><option>MNT</option><option>CAB</option><option>GRH</option><option>CGO</option><option>SEC</option></select></div>
      <div class="mb-3"><label class="form-label">ISARP 번호</label><input type="text" class="form-control" id="f-isarp" placeholder="예: ORG 2.1.1"></div>
      <div class="mb-3"><label class="form-label">지적 내용</label><textarea class="form-control" id="f-desc" rows="3"></textarea></div>
      <div class="mb-3"><label class="form-label">시정조치 계획</label><textarea class="form-control" id="f-action" rows="2"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveFinding()">저장</button></div>
  </div></div>
</div>`;
}

function updateCRStatus(val) { APP_DATA.internalAudit.crStatus = val; DB.save(APP_DATA); }
function saveInternalAudit() {
  APP_DATA.internalAudit.audits.push({
    date: document.getElementById('ia-date').value,
    dept: document.getElementById('ia-dept').value,
    auditor: document.getElementById('ia-auditor').value,
    findings: parseInt(document.getElementById('ia-findings').value)||0,
    observations: parseInt(document.getElementById('ia-observations').value)||0,
    status: document.getElementById('ia-status').value,
  });
  DB.save(APP_DATA);
  bootstrap.Modal.getInstance(document.getElementById('modal-internalaudit')).hide();
  renderInternal();
}
function saveFinding() {
  APP_DATA.internalAudit.findings.push({
    dept: document.getElementById('f-dept').value,
    isarp: document.getElementById('f-isarp').value,
    desc: document.getElementById('f-desc').value,
    action: document.getElementById('f-action').value,
    status: 'open',
  });
  DB.save(APP_DATA);
  bootstrap.Modal.getInstance(document.getElementById('modal-finding')).hide();
  renderInternal();
}
function updateFindingStatus(i, val) {
  APP_DATA.internalAudit.findings[i].status = val; DB.save(APP_DATA);
}

// ─── APPLICATION ──────────────────────────────────────────────
function renderApplication() {
  const app = APP_DATA.application;
  document.getElementById('section-application').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">IOSA 신청 관리</h2>
    <p class="sect-sub">IATA 신청서류 제출 · 심사 일정 확정 관리</p>
  </div>
</div>
<div class="row g-3">
  <div class="col-12">
    <div class="alert-info-custom">
      <i class="fas fa-info-circle me-2"></i>
      IOSA 신청 시 <strong>CR(Conformance Report)</strong>를 포함한 요구자료를 IATA에 제출해야 합니다. 심사 일정 확정 후 IATA 심사원 코디를 시작하세요.
    </div>
  </div>
  <div class="col-md-5">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-paper-plane me-2" style="color:var(--eastar-red);"></i>IOSA 신청 현황</h6>
      <div class="mb-3">
        <label class="form-label">신청일</label>
        <input type="date" class="form-control" value="${app.applicationDate}" onchange="APP_DATA.application.applicationDate=this.value;DB.save(APP_DATA);">
      </div>
      <div class="mb-3">
        <label class="form-label">심사 잠정 일정</label>
        <input type="date" class="form-control" value="${app.auditSchedule?.tentativeDate||''}" onchange="APP_DATA.application.auditSchedule.tentativeDate=this.value;DB.save(APP_DATA);">
      </div>
      <div class="mb-3">
        <label class="form-label">심사 확정 일정</label>
        <input type="date" class="form-control" value="${app.auditSchedule?.confirmedDate||''}" onchange="APP_DATA.application.auditSchedule.confirmedDate=this.value;DB.save(APP_DATA);">
      </div>
      <div class="mb-3">
        <label class="form-label">일정 상태</label>
        <select class="form-select" onchange="APP_DATA.application.auditSchedule.status=this.value;DB.save(APP_DATA);">
          <option value="not_started" ${app.auditSchedule?.status==='not_started'?'selected':''}>미시작</option>
          <option value="tentative" ${app.auditSchedule?.status==='tentative'?'selected':''}>잠정 조율중</option>
          <option value="confirmed" ${app.auditSchedule?.status==='confirmed'?'selected':''}>확정</option>
        </select>
      </div>
    </div>
  </div>
  <div class="col-md-7">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-folder-open me-2 text-warning"></i>제출 서류 관리</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-doc')"><i class="fas fa-plus me-1"></i>추가</button>
      </div>
      <table class="table data-table">
        <thead><tr><th>서류명</th><th>제출일</th><th>상태</th><th></th></tr></thead>
        <tbody id="doc-tbody">
          ${renderDocRows()}
        </tbody>
      </table>
    </div>
  </div>
  <div class="col-12">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-comments me-2" style="color:#7c3aed;"></i>IATA 연락 이력</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-contact')"><i class="fas fa-plus me-1"></i>기록 추가</button>
      </div>
      ${app.contactLog.length === 0
        ? '<div class="empty-state"><i class="fas fa-envelope"></i><p>연락 이력이 없습니다</p></div>'
        : app.contactLog.map((c,i)=>`
          <div class="cap-item">
            <div class="d-flex justify-content-between">
              <div>
                <div style="font-size:0.75rem;color:#64748b;">${DateUtil.format(c.date)} · ${c.method}</div>
                <div style="font-size:0.875rem;font-weight:600;">${c.subject}</div>
                <div style="font-size:0.78rem;color:#475569;">${c.notes}</div>
              </div>
              <button class="btn btn-sm btn-outline-danger" onclick="deleteContact(${i})"><i class="fas fa-trash"></i></button>
            </div>
          </div>`).join('')
      }
    </div>
  </div>
</div>
<!-- Doc Modal -->
<div class="modal fade" id="modal-doc" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">제출 서류 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">서류명</label><input type="text" class="form-control" id="doc-name" placeholder="예: Conformance Report"></div>
      <div class="mb-3"><label class="form-label">제출일</label><input type="date" class="form-control" id="doc-date"></div>
      <div class="mb-3"><label class="form-label">상태</label><select class="form-select" id="doc-status"><option value="pending">준비중</option><option value="submitted">제출완료</option><option value="accepted">수락됨</option></select></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveDoc()">저장</button></div>
  </div></div>
</div>
<!-- Contact Modal -->
<div class="modal fade" id="modal-contact" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">연락 이력 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">날짜</label><input type="date" class="form-control" id="c-date"></div>
      <div class="mb-3"><label class="form-label">연락 방법</label><select class="form-select" id="c-method"><option>이메일</option><option>전화</option><option>IATA Connect</option><option>화상회의</option></select></div>
      <div class="mb-3"><label class="form-label">제목</label><input type="text" class="form-control" id="c-subject"></div>
      <div class="mb-3"><label class="form-label">내용 요약</label><textarea class="form-control" id="c-notes" rows="3"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveContact()">저장</button></div>
  </div></div>
</div>`;
}
function renderDocRows() {
  const docs = APP_DATA.application.documents;
  if (!docs.length) return '<tr><td colspan="4" class="text-center text-muted py-3">서류가 없습니다</td></tr>';
  const bm = { pending:'badge-warning', submitted:'badge-active', accepted:'badge-done' };
  const lm = { pending:'준비중', submitted:'제출완료', accepted:'수락됨' };
  return docs.map((d,i)=>`<tr><td>${d.name}</td><td>${DateUtil.format(d.date)}</td>
    <td><span class="badge-status ${bm[d.status]}">${lm[d.status]}</span></td>
    <td><button class="btn btn-sm btn-outline-danger" onclick="deleteDoc(${i})"><i class="fas fa-trash"></i></button></td></tr>`).join('');
}
function saveDoc() {
  APP_DATA.application.documents.push({ name: document.getElementById('doc-name').value, date: document.getElementById('doc-date').value, status: document.getElementById('doc-status').value });
  DB.save(APP_DATA); bootstrap.Modal.getInstance(document.getElementById('modal-doc')).hide(); renderApplication();
}
function deleteDoc(i) { APP_DATA.application.documents.splice(i,1); DB.save(APP_DATA); renderApplication(); }
function saveContact() {
  APP_DATA.application.contactLog.push({ date: document.getElementById('c-date').value, method: document.getElementById('c-method').value, subject: document.getElementById('c-subject').value, notes: document.getElementById('c-notes').value });
  DB.save(APP_DATA); bootstrap.Modal.getInstance(document.getElementById('modal-contact')).hide(); renderApplication();
}
function deleteContact(i) { APP_DATA.application.contactLog.splice(i,1); DB.save(APP_DATA); renderApplication(); }

// ─── COORDINATOR ──────────────────────────────────────────────
function renderCoordination() {
  const coord = APP_DATA.auditorCoordination;
  document.getElementById('section-coordination').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">심사원 코디네이션</h2>
    <p class="sect-sub">IATA 심사원 항공권 · 숙소 · 비자 준비 현황</p>
  </div>
</div>
<div class="row g-3">
  <div class="col-12">
    <div class="alert-info-custom">
      <i class="fas fa-info-circle me-2"></i>
      IATA 심사원의 <strong>항공권·숙소·비자</strong>를 항공사가 준비합니다. 심사 확정 후 즉시 코디를 시작하세요.
    </div>
  </div>
  <!-- Auditors -->
  <div class="col-12">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-users me-2" style="color:var(--eastar-red);"></i>IATA 심사원 명단</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-auditor')"><i class="fas fa-plus me-1"></i>추가</button>
      </div>
      <div class="row g-3" id="auditor-cards">
        ${coord.auditors.length === 0
          ? '<div class="col-12"><div class="empty-state"><i class="fas fa-user-tie"></i><p>심사원 정보를 추가하세요</p></div></div>'
          : coord.auditors.map((a,i)=>`
            <div class="col-md-3 col-sm-6">
              <div class="auditor-card">
                <div class="auditor-avatar">${a.name.charAt(0)}</div>
                <div class="fw-bold" style="font-size:0.9rem;">${a.name}</div>
                <div style="font-size:0.75rem;color:#64748b;">${a.role}</div>
                <div style="font-size:0.75rem;color:#64748b;">${a.nationality}</div>
                <div style="font-size:0.75rem;color:#64748b;">${a.discipline}</div>
                <div class="mt-2">
                  <span class="badge-status ${a.visaRequired?'badge-warning':'badge-done'}">${a.visaRequired?'비자필요':'비자불필요'}</span>
                </div>
                <button class="btn btn-sm btn-outline-danger mt-2" onclick="deleteAuditor(${i})"><i class="fas fa-trash"></i></button>
              </div>
            </div>`).join('')
        }
      </div>
    </div>
  </div>
  <!-- Flight / Hotel -->
  <div class="col-md-6">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-plane me-2 text-primary"></i>항공권 예약</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-flight')"><i class="fas fa-plus me-1"></i>추가</button>
      </div>
      <table class="table data-table">
        <thead><tr><th>심사원</th><th>구간</th><th>일정</th><th>상태</th></tr></thead>
        <tbody>
          ${coord.flights.length === 0 ? '<tr><td colspan="4" class="text-center text-muted py-3">항공권 정보 없음</td></tr>'
            : coord.flights.map(f=>`<tr><td>${f.auditor}</td><td>${f.route}</td><td>${DateUtil.format(f.date)}</td>
              <td><span class="badge-status ${f.status==='booked'?'badge-done':'badge-warning'}">${f.status==='booked'?'예약완료':'예약중'}</span></td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
  <div class="col-md-6">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-hotel me-2" style="color:#7c3aed;"></i>숙소 예약</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-hotel')"><i class="fas fa-plus me-1"></i>추가</button>
      </div>
      <table class="table data-table">
        <thead><tr><th>심사원</th><th>호텔</th><th>체크인/아웃</th><th>상태</th></tr></thead>
        <tbody>
          ${coord.hotels.length === 0 ? '<tr><td colspan="4" class="text-center text-muted py-3">숙소 정보 없음</td></tr>'
            : coord.hotels.map(h=>`<tr><td>${h.auditor}</td><td>${h.hotel}</td><td>${DateUtil.format(h.checkin)}~${DateUtil.format(h.checkout)}</td>
              <td><span class="badge-status ${h.status==='booked'?'badge-done':'badge-warning'}">${h.status==='booked'?'예약완료':'예약중'}</span></td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>
<!-- Auditor Modal -->
<div class="modal fade" id="modal-auditor" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">IATA 심사원 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">이름</label><input type="text" class="form-control" id="aud-name"></div>
      <div class="mb-3"><label class="form-label">역할</label><select class="form-select" id="aud-role"><option>Lead Auditor</option><option>Auditor</option><option>Evaluator</option></select></div>
      <div class="mb-3"><label class="form-label">국적</label><input type="text" class="form-control" id="aud-nationality"></div>
      <div class="mb-3"><label class="form-label">담당 분야</label><input type="text" class="form-control" id="aud-discipline" placeholder="예: ORG, FLT, MNT"></div>
      <div class="mb-3 form-check"><input type="checkbox" class="form-check-input" id="aud-visa"><label class="form-check-label" for="aud-visa">비자 필요</label></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveAuditor()">저장</button></div>
  </div></div>
</div>
<!-- Flight Modal -->
<div class="modal fade" id="modal-flight" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">항공권 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">심사원</label><input type="text" class="form-control" id="fl-auditor"></div>
      <div class="mb-3"><label class="form-label">구간</label><input type="text" class="form-control" id="fl-route" placeholder="예: ICN-DOH-ICN"></div>
      <div class="mb-3"><label class="form-label">출발일</label><input type="date" class="form-control" id="fl-date"></div>
      <div class="mb-3"><label class="form-label">상태</label><select class="form-select" id="fl-status"><option value="pending">예약중</option><option value="booked">예약완료</option></select></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveFlight()">저장</button></div>
  </div></div>
</div>
<!-- Hotel Modal -->
<div class="modal fade" id="modal-hotel" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">숙소 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">심사원</label><input type="text" class="form-control" id="ht-auditor"></div>
      <div class="mb-3"><label class="form-label">호텔명</label><input type="text" class="form-control" id="ht-hotel"></div>
      <div class="row">
        <div class="col-6 mb-3"><label class="form-label">체크인</label><input type="date" class="form-control" id="ht-checkin"></div>
        <div class="col-6 mb-3"><label class="form-label">체크아웃</label><input type="date" class="form-control" id="ht-checkout"></div>
      </div>
      <div class="mb-3"><label class="form-label">상태</label><select class="form-select" id="ht-status"><option value="pending">예약중</option><option value="booked">예약완료</option></select></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveHotel()">저장</button></div>
  </div></div>
</div>`;
}
function saveAuditor() {
  APP_DATA.auditorCoordination.auditors.push({ name: document.getElementById('aud-name').value, role: document.getElementById('aud-role').value, nationality: document.getElementById('aud-nationality').value, discipline: document.getElementById('aud-discipline').value, visaRequired: document.getElementById('aud-visa').checked });
  DB.save(APP_DATA); bootstrap.Modal.getInstance(document.getElementById('modal-auditor')).hide(); renderCoordination();
}
function deleteAuditor(i) { APP_DATA.auditorCoordination.auditors.splice(i,1); DB.save(APP_DATA); renderCoordination(); }
function saveFlight() {
  APP_DATA.auditorCoordination.flights.push({ auditor: document.getElementById('fl-auditor').value, route: document.getElementById('fl-route').value, date: document.getElementById('fl-date').value, status: document.getElementById('fl-status').value });
  DB.save(APP_DATA); bootstrap.Modal.getInstance(document.getElementById('modal-flight')).hide(); renderCoordination();
}
function saveHotel() {
  APP_DATA.auditorCoordination.hotels.push({ auditor: document.getElementById('ht-auditor').value, hotel: document.getElementById('ht-hotel').value, checkin: document.getElementById('ht-checkin').value, checkout: document.getElementById('ht-checkout').value, status: document.getElementById('ht-status').value });
  DB.save(APP_DATA); bootstrap.Modal.getInstance(document.getElementById('modal-hotel')).hide(); renderCoordination();
}

// ─── MAIN AUDIT ───────────────────────────────────────────────
function renderMainAudit() {
  document.getElementById('section-mainaudit').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">본점검 관리</h2>
    <p class="sect-sub">본 IOSA 심사 현장 진행 및 일정 관리</p>
  </div>
</div>
<div class="row g-3">
  <div class="col-12">
    <div class="status-card" style="border-left:4px solid #198754;">
      <div class="d-flex align-items-center gap-3">
        <i class="fas fa-check-circle fa-2x text-success"></i>
        <div>
          <div class="fw-bold">초도심사 완료</div>
          <div style="font-size:0.85rem;color:#64748b;">2025년 7월 28일 ~ 8월 1일 (5일간) · IATA 심사원 수검 완료</div>
        </div>
      </div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-file-alt me-2" style="color:var(--eastar-red);"></i>Documentation 증빙</h6>
      <div class="d-flex align-items-center gap-2 mb-2">
        <span class="badge-status badge-done">완료</span>
        <span style="font-size:0.875rem;">문서 요건 준수 확인</span>
      </div>
      <div style="font-size:0.78rem;color:#64748b;">운항절차서, 훈련교범, 비상절차 등 IOSA 기준 문서 체계 검토 완료</div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-cogs me-2 text-warning"></i>Implementation 증빙</h6>
      <div class="d-flex align-items-center gap-2 mb-2">
        <span class="badge-status badge-done">완료</span>
        <span style="font-size:0.875rem;">실행 증빙 제출</span>
      </div>
      <div style="font-size:0.78rem;color:#64748b;">절차 실행 기록, 훈련 기록, 점검 기록 등 증빙자료 제출 완료</div>
    </div>
  </div>
  <div class="col-md-4">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-search me-2 text-danger"></i>현장심사</h6>
      <div class="d-flex align-items-center gap-2 mb-2">
        <span class="badge-status badge-done">완료</span>
        <span style="font-size:0.875rem;">현장 심사 완료</span>
      </div>
      <div style="font-size:0.78rem;color:#64748b;">항공기, 격납고, 운항관리실 등 현장 점검 완료</div>
    </div>
  </div>
  <div class="col-12">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-clipboard-check me-2" style="color:#7c3aed;"></i>심사 결과 입력</h6>
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label">결과 수령일</label>
          <input type="date" class="form-control" value="${APP_DATA.mainAudit.results.receivedDate||''}" onchange="APP_DATA.mainAudit.results.receivedDate=this.value;DB.save(APP_DATA);">
        </div>
        <div class="col-md-3">
          <label class="form-label">지적사항(Findings) 수</label>
          <input type="number" class="form-control" value="${APP_DATA.mainAudit.results.findingsCount||0}" min="0" onchange="APP_DATA.mainAudit.results.findingsCount=parseInt(this.value);DB.save(APP_DATA);">
        </div>
        <div class="col-md-3">
          <label class="form-label">관찰사항(Observations) 수</label>
          <input type="number" class="form-control" value="${APP_DATA.mainAudit.results.observationsCount||0}" min="0" onchange="APP_DATA.mainAudit.results.observationsCount=parseInt(this.value);DB.save(APP_DATA);">
        </div>
        <div class="col-md-3">
          <label class="form-label">비고</label>
          <input type="text" class="form-control" value="${APP_DATA.mainAudit.results.notes||''}" placeholder="메모" onchange="APP_DATA.mainAudit.results.notes=this.value;DB.save(APP_DATA);">
        </div>
      </div>
    </div>
  </div>
</div>`;
}

// ─── CAP / FAT ────────────────────────────────────────────────
function renderCAP() {
  const cap = APP_DATA.cap;
  const fat = APP_DATA.fat;
  const c = APP_DATA.certification;
  const adminView = typeof isAdminRole === 'function' ? isAdminRole() : true;
  const userDept = typeof getUserDept === 'function' ? getUserDept() : null;
  const filteredFindings = adminView ? cap.findings : cap.findings.filter(f => f.dept === userDept);
  document.getElementById('section-cap').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">CAP / FAT 관리</h2>
    <p class="sect-sub">Corrective Action Plan · Final Action Taken (FAT)</p>
  </div>
</div>
<div class="row g-3">
  ${!adminView ? `<div class="col-12"><div style="background:#fff0f0;border:1px solid rgba(210,0,21,0.2);border-left:4px solid var(--eastar-red);border-radius:4px;padding:12px 18px;font-size:0.82rem;margin-bottom:4px;"><i class="fas fa-filter me-2" style="color:var(--eastar-red);"></i><strong>${userDept}</strong> 부문 지적사항만 표시됩니다. <span style="color:#888;font-size:0.75rem;">전체 데이터는 안전보안실에 문의하세요.</span></div></div>` : ''}
  <div class="col-12">
    <div class="${DateUtil.daysUntil(c.capDeadline) < 0 ? 'alert-urgent' : 'alert-deadline'}">
      <strong><i class="fas fa-exclamation-triangle me-2"></i>CAP 합의 마감: ${DateUtil.format(c.capDeadline)}</strong>
      ${DateUtil.urgencyBadge(DateUtil.daysUntil(c.capDeadline))}
      <div style="font-size:0.78rem;margin-top:4px;">Closing Meeting(2025-08-01) + 45일. 모든 지적사항 종결: ${DateUtil.format(c.findingsCloseDeadline)} 까지 (IAR 발행 15일 여유 필요)</div>
    </div>
  </div>

  <!-- CAP Status -->
  <div class="col-md-4">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-file-signature me-2" style="color:var(--eastar-red);"></i>CAP 현황</h6>
      <div class="mb-3">
        <label class="form-label">CAP 상태</label>
        <select class="form-select" onchange="updateCAPStatus(this.value)">
          <option value="not_started" ${cap.status==='not_started'?'selected':''}>미시작</option>
          <option value="submitted" ${cap.status==='submitted'?'selected':''}>제출됨</option>
          <option value="under_review" ${cap.status==='under_review'?'selected':''}>검토중 (IATA)</option>
          <option value="approved" ${cap.status==='approved'?'selected':''}>승인됨</option>
          <option value="closed" ${cap.status==='closed'?'selected':''}>완전 종결</option>
        </select>
      </div>
      <div class="mb-3"><label class="form-label">CAP 제출일</label><input type="date" class="form-control" value="${cap.submittedDate||''}" onchange="APP_DATA.cap.submittedDate=this.value;DB.save(APP_DATA);"></div>
      <div class="mb-3"><label class="form-label">CAP 승인일</label><input type="date" class="form-control" value="${cap.approvedDate||''}" onchange="APP_DATA.cap.approvedDate=this.value;DB.save(APP_DATA);"></div>
    </div>
  </div>

  <!-- FAT Status -->
  <div class="col-md-4">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-file-check me-2 text-success"></i>FAT (Final Action Taken) 현황</h6>
      <div class="mb-3">
        <label class="form-label">FAT 상태</label>
        <select class="form-select" onchange="APP_DATA.fat.status=this.value;DB.save(APP_DATA);">
          <option value="not_started" ${fat.status==='not_started'?'selected':''}>미시작</option>
          <option value="in_progress" ${fat.status==='in_progress'?'selected':''}>작성중</option>
          <option value="submitted" ${fat.status==='submitted'?'selected':''}>제출됨</option>
          <option value="approved" ${fat.status==='approved'?'selected':''}>최종승인 완료</option>
        </select>
      </div>
      <div class="mb-3"><label class="form-label">FAT 제출일</label><input type="date" class="form-control" value="${fat.submittedDate||''}" onchange="APP_DATA.fat.submittedDate=this.value;DB.save(APP_DATA);"></div>
      <div class="mb-3"><label class="form-label">FAT 승인일</label><input type="date" class="form-control" value="${fat.approvedDate||''}" onchange="APP_DATA.fat.approvedDate=this.value;DB.save(APP_DATA);"></div>
      <div style="font-size:0.75rem;color:#64748b;">CAP 승인 후 FAT 작성 및 증빙자료 제출 → IATA Quality Control → 인증서 발급</div>
    </div>
  </div>

  <!-- Summary -->
  <div class="col-md-4">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-chart-pie me-2 text-warning"></i>지적사항 현황</h6>
      <div class="text-center mb-3">
        <div style="font-size:3rem;font-weight:900;color:var(--eastar-red);">${filteredFindings.filter(f=>f.status==='open').length}</div>
        <div style="color:#64748b;font-size:0.8rem;">미결 지적사항</div>
      </div>
      <div class="d-flex justify-content-around text-center">
        <div><div style="font-size:1.5rem;font-weight:700;color:#dc3545;">${filteredFindings.filter(f=>f.status==='open').length}</div><div style="font-size:0.72rem;color:#64748b;">미결</div></div>
        <div><div style="font-size:1.5rem;font-weight:700;color:#fd7e14;">${filteredFindings.filter(f=>f.status==='in_progress').length}</div><div style="font-size:0.72rem;color:#64748b;">조치중</div></div>
        <div><div style="font-size:1.5rem;font-weight:700;color:#198754;">${filteredFindings.filter(f=>f.status==='closed').length}</div><div style="font-size:0.72rem;color:#64748b;">종결</div></div>
        <div><div style="font-size:1.5rem;font-weight:700;color:var(--eastar-red);">${filteredFindings.length}</div><div style="font-size:0.72rem;color:#64748b;">전체</div></div>
      </div>
    </div>
  </div>

  <!-- Findings list -->
  <div class="col-12">
    <div class="status-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-bold mb-0"><i class="fas fa-list me-2"></i>IATA 지적사항 (Findings) 목록</h6>
        <button class="btn btn-sm btn-iata" onclick="openModal('modal-capfinding')"><i class="fas fa-plus me-1"></i>추가</button>
      </div>
      <div style="font-size:0.72rem;color:#888;margin-bottom:10px;"><i class="fas fa-hand-pointer me-1"></i>행을 클릭하면 상세 정보 및 편집 패널이 열립니다.</div>
      ${filteredFindings.length === 0
        ? '<div class="empty-state"><i class="fas fa-clipboard-check" style="color:#198754;"></i><p>IATA 심사 결과 지적사항을 추가하세요</p></div>'
        : `<div class="table-responsive"><table class="table data-table">
          <thead><tr><th>번호</th><th>부문</th><th>ISARP</th><th>지적 내용</th><th>상태</th></tr></thead>
          <tbody>${filteredFindings.map((f,i)=>{
            const realIdx=cap.findings.indexOf(f);
            const statusBadge = f.status==='closed'
              ? '<span style="background:#d1fae5;color:#065f46;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:3px;">종결</span>'
              : f.status==='in_progress'
              ? '<span style="background:#fef3c7;color:#92400e;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:3px;">조치중</span>'
              : '<span style="background:#fee2e2;color:#991b1b;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:3px;">미결</span>';
            const descTrunc = (f.desc||'').length > 60 ? (f.desc||'').substring(0,60)+'…' : (f.desc||'-');
            return `<tr style="cursor:pointer;" onclick="openCapDetail(${realIdx})" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background=''">
              <td style="font-weight:600;">CAR-${String(i+1).padStart(3,'0')}</td>
              <td><span class="badge bg-secondary">${f.dept}</span></td>
              <td style="font-weight:600;">${f.isarp}</td>
              <td style="max-width:260px;font-size:0.82rem;color:#374151;">${descTrunc}</td>
              <td>${statusBadge}</td>
            </tr>`;
          }).join('')}</tbody>
        </table></div>`
      }
    </div>
  </div>
</div>
<!-- CAP Finding Modal -->
<div class="modal fade" id="modal-capfinding" tabindex="-1">
  <div class="modal-dialog modal-lg"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">IATA 지적사항(CAR) 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="row">
        <div class="col-md-4 mb-3"><label class="form-label">부문</label><select class="form-select" id="cf-dept"><option>ORG</option><option>FLT</option><option>DSP</option><option>MNT</option><option>CAB</option><option>GRH</option><option>CGO</option><option>SEC</option></select></div>
        <div class="col-md-4 mb-3"><label class="form-label">ISARP</label><input type="text" class="form-control" id="cf-isarp" placeholder="예: ORG 2.1.1"></div>
        <div class="col-md-4 mb-3"><label class="form-label">완료 목표일</label><input type="date" class="form-control" id="cf-due" value="${c.findingsCloseDeadline}"></div>
      </div>
      <div class="mb-3"><label class="form-label">지적 내용</label><textarea class="form-control" id="cf-desc" rows="3"></textarea></div>
      <div class="mb-3"><label class="form-label">시정조치 계획 (CAP)</label><textarea class="form-control" id="cf-action" rows="3" placeholder="근본원인 분석(RCA) 및 영구적 시정조치 포함"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveCAPFinding()">저장</button></div>
  </div></div>
</div>
<!-- CAP Detail Drawer Overlay -->
<div id="capDetailOverlay" onclick="closeCapDetail()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:1040;"></div>
<div id="capDetailPanel" style="display:none;position:fixed;top:0;right:0;bottom:0;width:480px;background:#fff;z-index:1050;box-shadow:-4px 0 24px rgba(0,0,0,0.18);overflow-y:auto;flex-direction:column;">
  <div id="capDetailContent"></div>
</div>`;
}
function updateCAPStatus(val) { APP_DATA.cap.status = val; DB.save(APP_DATA); }
function saveCAPFinding() {
  APP_DATA.cap.findings.push({ dept: document.getElementById('cf-dept').value, isarp: document.getElementById('cf-isarp').value, dueDate: document.getElementById('cf-due').value, desc: document.getElementById('cf-desc').value, action: document.getElementById('cf-action').value, status: 'open' });
  DB.save(APP_DATA); bootstrap.Modal.getInstance(document.getElementById('modal-capfinding')).hide(); renderCAP();
}
function updateCAPFinding(i, val) { APP_DATA.cap.findings[i].status = val; DB.save(APP_DATA); }

function openCapDetail(idx) {
  const f = APP_DATA.cap.findings[idx];
  if (!f) return;
  const typeLabel = f.type === 'OBS' ? 'OBSERVATION' : 'FINDING';
  document.getElementById('capDetailContent').innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:18px 20px 14px;border-bottom:1px solid #eee;position:sticky;top:0;background:#fff;z-index:1;">
      <div>
        <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#aaa;">지적사항 상세</div>
        <div style="font-size:1rem;font-weight:800;color:#1a1a1a;">CAR-${String(idx+1).padStart(3,'0')} · ${f.dept}</div>
      </div>
      <button onclick="closeCapDetail()" style="background:none;border:none;font-size:1.2rem;color:#888;cursor:pointer;padding:4px 8px;line-height:1;">&times;</button>
    </div>
    <div style="padding:20px;">
      <!-- 기본 정보 -->
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:14px;margin-bottom:16px;">
        <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:10px;">Finding 기본 정보</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div><div style="font-size:0.65rem;color:#aaa;font-weight:700;">번호</div><div style="font-size:0.85rem;font-weight:700;">CAR-${String(idx+1).padStart(3,'0')}</div></div>
          <div><div style="font-size:0.65rem;color:#aaa;font-weight:700;">부문</div><div style="font-size:0.85rem;font-weight:700;">${f.dept}</div></div>
          <div><div style="font-size:0.65rem;color:#aaa;font-weight:700;">ISARP</div><div style="font-size:0.85rem;font-weight:700;">${f.isarp||'-'}</div></div>
          <div><div style="font-size:0.65rem;color:#aaa;font-weight:700;">유형</div><div style="font-size:0.85rem;font-weight:700;">${typeLabel}</div></div>
        </div>
      </div>

      <!-- 지적 내용 -->
      <div style="margin-bottom:16px;">
        <label style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#374151;display:block;margin-bottom:6px;">지적 내용 (Finding Description)</label>
        <div style="background:#fff8f8;border:1px solid rgba(210,0,21,0.15);border-radius:6px;padding:12px;font-size:0.83rem;line-height:1.6;color:#1a1a1a;">${f.desc||'-'}</div>
      </div>

      <!-- CAP 제출 내용 -->
      <div style="margin-bottom:16px;">
        <label style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#374151;display:block;margin-bottom:6px;">CAP 제출 내용</label>
        <div style="font-size:0.68rem;color:#888;margin-bottom:6px;">IATA에 제출한 시정조치계획</div>
        <textarea id="cap-detail-capDetail" rows="4" style="width:100%;padding:10px 12px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:0.82rem;font-family:inherit;resize:vertical;outline:none;" onfocus="this.style.borderColor='#D20015'" onblur="this.style.borderColor='#e0e0e0'">${f.capDetail||''}</textarea>
      </div>

      <!-- 증빙자료 -->
      <div style="margin-bottom:16px;">
        <label style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#374151;display:block;margin-bottom:6px;">증빙자료</label>
        <div style="font-size:0.68rem;color:#888;margin-bottom:6px;">제출 증빙자료 목록</div>
        <input type="text" id="cap-detail-evidence" value="${(f.evidence||'').replace(/"/g,'&quot;')}" style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:0.82rem;font-family:inherit;outline:none;" onfocus="this.style.borderColor='#D20015'" onblur="this.style.borderColor='#e0e0e0'" placeholder="예: 절차서 개정본, 교육 기록 등">
      </div>

      <!-- FAT 제출 내용 -->
      <div style="margin-bottom:16px;">
        <label style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#374151;display:block;margin-bottom:6px;">FAT 제출 내용</label>
        <div style="font-size:0.68rem;color:#888;margin-bottom:6px;">IATA에 제출한 최종조치결과</div>
        <textarea id="cap-detail-fatDetail" rows="4" style="width:100%;padding:10px 12px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:0.82rem;font-family:inherit;resize:vertical;outline:none;" onfocus="this.style.borderColor='#D20015'" onblur="this.style.borderColor='#e0e0e0'">${f.fatDetail||''}</textarea>
      </div>

      <!-- 상태 -->
      <div style="margin-bottom:24px;">
        <label style="font-size:0.72rem;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;color:#374151;display:block;margin-bottom:6px;">상태</label>
        <select id="cap-detail-status" style="width:100%;padding:9px 12px;border:1.5px solid #e0e0e0;border-radius:6px;font-size:0.82rem;font-family:inherit;outline:none;background:#fff;">
          <option value="open" ${f.status==='open'?'selected':''}>미결</option>
          <option value="in_progress" ${f.status==='in_progress'?'selected':''}>조치중</option>
          <option value="closed" ${f.status==='closed'?'selected':''}>종결</option>
        </select>
      </div>

      <!-- 저장 버튼 -->
      <button onclick="saveCapDetail(${idx})" style="width:100%;padding:12px;background:var(--eastar-red);color:#fff;border:none;border-radius:6px;font-size:0.88rem;font-weight:800;cursor:pointer;font-family:inherit;transition:background 200ms;" onmouseover="this.style.background='#9e000f'" onmouseout="this.style.background='var(--eastar-red)'">
        <i class="fas fa-save me-2"></i>저장
      </button>
    </div>`;
  const overlay = document.getElementById('capDetailOverlay');
  const panel = document.getElementById('capDetailPanel');
  overlay.style.display = 'block';
  panel.style.display = 'flex';
}

function closeCapDetail() {
  document.getElementById('capDetailOverlay').style.display = 'none';
  document.getElementById('capDetailPanel').style.display = 'none';
}

function saveCapDetail(idx) {
  const f = APP_DATA.cap.findings[idx];
  if (!f) return;
  f.capDetail = document.getElementById('cap-detail-capDetail').value;
  f.evidence  = document.getElementById('cap-detail-evidence').value;
  f.fatDetail = document.getElementById('cap-detail-fatDetail').value;
  f.status    = document.getElementById('cap-detail-status').value;
  DB.save(APP_DATA);
  closeCapDetail();
  renderCAP();
}

// ─── RBI ──────────────────────────────────────────────────────
function renderRBI() {
  const rbi = APP_DATA.rbiPrep;
  const statusMap = { not_started: '미시작', in_progress: '진행중', completed: '완료' };
  const badgeMap = { not_started: 'badge-notstarted', in_progress: 'badge-inprogress', completed: 'badge-done' };
  document.getElementById('section-rbi').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">RBI 재인증 준비</h2>
    <p class="sect-sub">Risk-Based Inspection · 재인증 심사 준비 현황</p>
  </div>
</div>
<div class="row g-3">
  <div class="col-12">
    <div style="background:#fff;border:1px solid #eee;border-left:4px solid var(--eastar-red);border-radius:6px;padding:24px 28px;box-shadow:0 1px 6px rgba(0,0,0,0.05);">
      <div class="row align-items-center">
        <div class="col-md-8">
          <div style="font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:6px;">RBI Renewal Preparation</div>
          <div style="font-size:1.1rem;font-weight:900;margin-bottom:10px;color:#111;"><i class="fas fa-chart-line me-2" style="color:var(--eastar-red);"></i>RBI (Risk-Based Inspection) 재인증 준비</div>
          <div style="font-size:0.82rem;color:#555;margin-bottom:4px;">재인증 심사 윈도우: <strong style="color:#111;">${DateUtil.format(APP_DATA.certification.renewalWindowStart)} ~ ${DateUtil.format(APP_DATA.certification.renewalWindowEnd)}</strong></div>
          <div style="font-size:0.82rem;color:#555;">적용 ISM: <strong style="color:#111;">Ed. 18 (2026.01.01 발효)</strong> &nbsp;·&nbsp; Maturity Criteria: <strong style="color:#111;">Ed. 3 (2025.06.01 발효)</strong></div>
        </div>
        <div class="col-md-4 text-md-end">
          <div style="font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#aaa;margin-bottom:4px;">재인증 윈도우까지</div>
          <div style="font-size:2.4rem;font-weight:900;color:var(--eastar-red);line-height:1;">D-${DateUtil.daysUntil(APP_DATA.certification.renewalWindowStart)}</div>
          <div style="font-size:0.72rem;color:#888;">${DateUtil.format(APP_DATA.certification.renewalWindowStart)} 개시</div>
        </div>
      </div>
    </div>
  </div>

  <!-- RBI Key differences -->
  <div class="col-md-5">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-info-circle me-2" style="color:var(--eastar-red);"></i>RBI 심사 핵심 준비사항</h6>
      <div class="mb-3 p-3 rounded" style="background:#f8fafc;">
        <div class="fw-bold mb-2" style="font-size:0.85rem;">1. ISARPs 우선순위 기반 심사</div>
        <div class="d-flex gap-2 mb-1">
          <span style="background:var(--eastar-red);color:#fff;padding:2px 8px;border-radius:3px;font-size:0.7rem;font-weight:700;">High</span><span style="font-size:0.8rem;">최우선 집중 심사 대상</span>
        </div>
        <div class="d-flex gap-2 mb-1">
          <span style="background:var(--eastar-gold);color:#fff;padding:2px 8px;border-radius:3px;font-size:0.7rem;font-weight:700;">Medium</span><span style="font-size:0.8rem;">표준 심사</span>
        </div>
        <div class="d-flex gap-2">
          <span style="background:var(--eastar-silver);color:#fff;padding:2px 8px;border-radius:3px;font-size:0.7rem;font-weight:700;">Low</span><span style="font-size:0.8rem;">축소 심사 가능</span>
        </div>
      </div>
      <div class="mb-3 p-3 rounded" style="background:#f8fafc;">
        <div class="fw-bold mb-2" style="font-size:0.85rem;">2. Maturity Assessment (성숙도 평가)</div>
        <div class="maturity-level maturity-established mb-1">
          <strong style="font-size:0.8rem;">Established</strong><div style="font-size:0.75rem;">프로세스 정립·일관 실행</div>
        </div>
        <div class="maturity-level maturity-mature mb-1">
          <strong style="font-size:0.8rem;">Mature</strong><div style="font-size:0.75rem;">데이터 기반, 지속 개선</div>
        </div>
        <div class="maturity-level maturity-leading">
          <strong style="font-size:0.8rem;">Leading</strong><div style="font-size:0.75rem;">산업 선도, 예측적 접근</div>
        </div>
      </div>
      <div class="p-3 rounded" style="background:#f8fafc;">
        <div class="fw-bold mb-2" style="font-size:0.85rem;">3. On-site 현장심사</div>
        <div style="font-size:0.8rem;color:#475569;">IATA 심사원이 직접 방문하여 현장에서 실시하는 심사</div>
      </div>
    </div>
  </div>

  <!-- Maturity Assessment ISARPs -->
  <div class="col-md-7">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-star me-2 text-warning"></i>Maturity Assessment 대상 ISARPs (25개)</h6>
      <div style="font-size:0.75rem;color:#64748b;margin-bottom:12px;">RBI ISM Maturity Criteria Ed.3 (2025.06.01 발효) 기준</div>
      <div class="row g-1">
        ${APP_DATA.rbiMaturityCriteria.keyIsarps.map(isarp => {
          const ma = rbi.maturityAssessments.find(m => m.isarp === isarp);
          const level = ma?.level || '';
          const levelClass = level === 'Leading' ? 'maturity-leading' : level === 'Mature' ? 'maturity-mature' : level === 'Established' ? 'maturity-established' : '';
          return `<div class="col-4 col-md-3 mb-1">
            <div class="p-2 rounded text-center ${levelClass || 'border'}" style="font-size:0.72rem;cursor:pointer;" onclick="setMaturity('${isarp}')">
              <div class="fw-bold">${isarp}</div>
              ${level ? `<div style="font-size:0.65rem;">${level}</div>` : '<div style="color:#94a3b8;font-size:0.65rem;">미평가</div>'}
            </div>
          </div>`;
        }).join('')}
      </div>
      <div class="mt-2" style="font-size:0.75rem;color:#64748b;">클릭하여 성숙도 레벨 설정</div>
    </div>
  </div>

  <!-- Prep Tasks -->
  <div class="col-12">
    <div class="status-card">
      <h6 class="fw-bold mb-3"><i class="fas fa-tasks me-2" style="color:var(--eastar-red);"></i>RBI 재인증 준비 Task 목록</h6>
      <div class="table-responsive">
        <table class="table data-table">
          <thead><tr><th>카테고리</th><th>준비 항목</th><th>ISARP 참조</th><th>목표 기한</th><th>상태</th></tr></thead>
          <tbody>
            ${rbi.prepTasks.map((t,i)=>`<tr>
              <td><span style="background:var(--eastar-red);color:#fff;padding:2px 8px;border-radius:3px;font-size:0.68rem;font-weight:700;">${t.category}</span></td>
              <td>${t.task}</td>
              <td style="font-size:0.78rem;color:#64748b;">${t.isarpRef}</td>
              <td>${DateUtil.format(t.dueDate)} ${DateUtil.urgencyBadge(DateUtil.daysUntil(t.dueDate))}</td>
              <td>
                <select class="form-select form-select-sm" style="width:auto;" onchange="updateRBITask(${i},this.value)">
                  <option value="not_started" ${t.status==='not_started'?'selected':''}>미시작</option>
                  <option value="in_progress" ${t.status==='in_progress'?'selected':''}>진행중</option>
                  <option value="completed" ${t.status==='completed'?'selected':''}>완료</option>
                </select>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <button class="btn btn-sm btn-iata mt-2" onclick="openModal('modal-rbitask')"><i class="fas fa-plus me-1"></i>Task 추가</button>
    </div>
  </div>
</div>
<!-- Maturity Modal -->
<div class="modal fade" id="modal-maturity" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">성숙도 평가 설정</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">ISARP</label><input type="text" class="form-control" id="mat-isarp" readonly></div>
      <div class="mb-3"><label class="form-label">성숙도 레벨</label>
        <select class="form-select" id="mat-level">
          <option value="">미평가</option>
          <option value="Established">Established (정립)</option>
          <option value="Mature">Mature (성숙)</option>
          <option value="Leading">Leading (선도)</option>
        </select>
      </div>
      <div class="mb-3"><label class="form-label">메모</label><textarea class="form-control" id="mat-notes" rows="2"></textarea></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveMaturity()">저장</button></div>
  </div></div>
</div>
<!-- RBI Task Modal -->
<div class="modal fade" id="modal-rbitask" tabindex="-1">
  <div class="modal-dialog"><div class="modal-content">
    <div class="modal-header"><h5 class="modal-title">RBI 준비 Task 추가</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button></div>
    <div class="modal-body">
      <div class="mb-3"><label class="form-label">카테고리</label><input type="text" class="form-control" id="rt-cat" placeholder="예: SMS, QMS, FLT"></div>
      <div class="mb-3"><label class="form-label">준비 항목</label><input type="text" class="form-control" id="rt-task"></div>
      <div class="mb-3"><label class="form-label">ISARP 참조</label><input type="text" class="form-control" id="rt-isarp"></div>
      <div class="mb-3"><label class="form-label">목표 기한</label><input type="date" class="form-control" id="rt-due"></div>
    </div>
    <div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">취소</button><button class="btn btn-iata" onclick="saveRBITask()">저장</button></div>
  </div></div>
</div>`;
}
function updateRBITask(i, val) { APP_DATA.rbiPrep.prepTasks[i].status = val; DB.save(APP_DATA); }
function setMaturity(isarp) {
  const existing = APP_DATA.rbiPrep.maturityAssessments.find(m => m.isarp === isarp);
  document.getElementById('mat-isarp').value = isarp;
  document.getElementById('mat-level').value = existing?.level || '';
  document.getElementById('mat-notes').value = existing?.notes || '';
  openModal('modal-maturity');
}
function saveMaturity() {
  const isarp = document.getElementById('mat-isarp').value;
  const level = document.getElementById('mat-level').value;
  const notes = document.getElementById('mat-notes').value;
  const idx = APP_DATA.rbiPrep.maturityAssessments.findIndex(m => m.isarp === isarp);
  if (idx >= 0) APP_DATA.rbiPrep.maturityAssessments[idx] = { isarp, level, notes };
  else APP_DATA.rbiPrep.maturityAssessments.push({ isarp, level, notes });
  DB.save(APP_DATA);
  bootstrap.Modal.getInstance(document.getElementById('modal-maturity')).hide();
  renderRBI();
}
function saveRBITask() {
  const maxId = Math.max(0, ...APP_DATA.rbiPrep.prepTasks.map(t=>t.id));
  APP_DATA.rbiPrep.prepTasks.push({ id: maxId+1, category: document.getElementById('rt-cat').value, task: document.getElementById('rt-task').value, isarpRef: document.getElementById('rt-isarp').value, dueDate: document.getElementById('rt-due').value, status: 'not_started' });
  DB.save(APP_DATA); bootstrap.Modal.getInstance(document.getElementById('modal-rbitask')).hide(); renderRBI();
}

// ─── UTILS ────────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const m = new bootstrap.Modal(el);
  m.show();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  navigate('dashboard');
});

// ══════════════════════════════════════════════════════════
//  PAST AUDIT RESULTS — 초도심사 결과 상세
// ══════════════════════════════════════════════════════════
function renderPastResults() {
  const a = AUDIT_HISTORY['2025'];
  document.getElementById('section-pastresults').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">과거 IOSA 심사 결과</h2>
    <p class="sect-sub">IOSA Audit History · 연도별 심사 이력</p>
  </div>
  <div class="sect-actions">
    <a href="https://ic.iata.org/group/6949" target="_blank"
       style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border:1.5px solid #ddd;border-radius:4px;font-size:0.75rem;font-weight:700;color:#333;text-decoration:none;transition:border-color 200ms;"
       onmouseover="this.style.borderColor='var(--eastar-red)';this.style.color='var(--eastar-red)';"
       onmouseout="this.style.borderColor='#ddd';this.style.color='#333';">
      <i class="fas fa-external-link-alt"></i> IATA Connect
    </a>
  </div>
</div>

<!-- Year selector -->
<div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;">
  ${['2025','2018','2016','2015','2010'].map(y => {
    const d = AUDIT_HISTORY[y];
    const isActive = y === '2025';
    const isCurrent = d.status === 'REGISTERED';
    return `<button onclick="selectPastYear('${y}')" id="pastyear-${y}"
      style="padding:8px 18px;border-radius:4px;font-family:var(--font);font-size:0.78rem;font-weight:700;cursor:pointer;transition:all 200ms;
      ${isActive
        ? 'background:var(--eastar-red);color:#fff;border:none;'
        : 'background:#fff;color:#555;border:1.5px solid #ddd;'}">
      ${y}
      <span style="font-size:0.62rem;margin-left:4px;opacity:0.8;">${d.type.split(' ')[0]}</span>
    </button>`;
  }).join('')}
</div>

<div id="past-results-content">
  ${renderPastYearContent('2025')}
</div>
`;
}

function selectPastYear(year) {
  document.querySelectorAll('[id^="pastyear-"]').forEach(b => {
    b.style.background = '#fff'; b.style.color = '#555'; b.style.border = '1.5px solid #ddd';
  });
  const active = document.getElementById('pastyear-' + year);
  if (active) { active.style.background = 'var(--eastar-red)'; active.style.color = '#fff'; active.style.border = 'none'; }
  document.getElementById('past-results-content').innerHTML = renderPastYearContent(year);
}

function renderPastYearContent(year) {
  const a = AUDIT_HISTORY[year];
  if (a.placeholder) {
    return `
    <div style="background:#fff;border:1px solid #eee;border-radius:6px;padding:48px 32px;text-align:center;box-shadow:0 1px 6px rgba(0,0,0,0.05);">
      <div style="font-size:4rem;font-weight:900;color:#f0f0f0;margin-bottom:16px;">${a.year}</div>
      <div style="font-size:1rem;font-weight:700;color:#111;margin-bottom:8px;">${a.type} 심사 기록</div>
      <div style="font-size:0.8rem;color:#888;margin-bottom:20px;">${a.notes}</div>
      <a href="https://ic.iata.org/group/6949" target="_blank"
         style="display:inline-flex;align-items:center;gap:6px;padding:10px 22px;background:var(--eastar-red);color:#fff;border-radius:4px;font-size:0.78rem;font-weight:700;text-decoration:none;">
        <i class="fas fa-external-link-alt"></i> IATA Connect에서 확인
      </a>
    </div>`;
  }

  // 2025 full data — visual redesign
  return `

  <!-- ① 인증서 히어로 카드 -->
  <div style="background:#fff;border:1px solid #e8e8e8;border-left:5px solid var(--eastar-red);border-radius:8px;padding:24px 28px;margin-bottom:16px;box-shadow:0 2px 8px rgba(0,0,0,0.06);display:flex;align-items:center;gap:28px;flex-wrap:wrap;">
    <img src="assets/iosa_stamp.png" style="width:88px;height:88px;object-fit:contain;flex-shrink:0;" alt="IOSA stamp">
    <div style="flex:1;min-width:200px;">
      <div style="display:inline-flex;align-items:center;gap:7px;background:var(--eastar-red);color:#fff;padding:4px 12px;border-radius:3px;font-size:0.65rem;font-weight:900;letter-spacing:1.5px;margin-bottom:8px;">
        <i class="fas fa-certificate"></i> IOSA REGISTERED
      </div>
      <div style="font-size:1.25rem;font-weight:900;color:#111;margin-bottom:2px;">EASTAR JET Co., Ltd.</div>
      <div style="font-size:0.78rem;color:#888;margin-bottom:4px;">IAR No. ${a.iar} &nbsp;·&nbsp; ZE / ESR</div>
      <div style="font-size:0.75rem;color:#555;">인증 유효: <strong>${a.dates.split('~')[0].replace('2025.07.28','2025.08.01').trim()} ~ ${a.expiry}</strong></div>
    </div>
    <div style="display:flex;gap:20px;flex-shrink:0;">
      <div style="text-align:center;padding:16px 24px;background:#fff0f0;border:1px solid rgba(210,0,21,0.15);border-radius:8px;">
        <div style="font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:var(--eastar-red);margin-bottom:4px;">FINDINGS</div>
        <div style="font-size:2.6rem;font-weight:900;color:var(--eastar-red);line-height:1;">${a.totalF}</div>
        <div style="font-size:0.68rem;color:#888;margin-top:2px;">건</div>
      </div>
      <div style="text-align:center;padding:16px 24px;background:#fdf8ee;border:1px solid rgba(152,123,55,0.2);border-radius:8px;">
        <div style="font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#7a5e1c;margin-bottom:4px;">OBSERVATIONS</div>
        <div style="font-size:2.6rem;font-weight:900;color:#7a5e1c;line-height:1;">${a.totalO}</div>
        <div style="font-size:0.68rem;color:#888;margin-top:2px;">건</div>
      </div>
    </div>
  </div>

  <!-- ② 핵심 정보 바 -->
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;">
    ${[
      {icon:'fa-calendar-alt', label:'본점검 기간', val:a.dates},
      {icon:'fa-book-open',    label:'ISM 버전',    val:a.ism},
      {icon:'fa-clock',        label:'인증 만료',    val:a.expiry},
      {icon:'fa-plane',        label:'보유 기종',    val:a.fleet},
    ].map(s=>`
      <div style="background:#fff;border:1px solid #e8e8e8;border-radius:6px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:6px;">
          <i class="fas ${s.icon}" style="color:var(--eastar-red);font-size:0.75rem;width:14px;text-align:center;"></i>
          <span style="font-size:0.6rem;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#aaa;">${s.label}</span>
        </div>
        <div style="font-size:0.82rem;font-weight:700;color:#111;">${s.val}</div>
      </div>
    `).join('')}
  </div>

  <!-- ③ 심사원 + 부문별 결과 (2열) -->
  <div style="display:grid;grid-template-columns:1fr 1.4fr;gap:16px;margin-bottom:16px;">

    <!-- 심사원 리스트 -->
    <div style="background:#fff;border:1px solid #e8e8e8;border-radius:8px;padding:20px 22px;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
      <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #f0f0f0;">
        <i class="fas fa-users me-1" style="color:var(--eastar-red);"></i> IATA Auditors
      </div>
      ${a.auditors.map(aud => `
        <div style="display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid #f8f8f8;">
          <div style="width:36px;height:36px;border-radius:50%;background:#f5f5f5;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i class="fas fa-user-tie" style="color:#999;font-size:0.85rem;"></i>
          </div>
          <div style="flex:1;">
            <div style="display:flex;align-items:center;gap:7px;margin-bottom:3px;">
              <span style="font-size:0.85rem;font-weight:700;color:${aud.name==='—'?'#aaa':'#111'};">${aud.name==='—'?'정보 없음':aud.name}</span>
              <span style="padding:1px 7px;border-radius:3px;font-size:0.6rem;font-weight:800;${aud.role==='Lead Auditor'?'background:var(--eastar-red);color:#fff;':'background:#f0f0f0;color:#555;'}">${aud.role}</span>
            </div>
            <div style="font-size:0.72rem;color:#888;">${aud.sections}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- 부문별 심사 결과 -->
    <div style="background:#fff;border:1px solid #e8e8e8;border-radius:8px;padding:20px 22px;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
      <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #f0f0f0;">
        <i class="fas fa-list-check me-1" style="color:var(--eastar-red);"></i> 부문별 심사 결과
      </div>
      <div style="display:grid;grid-template-columns:36px 1fr auto;gap:0;align-items:center;">
        <div style="font-size:0.58rem;font-weight:800;color:#aaa;padding:4px 0;border-bottom:2px solid #f0f0f0;">CODE</div>
        <div style="font-size:0.58rem;font-weight:800;color:#aaa;padding:4px 0;border-bottom:2px solid #f0f0f0;">부문</div>
        <div style="font-size:0.58rem;font-weight:800;color:#aaa;padding:4px 0;border-bottom:2px solid #f0f0f0;text-align:right;">결과</div>
        ${a.sections.map(s=>`
          <div style="font-size:0.65rem;font-weight:900;color:#888;padding:7px 0;border-bottom:1px solid #f8f8f8;letter-spacing:0.5px;">${s.code}</div>
          <div style="font-size:0.78rem;color:#333;padding:7px 8px;border-bottom:1px solid #f8f8f8;">${s.name}</div>
          <div style="padding:7px 0;border-bottom:1px solid #f8f8f8;display:flex;gap:5px;justify-content:flex-end;flex-wrap:wrap;">
            ${s.f>0?`<span style="background:#fff0f0;color:var(--eastar-red);border:1px solid rgba(210,0,21,0.2);padding:1px 7px;border-radius:3px;font-size:0.62rem;font-weight:800;">F ${s.f}</span>`:''}
            ${s.o>0?`<span style="background:#fdf8ee;color:#7a5e1c;border:1px solid rgba(152,123,55,0.25);padding:1px 7px;border-radius:3px;font-size:0.62rem;font-weight:800;">O ${s.o}</span>`:''}
            ${s.f===0&&s.o===0?`<span style="background:#f0faf4;color:#1a7a4a;border:1px solid rgba(26,122,74,0.2);padding:1px 7px;border-radius:3px;font-size:0.62rem;font-weight:700;">✓</span>`:''}
          </div>
        `).join('')}
      </div>
    </div>
  </div>

  <!-- ④ 주요 Findings -->
  <div style="background:#fff;border:1px solid #e8e8e8;border-radius:8px;padding:20px 22px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
    <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;margin-bottom:14px;padding-bottom:8px;border-bottom:1px solid #f0f0f0;">
      <i class="fas fa-exclamation-triangle me-1" style="color:var(--eastar-red);"></i> 주요 Findings
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      ${a.keyCARs.map(c=>`
        <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 12px;background:#fafafa;border:1px solid #f0f0f0;border-radius:6px;">
          <span style="background:#fff0f0;color:var(--eastar-red);border:1px solid rgba(210,0,21,0.2);padding:2px 8px;border-radius:3px;font-size:0.6rem;font-weight:900;flex-shrink:0;white-space:nowrap;">${c.isarp}</span>
          <div style="font-size:0.76rem;color:#444;line-height:1.5;">${c.desc}</div>
        </div>
      `).join('')}
    </div>
    <div style="margin-top:12px;padding:8px 14px;background:#f0faf4;border-radius:4px;font-size:0.72rem;color:#1a7a4a;font-weight:700;">
      <i class="fas fa-check-circle me-1"></i> 전체 Findings / OBS 종결 완료 — IOSA 인증서 취득
    </div>
  </div>

  <!-- ⑤ 문서 버튼 -->
  <div style="display:flex;gap:10px;flex-wrap:wrap;">
    <button onclick="openOrUploadFile('iosa_cert','IOSA 인증서')"
      style="display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:var(--eastar-red);color:#fff;border:none;border-radius:4px;font-size:0.78rem;font-weight:800;cursor:pointer;">
      <i class="fas fa-certificate"></i> 인증서 열기
    </button>
    <button onclick="openOrUploadFile('iosa_iar','IAR 보고서')"
      style="display:inline-flex;align-items:center;gap:7px;padding:10px 22px;background:#fff;color:#333;border:1.5px solid #ddd;border-radius:4px;font-size:0.78rem;font-weight:700;cursor:pointer;">
      <i class="fas fa-file-alt"></i> IAR 보고서
    </button>
  </div>
  `;
}

// ══════════════════════════════════════════════════════════
//  CONFORMANCE REPORT (CR) — 부문별 ISARP 적합성 검토
// ══════════════════════════════════════════════════════════
let crSection = 'ORG';
let crEditId  = null;

const CR_SECTIONS = ['ORG','FLT','DSP','MNT','CAB','GRH','CGO','SEC'];
const CR_SECTION_NAMES = {ORG:'조직 및 안전',FLT:'운항',DSP:'종합통제',MNT:'정비',CAB:'객실',GRH:'운송',CGO:'화물',SEC:'항공보안'};
const CR_STATUS_MAP = {
  conform:     {label:'적합 (C)',       color:'#1a7a4a', bg:'#f0faf4', border:'rgba(26,122,74,0.2)'},
  non_conform: {label:'부적합 (NC)',    color:'#dc3545', bg:'#fff0f0', border:'rgba(220,53,69,0.2)'},
  na:          {label:'해당없음 (NA)',  color:'#888',    bg:'#f5f5f5', border:'#e0e0e0'},
  pending:     {label:'검토 중',        color:'#7a5e1c', bg:'#fdf8ee', border:'rgba(152,123,55,0.25)'},
};

function renderCR() {
  if (!APP_DATA.cr) APP_DATA.cr = { entries: [] };
  const entries = APP_DATA.cr.entries.filter(e => e.section === crSection);
  const allEntries = APP_DATA.cr.entries;
  const adminView = typeof isAdmin !== 'undefined' && isAdmin;

  // Section stats
  const sectionStats = CR_SECTIONS.map(s => {
    const se = allEntries.filter(e => e.section === s);
    return { s, total: se.length, c: se.filter(e=>e.status==='conform').length, nc: se.filter(e=>e.status==='non_conform').length, v: se.filter(e=>e.verified).length };
  });

  document.getElementById('section-cr').innerHTML = `
<div class="sect-header">
  <div>
    <h2 class="sect-title">Conformance Report (CR) 작성</h2>
    <p class="sect-sub">ISARP 적합성 검토 · 매뉴얼 근거 기록 · 엑셀 추출</p>
  </div>
  <div class="sect-actions" style="display:flex;gap:8px;flex-wrap:wrap;">
    ${adminView ? `
    <label style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:#f0f0f0;color:#333;border-radius:4px;font-size:0.75rem;font-weight:700;cursor:pointer;">
      <i class="fas fa-upload"></i> 매뉴얼 업로드
      <input type="file" style="display:none;" accept=".pdf,.docx,.doc" onchange="handleCRManualUpload(this)">
    </label>
    <button onclick="openCREntryModal(null)" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:var(--eastar-red);color:#fff;border:none;border-radius:4px;font-size:0.75rem;font-weight:700;cursor:pointer;">
      <i class="fas fa-plus"></i> ISARP 추가
    </button>` : ''}
    <button onclick="exportCRExcel()" style="display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:#1a7a4a;color:#fff;border:none;border-radius:4px;font-size:0.75rem;font-weight:700;cursor:pointer;">
      <i class="fas fa-file-excel"></i> Excel 추출
    </button>
  </div>
</div>

<!-- 섹션별 진행 요약 -->
<div style="display:flex;gap:8px;overflow-x:auto;margin-bottom:20px;padding-bottom:4px;">
  ${sectionStats.map(st=>`
    <div onclick="crSection='${st.s}';renderCR();" style="flex-shrink:0;padding:10px 14px;background:${crSection===st.s?'var(--eastar-red)':'#fff'};color:${crSection===st.s?'#fff':'#333'};border:1.5px solid ${crSection===st.s?'var(--eastar-red)':'#e0e0e0'};border-radius:6px;cursor:pointer;text-align:center;min-width:72px;transition:all 150ms;">
      <div style="font-size:0.65rem;font-weight:900;letter-spacing:1.5px;${crSection===st.s?'':'color:#888;'}">${st.s}</div>
      <div style="font-size:0.72rem;font-weight:700;margin-top:3px;">${st.total > 0 ? st.total+'항목' : '—'}</div>
      ${st.total>0?`<div style="font-size:0.6rem;margin-top:2px;opacity:0.8;">C:${st.c} NC:${st.nc}</div>`:''}
    </div>
  `).join('')}
</div>

<!-- 현재 섹션 헤더 -->
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
  <div>
    <span style="font-size:0.65rem;font-weight:900;letter-spacing:2px;color:var(--eastar-red);">${crSection}</span>
    <span style="font-size:0.9rem;font-weight:800;color:#111;margin-left:8px;">${CR_SECTION_NAMES[crSection]}</span>
    <span style="font-size:0.75rem;color:#aaa;margin-left:8px;">${entries.length}개 ISARP 항목</span>
  </div>
  <div style="display:flex;gap:12px;font-size:0.72rem;">
    <span style="color:#1a7a4a;font-weight:700;"><i class="fas fa-check me-1"></i>C: ${entries.filter(e=>e.status==='conform').length}</span>
    <span style="color:#dc3545;font-weight:700;"><i class="fas fa-times me-1"></i>NC: ${entries.filter(e=>e.status==='non_conform').length}</span>
    <span style="color:#888;font-weight:700;">NA: ${entries.filter(e=>e.status==='na').length}</span>
    <span style="color:#7a5e1c;font-weight:700;">검토중: ${entries.filter(e=>e.status==='pending'||!e.status).length}</span>
  </div>
</div>

<!-- 매뉴얼 업로드 안내 -->
<div id="cr-manual-status" style="margin-bottom:14px;"></div>

<!-- ISARP 항목 목록 -->
${entries.length === 0 ? `
<div style="background:#f9f9f9;border:1px dashed #ddd;border-radius:8px;padding:48px 32px;text-align:center;">
  <i class="fas fa-clipboard-list" style="font-size:2.5rem;color:#ddd;margin-bottom:12px;display:block;"></i>
  <div style="font-size:0.9rem;font-weight:700;color:#aaa;margin-bottom:6px;">${crSection} 부문 ISARP 항목이 없습니다</div>
  <div style="font-size:0.78rem;color:#bbb;margin-bottom:16px;">ISARP 코드와 요건을 입력하여 CR 항목을 추가하세요</div>
  ${adminView ? `<button onclick="openCREntryModal(null)" style="padding:9px 22px;background:var(--eastar-red);color:#fff;border:none;border-radius:4px;font-size:0.78rem;font-weight:700;cursor:pointer;"><i class="fas fa-plus me-1"></i>첫 번째 ISARP 추가</button>` : ''}
</div>` : `
<div style="display:flex;flex-direction:column;gap:10px;">
  ${entries.map(e => {
    const st = CR_STATUS_MAP[e.status] || CR_STATUS_MAP.pending;
    return `
    <div style="background:#fff;border:1px solid #e8e8e8;border-left:4px solid ${st.color};border-radius:6px;padding:16px 18px;">
      <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;">
        <div style="flex:1;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
            <span style="background:#f5f5f5;color:#444;padding:2px 10px;border-radius:3px;font-size:0.68rem;font-weight:900;letter-spacing:0.5px;">${e.isarp}</span>
            <span style="background:${st.bg};color:${st.color};border:1px solid ${st.border};padding:2px 8px;border-radius:3px;font-size:0.65rem;font-weight:800;">${st.label}</span>
            ${e.verified?`<span style="background:#f0faf4;color:#1a7a4a;border:1px solid rgba(26,122,74,0.2);padding:2px 8px;border-radius:3px;font-size:0.65rem;font-weight:800;"><i class="fas fa-check-circle me-1"></i>검토완료</span>`:''}
          </div>
          <div style="font-size:0.82rem;font-weight:600;color:#111;margin-bottom:6px;">${e.requirement||'—'}</div>
        </div>
        ${adminView ? `
        <div style="display:flex;gap:6px;flex-shrink:0;">
          <button onclick="openCREntryModal('${e.id}')" style="padding:4px 10px;background:#f5f5f5;border:1px solid #ddd;border-radius:3px;font-size:0.68rem;font-weight:700;cursor:pointer;color:#444;"><i class="fas fa-pen"></i></button>
          <button onclick="deleteCREntry('${e.id}')" style="padding:4px 10px;background:#fff0f0;border:1px solid rgba(210,0,21,0.2);border-radius:3px;font-size:0.68rem;font-weight:700;cursor:pointer;color:var(--eastar-red);"><i class="fas fa-trash"></i></button>
        </div>` : ''}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:8px;">
        <div>
          <div style="font-size:0.62rem;font-weight:800;text-transform:uppercase;color:#aaa;margin-bottom:3px;">매뉴얼 근거</div>
          <div style="font-size:0.78rem;color:#333;background:#f8f8f8;padding:6px 10px;border-radius:4px;min-height:28px;">${e.manualRef||'<span style="color:#bbb;">미입력</span>'}</div>
        </div>
        <div>
          <div style="font-size:0.62rem;font-weight:800;text-transform:uppercase;color:#aaa;margin-bottom:3px;">적합성 근거 (Evidence)</div>
          <div style="font-size:0.78rem;color:#333;background:#f8f8f8;padding:6px 10px;border-radius:4px;min-height:28px;">${e.evidence||'<span style="color:#bbb;">미입력</span>'}</div>
        </div>
      </div>

      ${e.verificationNote ? `
      <div style="background:#fef3c7;border:1px solid rgba(251,191,36,0.4);border-radius:4px;padding:7px 10px;font-size:0.75rem;color:#78350f;">
        <i class="fas fa-comment-alt me-1"></i><strong>검토의견:</strong> ${e.verificationNote}
      </div>` : ''}

      ${adminView ? `
      <div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">
        ${Object.entries(CR_STATUS_MAP).map(([k,v])=>`
          <button onclick="setCRStatus('${e.id}','${k}')" style="padding:3px 10px;border-radius:3px;font-size:0.65rem;font-weight:700;cursor:pointer;border:1.5px solid ${e.status===k?v.color:'#ddd'};background:${e.status===k?v.bg:'#fff'};color:${e.status===k?v.color:'#888'};">${v.label}</button>
        `).join('')}
        <button onclick="toggleCRVerified('${e.id}')" style="margin-left:auto;padding:3px 12px;border-radius:3px;font-size:0.65rem;font-weight:800;cursor:pointer;border:1.5px solid ${e.verified?'#1a7a4a':'#ddd'};background:${e.verified?'#f0faf4':'#fff'};color:${e.verified?'#1a7a4a':'#aaa'};">
          <i class="fas fa-check-circle me-1"></i>${e.verified?'검토완료':'검토완료 표시'}
        </button>
      </div>` : ''}
    </div>`;
  }).join('')}
</div>`}

<!-- CR Entry Modal -->
<div class="modal fade" id="modal-cr-entry" tabindex="-1">
  <div class="modal-dialog modal-lg"><div class="modal-content">
    <div class="modal-header">
      <h5 class="modal-title fw-bold" id="cr-modal-title">ISARP 항목 추가</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
    </div>
    <div class="modal-body">
      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label fw-bold" style="font-size:0.78rem;">부문</label>
          <select class="form-control" id="cr-e-section" onchange="crSection=this.value;">
            ${CR_SECTIONS.map(s=>`<option value="${s}" ${s===crSection?'selected':''}>${s} — ${CR_SECTION_NAMES[s]}</option>`).join('')}
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label fw-bold" style="font-size:0.78rem;">ISARP 코드</label>
          <input type="text" class="form-control" id="cr-e-isarp" placeholder="예: ORG 2.1.1">
        </div>
        <div class="col-md-3">
          <label class="form-label fw-bold" style="font-size:0.78rem;">적합성 상태</label>
          <select class="form-control" id="cr-e-status">
            ${Object.entries(CR_STATUS_MAP).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label fw-bold" style="font-size:0.78rem;">검토완료</label>
          <select class="form-control" id="cr-e-verified">
            <option value="0">미완료</option>
            <option value="1">검토완료 ✓</option>
          </select>
        </div>
        <div class="col-12">
          <label class="form-label fw-bold" style="font-size:0.78rem;">ISARP 요건 (Requirements)</label>
          <textarea class="form-control" id="cr-e-requirement" rows="3" placeholder="ISARP 원문 요건 내용을 입력하세요"></textarea>
        </div>
        <div class="col-12">
          <label class="form-label fw-bold" style="font-size:0.78rem;">매뉴얼 근거 (Manual Reference)</label>
          <input type="text" class="form-control" id="cr-e-manualref" placeholder="예: OM Part A 5.3.1, SMS Manual 3.2">
        </div>
        <div class="col-12">
          <label class="form-label fw-bold" style="font-size:0.78rem;">적합성 근거 / Evidence</label>
          <textarea class="form-control" id="cr-e-evidence" rows="3" placeholder="매뉴얼 근거가 ISARP 요건을 충족하는 이유, 증빙자료 등"></textarea>
        </div>
        <div class="col-12">
          <label class="form-label fw-bold" style="font-size:0.78rem;">검토 의견 (Verification Note)</label>
          <textarea class="form-control" id="cr-e-verificationnote" rows="2" placeholder="검토 시 발견된 사항, 개선 필요 부분 등"></textarea>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">취소</button>
      <button type="button" class="btn btn-danger fw-bold" onclick="saveCREntry()">저장</button>
    </div>
  </div></div>
</div>`;

  // Load uploaded manual status
  getManualFiles().then(files => {
    const el = document.getElementById('cr-manual-status');
    if (!el) return;
    if (files.length > 0) {
      el.innerHTML = `<div style="background:#f0faf4;border:1px solid rgba(26,122,74,0.2);border-radius:6px;padding:10px 14px;font-size:0.76rem;color:#1a7a4a;display:flex;align-items:center;gap:8px;">
        <i class="fas fa-book me-1"></i>
        <span>업로드된 매뉴얼 <strong>${files.length}개</strong> (${files.map(f=>f.name).join(', ')}) — 매뉴얼 근거 입력 시 이 파일들을 참조하세요</span>
      </div>`;
    } else {
      el.innerHTML = `<div style="background:#fdf8ee;border:1px solid rgba(152,123,55,0.2);border-radius:6px;padding:10px 14px;font-size:0.76rem;color:#7a5e1c;display:flex;align-items:center;gap:8px;">
        <i class="fas fa-exclamation-triangle me-1"></i>
        <span>업로드된 매뉴얼이 없습니다. 상단 <strong>'매뉴얼 업로드'</strong>로 참조 매뉴얼을 업로드하면 근거 확인 시 활용할 수 있습니다.</span>
      </div>`;
    }
  }).catch(()=>{});
}

function openCREntryModal(id) {
  crEditId = id;
  const title = document.getElementById('cr-modal-title');
  if (title) title.textContent = id ? 'ISARP 항목 수정' : 'ISARP 항목 추가';

  if (id) {
    const e = (APP_DATA.cr.entries||[]).find(x=>x.id===id);
    if (!e) return;
    document.getElementById('cr-e-section').value          = e.section || crSection;
    document.getElementById('cr-e-isarp').value            = e.isarp || '';
    document.getElementById('cr-e-status').value           = e.status || 'pending';
    document.getElementById('cr-e-verified').value         = e.verified ? '1' : '0';
    document.getElementById('cr-e-requirement').value      = e.requirement || '';
    document.getElementById('cr-e-manualref').value        = e.manualRef || '';
    document.getElementById('cr-e-evidence').value         = e.evidence || '';
    document.getElementById('cr-e-verificationnote').value = e.verificationNote || '';
  } else {
    document.getElementById('cr-e-section').value          = crSection;
    document.getElementById('cr-e-isarp').value            = '';
    document.getElementById('cr-e-status').value           = 'pending';
    document.getElementById('cr-e-verified').value         = '0';
    document.getElementById('cr-e-requirement').value      = '';
    document.getElementById('cr-e-manualref').value        = '';
    document.getElementById('cr-e-evidence').value         = '';
    document.getElementById('cr-e-verificationnote').value = '';
  }
  new bootstrap.Modal(document.getElementById('modal-cr-entry')).show();
}

function saveCREntry() {
  if (!APP_DATA.cr) APP_DATA.cr = { entries: [] };
  const newEntry = {
    id:               crEditId || 'cr_' + Date.now(),
    section:          document.getElementById('cr-e-section').value,
    isarp:            document.getElementById('cr-e-isarp').value.trim(),
    status:           document.getElementById('cr-e-status').value,
    verified:         document.getElementById('cr-e-verified').value === '1',
    requirement:      document.getElementById('cr-e-requirement').value.trim(),
    manualRef:        document.getElementById('cr-e-manualref').value.trim(),
    evidence:         document.getElementById('cr-e-evidence').value.trim(),
    verificationNote: document.getElementById('cr-e-verificationnote').value.trim(),
    updatedAt:        new Date().toISOString(),
  };
  crSection = newEntry.section;
  if (crEditId) {
    const idx = APP_DATA.cr.entries.findIndex(x=>x.id===crEditId);
    if (idx >= 0) APP_DATA.cr.entries[idx] = newEntry;
  } else {
    APP_DATA.cr.entries.push(newEntry);
  }
  DB.save(APP_DATA);
  bootstrap.Modal.getInstance(document.getElementById('modal-cr-entry')).hide();
  crEditId = null;
  renderCR();
}

function deleteCREntry(id) {
  if (!confirm('이 ISARP 항목을 삭제하시겠습니까?')) return;
  APP_DATA.cr.entries = APP_DATA.cr.entries.filter(e=>e.id!==id);
  DB.save(APP_DATA);
  renderCR();
}

function setCRStatus(id, status) {
  const e = (APP_DATA.cr.entries||[]).find(x=>x.id===id);
  if (!e) return;
  e.status = status;
  DB.save(APP_DATA);
  renderCR();
}

function toggleCRVerified(id) {
  const e = (APP_DATA.cr.entries||[]).find(x=>x.id===id);
  if (!e) return;
  e.verified = !e.verified;
  DB.save(APP_DATA);
  renderCR();
}

function handleCRManualUpload(input) {
  if (!input.files || !input.files[0]) return;
  // Reuse the existing manual upload system
  handleManualUpload(input);
  setTimeout(() => renderCR(), 500);
}

function exportCRExcel() {
  if (typeof XLSX === 'undefined') { alert('Excel 라이브러리 로딩 중입니다. 잠시 후 다시 시도하세요.'); return; }
  const entries = APP_DATA.cr.entries;
  if (entries.length === 0) { alert('내보낼 CR 항목이 없습니다.'); return; }

  const wb = XLSX.utils.book_new();
  const statusLabels = {conform:'적합 (C)',non_conform:'부적합 (NC)',na:'해당없음 (NA)',pending:'검토 중'};
  const secNames = {ORG:'조직 및 안전',FLT:'운항',DSP:'종합통제',MNT:'정비',CAB:'객실',GRH:'운송',CGO:'화물',SEC:'항공보안'};

  // Sheet 1: 전체 CR 목록
  const allRows = [
    ['부문', 'ISARP', 'ISARP 요건', '매뉴얼 근거', '적합성 근거/Evidence', '적합성 상태', '검토의견', '검토완료', '최종수정일']
  ];
  entries.forEach(e => {
    allRows.push([
      (secNames[e.section]||e.section),
      e.isarp,
      e.requirement,
      e.manualRef,
      e.evidence,
      (statusLabels[e.status]||e.status),
      e.verificationNote,
      e.verified ? '완료 ✓' : '',
      e.updatedAt ? new Date(e.updatedAt).toLocaleDateString('ko-KR') : '',
    ]);
  });
  const ws1 = XLSX.utils.aoa_to_sheet(allRows);
  ws1['!cols'] = [{wch:12},{wch:14},{wch:40},{wch:25},{wch:40},{wch:14},{wch:25},{wch:8},{wch:12}];
  XLSX.utils.book_append_sheet(wb, ws1, '전체 CR');

  // Sheet per section
  CR_SECTIONS.forEach(sec => {
    const secEntries = entries.filter(e=>e.section===sec);
    if (secEntries.length === 0) return;
    const rows = [['ISARP','요건','매뉴얼 근거','Evidence','상태','검토의견','검토완료']];
    secEntries.forEach(e => rows.push([e.isarp, e.requirement, e.manualRef, e.evidence, statusLabels[e.status]||e.status, e.verificationNote, e.verified?'완료':'']));
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{wch:14},{wch:40},{wch:25},{wch:40},{wch:14},{wch:25},{wch:8}];
    XLSX.utils.book_append_sheet(wb, ws, sec);
  });

  XLSX.writeFile(wb, `CR_이스타항공_${new Date().toLocaleDateString('ko-KR').replace(/\./g,'').replace(/ /g,'')}.xlsx`);
}
