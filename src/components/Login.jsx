import React, { useState } from 'react';
import './GitamBrand.css'
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';


export default function Login() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Ensure cookies are sent/received
        body: JSON.stringify({ employeeId, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
        setLoginStatus({
          message: data.message,
          color: data.message === "Login successful" ? "#00ff00" : "#ff0000"
        });
        // Optionally, after login, redirect the user
        setTimeout(() => {
          console.log('Entering home page');
          //setCookie('token',employeeId);
          //window.location.href = '/rating/add';
          navigate('/rating/add'); // or any protected route
          //window.location.href = '/home'; // Redirect to home or any other page
          //navigate('/home'); // Redirect to home or any other page
        }, 1000);
      } else {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        setLoginStatus({ message: errorData.message, color: "#ff0000" });
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginStatus({ message: "Network error", color: "#ff0000" });
    }
  };

  return (
    <>
     <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-sm gitam-form" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="employeeId" className="form-label">
                Employee ID / Email ID
              </label>
              <input
                type="text"
                className="form-control"
                id="employeeId"
                placeholder="Enter your Employee/Email ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn w-100 gitam-button">
              Submit
            </button>
          </form>
          <p style={{ color: loginStatus.color }}>{loginStatus.message}</p>
        </div>
      </div>
    </div>
    </>
  )
}
