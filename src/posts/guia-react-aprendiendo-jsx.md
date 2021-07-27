---
title: "Fundamentos de React: Aprendiendo JSX"
description: Aprende sobre JSX. El lenguaje que ha creado React mezclando HTML y JavaScript. Indagamos en los componentes, elementos, props y algunos patrones.
socialDescription: 'Aprende los fundamentos de JSX: el lenguaje que mezcla HTML y JS'
date: 2021-06-21
enableToc: true
tags:
  - React
  - Guia React
postTweet: '1406877126389809154'
ghBranch: '002-aprendiendo-jsx'
video: 'https://www.youtube.com/watch?v=RZ6EVaxmtN4'
---

:::hidden-header Introducción

Ahora que ya tenemos [una ligera idea sobre cómo funciona React](/posts/guia-react-aprendiendo-jsx/), me parece propio que pasemos a centrarnos en JSX.

Si eres de los que prefiere disfrutar el contenido en formato vídeo, puedes verme contando esto mismo por aquí:

https://youtu.be/watch?v=RZ6EVaxmtN4

Si no, sigue leyendo.

JSX es una abreviatura de JavaScript XML que, simplificando mucho, es una extensión de la sintaxis de JavaScript.

¿Recuerdas que comentábamos que React es una librería *declarativa*? Pues JSX nos permite abstraer muchas complejidades del lenguaje para *declarar* cómo queremos que se comporte nuestra interfaz.

Volvamos a la base:

```jsx
const something = <h1>¡Hola Mundo!</h1>;
```

A priori, esta sintaxis te podría parecer HTML o una cadena pero no es ninguna de las dos cosas. Es JSX.

Por debajo, Babel se encarga de convertir eso en algo que JavaScript pueda entender:

```js
var something = React.createElement(
  'h1',
  null,
  '\xA1Hola Mundo!'
);
```

Esto ya parece algo más sencillo y que podemos entender, ¿no? Estamos creando un elemento y asignándolo a una variable.

:::info ¿Qué es Babel?

Babel es un *transpilador* que no es más que un nombre muy rimbombante para *resumir* lo siguiente: Es una librería que se encarga de transformar código en otro que pueda entender un navegador. Babel es útil para poder usar JSX sin tener que usar `React.createElement` o poder usar `const` u otras características de JavaScript que los navegadores aun no hayan implementado.

:::

Aunque React no nos obliga a usar JSX, creo que estarás de acuerdo conmigo en que es más sencillo de leer y de entender que si pasamos a usar `createElement` por todos lados.

Vamos a ver qué cosas chulas podemos hacer con JSX.

## Expresiones dentro de JSX

En el ejemplo anterior teníamos simplemente un famoso, ¡Hola Mundo! Ahora vamos a suponer que queremos personalizar el saludo:

```jsx
const name = 'visitante';
const greeting = <h1>¡Hola, {name}!</h1>;

ReactDOM.render(
  greeting,
  document.getElementById('root')
);
```

Una vez que abrimos `{` entramos en el mundo de JavaScript y podemos escribir ahí lo que queramos, que va a evaluarse como JavaScript. Podríamos escribir una operación matemática, una función o incluso un booleano.

Vamos a cambiarlo para usar una función:

```jsx
function formatName(name) {
  return name.replace('a', 'i');
}

const name = 'visitante';
const greeting = <h1>¡Hola, {formatName(name)}!</h1>; // ¡Hola, visitinte!

ReactDOM.render(
  greeting,
  document.getElementById('root')
);
```

## ¿Qué es un componente?

Lo que hemos visto hasta ahora **es un elemento**. Es trozo de JSX que se convierte en un elemento usando `createElement` por detrás.

Los componentes son trozos de código que devuelven un elemento para ser mostrados en la página. Vamos a convertir nuestro elemento a componente:

```jsx
function Greetings() {
  return <h1>¡Hola, visitante!</h1>;
}
```

Los componentes también pueden ser clases de JavaScript:

```jsx
class Greetings extends React.Component {
  render() {
    return <h1>¡Hola, visitante!</h1>;
  }
}
```

No obstante, las clases están en proceso de ser discontinuadas y solo vamos a centrarnos en componentes funcionales.

### Reglas de los componentes y elementos

Los componentes que van en una única línea no necesitan paréntesis a su alrededor. No obstante, para evitar problemas con los `;`, es recomendable usar paréntesis si vamos a usar varias líneas.

```jsx
function Greetings() {
  return (
    <h1>
      ¡Hola, visitante!
    </h1>
  );
}
```

Los componentes tienen que devolver un único elemento raíz. Hacer algo así estaría prohibido:

```js
function Greetings() {
  return (
    <h1>¡Hola, visitante!</h1>
    <a href="/login">Iniciar sesión</a>
  );
}
```

Tenemos dos opciones. Usar un elemento que encapsule esto:

```jsx
function Greetings() {
  return (
    <div>
      <h1>¡Hola, visitante!</h1>
      <a href="/login">Iniciar sesión</a>
    </div>
  );
}
```

O, si no necesitamos esa `div` extra, podemos usar un fragmento:

```jsx
function Greetings() {
  return (
    <>
      <h1>¡Hola, visitante!</h1>
      <a href="/login">Iniciar sesión</a>
    </>
  );
}
```

Los fragmentos suelen ser la opción más socorrida pero nos quitan un elemento al que añadirle propiedades.

## Atributos o props

Los componentes no tienen mucho sentido si no les podemos pasar opciones para configurarlos. Vamos a devolverle la función de pasarle un nombre a nuestro componente de saludo:

```jsx
function Greetings(props) {
  return <h1>¡Hola, {props.name}!</h1>;
}
```

Los componentes reciben un parámetro conocido como `props` (diminutivo de *propiedades*) que es un diccionario con todas las opciones que se le pasen. Vamos a consumir nuestro componente:

```jsx
<Greetings name="aprendiz de React" />
// <h1>¡Hola, aprendiz de React!</h1>
```

En este caso, el prop es estática, estamos definiendo a mano el valor `aprendiz de React`. Sin embargo, hay ocasiones en las que esperamos que los valores cambien y necesitamos usar **una variable**.

¿Recuerdas qué podemos hacer con las llaves? Pues abrir la puerta al mundo de JavaScript y es ahí donde podemos hacer uso de las variables:

```jsx
const name = 'variable';
<Greetings name={name} />
// <h1>¡Hola, variable!</h1>
```

Imaginemos un caso en el que el usuario es *anónimo* e inicia sesión en una aplicación y queremos ahora saludar a su nombre. En este caso usaríamos una variable.

Vamos a simular este comportamiento:

```jsx
function Greetings(props) {
  return <h1>¡Hola, {props.name}!</h1>;
}

let name = 'variable';

setTimeout(() => {
  name = 'excursionista';

  ReactDOM.render(
    <Greetings name={name} />,
    document.getElementById('root')
  );
}, 3000);

ReactDOM.render(
  <Greetings name={name} />,
  document.getElementById('root')
);
```

Si hacemos esto, a los 3 segundos estamos cambiando el valor de la variable y volviendo a renderizar la aplicación con un nuevo valor en la variable `name`.

### Desestructurando que es gerundio

La sintaxis de la desestructuración puede echarte un poco para atrás. Es algo *relativamente* nuevo en JavaScript y quizá te pase como a mi al principio que no estés del todo cómodo o cómoda usándolo. No obstante, es un patrón que vas a ver en muchos sitios y que te va ahorrar escribir `props` continuamente y nos va a permitir otras cosas interesantes también.

Vamos a hacer un pequeño repaso rápido sobre cómo funciona esto:

Pongamos que tenemos un objeto así:

```js
const pokemon = {
  name: 'Pikachu',
  type: 'Electrico',
  level: 13
};
```

Podemos acceder a sus propiedades así:

```js
console.log(pokemon.name) // Pikachu
console.log(pokemon.type) // Eléctrico
console.log(pokemon.level) // 13
```

Si usamos la desestructuración, podemos asignar cada propiedad a  una variable:

```js
const { name, type, level } = pokemon;
console.log(name); // Pikachu
console.log(type); // Eléctrico
console.log(level); // 13
```

Ahora, volviendo al terreno de React, recordemos que **todas** las props de un componente vienen dentro de un único objeto así que podemos valernos de esto para ser un poco más legibles con nuestro componente:

```jsx
function Greetings({ name }) {
  return <h1>¡Hola, {name}!</h1>;
}
```

Ahora tenemos una sola variable pero si tuviéramos más nos evitaríamos teniendo que estar escribiendo `props.` todo el rato.

### Resto de props

Hay veces que nos interesa pasar *el resto* de cosas que le pasemos a un componente, a otro sitio. En nuestro componente `Greetings` ahora mismo solo queremos pasar el `name` pero imagina que quieres añadirle una clase al elemento `h1` y una `id`. Lo podríamos hacer así, ¿no?

```jsx
function Greetings({ name, id, className }) {
  return <h1 id={id} className={className}>¡Hola, {name}!</h1>;
}
```

Y funcionaría. Ni siquiera tendríamos atributos vacíos o con `undefined`. No obstante se puede volver un poco tedioso de mantener cuando simplemente queremos que **el resto** se vaya a un elemento. Gracias al operador propagador `...` podemos conseguir lo mismo:

```jsx
function Greetings({ name, ...rest }) {
  return <h1 {...rest}>¡Hola, {name}!</h1>;
}
```

Gracias a la desestructuración y al operador propagador, podemos capturar **el resto** de props que no nos interesen dentro de `...rest` y pasárselas tal cual al elemento y si ahora hiciéramos esto:

```jsx
<Greetings name="variable" id="welcome" />
// <h1 id="welcome">¡Hola, variable!</h1>
```

Tendríamos una ID en nuestro `h1` de manera automática y sin que tengamos que volver a tocar el componente. Aparte de evitarnos tener que seguir manteniendo, nos permite separar props específicas del componente, de atributos específicos del DOM que no necesitamos tener siempre presentes pero que pueden ser necesarios en la propia implementación.

### Props con valores por defecto

Es común que queramos ofrecer valores por defecto para alguna prop. Valores que puede que queramos usar pero no en todas las situaciones.

Nuestro componente `Greetings` podría usarse sin pasarle un nombre, en caso de no tener ningún nombre que pasarle. Podríamos hacerlo así:

```jsx
function Greetings({ name = 'visitante' }) {
  return <h1>¡Hola, {name}!</h1>;
}
```

En caso de que no le pasáramos la prop `name`, se usaría el valor `visitante`.

No obstante, esto tiene una complicación. A la hora de convertir este código a uno que el navegador pueda entender, se queda como algo así:

```js
function Greetings(_ref) {
  var _ref$name = _ref.name,
    name = _ref$name === void 0 ? "visitante" : _ref$name;
  return /*#__PURE__*/ React.createElement("h1", null, "\xA1Hola, ", name, "!");
}
```

Por cada propiedad que tenga valor por defecto, se comprueba que no tenga un valor sin definir y si no lo tiene devuelve un valor. **Esto es poco eficiente**. Por eso React, nos ofrece un método más sencillo y conveniente para algo tan común:

```jsx
function Greetings({ name }) {
  return <h1>¡Hola, {name}!</h1>;
}

Greetings.defaultProps = {
  name: 'visitante'
};
```

El objeto `defaultProps` se encarga de hacer el mismo trabajo que hacíamos antes, solo que a la hora de compilar el resultado es mucho más sencillo:

```js
function Greetings(ref) {
  var name = ref.name;
  return /*#__PURE__*/ React.createElement("h1", null, "\xA1Hola, ", name, "!");
}

Greetings.defaultProps = {
  name: "visitante"
};
```

### Props booleanas

En ocasiones querremos que una prop sea `true` o `false`. Si una prop no tiene valor alguno, React la evaluará como `true`:

```jsx
<Greetings name="visitante" isLoggedIn />
```

En este caso, `isLoggedIn` tendría el valor `true`. Únicamente nos interesa pasar un valor, si depende de una variable:

```jsx
const isLogged = true; // o false
<Greetings name="visitante" isLoggedIn={isLogged} />
```

## Con hijos o sin ellos

Una de las cosas que JSX toma de XML es la posibilidad de no tener que incluir etiquetas de cierre en los elementos, si dentro no van a llevar nada. En HTML solo hay unos pocos y se les conoce como elementos nulos (*void elements*) entre los que se encuentran `img`, `input`, `hr` o `br` entre otros. Estos elemento se autocierran:

```markup
<input type="text" /> <!-- Bien -->
<input type="text"></input> <!-- Mal -->
```

React nos permite que todos los elementos puedan ser así, incluso los "nativos" HTML que ya se encarga luego React de arreglar por nosotros. Habrá ocasiones en las que queramos que nuestros componentes lleven cosas dentro y otras ocasiones en las que no.

Si volvemos a nuestro componente `Greetings`, verás que lo hemos puesto todo el tiempo como `<Greeting />` y no `<Greeting></Greeting>`. Vamos a cambiar nuestro componente para que, si pasamos algo dentro, podamos mostrarlo.

```jsx
function Greetings({ name, children }) {
  return <h1>¡Hola, {name}!{children}</h1>;
}

const name = 'variable';

ReactDOM.render(
  <Greetings name={name}> 🎉</Greetings>,
  document.getElementById('root')
);
```

Cuando pasamos *hijos* a un componente, estos se almacenan dentro de la propiedad `children` del objeto de `props`. Esto nos abre muchas opciones ya que no solo podemos pasar texto o un emoji si no que podríamos usar otras cosas como funciones o componentes que exploraremos con algunos patrones más avanzados.

## Etiquetas variables

Este es un truco que personalmente me encanta de JSX. Hay ocasiones en las que, por semántica, puedes necesitar cambiar la etiqueta que vamos a usar en algún momento.

Pongamos que queremos hacer que nuestro componente de saludo podamos mostrarlo en otros contextos en los que no queramos que use una etiqueta `h1`. El componente sería exactamente igual solo que no queremos usar un `h1`, quizá queramos utilizar una etiqueta `p`.

```jsx
function Greetings({ name, as }) {
  const Tag = as;
  return <Tag>¡Hola, {name}!</Tag>;
}

Greetings.defaultProps = {
  as: 'h1'
};

const name = 'variable';

ReactDOM.render(
  <Greetings name={name} as="p" />,
  document.getElementById('root')
);
```

Si usamos una variable que empieza por una letra mayúscula, podemos usar la variable como etiqueta. Ahora mismo estamos  pasando el valor `p` para usar esa etiqueta y, si no pasamos ninguna etiqueta, gracias a `defaultProps` tenemos nuevamente nuestro `h1`.

## JSX es seguro por naturaleza

Una de las cosas que nos da JSX es un entorno seguro en el que no tenemos que preocuparnos por lo que valgan las variables. JSX se encarga de escapar todo el contenido por nosotros para que nada que venga de fuera pueda contener código malicioso. Veamos un ejemplo:

```jsx
function Greetings({ name }) {
  return <h1>¡Hola, {name}!</h1>;
}

const name = '<strong>visitante</strong>';

ReactDOM.render(
  <Greetings name={name} />,
  document.getElementById('root')
);
```

¿Qué crees que va a pasar aquí? Si crees que `visitante` va a estar rodeado de etiquetas `strong` es correcto, pero creo que no de la manera en que esperabas. En la pantalla vamos a ver `¡Hola, <strong>visitante</strong>!`. Sin que `strong` sea tomado en cuenta.

Normalmente esto es lo que queremos pero hay ocasiones en las que necesitaremos poder hacer que eso tenga efecto. Para esto, React nos ofrece una `prop` llamada `dangerouslySetInnerHTML` a la que le podemos pasar un objeto especial. Veámoslo:

```jsx
function Greetings({ name }) {
  return <h1>¡Hola, <span dangerouslySetInnerHTML={{ __html: name }} />!</h1>;
}

const name = '<strong>visitante</strong>';

ReactDOM.render(
  <Greetings name={name} />,
  document.getElementById('root')
);
```

Si esa prop tiene un objeto con la clave `__html`, su valor será tratado como **seguro**. Como puedes ver, este tratamiento es engorroso, el nombre de la prop es largo y además requiere un objeto con una clave con dos guiones bajos... Es a propósito para que solo lo uses cuando sea necesario.

Recuerda. Un gran poder conlleva una gran responsabilidad.

## Patrones con JSX

Ahora que ya conocemos al 95% lo que podemos hacer con JSX, vamos a introducir algunos de los patrones sencillos que podemos hacer con el lenguaje para facilitarnos la vida.

### Renderización condicional

Es muy común querer no mostrar nada si no tenemos un valor o mostrar algo diferente si lo tenemos o reaccionar de formas diferentes dependiendo del caso.

Para ello, nos podemos valer de los operadores ternarios y del hecho de que React renderiza valores `false`, `undefined` o `null`.

Así logramos un `if` dentro de una expresión de JSX:

```jsx
function Greetings({ name }) {
  return name && <h1>¡Hola, {name}!</h1>;
}
```

De esta manera, si la prop `name` no tiene valor, no mostrará nada. Dado que `name` se evalúa como falso, no llega a ejecutarse la siguiente parte y no se muestra nada.

No obstante, a menudo querremos ofrecer resultados diferentes dependiendo de si la variable o expresión es verdadera o falsa:

```jsx
function Greetings({ name }) {
  return name ? (
    <h1>¡Hola, {name}!</h1>
  ) : (
    <h1>¡Hola!</h1>
  );
}
```

Gracias a este operador ternario, podemos ofrecer valores alternativos dependiendo de lo que necesitemos.

### Componente que renderiza componentes

Ya adelantábamos antes que las props pueden ser cualquier cosa. ¡Hasta otros componentes!

A veces nos puede resultar útil un componente que nos sirva para establecer una disposición de elementos en pantalla. Imaginemos un componente que nos expone 2 columnas y podemos pasar el contenido que queramos a cada una de las columnas:

```jsx
function Columns({ left, right }) {
  return (
    <div className="columns">
      <div className="column">{left}</div>
      <div className="column">{right}</div>
    </div>
  )
}
```

El CSS lo vamos a hacer muy sencillo para ilustrar lo que queremos:

```css
.columns {
  display: flex;
}

.column {
  width: 50%;
  text-align: center;
}
```

Nos vamos de flexbox para poner una columna al lado de la otra y centramos todo el contenido.

Ahora veamos cómo podemos consumir este componente `Columns`:

```jsx
<Columns
  left={<Greetings name="izquierda" />}
  right={<Greetings name="derecha" />}
/>
```

A cada prop, `left` y `right` le estamos pasando el componente `Greetings` con un nombre predefinido. Como ves, este patrón nos permite componer componentes de una forma muy sencilla.

---

## Conclusión

JSX es sin duda una extensión muy interesante para JavaScript y hemos repasado los conceptos claves y entendido cómo funciona por detrás. Hemos aprendido a fondo lo que son las props, el uso de los hijos en los elementos (y cómo usarlos como props) y cómo JSX evita algunos problemas de seguridad. Finalmente hemos repasado algunos patrones comunes y más o menos sencillos.

Todos los ejemplos que hemos repasado aquí, puedes verlos en [esta rama](https://github.com/Antonio-Laguna/curso-react/tree/002-aprendiendo-jsx) del repositorio que tiene cada artículo.

¿Dudas? ¿Logros? Vente a [las discusiones](https://github.com/Antonio-Laguna/curso-react/discussions) del curso y charlemos.

## Enlaces para curiosos

* [Spec de JSX](http://facebook.github.io/jsx/): En ella se especifica que la idea no es que se añada a JavaScript si no que sea usada por transpiladores (como Babel).
* [Prueba Babel en Línea](https://babeljs.io/repl).

*[HTML]: HyperText Markup Language
*[JS]: JavaScript
*[JSX]: JavaScript XML
*[CSS]: Cascade Style Sheet
*[DOM]: Document Object Model
*[XML]: Extensible Markup Language
