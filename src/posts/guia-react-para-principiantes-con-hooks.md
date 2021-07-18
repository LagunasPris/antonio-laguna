---
title: "Guía de React con Hooks para principiantes"
description: Vamos a descubrir React juntos y a aprenderlo desde cero. En esta ocasión vamos a crear nuestra primera aplicación y nuestro primer hook.
socialDescription: Descubramos React desde cero. Creamos nuestra primera aplicación y usamos nuestro primer hook.
date: 2021-05-11
enableToc: true
tags:
  - React
  - Guia React
postTweet: '1392055676860518403'
ghBranch: '001-guia-react-hooks'
video: 'https://www.youtube.com/watch?v=H_3IkTklcX8'
---

:::hidden-header Introducción

Llevo cierto tiempo trabajando con React y poniéndolo en práctica en sitios con millones de usuarios, compartiéndolo con el resto del equipo y, en definitiva, usándolo casi a diario. El motivo por el que retomé el blog es el de compartir las cosas que aprendo por si le sirven de ayuda a alguien.
Le he dado muchas vueltas a escribir sobre React porque hay mucha literatura al respecto aunque ¡espero que haya algo que te pueda aportar! Te voy a contar lo que a mí me ha servido. Desde 0 y nada de clases ni conversiones que ya quedaron atrás en el pasado.

En este tutorial pretendo que aprendas sobre los fundamentos de React. Cómo crear un proyecto con [Create React App](https://github.com/facebook/create-react-app) y cómo crear una aplicación sencilla con su estado y sus *props*.

Es probable que, si empiezas, muchas cosas no terminen de encajarte. **Es normal**. En este artículo solo vamos a hablar de lo básico e iremos expandiendo en futuras entregas.

Aquí os dejo mi introducción a React en vídeo:

https://youtu.be/H_3IkTklcX8

O si prefieres el formato texto ¡sigue leyendo!

:::info Nota

Si bien es una guía para principiantes en React, asumo que tienes conocimientos, al menos de los fundamentos, sobre HTML, CSS y JavaScript.

:::

Según su propia web, [React](https://reactjs.org/) es una librería de JavaScript para crear interfaces de usuario de forma **declarativa**. Fue escrita por Facebook en 2013 y que sigue manteniendo y actualizando a día de hoy. Es una librería muy popular y muy solicitada en el mundo laboral.

La web la puedes encontrar en [Inglés](https://reactjs.org/) y en [Castellano](https://reactjs.org/) (y en más idiomas también).

### Programación declarativa vs Programación imperativa

Puede que te hayas quedado leyendo la parte de React que dice que es *declarativa* y estés preguntándote, ¿qué es la programación declarativa?

Las programaciones declarativas e imperativas son *paradigmas* del desarrollo, que es una palabra muy rimbombante para decir que son *formas de entender el desarrollo*.

* La programación imperativa es un paradigma que usa sentencias que cambian el estado del programa.
* La programación declarativa es un paradigma que expresa la lógica sin describir los flujos de control.

Si vienes del mundo de jQuery o de usar JavaScript sin otras librerías vienes de un mundo imperativo. Me gusta pensar en imperativo como más trabajo.

Mira este código para crear un botón que cambie su atributo `aria-checked` al pulsarlo:

```js
const gallery = document.getElementById('gallery');
const button = document.createElement('button');

button.addEventListener('click', function() {
  if (this.getAttribute('aria-checked') === 'true') {
    this.setAttribute('aria-checked', 'false');
  } else {
    this.setAttribute('aria-checked', 'true');
  }
});

gallery.appendChild(button);
```

Ahora veamos el mismo ejemplo pero con React (aunque no nos quede del todo claro):

```jsx
const Button = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (<button aria-checked={isChecked} />);
};
```

Si te fijas no estamos seleccionando ningún elemento ni usando `addEventListener` ni nada parecido. De manera muy clara y concisa, estamos *declarando* cómo queremos que se comporte nuestro código.

### Componentes, componentes por todos lados

Si hace poco que has comenzado este maravilloso camino que es la programación, quizá hayas trabajado en la separación de responsabilidades o a separar tu código HTML, CSS y JS en ficheros diferentes. React toma un enfoque diferente y nos permite escribir la lógica y la vista todo en uno y nos anima a escribir componentes. Esto nos va a ayudar con la modularidad del código y de nuestras interfaces dado que podemos componer componentes de diferentes maneras y reusarlos como y cuando queramos.

En muchas de las páginas que visitas tienes componentes repartidos por todos lados. Las típicas tarjetas de artículos, la barra de compartir, un menú, incluso un elemento del menú. Todos eso **pueden ser componentes**.

Echa un vistazo al enfoque por componentes de este módulo de Billboard:

{% image 'componentes-billboard-react_arvxhq.jpg' 1332 921 'Captura de un módulo de la página Billboard.com en la que se muestra cómo están subdivididos los diferentes componentes de React' 'Repartición por componentes de un componente de Billboard.com' %}

Cada caja es un componente diferente y como ves, cada componente puede contar con varios *subcomponentes* a su vez. Además, hay componentes (como el autor) que se repiten entre sí.

Dependiendo de las necesidades de tu aplicación puedes partir cada pequeño trozo en un componente o hacer componentes con más funcionalidad.

## Instalación y configuración

Vamos a necesitar Node.js. Si aun no te has topado con Node y no lo tienes en tu máquina [vé y descárgalo](https://nodejs.org/es/).

Una vez esté instalado, abre tu terminal y ejecuta en alguna carpeta donde tengas tus proyectos el siguiente comando:

`npx create-react-app gif-chooser`

El comando puede tardar un poco y quizá te estés preguntando qué estamos haciendo. `npx` es una herramienta que viene con `npm` (que se instala con Node) que nos permite ejecutar paquetes sin instalarlos. En este caso estamos usándolo para ejecutar `create-react-app` que crea una aplicación de React y nos deja configurado el entorno. El parámetro `gif-chooser` es el nombre de nuestra aplicación.

Una vez que haya terminado, entra en el directorio con `cd`:

```bash
$ cd gif-chooser
```

Hecho esto, ahora podemos ejecutar nuestro proyecto ejecutando en el terminal:

```bash
$ npm start
```

Y se nos abrirá en el navegador lo siguiente:

{% image 'cra-react-pantalla_c7o6j9.png' 1026 1026 'Captura de pantalla de lo que se ve al ejecutar una aplicación creada con Create React App' 'Pantalla de Create React App' %}

¡Genial!

### Ficheros y estructura

Si ya has abierto la carpeta verás algo parecido a esto:

{% image 'ficheros-cra-gif-chooser_ehdmjb.jpg' 550 884 'Árbol de ficheros creados por Create React App con su estructura de directorios' %}

Dado que esto es una introducción, no vamos a pararnos en todos los ficheros pero sí que hay algunos que nos interesan. Empecemos por `src/index.js`

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
```

Necesitamos la librería de React para poder usar luego `React.StrictMode`. Es un pequeño ayudante que nos avisa si hay errores o malas prácticas que puedan existir en tu código.

Necesitamos `ReactDOM` para usar React en el propio navegador. React se sirve de un DOM virtual que no es más que una representación virtual del DOM con el que normalmente interactúas cuando usas JavaScript para hacer las cosas *más rápidas*. `ReactDOM.render` coge el DOM virtual y lo lleva al DOM real y se encarga de asegurarse de que ambos mundos estén sincronizados.

Importamos los estilos generales de `index.css` así como la aplicación que vamos a renderizar desde `./App` (que es un componente).

Vamos a olvidarnos del fichero de `reportWebVitals` que ahora mismo se nos escapa.

## ¡Hola Mundo!

¿Qué sería de un tutorial de iniciación sin un Hola Mundo? **Pues una basura**.

Vamos a abrir nuestros fichero `App.js` que es el **componente raíz**. Verás que hay código escrito y es el código que permite que la página que hemos visto antes se muestre.

Si echas un vistazo, verás que hay una función `App` que devuelve algo parecido a HTML pero con una sintaxis un poco extraña. Es JSX.

JSX es *muy* parecido a HTML y una de sus ventajas es que nos permite inyectar código JavaScript (y de React) en él, con las cosas que metemos entre llaves `{`.

Vamos a quitarlo todo y a dejar nuestro hola mundo:

```jsx
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>¡Hola Mundo!</h1>
    </div>
  );
}

export default App;
```

Si guardas el fichero, verás que el resultado cambia auto-mágicamente.

:::info Nota

¿No cambió? Mientras se esté ejecutando `npm run start` del paso anterior los cambios van a cambiar de manera automática sin tener que recargar la pestaña. Para parar eso, puedes pulsar `Ctrl + C`.

:::

## Nuestra primera aplicación de React

Para ponerlo sencillo, vamos a realizar un selector de gifs. Por ahora vamos a hacerlo sencillo y vamos a ofrecer 4 opciones.

Vamos a comenzar construyendo nuestra sencilla interfaz. Dado que tenemos 4 opciones, unos botones de tipo `radio` *suenan* bien (chiste). Aparte vamos a meter un encabezado para describir  nuestra *aplicación* y la imagen que vamos a mostrar:

```jsx
const App = () => {
  const image = null;

  return (
    <div>
      <form>
        <h1>¡Alégrate el día!</h1>

        <div className="fields">
          <label>
            <input type="radio" name="tipo"/> Gatos
          </label>
          <label>
            <input type="radio" name="tipo"/> Perros
          </label>
          <label>
            <input type="radio" name="tipo"/> Nicholas Cage
          </label>
          <label>
            <input type="radio" name="tipo"/> Otro
          </label>
        </div>
        {image && (<img src={image} alt="" />)}
      </form>
    </div>
  );
};
```

En el código quizá te extrañen un par de cosas. La primera es la palabra `className`. En JavaScript existe la palabra clave reservada `class` para crear... clases. Es por esto que React no puede usar esa palabra dentro de JSX como lo hacemos en HTML por lo que usamos el atributo `className`.

Lo siguiente es la parte de la imagen. Vamos a ponerlo separado para dejarlo claro:


```jsx
{image && (<img src={image} alt="" />)}
```

Esta expresión básicamente hace que si lo que hay a la izquierda del `&&` es `false` (o se evalúa como tal), no se muestre nada, mientras que si la imagen tiene valor (ahora mismo no es posible) se mostraría.

Vamos a hacer esto funcionar. Si queremos que una variable *cambie* su *estado* durante la ejecución tendremos que valernos de nuestro primer *hook*.

### Creando y mutando el estado

Para poder hacer uso del estado, necesitamos el *hook* conocido como `useState`. La definición que nos da React sobre los *hooks* es que son funciones que nos permiten *engancharnos* a características de React.

:::info Nota

Más adelante veremos a conciencia qué es un *hook*, qué hooks nos ofrece React e incluso cómo crear los nuestros propios. Por ahora vamos a quedarnos con que los *hooks*, por convención, empiezan por `use`. La traducción literal al castellano sería *gancho* o *enganchar*.

:::

Los *hooks* que nos ofrece React de forma nativa, se encuentran dentro del propio objeto de `React` por lo que podemos usarlos así: `React.useState` aunque lo más común es importarlos destructurándolos. Vamos a añadirlo:

```diff
+ import { useState } from 'react';

const App = () => {
  const image = null;
  ...
```

Este *hook* recibe un argumento: El valor que queremos que tome de forma inicial. Y nos devuelve dos valores en un array. El primero es el valor actual y el segundo es una función que nos permite cambiar el estado. Vamos a volver a desestructurar para guardar ambos valores en una variable:

```diff
import { useState } from 'react';

const App = () => {
-  const image = null;
+  const [image, setImage] = useState(null);
```

Si hacemos el cambio vas a ver que a priori no cambia nada, pero esto nos permite empezar a trabajar de forma *reactiva*. Si por ejemplo en vez de `null` pasáramos una URL de una imagen/gif veríamos que se renderiza de forma automática.

No obstante, esto no es lo que queremos así que vamos a crear un  pequeño diccionario de gifs y vamos a dotar a los inputs con la funcionalidad necesaria para funcionar:

```jsx/2-7,19,23,27,31
import { useState } from 'react';

const gifs = {
  cage: '...',
  cats: '...',
  dogs: '...',
  other: '...'
};

const App = () => {
  const [image, setImage] = useState(null);

  return (
    <div>
      <form>
        <h1>¡Alégrate el día!</h1>

        <div className="fields">
          <label>
            <input type="radio" name="tipo" onChange={() => setImage(gifs.cats)} />
            Gatos
          </label>
          <label>
            <input type="radio" name="tipo" onChange={() => setImage(gifs.dogs)}/>
            Perros
          </label>
          <label>
            <input type="radio" name="tipo" onChange={() => setImage(gifs.cage)}/>
            Nicholas Cage
          </label>
          <label>
            <input type="radio" name="tipo" onChange={() => setImage(gifs.other)}/>
            Otro
          </label>
        </div>
        {image && (<img src={image} alt="" />)}
      </form>
    </div>
  );
};
```

¡Y con esto podemos ver que funciona! El método `onChange` se ejecuta cada vez que uno de los `input` cambia de valor y establece `image` usando `setImage` a su valor correspondiente. Esto hace que el componente se vuelva a renderizar, en este caso `image` ya no será `null` y nos mostrará un gif animado.

Es posible que hayas observado que tenemos un trozo de código que se repite... 4 veces. Vamos a ponerlo claramente:

```jsx
<label>
  <input type="radio" name="tipo" onChange={() => setImage(imagen)} />
  texto
</label>
```

Cuando vemos este tipo de repeticiones, es probable que sea buena idea convertirlo en un componente. ¡Vamos a ello!

### Componentes y *props*

Para crear nuestro componente solo tenemos que crear una nueva función con él. Hay gente que usa funciones flecha (o *arrow functions* en inglés) y gente que usa funciones normales. **El resultado es el mismo**.

Vamos a ver cómo quedaría cambiando `texto` e `imagen` por **parámetros**:

```jsx
const GifSelector = ({ text, onChange }) => (
  <label>
    <input type="radio" name="tipo" onChange={onChange} />
    {text}
  </label>
);
```

Aquí hemos creado nuestro componente `GifSelector` el cual recibe como parámetros dos cosas: el texto y una función a llamar cuando se seleccione el `input`. En React a esos parámetros se les conoce como *props* pero creo que es más sencillo de asociar a **parámetros** de una **función** que es nuestro **componente**.
React pasa estas *props* como un objeto lo cual tiene muchas ventajas y es por eso por lo que usando la desestructuración podemos acceder a estos valores de manera más conveniente. Podríamos hacer algo así también:

```jsx
const GifSelector = (props) => (
  <label>
    <input type="radio" name="tipo" onChange={props.onChange} />
    {props.text}
  </label>
);
```

Pero creo que coincidirás conmigo en que esto es un poco más tedioso.

Ahora que ya tenemos nuestro componente, vamos a usarlo cambiando el código que acabamos de *abstraer*:

```jsx
const App = () => {
  const [image, setImage] = useState(null);

  return (
    <div>
      <form>
        <h1>¡Alégrate el día!</h1>

        <div className="fields">
          <GifSelector text="Gatos" onChange={() => setImage(gifs.cats)} />
          <GifSelector text="Perros" onChange={() => setImage(gifs.dogs)} />
          <GifSelector text="Nicholas Cage" onChange={() => setImage(gifs.cage)} />
          <GifSelector text="Otro" onChange={() => setImage(gifs.other)} />
        </div>
        {image && (<img src={image} alt="" />)}
      </form>
    </div>
  );
};
```

Ahora, cada *subcomponente* funciona como esperábamos y hemos aprendido un poco más sobre los componentes y las *props*.

Aquí tienes el componente en acción:

<p class="codepen" data-height="495" data-theme-id="dark" data-default-tab="result" data-user="antonio_laguna" data-slug-hash="abprzYj" data-preview="true" style="height: 495px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Gif Chooser">
  <span>See the Pen <a href="https://codepen.io/antonio_laguna/pen/abprzYj">
  Gif Chooser</a> by Antonio Laguna (<a href="https://codepen.io/antonio_laguna">@antonio_laguna</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

---

Espero que este pequeño tutorial te haya enseñado las cosas básicas de React y algunos de los conceptos iniciales complejos.

Hemos aprendido a crear una pequeña aplicación valiéndonos de Create React App y sobre componentes, *hooks* y *props*.

Ahora, te dejo un pequeño ejercicio.

¿Cómo harías que el primer radio esté seleccionado al cargar la aplicación?

¡Cuéntamelo! La solución la puedes ver [aquí](https://github.com/Antonio-Laguna/curso-react/tree/001-guia-react-hooks).

*[HTML]: HyperText Markup Language
*[JS]: JavaScript
*[JSX]: JavaScript XML
*[CSS]: Cascade Style Sheet
*[DOM]: Document Object Model
