const Trie = require("../trie");
const Memory = require("../memory");
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
    this.memory = new Memory();
  }

  insert_word(data) {
    if (this.trie.search(data["word"])) return false;
    data["uid"] = generate_uid(10);
    this.trie.insert(data["word"], data);
    data["group"] = null;
    this.words.push(data);
    return true;
  }

  addToMemory(data) {
    const { word, type } = data;

    return this.memory.addToMemory({ word, type });
  }

  updateFreq(word) {
    this.memory.updateFreq(word);
  }

  generateQuestions() {
    let questions = this.words.reduce((acc, word) => {
      let isFound = false;
      for (let i = 0; i < word["meanings"].length; i++) {
        let type = word["meanings"][i]["partOfSpeech"];
        let word_key = word["word"];
        if (this.memory.checkWord({ word: word_key, type: type })) {
          isFound = true;
          break;
        }
      }

      if (isFound) {
        return acc;
      } else {
        acc.push(word);
        return acc;
      }
    }, []);
    return questions;
  }

  check_word(word) {
    return this.trie.search(word);
  }

  // Check if uid is valid
  check_uid(uid) {
    return this.words.find((word) => word["uid"] === uid);
  }

  delete_word(uid) {
    if (!this.check_uid(uid)) return false;
    let word = this.words.find((word) => word["uid"] === uid);
    this.trie.remove(word["word"]);
    this.words = this.words.filter((word) => word["uid"] !== uid);
    return true;
  }

  get_all_words() {
    return this.words;
  }

  get_words_by_group(group) {
    return this.words.filter((word) => word["group"] === group);
  }

  suggest(word) {
    return this.trie.suggest(word);
  }

  get_random_words(number) {
    if (number >= this.words.length) {
      number = this.word.length;
    }

    let result = [];
    let random_index = [];
    while (random_index.length < number) {
      let index = Math.floor(Math.random() * this.words.length);
      if (!random_index.includes(index)) {
        random_index.push(index);
        result.push(this.words[index]);
      }
    }

    return result;
  }
}

module.exports = WordBook;
