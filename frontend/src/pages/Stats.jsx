import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Stats = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch link statistics
  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/links/${code}`);
      
      if (response.ok) {
        const data = await response.json();
        setLink(data);
      } else if (response.status === 404) {
        setError('Link not found');
      } else {
        throw new Error('Failed to fetch link stats');
      }
    } catch (error) {
      console.error('Error fetching link stats:', error);
      setError('Failed to fetch link statistics');
    } finally {
      setLoading(false);
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  // Generate a simple chart data
  const generateChartData = () => {
    if (!link.clicks || link.clicks === 0) return [];
    
    // Simple mock data - in a real app, this would come from analytics
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString(),
        clicks: Math.floor(Math.random() * Math.max(1, link.clicks / 7))
      });
    }
    return data;
  };

  useEffect(() => {
    fetchLinkStats();
  }, [code]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Link Not Found</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const chartData = generateChartData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Link Statistics</h2>
          <p className="mt-1 text-sm text-gray-500">
            Detailed analytics for <span className="font-mono bg-gray-100 px-2 py-1 rounded">{code}</span>
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Clicks</p>
              <p className="text-2xl font-semibold text-gray-900">{link.clicks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Last Clicked</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(link.lastClicked)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Created</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(link.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Link Details */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Link Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Code</label>
              <div className="flex items-center space-x-2">
                <code className="px-3 py-2 bg-gray-100 rounded-md font-mono text-sm flex-1">{code}</code>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="btn btn-secondary text-sm"
                  title="Copy code"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original URL</label>
              <div className="flex items-center space-x-2">
                <code className="px-3 py-2 bg-gray-100 rounded-md text-sm flex-1 break-all">{link.url}</code>
                <button
                  onClick={() => copyToClipboard(link.url)}
                  className="btn btn-secondary text-sm"
                  title="Copy URL"
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Short Link</label>
              <div className="flex items-center space-x-2">
                <code className="px-3 py-2 bg-gray-100 rounded-md text-sm flex-1">{window.location.origin}/{code}</code>
                <button
                  onClick={() => copyToClipboard(`${window.location.origin}/${code}`)}
                  className="btn btn-secondary text-sm"
                  title="Copy full link"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Chart (if there are clicks) */}
      {link.clicks > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Click Analytics</h3>
            <div className="h-32 flex items-end space-x-2">
              {chartData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${Math.max(item.clicks * 20, 2)}px` }}
                    title={`${item.date}: ${item.clicks} clicks`}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-center">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Daily click counts (mock data for demonstration)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
