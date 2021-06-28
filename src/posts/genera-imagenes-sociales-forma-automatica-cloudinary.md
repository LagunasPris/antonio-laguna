---
title: Genera imágenes sociales para tus posts de forma automática con Cloudinary
description: Haz que tu contenido destaque en Twitter y Facebook generando automáticamente imágenes para tus artículos
date: 2021-06-28
tags:
  - Cloudinary
  - Social
  - Tutorial
postTweet: '1375360119945490432'
enableToc: true
---

:::hidden-header Introducción

Crear imágenes para las redes sociales para tus artículos es algo crítico para que tu contenido destaque. No obstante, especialmente cuando tenemos un blog relacionado con el código, no siempre tenemos imágenes que compartir o que poner. Y **eso está bien**. No obstante, si compartimos un artículo en Twitter y no tenemos una imagen, no destacan lo suficiente.

Crear imágenes para las redes sociales añade más tareas a la hora de crear un post. Puede parecer que no es mucho, pero ya es un escollo entre tu artículo estando publicado o no. Si leíste mi [Hola Mundo](/posts/hola-mundo/) es algo que poco a poco voy quitando. Las fricciones.

Hasta ahora he estado una opción *semi*automática. Antes de lanzar un post, ejecutaba un comando que usaba [Puppeteer](https://github.com/puppeteer/puppeteer) para renderizar una página, hacerle una captura y guardarla.

En este artículo voy a explicar cómo he usado [Cloudinary](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/wdcykmqfwa07rryjaaqj) que combina el hosting de las imágenes con APIs para modificarlas. La banda gratuita es más que suficiente para la mayoría de sitios personales.

:::info Sobre los enlaces

Los enlaces a [Cloudinary](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/wdcykmqfwa07rryjaaqj) que ves en este artículo incluyen una invitación en la que puedes crear una cuenta de forma gratuita y a mí me da unos créditos extra al mes.

:::


## Planificando nuestra imagen ideal

Antes de empezar a tocar una sola línea de código, estaría bien saber cómo queremos que queden nuestras imágenes. La idea es crear una plantilla que funcione para *cualquier* artículo y (idealmente) *cualquier* página.

Estaría bien incluir:

* Nuestro logo/favicon - Asociar la imagen a tu marca/página ayuda a asociarte con el contenido.
* Título - Google recomienda títulos de un máximo de 60 caracteres para estar seguros de que se muestre por completo.
* Texto adicional - En mi caso incluyo una descripción.

Para la plantilla voy a poner el logo a la izquierda y el contenido a la derecha. Este es el esquema:

{% image 'esquema_bdurrd.png' 1280 640 'Esquema en el que se ve el logo a la izquierda y a la derecha en dos filas el título y el texto' %}

El tamaño debería ser de 1280 píxeles de ancho por 640 de alto.

### Posicionando el texto en la imagen

Vamos a empezar por el título. Si lo pensamos, no importa el tamaño del título o del texto adicional, queremos que ambos queden juntos. [Cloudinary](https://cloudinary.com/invites/lpov9zyyucivvxsnalc5/wdcykmqfwa07rryjaaqj) tiene unas transformaciones de *gravedad* por lo que vamos a decir que queremos que el texto quede al sur (abajo) y al oeste (izquierda).

Las direcciones en Cloudinary son usando los puntos cardinales en vez de `top`, `right`, `bottom` y `left`.

:::info Atención

Las direcciones en Cloudinary son usando los puntos cardinales en vez de `top`, `right`, `bottom` y `left`.

:::

Esto significa que si el texto es corto, quedará así:

{% image 'titulo-corto_uyc6fr.png' 1280 640 'Esquema en el que se ve que el título queda alineado abajo a la izquierda sobre la caja de texto' %}

Ahora que ya tenemos el título, vamos a echar un vistazo al texto adicional, la descripción en mi caso. De manera análoga, tenemos que posicionarlo al norte (arriba) y al oeste (izquierda).

Así se vería con un texto corto:

{% image 'descripciones-corto_mxe1cw.png' 1280 640 'Esquema en el que se ve que la descripción queda alineada arriba a la izquierda sobre la caja de texto' %}

Ahora que ya tenemos el texto posicionado, el único requisito es asegurarnos de que tenemos suficiente contraste. Esta es la imagen "base" que uso para mis artículos:

{% image 'social-template_lfj9sg.jpg' 1280 640 'Imagen base de los artículos de este blog con el logo del elefante a la izquierda e iconos relacionados con el desarrollo difuminados por el fondo' %}

## Función que genere las imágenes automáticamente

Ahora que ya tenemos un plan claro en mente, y una plantilla a punto, vamos a crear una función que se encargue de generar la URL por nosotros puesto que, como veremos abajo, es una URL muy larga.

La función sabemos que tenemos que pasarle un título y una descripción (que voy a poner opcional).

```js
function getSocialImageUrl(title, description) {
  // Código
}
```

Vamos a separar esto en 4 trozos por legibilidad y para evitar que se vuelva una única cadena larguísima.

### Ajustes constantes

Muchos de los ajustes que vamos a usar para la imagen van a ser constantes. Algunos son elección nuestra como el color del texto, la fuente o su peso mientras que otros tenemos que averiguarlos.

Veamos las que ya sabemos:

```js
const CLOUDNAME = 'antonio-laguna';
const FOLDER = 'v1624199559/antonio.laguna/';
const BASE_URL = `https://res.cloudinary.com/${CLOUDNAME}/image/upload/`;
const SHARE_IMAGE_FILE = 'social-template_lfj9sg.jpg';
const SHARE_IMAGE_WIDTH = 1280;
const SHARE_IMAGE_HEIGHT = 640;
const TITLE_FONT = 'Fira%20Sans';
const TITLE_FONT_SIZE = 54;
/// const TITLE_BOTTOM_OFFSET = ???;
const TAGLINE_FONT_SIZE = 30;
// const TAGLINE_TOP_OFFSET = ???;
const TAGLINE_LINE_HEIGHT = 10;
// const TEXT_AREA_WIDTH = ???;
// const TEXT_LEFT_OFFSET = ???;
const TEXT_COLOR = 'fff';
```

Vamos de arriba a abajo:

1. `CLOUDNAME`: Es el nombre de usuario de Cloudinary.
2. `FOLDER`: Es la carpeta donde está la imagen.
3. `BASE_URL`: Es la ruta principal de la imagen.
4. `SHARE_IMAGE_FILE`: El nombre del fichero y la extensión al subirlos a Cloudinary.
5. `SHARE_IMAGE_WIDTH`: El ancho de la imagen. 1280 píxeles en este caso.
6. `SHARE_IMAGE_HEIGHT`: El alto de la imagen: 640 píxeles en este caso.
7. `TITLE_FONT`: La fuente que vamos a usar. Podríamos usar dos fuentes diferentes. Cloudinary nos permite usar fuentes de Google Fonts e incluso subir la tuya propia como `woff2` y usarla. En mi caso, y coincidiendo con el diseño de la web, es Fira Sans.
8. `TITLE_FONT_SIZE`: El tamaño de la fuente del título que es de 54 píxeles.
9. `TITLE_BOTTOM_OFFSET`: Dónde queremos anclar el título en la imagen. Ahora veremos esto.
10. `TAGLINE_FONT_SIZE`: El tamaño de la fuente del texto adicional que es de 30 píxeles.
11. `TAGLINE_TOP_OFFSET`: Dónde queremos anclar el texto adicional en la imagen. Ahora veremos esto.
12. `TAGLINE_LINE_HEIGHT`: El alto de línea para el texto adicional que es de 10 píxeles.
13. `TEXT_AREA_WIDTH`: El ancho de las cajas de texto. Ahora veremos esto.
14. `TEXT_LEFT_OFFSET`: Dónde queremos anclar el título y el texto adicional a la izquierda de la imagen. Ahora veremos esto.
15. `TEXT_COLOR`: El color del texto, en este caso `fff` que es la sintaxis corta del color blanco en hexadecimal.

Ahora que tenemos las constantes, tenemos que calcular las opciones. Dado que el título lo anclamos con una gravedad suroeste, necesitamos decirle dónde empieza por abajo. Esto es un poco complicado de hacer a ojo y vamos a ver cómo lo hacemos con [Figma](https://www.figma.com):

<video src="https://res.cloudinary.com/antonio-laguna/video/upload/v1624717563/antonio.laguna/coordenadas-texto-cloudinary_wqowlf.mp4" playsinline loop autoplay muted width="1024" height="576"></video>

:::info Herramientas

He usado Figma como opción dado que es una aplicación conocida y gratuita pero lo puedes hacer en cualquier programa vectorial como InkScape o Sketch de forma análoga, el concepto es el mismo.

:::

Una vez hemos arrastrado la imagen, creamos un canvas para contenerla y que nos dé coordenadas precisas de las formas que coloquemos encima.

Una vez dibujado el recuadro sobre el título podemos calcular el `TITLE_BOTTOM_OFFSET` mirando el valor de la `Y` y sumándole el alto del recuadro que es de alrededor de `320`.

Sabiendo el `X` que vemos en Figma, tenemos el `TEXT_LEFT_OFFSET`. Dado que ambas capas tendrían que estar alineadas igual, el valor es compartido para el título y el texto adicional.

De manera contraria, la `Y`, al alinearla en la capa de abajo nos va a dar el valor `TAGLINE_TOP_OFFSET`.

### Base de la imagen

Así generamos la primera parte de la imagen:

```js
const imageConfig = [
  `w_${SHARE_IMAGE_WIDTH}`,
  `h_${SHARE_IMAGE_HEIGHT}`,
  'q_auto:best',
  'c_fill',
  'f_jpg',
].join(',');
```

Estamos diciendo que queremos una imagen con el ancho y el alto antes definidos. Además pedimos calidad automática optando porque quede lo mejor posible. Queremos que la imagen sea optimizada pero con el mejor resultado posible para que se vea bien. La composición debe ocupar todo lo que le pedimos (si tuviera un tamaño original diferente) y el formato de salida es `jpg`.

### Título de la imagen

```js
const titleConfig = [
  `w_${TEXT_AREA_WIDTH}`,
  'c_fit',
  `co_rgb:${TEXT_COLOR}`,
  'g_south_west',
  `x_${TEXT_LEFT_OFFSET}`,
  `y_${TITLE_BOTTOM_OFFSET}`,
  `l_text:${TITLE_FONT}_${TITLE_FONT_SIZE}_bold:${title}`,
].join(',');
```

Aquí estamos definiendo la configuración del título. Gracias a las constantes que hemos definido, vemos claramente cómo se define la imagen y qué opciones estamos indicando. En el caso del título además de la fuente y el tamaño, indicamos que la fuente sea `bold` para que se vea en negrita.

### Texto adicional de la imagen

```js
let tagLineText = '';

if (description.trim()) {
  const taglineConfig = [
    `w_${TEXT_AREA_WIDTH}`,
    'c_fit',
    `co_rgb:${TEXT_COLOR}`,
    'g_north_west',
    `x_${TEXT_LEFT_OFFSET}`,
    `y_${TAGLINE_TOP_OFFSET}`,
    `l_text:${TITLE_FONT}_${TAGLINE_FONT_SIZE}_line_spacing_${TAGLINE_LINE_HEIGHT}:${description}`,
  ].join(',');
  tagLineText = `${taglineConfig}/`;
}
```

Aquí si no recibimos la descripción no vamos a mostrar nada y el resto es muy parecido al código que hemos visto antes cambiando la gravedad y el espacio de las líneas.

### Resultado de la URL

Una vez que tenemos todas las piezas, vamos a generar la imagen completa. La URL la formamos tal que así:

```js
const url = `${BASE_URL}${imageConfig}/${titleConfig}/${tagLineText}${FOLDER}${SHARE_IMAGE_FILE}`;
```

Gracias a las constantes y a la interpolación de cadenas podemos montar la URL completa de manera más o menos legible.

El resultado final es una URL así:

```html
https://res.cloudinary.com/antonio-laguna/image/upload/w_1280,h_640,q_auto:best,c_fill,f_jpg/w_705,c_fit,co_rgb:fff,g_south_west,x_455,y_306,l_text:Fira%20Sans_54_bold:Fundamentos%20de%20React%3A%20Aprendiendo%20JSX/w_705,c_fit,co_rgb:fff,g_north_west,x_455,y_356,l_text:Fira%20Sans_30_line_spacing_10:Aprende%20los%20fundamentos%20de%20JSX%3A%20el%20lenguaje%20que%20mezcla%20HTML%20y%20JS/v1624199559/antonio.laguna/social-template_lfj9sg.jpg
```

Y al renderizarla se ve así:

{% image 'ejemplo-imagen-social-completa_b79yae.jpg' 1280 640 'Imagen renderizada cuyo titulo es Fundamentos de React: Aprendiendo JSX y la descripción es Aprende sobre JSX. El lenguaje que ha creado React mezclando HTML y JavaScript. Indagamos en los componentes, elementos, props y algunos patrones.'  %}

Este resultado se puede extrapolar a cualquier lenguaje/entorno que quieras. En mi caso, como ya sabes, uso [Eleventy](https://www.11ty.dev/) y he creado un [atajo](https://www.11ty.dev/docs/shortcodes/) (o shortcode) que invoco así:

```html
{%raw %}{% socialImage imageTitle, imageDescription %}{% endraw %}
```

El resultado es muy bueno y nos evitamos tener que preocuparnos de esto nunca más.

## Notas finales

Si has llegado hasta aquí, tendrás todas las herramientas que necesitas para añadir imágenes para Facebook y Twitter automáticas en tu blog.

Si te animas a implementarlo en tu sitio, ¡avísame por [Twitter](https://twitter.com/ant_laguna) o por [correo](https://antonio.laguna.es/sobre-mi/) para que vea cómo lo has hecho!

Por último, te dejo aquí algunos enlaces que te pueden ser de interés:

* [Implementación](https://github.com/LagunasPris/antonio-laguna/blob/master/eleventy/shortcodes/images.js) que está en el blog y [dónde](https://github.com/LagunasPris/antonio-laguna/blob/master/src/_includes/layouts/base.njk#L8) lo uso en la plantilla.
* Una vez más, gracias a [Sia Karamalegos](https://sia.codes/) por [su código](https://github.com/siakaramalegos/sia.codes-eleventy/blob/main/src/_11ty/shortcodes.js) y por [su artículo](https://sia.codes/posts/eleventy-and-cloudinary-images/) sobre Cloudinary.
* [Artículo](https://cloudinary.com/blog/how_to_overlay_text_on_image_easily_pixel_perfect_and_with_no_css_html) en Cloudinary que te muestra opciones para hacer con el texto.
* [Documentación](https://cloudinary.com/documentation/image_optimization#automatic_quality_selection_q_auto) de Cloudinary que explica las opciones para las imágenes.
