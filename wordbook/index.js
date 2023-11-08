const Trie = require("../trie");

const generate_uid = (length) => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
};

class WordBook {
  constructor() {
    this.trie = new Trie();
    this.words = [];
  }

  insert_word(data) {
    data["uid"] = generate_uid(10);
    this.trie.insert(data["word"], data);
    data["group"] = null;
    this.words.push(data);
  }

  check_word(word) {
    return this.trie.search(word);
  }

  delete_word(word) {}

  get_all_words() {
    return this.words;
  }

  get_words_by_group() {}

  get_random_words(number) {
    if (number >= this.words.length) {
      number = this.word.length;
    }
  }
}

module.exports = WordBook;
