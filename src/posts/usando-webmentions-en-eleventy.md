---
title: Usando Webmentions en Eleventy
description: ¿Sabías qué son las Webmentions? Yo tampoco. Acompáñame a descubrir qué código necesitamos para mostrarlas en la web y cómo mandar nuestras menciones.
date: 2021-03-24
tags:
  - CSS
  - JS
  - Tutorial
enableToc: true
---

En mi ¡Hola Mundo! comentaba que quería añadir un sistema de comentarios. Estuve pensando en varios. Los comento (¿lo pillas?) por si a alguien les viene bien para su página personal. 

* [Utterances](https://utteranc.es/). Es probablemente mi segundo favorito. Se basa en incidencias en un repositorio de GitHub. Teniendo en cuenta que mi página ya está en GitHub de forma pública, creo que tiene sentido.
* [Commento](https://commento.io/). Un sistema más tradicional pero con un fuerte componente de privacidad. Tal y como ellos destacan, no son gratuitos por diseño. 

Cuando usas un sistema como Disqus que es gratuito, estás pagando con la privacidad de tus usuarios. Mi objetivo con esta web es no necesitar poner el aviso de la GDPR. 

Cacharreando por la web me encontré las Webmentions o Menciones web y supe rápidamente que era eso lo que quería implementar.

## ¿Qué son las Webmentions?

Las [Webmentions](https://indieweb.org/Webmention) son un estándar abierto sobre las reacciones a algo en la web. Se encuentran en estado de recomendación por la W3C y es parte del [movimiento IndieWeb](https://indieweb.org/). Cuando enlazas a un sitio, puedes enviarle una Webmention para notificarlo.

Si llevas ya tiempo en esto de la web, quizá te suenen los [pingbacks](https://es.wikipedia.org/wiki/Pingback) que WordPress popularizó pero Webmention (aparte de pretender ser un estándar) no se basa en XML si no en POST y contiene más información que un *ping*. Nos indican si son un *me gusta*, *compartir* o un *comentario*. 

## Cómo añadir Webmentions a tu sitio

En pocas palabras y resumiendo mucho, necesitamos seguir 3 pasos  para añadir Webmentions a nuestra web.

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

¡Ya podemos recibir menciones!

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

Esto nos permite acceder a las Webmentions con simplemente usar `{{ webmentions }}` dentro de Eleventy.

*[GDPR]: General Data Protection Regulation
*[W3C]: World Wide Web Consortium
*[XML]: Extensible Markup Language
*[API]: Application Programming Interface