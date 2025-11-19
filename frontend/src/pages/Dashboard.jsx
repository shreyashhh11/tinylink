import React, { useState, useEffect } from 'react';
import LinkTable from '../components/LinkTable';
import CreateLinkForm from '../components/CreateLinkForm';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch all links
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
      } else {
        throw new Error('Failed to fetch links');
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete link
  const deleteLink = async (code) => {
    if (!window.confirm('Are you sure you want to delete this link?')) {
      return;
    }

    try {
      const response = await fetch(`/api/links/${code}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLinks(links.filter(link => link.code !== code));
      } else {
        throw new Error('Failed to delete link');
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert('Failed to delete link');
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  // Filter links based on search term
  const filteredLinks = links.filter(link =>
    link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your shortened URLs and view click statistics
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Create New Link'}
        </button>
      </div>

      {/* Create Link Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Link</h3>
          <CreateLinkForm
            onSuccess={() => {
              setShowForm(false);
              fetchLinks();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Search */}
      <div className="flex justify-between items-center space-x-4">
        <div className="flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Search by code or URL..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
          />
        </div>
        <div className="text-sm text-gray-500">
          {filteredLinks.length} {filteredLinks.length === 1 ? 'link' : 'links'}
        </div>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading links...</span>
            </div>
          ) : filteredLinks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No matching links found' : 'No links yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first shortened link'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  Create Your First Link
                </button>
              )}
            </div>
          ) : (
            <LinkTable
              links={filteredLinks}
              onDelete={deleteLink}
              onCopy={copyToClipboard}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
