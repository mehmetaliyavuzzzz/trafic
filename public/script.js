// Sekme geçişi
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginPanel = document.getElementById('loginPanel');
const registerPanel = document.getElementById('registerPanel');

loginTab.onclick = function() {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginPanel.style.display = '';
  registerPanel.style.display = 'none';
};
registerTab.onclick = function() {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerPanel.style.display = '';
  loginPanel.style.display = 'none';
};

// ... mevcut kod ...
document.getElementById('loginForm').onsubmit = async function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  document.getElementById('loginMessage').textContent = data.message;
};

document.getElementById('registerForm').onsubmit = async function(e) {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  document.getElementById('registerMessage').textContent = data.message;
};
