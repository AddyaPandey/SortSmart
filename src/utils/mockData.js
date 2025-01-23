const generateMockData = (count = 30) => {
  const data = [];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  const locations = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'];
  const status = ['Active', 'On Leave', 'Contract', 'Remote'];
  const years = [2020, 2021, 2022, 2023, 2024];

  for (let i = 0; i < count; i++) {
    const year = years[Math.floor(Math.random() * years.length)];
    data.push({
      id: i + 1,
      name: `Employee ${i + 1}`,
      email: `employee${i + 1}@company.com`,
      department: departments[Math.floor(Math.random() * departments.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      status: status[Math.floor(Math.random() * status.length)],
      joinYear: year.toString()
    });
  }
  return data;
};

// Helper function to get unique values for a column
export const getUniqueValues = (data, column) => {
  if (column === 'joinYear') {
    return [...new Set(data.map(item => item[column]))].sort((a, b) => b - a); // Sort years in descending order
  }
  return [...new Set(data.map(item => item[column]))].sort();
};

export default generateMockData;
