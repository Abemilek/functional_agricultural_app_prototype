    const screens = Array.from(document.querySelectorAll("[data-screen]"));
    const shell = document.querySelector("#app-shell");
    const STORAGE_KEY = 'cosechaclima_user';
    let userName = '';
    let pinDigits = { create: [], confirm: [] };

    function saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          userName: userName,
          pinDigits: pinDigits.create
        }));
      } catch (_) {}
    }

    function loadFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        userName = data.userName || '';
        pinDigits.create = Array.isArray(data.pinDigits) ? data.pinDigits : [];
        return true;
      } catch (_) {
        return false;
      }
    }

    function clearStorage() {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }

    function resetPinRow(sectionId) {
      const section = document.getElementById(sectionId);
      if (!section) return;
      section.querySelectorAll('.pin-box').forEach((b, i) => {
        b.textContent = '';
        b.classList.remove('filled', 'active');
        if (i === 0) b.classList.add('active');
      });
    }

    function showPinError(msg) {
      const active = document.querySelector('.screen.active');
      const id = active?.id === 'create-pin' ? 'create-pin-error' : 'confirm-pin-error';
      const el = document.getElementById(id);
      if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
    }

    function showScreen(id) {
      screens.forEach((screen) => {
        const active = screen.id === id;
        screen.classList.toggle("active", active);
        screen.setAttribute("aria-hidden", String(!active));
        if (active) { screen.scrollTop = 0; shell.scrollTop = 0; }
      });
    }

    function setTab(tab) {
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.id === "tab-" + tab);
      });
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.toggle("active", item.dataset.tab === tab);
      });
      const dashboard = document.querySelector("#dashboard");
      if (dashboard) dashboard.scrollTop = 0;
      shell.scrollTop = 0;
    }

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
            if (pinDigits.create.length < 4 || pinDigits.create.some(d => d === undefined)) { showPinError('Completá los 4 dígitos del PIN'); return; }
            showPinError('');
            userName = name;
            pinDigits.confirm = [];
            resetPinRow('confirm-pin');
            const dashName = document.querySelector('#user-name-display');
            if (dashName) dashName.textContent = userName;
            showScreen(target);
            return;
          }
        }

        if (target === "crop") {
          const confirmSection = document.querySelector("#confirm-pin");
          if (confirmSection?.classList.contains("active")) {
            if (pinDigits.confirm.length < 4 || pinDigits.confirm.some(d => d === undefined)) { showPinError('Completá los 4 dígitos de confirmación'); return; }
            if (JSON.stringify(pinDigits.create) !== JSON.stringify(pinDigits.confirm)) { showPinError('Los PIN no coinciden. Intentá de nuevo.'); return; }
            showPinError('');
            saveToStorage();
            showScreen(target);
            return;
          }
        }

        if (target === "create-pin" && document.querySelector("#confirm-pin")?.classList.contains("active")) {
          pinDigits.create = [];
          resetPinRow('create-pin');
        }

        const dashName = document.querySelector('#user-name-display');
        if ((target === "dashboard" || target === "confirm-pin") && dashName && userName) {
          dashName.textContent = userName;
        }

        showScreen(target);
        return;
      }

      const pinBox = event.target.closest(".pin-box");
      if (pinBox) {
        const row = pinBox.closest('.pin-row');
        if (!row) return;
        const isCreate = row.closest('#create-pin') !== null;
        const targetArr = isCreate ? pinDigits.create : pinDigits.confirm;
        const boxes = row.querySelectorAll('.pin-box');
        const idx = Array.from(boxes).indexOf(pinBox);
        if (idx === -1) return;
        const current = targetArr[idx] !== undefined ? targetArr[idx] : -1;
        const next = (current + 1) % 10;
        targetArr[idx] = next;
        pinBox.textContent = next;
        pinBox.classList.add('filled');
        boxes.forEach(b => b.classList.remove('active'));
        const nextEmpty = Array.from(boxes).findIndex((b, i) => targetArr[i] === undefined);
        if (nextEmpty !== -1) boxes[nextEmpty].classList.add('active');
        showPinError('');
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

    document.querySelectorAll("[data-range]").forEach((range) => {
      const output = document.querySelector(`[data-output="${range.dataset.range}"]`);
      const update = () => {
        output.textContent = range.value + range.dataset.unit;
      };
      range.addEventListener("input", update);
      update();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { showScreen("splash"); return; }

      const active = document.querySelector('.screen.active');
      if (!active) return;
      const isPinScreen = active.id === 'create-pin' || active.id === 'confirm-pin';
      if (!isPinScreen) return;

      const key = event.key;
      const targetArr = active.id === 'create-pin' ? pinDigits.create : pinDigits.confirm;
      const row = active.querySelector('.pin-row');
      if (!row) return;
      const boxes = row.querySelectorAll('.pin-box');

      if (key >= '0' && key <= '9') {
        event.preventDefault();
        const activeIdx = Array.from(boxes).findIndex(b => b.classList.contains('active'));
        if (activeIdx === -1 || activeIdx >= 4) return;
        const digit = parseInt(key);
        targetArr[activeIdx] = digit;
        boxes[activeIdx].textContent = digit;
        boxes[activeIdx].classList.add('filled');
        boxes[activeIdx].classList.remove('active');
        if (activeIdx + 1 < 4) boxes[activeIdx + 1].classList.add('active');
        showPinError('');
      }

      if (key === 'Backspace') {
        event.preventDefault();
        const activeIdx = Array.from(boxes).findIndex(b => b.classList.contains('active'));
        const idx = activeIdx === -1 ? 3 : Math.max(0, activeIdx - 1);
        targetArr[idx] = undefined;
        boxes[idx].textContent = '';
        boxes[idx].classList.remove('filled');
        boxes.forEach(b => b.classList.remove('active'));
        boxes[idx].classList.add('active');
        showPinError('');
      }
    });

    if (loadFromStorage()) {
      const dashName = document.querySelector('#user-name-display');
      if (dashName) dashName.textContent = userName;
      showScreen('crop');
    }

    (function() {
      const mql = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
      function update() { document.body.classList.toggle('desktop-mode', mql.matches); }
      mql.addEventListener('change', update);
      update();
    })();

