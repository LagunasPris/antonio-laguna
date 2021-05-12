---
title: "Fundamentos de React: Aprendiendo JSX"
description: Aprende sobre JSX. El lenguaje que ha creado React mezclando HTML y JavaScript.
date: 2021-05-01
enableToc: true
tags:
  - React
  - Guia
postTweet: ''
---

Ahora que ya tenemos una ligera idea sobre cómo funciona React, me parece propio que pasemos a centrarnos en JSX. JSX es una abreviatura de JavaScript XML que es una extensión de la sintaxis de JavaScript. 

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

Babel es un *transpilador* que no es más que un nombre muy rimbombante para *resumir* lo siguiente. Es una librería que se encarga de transformar código en otro que pueda entender un navegador. Babel es útil para poder usar JSX sin tener que usar `React.createElement` o poder usar `const` u otras características de JavaScript que los navegadores aun no hayan implementado.

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

## Atributos estáticos o variables

## Con hijos o sin ellos

## Etiquetas variables

Este es un truco que personalmente me encanta de JSX. Hay ocasiones en las que, por semántica, puedes necesitar cambiar la etiqueta

## JSX es seguro por naturaleza 


## Enlaces para curiosos

* [Spec de JSX](http://facebook.github.io/jsx/): En ella se especifica que la idea no es que se añada a JavaScript si no que sea usada por transpiladores (como Babel).
* [Prueba Babel en Línea](https://babeljs.io/repl).


*[HTML]: HyperText Markup Language
*[JS]: JavaScript
*[JSX]: JavaScript XML
*[CSS]: Cascade Style Sheet
*[DOM]: Document Object Model


It is called JSX, and it is a syntax extension to JavaScript. We recommend using it with React to describe what the UI should look like. JSX may remind you of a template language, but it comes with the full power of JavaScript.

JSX produces React “elements”. We will explore rendering them to the DOM in the next section. Below, you can find the basics of JSX necessary to get yo

React is used with JSX—JavaScript XML—a way to write what seems as HTML with all of JavaScript’s power. JSX offers a great applied mental model for using nested functions in a way that feels intuitive.

Let’s ignore class components and focus on the far more common functional components. A functional component is a function that behaves exactly like any other JavaScript function. React components always return JSX which is then executed and turned into HTML.

This is what simple JSX looks like: