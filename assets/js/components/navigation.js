import { state } from '../utils/state.js';
import { showScreen, showPinError, resetPinRow, setTab } from '../utils/helpers.js';

export function initNavigation() {
  document.addEventListener("click", (event) => {
    const go = event.target.closest("[data-go]");
    if (go) {
      const target = go.dataset.go;

      if (target === "confirm-pin") {
        const createSection = document.querySelector("#create-pin");
        if (createSection?.classList.contains("active")) {
          const nameInput = createSection.querySelector('input[aria-label="Tu nombre"]');
          const name = nameInput ? nameInput.value.trim() : '';
          if (!name) { showPinError('Por favor ingresá tu nombre'); return; }
          if (state.pinDigits.create.length < 4 || state.pinDigits.create.some(d => d === undefined)) { showPinError('Completá los 4 dígitos del PIN'); return; }
          showPinError('');
          state.userName = name;
          state.pinDigits.confirm = [];
          resetPinRow('confirm-pin');
          const dashName = document.querySelector('#user-name-display');
          if (dashName) dashName.textContent = state.userName;
          showScreen(target);
          return;
        }
      }

      if (target === "crop") {
        const confirmSection = document.querySelector("#confirm-pin");
        if (confirmSection?.classList.contains("active")) {
          if (state.pinDigits.confirm.length < 4 || state.pinDigits.confirm.some(d => d === undefined)) { showPinError('Completá los 4 dígitos de confirmación'); return; }
          if (JSON.stringify(state.pinDigits.create) !== JSON.stringify(state.pinDigits.confirm)) { showPinError('Los PIN no coinciden. Intentá de nuevo.'); return; }
          showPinError('');
          showScreen(target);
          return;
        }
      }

      if (target === "create-pin" && document.querySelector("#confirm-pin")?.classList.contains("active")) {
        state.pinDigits.create = [];
        resetPinRow('create-pin');
      }

      const dashName = document.querySelector('#user-name-display');
      if ((target === "dashboard" || target === "confirm-pin") && dashName && state.userName) {
        dashName.textContent = state.userName;
      }

      showScreen(target);
      return;
    }

    const select = event.target.closest("[data-select]");
    if (select) {
      const group = select.dataset.select;
      document.querySelectorAll(`[data-select="${group}"]`).forEach((item) => {
        item.classList.remove("selected");
        item.setAttribute("aria-pressed", "false");
      });
      select.classList.add("selected");
      select.setAttribute("aria-pressed", "true");
      return;
    }

    const tab = event.target.closest("[data-tab]");
    if (tab) {
      setTab(tab.dataset.tab);
      return;
    }

    const complete = event.target.closest("[data-complete]");
    if (complete) {
      complete.closest(".action").classList.toggle("done");
      return;
    }

    const toggle = event.target.closest("[data-toggle]");
    if (toggle) {
      toggle.querySelector(".switch").classList.toggle("on");
    }
  });
}
