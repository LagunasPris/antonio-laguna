---
title: Mejora tus animaciones en hover
description: Pequeño truco con CSS para evitar saltos en las animaciones que se activan en hover.
date: 2021-07-20
tags:
  - CSS
postTweet: '1375360119945490432'
---

Las animaciones en CSS nos permiten dar un toque de vida a la web o interfaz que estamos haciendo. Mientras las transiciones nos permiten cambiar valores reaccionando a un cambio, las animaciones no necesitan esto.

Por otro lado, las animaciones nos permiten repetirlas en bucle, en yo-yo y hacer cosas más complejas con ellas.

Hay ocasiones en las que queremos que una animación se ejecute en hover. Veamos este corazón por ejemplo:

<style>
  .reset-focus {
    display: none;
  }

  @media (hover: none) {
    .reset-focus {
      display: inline-block;
    }

    .svg-icon:focus {
      outline: 4px solid red;
    }
  }

  .svg-icon-animated:hover,
  .svg-icon-animated:focus {
    animation: heartbeat 1s infinite;
  }

  .svg-icon-rotate:hover,
  .svg-icon-rotate:focus {
    animation: rotate-heart 5s linear infinite;
  }

  .svg-icon-fix {
    animation: rotate-heart 5s linear infinite;
    animation-play-state: paused;
  }

  .svg-icon-fix:hover,
  .svg-icon-fix:focus {
    animation-play-state: running;
  }

  @keyframes heartbeat {
    0% {
      transform: scale(.75);
    }

    20% {
      transform: scale(1);
    }

    40% {
      transform: scale(.75);
    }

    60% {
      transform: scale(1);
    }

    80% {
      transform: scale(.75);
    }

    100% {
      transform: scale(.75);
    }
  }

  @keyframes rotate-heart {
    0% {
      transform: rotate(0);
    }

    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="text--center">
<svg tabindex="0" class="svg-icon" width="96" height="96" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><path d="M95.997 41.986l-.026-.035C85.746 28.36 68.428 21.423 51.165 24.881 30.138 29.094 15.004 47.558 15 69.003c0 24.413 14.906 47.964 39.486 70.086 8.43 7.586 17.437 14.468 26.444 20.533.728.49 1.444.967 2.148 1.43l1.39.909 1.355.872 1.317.835.645.403 1.259.78 1.194.726 1.032.619 1.38.807.418.236a6 6 0 005.864 0l1.138-.654 1.154-.684 1.118-.675.614-.376 1.26-.779a212 212 0 00.644-.403l1.317-.835 1.355-.872 1.39-.909c.704-.463 1.42-.94 2.148-1.43 9.007-6.065 18.015-12.947 26.444-20.533C162.094 116.967 177 93.416 177 69.004c-.004-21.446-15.138-39.91-36.165-44.123-17.07-3.42-34.174 3.323-44.43 16.568l-.408.537zm42.48-5.338c15.421 3.09 26.52 16.63 26.523 32.357 0 19.607-12.438 39.847-33.532 59.357l-1.316 1.205c-.22.201-.443.402-.666.603-7.977 7.18-16.548 13.727-25.118 19.498l-.745.5c-.74.494-1.466.973-2.177 1.437l-1.402.906-1.359.864-.662.416-1.292.8-.732.446-.73-.446-1.292-.8-.662-.416-1.36-.864-1.4-.906a235.406 235.406 0 01-2.923-1.937c-8.57-5.77-17.14-12.319-25.118-19.498l-.666-.603-1.316-1.205C39.438 108.852 27 88.612 27 69.004c.003-15.726 11.102-29.267 26.523-32.356 15.253-3.056 30.565 4.954 36.756 19.208l.204.478c2.084 4.878 9.009 4.85 11.053-.045 6.062-14.511 21.52-22.73 36.941-19.641z" fill="currentColor"/></svg>
</div>

Hagamos que se anime al hacer hover para que lata como un corazón. El código sería algo así:

```css
.heart {
  animation: heartbeat 1s infinite;
}

@keyframes heartbeat {
  0% {
    transform: scale(.75);
  }

  20% {
    transform: scale(1);
  }

  40% {
    transform: scale(.75);
  }

  60% {
    transform: scale(1);
  }

  80% {
    transform: scale(.75);
  }

  100% {
    transform: scale(.75);
  }
}
```

Y este sería el resultado:

<div class="text--center">
<svg tabindex="0" class="svg-icon svg-icon-animated" width="96" height="96" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><path d="M95.997 41.986l-.026-.035C85.746 28.36 68.428 21.423 51.165 24.881 30.138 29.094 15.004 47.558 15 69.003c0 24.413 14.906 47.964 39.486 70.086 8.43 7.586 17.437 14.468 26.444 20.533.728.49 1.444.967 2.148 1.43l1.39.909 1.355.872 1.317.835.645.403 1.259.78 1.194.726 1.032.619 1.38.807.418.236a6 6 0 005.864 0l1.138-.654 1.154-.684 1.118-.675.614-.376 1.26-.779a212 212 0 00.644-.403l1.317-.835 1.355-.872 1.39-.909c.704-.463 1.42-.94 2.148-1.43 9.007-6.065 18.015-12.947 26.444-20.533C162.094 116.967 177 93.416 177 69.004c-.004-21.446-15.138-39.91-36.165-44.123-17.07-3.42-34.174 3.323-44.43 16.568l-.408.537zm42.48-5.338c15.421 3.09 26.52 16.63 26.523 32.357 0 19.607-12.438 39.847-33.532 59.357l-1.316 1.205c-.22.201-.443.402-.666.603-7.977 7.18-16.548 13.727-25.118 19.498l-.745.5c-.74.494-1.466.973-2.177 1.437l-1.402.906-1.359.864-.662.416-1.292.8-.732.446-.73-.446-1.292-.8-.662-.416-1.36-.864-1.4-.906a235.406 235.406 0 01-2.923-1.937c-8.57-5.77-17.14-12.319-25.118-19.498l-.666-.603-1.316-1.205C39.438 108.852 27 88.612 27 69.004c.003-15.726 11.102-29.267 26.523-32.356 15.253-3.056 30.565 4.954 36.756 19.208l.204.478c2.084 4.878 9.009 4.85 11.053-.045 6.062-14.511 21.52-22.73 36.941-19.641z" fill="currentColor"/></svg>
  <button class="article__body__button reset-focus">
    Quitar foco
  </button>
</div>

No obstante, al quitar el ratón el corazón pega un salto lo cual no es ideal. En este caso puede no ser muy destacable pero... ¿y si lo hiciéramos girar?

<div class="text--center">
<svg tabindex="0" class="svg-icon svg-icon-rotate" width="96" height="96" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><path d="M95.997 41.986l-.026-.035C85.746 28.36 68.428 21.423 51.165 24.881 30.138 29.094 15.004 47.558 15 69.003c0 24.413 14.906 47.964 39.486 70.086 8.43 7.586 17.437 14.468 26.444 20.533.728.49 1.444.967 2.148 1.43l1.39.909 1.355.872 1.317.835.645.403 1.259.78 1.194.726 1.032.619 1.38.807.418.236a6 6 0 005.864 0l1.138-.654 1.154-.684 1.118-.675.614-.376 1.26-.779a212 212 0 00.644-.403l1.317-.835 1.355-.872 1.39-.909c.704-.463 1.42-.94 2.148-1.43 9.007-6.065 18.015-12.947 26.444-20.533C162.094 116.967 177 93.416 177 69.004c-.004-21.446-15.138-39.91-36.165-44.123-17.07-3.42-34.174 3.323-44.43 16.568l-.408.537zm42.48-5.338c15.421 3.09 26.52 16.63 26.523 32.357 0 19.607-12.438 39.847-33.532 59.357l-1.316 1.205c-.22.201-.443.402-.666.603-7.977 7.18-16.548 13.727-25.118 19.498l-.745.5c-.74.494-1.466.973-2.177 1.437l-1.402.906-1.359.864-.662.416-1.292.8-.732.446-.73-.446-1.292-.8-.662-.416-1.36-.864-1.4-.906a235.406 235.406 0 01-2.923-1.937c-8.57-5.77-17.14-12.319-25.118-19.498l-.666-.603-1.316-1.205C39.438 108.852 27 88.612 27 69.004c.003-15.726 11.102-29.267 26.523-32.356 15.253-3.056 30.565 4.954 36.756 19.208l.204.478c2.084 4.878 9.009 4.85 11.053-.045 6.062-14.511 21.52-22.73 36.941-19.641z" fill="currentColor"/></svg>
  <button class="article__body__button reset-focus">
    Quitar foco
  </button>
</div>

Aquí el cambio se nota mucho más. En mi experiencia este tipo de animaciones son pequeñas guindas en el pastel pero al quitar el hover perdemos un poco esa magia. El truco que te propongo es el siguiente:

```css
.heart {
  animation: rotate-heart 5s linear infinite;
  animation-play-state: paused;
}

.heart:hover {
  animation-play-state: running;
}
```

Y este es el resultado.

<div class="text--center">
<svg tabindex="0" class="svg-icon svg-icon-fix" width="96" height="96" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><path d="M95.997 41.986l-.026-.035C85.746 28.36 68.428 21.423 51.165 24.881 30.138 29.094 15.004 47.558 15 69.003c0 24.413 14.906 47.964 39.486 70.086 8.43 7.586 17.437 14.468 26.444 20.533.728.49 1.444.967 2.148 1.43l1.39.909 1.355.872 1.317.835.645.403 1.259.78 1.194.726 1.032.619 1.38.807.418.236a6 6 0 005.864 0l1.138-.654 1.154-.684 1.118-.675.614-.376 1.26-.779a212 212 0 00.644-.403l1.317-.835 1.355-.872 1.39-.909c.704-.463 1.42-.94 2.148-1.43 9.007-6.065 18.015-12.947 26.444-20.533C162.094 116.967 177 93.416 177 69.004c-.004-21.446-15.138-39.91-36.165-44.123-17.07-3.42-34.174 3.323-44.43 16.568l-.408.537zm42.48-5.338c15.421 3.09 26.52 16.63 26.523 32.357 0 19.607-12.438 39.847-33.532 59.357l-1.316 1.205c-.22.201-.443.402-.666.603-7.977 7.18-16.548 13.727-25.118 19.498l-.745.5c-.74.494-1.466.973-2.177 1.437l-1.402.906-1.359.864-.662.416-1.292.8-.732.446-.73-.446-1.292-.8-.662-.416-1.36-.864-1.4-.906a235.406 235.406 0 01-2.923-1.937c-8.57-5.77-17.14-12.319-25.118-19.498l-.666-.603-1.316-1.205C39.438 108.852 27 88.612 27 69.004c.003-15.726 11.102-29.267 26.523-32.356 15.253-3.056 30.565 4.954 36.756 19.208l.204.478c2.084 4.878 9.009 4.85 11.053-.045 6.062-14.511 21.52-22.73 36.941-19.641z" fill="currentColor"/></svg>
  <button class="article__body__button reset-focus">
    Quitar foco
  </button>
</div>

Como puedes ver ahora, el corazón empieza a girar y si quitamos el ratón simplemente se para hasta que volvemos a pasar el ratón por encima.
