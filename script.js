const glow = document.querySelector('.cursor-glow');
const wishButton = document.querySelector('#wishButton');
const confetti = document.querySelector('.confetti');
const birthdayVoiceover = document.querySelector('#birthdayVoiceover');
const voiceoverButton = document.querySelector('#voiceoverButton');
const voiceoverIcon = voiceoverButton?.querySelector('.voiceover-icon');
const voiceoverLabel = voiceoverButton?.querySelector('.voiceover-label');
const voiceoverTime = document.querySelector('#voiceoverTime');
const voiceoverProgress = document.querySelector('#voiceoverProgress');
const voiceoverStatus = document.querySelector('#voiceoverStatus');
const voiceoverIntro = document.querySelector('#voiceoverIntro');
const wishMoment = document.querySelector('#wishMoment');

window.addEventListener('pointermove', (event) => {
  if (glow) glow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
});

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
};

const updateVoiceoverProgress = () => {
  if (!birthdayVoiceover) return;
  const duration = birthdayVoiceover.duration;
  const progress = Number.isFinite(duration) && duration > 0
    ? (birthdayVoiceover.currentTime / duration) * 100
    : 0;

  if (voiceoverProgress) voiceoverProgress.style.width = `${progress}%`;
  if (voiceoverTime) {
    const current = formatTime(birthdayVoiceover.currentTime);
    voiceoverTime.textContent = Number.isFinite(duration)
      ? `${current} / ${formatTime(duration)}`
      : current;
  }
};

const showWishMoment = () => {
  if (voiceoverIntro) voiceoverIntro.hidden = true;
  if (wishMoment) {
    wishMoment.hidden = false;
    requestAnimationFrame(() => wishMoment.classList.add('is-visible'));
  }
};

if (birthdayVoiceover && voiceoverButton) {
  voiceoverButton.addEventListener('click', async () => {
    if (birthdayVoiceover.paused) {
      try {
        await birthdayVoiceover.play();
      } catch (error) {
        if (voiceoverStatus) voiceoverStatus.textContent = 'The birthday song could not play. Please tap again.';
      }
    } else {
      birthdayVoiceover.pause();
    }
  });

  birthdayVoiceover.addEventListener('loadedmetadata', updateVoiceoverProgress);
  birthdayVoiceover.addEventListener('timeupdate', updateVoiceoverProgress);
  if (birthdayVoiceover.readyState >= 1) updateVoiceoverProgress();

  birthdayVoiceover.addEventListener('play', () => {
    voiceoverButton.setAttribute('aria-pressed', 'true');
    if (voiceoverIcon) voiceoverIcon.textContent = '❚❚';
    if (voiceoverLabel) voiceoverLabel.textContent = 'Pause for a second';
    if (voiceoverStatus) voiceoverStatus.textContent = 'Listen until the end ♡';
  });

  birthdayVoiceover.addEventListener('pause', () => {
    if (birthdayVoiceover.ended) return;
    voiceoverButton.setAttribute('aria-pressed', 'false');
    if (voiceoverIcon) voiceoverIcon.textContent = '▶';
    if (voiceoverLabel) voiceoverLabel.textContent = birthdayVoiceover.currentTime > 0
      ? 'Continue my birthday song'
      : 'Play my birthday song';
    if (voiceoverStatus) voiceoverStatus.textContent = 'Press play when you’re ready.';
  });

  birthdayVoiceover.addEventListener('ended', () => {
    updateVoiceoverProgress();
    showWishMoment();
  });

  birthdayVoiceover.addEventListener('error', () => {
    voiceoverButton.disabled = true;
    if (voiceoverStatus) voiceoverStatus.textContent = 'The birthday recording is still being added.';
  });
}

const voiceNoteCards = [...document.querySelectorAll('.voice-note-card')];
let activeVoiceNote = null;

voiceNoteCards.forEach((card) => {
  const audio = card.querySelector('.voice-note-audio');
  const button = card.querySelector('.voice-note-button');
  const icon = card.querySelector('.voice-note-icon');
  const label = card.querySelector('.voice-note-label');
  const progress = card.querySelector('.voice-note-progress span');
  const status = card.querySelector('.voice-note-status');

  if (!audio || !button) return;

  const updateProgress = () => {
    const percentage = Number.isFinite(audio.duration) && audio.duration > 0
      ? (audio.currentTime / audio.duration) * 100
      : 0;
    if (progress) progress.style.width = `${percentage}%`;
  };

  button.addEventListener('click', async () => {
    if (activeVoiceNote && activeVoiceNote !== audio) activeVoiceNote.pause();

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        if (status) status.textContent = 'This voice note could not play. Please tap again.';
      }
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    activeVoiceNote = audio;
    card.classList.add('is-playing');
    button.setAttribute('aria-pressed', 'true');
    if (icon) icon.textContent = '❚❚';
    if (label) label.textContent = 'Pause this note';
    if (status) status.textContent = 'A little message from me ♡';
  });

  audio.addEventListener('pause', () => {
    if (audio.ended) return;
    card.classList.remove('is-playing');
    button.setAttribute('aria-pressed', 'false');
    if (icon) icon.textContent = '▶';
    if (label) label.textContent = audio.currentTime > 0 ? 'Continue this note' : 'Play this note';
    if (status) status.textContent = 'Paused—come back whenever you’re ready.';
  });

  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', () => {
    activeVoiceNote = null;
    card.classList.remove('is-playing');
    button.setAttribute('aria-pressed', 'false');
    if (icon) icon.textContent = '↻';
    if (label) label.textContent = 'Play it again';
    if (status) status.textContent = 'Keep this one close ♡';
    updateProgress();
  });

  audio.addEventListener('error', () => {
    button.disabled = true;
    if (status) status.textContent = 'This voice note is being added soon.';
  });
});

wishButton?.addEventListener('click', () => {
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
