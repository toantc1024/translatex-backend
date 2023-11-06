"use strict";

class Hash_dictionary {
  constructor(data, slot_size) {
    this.data = data;
    this.slot_size = slot_size;

    this.processed = true;

    if (!this.slot_size) {
      this.slot_size = 1048583;
    }

    this.hash_function = (string) =>
      this.string_to_integer_and_hash(string, this.slot_size);

    this.first_hash_table = null;
    this.alphabet_size = 128;
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

  test_hash() {
    console.log(this.search("shared"));
    console.log(this.search(""));
    // Bug when word not found we cause error!
  }

  delete(word) {
    const index_1 = this.hash_function(word);
    const index_2 = this.second_hash_function(
      this.first_hash_table[index_1].a,
      this.first_hash_table[index_1].b,
      this.first_hash_table[index_1].m,
      this.string_to_integer_and_hash(word, this.first_hash_table[index_1].m)
    );

    if (this.first_hash_table[index_1][index_2] != undefined) {
      delete this.first_hash_table[index_1][index_2];
    }
  }

  search(word) {
    const index_1 = this.hash_function(word);
    const index_2 = this.second_hash_function(
      this.first_hash_table[index_1].a,
      this.first_hash_table[index_1].b,
      this.first_hash_table[index_1].m,
      this.string_to_integer_and_hash(word, this.first_hash_table[index_1].m)
    );

    return this.first_hash_table[index_1].data[index_2];
  }

  string_to_integer_and_hash(string_data, mod) {
    return [...string_data].reduce((hash_value, char_value) => {
      return (
        (((hash_value * this.alphabet_size) % mod) + char_value.charCodeAt(0)) %
        mod
      );
    }, 0);
  }

  second_hash_function(a, b, m, key) {
    return (key * a + b) % m;
  }

  is_prime(n) {
    if (n <= 1) {
      return false;
    }
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    for (let i = 3; i * i <= n; i++) {
      if (n % i == 0) {
        return false;
      }
    }
    return true;
  }

  prime_larger_than_or_equal(n) {
    if (this.is_prime(n)) return n;
    return this.prime_larger_than_or_equal(n + 1);
  }

  does_not_collide(table) {
    const container = [...Array(table.m)].map((x) => null);
    table.data.forEach((item) => {
      const index = this.second_hash_function(
        table.a,
        table.b,
        table.m,
        this.string_to_integer_and_hash(item[0], table.m)
      );
      if (container[index] == null) container[index] = item[1];
      else return null;
    });
    return container;
  }

  build_hash() {
    this.first_hash_table = [...Array(this.slot_size)].map((row) => {
      return {
        a: 0,
        b: 0,
        m: 1,
        data: [],
      };
    });

    // Normal hash table
    Object.keys(this.data).forEach((item) => {
      const index = this.hash_function(item);
      const block = [item, this.data[item]];
      this.first_hash_table[index].data.push(block);
    });

    // Improve hash table
    const words_stored = Object.keys(this.data).length;
    delete this.data;

    const max_size = this.first_hash_table.reduce((curr_max, item) => {
      return Math.max(curr_max, item.data.length);
    }, this.first_hash_table[0].data.length || -Infinity);

    const prime = this.prime_larger_than_or_equal(max_size + 1);

    this.first_hash_table.forEach((table) => {
      if (table.data.length) {
        table.m = table.data.length * table.data.length;
        while (true) {
          table.b = Math.floor(Math.random() * prime);
          table.a = 1 + Math.floor(Math.random() * (prime - 1));
          const result = this.does_not_collide(table);
          if (result !== null) {
            table.data = result;
            return;
          }
        }
      }
    });

    return words_stored;
  }

  is_processed() {
    return this.processed;
  }

  store_local() {
    const file_name = "hashed_dictionary.json";
    const backup_data = { first_hash_table: this.first_hash_table };
    const fs = require("fs");
    fs.writeFileSync(file_name, backup_data);
  }

  load_from_local() {
    const file_name = "hased_dictionary.json";
    const fs = require("fs");
    const backup_data = fs.readFileSync(file_name);
    this.first_hash_table = JSON.parse(backup_data).first_hash_table;
    this.slot_size = this.primary_table.length;
    this.processed = true;
  }
}

module.exports = Hash_dictionary;
