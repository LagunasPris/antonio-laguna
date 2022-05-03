---
title: Introducción a las propiedades personalizadas o variables en CSS
description: Veamos qué nos ofrecen las custom properties en CSS y cómo interactúan con la cascada.
date: 2021-07-27
tags:
  - CSS
postTweet: '1419919817197465601'
---

Ahora que cada vez hay más cosas de las que usamos que ya no dan soporte a IE11 como [Wordpress](https://make.wordpress.org/core/2021/04/22/ie-11-support-phase-out-plan/), [Angular](https://github.com/angular/angular/issues/41840), [Bootstrap](https://blog.getbootstrap.com/2020/06/16/bootstrap-5-alpha/) o [GitHub](https://help.github.com/en/github/getting-started-with-github/supported-browsers) por nombrar algunos, me parece un buen momento para echar un vistazo a lo que las CSS custom properties o propiedades personalizadas de CSS o variables en CSS nos pueden ofrecer.

## Pero... ¿qué son las custom properties?

Como has leído antes, tienen varios nombres. Las variables se definen abriendo un bloque e iniciando cualquier cadena con dos guiones. Al definirlas en CSS tienen esta forma:

```css
:root {
  --my-custom-property: 'Hola Mundo!';
}
```

Quizá te estés preguntando qué es `:root`. Es el _componente raíz_. Definir variables ahí hace que estén disponibles **para toda la cascada**.

Aunque hemos tenido variables de algún tipo con pre y post procesadores como Less, Sass o PostCSS, esas variables quedaban transformadas en algún punto del proceso. Entonces, ¿qué es lo que es tan genial de las custom properties? Bueno, para empezar no necesitan Webpack ni ningún pre/post procesador, siguen la cascada de CSS y además se pueden actualizar a través de JS en el navegador.

Mientras que no necesitar sistema de procesamiento es fácil de entender, el resto puede ser quizá un poco más complejo.

Veamos qué las hace tan increíbles.

## Qué podemos hacer

Echando la vista atrás, la gente tiene diferentes relaciones con la cascada en CSS. Algunas personas la odian y otros la aman. Es una parte inherente de CSS. Veamos cómo nos son útiles en la cascada:

```css
.main {
  --custom-color: red;
}

.block {
  background-color: var(--custom-color, rebeccapurple);
}

.sidebar {
  --custom-color: blue;
}
```

¿De qué color será `.block`? Dado que la propiedad tiene cascada, si `.block` está dentro de `.sidebar` heredará el color `blue` que se definió en su ancestro más cercano. Si `.block` aparece en `.main` cogerá el color que se especifica ahí que es `red`. ¡Cambios basados en el contexto sin necesitar selectores!

Quizá te hayas dado cuenta de que en `.block` hay dos valores dentro de `var`. Este segundo valor (opcional) nos permite definir un valor por defecto en caso de que no haya ninguno definido. En este caso, si `.block` no está anidad en ningún otro elemento que de valor a `--custom-color` usará el que está definido ahí, `rebeccapurple` en este caso.

<style>
.block-colors-demo .top{display:flex;flex-wrap:wrap;gap:1rem;margin-bottom:1rem}.block-colors-demo .block{background-color:var(--custom-color, rebeccapurple);height:5rem;border-radius:.5rem;border-style:solid;border-width:.125rem}.block-colors-demo .block::after{content:'.block';display:block;font-family:"Fira Code",monospace;line-height:5rem;font-size:1.6rem;text-align:center;width:100%}.block-colors-demo .main{--custom-color:red;width:100%}.block-colors-demo .sidebar{--custom-color:blue;width:100%}.block-colors-demo .main,.block-colors-demo .sidebar{margin-bottom:1rem}.block-colors-demo .sidebar .block::after{content:'.sidebar > .block'}.block-colors-demo .main .block::after{content:'.main > .block'}@media (min-width:60em){.block-colors-demo .top{flex-wrap:nowrap}.block-colors-demo .main,.block-colors-demo .sidebar{margin-bottom:0}.block-colors-demo .main{width:60%}.block-colors-demo .sidebar{width:40%}}
</style>

<div class="block-colors-demo"><div class="top"><div class="main"><div class="block"></div></div><div class="sidebar"><div class="block"></div></div></div><div class="footer"><div class="block"></div></div></div>


:::info Nota

Puedes anidar valores por defecto por lo que podrías tener múltiples valores que usar en caso de que fallen.

:::

Todo esto está bastante guay, pero podemos añadir reglas basadas en otros cambios de contexto:

```css
body {
  background-color: var(--color-background, white);
  color: var(--color-text, black);
}

@media screen and (prefers-color-scheme: dark) {
  body {
    --color-text: white;
    --color-background: black;
  }
}
```

Usando media queries, podemos cambiar el valor de nuestras propiedades. En este caso, para dar soporte al modo oscuro. Aquí tenemos un único selector pero imagina cambiar todos los elementos del diseño simplemente actualizando las variables que usan. Con esos conceptos podemos hacer cosas como plantillas, sistemas de diseño y componentes reusables de forma sencilla.

Subamos un último peldaño y vamos a ver cómo podemos hacer una rejilla y pongamos todo en práctica. El código tiene comentarios para ver cómo están las cosas.

```scss
// Variables globales para todos
// Aquí estarían los colores, fuentes, etc.
:root {
	--color-primary-hue: 30;
}

.grid {
	// Propiedades disponibles para los elementos .item
	--grid-column-width: 1fr;
	--grid-column-count: 4;
	--grid-gap: 1.25rem;

	@media (min-width: 60em) {
		--grid-column-count: 8;
	}

	@media (min-width: 80em) {
		--grid-gap: 2.5rem;
		--grid-column-count: 12;
	}

	display: grid;
	grid-gap: var(--grid-gap);
	grid-template-columns: repeat(var(--grid-column-count), var(--grid-column-width));

	// Podemos repetir propiedades personalizadas donde queramos
	// En este caso combinando con calc podríamos hacer más cosas
	padding-left: var(--grid-gap);
	padding-right: var(--grid-gap);
	margin-left: auto;
	margin-right: auto;
	max-width: 90rem;
}

.item {
	// Vamos a calcular la saturación basándonos en la posición del elemento
	// Dado que solo manipulamos por elemento, tiene sentido definirlo aquí
	--saturation: calc(var(--index) * (100 / var(--items)) * 1%);

	// Puedes usar custom properties como parte de un valor como en HSL
	// Observa que estamos usando una variable global ( temas )
	background: hsl(var(--color-primary-hue), var(--saturation), 40%);
	border-color: hsl(var(--color-primary-hue), var(--saturation), 50%);

	height: 3rem;
	border-radius: 0.5rem;
	border-style: solid;
	border-width: 0.125rem;

	// Las columnas de la grid se establecen aquí y se actualizan con clases (mira abajo)
	// Estamos usando un valor por defecto en caso de que no tengan un valor
	grid-column: span var(--span, var(--grid-column-count));
}

.item--half {
	@media (min-width: 60em) {
		--span: 4;
	}

	@media (min-width: 80em) {
		--span: 6;
	}
}

.item--third {
	@media (min-width: 80em) {
		--span: 4;
	}
}

.item--fourth {
	@media (min-width: 60em) {
		--span: 2;
	}

	@media (min-width: 80em) {
		--span: 3;
	}
}
```

Y este sería el resultado. Si estás en un escritorio te animo a ajustar el tamaño de tu pantalla y si estás en otro entorno ¡visítala en escritorio!

<style>
.article-grid-demo{--color-primary-hue:30}.article-grid-demo .grid{--grid-column-width:1fr;--grid-column-count:4;--grid-gap:1.25rem;display:grid;grid-gap:var(--grid-gap);grid-template-columns:repeat(var(--grid-column-count),var(--grid-column-width));margin-left:auto;margin-right:auto;max-width:90rem;padding-left:var(--grid-gap);padding-right:var(--grid-gap)}.article-grid-demo .item{--saturation:calc(var(--index) * (100 / var(--items)) * 1%);background:hsl(var(--color-primary-hue),var(--saturation),40%);border-color:hsl(var(--color-primary-hue),var(--saturation),50%);border-radius:.5rem;border-style:solid;border-width:.125rem;grid-column:span var(--span, var(--grid-column-count));height:3rem}@media (min-width:60em){.article-grid-demo .grid{--grid-column-count:8}.article-grid-demo .item--half{--span:4}.article-grid-demo .item--fourth{--span:2}}@media (min-width:80em){.article-grid-demo .grid{--grid-gap:2.5rem;--grid-column-count:12}.article-grid-demo .item--half{--span:6}.article-grid-demo .item--third{--span:4}.article-grid-demo .item--fourth{--span:3}}
</style>

<div class="article-grid-demo"><div class="grid" style="--items: 12;"><div style="--index: 0;" class="item"></div><div style="--index: 1;" class="item item--half"></div><div style="--index: 2;" class="item item--half"></div><div style="--index: 3;" class="item item--third"></div><div style="--index: 4;" class="item item--third"></div><div style="--index: 5;" class="item item--third"></div><div style="--index: 6;" class="item item--fourth"></div><div style="--index: 7;" class="item item--fourth"></div><div style="--index: 8;" class="item item--fourth"></div><div style="--index: 9;" class="item item--fourth"></div><div style="--index: 10;" class="item"></div><div style="--index: 11;" class="item"></div></div></div>

## En resumen

Estos son algunos de los poderes que la custom properties nos ofrecen. Conforme las tecnologías avancen y los navegadores mejoren, vamos a tener muchas más opciones.

En el siguiente artículo vemos cómo podemos usar estas propiedades con JavaScript lo cual nos da aún más opciones a la hora de nuevos trucos e interacciones: [El potencial de las CSS Custom Properties: son dinámicas](/posts/potencial-css-custom-properties-dinamicas/).

Más recursos:

* [Noe Medina](https://twitter.com/n03m1ms) escribió este genial artículo: [¿Por qué usar las variables nativas de CSS?](https://www.paradigmadigital.com/dev/por-que-usar-variables-css/).

*[CSS]: Cascade Style Sheet
