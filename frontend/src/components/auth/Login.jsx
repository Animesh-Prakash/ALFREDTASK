import React, { useState } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Set loading to true while awaiting response
  
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
  
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Store token
        localStorage.setItem("email", email); // Store email
        navigate("/flashcards"); // Redirect after successful login
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-md mx-auto my-16 p-8 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl text-center text-white mb-6">Login</h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-700 text-white rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-gray-700 text-white rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg"
          disabled={loading}  // Disable button when loading
        >
          {loading ? (
            <span>Loading...</span>  // Loading text
          ) : (
            "Login"
          )}
        </button>
      </form>

      <p className="text-center text-white mt-4">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-400 hover:underline">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;
