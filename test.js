const { filterData, countChildren } = require('./app');

describe('filterData', () => {
  const data = [
    {
      name: 'Country A',
      people: [
        {
          name: 'Person A',
          animals: [
            { name: 'Cat' },
            { name: 'Dog' },
            { name: 'Fish' }
          ]
        },
        {
          name: 'Person B',
          animals: [
            { name: 'Cat' },
            { name: 'Bird' }
          ]
        }
      ]
    },
    {
      name: 'Country B',
      people: [
        {
          name: 'Person C',
          animals: [
            { name: 'Caterpillar' },
            { name: 'Cat' },
            { name: 'Cattle' }
          ]
        }
      ]
    }
  ];

  test('should filter data based on the pattern', () => {
    const pattern = 'Cat';
    const filteredData = filterData(pattern, data);

    const expectedData = [
      {
        name: 'Country A',
        people: [
          {
            name: 'Person A',
            animals: [
              { name: 'Cat' }
            ]
          },
          {
            name: 'Person B',
            animals: [
              { name: 'Cat' }
            ]
          }
        ]
      },
      {
        name: 'Country B',
        people: [
          {
            name: 'Person C',
            animals: [
              { name: 'Caterpillar' },
              { name: 'Cat' },
              { name: 'Cattle' }
            ]
          }
        ]
      }
    ];
  
    expect(filteredData).toEqual(expectedData);
  });
  

  test('should return undefined when no animals match across multiple countries', () => {
    const pattern = 'Elephant';
    const filteredData = filterData(pattern, data);

    expect(filteredData).toEqual(undefined);
  });

  test('should return undefined for empty data', () => {
    const pattern = 'Cat';
    const filteredData = filterData(pattern, []);

    expect(filteredData).toEqual(undefined);
  });

  test('should filter out people without animals matching the pattern', () => {
    const dataWithNoAnimals = [
      {
        name: 'Country D',
        people: [
          {
            name: 'Person E',
            animals: []
          },
          {
            name: 'Person F',
            animals: [{ name: 'Dog' }]
          }
        ]
      }
    ];
    const pattern = 'Cat';
    const filteredData = filterData(pattern, dataWithNoAnimals);

    expect(filteredData).toEqual(undefined);
  });
});

describe('countChildren', () => {
  const data = [
    {
      name: 'Country A',
      people: [
        {
          name: 'Person A',
          animals: [
            { name: 'Cat' },
            { name: 'Dog' },
            { name: 'Fish' }
          ]
        },
        {
          name: 'Person B',
          animals: [
            { name: 'Cat' },
            { name: 'Bird' }
          ]
        }
      ]
    }
  ];

  test('should count the number of children', () => {
    const countedData = countChildren(data);

    const expectedData = [
      {
        name: 'Country A [2]',
        people: [
          {
            name: 'Person A [3]',
            animals: [
              { name: 'Cat' },
              { name: 'Dog' },
              { name: 'Fish' }
            ]
          },
          {
            name: 'Person B [2]',
            animals: [
              { name: 'Cat' },
              { name: 'Bird' }
            ]
          }
        ]
      }
    ];

    expect(countedData).toEqual(expectedData);
  });

  test('should count correctly for country with no people', () => {
    const dataWithNoPeople = [
      {
        name: 'Country B',
        people: []
      }
    ];

    const countedData = countChildren(dataWithNoPeople);

    const expectedData = [
      {
        name: 'Country B [0]',
        people: []
      }
    ];

    expect(countedData).toEqual(expectedData);
  });

  test('should count correctly for multiple countries with a mix of people and animals', () => {
    const multiCountryData = [
      {
        name: 'Country A',
        people: [
          { name: 'Person A', animals: [{ name: 'Cat' }] },
          { name: 'Person B', animals: [] }
        ]
      },
      {
        name: 'Country B',
        people: [
          { name: 'Person C', animals: [{ name: 'Dog' }, { name: 'Fish' }] }
        ]
      }
    ];

    const countedData = countChildren(multiCountryData);

    const expectedData = [
      {
        name: 'Country A [2]',
        people: [
          { name: 'Person A [1]', animals: [{ name: 'Cat' }] },
          { name: 'Person B [0]', animals: [] }
        ]
      },
      {
        name: 'Country B [1]',
        people: [
          { name: 'Person C [2]', animals: [{ name: 'Dog' }, { name: 'Fish' }] }
        ]
      }
    ];

    expect(countedData).toEqual(expectedData);
  });

  test('should count correctly when all people have the same number of animals', () => {
    const sameAnimalsData = [
      {
        name: 'Country C',
        people: [
          { name: 'Person D', animals: [{ name: 'Cat' }] },
          { name: 'Person E', animals: [{ name: 'Dog' }] }
        ]
      }
    ];

    const countedData = countChildren(sameAnimalsData);

    const expectedData = [
      {
        name: 'Country C [2]',
        people: [
          { name: 'Person D [1]', animals: [{ name: 'Cat' }] },
          { name: 'Person E [1]', animals: [{ name: 'Dog' }] }
        ]
      }
    ];

    expect(countedData).toEqual(expectedData);
  });

  test('should count the number of children (case person with no animals)', () => {
    const countedData = countChildren([{
        name: 'Test Country',
        people: [
          {
            name: 'Test Person',
            animals: []
          }
        ]
    }]);

    const expectedData = [
      {
        name: 'Test Country [1]',
        people: [
          { name: 'Test Person [0]', animals: [] },
        ]
      }
    ];

    expect(countedData).toEqual(expectedData);
  });
});
