const axios = require("axios");
const fs = require("fs");

const familyWords = [
  "family",
  "parent",
  "child",
  "sibling",
  "brother",
  "sister",
  "mother",
  "father",
  "grandmother",
  "grandfather",
  "grandchild",
  "grandson",
  "granddaughter",
  "uncle",
  "aunt",
  "niece",
  "nephew",
  "cousin",
  "husband",
  "wife",
  "son",
  "daughter",
  "stepmother",
  "stepfather",
  "stepson",
  "stepdaughter",
  "stepsister",
  "stepbrother",
  "half-brother",
  "half-sister",
  "in-laws",
  "mother-in-law",
  "father-in-law",
  "brother-in-law",
  "sister-in-law",
  "son-in-law",
  "daughter-in-law",
  "twins",
  "triplets",
  "quadruplets",
  "baby",
  "toddler",
  "teenager",
  "adult",
  "elder",
  "ancestor",
  "descendant",
  "generation",
  "relatives",
  "kin",
  "kinship",
  "lineage",
  "heritage",
  "descendants",
  "progeny",
  "clan",
  "tribe",
  "nuclear",
  "extended",
  "marriage",
  "wedding",
  "divorce",
  "single",
  "married",
  "widow",
  "widower",
  "orphan",
  "adoption",
  "foster",
  "guardian",
  "heritage",
  "genealogy",
  "pregnancy",
  "birth",
  "newborn",
  "infant",
  "childhood",
  "adolescence",
  "adulthood",
  "generation",
];

const fetchWordDefinitions = async (word) => {
  try {
    const response = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch definitions for ${word}: ${error}`);
  }
};

const fetchAllDefinitions = async () => {
  const definitions = [];
  for (const word of familyWords) {
    const wordDefinitions = await fetchWordDefinitions(word);
    definitions.push({ [word]: wordDefinitions });
  }
  return definitions;
};

fetchAllDefinitions().then((definitions) => {
  fs.writeFileSync("definitions.json", JSON.stringify(definitions, null, 2));
});
