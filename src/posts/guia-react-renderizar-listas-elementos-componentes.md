---
title: "Fundamentos de React: Renderizando listas de elementos y componentes"
description:
date: 2021-07-13
enableToc: true
tags:
  - React
  - Guia React
postTweet: ''
ghBranch: '003-listas-jsx'
video: 'https://www.youtube.com/watch?v='
---

:::hidden-header Introducción

En el anterior capítulo de nuestra Guía de React, vimos cómo podíamos hacer multitud de cosas con JSX. De hecho, vimos la mayoría de las cosas que podemos hacer con el lenguaje pero me dejé una cosa para el final: Las listas.

El capítulo ya era largo y este concepto no es que sea excesivamente largo pero sí que tiene algunas peculiaridades que hubieran convertido el anterior en uno mucho más largo.

Como siempre, este artículo tiene un compañero audiovisual que puedes ver aquí:


## Renderizando una lista

Las listas son muy útiles ya que nos permiten mostrar una lista de elementos (o componentes) en nuestra aplicación con el mismo formato. En JavaScript (y en la mayoría de lenguajes) usamos bucles a la hora de repetir acciones. 

¿Cómo aborda esto React? React nos lo pone simple y nos pide que usemos `.map`. La función `map` nos permite crear una matriz (o lista o array) a partir de otra. Claro que podríamos hacer algo así:

```jsx
function MyList({ letters }) {
  const elements = [];

  letters.forEach(
    letter => elements.push(<li>{letter}</li>)
  );

  return (
    <ul>{elements}</ul>
  );
}

<MyList letters={['a', 'b', 'c', 'd']} />
```

Esto funciona perfectamente y obtendríamos nuestra lista. No obstante, si lo hacemos como React nos propone, nos va a quedar un código más declarativo:

```jsx
function MyList({ letters }) {
  return (
    <ul>{letters.map(letter => (
      <li>{letter}</li>
    ))}</ul>
  );
}
```

Observa que estamos directamente devolviendo el resultado de `.map` (que va a ser otra matriz) dentro de una expresión de JSX (ya que se encuentra entre llaves).

## React y la propiedad `key`

Si abres la consola tras haber renderizado este código, verás un warning que reza así:

> Warning: Each child in a list should have a unique "key" prop.
> Check the render method of `MyList`

La propiedad `key` es un atributo especial que tienes que incluir a la hora de crear listas de elementos. La solución es bastante simple:

https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318
https://reactjs.org/docs/lists-and-keys.html
https://dev.to/heatherhaylett/how-to-render-a-list-with-react-5988
https://daveceddia.com/display-a-list-in-react/

A “key” is a special string attribute you need to include when creating lists of elements. We’ll discuss why it’s important in the next section.

Let’s assign a key to our list items inside numbers.map() and fix the missing key issue.


A Note on the key Prop
You might’ve noticed I used the item’s array index as the key prop in both examples above. This is actually not a great idea in all cases, and I’ll tell you why.

(The best choice for a key is an item’s unique ID, if it has one.)

React relies on the key to identify items in the list. Remember React uses a virtual DOM, and it only redraws the components that changed since the last render.

The first time a component like IdiomaticReactList is rendered, React will see that you want to render a bunch of items, and it will create DOM nodes for them.

The next time that component renders, React will say, “I already have some list items on screen – are these ones different?” It will avoid recreating DOM nodes if it can tell that the items are the same.

But here’s the important bit: React can’t tell with a simple equality check, because every time a JSX element is created, that’s a brand new object, unequal to the old one.

So that’s where the key prop comes in. React can look at the key and know that, yes, even though this <Item> is not strictly === to the old <Item>, it actually is the same because the keys are the same.

This leads to a couple rules for keys. They must be:

Unique – Every item in the list must have a unique key. So, person.firstName would be a bad choice, for example (might not be unique).
and

Permanent – An item’s key must not change between re-renders, unless that item is different. So, Math.random is a bad choice for a key (it’ll change every time… and it might not be unique (slim chance of that, though))
Back to the problem at hand: why isn’t an item’s array index always a good choice for a key? It seems to be unique and permanent…

If you know for sure that the list of items is static, then the array index is a fine choice.

If on the other hand, the items could be reordered at some point, that will cause weird rendering bugs. If the list can be sorted, or you might replace items with new items (e.g. fetching a new list from the server), things may not render as expected. Think about what happens in those situations: a new item replaces the one at index “0”, but to React, that item is unchanged because it’s still called “0”, so it doesn’t re-render.

So the general rule is, if your list items have a unique id property of some sort, use that as your key.

Everything Is A List
It’s been said that most web apps are just lists of things. Songs (Spotify), thoughts (Twitter), activities (Toggl).

Now you know how to render lists in React. Which sorta means you could go write any app you want, now.
