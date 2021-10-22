---
title: Cómo conseguir un favicon dinámico para el modo oscuro
description: Pequeño truco con CSS para evitar saltos en las animaciones que se activan en hover.
date: 2021-10-20
tags:
  - JS
  - HTML
postTweet:
---

Ah... el modo oscuro. Hay tantos defensores como detractores. En el Front a veces nos vemos en la tesitura de dar soporte a esta característica de una forma u otra.

En este Fragmento vamos a ver algo muy particular y es, cómo tener un Favicon diferente para modo oscuro y modo claro. Y es que hay veces que el favicon de la web es muy minimalista. Mira este ejemplo real de la web de [iA Writer](https://ia.net/), el editor que uso para escribir mis artículos:

{% image 'comparacion-favicon-modo-oscuro_x2yzsl.jpg' 1280 90 'Dos pestañas abiertas una en modo oscuro y otra en modo claro. El favicon se lee iA en negro lo cual dificulta su visión en el modo oscuro.' 'Apenas podemos ver por contraste' %}

La solución podría pasar por poner un color sólido detrás (así está en mi web) pero por motivos estéticos hay ocasiones en las que no es una opción.

Veamos cómo resolverlo.

## El HTML

Antes de empezar asegúrate de que tienes  una versión para modo claro y otra para modo oscuro en ficheros diferentes.

En nuestro head, vamos a cambiar cómo definimos el favicon y vamos a añadirle un par de atributos `data`:

{% raw %}
```html
<link
  rel="icon"
  type="image/png"
  sizes="32x32"
  href="/ruta/al/fichero/favicon-32x32.png"
  data-href-light="/ruta/al/fichero/favicon-32x32.png"
  data-href-dark="/ruta/al/fichero/favicon-32x32-dark.png"
>

<link
  rel="icon"
  type="image/png"
  sizes="16x16"
  href="/ruta/al/fichero/favicon-16x16.png"
  data-href-light="/ruta/al/fichero/favicon-16x16.png"
  data-href-dark="/ruta/al/fichero/favicon-16x16-dark.png"
>
```
{% endraw %}

Como ves, hemos añadido `data-href-light` y `data-href-dark` a cada elemento `link` que nos define nuestro favicon. Por defecto dejaremos la opción clara que es la más común.

## Cambiando con JS

Ahora que ya tenemos todo preparado, veamos cómo hacer el cambio con JavaScript.

```js
(() => {
  if ('not-all' === window.matchMedia('(prefers-color-scheme').media) {
    // No hay soporte
    return;
  }

  // Media Query para Modo Oscuro
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  // Elementos Links para iconos
  const links = document.querySelectorAll('link[rel="icon"]');

  // Función para actualizar los iconos
  const updateIcon = () => {
    const isDark = mediaQuery.matches;
    const dataKey = isDark ? 'hrefDark' : 'hrefLight';

    Array.prototype.slice.call(links).forEach(link => {
      link.href = link.dataset[dataKey];
    });
  };

  // Si cambia la media query mientras está visitando, llamamos la función
  mediaQuery.addEventListener('change', updateIcon);
  updateIcon();
})();
```

Este pequeño fragmento se encarga de ejecutar una media-query para saber si el sistema está en modo oscuro o no y actualizar los iconos en función de esa información.

Como punto extra, usamos `addEventListener` por si el icono cambiara durante la visita del usuario. Hay opciones en los sistemas para poner este modo automático según la hora del día para ayudar a la vista.

Ahora tenemos dos opciones para colocar este código:

La primera opción es colocarlo con todo nuestro JavaScript que, por buenas prácticas se tendría que ejecutar al final del todo. El *problema* es que la gente que tenga modo oscuro verá el icono original **siempre** y luego cambiará cuando se ejecute JavaScript.

La segunda opción es la de meter todo este código **justo debajo** de la definición de los elementos `link`. De esta forma tendremos una minúscula porción de código bloqueando la página pero ganamos evitando que veamos ningún cambio en el icono mientras carga la página.

Para ello, lo recomendable es comprimirlo y transpilarlo. Te dejo aquí el fragmento:

```js
(function(){if("not-all"!==window.matchMedia("(prefers-color-scheme").media){var a=window.matchMedia("(prefers-color-scheme: dark)"),d=document.querySelectorAll('link[rel="icon"]'),c=function(){var e=a.matches?"hrefDark":"hrefLight";Array.prototype.slice.call(d).forEach(function(b){b.href=b.dataset[e]})};a.addEventListener("change",c);c()}})();
```

Este fragmento es lo mismo que hemos visto anteriormente pero pasado por [Babel](https://babeljs.io/repl) y por [Closure Compiler](https://closure-compiler.appspot.com/home) consiguiendo un 47% de reducción frente al fragmento original.
