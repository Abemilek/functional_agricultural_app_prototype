import { state } from './state.js';

export function resetPinRow(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  section.querySelectorAll('.pin-box').forEach((b, i) => {
    b.value = '';
    b.classList.remove('filled', 'active');
    if (i === 0) b.classList.add('active');
  });
}

export function showPinError(msg) {
  const active = document.querySelector('.screen.active');
  const id = active?.id === 'create-pin' ? 'create-pin-error' : 'confirm-pin-error';
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
}

export function showScreen(id) {
  state.screens.forEach((screen) => {
    const active = screen.id === id;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
    if (active) { screen.scrollTop = 0; state.shell.scrollTop = 0; }
  });
}

export function setTab(tab) {
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === "tab-" + tab);
  });
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.tab === tab);
  });
  const dashboard = document.querySelector("#dashboard");
  if (dashboard) dashboard.scrollTop = 0;
  state.shell.scrollTop = 0;
}
