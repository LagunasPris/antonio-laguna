---
title: Usando Webmentions en Eleventy
description: ¿Sabías qué son las Webmentions? Yo tampoco. Acompáñame a descubrir qué código necesitamos para mostrarlas en la web y cómo mandar nuestras menciones.
date: 2021-04-06
tags:
  - CSS
  - JS
  - Tutorial
enableToc: true
postTweet: '1379332293538500609'
---

:::hidden-header Introducción

En mi [¡Hola Mundo!](/posts/hola-mundo/) comentaba que quería añadir un sistema de comentarios. Estuve pensando en varios. Los comento (¿lo pillas?) por si a alguien les viene bien para su página personal.

* [Utterances](https://utteranc.es/). Es probablemente mi segundo favorito. Se basa en incidencias en un repositorio de GitHub. Teniendo en cuenta que mi página ya está en GitHub de forma pública, creo que tiene sentido.
* [Commento](https://commento.io/). Un sistema más tradicional pero con un fuerte componente de privacidad. Tal y como ellos destacan, no son gratuitos por diseño.

Cuando usas un sistema como Disqus que es gratuito, estás pagando con la privacidad de tus usuarios. Mi objetivo con esta web es no necesitar poner el aviso de la GDPR.

Cacharreando por la web me encontré las Webmentions o Menciones web y supe rápidamente que era eso lo que quería implementar.

## ¿Qué son las Webmentions?

Las [Webmentions](https://indieweb.org/Webmention) son un estándar abierto sobre las reacciones a algo en la web. Se encuentran en estado de recomendación por la W3C y es parte del [movimiento IndieWeb](https://indieweb.org/). Cuando enlazas a un sitio, puedes enviarle una Webmention para notificarlo.

Si llevas ya tiempo en esto de la web, quizá te suenen los [pingbacks](https://es.wikipedia.org/wiki/Pingback) que WordPress popularizó pero Webmention (aparte de pretender ser un estándar) no se basa en XML si no en POST y contiene más información que un *ping*. Nos indican si son un *me gusta*, *compartir* o un *comentario*.

## Cómo añadir Webmentions a tu sitio

Ahora que ya sabemos *qué* son las Webmentions, vamos a ver *cómo*  añadirlas. En pocas palabras y resumiendo mucho, necesitamos seguir 3 pasos para añadir Webmentions a nuestra web.

1. Declarar una ruta o *endpoint* en el que tu página pueda recibir esas menciones.
2. Mostrar las menciones.
3. Mandar menciones a sitios que menciones.

Si te sigue interesando esto, sigue leyendo y vamos a ver cómo he implementado estos 3 pasos.

### Declarando ruta para recibir menciones

Cuando un sitio web te menciona, como veremos ahora, tiene que poder saber dónde avisar de esta mención. Hay una implementación de rutas para Webmentions en [PHP](https://gist.github.com/adactio/6484118) pero hay servicios como [Webmention.io](https://webmention.io/) que te permiten recibir menciones sin necesitar nada de código extra.

Antes de darnos de alta hay una cosa que tenemos que hacer y es configurar nuestra web para validar nuestra identidad tal y como explican [aquí](Webmention.io) (en inglés). Básicamente tenemos que demostrar que hay relación entre nuestro sitio y dos perfiles y eso nos permite iniciar sesión en servicios que hayan  implementado web sign-in.

Tenemos dos alternativas:

La primera es adecuada siempre que ya tengamos enlaces visibles en nuestra página de Twitter y/o GitHub. A los enlaces, les añadimos la etiqueta `rel="me"` que indican que nos pertenece. Esta es la opción que yo preferí puesto que los enlaces ya están en el pie de la página.

La segunda es añadir un `link` dentro de la etiqueta `head` de la página si no queremos tener estos enlaces visibles.

```html
<link rel="me" href="https://twitter.com/ant_laguna" />
```

Una vez hecho esto, tienes que editar tus perfiles para que apunten a tu página.

Finalmente, verás que al entrar en Webmention.io y escribir tu dominio nos aparecen las dos opciones para poder iniciar sesión.

![Captura de pantalla de webmention.io que muestra los botones que permiten iniciar sesión para Twitter y GitHub](/img/posts/webmention-login.png "Botones de inicio de sesión")

Cuando hayas iniciado sesión, podrás encontrar las etiquetas que les dicen a otros sitios *dónde* enviar esas menciones web. En Ajustes (settings) encontrarás las etiquetas.

En mi caso son:

```html
<link rel="webmention" href="https://webmention.io/antonio.laguna.es/webmention" />
<link rel="pingback" href="https://webmention.io/antonio.laguna.es/xmlrpc" />
```

Y con esto, ¡ya podemos recibir menciones!

### Convirtiendo interacciones sociales en Webmentions

Seguro que cuando has leído los tipos de menciones te has rascado la cabeza y pensado... *eso suena mucho a twitter*. Lamentablemente aun no hay muchos sitios que soporten Webmentions y la mayoría de interacciones (al menos en mi caso) ocurren en Twitter.

[Bridgy](https://brid.gy/) es un servicio gratuito que se encarga de vigilar Twitter, Facebook e Instagram para enviar una mención para cada *like*, respuesta o *retweet* que recibas.

Si publicas algún tweet que contenga un enlace a tu web y alguien comenta en él, Bridgy lo coge y lo transforma en webmention y lo envía a la ruta que hemos definido arriba.

Lo bueno es que puedes combinar cosas de Facebook, Twitter, páginas propias. También tienes control sobre tus menciones ya que desde Webmentions.io puedes borrar cualquier comentario poco adecuado.

## Cómo mostrar Webmentions en tu sitio

Ahora que ya las estamos recolectando (o valiéndonos de un servicio para ello), tenemos que mostrarlas en algún sitio. Esto depende para cada sitio y de si has usado el servicio o no. Además esto es específico para Eleventy pero estoy seguro de que algunas partes serán de utilidad.

### Extrayendo las Webmentions de la API

Nuestro servicio ofrece una [API](https://github.com/aaronpk/webmention.io#api) que nos devuelve las menciones como JSON. Podemos obtener las menciones para una URL concreta (sin token) u obtener todo lo asociado con un dominio concreto (con token).

Eleventy tiene muchas funciones chulas y una de ellas son los [ficheros de datos](https://www.11ty.dev/docs/data-js/#using-js-data-files) que nos permiten definir una función asíncrona para obtener datos. La idea es traernos las menciones y exponerlas en la plantilla a la hora de generar el sitio.

Simplificando un poco, la parte principal es esta.

```js
// _data/webmentions.js
const ENDPOINT = 'https://webmention.io/api';
const TOKEN = process.env.WEBMENTION_IO_TOKEN;
const CACHE_FILE = `${CACHE_DIR}/webmentions.json`;

async function fetchWebmentions(since, perPage = 10000) {
  if (!TOKEN) {
    return false;
  }

  const url = new URL(`${ENDPOINT}/mentions.jf2`);

  url.searchParams.set('domain', hostname);
  url.searchParams.set('token', TOKEN);
  url.searchParams.set('per-page', perPage);

  if (since) {
    url.searchParams.set('per-page', since);
  }

  const response = await fetch(url);

  if (response.ok) {
    return response.json();
  }

  return null;
}
```

Es una llamada asíncrona a la ruta que nos facilita el servicio con su token y su dominio. El fichero [lo puedes ver en GitHub](https://github.com/LagunasPris/antonio-laguna/blob/master/src/_data/webmentions.js).

:::info Nota

Las diferencias que puedes encontrar en GitHub están enfocadas a hacer la función ejecutarse únicamente en producción, dar mejores errores y a tener una pequeña caché.

:::

Esto nos permite acceder a las Webmentions con simplemente usar `{% raw %}{{ webmentions }}{% endraw %}` dentro de Eleventy y tendrá las `1000` menciones más recientes.

### Filtrando menciones

Ahora que los datos están ahí, necesitamos filtrar esta gran colección de menciones (*ojalá*) para usar solo las de la página que estamos usando en cuestión. Además dentro de los datos tenemos diferentes tipos que querremos agrupar de formas diferentes como los *likes*, los *retweets* y las respuestas.

Webmention soporta (dentro de webmentions.io) los siguientes tipos de menciones:

* `in-reply-to`
* `like-of`
* `repost-of`
* `bookmark-of`
* `mention-of`
* `rsvp`

En mi caso solo hago uso de `in-reply-to`, `mention-of`, `like-of` y `repost-of` teniendo agrupados a `in-reply-to` y `mention-of` como *comentarios*.

Eleventy nos permite añadir [filtros](https://www.11ty.dev/docs/filters/) a nuestra web que nos vienen de perlas para lo que estamos buscando.

```js
const allowedTypes = {
  likes: ['like-of', 'like'],
  reposts: ['repost-of', 'repost'],
  comments: ['mention-of', 'in-reply-to', 'link', 'reply']
};
const allowedTypesValues = [
  'like-of',
  'like',
  'repost-of',
  'repost',
  'mention-of',
  'in-reply-to',
  'link',
  'reply'
];

function getType(mention) {
  return typeof mention['wm-property'] !== 'undefined'
    ? mention['wm-property']
    : mention.activity?.type;
}

function getAuthor(mention) {
  return mention.author || mention.data?.author;
}

function filteredWebmentions(webmentions) {
  return webmentions.children
    .filter(mention => {
      const type = getType(mention);
      const isAllowedType = allowedTypesValues.includes(type);
      const isNotPrivate = mention['wm-private'] !== true;

      return isAllowedType && isNotPrivate;
    });
}

function clean(entry) {
  if (entry.content) {
    let value = entry.content.text;

    if (entry.content.text.length > 280) {
      value = `${entry.content.text.substr(0, 280)}&hellip;`;
    }

    entry.content.value = value;
  }

  return entry;
}

function getLike(mention) {
  const author = getAuthor(mention);
  const mentionUrl = mention.url || mention.data?.url;

  return ({ author, mentionUrl });
}

module.exports = function webmentionsParser(webmentions) {
  const cleanedWebmentions = filteredWebmentions(webmentions)
    .sort((a, b) =>
      new Date(a.published || a['wm-received']) -
      new Date(b.published || b['wm-received'])
    )
    .map(clean);

  const likes = cleanedWebmentions
    .filter(mention => {
      const isLike = allowedTypes.likes.includes(getType(mention));
      const hasAuthor = !!getAuthor(mention);

      return isLike && hasAuthor;
    })
    .map(getLike);

  const reposts = cleanedWebmentions
    .filter(mention => {
      const isRepost = allowedTypes.reposts.includes(getType(mention));
      const hasAuthor = !!getAuthor(mention);

      return isRepost && hasAuthor;
    })
    .map(getLike);

  const comments = cleanedWebmentions
    .filter(mention => {
      const hasAuthor = !!getAuthor(mention);
      const isComment = allowedTypes.comments.includes(getType(mention));

      return hasAuthor && isComment;
    });

  return {
    total: cleanedWebmentions.length,
    likes,
    reposts,
    comments
  };
}
```

La función, aunque es larga, se puede resumir en lo siguiente:

1. Filtrar las menciones de la página actual y sacar los tipos que nos interesan.
2. Ordenarlas por fecha.
3. Recortar menciones largas.

Si has estado pendiente, verás que hay más tipos de los que he indicado anteriormente y verás que hay código seguro en ciertos aspectos. Esto ocurre porque el objeto que obtenemos de la ruta que nos devuelve TODAS las menciones es diferente del que nos devuelve las menciones para una página.

Todas las menciones:

```json
{
  "type": "entry",
  "author": {
    "type": "card",
    "name": "ado_k2 𝅙 😂",
    "photo": "https://webmention.io/avatar/pbs.twimg.com/0818e3dd3cb60de12d6ed5f2b8ec0f1b76787b8a7d52306abd64d0caf018c009.jpg",
    "url": "https://twitter.com/ado_k2"
  },
  "url": "https://twitter.com/ant_laguna/status/1375360119945490432#favorited-by-851035659838140416",
  "published": null,
  "wm-received": "2021-03-26T17:38:34Z",
  "wm-id": 1094018,
  "wm-source": "https://brid.gy/like/twitter/ant_laguna/1375360119945490432/851035659838140416",
  "wm-target": "https://antonio.laguna.es/posts/a%C3%B1adiendo-modo-oscuro-a-sitio-web-con-css-y-js/",
  "like-of": "https://antonio.laguna.es/posts/a%C3%B1adiendo-modo-oscuro-a-sitio-web-con-css-y-js/",
  "wm-property": "like-of",
  "wm-private": false
}
```

Menciones por página:

```json
{
  "source": "https://brid.gy/like/twitter/ant_laguna/1375360119945490432/851035659838140416",
  "verified": true,
  "verified_date": "2021-03-26T17:38:35+00:00",
  "id": 1094018,
  "private": false,
  "data": {
    "author": {
      "name": "ado_k2 𝅙 😂",
      "url": "https://twitter.com/ado_k2",
      "photo": "https://webmention.io/avatar/pbs.twimg.com/0818e3dd3cb60de12d6ed5f2b8ec0f1b76787b8a7d52306abd64d0caf018c009.jpg"
    },
    "url": "https://twitter.com/ant_laguna/status/1375360119945490432#favorited-by-851035659838140416",
    "name": null,
    "content": null,
    "published": null,
    "published_ts": null
  },
  "activity": {
    "type": "like",
    "sentence": "ado_k2 𝅙 😂 favorited a tweet https://antonio.laguna.es/posts/a%C3%B1adiendo-modo-oscuro-a-sitio-web-con-css-y-js/",
    "sentence_html": "<a href=\"https://twitter.com/ado_k2\">ado_k2 𝅙 😂</a> favorited a tweet <a href=\"https://antonio.laguna.es/posts/a%C3%B1adiendo-modo-oscuro-a-sitio-web-con-css-y-js/\">https://antonio.laguna.es/posts/a%C3%B1adiendo-modo-oscuro-a-sitio-web-con-css-y-js/</a>"
  },
  "target": "https://antonio.laguna.es/posts/a%C3%B1adiendo-modo-oscuro-a-sitio-web-con-css-y-js/"
}
```

Como ves, hay diferencias en cómo están las cosas distribuidas en el objeto pero hay suficientes similitudes como para que el código de uno pueda funcionar con el otro.

El HTML que vamos a usar es bastante estándar. Para poder reusarlo luego dentro de JavaScript está dentro de una [macro](https://mozilla.github.io/nunjucks/templating.html#macro). Este, por ejemplo, es el código para un *like*/*retweet*:

```html
<li class="mentions__element h-card{% if type %} mentions__element--{{ type }}{% endif %}">
  <a class="display--block u-url"
     href="{{ url }}"
     target="_blank"
     rel="noreferrer"
     title="Ver perfil de {{ author }}">
    <img
      src=""
      data-src="{{ image | default('/img/webmention-avatar-default.svg') }}"
      alt=""
      class="lazy mentions__image u-photo"
      loading="lazy"
      width="48"
      height="48"
    >
    <span class="p-author visually-hidden" aria-hidden="true">{{ author }}</span>
  </a>
</li>
```

En las imágenes, en caso de que no venga definimos una por defecto para no dejar un círculo ahí roto vacío aunque en mis pruebas nunca ha venido uno vacío.

![Captura de pantalla que muestra el resultado que quedará en mi web](/img/posts/vistazo-a-webmentions.jpg "El resultado final")

### Actualizando las menciones de forma dinámica

Dada la naturaleza de *sitio estático* de Eleventy, vamos a añadir un script que se encargue de descargar las menciones (si las hay) y mostrarlas en la web de manera dinámica usando JavaScript y el mismo código que hemos usado para renderizarlas con Eleventy.

Para ello nos vamos a valer del elemento `template` y de las macros que acabamos de definir:

```html
<template id="like-template">
  {% raw %}{{ mentions.likeElement() }}{% endraw %}
</template>
<template id="comment-template">
  {% raw %}{{ mentions.commentElement() }}{% endraw %}
</template>
```

No tienen datos algunos por lo que vendrán vacías (mejor) y ahora ya podremos usarlas desde JavaScript.

```js
const ENDPOINT = 'https://webmention.io/api/mentions?perPage=1000&jsonp=parseWebmentions';

(() => {
  const currentUrl = `https://antonio.laguna.es${location.pathname}`;
  const randomness = Math.random();
  const scriptPath = `${ENDPOINT}&target=${encodeURIComponent(currentUrl)}&_=${randomness}`;

  function parseWebMentions(data) {
    // TBD
  }

  if (currentUrl.includes('/posts/')) {
    const script = document.createElement('script');
    script.src = scriptPath;
    script.async = true;
    document.head.appendChild(script);

    window.parseWebmentions = parseWebmentions;
  }
})();
```

Este código se encarga de mirar si estamos dentro de `/posts/` para intentar descargar las menciones. A parte del parámetro `target` con la URL actual y un parámetro `_` con números aleatorios para evitar la caché, nos valemos del parámetro jsonp`. Esto permite poder invocar una función global para poder acceder a esta información dado que, por seguridad, no nos permiten acceder entre dominios pero sí que podemos usar JSONP para ello.

```js
function parseWebmentions(data) {
  const parsed = webmentionsHelpers({ children: data.links });

  if (parsed.total) {
    const count = document.querySelector(Selectors.Counts.Interactions);
    const likes = document.querySelector(Selectors.Counts.Likes);
    const retweets = document.querySelector(Selectors.Counts.Retweets);
    const comments = document.querySelector(Selectors.Counts.Comments);
    const likeTemplate = document.querySelector(Selectors.Templates.Like);
    const commentTemplate = document.querySelector(Selectors.Templates.Comment);

    const countText = parsed.total === 1 ? 'interacción' : 'interacciones';
    const unHide = [count];

    count.innerText = `${parsed.total} ${countText}`;

    processMention(parsed.likes, likes, likeTemplate, fillLike, unHide);
    processMention(parsed.reposts, retweets, likeTemplate, fillLike, unHide);
    processMention(parsed.comments, comments, commentTemplate, fillComment, unHide);

    unHide.forEach(el => el.classList.remove('hide'));
  }
}
```

La función `parseWebMentions` se encarga primero de llamar a los `webMentionHelpers` que definimos antes para *el servidor* (compartiendo código).
Luego, si hay alguna mención, empezará a mostrar cosas. Actualizará el contador e irá rellenando *likes*, *retweets* y comentarios con los `template`s que definimos antes.

Para no añadir mucho ruido, vamos a ver lo que hace `processMention` y `fillLike`. La función `fillComment` la puedes encontrar en [el código fuente original](https://github.com/LagunasPris/antonio-laguna/blob/master/src/js/webmentions.js) y es simplemente un *poco* más larga.

```js
function fillLike(template, vals) {
  const author = vals.author ? vals.author : {};
  const link = template.querySelector('.u-url');

  template.querySelector('.u-photo').dataset.src = author.photo || DEFAULT_AVATAR;
  link.href = vals.mentionUrl;
  link.title = `Ver perfil de ${author.name}`;
  template.querySelector('.p-author').innerHTML = author.name;
}

function processMention(mentions, element, template, filler, unHide) {
  if (mentions.length) {
    const parent = element.parentElement.parentElement;
    const list = parent.querySelector('.mentions__list');

    element.innerText = mentions.length;
    list.innerHTML = '';
    mentions.forEach(like => {
      const t = template.content.cloneNode(true);
      filler(t, like);
      list.appendChild(t);
    });

    unHide.push(parent);
  }
}
```

La función está hecha como algo genérico que se encarga de clonar la plantilla que le pasamos e ir creando hijos por cada mención que recibamos. Como ves, para rellenar un *me gusta* simplemente vamos cogiendo las partes del código que necesitamos (foto y enlace) y les damos valor con lo que la mención nos ofrece.

## Enviando menciones webs a otros sitios

Esta es la última parte (pero no por ello menos importante) de lo que vamos a crear.

[Remy Sharp](https://remysharp.com/) creador de [Nodemon](https://www.npmjs.com/package/nodemon) (entre otras cosas) ha creado [Webmention.app](https://webmention.app/) que se encarga de esta gestión por nosotros.

Por suerte, gestionarlo con Netlify es muy sencillo [tal y como explica la aplicación](https://webmention.app/docs#how-to-integrate-with-netlify).

Con solo añadir un *hook* una vez que se haya terminado de desplegar, tenemos ya notificado a todo el mundo.

---

Espero que, si has terminado de leer esto, tengas una idea más clara sobre lo que son las Webmentions y una ligera idea (al menos) sobre cómo implementarlas en tu sitio. Pensé que esto iba a ser mucho más complejo pero he tenido grandes maestras y maestros que me han echado una mano en este camino:

* "[Grow the IndieWeb with Webmentions](https://amberwilson.co.uk/blog/grow-the-indieweb-with-webmentions/)" de Amber Wilson.
* "[An In-Depth Tutorial of Webmentions + Eleventy](https://sia.codes/posts/webmentions-eleventy-in-depth/)" de Sia Karamalegos.
* "[No comment: Adding Webmentions to my site](https://lukeb.co.uk/blog/2021/03/15/no-comment-adding-webmentions-to-my-site/)" de Luke Bonnacorsi.

¿Sabes cuál es la parte chula? ¡Que estos tres enlaces aparecerán en esas páginas que me han ayudado!

*[GDPR]: General Data Protection Regulation
*[W3C]: World Wide Web Consortium
*[XML]: Extensible Markup Language
*[API]: Application Programming Interface
*[HTML]: HyperText Markup Language
