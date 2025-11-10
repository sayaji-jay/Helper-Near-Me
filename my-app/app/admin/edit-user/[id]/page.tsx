'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const AVAILABLE_WORK_TYPES = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'Mason',
  'Welder',
  'AC Technician',
  'Mechanic',
  'Gardener',
  'Cleaner',
  'Driver',
  'Cook',
  'Security Guard',
  'Helper',
  'Construction Worker',
  'House Keeping',
  'Other',
];

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);
  const [customWorkType, setCustomWorkType] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    work: [] as string[],
    address: '',
    village: '',
    city: '',
    state: '',
    companyName: '',
    experience: '',
    description: '',
    avatar: '',
  });

  // Fetch user data on component mount
  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId]);

  async function loadUserData() {
    setFetchingUser(true);
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (data.success && data.user) {
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          gender: data.user.gender || '',
          work: data.user.work || [],
          address: data.user.address || '',
          village: data.user.village || '',
          city: data.user.city || '',
          state: data.user.state || '',
          companyName: data.user.companyName || '',
          experience: data.user.experience || '',
          description: data.user.description || '',
          avatar: data.user.avatar || '',
        });
      } else {
        alert('Failed to load user data: ' + (data.error || 'Unknown error'));
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error loading user:', error);
      alert('Error loading user data. Check console for details.');
      router.push('/admin');
    } finally {
      setFetchingUser(false);
    }
  }

  const handleWorkToggle = (work: string) => {
    setFormData((prev) => ({
      ...prev,
      work: prev.work.includes(work)
        ? prev.work.filter((w) => w !== work)
        : [...prev.work, work],
    }));
  };

  const handleAddCustomWorkType = () => {
    const trimmedWorkType = customWorkType.trim();
    if (!trimmedWorkType) {
      alert('Please enter a work type');
      return;
    }
    if (formData.work.includes(trimmedWorkType)) {
      alert('This work type is already added');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      work: [...prev.work, trimmedWorkType],
    }));
    setCustomWorkType('');
  };

  const handleRemoveWorkType = (workToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      work: prev.work.filter((w) => w !== workToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation - Only name, phone, and work are required
    if (!formData.name.trim()) {
      alert('Please enter a name');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Please enter a phone number');
      return;
    }
    if (formData.work.length === 0) {
      alert('Please select at least one work type');
      return;
    }
    // Optional email validation - if provided, must be valid
    if (formData.email.trim() && !formData.email.includes('@')) {
      alert('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert('User updated successfully!');
        router.push('/admin');
      } else {
        alert('Failed to update user: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600 mt-2">Update the worker details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 1234567890"
              />
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender (Optional)
              </label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Work Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Type <span className="text-red-500">*</span>
              </label>

              {/* Predefined Work Types */}
              <div className="flex flex-wrap gap-2 mb-3">
                {AVAILABLE_WORK_TYPES.map((work) => (
                  <button
                    key={work}
                    type="button"
                    onClick={() => handleWorkToggle(work)}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      formData.work.includes(work)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {work}
                  </button>
                ))}
              </div>

              {/* Custom Work Type Input */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Or add custom work type:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customWorkType}
                    onChange={(e) => setCustomWorkType(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomWorkType();
                      }
                    }}
                    placeholder="Type custom work type..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomWorkType}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Work Types with Remove Option */}
              {formData.work.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">Selected:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.work.map((work, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {work}
                        <button
                          type="button"
                          onClick={() => handleRemoveWorkType(work)}
                          className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address (Optional)
              </label>
              <textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="House no, Street, Landmark..."
              />
            </div>

            {/* Village, City, State in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="village" className="block text-sm font-medium text-gray-700 mb-2">
                  Village (Optional)
                </label>
                <input
                  type="text"
                  id="village"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Village name"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City (Optional)
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City name"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State (Optional)
                </label>
                <input
                  type="text"
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="State name"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name (Optional)
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Current or previous company"
              />
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Experience (Optional)
              </label>
              <input
                type="text"
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 5 years, 10+ years, Fresher"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe work experience, specializations, and expertise..."
              />
            </div>

            {/* Avatar (Optional) */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL (Optional)
              </label>
              <input
                type="url"
                id="avatar"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave empty to keep auto-generated avatar
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating User...' : 'Update User'}
            </button>
            <Link
              href="/admin"
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
