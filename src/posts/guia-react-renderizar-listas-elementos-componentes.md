---
title: "Fundamentos de React: Renderizando listas de elementos y componentes"
description: Aprendemos a renderizar listas de elementos con JSX y vemos la importancia del atributo key en React, sus reglas y cuándo podemos usar un índice.
date: 2021-07-19
enableToc: true
tags:
  - React
  - Guia React
postTweet: '1417029511762296833'
ghBranch: '003-renderizando-listas'
video: 'https://www.youtube.com/watch?v=-JM6Ie2IhU0'
---

:::hidden-header Introducción

En el anterior capítulo de nuestra Guía de React, vimos cómo podíamos hacer multitud de cosas con JSX. De hecho, vimos la mayoría de las cosas que podemos hacer con el lenguaje pero me dejé una cosa para el final: Las listas.

Las listas están por todos lados en la web, puede no ser un elemento `ul` *per sé* pero tenemos:

* Listas de Tweets
* Listas de usuarios
* Listas de tarjetas de artículos
* *etc*

Es raro que no nos vayamos a encontrar un patrón que no tengamos que repetir en una web.

Si aun no has leído [Aprendiendo JSX](/posts/guia-react-aprendiendo-jsx/) te recomiendo que lo hagas ahora.

Como siempre, este artículo tiene un compañero audiovisual que puedes ver aquí:

https://youtu.be/-JM6Ie2IhU0

## Renderizando una lista

Las listas son muy útiles ya que nos permiten mostrar una lista de elementos (o componentes) en nuestra aplicación con el mismo formato. En JavaScript (y en la mayoría de lenguajes) usamos bucles a la hora de repetir acciones.

¿Cómo aborda esto React? Pues la librería nos lo pone simple y nos pide que usemos `.map`. La función `map` nos permite crear un array (o lista, arreglo o matriz) a partir de otra. Claro que podríamos hacer algo así:

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
    <ul>
      {letters.map(letter => (
        <li>{letter}</li>
      ))}
    </ul>
  );
}
```

Observa que estamos directamente devolviendo el resultado de `.map` (que va a ser otro array) dentro de una expresión de JSX (ya que se encuentra entre llaves).

## React y la propiedad `key`

Si abres la consola tras haber renderizado este código, verás un warning que reza así:

> Warning: Each child in a list should have a unique "key" prop.
> Check the render method of `MyList`

La propiedad `key` es un atributo especial que tienes que incluir a la hora de crear listas de elementos. Para *quitar* el aviso React nos pide que usemos un valor único para cada elemento. A priori podríamos utilizar la variable, `index` que obtenemos mientras usamos map:

```jsx
function MyList({ letters }) {
  return (
    <ul>
      {letters.map((letter, index) => (
        <li key={index}>{letter}</li>
      ))}
    </ul>
  );
}
```

Esto va a hacer que la alerta se vaya pero realmente no es una buena idea y ahora vamos a ver por qué.

### ¿Por qué necesito un atributo `key`?

Antes que nada, quiero mostrarte un pequeño ejemplo de porqué no es buena idea usar el atributo `index` y ahora veremos, en profundidad, qué está ocurriendo.

<iframe src="https://codesandbox.io/embed/gallant-kirch-w0t6k?fontsize=14&hidenavigation=1&theme=dark&view=preview"
style="width:100%; height:700px; border:0; border-radius: 4px; overflow:hidden;"
title="Problemas Listas React"
allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>

Sigue las instrucciones y rellena algo en cada input y luego dale click a "Añadir invitado". Observarás que se añade un invitado al principio de la lista y, que en el caso de la lista que usa los index, lo que has escrito sigue estando arriba (perteneciendo al nuevo invitado) mientras que en el de abajo no.

El código es similar en ambos casos:

```jsx
<div className="guest" key={index}>
  <p>Nombre: {guest.name}</p>
  <div className="form-field">
    <label htmlFor={guest.id}>Dirección</label>
    <input id={guest.id} type="text" />
  </div>
</div>
```

Y

```jsx
<div className="guest" key={guest.id}>
  <p>Nombre: {guest.name}</p>

  <div className="form-field">
    <label htmlFor={guest.id}>Dirección</label>
    <input id={guest.id} type="text" />
  </div>
</div>
```

Como ves, solo cambia el atributo `key`. En uno usamos `index` y en otro `guest.id`.

La explicación concienzuda es que, React necesita el atributo `key` para identificar los elementos en la lista. La librería usa un DOM virtual y solo re-renderiza los componentes que hayan cambiado desde la última vez.

La primera vez que se renderiza nuestra lista, React verá que queremos mostrar dos invitados y creará los nodos para ellos. La próxima vez que el componente se actualice React dirá, "ya tengo algunos de estos elementos dibujados - ¿han cambiado?" Y evitará recrear elementos en el DOM *si puede saber que los elementos son los mismos*.

:::info Nota

A este proceso se le conoce como Reconciliación y es parte de lo que hace que React sea tan eficiente. Puedes leer más en [la documentación oficial](https://es.reactjs.org/docs/reconciliation.html).

:::

React no puede saber de forma sencilla si un objeto es igual a otro porque cada nuevo objeto (aunque tenga las mismas propiedades) será distinto al anterior.

Es ahí donde entra en juego la propiedad `key`. React mira a la propiedad y dice, vale, aunque esta `<div>` que acabo de crear no sea `===` a la anterior, es la misma porque la `key` es idéntica.

Esto nos lleva a tener en cuenta algunas reglas para el atributo `key` que debe ser:

* **Único** - Cada elemento en la lista debe tener un índice único. `guest.name` es una m4a idea porque podría no ser único.
* **Permanente** - La `key` no debe cambiar entre re-renderizaciones por lo que usar `Math.random` no es una buena idea (además de que podría no ser única)

En este punto, tras haber leído eso quizá pienses: ¿no es un índice *único* y *permanente*?

Si sabes que la lista es estática, el índice es una solución válida. Pero si la lista puede ser reordénala donde un elemento con índice 1 esté ahora en el 4 entonces no es una solución válida. Esto puede ocurrir de manera manual (insertando/reordenando el array) o simplemente al obtener del servidor que vengan más elementos.

Ponte en el lado de React y piensa, vaya el elemento `0`, ese ya lo tenía mostrado, no necesito renderizarlo de nuevo. Esto es especialmente crítico con elementos que mantengan su propio *estado* como puede ser un `input` o tu propio componente con estado.

## Conclusión

Espero que hayas aprendido cómo renderizar listas de cosas en React y que hayas entendido porqué pasan ciertas cosas con la propiedad `key` que tenemos que tener en cuenta.

A modo de recopilación estas son las reglas:

* Siempre que utilices un bucle para renderizar en React, hay que facilitar un atributo `key` en el elemento o componente que devuelve.
* El atributo debe ser constante y único. No puedes usar algo como `Math.random()`.
* Idealmente usa un atributo `id`.
* Si no está disponible y como último recurso, usa el atributo index mientras la lista no vaya a ser reordénala.

## Reto

El reto que te propongo es convertir en componente lo que renderizan las listas de nuestro ejemplo. Ahora mismo no es muy DRY y el código se repite. Además las IDs se repiten en el formulario por lo que el navegador nos da más errores.

Si te animas a hacerlo me lo puedes [mandar por correo](/sobre-mi) o en [las discusiones de GitHub](https://github.com/Antonio-Laguna/curso-react/discussions).

*[JSX]: JavaScript XML
*[DOM]: Document Object Model
