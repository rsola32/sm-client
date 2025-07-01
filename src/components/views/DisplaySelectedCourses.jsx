import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Rating from '../Rating';
import HorizontalProgressBar from '../HorizontalProgressBar';
import DescriptionPanel from '../DescriptionPanel';
import './DisplaySelectedCourses.css';

export default function DisplaySelectedCourses() {
  const navigate = useNavigate();

  // State declarations
  const [courses, setCourses] = useState([]);
  const [choosenCourse, setChoosenCourse] = useState(null);
  const [choosenSkillType, setChoosenSkillType] = useState('');
  const [details, setDetails] = useState([]);
  const [screen, setScreen] = useState('courses'); // 'courses', 'details', or 'table'
  const [animation, setAnimation] = useState('none');
  const [empID, setEmpID] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper: retrieve a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  };

  // Decode JWT and set employee ID
  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token, employee_id:", decoded);
        setEmpID(decoded.employee_id);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    } else {
      console.warn("No token found in cookies.");
      navigate('/login');
    }
  }, [navigate]);

  // Fetch courses when employee ID is available
  useEffect(() => {
    if (empID) {
      fetch(`http://localhost:3000/api/course-faculty-mapping?employee_id=${empID}`, {
        credentials: 'include'
      })
        .then((res) => res.json())
        .then((data) => setCourses(data))
        .catch((error) => console.error('Error fetching courses:', error));
    }
  }, [empID]);

  // Fetch skill types when employee ID is available
  useEffect(() => {
    if (empID) {
      fetch(`http://localhost:3000/api/skill-type`, {
        credentials: 'include'
      })
        .then((res) => res.json())
        .then((data) => setDetails(data))
        .catch((error) => console.error('Error fetching skill types:', error));
    }
  }, [empID]);

  // Screen transition handlers
  const handleCourseClick = (course) => {
    setChoosenCourse(course);
    setAnimation('slide-left');
    setTimeout(() => {
      setScreen('details');
      setAnimation('none');
    }, 300);
  };

  const handleSkillTypeClick = (skillType) => {
    setChoosenSkillType(skillType);
    setAnimation('slide-left');
    setTimeout(() => {
      setScreen('table');
      setAnimation('none');
    }, 300);
  };

  const handleBackClick = () => {
    setAnimation('slide-right');
    setTimeout(() => {
      setScreen('courses');
      setAnimation('none');
    }, 300);
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.toLowerCase();
    return (
      course.course_name.toLowerCase().includes(term) ||
      course.course_id.toLowerCase().includes(term)
    );
  });

  return (
    <div className="display-courses-container">

      <div className="course-transition-container {`${animation}`}">
        {screen === 'courses' && (
          <div>
            <HorizontalProgressBar 
        currentStep={3} 
        totalSteps={3} 
        stepLabels={["Faculty Profile", "Select Course", "Course Skill Rating"]} 
      />

      <DescriptionPanel
        heading="What is this page about?"
        body="This page allows you to manage and track your selected courses. You can view course details, skill requirements, and rating information all in one place."
        defaultExpanded={true}
      />
          <div className="courses-screen">
            <h2 className="mb-4">Dashboard</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by course name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="courses-grid">
              {filteredCourses.map((course) => (
                <div
                  className="course-card"
                  key={course.course_id}
                  onClick={() => handleCourseClick(course)}
                >
                  <div className="card-3d-block">
                    <h5>{course.course_name}</h5>
                    <p>Course ID: {course.course_id}</p>
                    <ProgressBar now={Math.floor(Math.random() * 100)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        )}

        {screen === 'details' && (
          <div>
          <HorizontalProgressBar 
      currentStep={3} 
      totalSteps={3} 
      stepLabels={["Faculty Profile", "Select Course", "Course Skill Rating"]} 
    />

    <DescriptionPanel
      heading="What is this page about?"
      body="This page allows you to manage and track your selected courses. You can view course details, skill requirements, and rating information all in one place."
      defaultExpanded={true}
    />
          <div className="details-screen">
            <div className="details-header">
              <h2 className="mb-4">Skill Types</h2>
              <button className="btn btn-outline-primary" onClick={handleBackClick}>
                Back
              </button>
            </div>
            <div className="details-grid">
              {details.map((item, idx) => (
                <div
                  className="detail-card"
                  key={idx}
                  onClick={() => handleSkillTypeClick(item.type_label)}
                >
                  <div className="card-3d-block">
                    <h4>{item.type_label}</h4>
                    <ProgressBar now={Math.floor(Math.random() * 100)} style={{ marginTop: '30px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        )}

        {screen === 'table' && <Rating choosenCourse={choosenCourse} choosenSkillType={choosenSkillType} />}
      </div>
    </div>
  );
}
