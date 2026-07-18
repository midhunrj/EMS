import React, { useEffect, useState } from 'react';
import { organizationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await organizationAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const departmentChartData = {
    labels: stats?.departmentStats?.map(d => d._id) || [],
    datasets: [
      {
        label: 'Employees',
        data: stats?.departmentStats?.map(d => d.count) || [],
        backgroundColor: [
          'rgba(14, 165, 233, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const roleChartData = {
    labels: stats?.roleStats?.map(r => r._id.replace('_', ' ')) || [],
    datasets: [
      {
        data: stats?.roleStats?.map(r => r.count) || [],
        backgroundColor: [
          'rgba(168, 85, 247, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#fff' : '#374151',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? '#9ca3af' : '#374151',
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
        },
      },
      y: {
        ticks: {
          color: darkMode ? '#9ca3af' : '#374151',
        },
        grid: {
          color: darkMode ? '#374151' : '#e5e7eb',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#fff' : '#374151',
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total Employees
              </p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {stats?.totalEmployees || 0}
              </p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Employees
              </p>
              <p className={`text-3xl font-bold text-green-600`}>
                {stats?.activeEmployees || 0}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Inactive Employees
              </p>
              <p className={`text-3xl font-bold text-red-600`}>
                {stats?.inactiveEmployees || 0}
              </p>
            </div>
            <div className="text-4xl">❌</div>
          </div>
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Departments
              </p>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {stats?.departmentStats?.length || 0}
              </p>
            </div>
            <div className="text-4xl">🏢</div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Employees by Department
          </h3>
          <Bar data={departmentChartData} options={chartOptions} />
        </div>

        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Employees by Role
          </h3>
          <Doughnut data={roleChartData} options={doughnutOptions} />
        </div>
      </div>

      {/* Department Breakdown */}
      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Department Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Department
                </th>
                <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Count
                </th>
                <th className={`text-left py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {stats?.departmentStats?.map((dept, index) => (
                <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {dept._id}
                  </td>
                  <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {dept.count}
                  </td>
                  <td className={`py-3 px-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {((dept.count / stats.totalEmployees) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
