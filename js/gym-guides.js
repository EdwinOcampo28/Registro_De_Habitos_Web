(function () {
  'use strict';

  const moves = [
    { id: 'squat', match: /sentadilla/i, title: 'Sentadilla', tip: 'Lleva la cadera hacia atrás y baja con los pies firmes. Mantén las rodillas alineadas con los pies y sube de forma controlada.' },
    { id: 'wall-pushup', match: /flexiones? en pared/i, title: 'Flexión en pared', tip: 'Manos a la altura del pecho. Mantén el cuerpo alineado, acerca el pecho a la pared y empuja para volver.' },
    { id: 'bridge', match: /puente de glúteos/i, title: 'Puente de glúteos', tip: 'Boca arriba y pies apoyados. Eleva la pelvis apretando los glúteos y bájala lentamente.' },
    { id: 'dead-bug', match: /dead bug/i, title: 'Dead bug', tip: 'Desde el suelo, alterna brazo y pierna contrarios. Mantén la espalda cómoda y vuelve despacio al centro.' },
    { id: 'knee-plank', match: /plancha con rodillas/i, title: 'Plancha con rodillas', tip: 'Apoya antebrazos y rodillas. Alinea hombros y cadera, respira y mantén la postura sin forzar.' },
    { id: 'knee-pushup', match: /flexiones con rodillas/i, title: 'Flexión con rodillas', tip: 'Manos bajo los hombros y rodillas apoyadas. Baja el pecho en bloque y empuja para subir.' },
    { id: 'lunge', match: /zancada atrás/i, title: 'Zancada atrás asistida', tip: 'Da un paso atrás y flexiona ambas piernas solo hasta donde te sientas estable. Puedes apoyarte en una silla.' },
    { id: 'crunch', match: /abdominal corto/i, title: 'Abdominal corto', tip: 'Con las rodillas flexionadas, eleva suavemente los hombros. Evita tirar del cuello y vuelve despacio.' },
    { id: 'bird-dog', match: /bird.?dog/i, title: 'Bird-dog', tip: 'En cuatro apoyos, extiende brazo y pierna contrarios sin girar la cadera. Vuelve al centro y cambia de lado.' }
  ];

  function find(name) {
    return moves.find(move => move.match.test(String(name || ''))) || null;
  }
  function modelMarkup() {
    return '<div class="gym-3d-model" aria-hidden="true">' +
      '<span class="gym-3d-head"><i></i></span><span class="gym-3d-neck"></span>' +
      '<span class="gym-3d-torso"><i></i></span><span class="gym-3d-pelvis"></span>' +
      '<span class="gym-3d-arm gym-3d-arm-left"><i class="gym-3d-forearm"><b></b></i></span>' +
      '<span class="gym-3d-arm gym-3d-arm-right"><i class="gym-3d-forearm"><b></b></i></span>' +
      '<span class="gym-3d-leg gym-3d-leg-left"><i class="gym-3d-shin"><b></b></i></span>' +
      '<span class="gym-3d-leg gym-3d-leg-right"><i class="gym-3d-shin"><b></b></i></span></div>';
  }
  function mount(container, name) {
    const move = find(name);
    if (!move) return;
    container.innerHTML = '<section class="gym-3d-demo gym-3d-demo--' + move.id + '">' +
      '<div class="gym-3d-stage"><span class="gym-3d-badge">DEMOSTRACIÓN 3D</span>' +
      '<span class="gym-3d-wall" aria-hidden="true"></span><span class="gym-3d-floor" aria-hidden="true"></span>' +
      modelMarkup() + '<span class="gym-3d-loop-label">Movimiento en bucle</span></div>' +
      '<div class="gym-3d-copy"><div><strong>' + move.title + '</strong><p>' + move.tip + '</p></div>' +
      '<button type="button" class="gym-3d-pause" aria-pressed="false">Ⅱ Pausar</button></div></section>';
    const demo = container.querySelector('.gym-3d-demo');
    const pause = container.querySelector('.gym-3d-pause');
    pause.addEventListener('click', function () {
      const paused = demo.classList.toggle('is-paused');
      pause.setAttribute('aria-pressed', String(paused));
      pause.textContent = paused ? '▶ Reanudar' : 'Ⅱ Pausar';
    });
  }

  window.HabitGymGuides = {
    supports(name) { return !!find(name); },
    mount
  };
})();
