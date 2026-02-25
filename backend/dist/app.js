// FitMon frontend prototype logic
// Now wired to NestJS backend for signup/login, still using localStorage for client-side state.

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
  } catch {
    return null;
  }
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.currentUser);
  window.location.href = '/login.html';
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = '/login.html';
    return null;
  }
  return user;
}

function generateSessionCode() {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  localStorage.setItem(STORAGE_KEYS.sessionCode, code);
  return code;
}

function getSessionCode() {
  return localStorage.getItem(STORAGE_KEYS.sessionCode) || '';
}

function setSessionInfo(code, sessionId) {
  if (code) {
    localStorage.setItem(STORAGE_KEYS.sessionCode, code);
  }
  if (sessionId) {
    localStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
  }
}

function getSessionId() {
  return localStorage.getItem(STORAGE_KEYS.sessionId) || '';
}

// Page-specific wiring
document.addEventListener('DOMContentLoaded', function () {
  const page = document.body.dataset.page;

  const logoutLink = document.querySelector('[data-logout]');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();
      logout();
    });
  }

  if (page === 'signup') {
    const form = document.getElementById('signupForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const usernameInput = document.getElementById('username');
        const roleSelect = document.getElementById('role');
        const passwordInput = document.getElementById('password');
        if (!usernameInput || !roleSelect || !passwordInput) return;

        const username = usernameInput.value.trim();
        const role = roleSelect.value;
        const password = passwordInput.value;
        if (!username || !role || !password) return;

        fetch('/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, role, password }),
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            if (!data.success) {
              alert(data.message || 'Signup failed');
              return;
            }
            setCurrentUser({
              id: data.user.id,
              username: data.user.username,
              role: data.user.role,
            });
            window.location.href = '/home.html';
          })
          .catch(function () {
            alert('Signup request failed');
          });
      });
    }
  }

  if (page === 'login') {
    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        if (!usernameInput) return;

        const username = usernameInput.value.trim();
        const password = passwordInput ? passwordInput.value : '';
        if (!username || !password) return;

        fetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        })
          .then(async function (res) {
            if (!res.ok) {
              let errJson = null;
              try {
                errJson = await res.json();
              } catch {
                // ignore
              }
              throw new Error((errJson && errJson.message) || 'Login failed');
            }
            return res.json();
          })
          .then(function (data) {
            if (!data.success) {
              alert(data.message || 'Login failed');
              return;
            }
            setCurrentUser({
              id: data.user.id,
              username: data.user.username,
              role: data.user.role,
            });
            window.location.href = '/home.html';
          })
          .catch(function (err) {
            alert(err.message || 'Login request failed');
          });
      });
    }
  }

  if (page === 'home' || page === 'profile' || page === 'workouts' || page === 'session') {
    const user = requireAuth();
    if (!user) return;

    const nameSpan = document.querySelector('[data-user-name]');
    if (nameSpan) nameSpan.textContent = user.username;

    const roleSpan = document.querySelector('[data-user-role]');
    if (roleSpan) roleSpan.textContent = user.role === 'doctor' ? 'Doctor' : 'Fitness enthusiast';
  }

  if (page === 'session') {
    const user = requireAuth();
    if (!user) return;

    const isDoctor = user.role === 'doctor';
    const doctorSection = document.getElementById('doctorControls');
    const patientSection = document.getElementById('patientControls');

    if (doctorSection && patientSection) {
      doctorSection.style.display = isDoctor ? 'block' : 'none';
      patientSection.style.display = isDoctor ? 'none' : 'block';
    }

    const codeDisplay = document.getElementById('sessionCodeDisplay');
    const generateBtn = document.getElementById('generateCodeBtn');
    const joinInput = document.getElementById('joinCodeInput');
    const joinBtn = document.getElementById('joinSessionBtn');

    if (generateBtn) {
      generateBtn.addEventListener('click', function () {
        fetch('/session/create-meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doctorId: user.id }),
        })
          .then(function (res) {
            return res.json();
          })
          .then(function (data) {
            if (!data.success) {
              alert(data.message || 'Failed to create session');
              return;
            }
            setSessionInfo(data.code, data.sessionId);
            if (codeDisplay) codeDisplay.textContent = data.code;
          })
          .catch(function () {
            alert('Error creating meeting session');
          });
      });
    }

    const existingCode = getSessionCode();
    if (existingCode && codeDisplay) {
      codeDisplay.textContent = existingCode;
    }

    if (joinBtn) {
      joinBtn.addEventListener('click', function () {
        if (!joinInput) return;
        const entered = joinInput.value.trim().toUpperCase();
        if (!entered) {
          alert('Please enter a session code.');
          return;
        }

        fetch('/session/join-meeting', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientId: user.id, code: entered }),
        })
          .then(async function (res) {
            const json = await res.json().catch(() => null);
            if (!res.ok || !json || !json.success) {
              throw new Error((json && json.message) || 'Failed to join session');
            }
            return json;
          })
          .then(function (data) {
            setSessionInfo(data.code || entered, data.sessionId);
            if (isDoctor) {
              window.location.href = '/doctor.html';
            } else {
              window.location.href = '/patient.html';
            }
          })
          .catch(function (err) {
            alert(err.message || 'Error joining session');
          });
      });
    }
  }
});
