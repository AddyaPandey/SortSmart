# SortSmart: Interactive Data Table

A modern and responsive data table solution built with React.js and TailwindCSS.

## Features

- Smart global search across all columns
- Column specific filters with dropdowns
- Sort any column (ascending or descending)
- Add new employees with a user friendly modal
- Delete employees with confirmation
- Responsive and mobile-friendly design
- Resizable columns
- Export to CSV
- Pagination
- Clean and modern UI with light sky blue theme

## Tech Stack

- React.js
- TailwindCSS
- PapaParse (CSV export)

## Quick Start

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd sortsmart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Search
- Use the global search bar to filter across all columns
- Type anything and see instant results

### Column Filters
- Click the filter button in any column header
- Select from available options in the dropdown
- Filter by-
  - Department (Frontend Dev, Backend Dev, UI/UX Design, QA Testing, DevOps)
  - Location (Mumbai, Bangalore, Delhi, Hyderabad, Pune, Chennai)
  - Work Mode (In-Office, Remote, Hybrid, On-Site)
  - Join Year (2020-2024)

### Sorting
- Click any column header to sort
- Click again to reverse sort order
- Visual indicators show current sort direction

### Adding Employees
- Click the delete "+" icon in the Actions column
- Fill in the required details
- All the fields are required

### Deleting Employees
- Click the delete "-" icon in the Actions column

### Export
- Click "Export to CSV" to download current filtered data
