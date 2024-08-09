export const isAuthenticated = () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
    const auth=localStorage.getItem("Token")
    return auth; // Return true if token exists, false otherwise
  };
  