import React, { useState, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { FaFileDownload, FaSearch, FaChevronDown } from 'react-icons/fa';
import generateEmployeeData, { getUniqueValues } from '../utils/mockData';
import Papa from 'papaparse';

const ROWS_PER_PAGE = 8;
const employeeData = generateEmployeeData(30);

const DataTable = () => {
  const [data] = useState(employeeData);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [columnFilters, setColumnFilters] = useState({});
  const [columnWidths, setColumnWidths] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);

  // Column display names mapping
  const columnLabels = {
    empId: 'Employee ID',
    name: 'Name',
    email: 'Email',
    department: 'Department',
    location: 'Office Location',
    workMode: 'Work Mode',
    joinYear: 'Join Year'
  };

  // Get unique values for each filterable column
  const uniqueValues = useMemo(() => {
    const result = {};
    Object.keys(data[0]).forEach(column => {
      if (!['email'].includes(column)) {
        result[column] = getUniqueValues(data, column);
      }
    });
    return result;
  }, [data]);

  // Sorting logic
  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (sortConfig.key === 'joinYear') {
          return sortConfig.direction === 'asc' 
            ? parseInt(a[sortConfig.key]) - parseInt(b[sortConfig.key])
            : parseInt(b[sortConfig.key]) - parseInt(a[sortConfig.key]);
        }
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  // Filtering logic
  const filteredData = useMemo(() => {
    return sortedData.filter(item => {
      // Global search
      const matchesSearch = Object.values(item).some(
        value => value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Column filters
      const matchesFilters = Object.entries(columnFilters).every(([key, value]) => {
        if (!value) return true;
        return item[key].toString().toLowerCase().includes(value.toLowerCase());
      });

      return matchesSearch && matchesFilters;
    });
  }, [sortedData, searchQuery, columnFilters]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ROWS_PER_PAGE);
  }, [filteredData, currentPage]);

  const pageCount = Math.ceil(filteredData.length / ROWS_PER_PAGE);

  // Column resize handler
  const handleColumnResize = (column, width) => {
    setColumnWidths(prev => ({
      ...prev,
      [column]: width
    }));
  };

  // Export to CSV with formatted headers
  const exportToCSV = () => {
    const formattedData = filteredData.map(item => {
      const formattedItem = {};
      Object.keys(item).forEach(key => {
        formattedItem[columnLabels[key]] = item[key];
      });
      return formattedItem;
    });

    const csv = Papa.unparse(formattedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'employee-data.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Search and Export */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <FaFileDownload />
          Export to CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow">
        <table className="min-w-full bg-sky-50">
          <thead>
            {/* Filter row */}
            <tr>
              {Object.keys(data[0]).map(column => (
                <th key={`filter-${column}`} className="border-b p-2 bg-sky-100">
                  <div className="relative">
                    {column === 'email' ? (
                      <input
                        type="text"
                        placeholder="Filter email..."
                        className="w-full p-1 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        value={columnFilters[column] || ''}
                        onChange={(e) => setColumnFilters(prev => ({
                          ...prev,
                          [column]: e.target.value
                        }))}
                      />
                    ) : (
                      <>
                        <button
                          className="w-full p-1 text-sm border rounded bg-white flex items-center justify-between"
                          onClick={() => setActiveFilter(activeFilter === column ? null : column)}
                        >
                          <span>
                            {columnFilters[column] || `Filter ${columnLabels[column]}`}
                          </span>
                          <FaChevronDown className={`transition-transform ${activeFilter === column ? 'rotate-180' : ''}`} />
                        </button>
                        {activeFilter === column && (
                          <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            <div 
                              className="p-1 hover:bg-sky-50 cursor-pointer text-sm"
                              onClick={() => {
                                setColumnFilters(prev => ({
                                  ...prev,
                                  [column]: ''
                                }));
                                setActiveFilter(null);
                              }}
                            >
                              Show All
                            </div>
                            {uniqueValues[column].map(value => (
                              <div
                                key={value}
                                className="p-1 hover:bg-sky-50 cursor-pointer text-sm"
                                onClick={() => {
                                  setColumnFilters(prev => ({
                                    ...prev,
                                    [column]: value
                                  }));
                                  setActiveFilter(null);
                                }}
                              >
                                {value}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </th>
              ))}
            </tr>
            {/* Header row */}
            <tr>
              {Object.keys(data[0]).map(column => (
                <th
                  key={column}
                  className="border-b p-3 bg-sky-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none relative"
                  style={{ width: columnWidths[column] }}
                >
                  <div className="flex items-center justify-between gap-2"
                    onClick={() => setSortConfig({
                      key: column,
                      direction: sortConfig.key === column && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                    })}>
                    {columnLabels[column]}
                    <div className="flex flex-col">
                      <ChevronUpIcon className={`w-3 h-3 ${sortConfig.key === column && sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <ChevronDownIcon className={`w-3 h-3 -mt-1 ${sortConfig.key === column && sortConfig.direction === 'desc' ? 'text-blue-500' : 'text-gray-400'}`} />
                    </div>
                  </div>
                  <div
                    className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-300 opacity-0 hover:opacity-100"
                    onMouseDown={e => {
                      const startX = e.pageX;
                      const startWidth = e.target.parentElement.offsetWidth;

                      const handleMouseMove = (e) => {
                        const width = startWidth + (e.pageX - startX);
                        handleColumnResize(column, Math.max(width, 100));
                      };

                      const handleMouseUp = () => {
                        document.removeEventListener('mousemove', handleMouseMove);
                        document.removeEventListener('mouseup', handleMouseUp);
                      };

                      document.addEventListener('mousemove', handleMouseMove);
                      document.addEventListener('mouseup', handleMouseUp);
                    }}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map(item => (
              <tr key={item.empId} className="hover:bg-sky-50 transition-colors">
                {Object.keys(item).map(key => (
                  <td key={key} className="p-3 text-sm">
                    {item[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * ROWS_PER_PAGE) + 1} to {Math.min(currentPage * ROWS_PER_PAGE, filteredData.length)} of {filteredData.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-sky-50 transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: Math.min(3, pageCount) }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-sky-50'} transition-colors`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
            disabled={currentPage === pageCount}
            className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-sky-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
