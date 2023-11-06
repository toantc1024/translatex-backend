const express = require("express");
const {
  dumpDataToFile,
  readDataFromFile,
  appendDataToFile,
} = require("./utils/fileWorker");
const Trie = require("./trie");
const Hash_dictionary = require("./hash-dictionary");

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
    console.log(`Successfully loaded hash in ${time}ms with ${store} words`);
  });
};

app.post("/delete", (req, res) => {
  const { word } = req.body;
  // result =
});

app.put("/add", (req, res) => {
  const new_word = req.body;
  // console.log(new_word);
  const word = Object.keys(new_word)[0];
  if (hash_dictionary.search(word) != undefined) {
    res.status(400);
    res.send({ status: "existed" });
  }

  if (appendDataToFile(`./dataset/${dataset_path}`, new_word)) {
    res.status(200);
    load_data();
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
  if (result == undefined) {
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
