import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../AllPages.css'
import DescriptionPanel from '../DescriptionPanel.jsx';

export default function DisplayCourses() {

    const [courses, setCourses] = useState([]);

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  //const [schoolFilter, setSchoolFilter] = useState('');
  //const [caiaFilter, setCaiaFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetch('http://localhost:3000/api/course')
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((error) => console.error('Error fetching course data:', error));
  }, []);

  // Create unique options for each dropdown (remove duplicates)
  const categoryOptions = [...new Set(courses.map((c) => c.course_category))];
  const deptOptions = [...new Set(courses.map((c) => c.department_short_name))];
  //const schoolOptions = [...new Set(courses.map((c) => c.school_name))];
  //const caiaOptions = [...new Set(courses.map((c) => c.caia_coordinator_id))];

  // Filter the data based on dropdowns and search term
  const filteredCourses = courses.filter((course) => {
    // Filter by Course Category
    if (categoryFilter && course.course_category !== categoryFilter) {
      return false;
    }
    // Filter by Department Name
    if (deptFilter && course.department_short_name !== deptFilter) {
      return false;
    }
    // Filter by School Name
    //if (schoolFilter && course.school_name !== schoolFilter) {
    //  return false;
    //}
    // Filter by CAIA Coordinator
    //if (caiaFilter && course.caia_coordinator !== caiaFilter) {
    //  return false;
    //}
    // Universal Search (case-insensitive, checks all fields)
    const combinedString = Object.values(course).join(' ').toLowerCase();
    if (!combinedString.includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });
  

  return (
    <>
    <a href="/home" className="btn btn-primary"> Home </a>
    <div className="container my-4">
      <h2 className="mb-4">Course Details</h2>

{/* Universal Search */}
<div className="row mb-4">
        <div className="col-sm-6 col-md-4">
          <input
            type="text"
            id="searchTerm"
            className="form-control"
            placeholder="Search any field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="row g-3 mb-3">
        {/* Course Category Filter */}
        <div className="col-sm-6 col-md-3">
          <label htmlFor="categoryFilter" className="form-label">
            Course Category
          </label>
          <select
            id="categoryFilter"
            className="form-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Department Name Filter */}
        <div className="col-sm-6 col-md-3">
          <label htmlFor="deptFilter" className="form-label">
            Department Name
          </label>
          <select
            id="deptFilter"
            className="form-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All</option>
            {deptOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* Course Table */}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-success">
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Category</th>
              <th>Department</th>
              <th>Course Coordinator</th>
              <th>Course Champion</th>
              <th>CAIA SPOC</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course,i) => (
                <tr key={course.course_id}>
                  <td>{course.course_id}</td>
                  <td>{course.course_name}</td>
                  <td>{course.course_category}</td>
                  <td>{course.department_short_name}</td>
                  <td>{course.course_coordinator_id}</td>
                  <td>{course.course_champion_id}</td>
                  <td>{course.caia_coordinator_id}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No courses found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </>
  )
}