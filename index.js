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

const load_data = () => {
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

app.post("/search", (req, res) => {
  // const data = JSON.parse(req.body);
  const { word } = req.body;
  result = hash_dictionary.search(word.toLowerCase());
  if (!result) {
    result = null;
  }
  // Translate result

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
app.post("/wordbook/add", (req, res) => {
  const { word } = req.body;
  // if (wordbook.check_word(word)) {
  //   res.status(400);
  //   res.send({ status: "existed" });
  //   return;
  // }
  wordbook.insert_word(req.body);
  res.status(200);
  res.send({ status: "success" });
});

app.get("/wordbook/get", (req, res) => {
  res.send({ words: wordbook.get_all_words() });
});
