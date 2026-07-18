import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();

  const canCreate = user?.role === 'super_admin' || user?.role === 'hr_manager';
  const canEdit = user?.role === 'super_admin' || user?.role === 'hr_manager';
  const canDelete = user?.role === 'super_admin';

  useEffect(() => {
    fetchEmployees();
  }, [search, department, role, status, sortBy, sortOrder, page]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        department,
        role,
        status,
        sortBy,
        sortOrder,
        page,
        limit: 10,
      });

      const response = await axios.get(`http://localhost:5000/api/employees?${params}`);
      setEmployees(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Employees
        </h2>
        {canCreate && (
          <button
            onClick={() => navigate('/employees/new')}
            className="px-4 py-2 text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
          >
            Add Employee
          </button>
        )}
      </div>

      {/* Filters */}
      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name or email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
              <option value="IT">IT</option>
              <option value="Legal">Legal</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            >
              <option value="">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="hr_manager">HR Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Sort By
            </label>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="joiningDate-asc">Joining Date (asc)</option>
              <option value="joiningDate-desc">Joining Date (desc)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} onClick={() => handleSort('name')}>
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</th>
                <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department</th>
                <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</th>
                <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Status</th>
                <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Manager</th>
                <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}   className={`group border-b ${ darkMode ? 'border-gray-700' : 'border-gray-200' } hover:bg-gray-50 dark:hover:bg-gray-700`}
>
                  <td  className={`py-3 px-4 ${darkMode ? 'text-gray-300 group-hover:text-white': 'text-gray-700 group-hover:text-white'}`}>
                    <div className="flex items-center space-x-3">
                      {employee.profileImage ? (
                        <img src={employee.profileImage} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 font-bold text-white rounded-full bg-primary-500">
                          {employee.name.charAt(0)}
                        </div>
                      )}
                      <span>{employee.name}</span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 ${darkMode  ? 'text-gray-300 group-hover:text-white': 'text-gray-700 group-hover:text-white'}`}>{employee.email}</td>
                 <td className={`py-3 px-4 ${darkMode  ? 'text-gray-300 group-hover:text-white': 'text-gray-700 group-hover:text-white'}`}>{employee.department}</td>
                  <td className={`py-3 px-4`}>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      employee.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                      employee.role === 'hr_manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {employee.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`py-3 px-4`}>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      employee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {employee.status}
                    </span>
                  </td>
                 <td className={`py-3 px-4 ${darkMode  ? 'text-gray-300 group-hover:text-white': 'text-gray-700 group-hover:text-white'}`}>
                    {employee.reportingManager?.name || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/employees/${employee._id}`)}
                        className="text-blue-600 hover:text-blue-100"
                      >
                        View
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => navigate(`/employees/${employee._id}/edit`)}
                          className="text-green-600 hover:text-green-100"
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && employee.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDelete(employee._id)}
                          className="text-red-600 hover:text-red-100"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Page {page} of {pagination.pages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.pages}
              className="px-4 py-2 text-white rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeList;
