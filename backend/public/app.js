// FitMon App — frontend logic
// Wired to NestJS backend; localStorage stores fitmonCurrentUser {id, username, role}

const STORAGE_KEYS = {
  currentUser: 'fitmonCurrentUser',
  sessionCode: 'fitmonSessionCode',
  sessionId: 'fitmonSessionId',
};

function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.currentUser);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  localStorage.removeItem(STORAGE_KEYS.sessionCode);
  localStorage.removeItem(STORAGE_KEYS.sessionId);
  window.location.href = '/login.html';
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) { window.location.href = '/login.html'; return null; }
  return user;
}

function setSessionInfo(code, sessionId) {
  if (code) localStorage.setItem(STORAGE_KEYS.sessionCode, code);
  if (sessionId) localStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
}

function getSessionCode() { return localStorage.getItem(STORAGE_KEYS.sessionCode) || ''; }
function getSessionId() { return localStorage.getItem(STORAGE_KEYS.sessionId) || ''; }

// ── Toast system ──────────────────────────────────────────────────────────────
function showToast(message, type = 'info', title = '') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || 'ℹ'}</div>
    <div class="toast-body">
      ${title ? `<div class="toast-title">${title}</div>` : ''}
      <div class="toast-msg">${message}</div>
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">×</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 350); }, 4000);
}

// ── Page wiring ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const page = document.body.dataset.page;

  // Logout link (any page)
  const logoutLink = document.querySelector('[data-logout]');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) { e.preventDefault(); logout(); });
  }

  // ── SIGNUP ────────────────────────────────────────────────────────────────
  if (page === 'signup') {
    const form = document.getElementById('signupForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('username')?.value.trim();
      const role = document.querySelector('input[name="role"]:checked')?.value || document.getElementById('role')?.value;
      const password = document.getElementById('password')?.value;
      const name = document.getElementById('name')?.value.trim() || '';
      const errEl = document.getElementById('signupError');
      if (!username || !role || !password) {
        if (errEl) { errEl.textContent = 'All fields are required.'; errEl.style.display = 'block'; }
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Creating account…'; }
      fetch('/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, role, password, name }),
      })
        .then(r => r.json())
        .then(data => {
          if (!data.success) {
            if (errEl) { errEl.textContent = data.message || 'Signup failed'; errEl.style.display = 'block'; }
            if (btn) { btn.disabled = false; btn.textContent = 'Create account'; }
            return;
          }
          setCurrentUser({ id: data.user.id, username: data.user.username, role: data.user.role });
          window.location.href = '/home.html';
        })
        .catch(() => {
          if (errEl) { errEl.textContent = 'Network error. Try again.'; errEl.style.display = 'block'; }
          if (btn) { btn.disabled = false; btn.textContent = 'Create account'; }
        });
    });
  }

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (page === 'login') {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const username = document.getElementById('username')?.value.trim();
      const password = document.getElementById('password')?.value;
      const errEl = document.getElementById('loginError');
      if (!username || !password) {
        if (errEl) { errEl.textContent = 'Enter username and password.'; errEl.style.display = 'block'; }
        return;
      }
      const btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
      fetch('/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then(async r => {
          if (!r.ok) { const j = await r.json().catch(() => ({})); throw new Error(j.message || 'Login failed'); }
          return r.json();
        })
        .then(data => {
          if (!data.success) {
            if (errEl) { errEl.textContent = data.message || 'Login failed'; errEl.style.display = 'block'; }
            if (btn) { btn.disabled = false; btn.textContent = 'Sign in'; }
            return;
          }
          setCurrentUser({ id: data.user.id, username: data.user.username, role: data.user.role });
          window.location.href = '/home.html';
        })
        .catch(err => {
          if (errEl) { errEl.textContent = err.message || 'Login request failed'; errEl.style.display = 'block'; }
          if (btn) { btn.disabled = false; btn.textContent = 'Sign in'; }
        });
    });
  }

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (page === 'home') {
    const user = requireAuth();
    if (!user) return;
    const nameSpan = document.querySelector('[data-user-name]');
    if (nameSpan) nameSpan.textContent = user.username;
    const roleSpan = document.querySelector('[data-user-role]');
    if (roleSpan) roleSpan.textContent = user.role === 'doctor' ? 'Doctor' : 'Fitness Enthusiast';
    const avatarEl = document.getElementById('homeAvatar');
    if (avatarEl) avatarEl.textContent = (user.username || 'U')[0].toUpperCase();
    const roleBadge = document.getElementById('roleBadge');
    if (roleBadge) { roleBadge.textContent = user.role === 'doctor' ? 'Doctor' : 'Fitness Enthusiast'; }
    // Session card description by role
    const sessionDesc = document.getElementById('sessionCardDesc');
    if (sessionDesc) {
      sessionDesc.textContent = user.role === 'doctor'
        ? 'Generate a meeting code and monitor your patient live.'
        : 'Enter your session code to start your supervised workout.';
    }
  }

  // ── WORKOUTS ──────────────────────────────────────────────────────────────
  if (page === 'workouts') {
    const user = requireAuth();
    if (!user) return;
    loadWorkouts(user.id);
    const refreshBtn = document.getElementById('refreshWorkouts');
    if (refreshBtn) refreshBtn.addEventListener('click', () => loadWorkouts(user.id));
  }

  // ── SESSION (unified doctor+patient) ─────────────────────────────────────
  if (page === 'session') {
    const user = requireAuth();
    if (!user) return;

    const tabBar = document.getElementById('tabBar');
    const tabDoctor = document.getElementById('tabDoctor');
    const tabPatient = document.getElementById('tabPatient');
    const panelDoctor = document.getElementById('panelDoctor');
    const panelPatient = document.getElementById('panelPatient');

    function showPanel(which) {
      if (panelDoctor) panelDoctor.style.display = which === 'doctor' ? 'block' : 'none';
      if (panelPatient) panelPatient.style.display = which === 'patient' ? 'block' : 'none';
      if (tabDoctor) tabDoctor.classList.toggle('active', which === 'doctor');
      if (tabPatient) tabPatient.classList.toggle('active', which === 'patient');
    }

    // Auto-hide tab bar and auto-select for single-role users
    if (user.role === 'doctor') {
      if (tabBar) tabBar.style.display = 'none';
      showPanel('doctor');
    } else {
      if (tabBar) tabBar.style.display = 'none';
      showPanel('patient');
    }

    if (tabDoctor) tabDoctor.addEventListener('click', () => showPanel('doctor'));
    if (tabPatient) tabPatient.addEventListener('click', () => showPanel('patient'));

    // Doctor: generate code
    const generateBtn = document.getElementById('generateCodeBtn');
    const codeDisplay = document.getElementById('sessionCodeDisplay');
    const copyBtn = document.getElementById('copyCodeBtn');
    const startBtn = document.getElementById('startSessionBtn');

    const existingCode = getSessionCode();
    if (existingCode && codeDisplay) {
      codeDisplay.textContent = existingCode;
      if (startBtn) startBtn.style.display = 'inline-flex';
    }

    if (generateBtn) {
      generateBtn.addEventListener('click', function () {
        generateBtn.disabled = true; generateBtn.textContent = 'Generating…';
        fetch('/session/create-meeting', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doctorId: user.id }),
        })
          .then(r => r.json())
          .then(data => {
            if (!data.success) { showToast(data.message || 'Failed to create session', 'error'); generateBtn.disabled = false; generateBtn.textContent = 'Generate Session Code'; return; }
            setSessionInfo(data.code, data.sessionId);
            if (codeDisplay) codeDisplay.textContent = data.code;
            if (startBtn) startBtn.style.display = 'inline-flex';
            generateBtn.textContent = 'Regenerate Code'; generateBtn.disabled = false;
            showToast('Session code created: ' + data.code, 'success');
          })
          .catch(() => { showToast('Error creating meeting session', 'error'); generateBtn.disabled = false; generateBtn.textContent = 'Generate Session Code'; });
      });
    }

    if (copyBtn && codeDisplay) {
      copyBtn.addEventListener('click', () => {
        const code = codeDisplay.textContent.trim();
        if (code && code !== '——') {
          navigator.clipboard.writeText(code).then(() => showToast('Code copied!', 'success')).catch(() => showToast('Could not copy', 'warning'));
        }
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', function () {
        const code = getSessionCode();
        if (!code) { showToast('Generate a session code first.', 'warning'); return; }
        startBtn.disabled = true; startBtn.textContent = 'Validating…';
        fetch('/session/join-meeting', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        })
          .then(async r => { const j = await r.json().catch(() => null); if (!r.ok || !j?.success) throw new Error(j?.message || 'Validation failed'); return j; })
          .then(data => { setSessionInfo(data.code || code, data.sessionId); window.location.href = '/doctor.html'; })
          .catch(err => { showToast(err.message || 'Error validating session', 'error'); startBtn.disabled = false; startBtn.textContent = 'Start Session'; });
      });
    }

    // Patient: join session
    const joinInput = document.getElementById('joinCodeInput');
    const joinBtn = document.getElementById('joinSessionBtn');
    const joinError = document.getElementById('joinError');

    if (joinBtn) {
      joinBtn.addEventListener('click', function () {
        const entered = joinInput?.value.trim().toUpperCase() || '';
        if (!entered) { if (joinError) { joinError.textContent = 'Please enter a session code.'; joinError.style.display = 'block'; } return; }
        if (joinError) joinError.style.display = 'none';
        joinBtn.disabled = true; joinBtn.textContent = 'Joining…';
        fetch('/session/join-meeting', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientId: user.id, code: entered }),
        })
          .then(async r => { const j = await r.json().catch(() => null); if (!r.ok || !j?.success) throw new Error(j?.message || 'Failed to join session'); return j; })
          .then(data => { setSessionInfo(data.code || entered, data.sessionId); window.location.href = '/patient.html'; })
          .catch(err => {
            if (joinError) { joinError.textContent = err.message || 'Error joining session'; joinError.style.display = 'block'; }
            joinBtn.disabled = false; joinBtn.textContent = 'Join Session';
          });
      });
    }
  }

  // ── PROFILE ───────────────────────────────────────────────────────────────
  if (page === 'profile') {
    const user = requireAuth();
    if (!user) return;
    loadProfile(user);
    loadSessionHistory(user.id);

    // BMI auto-calc
    function recalcBMI() {
      const h = parseFloat(document.getElementById('inputHeight')?.value);
      const w = parseFloat(document.getElementById('inputWeight')?.value);
      const bmiInput = document.getElementById('inputBmi');
      if (bmiInput && h > 0 && w > 0) bmiInput.value = (w / ((h / 100) ** 2)).toFixed(1);
    }
    document.getElementById('inputHeight')?.addEventListener('input', recalcBMI);
    document.getElementById('inputWeight')?.addEventListener('input', recalcBMI);

    // Edit / save / cancel — Basic Info + Health Stats
    const editBtn = document.getElementById('editProfileBtn');
    const saveBtn = document.getElementById('saveProfileBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const infoCards = ['basicInfoCard', 'healthCard'].map(id => document.getElementById(id)).filter(Boolean);

    editBtn?.addEventListener('click', () => {
      infoCards.forEach(c => c.classList.add('edit-mode'));
      editBtn.style.display = 'none';
      if (saveBtn) saveBtn.style.display = 'inline-flex';
      if (cancelBtn) cancelBtn.style.display = 'inline-flex';
    });

    cancelBtn?.addEventListener('click', () => {
      infoCards.forEach(c => c.classList.remove('edit-mode'));
      editBtn.style.display = 'inline-flex';
      if (saveBtn) saveBtn.style.display = 'none';
      if (cancelBtn) cancelBtn.style.display = 'none';
    });

    saveBtn?.addEventListener('click', async () => {
      const body = {
        name: document.getElementById('inputName')?.value.trim() || null,
        age: parseInt(document.getElementById('inputAge')?.value) || null,
        email: document.getElementById('inputEmail')?.value.trim() || null,
        heightCm: parseFloat(document.getElementById('inputHeight')?.value) || null,
        weightKg: parseFloat(document.getElementById('inputWeight')?.value) || null,
        bmi: parseFloat(document.getElementById('inputBmi')?.value) || null,
      };
      saveBtn.disabled = true; saveBtn.textContent = 'Saving…';
      try {
        const res = await fetch(`/auth/profile/${user.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Save failed');
        applyProfileToView(data.user);
        infoCards.forEach(c => c.classList.remove('edit-mode'));
        editBtn.style.display = 'inline-flex';
        saveBtn.style.display = 'none'; cancelBtn.style.display = 'none';
        showToast('Profile saved!', 'success');
      } catch (err) { showToast(err.message || 'Save failed', 'error'); }
      saveBtn.disabled = false; saveBtn.textContent = '✓ Save';
    });

    // Edit / save / cancel — Goals
    const editGoalsBtn = document.getElementById('editGoalsBtn');
    const saveGoalsBtn = document.getElementById('saveGoalsBtn');
    const cancelGoalsBtn = document.getElementById('cancelGoalsBtn');
    const goalsEdit = document.getElementById('goalsEdit');
    const causeEdit = document.getElementById('causeEdit');
    const goalsBtns = document.getElementById('goalsBtns');

    editGoalsBtn?.addEventListener('click', () => {
      if (goalsEdit) goalsEdit.style.display = 'block';
      if (causeEdit) causeEdit.style.display = 'block';
      if (goalsBtns) goalsBtns.style.display = 'flex';
      editGoalsBtn.style.display = 'none';
      const goalsDisplay = document.getElementById('goalsDisplay');
      const causeDisplay = document.getElementById('causeDisplay');
      if (goalsDisplay) goalsDisplay.style.display = 'none';
      if (causeDisplay) causeDisplay.style.display = 'none';
    });

    cancelGoalsBtn?.addEventListener('click', () => {
      if (goalsEdit) goalsEdit.style.display = 'none';
      if (causeEdit) causeEdit.style.display = 'none';
      if (goalsBtns) goalsBtns.style.display = 'none';
      editGoalsBtn.style.display = 'inline-flex';
      const goalsDisplay = document.getElementById('goalsDisplay');
      const causeDisplay = document.getElementById('causeDisplay');
      if (goalsDisplay) goalsDisplay.style.display = '';
      if (causeDisplay) causeDisplay.style.display = '';
    });

    saveGoalsBtn?.addEventListener('click', async () => {
      const body = {
        goals: document.getElementById('inputGoals')?.value.trim() || null,
        cause: document.getElementById('inputCause')?.value.trim() || null,
      };
      saveGoalsBtn.disabled = true; saveGoalsBtn.textContent = 'Saving…';
      try {
        const res = await fetch(`/auth/profile/${user.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Save failed');
        applyProfileToView(data.user);
        if (goalsEdit) goalsEdit.style.display = 'none';
        if (causeEdit) causeEdit.style.display = 'none';
        if (goalsBtns) goalsBtns.style.display = 'none';
        editGoalsBtn.style.display = 'inline-flex';
        const goalsDisplay = document.getElementById('goalsDisplay');
        const causeDisplay = document.getElementById('causeDisplay');
        if (goalsDisplay) goalsDisplay.style.display = '';
        if (causeDisplay) causeDisplay.style.display = '';
        showToast('Goals saved!', 'success');
      } catch (err) { showToast(err.message || 'Save failed', 'error'); }
      saveGoalsBtn.disabled = false; saveGoalsBtn.textContent = 'Save goals';
    });
  }
});

// ── Workout feed ──────────────────────────────────────────────────────────────
function loadWorkouts(userId) {
  const grid = document.getElementById('workoutGrid');
  const levelBadge = document.getElementById('workoutLevel');
  if (!grid) return;
  grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1">Loading workouts…</p>';
  fetch(`/workouts?userId=${encodeURIComponent(userId)}`)
    .then(r => r.json())
    .then(data => {
      const workouts = Array.isArray(data) ? data : (data.workouts || []);
      if (levelBadge && data.level) levelBadge.textContent = data.level;
      if (!workouts.length) { grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;grid-column:1/-1">No workouts available.</p>'; return; }
      grid.innerHTML = workouts.map(w => `
        <div class="workout-card">
          <div class="workout-thumb">
            <iframe src="https://www.youtube.com/embed/${w.youtubeId || ''}" title="${w.title || 'Workout'}" frameborder="0" allowfullscreen loading="lazy"></iframe>
          </div>
          <div class="workout-info">
            <div class="workout-meta">
              <span class="badge ${w.level || 'beginner'}">${w.level || 'beginner'}</span>
              ${w.duration ? `<span class="workout-duration">⏱ ${w.duration}</span>` : ''}
            </div>
            <div class="workout-title">${w.title || 'Workout'}</div>
            ${w.description ? `<div class="workout-desc">${w.description}</div>` : ''}
          </div>
        </div>`).join('');
    })
    .catch(() => {
      grid.innerHTML = `
        <div class="workout-card"><div class="workout-thumb"><iframe src="https://www.youtube.com/embed/IODxDxX7oi4" frameborder="0" allowfullscreen></iframe></div><div class="workout-info"><span class="badge beginner">Beginner</span><div class="workout-title">Full Body Stretch</div></div></div>
        <div class="workout-card"><div class="workout-thumb"><iframe src="https://www.youtube.com/embed/cbKkB3POqaY" frameborder="0" allowfullscreen></iframe></div><div class="workout-info"><span class="badge intermediate">Intermediate</span><div class="workout-title">Core Stability</div></div></div>
        <div class="workout-card"><div class="workout-thumb"><iframe src="https://www.youtube.com/embed/aclHkVaku9U" frameborder="0" allowfullscreen></iframe></div><div class="workout-info"><span class="badge intermediate">Intermediate</span><div class="workout-title">Resistance Band Therapy</div></div></div>
        <div class="workout-card"><div class="workout-thumb"><iframe src="https://www.youtube.com/embed/g_tea8ZNk5A" frameborder="0" allowfullscreen></iframe></div><div class="workout-info"><span class="badge advanced">Advanced</span><div class="workout-title">Mobility Flow</div></div></div>`;
    });
}

// ── Profile helpers ───────────────────────────────────────────────────────────
function applyProfileToView(u) {
  function setText(id, val) { const el = document.getElementById(id); if (el) el.textContent = val || '—'; }
  function setInput(id, val) { const el = document.getElementById(id); if (el) el.value = val || ''; }
  setText('valName', u.name);
  setText('valAge', u.age);
  setText('valEmail', u.email);
  setText('valHeight', u.heightCm ? u.heightCm + ' cm' : null);
  setText('valWeight', u.weightKg ? u.weightKg + ' kg' : null);
  setText('valBmi', u.bmi);
  setInput('inputName', u.name);
  setInput('inputAge', u.age);
  setInput('inputEmail', u.email);
  setInput('inputHeight', u.heightCm);
  setInput('inputWeight', u.weightKg);
  setInput('inputBmi', u.bmi);
  // Goals
  const goalsDisplay = document.getElementById('goalsDisplay');
  const causeDisplay = document.getElementById('causeDisplay');
  if (goalsDisplay) goalsDisplay.textContent = u.goals || 'No goals set yet.';
  if (causeDisplay) causeDisplay.textContent = u.cause || 'Not specified.';
  setInput('inputGoals', u.goals);
  setInput('inputCause', u.cause);
  // Header
  const displayName = document.getElementById('profileDisplayName');
  const avatarEl = document.getElementById('avatarEl');
  const roleBadge = document.getElementById('profileRoleBadge');
  const usernameEl = document.getElementById('profileUsername');
  if (displayName) displayName.textContent = u.name || u.username || 'User';
  if (avatarEl) avatarEl.textContent = (u.name || u.username || 'U')[0].toUpperCase();
  if (roleBadge) roleBadge.textContent = u.role === 'doctor' ? 'Doctor' : 'Fitness Enthusiast';
  if (usernameEl) usernameEl.textContent = '@' + (u.username || '');
}

async function loadProfile(user) {
  try {
    const res = await fetch(`/auth/profile/${user.id}`);
    const data = await res.json();
    if (data.success && data.user) {
      applyProfileToView(data.user);
    } else {
      // Fallback to localStorage user
      applyProfileToView(user);
    }
  } catch { applyProfileToView(user); }
}

async function loadSessionHistory(userId) {
  const listEl = document.getElementById('sessionHistoryList');
  if (!listEl) return;
  try {
    const res = await fetch(`/session/history/${userId}`);
    const data = await res.json();
    const sessions = data.sessions || [];
    if (!sessions.length) { listEl.innerHTML = '<p class="no-history">No sessions recorded yet.</p>'; return; }
    listEl.innerHTML = sessions.map(s => {
      const date = s.startedAt ? new Date(s.startedAt).toLocaleDateString() : 'Unknown date';
      const status = s.keyMetrics?.goal_status || 'completed';
      const accuracy = s.keyMetrics?.accuracy_rate != null ? s.keyMetrics.accuracy_rate + '% accuracy' : '';
      return `<div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-date">${date}</div>
          <div class="timeline-title">${s.notesSummary || 'Therapy Session'}</div>
          ${accuracy ? `<div class="timeline-meta">${accuracy} · ${status}</div>` : `<div class="timeline-meta">${status}</div>`}
        </div>
      </div>`;
    }).join('');
  } catch { listEl.innerHTML = '<p class="no-history">Could not load session history.</p>'; }
}
