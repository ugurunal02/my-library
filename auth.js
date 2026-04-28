// Shared auth guard + navigation
auth.onAuthStateChanged(async user => {
  if (!user) { window.location = 'index.html'; return; }
  const doc = await db.collection('users').doc(user.uid).get();
  if (!doc.exists || !doc.data().approved) {
    auth.signOut();
    window.location = 'index.html';
    return;
  }
  const data = doc.data();
  window._userRole = data.role; // 'admin' or 'user'
  window._userName = data.name;
  window._userId = user.uid;

  // Render nav
  const adminLinks = data.role === 'admin'
    ? `<a class="nav-link" href="admin.html">Admin <span class="nav-badge">A</span></a>`
    : '';
  document.getElementById('nav').innerHTML = `
    <span class="nav-logo">📚 Kütüphanem</span>
    <a class="nav-link ${location.pathname.includes('dashboard') ? 'active' : ''}" href="dashboard.html">Genel Bakış</a>
    <a class="nav-link ${location.pathname.includes('books') ? 'active' : ''}" href="books.html">Kitaplar</a>
    ${adminLinks}
    <span style="margin-left:8px;font-size:13px;color:var(--muted);">${data.name}</span>
    <button class="btn btn-ghost" style="margin-left:8px;padding:7px 14px;font-size:13px;" onclick="auth.signOut().then(()=>window.location='index.html')">Çıkış</button>
  `;

  if (typeof onAuthReady === 'function') onAuthReady(data);
});
