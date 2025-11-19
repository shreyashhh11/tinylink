import React from 'react';
import { Link } from 'react-router-dom';

const LinkTable = ({ links, onDelete, onCopy }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate URL if too long
  const truncateUrl = (url, maxLength = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Short Code</th>
            <th>Target URL</th>
            <th>Total Clicks</th>
            <th>Last Clicked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {links.map((link) => (
            <tr key={link.id} className="hover:bg-gray-50">
              <td>
                <div className="flex items-center">
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                    {link.code}
                  </code>
                  <button
                    onClick={() => onCopy(link.code)}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                    title="Copy code"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l-4-4m4 4l4-4" />
                    </svg>
                  </button>
                </div>
              </td>
              <td>
                <div className="max-w-xs">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm break-all"
                    title={link.url}
                  >
                    {truncateUrl(link.url)}
                  </a>
                </div>
              </td>
              <td>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-medium">{link.clicks}</span>
                </div>
              </td>
              <td>
                <span className="text-sm text-gray-600">
                  {formatDate(link.lastClicked)}
                </span>
              </td>
              <td>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/code/${link.code}`}
                    className="btn btn-secondary text-xs"
                  >
                    View Stats
                  </Link>
                  <button
                    onClick={() => onCopy(`${window.location.origin}/${link.code}`)}
                    className="btn btn-secondary text-xs"
                    title="Copy full link"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => onDelete(link.code)}
                    className="btn btn-danger text-xs"
                    title="Delete link"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;
