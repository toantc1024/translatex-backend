const express = require("express");
const {
  dumpDataToFile,
  readDataFromFile,
  appendDataToFile,
} = require("./utils/fileWorker");
const Trie = require("./trie");
const Hash_dictionary = require("./hash-dictionary");
const WordBook = require("./wordbook");
const app = express();
app.use(express.json());
const port = 4000;
let dataset_path = "E2V-Dataset.json";

const data = readDataFromFile(`./dataset/${dataset_path}`);
let hash_dictionary = new Hash_dictionary(data);
let trie = new Trie();
let wordbook = new WordBook();

let words = [];

const load_data = () => {
  words = Object.keys(data);
  trie.build_trie(Object.keys(data)).then((result) => {
    const { time } = result;
    console.log(`Successfully loaded trie in ${time}ms`);
  });
  hash_dictionary.start_process().then((result) => {
    const { time, store } = result;
    console.log(
      `Successfully loaded hash in ${time}ms\nStored: ${store} words`
    );
  });
};

const getMostFrequentWord = () => {
  let max = 0;
  let word = "";
  for (let key in data) {
    if (data[key].freq > max) {
      max = data[key].freq;
      word = key;
    }
  }
  return word;
};

const randomElementFromArray = (array) => {
  if (!array.length) {
    return false;
  }
  let index = Math.floor(Math.random() * array.length);
  return array[index];
};

app.post("/random/get_random_words", (req, res) => {
  const { word, number } = req.body;

  let list = [];
  let i = 0;
  while (list.length < number) {
    // code
    let consensus = Math.floor(Math.random() * 5);
    if (consensus % 2 == 0 || consensus % 3 || consensus % 5 == 0) {
      // Get from trie
      let search_result = trie.suggest(word[0]);
      console.log(search_result);
      let ele = randomElementFromArray(search_result);
      if (ele && ele != word && !list.includes(ele)) {
        list.push(ele);
      }
    } else {
      // Get from words
      let ele = randomElementFromArray(words);
      if (ele && ele != word && !list.includes(ele)) {
        list.push(ele);
      }
    }

    i++;
  }

  if (list.length) {
    res.status(200);
    res.send({ words: list });
  } else {
    res.status(400);
    res.send({ status: "fail" });
  }
});

app.post("/delete", (req, res) => {
  const { word } = req.body;
  let result = hash_dictionary.delete(word);
  res.send({ result });
});

app.put("/add", async (req, res) => {
  const data = req.body;
  const word = Object.keys(data)[0];
  if (hash_dictionary.search(word) !== false) {
    res.status(400);
    res.send({ status: "existed" });
    return;
  }
  hash_dictionary.insert(data[word]);
  let response = await appendDataToFile(`./dataset/${dataset_path}`, data);

  if (response) {
    res.status(200);
    res.send({ status: "success" });
  } else {
    res.status(404);
    res.send({ status: "failed" });
  }
});

let history = [];
const addToHistory = (word) => {
  // Get current time
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();
  history.push({ word: word, time: timestamp });
};

app.get("/history", (req, res) => {
  res.status(200);
  res.send({ history: history });
});

app.post("/search", (req, res) => {
  // const data = JSON.parse(req.body);
  const { word } = req.body;

  result = hash_dictionary.search(word.toLowerCase());
  if (!result) {
    result = null;
  }

  // Translate result
  addToHistory(word);
  res.send({ word: result });
});

app.post("/suggest", (req, res) => {
  let { word } = req.body;

  let suggestList = trie.suggest(word.toLowerCase());
  console.log(suggestList);
  res.send({ suggest: suggestList });
});

app.get("/process", (req, res) => {
  let data = readDataFromFile(`./dataset/response.json`);
  console.log(data);

  let k = data.reduce((acc, obj) => {
    acc[obj[0]["word"]] = obj[0];
    return acc;
  }, {});
  console.log(k);

  dumpDataToFile(`./dataset/${dataset_path}`, JSON.stringify(k));
  res.send({ status: "success" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  load_data();
});

// Routes for wordbook
app.put("/wordbook/add", (req, res) => {
  const { word } = req.body;
  // if (wordbook.check_word(word)) {
  //   res.status(400);
  //   res.send({ status: "existed" });
  //   return;
  // }
  if (wordbook.insert_word(word)) {
    res.status(200);
    res.send({ status: true });
  } else {
    res.status(400);
    res.send({ status: false });
  }
});

app.get("/wordbook/generate_questions", (req, res) => {
  let questions = wordbook.generateQuestions();
  res.send({ questions });
});

app.get("/wordbook/get_memory", (req, res) => {
  res.send({ memory: wordbook.memory.getAllWord() });
});

app.get("/wordbook/get_memory_freq", (req, res) => {
  res.send({ freq: wordbook.memory.getFreq() });
});

app.post("/wordbook/update_freq", (req, res) => {
  const { word } = req.body;
  wordbook.updateFreq(word);
  res.send({ status: true });
});

app.post("/wordbook/add_memory", (req, res) => {
  const { word, type } = req.body;
  if (wordbook.addToMemory({ word, type })) {
    res.status(200);
    res.send({ status: true });
  } else {
    res.status(400);
    res.send({ status: false });
  }
});

app.get("/wordbook/get", (req, res) => {
  res.send({ words: wordbook.get_all_words() });
});

app.delete("/wordbook/delete", (req, res) => {
  const { uid } = req.body;
  if (wordbook.delete_word(uid)) {
    res.status(200);
    res.send({ status: true });
  } else {
    res.status(400);
    res.send({ status: false });
  }
});

app.post("/wordbook/check", (req, res) => {
  const { word } = req.body;
  let status = wordbook.check_word(word);
  res.status(200);
  res.send({ status: status });
});

app.get("/wordbook/get_random", (req, res) => {
  const { number } = req.body;
  res.send({ words: wordbook.get_random_words(number) });
});

app.get("/wordbook/get_by_group", (req, res) => {
  const { group } = req.body;
  res.send({ words: wordbook.get_words_by_group(group) });
});

app.post("/wordbook/suggest", (req, res) => {
  const { word } = req.body;
  res.send({ suggest: wordbook.suggest(word) });
});

// Routes for data object
app.get("/data/wordoftheday", (req, res) => {
  let keys = Object.keys(data);
  // Get key from keys by today hash
  let today = new Date();
  let today_hash = today.getDate() + today.getMonth() + today.getFullYear();
  let index = today_hash % keys.length;
  let word = keys[index];
  let result = hash_dictionary.search(word);

  res.send({ word: result });
});
