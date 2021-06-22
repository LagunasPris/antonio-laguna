---
title: Preparando y exportando iconos SVG
description: Veamos cómo exportar un icono SVG desde Figma para que nos sea conveniente con los estilos y que no pese un quintal
date: 2021-06-22
tags:
  - SVG
postTweet: '1375360119945490432'
enableToc: true
---

:::hidden-header Introducción

Como parte de nuestro trabajo en el campo del front end, una de las tareas que se repiten a menudo es exportar iconos SVG para que el navegador los consuma. Lo más sencillo es darle a "Exportar como SVG" y pegarlo como fichero en el editor. No obstante, si *sólo* hacemos eso, nos estaremos quedando en la superficie y no estaremos extrayendo todo el potencial de lo que significa el acrónimo SVG: **S**calable **V**ector **G**raphic (Vectores Gráficos Escalables). Además, en mi experiencia, encontramos maneras creativas de solucionar los problemas que veamos en con CSS cuando, en realidad, no necesitarían nada extra si hubiéramos seguido algunos pasos a la hora de exportar los iconos.

En este artículo, voy a mostrarte cómo preparar y exportar iconos usando Figma dado que es una herramienta gratuita y disponible en la mayoría de sistemas. No obstante, todo esto se hace igual en Sketch, Illustrator o Inkscape.

Aunque el artículo está enfocado para desarrolladores y desarrolladoras, las personas que se encarguen del diseño también pueden beneficiarse de ver cómo consumimos los vectores y cómo pueden facilitarlos o prepararlos para ser consumidos por el equipo de front end. A veces todo esto está fuera de nuestro alcance dado que el fichero viene de otra empresa, falta presupuesto o cualquier otra cosa que se os pueda ocurrir.

Ten en cuenta que vas a encontrar consejos genéricos y guías específicas para iconos. Si tu intención es animar un SVG o cambiarle el texto, vas a necesitar otro enfoque diferente.

¡Vamos al lío!

## Convirtiendo a `path`s

En el proceso de crear un icono, a menudo se usa cualquier herramienta a disposición del diseño para que se vea como queremos. Vamos a ver este sencillo icono de unos cascos:

{% image 'headphones-preview_ufqudx.jpg' 538 566 'Icono de unos cascos en Figma' %}

Ahora vamos a poner la parte de e**s**calable a prueba:

<video src="https://res.cloudinary.com/antonio-laguna/video/upload/v1624346738/antonio.laguna/not-scaling-fine_glnnwe.mp4" playsinline loop autoplay muted width="594" height="458"></video>

Si fuéramos a usar los cascos en cualquier cosa que fuera más grande (o pequeña) que el tamaño en el que fue originalmente diseñado, no escalaría en la forma en la que hubiéramos esperado. Al agrandar el icono, esperamos ver que su *relleno* creciera de manera proporcional en vez de hacerse más fino. De la misma manera, si achicáramos el icono veríamos que el relleno sería mucho más grueso de lo esperado.
\
El motivo técnico por el que esto ocurre es que el icono se ha hecho dibujando una línea y se le ha incrementado el tamaño del borde para que se vea como se espera. No obstante, a la hora de cambiarle el tamaño, estamos escalando las posiciones de la línea pero el tamaño del borde **se mantiene constante** lo cual hace que se vea raro. Lo que queremos es convertir esos bordes para que sean la forma que queramos.

Ahora, si fueramos a hacer el mismo escalado, el icono se comportaría como esperamos en vez de tener una línea constante:

{% image 'comparison-headset_qztwak.png' 1004 705 'Comparación de escalado sin stroke en la que se aprecia que el escalado es correcto' %}

La opción para hacer esto en Figma se encuentra en *Object > Outline Stroke*. Presta atención al GIF abajo y observa cómo la línea azul define la línea interna del dibujo (no cubre el área de la forma). Al seleccionar *Outline Stroke*, la línea se computa y se convierte en todo el ancho del objeto (línea) y escalará de forma apropiada:

<video src="https://res.cloudinary.com/antonio-laguna/video/upload/v1624346738/antonio.laguna/remove-stroke_ugixyu.mp4" playsinline loop autoplay muted width="640" height="492"></video>

Ocurre lo mismo con el texto. Es común este tipo de distintivos con algún texto encima. Igualmente común es que estos distintivos tengan una fuente única para ellos y sería poco beneficioso aumentar el tamaño de la página solo para una fuente de un icono que puede (o no) aparecer:

{% image 'sale-badge_oherlx.jpg' 527 226 'Distintivo en color azul claro que tiene unas letras con la fuente Phosphate que se lee SALE' %}

El proceso es similar, si vamos a *Object > Outline Stroke* hará que el texto no sea editable pero lo habrá convertido a un vector eliminando la necesidad de incluir la fuente Phosphate en la página. Como casi todo en esta vida, no hay ganancia sin pérdida y el `path` resultante será normalmente más grande pero suele ser más beneficioso que añadir una nueva fuente.

## Simplificando capas

Tal y como hemos visto anteriormente en Convirtiendo a paths, los iconos suelen tener varias piezas. Puede que la persona que lo hizo dejara cosas a la mitad, no había leído este artículo o puede que simplemente hagan falta. Si nos aseguramos de que las capas son más sencillas, vamos a obtener un fichero más ligero al final del proceso. Hay algunas cosas comunes que suelen repetirse y que vamos a ver cómo lidiar con cada una de ellas específicamente.

### Grupos innecesarios

Si volvemos a nuestros cascos, podemos ver que tiene muchos grupos, si fuéramos a copiar el icono tal cual desde el canvas acabaríamos con un montón de etiquetas `g` que no necesitamos:

{% image 'many-groups-svg_isqaxf.jpg' 560 418 'Captura de Figma en la que se ve que hay varios grupos para albergar dos capas' %}

Mi recomendación es deshacerse de ellos haciendo click en cada capa y luego en _Ungroup selection_:

<video src="https://res.cloudinary.com/antonio-laguna/video/upload/v1624346738/antonio.laguna/simplifying-groups_le50ky.mp4" playsinline loop autoplay muted width="640" height="490"></video>

### Deshaciendo uniones y máscaras

Uno de los trucos que se usan para hacer un icono es poner capas juntas y luego unirlas, substraerlas o usarlas como máscaras. Esas operaciones son caras en términos del espacio que van a consumir. Piensa que un rectángulo tiene pocos puntos pero si lo unimos a otra forma, los cálculos se vuelven más complejos y resultan en ficheros con un tamaño mayor.

Veamos este icono de YouTube por ejemplo:

{% image 'union-layers_zhlica.png' 1428 858 'Captura de Figma en la que se ve un icono de YouTube que tiene una union hecha para realizar el icono completo' %}

A simple vista está bien pero el tamaño acaba siendo 16 bytes mayor con la unión que sin ella. Aunque esto pueda no parecer mucho, si tienes una colección de iconos razonablemente grande y con formas más complejas, acabará por notarse más. Por suerte, el cambio que hay que hacer es el mismo que antes y _Ungroup selection_ deshará esta acción.

En este punto del flujo, las formas ya no son líneas (las convertimos a `path`) y usando unión, convertimos todo el espacio en blanco entre el triángulo y el borde para que sean parte del componente lo cual acaba incidiendo en el tamaño del `path`.

Esta parte puede no ser sencilla de hacer porque puede que, realmente, haga falta. Figma tiene otra opción que está en Object > Flatten Selection que optimizará la unión y puede funcionar mejor, ya que se encarga de deshacerse de las capas anidadas.

## Dando tamaño y relleno a los iconos

Este es, de lejos, el problema más común que he visto por ahí. Los iconos necesitan tener un tamaño consistente y cuadrado. Normalmente entre `18px` y `32px` está bien pero puedes escoger lo que quieras mientras **seas consistente**.

Igual que es importante ser consistente con el tamaño, necesitamos algo de relleno (padding) en el canvas para que el icono tenga sitio para respirar. Hay muchas veces en las que necesitamos mover el icono un poco para que parezca visualmente centrado. Por ejemplo, un ▶ necesita ir un poco a la derecha para parecer en el centro.

¿Cuánto relleno? Te estarás preguntando. Como norma general, en torno a un 9-10% del canvas.

Veamos esta flecha que es un buen ejemplo de icono común:

<video src="https://res.cloudinary.com/antonio-laguna/video/upload/v1624346738/antonio.laguna/icon-padding_q7dpt4.mp4" playsinline loop autoplay muted width="640" height="496"></video>

1. El icono comienza en la altura objetivo de `36px`.
2. Ponemos el canvas a `36px` por `36px`.
3. Reducimos el icono a su ancho original para que el canvas se quede cuadrado pero no el icono.
4. Ahora añadimos un margen de unos 3-4 píxeles.
5. Finalmente centramos el icono visualmente dentro del canvas. Podemos (y nos ayudaría mucho) usar los iconos para centrar verticalmente pero no horizontalmente (en este caso).

## Comprimiendo con SVGO

Este es el paso final. Estamos listos para poner nuestros ficheros en nuestros editores y que los consuma el navegador. No obstante, al copiar como SVG, el fichero está así:

```svg
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18 6.82353C11.8144 6.82353 6.8 11.8801 6.8 18.1176V26.5882C6.8 27.3679 6.1732 28 5.4 28C4.6268 28 4 27.3679 4 26.5882V18.1176C4 10.3207 10.268 4 18 4C25.732 4 32 10.3207 32 18.1176V26.5882C32 27.3679 31.3732 28 30.6 28C29.8268 28 29.2 27.3679 29.2 26.5882V18.1176C29.2 11.8801 24.1856 6.82353 18 6.82353Z" fill="black"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4 21.3333C4 20.597 4.6268 20 5.4 20H9.6C11.9196 20 13.8 21.7909 13.8 24V28C13.8 30.2091 11.9196 32 9.6 32H8.2C5.8804 32 4 30.2091 4 28V21.3333ZM6.8 22.6667V28C6.8 28.7364 7.4268 29.3333 8.2 29.3333H9.6C10.3732 29.3333 11 28.7364 11 28V24C11 23.2636 10.3732 22.6667 9.6 22.6667H6.8ZM26.4 22.6667C25.6268 22.6667 25 23.2636 25 24V28C25 28.7364 25.6268 29.3333 26.4 29.3333H27.8C28.5732 29.3333 29.2 28.7364 29.2 28V22.6667H26.4ZM22.2 24C22.2 21.7909 24.0804 20 26.4 20H30.6C31.3732 20 32 20.597 32 21.3333V28C32 30.2091 30.1196 32 27.8 32H26.4C24.0804 32 22.2 30.2091 22.2 28V24Z" fill="black"/>
</svg>
```

Que tampoco es terrible pero es un icono simple, piensa que un globo terráqueo con todos sus meridianos acabaría siendo mucho más largo. Vamos a mejorarlo.

Hay una herramienta online llamada [SVGOMG](https://jakearchibald.github.io/svgomg/) creada por [Jake Archibald](https://twitter.com/jaffathecake) que ejecuta [SVGO](https://github.com/svg/svgo) en el navegador con los ajustes más comunes para que no tengamos que pensar mucho. El proceso es así:

1. Copiar como SVG
2. Abrir SVGOMG
3. Pegarlo dentro
4. Cambiar ajustes (opcional)
5. Copiar al portapapeles
6. Pegar en el editor
7. ???
8. Profit

<video src="https://res.cloudinary.com/antonio-laguna/video/upload/v1624346738/antonio.laguna/exporting-to-svgo_topjfg.mp4" playsinline loop autoplay muted width="500" height="426"></video>

Ahora comparemos la salida. Como puedes ver en la animación arriba, hay una buena reducción y cada byte cuenta.

```svg
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18 6.824c-6.186 0-11.2 5.056-11.2 11.294v8.47c0 .78-.627 1.412-1.4 1.412-.773 0-1.4-.632-1.4-1.412v-8.47C4 10.32 10.268 4 18 4s14 6.32 14 14.118v8.47c0 .78-.627 1.412-1.4 1.412-.773 0-1.4-.632-1.4-1.412v-8.47c0-6.238-5.014-11.294-11.2-11.294z" fill="#000"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4 21.333C4 20.597 4.627 20 5.4 20h4.2c2.32 0 4.2 1.79 4.2 4v4c0 2.21-1.88 4-4.2 4H8.2C5.88 32 4 30.21 4 28v-6.667zm2.8 1.334V28c0 .736.627 1.333 1.4 1.333h1.4c.773 0 1.4-.597 1.4-1.333v-4c0-.736-.627-1.333-1.4-1.333H6.8zm19.6 0c-.773 0-1.4.597-1.4 1.333v4c0 .736.627 1.333 1.4 1.333h1.4c.773 0 1.4-.597 1.4-1.333v-5.333h-2.8zM22.2 24c0-2.21 1.88-4 4.2-4h4.2c.773 0 1.4.597 1.4 1.333V28c0 2.21-1.88 4-4.2 4h-1.4c-2.32 0-4.2-1.79-4.2-4v-4z" fill="#000"/></svg>
```

Ahora está todo en una línea, los `path`s se han simplificado y ya casi estamos listos. La última parte es cambiar el valor de los atributos `fill`. Vamos a quitar el que está arriba del todo y que tiene valor de `none` y cambiemos los que tienen `#000` a `currentColor`. De esta forma podemos hacer que los iconos tengan el color de nuestro texto y funcionen genial con transiciones de color o dentro de un enlace o botón sin tener que escribir nada de CSS. Siempre puedes seleccionar el SVG con CSS y cambiar el color al que quieras.

Por regla general y en el 99.99% de los casos, puedes quitar las reglas `fill-rule` y `clip-rule` que aparecen también con lo que le arañaríamos aun algunos bytes más. No obstante, te recomiendo probar porque depende de la complejidad del icono tal y como nos explica [Xaviju](https://twitter.com/Xaviju):

https://twitter.com/Xaviju/status/1407249803189358599

Este es el código final de nuestros cascos:

```svg
<svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"><path d="M18 6.824c-6.186 0-11.2 5.056-11.2 11.294v8.47c0 .78-.627 1.412-1.4 1.412-.773 0-1.4-.632-1.4-1.412v-8.47C4 10.32 10.268 4 18 4s14 6.32 14 14.118v8.47c0 .78-.627 1.412-1.4 1.412-.773 0-1.4-.632-1.4-1.412v-8.47c0-6.238-5.014-11.294-11.2-11.294z" fill="currentColor"/><path d="M4 21.333C4 20.597 4.627 20 5.4 20h4.2c2.32 0 4.2 1.79 4.2 4v4c0 2.21-1.88 4-4.2 4H8.2C5.88 32 4 30.21 4 28v-6.667zm2.8 1.334V28c0 .736.627 1.333 1.4 1.333h1.4c.773 0 1.4-.597 1.4-1.333v-4c0-.736-.627-1.333-1.4-1.333H6.8zm19.6 0c-.773 0-1.4.597-1.4 1.333v4c0 .736.627 1.333 1.4 1.333h1.4c.773 0 1.4-.597 1.4-1.333v-5.333h-2.8zM22.2 24c0-2.21 1.88-4 4.2-4h4.2c.773 0 1.4.597 1.4 1.333V28c0 2.21-1.88 4-4.2 4h-1.4c-2.32 0-4.2-1.79-4.2-4v-4z" fill="currentColor"/></svg>
```

Ahora ya podemos ponerlo en nuestra aplicación ¡y empezar a usarlo sin problemas!

## Notas finales

Espero que hayas aprendido algo sobre cómo lidiar con SVGs. Hay muchos más casos y algunos programas los gestionan de formas diferentes. Por ejemplo, Sketch tiene un problema al exportar capas transformadas pero Figma no.

Por otro lado, asegúrate de probar cada optimización, hay ocasiones en las que una optimización particular puede llevar a un tamaño más grande lo cual estamos intentando evitar.

Si has visto casos que no haya cubierto aquí, me encantaría saberlos y actualizaré el artículo para incluirlos.
