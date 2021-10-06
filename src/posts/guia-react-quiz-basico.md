---
title: Guía de React Quiz Basico
date: 2021-09-18
isQuiz: true
tags:
  - React
quiz:
  title: "Test: React Básico"
  description: "Pon a prueba los conocimientos que hemos visto hasta ahora en el curso y comprueba lo que sabes."
  questions:
    - title: "React se usa principalmente para crear <span class='line'>___</span>"
      choices:
        - "Bases de datos"
        - "Interfaces de usuario"
        - "Diseños"
        - "Ajax"
---

<quiz-es class="bleed" start-text="Comenzar" next-text="Siguiente">
  <h2 slot="quiz-title" class="quiz__title text-level--4">Cuestionario: React Básico</h2>
  <div slot="quiz-description" class="quiz__description">
    <p>Pon a prueba los conocimientos que hemos visto hasta ahora en el curso y comprueba lo que sabes.</p>
  </div>
  <div slot="quiz-result" class="quiz__result">
    <p>¡Lo has completado! Este es tu resultado:</p>
    <div class="progress-circle">
      <div class="progress-circle__number">
        2/2
      </div>
      <div class="progress-circle__fill">
        <svg class="icon" viewBox="0 0 40 40">
          <circle r="15.9154943092" cy="20" cx="20" />
          <circle class="progress-circle__result" r="15.9154943092" cy="20" cx="20" stroke-dashoffset="25" transform="rotate(-90,20,20)" />
        </svg>
      </div>
    </div>
    <p>Comparte tu progreso en Twitter</p>
    <p>
      <a href="#" class="button_tweet" data-tags="">Compartir</a>
    </p>
  </div>
</quiz-es>

<script>
window.questions = [
  {
    title: "React se usa principalmente para crear <span class='line'>___</span>",
    choices: [
      "Bases de datos",
      "Interfaces de usuario",
      "Diseños",
      "Ajax"
    ],
    answer: 1
  },
  {
    title: "React se usa principalmente para crear __",
    choices: [
      "Bases de datos",
      "Interfaces de usuario",
      "Diseños",
      "Ajax"
    ],
    answer: 1
  }
];
</script>
