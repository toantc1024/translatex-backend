const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;
const Hash_dictionary = require("./hash-dictionary");

const fs = require("fs");

const data = JSON.parse(fs.readFileSync("E2V-Dataset.json"));
const hash_dictionary = new Hash_dictionary(data);

hash_dictionary.start_process().then((result) => {
  const { time, store } = result;
  console.log(`Successfully loaded hash in ${time} with ${store} words`);
});

app.get("/search", (req, res) => {
  const { word } = req.body;
  result = hash_dictionary.search(word);
  if (result == undefined) {
  }
  res.send({ word: result });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
