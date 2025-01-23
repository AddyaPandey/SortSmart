// Helper function to generate random Indian names
const generateIndianName = () => {
  const firstNames = ['Aarav', 'Aditi', 'Arjun', 'Diya', 'Ishaan', 'Kavya', 'Neha', 'Pranav', 'Riya', 'Vihaan'];
  const lastNames = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Verma', 'Malhotra', 'Reddy', 'Mehta', 'Joshi'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

// Helper function to generate company email
const generateEmail = (name) => {
  const companyDomain = 'adalat.ai';
  return `${name.toLowerCase().replace(' ', '.')}@${companyDomain}`;
};

const generateEmployeeData = (count = 30) => {
  const data = [];
  const techDepartments = ['Frontend Dev', 'Backend Dev', 'UI/UX Design', 'QA Testing', 'DevOps'];
  const indianOffices = ['Mumbai-HQ', 'Bangalore-TC', 'Delhi-NC', 'Hyderabad-TC', 'Pune-IT', 'Chennai-TP'];
  const workModes = ['In-Office', 'Remote', 'Hybrid', 'On-Site'];
  const startYear = 2020;
  const currentYear = new Date().getFullYear();

  for (let i = 0; i < count; i++) {
    const name = generateIndianName();
    const joinYear = (startYear + Math.floor(Math.random() * (currentYear - startYear + 1))).toString();
    
    data.push({
      empId: `AI${String(i + 1).padStart(3, '0')}`,
      name: name,
      email: generateEmail(name),
      department: techDepartments[Math.floor(Math.random() * techDepartments.length)],
      location: indianOffices[Math.floor(Math.random() * indianOffices.length)],
      workMode: workModes[Math.floor(Math.random() * workModes.length)],
      joinYear: joinYear
    });
  }
  return data;
};

// Get unique values for filtering, with custom sorting for different types
export const getUniqueValues = (data, column) => {
  const values = [...new Set(data.map(item => item[column]))];
  
  switch(column) {
    case 'joinYear':
      return values.sort((a, b) => b - a); // Newest first
    case 'location':
      return values.sort((a, b) => a.localeCompare(b)); // Alphabetical
    case 'empId':
      return values.sort(); // Default sorting
    default:
      return values.sort((a, b) => a.localeCompare(b));
  }
};

export default generateEmployeeData;
