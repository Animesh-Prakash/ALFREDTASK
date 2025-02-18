// AdminDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("authToken"); 
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/userProfile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userEmail = response.data.email;
        const adminEmails = ["admin@example.com", "superadmin@example.com"]; 

        if (adminEmails.includes(userEmail)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate("/"); 
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
