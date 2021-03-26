---
title: Añadiendo modo oscuro a sitio web con CSS y JS
description: Aprende a añadir un botón para cambiar entre modo oscuro y modo luminoso en tu web de forma accesible con JS y custom properties de CSS.
date: 2021-03-24
tags:
  - CSS
  - JS
  - Tutorial
---

Ya lo comentaba en [Hola Mundo](/posts/hola-mundo)... El modo oscuro ~~está~~ estaba en mi lista de tareas pendientes para añadir al blog. Hoy vamos a ver cómo añadirlo.

Implementarlo me ha llevado más de la cuenta. Más que nada porque soy **un ansias**. ¿Has visto alguna vez esa escena de *Malcolm in the Middle* de Hal cambiando la bombilla? ¿No? Venga, espero que la veas:

https://www.youtube.com/watch?v=AbSehcT19u0

Pues así como Hal me he visto día tras día. Hice una pequeña prueba de concepto que me gustó cómo quedaba. Los colores quedaban bien y todo era fantástico pero empecé a reliarme yo sólo.
¿Quieres echar vistazo? Aquí tienes la *[pull request](https://github.com/LagunasPris/antonio-laguna/pull/1)*. Aun así, los listo:

* Cambio de colores.
* Añadir un pequeño botón para cambiar el tema a tu gusto.
* Cambiar de Sass a [PostCSS](https://github.com/postcss) 🙈.
* Enseñarle al [plugin de tweets](https://github.com/gfscott/eleventy-plugin-embed-twitter/pull/17) nuevos trucos para:
	* Usar el parámetro `doNotTrack` y evitar así seguimiento de usuarios.
	* Poder pasarle un `theme`.
	* Poder **no incluir** el script de Twitter.
* Re-escribir el script de twitter para que, si cambio el tema con el botón, el tweet cambie de color.

Pero bueno, vamos al lío que me conozco.

## Consideraciones previas

El modo oscuro es una cosa que se ha puesto de moda y que, tanto Apple como Google, han ayudado a estandarizarlo. Personalmente soy un fan del modo oscuro.

No obstante, creo que hay que considerar más allá del cambiarlo todo a negro.

Estas son las cosas que tuve en cuenta:

* Evitar el negro puro: El contraste que crean el negro y el blanco uno sobre otro es complejo de ver. Me gusta mucho cómo lo hace Twitter y además ya contaba con azules en el tema.
* Mantener la accesibilidad. Los colores eran completamente accesibles hasta el [estándar AAA](https://www.w3.org/WAI/WCAG2AAA-Conformance.html).
* Permitir que el usuario cambie el tema a su antojo. Por defecto, si tienes activado el modo oscuro en tu sistema operativo, verás el modo oscuro y si no has tocado nada, verás el modo claro pero **tú decides** con qué te quedas.
* Evitar cambiar todo lo oscuro por algo claro. Una sombra blanca quedaba como un hachazo en los ojos. Opté por una completamente negra.

![Imagen que ilustra una imagen que tiene una sombra blanca sobre fondo oscuro](/img/posts/sombra-blanca-modo-oscuro.jpg "_El meta-horror_")

* Aprovechar para bajar la intensidad en las imágenes.

## El CSS

Primero vamos a empezar pos los estilos, que creo que es lo más importante. Lo que hacemos es valernos de las [propiedades personalizadas](https://developer.mozilla.org/es/docs/Web/CSS/Using_CSS_custom_properties) que nos ofrece CSS y que, además, cuentan con [un soporte](https://caniuse.com/css-variables) más que decente.

En mi caso el estilo original era tal que así:

```css
:root {
  --color-background: #fff;
  --color-text: #333;
  --color-accent: #dc7202;
  --color-selection: #003049;
  --color-selection-text: #fff;
  --color-callout: #f3fbff;
  --color-shadow: rgba(0, 0, 0, .3);
}
```

Lo siguiente que hacemos es cambiar esos colores en los selectores necesarios por las variables que acabamos de crear:

```css
::selection {
  background: var(--color-selection);
  color: var(--color-selection-text);
}

body {
  background-color: var(--color-background);
  transition: background-color .35s;
}

body,
.color--body {
  color: var(--color-text);
}

.color--primary {
  color: var(--color-selection);
}

.color--secondary {
  color: var(--color-accent);
}

a:hover {
  color: var(--color-accent);
  text-decoration-color: var(--color-accent);
}

.callout {
  background-color: var(--color-callout);
  border-left: 4px solid var(--color-selection);

  &__icon {
    background-color: var(--color-selection);
  }
}
```

Con esto ya podemos alterar el tema usando la media query `prefers-color-scheme` con algo así:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #001a27;
    --color-text: #fff;
    --color-accent: #fd8303;
    --color-selection: #fcbf49;
    --color-selection-text: #333;
    --color-callout: #00486b;
    --color-shadow: rgba(0, 0, 0, 1);
  }
}
```

Y con esto, a priori ya estaría. No obstante, esto no le deja al usuario elegir. Vamos a arreglarlo:

```css/0
[data-theme='dark'] {
  --color-background: #001a27;
  --color-text: #fff;
  --color-accent: #fd8303;
  --color-selection: #fcbf49;
  --color-selection-text: #333;
  --color-callout: #00486b;
  --color-shadow: rgba(0, 0, 0, 1);
}
```

Cambiamos nuestra *media query* y nuestro `:root` por este selector. Ahora veremos cómo lo utilizamos.

La última pincelada se la doy a las imágenes a las que les vamos a bajar la luz on poco pero si pasamos el ratón por encima las vemos normal:

````css
img {
  filter: brightness(.8) contrast(1.2);
  transition: filter .3s;

  &:hover {
    filter: brightness(1) contrast(1);
  }
}
````

## El botón de cambio

La siguiente parte que nos ocupa es la de añadir un botón que nos permita cambiar esto. Hay gente que enfoca esto como un `checkbox` que indicaría si el modo oscuro está activado o no. He preferido usar un botón que indique la acción que va a realizar.

El marcado creo que es sencillo:

```html
<button class="color-scheme-toggler" type="button" aria-label="Cambiar a modo oscuro">
  <span
    class="color-scheme-toggler__icon color-scheme-toggler__icon--light"
    aria-hidden="true">
    🌝
  </span>
  <span
    class="color-scheme-toggler__icon color-scheme-toggler__icon--dark"
    aria-hidden="true">
    🌚
  </span>
</button>
```

Para hacer las cosas *bien*, tenemos un botón de tipo `button` y con un atributo `aria-label` que nos indica qué va a pasar si pulsamos el botón. En este caso, vamos a "Cambiar a modo oscuro". Un usuario de lector de pantalla no necesita que se le lean los emojis que ahí hemos usados así que los dejamos ocultos para ellos.

Los estilos para este botón son los siguientes:

```css/11,15,21
.color-scheme-toggler {
  appearance: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  margin-left: .5rem;
  padding: 0;
  transition: text-shadow .3s;
  width: 4.5rem;

  &__icon--light {
    display: none;
  }

  &:hover {
    text-shadow: 0 0 .5rem var(--color-text);
  }
}

[data-theme='dark'] {
  .color-scheme-toggler__icon--light {
    display: block;
  }
}
```

Si te has fijado bien, hemos puesto en una pequeña sombra en `hover` para que las lunas cojan el color del texto: blanco en el modo oscuro, y gris oscuro en el modo claro. Lo otro a destacar es que ocultamos los iconos según el modo que hayamos activado.

## El JavaScript

Todo lo que tenemos hasta ahora lamentablemente no funciona del todo. Necesitamos esa chispa para hacerlo funcionar. Vamos a ver cómo hacemos funcionar ese botón:

```js
const Themes = {
  Dark: 'dark',
  Light: 'light'
};
const ModeLabel = {
  dark: 'luminoso',
  light: 'oscuro'
};
const Key = 'theme';

const root = document.documentElement;
let currentTheme = root.dataset.theme;
const button = document.querySelector('.color-scheme-toggler');
const getLabel = () => `Cambiar a modo ${ModeLabel[currentTheme]}`;

const onButtonClick = () => {
  const newTheme = currentTheme === Themes.Dark
    ? Themes.Light
    : Themes.Dark;

  currentTheme = newTheme;
  root.dataset.theme = newTheme;
  localStorage.setItem(Key, newTheme);
  button.setAttribute('aria-label', getLabel());
};

button.setAttribute('aria-label', getLabel());
button.addEventListener('click', onButtonClick);
```

¿Recuerdas el `aria-label` del botón? Pues en cuanto carga la página lo vamos a dejar correctamente. Si el modo oscuro está activo dirá "cambiar a modo luminoso".

Luego escuchamos el evento `click` de nuestro botón y leemos el tema actual. ¿Es oscuro? Lo cambiamos a claro. ¿Es claro? Lo cambiamos a oscuro. Y esto lo vamos a guardar en `localStorage` para poder acceder a ello cuando el usuario recargue la página. El elemento `document.documentElement` es el mismo que las herramientas de desarrollador del navegador se llama `html` y no es otro que el `:root` en nuestro CSS. Así que ahora mismo ¡ya funciona nuestro selector!

> Pero Antonio, he recargado la página y no me carga el tema que había seleccionado anteriormente.

¡Toda la razón! Y es que nos falta un pequeño trozo de código.

```js
const userTheme = localStorage.getItem('theme');
const mediaTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? 'dark'
  : 'light';

document.documentElement.dataset.theme = userTheme
  ? userTheme
  : mediaTheme;
```

Con este pequeño fragmento, estamos mirando en `localStorage` si tenemos algo y le echamos un vistazo a las preferencias del usuario con `matchMedia` para ver qué prefiere. En el último operador ternario, damos preferencia a lo que el usuario haya escogido (es decir, lo que habíamos guardado en `localStorage`).

Es probable que si has añadido este fragmento sin más, y estés cargando tus scripts con `async`, `defer` o en el cierre de la etiqueta `body` (cosa que deberías) veas que los colores saltan de claro a oscuro si tienes el modo oscuro activado. A esto se lo conoce como FOUC. Para evitar esto, lo vamos a colocar en un script, justo antes de cargar el CSS.

:::info Atención

Ten en cuenta que los scripts en línea van a detener la ejecución del navegador durante unos instantes por lo que no es buena idea colocar muchas cosas ahí. Piensa en que estás sacrificando *unos preciosos milisegundos* cuanto menos.

:::

¡Y hasta aquí el artículo de hoy! Espero que hayas aprendido algo y, si a ti te ha servido de ayuda o crees que esto puede servir de ayuda a alguien, ¡te agradecería que lo compartieras!

*[CSS]: Cascade Style Sheet
*[Sass]: Syntactically Awesome Style Sheets
*[FOUC]: Flash of Unstyled Content
