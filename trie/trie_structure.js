ALPHABET_SIZE = 26;

class TrieNode {
  constructor() {
    this.children = {};
    this.isWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  build_trie(data) {
    return new Promise((resolve, reject) => {
      const start_time = new Date().getTime();
      data.forEach((word) => this.insert(word));
      const end_time = new Date().getTime();
      resolve({ time: end_time - start_time });
    });
  }

  search(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      if (!node.children[word[i]]) {
        return false;
      }
      node = node.children[word[i]];
    }
    return node.isWord;
  }

  insert(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      if (!node.children[word[i]]) {
        node.children[word[i]] = new TrieNode();
      }
      node = node.children[word[i]];
    }
    node.isWord = true;
  }

  suggestHelper(node, list, curr) {
    if (node.isWord) {
      list.push(curr);
    }

    if (list.length >= 3) {
      return;
    }
    if (!Object.keys(node.children).length) return;

    for (let child in node.children) {
      this.suggestHelper(node.children[child], list, curr + child);
    }
  }

  suggest(prefix) {
    if (prefix.length == 0) return;

    let node = this.root;
    let curr = "";
    for (let i = 0; i < prefix.length; i++) {
      if (!node.children[prefix[i]]) {
        return [];
      }
      node = node.children[prefix[i]];
      curr = curr + prefix[i];
    }
    let list = [];
    this.suggestHelper(node, list, curr);
    return list;
  }
}

const test_trie = () => {
  let words = [
    "hello",
    "dog",
    "hell",
    "cat",
    "a",
    "hel",
    "help",
    "helps",
    "helping",
  ];
  let trie = new Trie();
  trie.build_trie(words);
  console.log(trie.suggest("hel"));

  console.log(trie.suggest("dog"));
};

// test_trie();

module.exports = Trie;
