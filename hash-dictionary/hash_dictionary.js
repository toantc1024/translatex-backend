"use strict";
const { LinkedListWord } = require("../linkedlist");

class Hash_dictionary {
  constructor(data, slot_size) {
    if (!slot_size) {
      this.slot_size = 10000000;
    }
    this.data = data;
    this.alphabet_size = 128;

    this.table = new Array(this.slot_size);
    for (let i = 0; i < this.table.length; i++) {
      this.table[i] = new LinkedListWord();
    }

    this.hash_function = (string) =>
      this.string_to_integer_and_hash(string, this.slot_size);
  }

  start_process() {
    return new Promise((resolve, reject) => {
      const start_time = new Date().getTime();
      const return_data = this.build_hash();
      const end_time = new Date().getTime();
      this.processed = true;
      resolve({ time: end_time - start_time, store: return_data });
    });
  }

  delete(word) {
    let index = this.hash_function(word);
    return this.table[index].delete(word);
  }

  search(key) {
    let index = this.hash_function(key);
    return this.table[index].search(key);
  }

  insert(data) {
    // console.log("Added", data.word);
    let index = this.hash_function(data.word);
    this.table[index].insert(data);
  }

  string_to_integer_and_hash(string_data, mod) {
    return [...string_data].reduce((hash_value, char_value) => {
      return (
        (((hash_value * this.alphabet_size) % mod) + char_value.charCodeAt(0)) %
        mod
      );
    }, 0);
  }

  build_hash() {
    Object.keys(this.data).forEach((key) => {
      this.insert(this.data[key]);
    });

    const words_stored = Object.keys(this.data).length;
    delete this.data;
    return words_stored;
  }

  is_processed() {
    return this.processed;
  }
}

module.exports = Hash_dictionary;
