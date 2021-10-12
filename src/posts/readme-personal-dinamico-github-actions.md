---
title: Creando un README personal dinámico con GitHub Actions
description: Automatizamos la actualización de nuestro README personal para darle un toque extra gracias a las acciones de GitHub.
date: 2021-07-06
enableToc: true
tags:
  - Node
  - Tutorial
  - Automatización
postTweet: '1412314724646195202'
---

¿Recuerdas cuando hablé sobre [validar estilos y scripts de forma automática con GitHub](/posts/validando-scripts-estilos-automaticamente-github-actions/)? ¿No? Dale una vuelta, te espero...

Hoy vamos a ver cómo darle un toque extra a nuestro README personal que cada persona podemos crear en GitHub con tan solo crear un repositorio que se llame igual que nuestro usuario. Puedes ver el mío [aquí](https://github.com/Antonio-Laguna) y ya que estás si le das a Follow te lo agradecería más.

Quizá te estés preguntando, ¿por qué haría algo así? Pues porque le da un toque único a tu página. ¿No tienes un blog? Pon el tiempo de tu ciudad o las últimas fotos de tu Instagram o tus últimos tweets. O no hagas nada. Es una opción válida también.

Pero si te pica la curiosidad y quieres saber cómo lo he hecho yo, te ofrezco dos alternativas. Puedes ver este vídeo:

https://youtu.be/gYUfJUsUs30

O si te gusta más la lectura, continúa leyendo.

## El plan

El plan, a grandes rasgos, es así:

1. Creamos una plantilla con el README.
2. Creamos un pequeño script de Node que haga lo siguiente:
	1. Descargamos un feed de los últimos artículos del blog.
	2. Pasamos los últimos X artículos a la plantilla.
	3. Actualizamos el README.
3. Pedimos a GitHub que ejecute nuestro script cada cierto tiempo.

Para todo este proceso vamos a usar dos librerías que nos faciliten un poco la vida.

La primera, es el sistema de plantillas que vamos a usar. He escogido [Mustache](https://github.com/janl/mustache.js) por ser una de las más livianas y no tener dependencias.

La segunda es [node-fetch](https://github.com/node-fetch/node-fetch). Node tiene paquetes de bajo nivel para hacer peticiones pero son engorrosos de usar y esta librería usa la misma sintaxis que `window.fetch`.

Mi blog tiene, además de [un feed RSS](/feed/feed.xml), [un feed JSON](/feed/feed.json) por lo que voy a valerme de él para simplificarme aun más el trabajo.

## Preparando la plantilla

La plantilla vamos a basarla completamente en el README que tengamos actualmente. El nombre que le he dado es `readme.mustache` y contiene una copia exacta del README original con dos pequeñas variaciones.

Abajo del todo el código queda así:

```html
{% raw %}
<h3>Mis últimos artículos</h3>
<ul>
  {{#posts}}
    <li>
      <a href="{{{id}}}">
        <strong>{{title}}</strong>
      </a>
      <br/>
      <em>{{summary}}</em>
    </li>
  {{/posts}}
</ul>

---

<p align="center">
  Este <em>README</em> se genera cada día.
  <br/>
  Última vez: {{refreshDate}}
</p>
{% endraw %}
```

Con `{% raw %}{{#posts}}{% endraw %}` estamos iterando sobre una futura matriz que contenga todos los artículos que vamos a renderizar [tal y como explican en la documentación de mustache](https://github.com/janl/mustache.js#non-empty-lists). Cada artículo tiene su `id` (que es la URL), el `title` o título y el `summary` o resumen / descripción.

## Preparando el script

Vámonos al directorio por terminal y vamos a ejecutar lo siguiente:

```bash
npm init -y
```

Esto nos va a crear un `package.json` con las preguntas por defecto para que podamos comenzar a trabajar ya. Como comentábamos antes necesitamos dos librerías así que vamos a instalarlas ahora:

```bash
npm i mustache node-fetch
```

Hecho esto, vamos a crear nuestro fichero `index.js` donde vamos a empezar a programar. Lo primero que vamos a hacer es importar las librerías:

```js
const fs = require('fs/promises');
const Mustache = require('mustache');
const fetch = require('node-fetch');
```

Aparte de Mustache y node-fetch, estamos importando `fs/promises` que está disponible desde Node 10. `fs` es la abreviatura de File System (o sistema de ficheros) y nos permite leer y escribir ficheros con Node. La sintaxis anterior con callbacks es más farragosa y vamos a poder hacer uso de `async` y `await` que nos va a simplificar las cosas.

Hace ya más de 4 años subí un vídeo al respecto:

https://www.youtube.com/watch?v=tn-dP4S33ts

Lo primero que vamos a hacer es encapsular nuestro código en una función anónima que se autoinvoque para usar `async` y `await` dentro.

```js
(async () => {
  // Nuestro código
})();
```

Ahora, vamos a escribir una función que nos traiga el contenido de `readme.mustache` y la colocaremos dentro:

```js
const template = (await fs.readFile('./readme.mustache')).toString();
```

`readFile` nos devuelve una promesa que, una vez resuelta, nos trae un Buffer del fichero por lo que al usar `.toString()` obtenemos el fichero listo.

Lo siguiente que vamos a hacer es traernos los artículos:

```js
const blogPosts = await fetch('https://antonio.laguna.es/feed/feed.json')
  .then(res => res.json());
const posts = blogPosts.items.slice(0, 5);
```

`fetch` también nos devuelve una promesa que transformamos a JSON y luego cogemos los 5 primeros artículos con `slice`.

Ahora vamos a renderizar la plantilla:

```js
const newReadme = Mustache.render(template, { posts });
```

Si recuerdas de la parte de la plantilla, necesitábamos una matriz con artículos que habíamos llamado `posts`. Estamos pasando los `posts` que acabamos de sacar y que van a permitir que la plantilla se renderice.

Finalmente, lo que nos queda de nuestro script es guardar este `newReadme` en el fichero `README.md`. Vamos a usar `fs` de nuevo:

```js
await fs.writeFile('./README.md', newReadme);
```

Si ejecutamos el fichero con `node index.js` vamos a ver cómo se actualiza el README tal y como esperábamos. ¡Bien! Aquí tienes el fichero completo:

```js
const fs = require('fs/promises');
const Mustache = require('mustache');
const fetch = require('node-fetch');

(async () => {
  const template = (await fs.readFile('./readme.mustache')).toString();
  const blogPosts = await fetch('https://antonio.laguna.es/feed/feed.json')
    .then(res => res.json());
  const posts = blogPosts.items.slice(0, 5);
  const newReadme = Mustache.render(
    template,
    { posts }
  );

  await fs.writeFile('./README.md', newReadme);
})();
```

¡La de cosas que hemos hecho en pocas líneas de código!

## Automatizando el script

Ahora que nuestro script funciona ha llegado la hora de automatizarlo. Aunque podríamos aprovecharlo así y hacer commit manualmente, eso va en contra de lo que estábamos intentando lograr.

A grandes rasgos, la acción va a realizar los siguientes pasos:

1. Descargarse el repositorio.
2. Configurar Node. Recuerda que al menos necesitamos Node 14.8 así que vamos a ponerlo en la última que tenemos ahora que es Node 16.
3. Vamos a introducir una [cache](https://github.com/actions/cache). GitHub nos deja las acciones de forma gratuita siempre que no lleven mucho tiempo así que cualquier acción que podamos realizar para aliviar el tiempo será bienvenida.
4. Instalaremos las dependencias de node.
5. Ejecutaremos nuestro script.
6. Actualizaremos el README con la [acción publish](https://github.com/mikeal/publish-to-github-action).

Vamos a crear nuestro fichero para la tarea en `.github/workflows/readme.yaml` y la tarea, de acuerdo a lo de arriba se ve así:

```yml
{% raw %}
name: README build

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: checkout
        uses: actions/checkout@v1
      - name: setup node
        uses: actions/setup-node@v1
        with:
          node-version: '16.x'
      - name: cache
        uses: actions/cache@v1
        with:
          path: node_modules
          key: ${{ runner.os }}-js-${{ hashFiles('package-lock.json') }}
      - name: Install dependencies
        run: npm ci
      - name: Generate README file
        run: node index.js
      - name: Push new README.md
        uses: mikeal/publish-to-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BRANCH_NAME: 'main'
{% endraw %}
```

Los pasos son los que hemos descrito anteriormente. Únicamente destaco un par de puntos.

La clave de la cache es el sistema operativo y un hash del fichero `package-lock.json`. Mientras ese fichero no cambie, el contenido de `node_modules` se guardará en la caché.

Por último, en la acción de publicar, hemos cambiado la rama a `main` que es mi rama por defecto. La acción usa `master` por defecto por lo que si tu repositorio usa `master` no tienes que añadir nada.

Lo último que nos queda es indicar *cuándo* queremos que se ejecute esta tarea. Vamos a indicar dos cosas.

1. Cuando actualicemos `main`.
2. De manera automática cada día.

Para ejecutar tareas periódicas de forma automática, GitHub actions nos permite usar `cron`. Yo no soy muy ducho en la sintaxis de Cron pero gracias a la web [Crontab.guru](https://crontab.guru/) sé que la sintaxis que tengo que usar es la siguiente:

```yml
on:
  push:
    branches:
      - main
  schedule:
    - cron: '0 10 * * 1,2,3,4,5'
```

:::info Atención

GitHub no asegura en ningún caso que la hora de ejecución sea la hora indicada. Tal como verás en el vídeo o en el repositorio, ocurre *a partir* de esa hora.

:::

Lo que estoy diciendo es, en el minuto 0, a las 10, cualquier día, cualquier mes, mientras sea Lunes, Martes Miércoles, Jueves o Viernes. He escogido este horario a propósito. Mi rutina de publicación es dejar publicadas las cosas sobre las 9-9:30 por lo que a las 10 (si es que hay algo nuevo) debería pillar el contenido nuevo. Como norma general no publico tampoco en fines de semana por lo que ahorramos ejecuciones en esos días también.

## Recapitulando

Si has leído (o visto el vídeo) habrás aprendido cómo hacer un README dinámico que beba de un feed de artículos para actualizar nuestro README de manera automática cada día.

El resultado queda así:

{% image 'captura-repo-readme-dinamico_yjtlz6.jpg' 1782 1604 'Resultado actual del README personal en el que se ven las tecnologias que uso y como se muestran los ultimos 5 articulos del blog' %}

Además, habrás aprendido cómo crear una acción de GitHub que se ejecute de forma periódica gracias a la sintaxis de crontab.

Espero que te haya servido y, si te animas a hacer algo dinámico, ¡avísame por [Twitter](https://twitter.com/ant_laguna) o por [correo](https://antonio.laguna.es/sobre-mi/) para que vea cómo lo has hecho! Siempre puedes encontrar el código de lo que hemos hecho en [mi repositorio personal](https://github.com/Antonio-Laguna/Antonio-Laguna).
