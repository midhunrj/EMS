import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [employee, setEmployee] = useState(null);
  const [reportees, setReportees] = useState([]);
  const [loading, setLoading] = useState(true);
  const canEdit = user?.role === 'super_admin' || user?.role === 'hr_manager';

  useEffect(() => {
    fetchEmployee();
    fetchReportees();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
      setEmployee(response.data.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportees = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employees/${id}/reportees`);
      setReportees(response.data.data);
    } catch (error) {
      console.error('Error fetching reportees:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className={`text-center py-12 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Employee not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Employee Details
        </h2>
        {canEdit && (
          <button
            onClick={() => navigate(`/employees/${id}/edit`)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Edit Employee
          </button>
        )}
      </div>

      {/* Employee Info Card */}
      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-start space-x-6">
          {employee.profileImage ? (
            <img src={employee.profileImage} alt={employee.name} className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center text-white text-3xl font-bold">
              {employee.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {employee.name}
            </h3>
            <p className={`text-gray-600 ${darkMode ? 'text-gray-400' : ''}`}>{employee.designation}</p>
            <div className="flex space-x-2 mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                employee.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                employee.role === 'hr_manager' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {employee.role.replace('_', ' ')}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                employee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {employee.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Employee ID
            </label>
            <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{employee.employeeId}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Email
            </label>
            <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{employee.email}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Phone
            </label>
            <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{employee.phone}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Department
            </label>
            <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>{employee.department}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Salary
            </label>
            <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>${employee.salary.toLocaleString()}</p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Joining Date
            </label>
            <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {new Date(employee.joiningDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Reporting Manager
            </label>
            <p className={`text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {employee.reportingManager ? (
                <button
                  onClick={() => navigate(`/employees/${employee.reportingManager._id}`)}
                  className="text-primary-600 hover:underline"
                >
                  {employee.reportingManager.name}
                </button>
              ) : (
                'None'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Direct Reports */}
      {reportees.length > 0 && (
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Direct Reports ({reportees.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Name</th>
                  <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</th>
                  <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Department</th>
                  <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Role</th>
                </tr>
              </thead>
              <tbody>
                {reportees.map(reportee => (
                  <tr key={reportee._id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <button
                        onClick={() => navigate(`/employees/${reportee._id}`)}
                        className="text-primary-600 hover:underline"
                      >
                        {reportee.name}
                      </button>
                    </td>
                    <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{reportee.email}</td>
                    <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{reportee.department}</td>
                    <td className={`py-3 px-4`}>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        reportee.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                        reportee.role === 'hr_manager' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {reportee.role.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;
