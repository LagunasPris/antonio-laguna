---
title: Preparando y exportando iconos SVG
description:
date: 2021-06-24
tags:
  - SVG
postTweet: '1375360119945490432'
---

Como parte de nuestro trabajo en el campo del front end, una de las tareas que se repiten a menudo es exportar iconos SVG para que el navegador los consuma. Lo más sencillo es darle a "Exportar como SVG" y pegarlo como fichero en el editor. No obstante, si *sólo* hacemos eso, nos estaremos quedando en la superficie y no estaremos extrayendo todo el potencial de lo que significa el acrónimo SVG: **S**calable **V**ector **G**raphic (Vectores Gráficos Escalables). Además, en mi experiencia, encontramos maneras creativas de solucionar los problemas que veamos en con CSS cuando, en realidad, no necesitarían nada extra si hubiéramos seguido algunos pasos a la hora de exportar los iconos.

En este artículo, voy a mostrarte cómo preparar y exportar iconos usando Figma dado que es una herramienta gratuita y disponible en la mayoría de sistemas. No obstante, todo esto se hace igual en Sketch, Illustrator o Inkscape.

Aunque el artículo está enfocado para desarrolladores y desarrolladoras, las personas que se encarguen del diseño también pueden beneficiarse de ver cómo consumimos los vectores y cómo pueden facilitarlos o prepararlos para ser consumidos por el equipo de front end. A veces todo esto está fuera de nuestro alcance dado que el fichero viene de otra empresa, falta presupuesto o cualquier otra cosa que se os pueda ocurrir.

Ten en cuenta que vas a encontrar consejos genéricos y guías específicas para iconos. Si tu intención es animar un SVG o cambiarle el texto, vas a necesitar otro enfoque diferente.

¡Vamos al lío!

## Convirtiendo a `path`s

En el proceso de crear un icono, a menudo se usa cualquier herramienta a disposición del diseño para que se vea como queremos. Vamos a ver este sencillo icono de unos cascos:



Ahora vamos a poner la parte de e**s**calable a prueba:



Si fuéramos a usar los cascos en cualquier cosa que fuera más grande (o pequeña) que el tamaño en el que fue originalmente diseñado, no escalaría en la forma en la que hubiéramos esperado. Al agrandar el icono, esperamos ver que su *relleno* creciera de manera proporcional en vez de hacerse más fino. De la misma manera, si achicáramos el icono veríamos que el relleno sería mucho más grueso de lo esperado.
\
El motivo técnico por el que esto ocurre es que el icono se ha hecho dibujando una línea y se le ha incrementado el tamaño del borde para que se vea como se espera. No obstante, a la hora de cambiarle el tamaño, estamos escalando las posiciones de la línea pero el tamaño del borde **se mantiene constante** lo cual hace que se vea raro. Lo que queremos es convertir esos bordes para que sean la forma que queramos.

La opción para hacer esto en Figma se encuentra en *Object > Outline Stroke*. Presta atención al GIF abajo y observa cómo la línea azul define la línea interna del dibujo (no cubre el área de la forma). Al seleccionar *Outline Stroke*, la línea se computa y se convierte en todo el ancho del objeto (línea) y escalará de forma apropiada:



Ocurre lo mismo con el texto. Es común este tipo de distintivos con algún texto encima. Igualmente común es que estos distintivos tengan una fuente única para ellos y sería poco beneficioso aumentar el tamaño de la página solo para una fuente de un icono que puede (o no) aparecer:



El proceso es similar, si vamos a *Object > Outline Stroke* hará que el texto no sea editable pero lo habrá convertido a un vector eliminando la necesidad de incluir la fuente Phosphate en la página. Como casi todo en esta vida, no hay ganancia sin pérdida y el `path` resultante será normalmente más grande pero suele ser más beneficioso que añadir una nueva fuente.

## Simplificando capas

Tal y como hemos visto anteriormente en Convirtiendo a paths, los iconos suelen tener varias piezas. Puede que la persona que lo hizo dejara cosas a la mitad, no había leído este artículo o puede que simplemente hagan falta. Si nos aseguramos de que las capas son más sencillas, vamos a obtener un fichero más ligero al final del proceso. Hay algunas cosas comunes que suelen repetirse y que vamos a ver cómo lidiar con cada una de ellas específicamente.

### Grupos innecesarios

Si volvemos a nuestros cascos, podemos ver que tiene muchos grupos, si fuéramos a copiar el icono tal cual desde el canvas acabaríamos con un montón de etiquetas `g` que no necesitamos: