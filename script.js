const glow = document.querySelector('.cursor-glow');
const wishButton = document.querySelector('#wishButton');
const confetti = document.querySelector('.confetti');

window.addEventListener('pointermove', (event) => {
  if (glow) glow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
});

wishButton.addEventListener('click', () => {
  const colors = ['#f5c85b', '#fbf5e9', '#a8cbb8', '#c2b2d9', '#24342f'];
  for (let index = 0; index < 110; index += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.setProperty('--drift', `${(Math.random() - .5) * 260}px`);
    piece.style.animationDelay = `${Math.random() * .55}s`;
    piece.style.width = `${6 + Math.random() * 7}px`;
    piece.style.height = `${9 + Math.random() * 13}px`;
    confetti.append(piece);
    setTimeout(() => piece.remove(), 3300);
  }
  wishButton.innerHTML = 'Wish sent! <span>♥</span>';
  wishButton.disabled = true;
});
