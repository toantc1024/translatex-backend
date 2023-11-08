class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor(comparator) {
    this.head = null;
    this.comparator = comparator;

    if (!comparator) this.comparator = (a, b) => a === b;
  }

  delete(data) {
    if (this.head === null) return false;
    if (this.comparator(this.head.data, data)) {
      this.head = this.head.next;
      return true;
    }

    let current = this.head;
    let parent = current;

    while (current !== null && !this.comparator(current.data, data)) {
      parent = current;

      current = current.next;
    }

    if (current === null) {
      return false;
    }

    if (current === parent) {
      this.head = null;
    }

    parent.next = current.next;
    return true;
  }

  insert(data) {
    if (this.head == null) {
      this.head = new Node(data);
      return;
    }

    let node = new Node(data);
    node.next = this.head;
    this.head = node;
  }

  getAllWord() {
    let current = this.head;
    while (current != null) {
      console.log(current.data);
      current = current.next;
    }
  }

  find(data) {
    let current = this.head;
    while (current != null && !this.comparator(current.data, data)) {
      current = current.next;
    }

    if (current === null) {
      return false;
    }

    return current.data;
  }
}

class LinkedListWord {
  constructor() {
    this.comparator = (a, b) => {
      return a.word === b.word;
    };
    this.list = new LinkedList(this.comparator);
  }

  insert(data) {
    this.list.insert(data);
  }

  search(key) {
    return this.list.find({ word: key });
  }

  delete(key) {
    return this.list.delete({ word: key });
  }

  isEmpty() {
    return this.head === null;
  }
}

let testClass = () => {
  let wordList = new LinkedListWord();
  let words = ["hello"];
  words.forEach((word, i) => {
    wordList.insert({ word: word, key: i });
  });
};

testClass();

module.exports = LinkedListWord;