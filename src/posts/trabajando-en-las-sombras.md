---
title: "Trabajando en las sombras"
description: Desde Julio hasta Octubre he tenido abandonado el blog, ¿te interesa saber algunas de las cosas que he ido haciendo? ¡Sigue leyendo!
date: 2021-10-12
tags:
  - Personal
---

En este tiempo que he estado ausente del blog, he estado haciendo algunas otras cosas que merecen la pena comentar, aparte de mi trabajo diario claro.

## Web personal

[José Luis Antúnez](https://twitter.com/jlantunez) me contactó a finales de Agosto para darle una vuelta a su web. Normalmente no hago trabajos aparte. Me gusta ser responsable con mi tiempo libre y dedicar tiempo a mi familia y a mí mismo. Sin embargo, la web de José Luis es muy interesante y he disfrutado mucho trabajando con él.

{% image 'https://res.cloudinary.com/antonio-laguna/image/upload/v1633692584/monograma-jose-luis-antunez_z6kgv1.png' 1112 634 'Monograma de José Luis con una J y una L' 'Monograma de la web' %}

Nos conocemos desde [WebSlides](https://webslides.tv/) y mantenemos el contacto de vez en cuando (ahora menos con la pandemia). Es una persona a la que admiro y respeto muchísimo así que nos pusimos manos a la obra con la web con mucho karma.

Hay muchas cosillas que he hecho en esa Web de las que me gustaría escribir una vez haya salido la web.

Hace una semana publicó un tweet para abrir el apetito:

https://twitter.com/jlantunez/status/1444611929851498498

A decir verdad, ver tanta repercusión me puso un poco nervioso. ¡Esperemos que cumplamos las expectativas!

## Código Abierto

Otra cosa que he estado haciendo es dedicar tiempo al código abierto.

### Quizes

Como parte de la experiencia que quiero crear para el [Curso de React](/curso-react/) he creado una librería con [Stencil](https://stenciljs.com/) para crear cuestionarios.

Muy simple y sencilla por ahora, ¡el tiempo dirá si acaba cogiendo tracción!

<div class="github-cards">
  <a href="https://github.com/Antonio-Laguna/Quizes" class="github-card">
    <h4 class="github-card__title">Quizes</h4>
    <p>OS Webcomponent to create a quiz</p>
    <span class="github-card__meta"><span class="github-card__language-icon" style="color: #2b7489">●</span> TypeScript</span>
  </a>
</div>

### `markdown-it-image-figures`

Cuando hice la web con [Eleventy](https://www.11ty.dev/) descubrí el maravilloso mundo de [Markdown IT](https://github.com/markdown-it/markdown-it).

Es una librería para parsear Markdown y extensible para añadir plugins como crear tablas de contenido, abreviaturas, etc.

En su momento el plugin que quise usar para las imágenes estaba un poco verde y, aunque hice una [Pull Request](https://github.com/arve0/markdown-it-implicit-figures/pull/40) me quedó claro que el autor no tenía mucho interés o tiempo que dedicarle así que hice [una réplica](https://github.com/Antonio-Laguna/markdown-it-image-figures) y añadí un montón de cosas nuevas.

En este tiempo he lanzado una [nueva versión mayor](https://github.com/Antonio-Laguna/markdown-it-image-figures/releases/tag/2.0.0) que te permite  usar imágenes asíncronas sin tantos recovecos que hoy en día no son necesarios. Además he añadido opciones para sobrescribir por imagen.

La sugerencia vino de [Paul Robert Lloyd](https://paulrobertlloyd.com/) en [esta incidencia](https://github.com/Antonio-Laguna/markdown-it-image-figures/issues/7).

### PostCSS

Llevo usando PostCSS muchísimo tiempo y hace poco que he publicado un artículo sobre [Migrar de Sass a PostCSS](/posts/migrando-sass-a-postcss/).

Desde que apareció PostCSS 8 la comunidad ha ido un poco a la zaga con algunos de los plugins. Quizá el más sonado es [postcss-preset-env](https://github.com/csstools/postcss-preset-env).

Jon Neal, la persona que es dueña de todos los repositorios asociados a este esfuerzo ha tenido sus más y sus menos con el Open Source y sufriendo de Burnout en este sentido y ha sido difícil ayudar en este sentido.

No obstante de un tiempo a esta parte parece que se han renovado los esfuerzos y hay nuevos avances.

* Creé [la propuesta de cambio](https://github.com/csstools/postcss-preset-env/pull/214) para actualizar postcss-preset-env a la versión 8 de PostCSS.
* A raíz de eso descubrí que PostCSS Values Parser no era capaz de entender media queries con `width < 64 em` así que una nueva [propuesta de cambio](https://github.com/shellscape/postcss-values-parser/pull/137).
* Otra cosa que está pendiente de actualizar es la CSSDB para la que creé [una propuesta](https://github.com/csstools/cssdb/pull/67) para incluir nuevas propuestas.

Por un lado me encanta aportar y por otro es muy frustrante intentar ayudar y no poder o no saber cómo.

## Cerrando

Además de integrar Quizes (que veréis pronto) he completado una migración de Rems en base 10 a base 16 (como debería haber estado).

Además, he actualizado Eleventy a la versión 1.0.0 que ha salido en Beta. ¡De early adopter!

[Vuelvo](/posts/a%C3%B1adiendo-modo-oscuro-a-sitio-web-con-css-y-js/) a dejar este vídeo por aquí:

https://www.youtube.com/watch?v=AbSehcT19u0

Al final me enredo mucho y me despego del blog.

¡Nos seguimos leyendo!

