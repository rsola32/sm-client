import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './Card3D.css';
import '../AllPages.css';
import { v4 as uuidv4 } from 'uuid';
import HorizontalProgressBar from '../HorizontalProgressBar';
import DescriptionPanel from '../DescriptionPanel';

export default function FacultyMultipleCoursesMapping() {
  // State for courses data fetched from API.
  const [data, setData] = useState([]);
  // State for purpose options fetched from API.
  const [purposes, setPurposes] = useState([]);
  // State for the search term.
  const [searchTerm, setSearchTerm] = useState('');
  // State to store selected dropdown values for each course.
  const [selectedOptions, setSelectedOptions] = useState({});

  // Fetch courses data from API.
  useEffect(() => {
    fetch('http://localhost:3000/api/course')
      .then(res => res.json())
      .then(apiData => setData(apiData))
      .catch(error => console.error('Error fetching course data:', error));
  }, []);

  // Fetch purpose options from API.
  useEffect(() => {
    fetch('http://localhost:3000/api/purpose')
      .then(res => res.json())
      .then(apiData => setPurposes(apiData))
      .catch(error => console.error('Error fetching purpose data:', error));
  }, []);

  // Filter data based on course_name or course_id.
  const filteredData = data.filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course.course_name.toLowerCase().includes(term) ||
      course.course_id.toLowerCase().includes(term)
    );
  });

  // Handle dropdown change for a given course.
  const handleDropdownChange = (courseId, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [courseId]: value
    }));
  };

  // On form submit, build an array of valid selections and send to API.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCourses = Object.keys(selectedOptions)
      .filter((courseId) => {
        const keyValue = selectedOptions[courseId];
        return keyValue && keyValue !== '0';
      })
      .map((courseId) => ({
        id: uuidv4(),
        course_id: courseId,
        selectedKey: selectedOptions[courseId]
      }));

    if (selectedCourses.length === 0) {
      console.log('No valid courses selected');
      return;
    }

    try {
      console.log(selectedCourses);
      const response = await fetch('http://localhost:3000/api/course-multiple-faculty-mapping/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedCourses })
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Successfully submitted:', responseData);
        setSelectedOptions({});
      } else {
        const errorData = await response.json();
        console.error('Failed to submit:', errorData);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <>
      <HorizontalProgressBar 
        currentStep={2} 
        totalSteps={3} 
        stepLabels={["Faculty Profile", "Select Course", "Course Skill Rating"]} 
      />
      <h3>Select The Courses</h3>
      <DescriptionPanel
        heading="What is this page about?"
        body="This page allows you to manage and track your selected courses. You can view course details, skill requirements, and rating information all in one place."
        defaultExpanded={true}
      />

      {/* Search box */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by course name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="cards-wrapper">
          {filteredData.map((course) => (
            <div
              key={course.course_id}
              className={`card-3d ${selectedOptions[course.course_id] && selectedOptions[course.course_id] !== '0' ? 'selected' : ''}`}
            >
              <div className="text-inner-div">
                <span className="text-inner">
                  <h2 className="course-name">{course.course_name}</h2>
                </span>
              </div>
              <p className="course-info">Course ID: {course.course_id}</p>
              <p className="course-info">Category: {course.category_name}</p>

              {/* Dropdown for purpose selection */}
              <select
                className={
                  selectedOptions[course.course_id] && selectedOptions[course.course_id] !== '0'
                    ? 'interest-dropdown-after'
                    : 'interest-dropdown-before'
                }
                value={selectedOptions[course.course_id] || '0'}
                onChange={(e) => handleDropdownChange(course.course_id, e.target.value)}
              >
                <option value="0">Select any option</option>
                {purposes.map((purpose) => (
                  <option key={purpose.purpose_id} value={purpose.purpose_id}>
                    {purpose.purpose_name}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* In-card submit button */}
        <div className="submit-container">
          <Button type="submit" variant="success" className="w-50 gitam-button">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
}
