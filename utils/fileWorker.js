const fs = require("fs");

const readDataFromFile = (filePath) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  return data;
};

const dumpDataToFile = (filePath, data) => {
  fs.writeFileSync(filePath, data);
};

const appendDataToFile = (filePath, new_data) => {
  const data = readDataFromFile(filePath);
  // Maybe we want to know if new_data in data or not before append
  //

  const key = Object.keys(new_data)[0];
  data[key] = new_data[key];
  //   console.log(filePath, data);
  console.log(filePath);

  try {
    dumpDataToFile(filePath, JSON.stringify(data));
  } catch (error) {
    return false;
  }

  return true;
};

const removeDataFromFile = (filePath, key) => {};

module.exports = { readDataFromFile, appendDataToFile, dumpDataToFile };
