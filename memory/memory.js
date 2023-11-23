const { LinkedListMemory } = require("../linkedlist");
const Trie = require("../trie");

class Memory {
  constructor() {
    this.comparator = (a, b) => {
      a.word == b.word && a.type == b.type;
    };
    this.memory = new LinkedListMemory(this.comparator);
    this.freq = {};
  }

  updateFreq(word) {
    if (this.freq[word]) {
      this.freq[word] += 1;
    } else {
      this.freq[word] = 1;
    }
  }

  getFreq() {
    return this.freq;
  }

  getAllWord() {
    return this.memory.getAllWord();
  }

  addToMemory(data) {
    this.updateFreq(data["word"]);
    if (!this.checkWord(data)) {
      this.memory.insert(data);
      return true;
    }
    return false;
  }

  checkWord(data) {
    console.log(data, this.memory.search(data["word"], data["type"]));
    return this.memory.search(data["word"], data["type"]) ? true : false;
  }
}

module.exports = Memory;
