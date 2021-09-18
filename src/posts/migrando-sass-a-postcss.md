Cuando empecé la implementación del modo oscuro decidí dejar Sass atrás para siempre. Los motivos principales son tres:

* Sass ha sufrido varias mutaciones desde Ruby, Node/Lib y ahora DartSass. 
* Sass no me estaba ofreciendo nada que no me pudiera dar otra cosa.
* PostCSS me permite usar la sintaxis de CSS del futuro, hoy.

El último punto es quizá el más importante, el poder usar características que no están disponibles en CSS ahora mismo pero que lo estarán en no muy poco tiempo. Y es que es un proceso muy parecido al que llevamos haciendo ya mucho tiempo con JavaScript y Babel.

Lo cierto es que Sass me gusta y es un pre-procesador que es tremendamente popular y de hecho muchas herramientas nos lo da ya hecho y configurado para usarlo. Quizá ya estés usando PostCSS sin darte cuenta. El principal plugin de PostCSS es Autoprefixer que se encarga de añadir los prefijos necesarios de los navegadores a CSS cuando hace falta. Pero al final Autoprefixer es eso... un *plugin*. Combinar plugins es lo que hace que PostCSS brille. Podemos incluso compilar ficheros `.scss` sin tener que usar Sass.

En este tutorial quiero explicar cómo configurar PostCSS para conseguir *casi* lo mismo que nos da Sass y mejorarlo con algunos extras.

## El proyecto

Todo lo que vas a leer aquí está además en un repositorio que he creado en GitHub:

Necesita Node así que ejecuta `npm install`  para obtener todas las dependencias. Puedes compilar los ficheros usando:

`npm run css:dev`

Autocompilar si cambian los ficheros con:

`npm run css:watch`

Y luego sal pulsando `Ctrl` o `Cmd` + `C` en el terminal. Ambas opciones nos dan el mapa del código (source map) en `build/css/main.css.map` que nos permite leer el CSS en la herramientas para desarrolladores de nuestro navegador. 

Podemos compilar el código para producción con:

`npm run css:build`

Y nos quedaremos sin los mapas.

Si prefieres entender las tripas y cómo funcionan las cosas te animo a seguir leyendo.

## Instalando PostCSS

PostCSS se puede usar con webpack, parcel, gulp e incluso grunt pero vamos a configurarlo de forma autónoma para lanzarlo como script de NPM. Si aun no tienes un fichero `package.json` inicializa tu proyecto como uno de Node usando `npm init`.

Una vez que tengamos un fichero package.json en la raíz de nuestro proyecto, vamos a instalar todas las dependencias de un tirón:

```bash
npm i postcss postcss-cli postcss-import postcss-mixins postcss-nested postcss-preset-env cssnano
```

Esto son un montón de dependencias. Mientras se instalan veamos qué hace cada una:

1. `postcss` y `postcss-cli`: Es el que se encarga de orquestar todos los plugins que se van a encargar de, uno a uno, transformar nuestro CSS.
2. `[postcss-import](https://github.com/postcss/postcss-import)`: Este plugin nos va a permitir usar `@import` para incrustar el contenido de un fichero CSS dentro de otro sin generar una petición adicional de forma parecida a lo que hace Sass.
3. `[postcss-mixins](https://github.com/postcss/postcss-mixins)`: Este plugin nos permite crear mixins, no solo en CSS si no que podemos usar JS lo cual nos abre la puerta a compartir código entre JavaScript y CSS de manera muy sencilla.
4. `[postcss-nested](https://github.com/postcss/postcss-nested)`: A la hora de hacer nesting tenemos [la opción que quiere implementar la CSSWG](https://github.com/csstools/postcss-nesting) y esta otra que nos permite hacer nesting como lo haríamos en Sass. 
5. `[cssnano](https://cssnano.co/)`: Para comprimir el CSS al máximo.

Si has contado bien, nos falta un plugin y es `[postcss-preset-env](https://github.com/csstools/postcss-preset-env)` y es que necesita su propio apartado.

### postcss-preset-env

Quizá sea el plugin más importante de todos. Este plugin se encarga de que podamos usar características que se han propuesto a las especificaciones de CSS hoy. No tenemos que esperar a que los navegadores tengan que implementarlas o a que se aprueben. Este plugin se encarga por nosotros.

Con él podemos usar cosas como:

* `@custom-media` para crear media queries personalizadas.
* `@custom-selector` para crear selectores personalizados. 
* Autoprefixer para añadir prefijos para navegadores automáticamente.
* La [notación de 8 dígitos](https://www.w3.org/TR/css-color-4/#hex-notation) para hexadecimal.
* O [propiedades personalizadas](/introduccion-css-propiedades-personalizadas) con navegadores que no tienen soporte.

	Por defecto, este plugin nos va permitir usar las características de CSS que se encuentren en fase 2 o superior. ¿Qué significa eso? Pues son ideas *relativamente* inestables y que pueden cambiar y es una característica asociada a una forma particular de resolver un problema.
	
	En [CSSDB](https://cssdb.org/) puedes ver todas las características junto a sus fases con enlaces además a los plugins de PostCSS por separado que podrías incluir para usarlas si no quieres usar `postcss-preset-env`.

## Creando la configuración

PostCSS se puede ejecutar normalmente desde la línea de comandos gracias a `postcss-cli`. No obstante para tal cantidad de plugins, la cosa se vuelve peliaguda y es cuando un fichero de configuración nos puede venir bien.

Los ficheros de configuración de PostCSS son archivos de JavaScript llamados `postcss.config.js` y se suelen guardar en la raíz del proyecto. El módulo debe exportar una única función:

```js
module.exports = context => {
	// Nuestra configuración
};
```

Esta función recibe como parámetro un objeto de contexto (`context`) con las opciones que reciba `postcss` por comandos lo cual nos viene muy bien para reaccionar de manera acorde a algunas de ellas. Por ejemplo, vamos a ver si estamos ejecutando en un contexto de producción:

```js
const isProd = context.env === 'production';
```

La función debería devolver un objeto con la configuración que queramos aplicar. Vamos a añadir los plugins que nos interesan:

```js
module.exports = context => {
  const isProd = context.env === 'production';

  return {
    map: !isProd,
    plugins: [
      require('postcss-import'),
      require('postcss-mixins'),
      require('postcss-nested'),
      require('postcss-preset-env')({
        features: {
          'nesting-rules': false,
          'custom-properties': {
            preserve: true
          }
        },
        stage: 1,
        preserve: false
      }),
      isProd ? require('cssnano') : null
    ]
  };
}
```

Como ves, si estamos en producción, la propiedad `map` que nos permite configurar los source maps, estará a `false` y, de la misma forma, requeriremos `cssnano` en caso de que estemos preparando el código para producción.

:::info Nota

El orden de los plugins es muy importante en el array dado que es el orden en que se van a ejecutar. Es importante tener esto en mente para que las cosas funcionen como deben, no tiene sentido ejecutar `cssnano` lo primero y que el resto de plugins metan código sin optimizar.

:::

Destacable de la configuración de `postcss-preset-env` es que estamos escogiendo las características de fase 1 y que decimos que no queremos preservar las transformaciones. No obstante, configuramos un par de plugins más:

* Desactivamos las `nesting-rules` (que son las que aprueba el spec) porque estamos usando `postcss-nested`.
* Si preservamos las `custom-properties` dado que si no, nuestro fichero con las declaraciones en `:root` desaparecería y todas las variables quedarían cambiadas. Bueno para el uso en navegadores antiguos pero malo si queremos usar esas variables en JavaScript o usos más complejos.

## Ejecutando nuestra configuración

Para ejecutar lo que acabamos de configurar solo necesitamos tener un fichero de entrada y otro de salida:

```bash
$ npx postcss src/css/index.css -o public/css/index.css
```

El primer argumento es el fichero de entrada. Con `-o` estamos indicando dónde queremos que se produzca la salida.

Tenemos más opciones como `--watch` para iniciar un proceso que vigile los ficheros o `--env` si queremos especificar un entorno. Lo más común y útil es crear estos ejecutables como `scripts` dentro de nuestro `package.json` para ejecutarlos con `npm run`:

```json
{
	...
  "scripts": {
    "css:dev": "postcss src/css/index.css -o public/css/index.css",
    "css:watch": "postcss src/css/index.css -o public/css/index.css --watch",
    "css:build": "postcss src/css/index.css -o public/css/index.css --env=production"
  },
  ...
}
```

## Otros plugins interesantes

Además de los ya mencionados, uso otros plugins que me parecen interesantes:

`[postcss-calc](https://github.com/postcss/postcss-calc)`: Con este plugin podemos lograr reducir la cantidad de `calc` que tenemos que hacer ya que los interpola  creando un CSS más ligero:

```css
:root {
  --large-font-size: 1.5rem;
}

h1 {
  font-size: calc(var(--large-font-size) * 2);
  margin-bottom: calc(
      var(--main-font-size)
      * 1.5
  )
}

/* Al compilar */

h1 {
  font-size: 3rem;
  margin-bottom: 2.25rem;
}
```

Otro que me gusta mucho es `[postcss-sort-media-queries](https://github.com/solversgroup/postcss-sort-media-queries)` que nos va a permitir combinar todas las media queries que tengamos en todo el proyecto lo cual ahorra *mucho* espacio. Como podemos ver en su GitHub, aquí puedes ver un ejemplo:

```css
/* Antes */
@media screen and (max-width: 640px) {
  .head { color: #cfcfcf }
}
@media screen and (max-width: 768px) {
  .footer { color: #cfcfcf }
}
@media screen and (max-width: 640px) {
  .main { color: #cfcfcf }
}
@media screen and (min-width: 1280px) {
  .mobile-first { color: #cfcfcf }
}
@media screen and (min-width: 640px) {
  .mobile-first { color: #cfcfcf }
}
@media screen and (max-width: 640px) {
  .footer { color: #cfcfcf }
}

/* Después */
@media screen and (min-width: 640px) {
  .mobile-first { color: #cfcfcf }
}
@media screen and (min-width: 1280px) {
  .mobile-first { color: #cfcfcf }
}
@media screen and (max-width: 768px) {
  .footer { color: #cfcfcf }
}
@media screen and (max-width: 640px) {
  .head { color: #cfcfcf }
  .main { color: #cfcfcf }
  .footer { color: #cfcfcf }
}
```

Idealmente deberíamos colocar este plugin justo antes de `cssnano` para que se ejecuten todos antes y poder sacar el máximo rendimiento. Si solo usas 2 o 3 media queries (que es lo normal) acabas reduciendo las veces que aparece la apertura de `@media` para incluir una regla.

## Plugins para Sass

Si todo esto te parece un cambio muy drástico, lo cual es comprensible, hay algunos plugins que quizá te interesen:

* [Advanced Variables](https://github.com/csstools/postcss-advanced-variables): Plugin para tener variables a lo Sass, con `@if`, `@each`, `@mixin` y `@for` como añadidos.
* [Nested](https://github.com/postcss/postcss-nested): Plugin para usar las reglas de animación de Sass.
* [Sintaxis Scss](https://github.com/postcss/postcss-scss): Plugin necesario si vas a usar los de arriba. 

## Notas finales

Espero que con esto te hayas hecho una idea de cómo puedes valerte de PostCSS para dotar a tus ficheros CSS de super poderes. 

¿Conoces más plugins? ¡Me encantaría conocerlos!