(() => {
  const initial = {
    session: null,
    users: [
      { id: 'AD-001', u: 'admin', p: 'admin123', name: 'Administrador Demo', email: 'admin@ecorecanje.co', role: 'admin', course: '', points: 0, recycled: 0 },
      { id: 'PR-601', u: 'prof601', p: '1234', name: 'Prof. Ana Verde', email: 'ana.verde@colegio.edu.co', role: 'teacher', course: '601', points: 0, recycled: 0 },
      { id: 'PR-602', u: 'prof602', p: '1234', name: 'Prof. Luis Marín', email: 'luis.marin@colegio.edu.co', role: 'teacher', course: '602', points: 0, recycled: 0 },
      { id: 'EC-11001', u: 'ronald', p: '1234', name: 'Ronald Carrillo', email: 'ronald@demo.edu', role: 'student', course: '1101', points: 820, recycled: 27 },
      { id: 'EC-11002', u: 'maria', p: '1234', name: 'María López', email: 'maria@demo.edu', role: 'student', course: '1101', points: 760, recycled: 25 },
      { id: 'EC-11003', u: 'camila', p: '1234', name: 'Camila Torres', email: 'camila@demo.edu', role: 'student', course: '1102', points: 690, recycled: 21 },
      { id: 'EC-11004', u: 'andres', p: '1234', name: 'Andrés García', email: 'andres@demo.edu', role: 'student', course: '1102', points: 640, recycled: 20 },
      { id: 'EC-11005', u: 'sofia', p: '1234', name: 'Sofía Ruiz', email: 'sofia@demo.edu', role: 'student', course: '1101', points: 610, recycled: 18 }
    ]
  };

  const DB_KEY = 'ECORECANJE_DB';
  const saved = JSON.parse(localStorage.getItem(DB_KEY) || 'null');
  const state = saved || initial;
  localStorage.setItem(DB_KEY, JSON.stringify(state));
  window.ECORECANJE_DB = state;
})();
