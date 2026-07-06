    const screens = Array.from(document.querySelectorAll("[data-screen]"));
    const shell = document.querySelector("#app-shell");
    let userName = '';
    let pinDigits = { create: [], confirm: [] };

    function resetPinRow(sectionId) {
      const section = document.getElementById(sectionId);
      if (!section) return;
      section.querySelectorAll('.pin-box').forEach((b, i) => {
        b.value = '';
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

    document.addEventListener("focusin", (event) => {
      const pinBox = event.target.closest(".pin-box");
      if (!pinBox) return;
      const row = pinBox.closest('.pin-row');
      if (!row) return;
      row.querySelectorAll('.pin-box').forEach(b => b.classList.remove('active'));
      pinBox.classList.add('active');
    });

    document.addEventListener("input", (event) => {
      const pinBox = event.target.closest(".pin-box");
      if (!pinBox) return;
      const row = pinBox.closest('.pin-row');
      if (!row) return;
      const isCreate = row.closest('#create-pin') !== null;
      const targetArr = isCreate ? pinDigits.create : pinDigits.confirm;
      const boxes = Array.from(row.querySelectorAll('.pin-box'));
      const idx = boxes.indexOf(pinBox);
      if (idx === -1) return;
      const cleaned = pinBox.value.replace(/\D/g, '');
      if (!cleaned) {
        targetArr[idx] = undefined;
        pinBox.classList.remove('filled');
        showPinError('');
        return;
      }
      const digit = parseInt(cleaned.slice(-1));
      pinBox.value = digit;
      targetArr[idx] = digit;
      pinBox.classList.add('filled');
      boxes.forEach(b => b.classList.remove('active'));
      const nextEmpty = boxes.findIndex((b, i) => targetArr[i] === undefined);
      if (nextEmpty !== -1) {
        boxes[nextEmpty].classList.add('active');
        boxes[nextEmpty].focus();
      }
      showPinError('');
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

      if (event.key === 'Backspace') {
        const active = document.querySelector('.screen.active');
        if (!active) return;
        const isPinScreen = active.id === 'create-pin' || active.id === 'confirm-pin';
        if (!isPinScreen) return;

        const targetArr = active.id === 'create-pin' ? pinDigits.create : pinDigits.confirm;
        const row = active.querySelector('.pin-row');
        if (!row) return;
        const boxes = row.querySelectorAll('.pin-box');

        event.preventDefault();
        const lastFilled = Array.from(boxes).map((b, i) => ({ b, i })).filter(({b}) => b.value !== '').pop();
        if (lastFilled) {
          const { b, i } = lastFilled;
          targetArr[i] = undefined;
          b.value = '';
          b.classList.remove('filled');
          b.classList.add('active');
          b.focus();
          boxes.forEach((bx) => { if (bx !== b) bx.classList.remove('active'); });
        } else {
          boxes.forEach(b => b.classList.remove('active'));
          boxes[0].classList.add('active');
          boxes[0].focus();
        }
        showPinError('');
      }
    });

    (function() {
      const mql = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
      function update() { document.body.classList.toggle('desktop-mode', mql.matches); }
      mql.addEventListener('change', update);
      update();
    })();

