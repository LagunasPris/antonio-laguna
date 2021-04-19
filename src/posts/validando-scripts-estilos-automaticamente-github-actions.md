---
title: Validando scripts y estilos de forma automática con GitHub Actions
description: Aprende cómo usar las acciones de GitHub de forma sencilla para llevar a cabo tareas sencillas como usar linters de forma automática.
date: 2021-04-19
tags:
  - CSS
  - JS
  - Tutorial
postTweet: '1384042329980477440'
---

A las personas que nos dedicamos al desarrollo del software nos encanta automatizar cosas. Aunque casi siempre es beneficioso (dado que nos evita tener que repetir la inversión de tiempo una   y otra vez), en esta ocasión creo que es doblemente beneficioso.

Es habitual tener unas convenciones comunes en torno al código que hay que seguir. Estas nos ayudan a que el código sea **consistente**. La consistencia nos ayuda a la hora de leer código y entenderlo con mayor facilidad. El beneficio es el mismo que obtienes cuando lees una página bien estructurada. El flujo de la información — aunque no afecta al contenido directamente — cambia la forma en la que percibimos y consumimos los datos.

Veamos un sencillo ejemplo:

```js
function sumar(a,b) { return a + b }


  const c = sumar( 1,3);

if(c < 10  )console.log('menor!')
      else console.log("mayor!")
```

Es un sencillo ejemplo y un poco drástico pero es complicado de leer y digerir: **te obliga a pensar más**.

Sin embargo:

```js
function sumar(a, b) {
  return a + b;
}

const c = sumar(1, 3);

if (c < 10) {
  console.log('menor!');
} else {
  console.log('mayor!');
}
```

Parece más sencillo de discernir qué está haciendo. Los espacios son consistentes, las alineaciones, el uso de comillas, etc.

Está muy extendido el uso de librerías como [ESLint](https://eslint.org/) y [Stylelint](https://stylelint.io/) para que, dadas unas reglas establecidas (y subjetivas), nos ayude a mantener un código que cumpla dichas reglas.

A la hora de revisar código de otra persona, es fantástico poder quitarnos este tipo de comentarios/revisiones de encima y centrarnos en otras partes más interesantes.

Hoy vamos a ver cómo podemos usar las acciones de GitHub para que lleve esto a cabo por nosotros y nos chive en una *pull request* si hay algo que no esté cumpliendo.

:::info Nota

Este tutorial asume que tienes cierta familiaridad con ESLint y Stylelint en tu repositorio y que los usas para validar tu código de forma local.

:::

Si prefieres ver este tutorial en un corto vídeo, te lo dejo por aquí:

https://youtu.be/xldbA8dHwBA

Lamento el audio del vídeo. Es el primero en un montón de tiempo. ¡Espero que el próximo salga mejor!

## ¿Qué son las GitHub Actions?

Las acciones de GitHub nos permiten crear flujos de trabajo en nuestro repositorio de GitHub. Los flujos se componen de tareas (llamadas acciones) que se pueden ejecutar de manera autónoma en ciertos eventos.

Esto te permite incluir (de forma completamente gratuita) Integración Continua (o CI por sus siglas en inglés) y despliegues continuos (o CD) y otras características a tu repositorio.

Aunque vamos a ver cómo asegurarnos de que nuestro código pasa por Eslint y Stylelint, podrías poner otras tareas para:

* Ejecutar tests y bloquear una petición si no pasan.
* Exigir un mínimo de cobertura de tests.
* Avisar en un canal de Slack de que algo ha ocurrido.
* Desplegar en un servidor por FTP.

¡O cualquier cosa que se te ocurra!

## Anatomía de una acción

Las acciones se definen en ficheros `.yml` dentro de la ruta `.github/workflows` de la raíz de tu proyecto.

Vamos a ver una sencilla ación para ver cómo funciona:

```yml
name: Hola Mundo
on: push
jobs:
  hola-mundo:
    runs-on: ubuntu-latest
    steps:
      - run: echo "¡Hola 👋🏽 Mundo 🌍!"
```

Este es el ejemplo más sencillo de acción. Podemos definir el campo `name` que nos aparecerá luego en la pestaña de acciones y podremos ver las veces que se ha ejecutado, sus registros, etc. Si no está definido, GitHub usará el nombre del fichero.

Continúan definiendo un `on`. Este es el **evento** que va a hacer que se dispare la acción. En este caso es `push` que hará que se ejecute con cada commit que subamos al repositorio. Si quisiéramos ejecutarlo de forma manual únicamente por ejemplo, indicaríamos `workflow_dispatch`. Puedes encontrar una lista completa de eventos en [la documentación](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#webhook-events).

La siguiente parte (y más interesante) es la de `jobs`. Una tarea puede tener uno o varios `jobs` y se pueden ejecutar de forma paralela (por defecto) o secuencial. En este caso, estamos definiendo una acción que se va a ejecutar en `ubuntu` y, como único paso, mostrará en la consola el mensaje `¡Hola 👋🏽 Mundo 🌍!`.

## GitHub actions con ESLint

Ahora que ya sabemos un poco sobre las acciones de GitHub, vamos a crear nuestra acción para validar con ESLint nuestro nuevo código en el repositorio:

```yml
name: Lint

on:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup node
        uses: actions/setup-node@v1
        with:
          node-version: "14.x"
      - run: npm ci
      - run: npm run lint:js
```

A primera vista estamos viendo que la acción va a ejecutarse en `pull_request`. Si además restringimos las subidas directas a la rama principal y obligamos a usar una *pull request*, estaremos asegurándonos que nuestras ramas estén bien validadas.

Los pasos que sigue esta acción son:

1. Descargar el repositorio. (`checkout`)
2. Configurar Node con una versión 14.x. (`setup-node`)
3. Instalar las dependencias. (`npm ci`)
4. Ejecutar ESLint con `npm run lint:js` .

Este último paso puede variar en cada repositorio puesto que necesita que tengas un `script` dentro de tu `package.json` que se pueda ejecutar. En mi caso, mi `script` es así:

```json
{
  "scripts": {
    "lint:js": "eslint src/**/*.js rollup.config.js eleventy/**/*.js --max-warnings 0",
  }
}
```

Que se encarga de revisar todos los ficheros y de no dejar que ninguna `warning` pase.

Si lo pruebas y tienes errores 😬 deberías ver algo así:

![Captura de pantalla que muestra un error en un fichero de ESLint](/img/posts/fallo-eslint-github-action.png "Error en ESLint")

## GitHub actions con Stylelint

La acción de Stylelint tiene una estructura muy similar a la de ESLint como vas a comprobar en un momento.

```yml
name: Stylelint

on:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup node
        uses: actions/setup-node@v1
        with:
          node-version: "14.x"
      - uses: xt0rted/stylelint-problem-matcher@v1
      - run: npm ci
      - run: npm run lint:css
```

Aparte de cambiar el comando final por `npm run lint:css` habrás observado que hemos usado la acción `xt0rted/stylelint-problem-matcher@v1`. Esta se encarga de asociar los problemas a los ficheros:

![Captura de pantalla que muestra un error en un fichero de Stylelint](/img/posts/fallo-stylelint-github-action.png "Error en Stylelint")

Esto no es necesario en ESLint porque ya se encarga la librería de forma automática.

## Conclusión

Espero que este pequeño tutorial te haya servido y que puedas automatizar ciertos procesos y revisiones. En mis equipos ha ayudado este tipo de configuraciones que llevan poco tiempo y aseguran que la revisión posterior de código va a estar únicamente centrada en problemas y no en fallos de consistencia.

![Captura de pantalla que muestra ambas acciones habiendo fallado](/img/posts/errores-github-actions.png "Error en ambas acciones")

*[FTP]: File Transfer Protocol
*[YAML]: Yet Another Markup Language
