// js原型和原型链

function Person() {
  this.name = 'Person1_name'
}

const person = new Person()
person.age = 1

console.info(person)

function Person2() {}

Person2.prototype.name = 'Person2_name'
Person2.prototype.age = 1
const person2 = new Person2()
console.info(person2)

function Person3(name, age) {
  this.name = name
  this.age = age
}

const person3 = new Person3('Person3_name_param', 1)
console.info(person3)

const person3t1 = new Person3()
console.info(person3t1)

console.info(`person.__proto__ === Person.prototype:${Object.getPrototypeOf(person) === Person.prototype}`)
console.info(`Person === Person.prototype.constructor:${Person === Person.prototype.constructor}`)
