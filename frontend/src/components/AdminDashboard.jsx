// AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Fetch the user profile to check if it's admin based on email
        const token = localStorage.getItem("authToken"); // Assuming the JWT token is stored in localStorage
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/userProfile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userEmail = response.data.email;
        const adminEmails = ["admin@example.com", "superadmin@example.com"]; // Admin emails

        // Check if the user's email is in the adminEmails list
        if (adminEmails.includes(userEmail)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate("/"); // Redirect non-admin users
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAdmin(false);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isAdmin) {
    return <p>You are not authorized to access this page.</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p>Welcome to the Admin Panel!</p>
      {/* You can add more admin-specific features here */}
      <button
        onClick={() => navigate("/manage-users")}
        className="btn-primary"
      >
        Manage Users
      </button>
    </div>
  );
};

export default AdminDashboard;
