const { data } = require('./data');

// function to filter data based on the pattern
const filterData = (pattern, data) => {
  if (!data || data.length === 0) return;

  const result = data
    .map(country => {
      const people = country.people
        .map(person => {
          const animals = person.animals.filter(animal => animal.name.includes(pattern));
          return animals.length > 0 ? { name: person.name, animals } : null; // filter out people with no animals
        })
        .filter(person => person !== null); // remove null persons (with no animals)

      return people.length > 0 ? { name: country.name, people } : null; // filter out countries with no people
    })
    .filter(country => country !== null); // remove null countries (with no people)

  if (result.length > 0) return result;
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
const handleFilter = (pattern) => {
  if (!pattern) {
    console.log('Pattern is missing');
    return;
  }
  const filteredData = filterData(pattern, data);
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
  '--filter': (arg) => handleFilter(arg),
  '--count': () => handleCount(),
};

// Parsing arguments
const args = process.argv.slice(2);
const command = args[0] && args[0].split('=')[0]; // Command extraction
const arg = args[0] && args[0].split('=')[1]; // Argument extraction for filter

// CLI Command execution
if (commandMap[command]) {
  commandMap[command](arg);
} else {
  console.log('Invalid command');
}

module.exports = {
  countChildren,
  filterData,
};
