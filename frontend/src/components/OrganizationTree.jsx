import React, { useEffect, useState } from 'react';
import { organizationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const TreeNode = ({ node, darkMode, onNodeClick }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="ml-4">
      <div 
        className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
          darkMode ? 'text-gray-300' : 'text-gray-700 hover:text-white'
        }`}
        onClick={() => {
          setExpanded(!expanded);
          onNodeClick && onNodeClick(node);
        }}
      >
        <span className="text-gray-400">{expanded ? '▼' : '▶'}</span>
        {node.profileImage ? (
          <img src={node.profileImage} alt="" className="w-8 h-8 rounded-full" />
        ) : (
          <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-white rounded-full bg-primary-500">
            {node.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-medium">{node.name}</div>
          <div className="text-xs text-gray-300">{node.designation}</div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          node.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
          node.role === 'hr_manager' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {node.role.replace('_', ' ')}
        </span>
      </div>
      {expanded && node.reportees && node.reportees.length > 0 && (
        <div>
          {node.reportees.map(child => (
            <TreeNode key={child._id} node={child} darkMode={darkMode} onNodeClick={onNodeClick} />
          ))}
        </div>
      )}
    </div>
  );
};

const OrganizationTree = () => {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const { user } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      const response = await organizationAPI.getTree();
      setTree(response.data.data);
    } catch (error) {
    } finally {
      setLoading(false);
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
      <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Organization Hierarchy
      </h2>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tree View */}
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} lg:col-span-2`}>
          <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Reporting Structure
          </h3>
          {tree.length === 0 ? (
            <p className={`text-gray-500 ${darkMode ? 'text-gray-400' : ''}`}>
              No employees in the organization
            </p>
          ) : (
            <div className="space-y-2">
              {tree.map(node => (
                <TreeNode key={node._id} node={node} darkMode={darkMode} onNodeClick={setSelectedNode} />
              ))}
            </div>
          )}
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Employee Details
            </h3>
            <div className="space-y-4">
              {selectedNode.profileImage ? (
                <img src={selectedNode.profileImage} alt="" className="w-20 h-20 mx-auto rounded-full" />
              ) : (
                <div className="flex items-center justify-center w-20 h-20 mx-auto text-2xl font-bold text-white rounded-full bg-primary-500">
                  {selectedNode.name.charAt(0)}
                </div>
              )}
              <div className="text-center">
                <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {selectedNode.name}
                </h4>
                <p className={`text-sm text-gray-400 ${darkMode ? 'text-gray-400' : ''}`}>
                  {selectedNode.designation}
                </p>
              </div>
              <div className="space-y-2">
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Employee ID
                  </label>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedNode.employeeId}</p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Email
                  </label>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedNode.email}</p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Department
                  </label>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{selectedNode.department}</p>
                </div>
                <div>
                  <label className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Direct Reports
                  </label>
                  <p className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {selectedNode.reportees?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          How to Use
        </h3>
        <ul className={`list-disc list-inside space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          <li>Click on any employee to view their details</li>
          <li>Expand/collapse the tree by clicking the arrow icons</li>
          <li>The hierarchy shows reporting relationships between employees</li>
          <li>Employees without managers appear at the top level</li>
        </ul>
      </div>
    </div>
  );
};

export default OrganizationTree;
