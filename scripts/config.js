// Determine if we're running locally or on GitHub Pages
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Get the repository name from the URL path
const getRepoName = () => {
  const path = window.location.pathname;
  const parts = path.split('/').filter(Boolean);
  return parts[0] || '';
};

// Set the base URL based on environment
const baseUrl = isLocalhost ? '' : `/${getRepoName()}`;

export { baseUrl }; 