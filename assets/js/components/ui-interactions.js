export function initUIInteractions() {
  document.querySelectorAll("[data-range]").forEach((range) => {
    const output = document.querySelector(`[data-output="${range.dataset.range}"]`);
    const update = () => {
      output.textContent = range.value + range.dataset.unit;
    };
    range.addEventListener("input", update);
    update();
  });

  (function() {
    const mql = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    function update() { document.body.classList.toggle('desktop-mode', mql.matches); }
    mql.addEventListener('change', update);
    update();
  })();
}
