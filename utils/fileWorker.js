const fs = require("fs");

const readDataFromFile = (filePath) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  return data;
};

const dumpDataToFile = (filePath, data) => {
  fs.writeFileSync(filePath, data);
};

const appendDataToFile = (filePath, new_data) => {
  return new Promise((resolve, reject) => {
    const data = readDataFromFile(filePath);
    const key = Object.keys(new_data)[0];
    data[key] = new_data[key];
    console.log(filePath);

    try {
      dumpDataToFile(filePath, JSON.stringify(data));
      resolve(true);
    } catch (error) {
      reject(false);
    }
  });
};
const cleanDataset = (filePath) => {
  dumpDataToFile(
    filePath,
    JSON.stringify(
      Object.entries(readDataFromFile(filePath)).reduce((acc, x) => {
        acc[x[0]] = x[1][0];
        return acc;
      }, {})
    )
  );
};

// cleanDataset("../dataset/E2V-Dataset.json");

const removeDataFromFile = (filePath, key) => {};

module.exports = { readDataFromFile, appendDataToFile, dumpDataToFile };
