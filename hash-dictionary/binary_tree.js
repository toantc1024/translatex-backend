class Node {
  constructor(word) {
    this.word = word;
    this.left = null;
    this.right = null;
  }
}

class Binary_tree {
  constructor() {
    this.root = null;
  }

  insert(word) {
    const newNode = new Node(word);

    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(node, newNode) {
    if (newNode.word < node.word) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  search(word) {
    return this.searchNode(this.root, word);
  }

  searchNode(node, word) {
    if (node === null || node.word === word) {
      return node;
    }

    if (word < node.word) {
      return this.searchNode(node.left, word);
    }

    return this.searchNode(node.right, word);
  }
  getNodeValues() {
    const values = [];
    this.inOrderTraversal(this.root, values);
    return values;
  }

  inOrderTraversal(node, values) {
    if (node === null) {
      return;
    }

    this.inOrderTraversal(node.left, values);
    values.push(node.word);
    this.inOrderTraversal(node.right, values);
  }

  delete(word) {
    this.root = this.deleteNode(this.root, word);
  }

  deleteNode(root, word) {
    if (root === null) {
      return root;
    }

    if (word < root.word) {
      root.left = this.deleteNode(root.left, word);
    } else if (word > root.word) {
      root.right = this.deleteNode(root.right, word);
    } else {
      if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      }

      let successor = this.findMinNode(root.right);
      root.word = successor.word;
      root.right = this.deleteNode(root.right, successor.word);
    }

    return root;
  }

  findMinNode(node) {
    if (node.left === null) {
      return node;
    }
    return this.findMinNode(node.left);
  }
}
module.exports = Binary_tree;
