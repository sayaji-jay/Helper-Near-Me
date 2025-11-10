'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  description: string;
  experience: string;
  avatar: string;
  createdAt: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [searchQuery]);

  async function loadUsers() {
    setLoading(true);
    try {
      let url = '/api/users?limit=100';
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
        setTotal(data.total);
      } else {
        console.error('Failed to load users:', data.error);
        alert('Failed to load users: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Error loading users. Check console for details.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setDeleting(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        alert('User deleted successfully');
        loadUsers();
      } else {
        alert('Failed to delete user: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Check console for details.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <div className="flex gap-3">
              <Link
                href="/"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                View Site
              </Link>
              <Link
                href="/admin/add-user"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + Add User
              </Link>
            </div>
          </div>
          <p className="text-gray-600">Manage all users in the system</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, location, or skills..."
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <p className="text-gray-600">
            Total Users: <span className="font-semibold text-gray-900">{total}</span>
            {searchQuery && (
              <span className="ml-4">
                Showing: <span className="font-semibold text-gray-900">{users.length}</span>
              </span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.location}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{user.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.experience}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(user.id)}
                          disabled={deleting === user.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleting === user.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className="bg-white shadow rounded-lg p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search query' : 'Get started by adding a new user'}
            </p>
            {!searchQuery && (
              <div className="mt-6">
                <Link
                  href="/admin/add-user"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  + Add User
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
