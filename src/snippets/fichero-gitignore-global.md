---
title: Crea un fichero .gitignore global
displayTitle: Crea un fichero <code>.gitignore</code> global
description: Descubre cómo puedes crear un fichero gitignore global para evitar tener que añadir manualmente ficheros y carpetas.
date: 2022-03-28
tags:
  - Git
postTweet:
---

Una de las cosas que hasta hace bien poco hacía era añadir este tipo de líneas en todos los ficheros `.gitignore` que podía:

```diff
package-lock.json
+ .idea
```

Claro, esta compartía sitio con `.vscode` o `Thumbs.db`. Si todos añadimos nuestras reglas específicas de nuestro entorno de trabajo, `.gitignore` necesitaría un trabajo de mantenimiento curioso y esto además dificultaría contribuciones de código abierto.

Hace poco he descubierto que hay una mejor solución: tener un fichero `.gitignore` global y personal para todos los repositorios. Veamos cómo hacerlo.

Lo primero que vamos a hacer es crear un fichero `.gitignore` para nuestras reglas globales. En entornos Unix lo normal es mantenerlos en nuestro directorio `$HOME`:

```bash
$ touch ~/.gitignore
```

Luego, ábrelo con tu editor favorito (seguro que es nano) y rellénalo a tu gusto. Este es el mío:

```text
.idea
.DS_Store
```

Por regla general tendremos dos entradas en este fichero: una para los ficheros específicos del sistema operativo y otra para los del editor.

Dado que soy usuario de Mac, ignoro los ficheros `.DS_Store` que crea macOS. También uso PhpStorm por lo que ignoro la carpeta `.idea`.

Si fuera usuario de Windows con VSCode, mi fichero sería algo así:

```text
.vscode
Thumbs.db
```

El paso final es decirle a Git que queremos usar este fichero:

```bash
$ git config --global core.excludesfile ~/.gitignore
```

Ten en cuenta que si usas Windows o has colocado el fichero en otro sitio tendrás que ajustar la ruta.

A partir de ahora, ¡se acabaron los commits para ignorar estos ficheros y directorios!
