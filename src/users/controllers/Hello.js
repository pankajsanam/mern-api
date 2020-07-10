class Hello {
  constructor(name) {
    this.name = name;
  }

  print(lastName) {
    console.log('Hi Hello!');
    this.lastName = lastName;

    return {
      name: `${this.name} ${lastName}`
    };
  }
}

module.exports = Hello;
