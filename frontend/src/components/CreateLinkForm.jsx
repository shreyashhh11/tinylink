import React, { useState } from 'react';

const CreateLinkForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    url: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Validate code format
  const isValidCode = (string) => {
    return /^[A-Za-z0-9]{6,8}$/.test(string);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form data
    if (!formData.url.trim()) {
      setError('URL is required');
      return;
    }

    if (!isValidUrl(formData.url)) {
      setError('Please enter a valid URL');
      return;
    }

    if (formData.code && !isValidCode(formData.code)) {
      setError('Custom code must be 6-8 alphanumeric characters');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: formData.url,
          code: formData.code || undefined
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Success - clear form and notify parent
        setFormData({ url: '', code: '' });
        onSuccess();
      } else if (response.status === 409) {
        setError('This code already exists. Please choose a different code.');
      } else {
        setError(data.error || 'Failed to create link');
      }
    } catch (error) {
      console.error('Error creating link:', error);
      setError('Failed to create link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate random code
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = Math.floor(Math.random() * 3) + 6; // 6-8 characters
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData(prev => ({ ...prev, code: result }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL Input */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
          Target URL *
        </label>
        <input
          type="url"
          id="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://example.com"
          className="input"
          disabled={loading}
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter the URL you want to shorten
        </p>
      </div>

      {/* Custom Code Input */}
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          Custom Code (Optional)
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="code"
            value={formData.code}
            onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toLowerCase() }))}
            placeholder="custom123"
            className="input flex-1"
            disabled={loading}
            pattern="[A-Za-z0-9]{6,8}"
            title="Code must be 6-8 alphanumeric characters"
          />
          <button
            type="button"
            onClick={generateRandomCode}
            className="btn btn-secondary"
            disabled={loading}
          >
            Random
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Leave empty for auto-generated code (6-8 characters)
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {formData.url && isValidUrl(formData.url) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700 mb-2">Preview:</p>
          <p className="text-sm">
            <span className="font-mono text-gray-600">
              {window.location.origin}/
            </span>
            <span className="font-mono font-medium text-blue-600">
              {formData.code || 'auto-generated'}
            </span>
            <span className="text-gray-500 ml-2">→ {formData.url}</span>
          </p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex space-x-3 pt-4 border-t">
        <button
          type="submit"
          disabled={loading || !formData.url}
          className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </div>
          ) : (
            'Create Link'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateLinkForm;
