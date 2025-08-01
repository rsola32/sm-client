import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../GitamBrand.css'
import '../AllPages.css'

export default function FacultyForm() {
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [mailId, setMailId] = useState('');
  const [designation, setDesignation] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [department, setDepartment] = useState('');
  const [password, setPassword] = useState('');

  // Example department list – replace with actual data if available
  const departmentOptions = ['Computer Science', 'Electronics', 'Mechanical', 'Business'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        employee_id: employeeId,
        employee_name: employeeName,
        employee_mail: mailId,
        designation,
        joining_date: joiningDate,
        department_name: department,
        password
      };

      const response = await fetch('http://localhost:3000/api/employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Employee added successfully:', data);
        // Reset the form
        setEmployeeId('');
        setEmployeeName('');
        setMailId('');
        setDesignation('');
        setJoiningDate('');
        setDepartment('');
        setPassword('');
      } else {
        const errorData = await response.json();
        console.error('Failed to add employee:', errorData);
      }
    } catch (error) {
      console.error('Error while adding employee:', error);
    }
  };

  return (
    <>
   
    <div className='top-div-space'>
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow gitam-form">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Add Employee</h3>
          <form onSubmit={handleSubmit}>
            {/* Employee ID */}
            <div className="mb-3">
              <label htmlFor="employeeId" className="form-label">Employee ID</label>
              <input
                type="text"
                className="form-control"
                id="employeeId"
                placeholder="Enter Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
              />
            </div>

            {/* Employee Name */}
            <div className="mb-3">
              <label htmlFor="employeeName" className="form-label">Employee Name</label>
              <input
                type="text"
                className="form-control"
                id="employeeName"
                placeholder="Enter Employee Name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                required
              />
            </div>

            {/* Mail ID */}
            <div className="mb-3">
              <label htmlFor="mailId" className="form-label">Mail ID</label>
              <input
                type="email"
                className="form-control"
                id="mailId"
                placeholder="Enter Mail ID"
                value={mailId}
                onChange={(e) => setMailId(e.target.value)}
                required
              />
            </div>

            {/* Designation */}
            <div className="mb-3">
              <label htmlFor="designation" className="form-label">Designation</label>
              <input
                type="text"
                className="form-control"
                id="designation"
                placeholder="Enter Designation"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                required
              />
            </div>

            {/* Joining Date (replaces Experience) */}
            <div className="mb-3">
                <label htmlFor="joiningDate" className="form-label">Joining Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="joiningDate"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  required
                />
              </div>

            {/* Department (dropdown) */}
            <div className="mb-3">
              <label htmlFor="department" className="form-label">Department</label>
              <select
                className="form-select"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departmentOptions.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn w-100 gitam-button" >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
    
    </>
  )
}
