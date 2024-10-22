const { data } = require('./data');
const fs = require('fs');
const path = require('path');

// Path for saving the index file
const INDEX_FILE_PATH = path.join(__dirname, 'animalIndex.json');

// Building an inverted index for all substrings of each animal's name
const buildAnimalIndex = (data) => {
  const animalIndex = {};

  data.forEach(country => {
    country.people.forEach(person => {
      person.animals.forEach(animal => {
        const name = animal.name.toLowerCase();
        // indexing substrings of the animal's name
        for (let i = 0; i < name.length; i++) {
          for (let j = i + 1; j <= name.length; j++) {
            const substring = name.slice(i, j);
            
            if (!animalIndex[substring]) {
              animalIndex[substring] = [];
            }

            // storing references to the animal, person, and country
            animalIndex[substring].push({
              animalName: animal.name,
              countryRef: country,
              personRef: person
            });
          }
        }
      });
    });
  });

  return animalIndex;
};

// Saving the index to file for later using
const saveAnimalIndexToFile = (animalIndex) => {
  fs.writeFileSync(INDEX_FILE_PATH, JSON.stringify(animalIndex), 'utf8');
};

// Loading index from file if exist
const loadAnimalIndexFromFile = () => {
  if (fs.existsSync(INDEX_FILE_PATH)) {
    const indexData = fs.readFileSync(INDEX_FILE_PATH, 'utf8');
    return JSON.parse(indexData);
  }
  return null; // Returning null if no index file
};

// Rebuilding the index and saving again
const reindex = () => {
  console.log('Rebuilding the index...');
  const animalIndex = buildAnimalIndex(data);
  saveAnimalIndexToFile(animalIndex);
  console.log('Index rebuilt and saved.');
};

// Using the inverted index to filter animals by a pattern
const filterData = (pattern, animalIndex) => {
  const patternLower = pattern.toLowerCase();

  // If the pattern is not found in the index, return undefined
  if (!animalIndex[patternLower]) {
    return undefined;
  }

  const resultMap = new Map();

  // Going thru the animals in index and matching pattern
  animalIndex[patternLower].forEach(entry => {
    const { countryRef, personRef, animalName } = entry;

    //  Making sure country is in result
    if (!resultMap.has(countryRef.name)) {
      resultMap.set(countryRef.name, {
        name: countryRef.name,
        people: new Map()
      });
    }

    // Making sure person is in result under country
    const country = resultMap.get(countryRef.name);
    if (!country.people.has(personRef.name)) {
      country.people.set(personRef.name, {
        name: personRef.name,
        animals: []
      });
    }

    // Adding matching animal to person
    const person = country.people.get(personRef.name);
    person.animals.push({ name: animalName });
  });

  // Converting the resultMap back to the normal object structure
  const finalResult = Array.from(resultMap.values()).map(country => ({
    name: country.name,
    people: Array.from(country.people.values())
  }));

  return finalResult.length > 0 ? finalResult : undefined;
};

// function to count the number of children
const countChildren = (data) => {
  if (!data || data.length === 0) return;

  return data.map(country => {
    const people = country.people.map(person => {
      const animals = person.animals;
      return { name: `${person.name} [${animals.length}]`, animals };
    });

    return { name: `${country.name} [${people.length}]`, people };
  });
};

// Pretty print a json
const prettyPrint = (item) => {
  if (!item) return;
  console.log(JSON.stringify(item, null, 2));
};

// Command handler for --filter
const handleFilter = (pattern, animalIndex) => {
  if (!pattern) {
    console.log('Pattern is missing');
    return;
  }
  const filteredData = filterData(pattern, animalIndex);
  if (!filteredData) {
    console.log('No matching animals found');
  } else {
    prettyPrint(filteredData);
  }
};

// Command handler for --count
const handleCount = () => {
  const countedData = countChildren(data);
  prettyPrint(countedData);
};

// Command recipe
const commandMap = {
  '--filter': (arg) => handleFilter(arg, animalIndex),
  '--count': () => handleCount(),
  '--reindex': () => reindex(),
};

// Parsing arguments
const args = process.argv.slice(2);
const command = args[0] && args[0].split('=')[0]; // Command extraction
const arg = args[0] && args[0].split('=')[1]; // Argument extraction for filter

// Loading index from file if exists; otherwise building it
let animalIndex = loadAnimalIndexFromFile();

if (!animalIndex) {
  console.log('Building the index for the first time...');
  animalIndex = buildAnimalIndex(data);
  saveAnimalIndexToFile(animalIndex); // Saving the index
} else {
  console.log('Loaded index from file.');
}

// CLI Command execution
if (commandMap[command]) {
  commandMap[command](arg);
} else {
  console.log('Invalid command');
}

module.exports = {
  countChildren,
  filterData,
  buildAnimalIndex,
  saveAnimalIndexToFile,
  loadAnimalIndexFromFile,
  reindex,
};
