import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Manager = () => {
  const passwordRef = useRef();
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newSite, setNewSite] = useState("");
  const [authToken, setAuthToken] = useState(null);
  const [login, setLogin] = useState(true); // Toggle between login and signup
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds loading time

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  useEffect(() => {
    if (authToken) {
      axios.get('http://localhost:5000/passwords', { headers: { Authorization: `Bearer ${authToken}` } })
        .then(response => setPasswordArray(response.data))
        .catch(error => console.error('Error fetching passwords:', error));
    }
  }, [authToken]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  }

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const savePassword = () => {
    if (!form.site || !form.username || !form.password) {
      alert("Please fill in all fields to add a password!");
      return;
    }

    axios.post('http://localhost:5000/passwords', form, { headers: { Authorization: `Bearer ${authToken}` } })
      .then(response => {
        setPasswordArray([...passwordArray, response.data]);
        setForm({ site: "", username: "", password: "" });
        toast.success("Password details saved successfully!");
      })
      .catch(error => console.error('Error saving password:', error));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const copyToClipboard = (text, clipword) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Copied ${clipword} to clipboard!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setNewSite(passwordArray[index].site);
    setNewUsername(passwordArray[index].username);
    setNewPassword(passwordArray[index].password);
  };

  const saveEditedPassword = (index) => {
    const updatedPassword = {
      site: newSite,
      username: newUsername,
      password: newPassword
    };

    axios.put(`http://localhost:5000/passwords/${passwordArray[index]._id}`, updatedPassword, { headers: { Authorization: `Bearer ${authToken}` } })
      .then(response => {
        const updatedPasswords = [...passwordArray];
        updatedPasswords[index] = response.data;
        setPasswordArray(updatedPasswords);
        setEditingIndex(null);
        toast.success("Password details updated successfully!");
      })
      .catch(error => console.error('Error updating password:', error));
  };

  const deletePassword = (index) => {
    if (window.confirm("Are you sure you want to delete this password?")) {
      axios.delete(`http://localhost:5000/passwords/${passwordArray[index]._id}`, { headers: { Authorization: `Bearer ${authToken}` } })
        .then(() => {
          const updatedPasswords = [...passwordArray];
          updatedPasswords.splice(index, 1);
          setPasswordArray(updatedPasswords);
          toast.success("Password deleted successfully!");
        })
        .catch(error => console.error('Error deleting password:', error));
    }
  };

  const handleLogin = () => {
    axios.post('http://localhost:5000/login', credentials)
      .then(response => {
        setAuthToken(response.data.token);
        toast.success("Logged in successfully!");
      })
      .catch(error => toast.error("Login failed: " + error.response.data.message));
  };

  const handleSignup = () => {
    axios.post('http://localhost:5000/signup', credentials)
      .then(() => {
        toast.success("Signup successful! You can now log in.");
        setLogin(true);
      })
      .catch(error => toast.error("Signup failed: " + error.response.data.message));
  };

  const handleLogout = () => {
    setAuthToken(null);
    setPasswordArray([]);
    toast.info("Logged out successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[100vh] text-gray-900 dark:text-gray-100 dark:bg-gray-950">
        <div>
          <h1 className="text-xl md:text-7xl font-bold flex items-center">
            L
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 24 24"
              className="animate-spin"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM13.6695 15.9999H10.3295L8.95053 17.8969L9.5044 19.6031C10.2897 19.8607 11.1286 20 12 20C12.8714 20 13.7103 19.8607 14.4956 19.6031L15.0485 17.8969L13.6695 15.9999ZM5.29354 10.8719L4.00222 11.8095L4 12C4 13.7297 4.54894 15.3312 5.4821 16.6397L7.39254 16.6399L8.71453 14.8199L7.68654 11.6499L5.29354 10.8719ZM18.7055 10.8719L16.3125 11.6499L15.2845 14.8199L16.6065 16.6399L18.5179 16.6397C19.4511 15.3312 20 13.7297 20 12C20 11.8095 19.9978 11.8095 19.7065 10.8719L18.7055 10.8719Z"></path>
            </svg>
            ading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="w-full max-w-4xl p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          {authToken ? (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-white">
                <span className="text-green-400">&lt;</span>
                <span>Dozz Password</span>
                <span className="text-green-400">/&gt;</span>
              </h1>
              <p className="text-green-400 text-lg text-center mb-6">Your own Password Manager</p>

              <div className="flex flex-col p-4 text-white gap-8">
                <input
                  value={form.site}
                  onChange={handleChange}
                  placeholder="Enter website URL"
                  className="rounded-full border border-green-600 p-4 text-black"
                  type="url"
                  name="site"
                />
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter Username"
                    className="rounded-full border border-green-600 p-4 text-black"
                    type="text"
                    name="username"
                  />
                  <div className="relative flex-grow">
                    <input
                      ref={passwordRef}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter Password"
                      className="rounded-full border border-green-600 p-4 text-black"
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-100"
                    >
                      {passwordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <button
                  onClick={savePassword}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Save Password
                </button>
              </div>

              <div className="mt-8">
                {passwordArray.length > 0 ? (
                  <ul className="space-y-4">
                    {passwordArray.map((password, index) => (
                      <li key={index} className="bg-gray-700 p-4 rounded-lg shadow-md">
                        {editingIndex === index ? (
                          <>
                            <input
                              value={newSite}
                              onChange={(e) => setNewSite(e.target.value)}
                              placeholder="Update website URL"
                              className="rounded-full border border-green-600 p-2 text-black"
                            />
                            <input
                              value={newUsername}
                              onChange={(e) => setNewUsername(e.target.value)}
                              placeholder="Update Username"
                              className="rounded-full border border-green-600 p-2 text-black"
                            />
                            <input
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Update Password"
                              className="rounded-full border border-green-600 p-2 text-black"
                            />
                            <button
                              onClick={() => saveEditedPassword(index)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2"
                            >
                              Save Changes
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center">
                              <div>
                                <p><strong>Website:</strong> {password.site}</p>
                                <p><strong>Username:</strong> {password.username}</p>
                                <p><strong>Password:</strong> {password.password}</p>
                              </div>
                              <div className="flex space-x-4">
                                <img
                                  src="https://cdn-icons-png.flaticon.com/128/13170/13170070.png"
                                  alt="edit icon"
                                  width={30}
                                  className="inline-block mx-2 cursor-pointer"
                                  onClick={() => startEditing(index)}
                                />
                                <img
                                  src="https://cdn-icons-png.flaticon.com/128/6861/6861362.png"
                                  alt="delete icon"
                                  width={30}
                                  className="inline-block mx-2 cursor-pointer"
                                  onClick={() => deletePassword(index)}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-400">No passwords saved yet.</p>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full mt-8"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              {login ? (
                <>
                  <h2 className="text-2xl font-bold text-white mb-4">Login</h2>
                  <input
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    placeholder="Username"
                    className="rounded-full border border-green-600 p-4 text-black"
                    type="text"
                  />
                  <input
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Password"
                    className="rounded-full border border-green-600 p-4 text-black"
                    type="password"
                  />
                  <button
                    onClick={handleLogin}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Login
                  </button>
                  <p className="text-gray-400 mt-4">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setLogin(false)}
                      className="text-blue-400 underline"
                    >
                      Sign Up
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-white mb-4">Sign Up</h2>
                  <input
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    placeholder="Username"
                    className="rounded-full border border-green-600 p-4 text-black"
                    type="text"
                  />
                  <input
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    placeholder="Password"
                    className="rounded-full border border-green-600 p-4 text-black"
                    type="password"
                  />
                  <button
                    onClick={handleSignup}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Sign Up
                  </button>
                  <p className="text-gray-400 mt-4">
                    Already have an account?{' '}
                    <button
                      onClick={() => setLogin(true)}
                      className="text-blue-400 underline"
                    >
                      Login
                    </button>
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;



