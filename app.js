const appState = window.ECORECANJE_DB || { session: null, users: [] };

const landing = document.getElementById('landing');
const login = document.getElementById('login');
const app = document.getElementById('app');
const logoutBtn = document.getElementById('logout');
const menuBtn = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const nav = document.getElementById('nav');
const mini = document.getElementById('mini');
const whospan = document.getElementById('who');
const title = document.getElementById('title');
const content = document.getElementById('content');
const loginForm = document.getElementById('loginForm');
const toast = document.getElementById('toast');

function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function setSession(user) {
  appState.session = user;
  localStorage.setItem('ECORECANJE_DB', JSON.stringify(appState));
}

function getSession() {
  return appState.session;
}

function getCurrentUser() {
  return appState.users.find((u) => u.u === appState.session?.u) || appState.session || null;
}

function showLanding() {
  landing.classList.remove('hidden');
  login.classList.add('hidden');
  app.classList.add('hidden');
}

function showLogin() {
  landing.classList.add('hidden');
  login.classList.remove('hidden');
  app.classList.add('hidden');
}

function showApp() {
  landing.classList.add('hidden');
  login.classList.add('hidden');
  app.classList.remove('hidden');
}

function renderNav(user) {
  if (!user) return;

  const navMap = {
    student: ['Inicio', 'Ranking', 'Premios', 'Retos'],
    teacher: ['Inicio', 'Curso', 'Ranking', 'Comunicados'],
    admin: ['Inicio', 'Usuarios', 'Estadísticas', 'Configuración']
  };

  const items = navMap[user.role] || navMap.student;
  nav.innerHTML = items.map((label, index) => `
    <button class="nav ${index === 0 ? 'active' : ''}" data-label="${label}">
      ${label}
    </button>
  `).join('');

  nav.querySelectorAll('.nav').forEach((btn) => {
    btn.addEventListener('click', () => {
      nav.querySelectorAll('.nav').forEach((el) => el.classList.remove('active'));
      btn.classList.add('active');
      renderContent(user, btn.dataset.label);
    });
  });

  mini.innerHTML = `
    <strong>${user.name}</strong>
    <small>${user.role === 'student' ? 'Estudiante' : user.role === 'teacher' ? 'Profesor' : 'Administrador'} · ${user.course || 'General'}</small>
  `;
}

function getStats(user) {
  if (user.role === 'student') {
    return [
      { icon: '♻️', label: 'Puntos', value: user.points || 0 },
      { icon: '🧴', label: 'Reciclado', value: user.recycled || 0 },
      { icon: '🏆', label: 'Nivel', value: Math.min(10, Math.max(1, Math.floor((user.points || 0) / 250) + 1)) },
      { icon: '🎁', label: 'Premios', value: 3 }
    ];
  }

  return [
    { icon: '📊', label: 'Cursos', value: 12 },
    { icon: '🏅', label: 'Puntajes', value: 340 },
    { icon: '🧑‍🏫', label: 'Estudiantes', value: 210 },
    { icon: '✅', label: 'Meta', value: '90%' }
  ];
}

function renderQr(user) {
  const qrTarget = `ECORECANJE|${user.name}|${user.course || 'general'}|${user.role}|${user.points || 0}|${user.recycled || 0}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrTarget)}`;

  const wrapper = document.createElement('div');
  wrapper.className = 'qr-card';
  wrapper.innerHTML = `
    <div class="qr-shell">
      <img src="${qrUrl}" alt="QR de ${user.name}" width="220" height="220" />
    </div>
    <div class="qr-meta">
      <strong>${user.name}</strong>
      <small>${user.course || 'Sin curso'}</small>
    </div>
  `;

  return wrapper;
}

function renderContent(user, section = 'Inicio') {
  title.textContent = section;
  whospan.textContent = user.name;

  if (user.role === 'student') {
    if (section === 'Ranking') {
      const ranking = [...appState.users]
        .filter((u) => u.role === 'student')
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, 5);

      content.innerHTML = `
        <div class="card">
          <div class="card-head">
            <h3>Ranking del curso</h3>
            <span class="badge">Top 5</span>
          </div>
          <div class="grid g1">
            ${ranking.map((entry, index) => `
              <div class="rank ${entry.u === user.u ? 'me' : ''}">
                <div class="avatar">${index + 1}</div>
                <div class="name">
                  <strong>${entry.name}</strong>
                  <small>${entry.course}</small>
                </div>
                <div class="pts">${entry.points} pts</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      return;
    }

    if (section === 'Premios') {
      content.innerHTML = `
        <div class="grid g3">
          <div class="card reward">
            <div class="reward-icon">🎒</div>
            <div class="reward-foot">
              <div><strong>Kit escolar</strong><br><small>350 pts</small></div>
              <button type="button">Canjear</button>
            </div>
          </div>
          <div class="card reward">
            <div class="reward-icon">📚</div>
            <div class="reward-foot">
              <div><strong>Libro</strong><br><small>500 pts</small></div>
              <button type="button">Canjear</button>
            </div>
          </div>
          <div class="card reward">
            <div class="reward-icon">🌿</div>
            <div class="reward-foot">
              <div><strong>Huerto</strong><br><small>700 pts</small></div>
              <button type="button">Canjear</button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    if (section === 'Retos') {
      content.innerHTML = `
        <div class="card">
          <div class="card-head"><h3>Retos del mes</h3><span class="badge">Activos</span></div>
          <div class="grid g2">
            <div class="alert green">Reto 1: Recicla 10 objetos. Recompensa: +120 pts</div>
            <div class="alert yellow">Reto 2: Ayuda a clasificar 3 tipos de residuos. Recompensa: +80 pts</div>
            <div class="alert green">Reto 3: Completa un recorrido ecológico. Recompensa: +160 pts</div>
            <div class="alert red">Reto 4: Reúne 5 materiales en un día. Recompensa: +200 pts</div>
          </div>
        </div>
      `;
      return;
    }
  }

  if (user.role === 'teacher') {
    if (section === 'Curso') {
      content.innerHTML = `
        <div class="card">
          <div class="card-head"><h3>Curso ${user.course}</h3><span class="badge">Activo</span></div>
          <div class="grid g3">
            <div class="card"><strong>Estudiantes</strong><p>28</p></div>
            <div class="card"><strong>Puntaje total</strong><p>4.280</p></div>
            <div class="card"><strong>Reciclaje</strong><p>86 kg</p></div>
          </div>
        </div>
      `;
      return;
    }
  }

  const stats = getStats(user);
  content.innerHTML = `
    <section class="hero">
      <div>
        <p>Bienvenido de nuevo</p>
        <h1>${user.name}</h1>
        <p>Tu comunidad ecológica está creciendo con cada reciclaje.</p>
      </div>
      <button type="button" class="btn">Ver actividad</button>
    </section>

    <div class="grid g4">
      ${stats.map((stat) => `
        <div class="card stat">
          <i>${stat.icon}</i>
          <div>
            <strong>${stat.value}</strong>
            <span>${stat.label}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="grid g2">
      <div class="card">
        <div class="card-head"><h3>Máquina de residuos</h3><span class="badge">Estado</span></div>
        <div class="machine">
          <div class="slot plastic">♻️<small>Plástico</small></div>
          <div class="slot carton">📦<small>Cartón</small></div>
          <div class="slot tapas">🧴<small>Tapas</small></div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>QR del estudiante</h3><span class="badge">Válido</span></div>
        ${renderQr(user).outerHTML}
      </div>
    </div>
  `;
}

function renderDashboard() {
  const user = getCurrentUser();
  if (!user) {
    showLogin();
    return;
  }

  renderNav(user);
  renderContent(user);
  showApp();
}

function loginUser(username, password) {
  const foundUser = appState.users.find((user) => (user.u === username || user.email === username) && user.p === password);

  if (!foundUser) {
    showToast('Credenciales incorrectas');
    return;
  }

  setSession(foundUser);
  renderDashboard();
  showToast(`Bienvenido ${foundUser.name}`);
}

document.getElementById('btnLogin').addEventListener('click', showLogin);
document.getElementById('btnCreate').addEventListener('click', () => showToast('Próximamente: creación de cuenta'));
document.getElementById('btnWhy').addEventListener('click', () => showToast('Reciclar reduce residuos y protege el planeta'));

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('user').value.trim();
  const password = document.getElementById('pass').value.trim();
  loginUser(username, password);
});

logoutBtn.addEventListener('click', () => {
  appState.session = null;
  localStorage.setItem('ECORECANJE_DB', JSON.stringify(appState));
  showLanding();
});

menuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));

if (appState.session) {
  renderDashboard();
} else {
  showLanding();
}
