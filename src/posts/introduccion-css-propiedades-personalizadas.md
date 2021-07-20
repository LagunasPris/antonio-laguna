---
title: Introducción a las propiedades personalizadas o variables en CSS 
description: 
date: 2021-07-18
tags:
  - CSS
---

Ahora que cada vez hay más cosas de las que usamos que ya no dan soporte a IE11 como [Wordpress](https://make.wordpress.org/core/2021/04/22/ie-11-support-phase-out-plan/), [Angular](https://github.com/angular/angular/issues/41840), [Bootstrap](https://blog.getbootstrap.com/2020/06/16/bootstrap-5-alpha/) o [GitHub](https://help.github.com/en/github/getting-started-with-github/supported-browsers) por nombrar algunos, me parece un buen momento para echar un vistazo a lo que las CSS custom properties o propiedades personalizadas de CSS o variables en CSS nos pueden ofrecer.

## Pero... ¿qué son las custom properties?

Como has leído antes, tienen varios nombres. Al definirlas en CSS tienen esta forma:

```css
:root {
  --my-custom-property: 'Hola Mundo!';
}
```

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

:::info Nota

Puedes anidar valores por defecto por lo que podrías tener múltiples valores que usar en caso de que fallen.

:::

Todo esto está bastante guay pero podemos añadir reglas basadas en otros cambios de contexto:

```css
body {
  color: var(--color-text, black);
  background-color: var(--color-background, white);
}

@media screen and (prefers-color-scheme: dark) {
  body {
    --color-text: white;
    --color-background: black;
  }
}
```

Usando media queries, podemos cambiar el valor de nuestras propiedades. En este caso, para dar soporte al modo oscuro. Aquí tenemos un único selector pero imagina cambiar todos los elementos del diseño simplemente actualizando las variables que usan. Con esos conceptos podemos hacer cosas como plantillas, sistemas de diseño y componentes reusables de forma sencilla.

Subamos un último peldaño: