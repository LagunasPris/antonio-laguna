---
title: Métodos de clase y métodos y propiedades estáticas y privadas en JavaScript
socialTitle: 'Métodos y propiedades y métodos privados en clases de JS'
description: Repasamos las novedades sobre clases que Babel incluye por defecto y que están por llegar en ES2021.
date: 2021-05-03
tags:
- JS
postTweet: '1389140613820567554'
---

Hace unos días que Babel sacó su versión 7.14 que viene con soporte nativo para campos de clase y métodos y propiedades privadas. Puedes [leer el anuncio en el blog de babel](https://babeljs.io/blog/2021/04/29/7.14.0).

Este comportamiento ya estaba disponible antes pero usando plugins externos pero el comité del TC39 [decidió](https://github.com/tc39/agendas/blob/master/2021/04.md) mover estas características a Fase 4 (la última) lo cual implica que se espera que llegue a navegadores "pronto" con la nueva spec que será ES2021.

Vamos a ver rápidamente qué es cada cosa.

## Campos de clase

Los campos de clase nos permiten sacar del constructor las definiciones de las propiedades haciendo así que las clases sean más sencillas de leer y comprender a simple vista.

Sin campos de clase:

```js
class Tracker {
  constructor() {
    this.debug = false;
    this.tracker = window.ga;
    this.currentPage = null;
  }
}
```

Con campos de clase:

```js
class Tracker {
  debug = false;
  tracker = window.ga;
  currentPage = null;
  // Sin definir pero no tengo que mirar al constructor para saber que existe
  options;

  constructor(options) {
    this.options = options;
  }
}
```

Esto acerca JavaScript a otros lenguajes con un modelo de objetos más maduros.

## Campos y métodos estáticos

En las clases ahora podemos definir métodos y propiedades estáticas que nos permiten acceder a ellas sin necesidad de instancias la clase en sí:

```js
class Cuadrado {
  static lados = 4;
  static debug() {
    console.log(`Tengo ${Cuadrado.lados} lados`);
  }
}

console.log(Cuadrado.lados); // 4
Cuadrado.debug(); // Tengo 4 lados
```

## Campos y métodos privados

Para completar el círculo ahora podemos usar métodos y propiedades privadas también. Hasta ahora no hemos tenido control sobre proteger métodos y/o propiedades pero pronto podremos hacerlo de forma nativa.

```js
class Pokemon {
  #id;
  #name;

  constructor(id, name) {
    this.#id = id;
    this.#name = name;
  }

  get name() {
    return this.#name;
  }

  renombrar(nombre) {
    this.#name = nombre;
  }
}

const pikachu = new Pokemon(25, 'Pikachu');

pikachu.#id = 26; // Error
console.log(pikachu.#name); // Error
console.log(pikachu.name); // Pikachu;
pikachu.renombrar('Ratón');
console.log(pikachu.name); // Ratón;
```

## Conclusión

JavaScript es un lenguaje que ha ido dirigiéndose hacia el ámbito funcional aunque ha ido ganando características poco a poco en el campo de la programación orientada a objetos.

Personalmente voy a seguir usando funciones, al menos de momento, en la mayoría de las cosas pero está bien ver cómo el lenguaje evoluciona y reduce su barrera frente a otros lenguajes más maduros en este aspecto.
