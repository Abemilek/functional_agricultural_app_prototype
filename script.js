    const screens = Array.from(document.querySelectorAll("[data-screen]"));
    const shell = document.querySelector("#app-shell");
    let userName = '';

    function showScreen(id) {
      screens.forEach((screen) => {
        const active = screen.id === id;
        screen.classList.toggle("active", active);
        screen.setAttribute("aria-hidden", String(!active));
        if (active) screen.scrollTop = 0;
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
    }

    document.addEventListener("click", (event) => {
      const go = event.target.closest("[data-go]");
      if (go) {
        if (go.dataset.go === "confirm-pin") {
          const pinSection = document.querySelector("#create-pin");
          if (pinSection && pinSection.classList.contains("active")) {
            const nameInput = pinSection.querySelector('input[aria-label="Tu nombre"]');
            userName = nameInput ? nameInput.value.trim() || 'Agricultor' : 'Agricultor';
            const dashName = document.querySelector('#user-name-display');
            if (dashName) dashName.textContent = userName;
          }
        }
        if (go.dataset.go === "dashboard" || go.dataset.go === "confirm-pin") {
          const dashName = document.querySelector('#user-name-display');
          if (dashName && userName) dashName.textContent = userName;
        }
        showScreen(go.dataset.go);
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
      if (event.key === "Escape") showScreen("splash");
    });

