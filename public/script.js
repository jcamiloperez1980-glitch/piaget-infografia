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
