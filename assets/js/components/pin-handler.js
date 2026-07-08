import { state } from '../utils/state.js';
import { showScreen, showPinError } from '../utils/helpers.js';

export function initPinHandler() {
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
    const targetArr = isCreate ? state.pinDigits.create : state.pinDigits.confirm;
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

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { showScreen("splash"); return; }

    if (event.key === 'Backspace') {
      const active = document.querySelector('.screen.active');
      if (!active) return;
      const isPinScreen = active.id === 'create-pin' || active.id === 'confirm-pin';
      if (!isPinScreen) return;

      const targetArr = active.id === 'create-pin' ? state.pinDigits.create : state.pinDigits.confirm;
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
}
