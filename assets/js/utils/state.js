export const state = {
  screens: Array.from(document.querySelectorAll("[data-screen]")),
  shell: document.querySelector("#app-shell"),
  userName: '',
  pinDigits: { create: [], confirm: [] }
};
