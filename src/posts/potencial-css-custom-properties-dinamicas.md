---
title: 'El potencial de las CSS Custom Properties: son dinámicas'
description: Descubre cómo podemos usar las custom properties de forma dinámica y con JavaScript
date: 2022-05-03
tags:
  - CSS
  - JS
postTweet:
---

En el anterior artículo sobre custom properties: [Introducción a las propiedades personalizadas o variables en CSS](/posts/introduccion-css-propiedades-personalizadas/), aprendimos las cosas que podíamos hacer *sólo* con CSS. Cómo podíamos usar ella cascada, cambiarlas con media queries, tener valores por defecto y combinarlas con `calc()` por ejemplo.

No obstante, hay algo más que podemos lograr con ellas y que no podíamos hacer hasta ahora: interactuar con JavaScript.

## Jugando con colores

He estado aprendiendo mucho sobre colores últimamente, espero poder escribir más sobre ello. Una de las cosas que podemos hacer con las custom properties es jugar con los colores. En el artículo anterior ya vimos algo parecido con `hsl()`.

Vamos a darle una vuelta más de tuerca y vamos a añadir JavaScript a la mezcla:

<style>.demo__swatch{background-color:hsl(var(--hue,0),100%,50%);border-radius:200px;height:200px;margin: 0 auto;position:relative;transition:background-color .3s;width:200px}.demo__seconds{background-color:#000;border:.125rem solid #fff;border-radius:200px;height:50%;left:50%;position:absolute;transform:translateX(-50%) rotate(calc(var(--hue, 0)*1deg));transform-origin:bottom;transition:transform 1s linear;width:.25rem}.demo__seconds:after{-webkit-text-stroke-width:1px;-webkit-text-stroke-color:#000;color:#fff;content:var(--rotation,"0deg");font-size:1.25rem;font-weight:bold;left:0;letter-spacing:.5rem;position:absolute;text-align:center;top:0;transform:rotate(-90deg) translate(-34%,-250%);width:100px}</style>

<div class="demo bleed"><div class="demo__swatch"><div class="demo__seconds"></div></div><div class="demo__buttons"><button class="article__body__button" id="swatch-start">Empezar</button><button class="article__body__button" id="swatch-pause">Parar</button></div></div>

<script>
const e=document.querySelector(".demo__swatch");let t=!1,n=null,c=0;document.getElementById("swatch-start").addEventListener("click",()=>{t||(t=!0,n=setInterval(()=>{c+=6,c>=360&&(c=0),e.style.setProperty("--hue",c),e.style.setProperty("--rotation",`"${c}deg"`)},1e3))}),document.getElementById("swatch-pause").addEventListener("click",()=>{t&&(t=!1,clearInterval(n))})
</script>

El código HTML aquí es bastante escueto:

```html
<div class="swatch">
	<div class="seconds"></div>
</div>
```

Tenemos una `div` para la forma circular y otra que actúe de segundero.

Con los estilos tenemos esta base:

```css
.swatch {
  background-color: hsl(var(--hue, 0), 100%, 50%);
}

.seconds {
  transform:
	  translateX(-50%)
	  rotate(calc(var(--hue, 0) * 1deg));
  transform-origin: bottom;
  transition: transform 1s linear;

  &::after {
    content: var(--rotation, '0deg');
  }
}
```

:::info Nota

El código está simplificado pero puedes inspeccionarlos con el navegador para ver el resto de estilos.

:::

Como ves, estamos usando un par de variables, una llamada `hue` que nos va a servir para el tono del color y otra, `--rotation` para la rotación. En la notación HSL, el tono va de 0 a 360 ( los grados de una circunferencia ) por lo que si vamos rotando, veremos toda la gama de colores.

La variable `--hue` es un número, gracias a `calc()` podemos transformarlas a grados.

Con JavaScript hacemos que el reloj funcione:

```js
const swatch = document.querySelector('.swatch');
let hue = 0;

setInterval(() => {
  hue += 6;

  if (hue >= 360) {
    hue = 0;
  }

  swatch.style.setProperty('--hue', hue);
  swatch.style.setProperty('--rotation', `"${hue}deg"`);
}, 1000);
```

Dado que quería hacer una especie de reloj, dividimos los 360 grados entre 60 segundos de un minuto y tenemos el intervalo de `6`. Dado que, lamentablemente, no podemos crear cadenas, la variable `--rotation` la creamos como tal para poder mostrar los grados en la aguja, si no quisiéramos esto, con la variable `hue` tenemos todo cubierto.

## Efectos especiales con el cursor

Aunque no nos hacen falta estrictamente las custom properties aquí, podemos valernos de ellas para coordinar efectos basados en el movimiento del cursor, simplificando el JavaScript necesario:

<style>
  .demo__letter{display:inline-flex;justify-content:center;align-items:center;position:relative;transform:translateX(calc(var(--x, 0) * -1px)) translateY(calc(var(--y, 0) * -1px)) translateZ(0);width:12.5rem;height:12.5rem}.demo__letter,.demo__letter::after{transition:transform .3s}.demo__letter::after{--distance:-.75px;content:attr(data-letter);-webkit-text-stroke-width:0.125rem;-webkit-text-stroke-color:var(--color-light);color:transparent;left:50%;position:absolute;transform:translateX(-50%) translateY(-50%) translateX(calc(var(--x, 0) * var(--distance))) translateY(calc(var(--y, 0) * var(--distance))) translateZ(0);top:50%}.demo__letter__container{display:inline-flex;font-size:4.5rem;font-weight:700}
</style>

<div class="demo bleed text--center"><div class="demo__letter__container"><span class="demo__letter" data-letter="A">A</span></div><p class="text-level--6"><em>¡Hazme Hover!</em></p></div>

<script>
"use strict";window.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".demo__letter__container"),t=Math.floor(e.offsetWidth/2),o=Math.floor(e.offsetHeight/2),r=(e,t,o)=>Math.min(Math.max(e,t),o);e.addEventListener("mousemove",s=>{requestAnimationFrame(()=>{e.style.setProperty("--x",r(s.offsetX-t,-30,30)),e.style.setProperty("--y",r(s.offsetY-o,-30,30))})}),e.addEventListener("mouseleave",()=>{requestAnimationFrame(()=>{e.style.setProperty("--x",0),e.style.setProperty("--y",0)})})})
</script>

Empecemos otra vez con el código HTML que vuelve a ser mínimo:

```html
<div class="letter__container">
  <span class="letter" data-letter="A">A</span>
</div>
```

Tenemos un contenedor y una letra, en este caso es la `A`. El atributo `data-letter` lo vamos a usar para duplicar la letra.

Ahora vamos a darle algo de estilos:

```css
.letter {
  transform:
      translateX(calc(var(--x, 0) * -1px))
      translateY(calc(var(--y, 0) * -1px));
}

.letter,
.letter::after {
  transition: transform .3s;
}

.letter::after {
  --distance: -0.75px;
  content: attr(data-letter);
  left: 50%;
  position: absolute;
  transform:
    translateX(-50%)
    translateY(-50%)
    translateX(calc(var(--x, 0) * var(--distance)))
    translateY(calc(var(--y, 0) * var(--distance)));
  top: 50%;
}
```

Como ves, con `::after` estamos generando la misma letra que queda detrás de la letra que hemos escrito. Está posicionada de manera absoluta quedando en el mismo sitio exacto que la actual.

Hay 3 variables importantes:

* `--x`: Dónde queremos desplazar en el eje X.
* `--y`: Dónde queremos desplazar en el eje Y.
* `--distance`: La distancia a la que queremos que se separe la _pseudoletra_.

Te animo a abrir el inspector y cambiarle el valor a cosas como `4px` o `-2px` para que veas la diferencia.

Ahora, vamos a añadirle el JS necesario:

```js
const letter = document.querySelector('.letter__container');
const originX = Math.floor(letter.offsetWidth / 2);
const originY = Math.floor(letter.offsetHeight / 2);
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

letter.addEventListener('mousemove', event => {
  requestAnimationFrame(() => {
    letter.style.setProperty('--x', clamp(event.offsetX - originX, -30, 30));
    letter.style.setProperty('--y', clamp(event.offsetY - originY, -30, 30));
  });
});

letter.addEventListener('mouseleave', () => {
  requestAnimationFrame(() => {
    letter.style.setProperty('--x', 0);
    letter.style.setProperty('--y', 0);
  });
});
```

Vamos por partes. Lo primero que hacemos es coger el elemento que contiene la letra y de ahí sacamos el centro de la caja dividiendo su ancho y su alto entre dos. De esa manera, al mover el cursor, sabremos en qué punto estamos tanto vertical como horizontalmente.

Con el evento `mousemove` nos encargamos de asignar `--x`, e `--y` a la diferencia entre el centro (que acabamos de calcular) y el puntero. Para que la letra no se mueva mucho, limitamos el movimiento a ± 30 de manera que no la perdamos de vista.

Si el cursor abandona la caja, reseteamos las variables a `0` para que la letra vuelva a su posición original.

## Conclusión

Aunque a menudo usamos las variables como valores estáticos y ofrecer una guía de estilos que podamos reutilizar, también podemos valernos de su dinamismo para conseguir facilitarnos el trabajo.

En estas dos demos hemos visto cómo crear relaciones entre dos o más elementos y aplicar transiciones / transformaciones relativas entre sí.

*[CSS]: Cascade Style Sheet
*[HTML]: HyperText Markup Language
*[JS]: JavaScript
