import React, { useEffect, useState, useRef } from 'react';
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
                  name="site"
                  onChange={handleChange}
                  placeholder="Site"
                  className="p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
                <input
                  value={form.username}
                  name="username"
                  onChange={handleChange}
                  placeholder="Username"
                  className="p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  value={form.password}
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  className="p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                />
                <button
                  onClick={savePassword}
                  className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Save Password
                </button>
                <div>
                  {passwordArray.map((pass, index) => (
                    <div key={index} className="bg-gray-700 p-4 mb-4 rounded-lg border border-gray-600">
                      {editingIndex === index ? (
                        <div>
                          <input
                            value={newSite}
                            onChange={(e) => setNewSite(e.target.value)}
                            placeholder="Site"
                            className="p-2 rounded-lg bg-gray-600 border border-gray-500 text-white"
                          />
                          <input
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Username"
                            className="p-2 rounded-lg bg-gray-600 border border-gray-500 text-white"
                          />
                          <input
                            type={passwordVisible ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Password"
                            className="p-2 rounded-lg bg-gray-600 border border-gray-500 text-white"
                          />
                          <button
                            onClick={() => saveEditedPassword(index)}
                            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingIndex(null)}
                            className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p>Site: {pass.site}</p>
                          <p>Username: {pass.username}</p>
                          <p>Password: {pass.password}</p>
                          <button
                            onClick={() => copyToClipboard(pass.password, 'Password')}
                            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 px-2 rounded-lg mr-2"
                          >
                            Copy Password
                          </button>
                          <button
                            onClick={() => startEditing(index)}
                            className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-1 px-2 rounded-lg mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePassword(index)}
                            className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-2 rounded-lg"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col p-4 text-white gap-6">
              {login ? (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                  <button
                    onClick={handleLogin}
                    className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setLogin(false)}
                    className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Switch to Signup
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="p-2 rounded-lg bg-gray-700 border border-gray-600 text-white"
                  />
                  <button
                    onClick={handleSignup}
                    className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Signup
                  </button>
                  <button
                    onClick={() => setLogin(true)}
                    className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Switch to Login
                  </button>
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
