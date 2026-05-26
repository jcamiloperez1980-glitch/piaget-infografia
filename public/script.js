// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  updateProgress();
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== PROGRESS BAR =====
function updateProgress() {
  const total = document.body.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / total) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
}

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== THINKING CARDS — colored border on hover =====
document.querySelectorAll('.thinking-card').forEach(card => {
  const color = card.dataset.color;
  card.style.borderLeftColor = color;
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 12px 40px ${color}30`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// ===== STAGE TABS =====
document.querySelectorAll('.stage-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.stage-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.stage-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

// ===== FLIP CARDS (touch support) =====
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
});

// ===== QUIZ =====
const questions = [
  {
    q: '¿Cuál es el principio central de la Teoría Psicogenética de Piaget?',
    options: [
      'El conocimiento se transmite pasivamente del docente al estudiante',
      'El niño construye activamente su conocimiento a través de la experiencia',
      'El desarrollo cognitivo depende exclusivamente de la maduración biológica',
      'El lenguaje determina el pensamiento del niño'
    ],
    correct: 1,
    feedback: '✅ Correcto. Piaget propone que el niño es un agente activo: construye esquemas mediante la interacción directa con su entorno, no recibe el conocimiento pasivamente.'
  },
  {
    q: 'Un niño de 3 años llama "guau-guau" a todos los animales de cuatro patas. Según Piaget, esto es un ejemplo de:',
    options: [
      'Acomodación: modifica su esquema para incluir nuevos animales',
      'Equilibración: alcanza un nuevo equilibrio cognitivo',
      'Asimilación: incorpora nuevos animales al esquema existente del perro',
      'Conservación: mantiene la categoría de animales constante'
    ],
    correct: 2,
    feedback: '✅ Correcto. El niño usa su esquema previo (perro) para asimilar la nueva información (otros animales), adaptando la realidad a su estructura cognitiva sin modificar el esquema.'
  },
  {
    q: '¿En qué etapa del desarrollo el niño adquiere la noción de permanencia del objeto?',
    options: [
      'Preoperacional (2-7 años)',
      'Sensoriomotora (0-2 años)',
      'Operaciones Concretas (7-11 años)',
      'Operaciones Formales (11+ años)'
    ],
    correct: 1,
    feedback: '✅ Correcto. La permanencia del objeto — saber que un objeto existe aunque no se vea — es el logro principal de la etapa Sensoriomotora y aparece hacia el final de los 2 años.'
  },
  {
    q: 'La equilibración en la teoría de Piaget cumple la función de:',
    options: [
      'Garantizar que el niño siempre permanezca en un estado de calma emocional',
      'Impedir que los niños cambien sus esquemas mentales',
      'Ser el motor del desarrollo cognitivo: el desequilibrio impulsa la reorganización de esquemas',
      'Sincronizar el ritmo de aprendizaje entre todos los niños de la misma edad'
    ],
    correct: 2,
    feedback: '✅ Correcto. Piaget denomina "equilibración mayorante" al proceso donde el desequilibrio cognitivo (conflicto entre esquemas y realidad) impulsa la reorganización hacia niveles superiores de comprensión.'
  },
  {
    q: '¿Cuál de las siguientes prácticas es más coherente con la pedagogía piagetiana?',
    options: [
      'Dictar la clase mientras los estudiantes copian en silencio',
      'Memorizar las fórmulas antes de entender su significado',
      'Proporcionar respuestas directas para evitar la frustración del alumno',
      'Diseñar actividades de exploración que generen conflicto cognitivo controlado'
    ],
    correct: 3,
    feedback: '✅ Correcto. El docente piagetiano provoca desequilibrios controlados para motivar al estudiante a reorganizar sus esquemas. El aprendizaje activo y el descubrimiento son centrales.'
  }
];

let current = 0;
let score = 0;
let answered = false;

function renderQuestion() {
  const q = questions[current];
  document.getElementById('questionCounter').textContent = `Pregunta ${current + 1} de ${questions.length}`;
  document.getElementById('quizProgress').style.width = `${(current / questions.length) * 100}%`;
  document.getElementById('quizQuestion').textContent = q.q;

  const optionsEl = document.getElementById('quizOptions');
  optionsEl.innerHTML = '';
  answered = false;
  document.getElementById('quizNext').style.display = 'none';

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i, btn));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(index, btn) {
  if (answered) return;
  answered = true;

  const q = questions[current];
  const buttons = document.querySelectorAll('.quiz-option');
  buttons.forEach(b => b.disabled = true);

  const feedbackEl = document.createElement('div');
  feedbackEl.className = 'quiz-feedback';

  if (index === q.correct) {
    btn.classList.add('correct');
    feedbackEl.classList.add('correct');
    score++;
  } else {
    btn.classList.add('wrong');
    feedbackEl.classList.add('wrong');
    buttons[q.correct].classList.add('correct');
    feedbackEl.textContent = '❌ Incorrecto. ';
  }

  feedbackEl.textContent = q.feedback;
  document.getElementById('quizOptions').appendChild(feedbackEl);
  document.getElementById('quizNext').style.display = 'inline-block';
}

document.getElementById('quizNext').addEventListener('click', () => {
  current++;
  if (current < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  document.getElementById('quizContainer').style.display = 'none';
  const resultEl = document.getElementById('quizResult');
  resultEl.style.display = 'block';

  const pct = (score / questions.length) * 100;
  let icon, title, msg;

  if (pct === 100) {
    icon = '🏆'; title = '¡Excelente!';
    msg = 'Dominaste los conceptos clave de la teoría de Piaget. Comprendes los esquemas, las etapas, los procesos de adaptación y las aplicaciones educativas.';
  } else if (pct >= 60) {
    icon = '👏'; title = '¡Muy bien!';
    msg = 'Tienes una buena comprensión de la teoría. Repasa las preguntas que fallaste para consolidar tu aprendizaje.';
  } else {
    icon = '📖'; title = 'Sigue estudiando';
    msg = 'Te recomendamos repasar las secciones de la infografía, especialmente las etapas del desarrollo y los procesos de adaptación.';
  }

  document.getElementById('resultIcon').textContent = icon;
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultScore').textContent = `Puntaje: ${score} / ${questions.length} (${pct}%)`;
  document.getElementById('resultMessage').textContent = msg;
}

function resetQuiz() {
  current = 0;
  score = 0;
  answered = false;
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizContainer').style.display = 'block';
  renderQuestion();
}

// Init quiz
renderQuestion();

// ===== AUDIO — Web Speech API =====
const narrationScript = `
  Bienvenido a la infografía interactiva sobre la Teoría Psicogenética de Jean Piaget.

  Jean Piaget fue un biólogo y epistemólogo suizo nacido en 1896 y fallecido en 1980.
  Su teoría propone que los niños construyen activamente su conocimiento a través
  de la interacción con el entorno, organizando su experiencia en estructuras mentales
  llamadas esquemas.

  Piaget identificó cuatro etapas del desarrollo cognitivo.

  Primera: la etapa sensoriomotora, de cero a dos años, donde el bebé conoce el mundo
  a través de los sentidos y la acción, y adquiere la noción de permanencia del objeto.

  Segunda: la etapa preoperacional, de dos a siete años, donde emerge el lenguaje
  y el pensamiento simbólico, pero predomina el egocentrismo cognitivo.

  Tercera: la etapa de operaciones concretas, de siete a once años, donde el niño
  comprende la conservación y la reversibilidad de las operaciones.

  Cuarta: la etapa de operaciones formales, a partir de los once años, donde se desarrolla
  el pensamiento abstracto e hipotético-deductivo.

  Los dos procesos fundamentales de adaptación son la asimilación, que incorpora
  nueva información a esquemas existentes, y la acomodación, que modifica los esquemas
  para adaptarse a la nueva información.

  La equilibración es el motor del desarrollo: cada desequilibrio cognitivo impulsa
  una reorganización hacia niveles superiores de comprensión.

  Esta teoría tiene profundas implicaciones educativas: el docente no transmite
  conocimiento, sino que crea ambientes que provocan el descubrimiento activo
  y el conflicto cognitivo en el estudiante.

  Explora cada sección de esta infografía para profundizar en cada concepto.
`;

let synth = window.speechSynthesis;
let utterance = null;
let isPlaying = false;
let progressInterval = null;

function toggleNarration() {
  const btn  = document.getElementById('audioToggle');
  const icon = btn.querySelector('.audio-icon');
  const text = btn.querySelector('.audio-text');
  const prog = document.getElementById('audioProgress');
  const bar  = document.getElementById('audioProgressBar');

  if (!('speechSynthesis' in window)) {
    alert('Tu navegador no soporta síntesis de voz. Prueba en Chrome o Edge.');
    return;
  }

  if (isPlaying) {
    synth.cancel();
    clearInterval(progressInterval);
    isPlaying = false;
    icon.textContent = '🔊';
    text.textContent = 'Escuchar introducción';
    btn.classList.remove('playing');
    prog.style.display = 'none';
    bar.style.width = '0%';
    return;
  }

  utterance = new SpeechSynthesisUtterance(narrationScript);
  utterance.lang = 'es-ES';
  utterance.rate = 0.92;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Seleccionar voz en español si está disponible
  const voices = synth.getVoices();
  const esVoice = voices.find(v => v.lang.startsWith('es') && v.localService) ||
                  voices.find(v => v.lang.startsWith('es'));
  if (esVoice) utterance.voice = esVoice;

  utterance.onstart = () => {
    isPlaying = true;
    icon.textContent = '⏸';
    text.textContent = 'Pausar narración';
    btn.classList.add('playing');
    prog.style.display = 'block';
    // Simula progreso basado en duración estimada (~90 segundos)
    const totalMs = 90000;
    const startTime = Date.now();
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / totalMs) * 100, 98);
      bar.style.width = pct + '%';
    }, 500);
  };

  utterance.onend = () => {
    clearInterval(progressInterval);
    bar.style.width = '100%';
    setTimeout(() => {
      isPlaying = false;
      icon.textContent = '🔊';
      text.textContent = 'Escuchar introducción';
      btn.classList.remove('playing');
      prog.style.display = 'none';
      bar.style.width = '0%';
    }, 600);
  };

  utterance.onerror = () => {
    clearInterval(progressInterval);
    isPlaying = false;
    icon.textContent = '🔊';
    text.textContent = 'Escuchar introducción';
    btn.classList.remove('playing');
    prog.style.display = 'none';
  };

  synth.speak(utterance);
}

// Cargar voces (algunos navegadores las cargan de forma asíncrona)
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => { synth.getVoices(); };
}
