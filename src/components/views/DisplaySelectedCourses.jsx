import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Rating from '../Rating';
import HorizontalProgressBar from '../HorizontalProgressBar';
import DescriptionPanel from '../DescriptionPanel';
import './DisplaySelectedCourses.css';

export default function DisplaySelectedCourses(iscreen) {
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
  const [courseCompletionProgresses, setCourseCompletionProgresses] = useState({});
  const [courseFamiliarityIndices, setCourseFamiliarityIndices] = useState({});
  const [skillTypeCompletionProgresses, setSkillTypeCompletionProgresses] = useState({});
  const [skillTypeFamiliarityIndices, setSkillTypeFamiliarityIndices] = useState({});
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
        .then((data) => { setDetails(data)
          console.log("Skill types fetched:", data);
        }) 
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

  useEffect(() => {
    if (empID && courses.length > 0) {
      const fetchProgresses = async () => {
        const completionProgresses = {};
        const typeCompletionProgresses = {};
        const typeFamiliarityIndices = {};
        const skillTypes = [ 'Preskill', 'Tech/Core', 'Tool', 'Applied', 'Project', 'Functional' ];
        await Promise.all(
          filteredCourses.map(async (course) => {
            try {
              const res = await fetch(
                `http://localhost:3000/api/subskill-count?employeeID=${empID}&courseID=${course.course_id}`,
                { credentials: 'include' }
              );
              const data = await res.json();
              //courseIndices[course.course_id] = 10 || 0; // Store course index
              if (data) {
                const totalSkills = data.total;
                const markedSkills = data.yes + data.no;
                completionProgresses[course.course_id] =
                  totalSkills > 0 ? Math.round((markedSkills / totalSkills) * 100) : 0;
              } else {
                completionProgresses[course.course_id] = 0;
              }
            } catch (error) {
              completionProgresses[course.course_id] = 0;
            }
            try {
              const res = await fetch(
                `http://localhost:3000/api/course-index?employeeID=${empID}&courseID=${course.course_id}`,
                { credentials: 'include' }
              );
              const data = await res.json();
              var totalIndex = 0
              if (data) {
                data.forEach((item) => { 
                  var index = item.yesCount / item.totalCount
                  totalIndex += index;
                })         
              }
              courseFamiliarityIndices[course.course_id] = (totalIndex / data.length * 100).toFixed(2) || 0; // Store course index
            } catch (error) {
              courseFamiliarityIndices[course.course_id] = 0; // Default to 0 if error occurs
            }
            if (empID && course.course_id) {
              try {
                const res = await fetch(
                  `http://localhost:3000/api/subskill-count-skilltype?employeeID=${empID}&courseID=${course.course_id}`,
                  { credentials: 'include' }
                );
                const data = await res.json(); 
                console.log("Skill type progress data:", data, data['Preskill'], data['Tech/Core'], data['Tool'], data['Applied'], data['Project']);
                console.log("Skill types:", skillTypes);
                //if (Array.isArray(data)) {
                  // data.forEach((item) => {
                  skillTypes.forEach((skillType) => {                  
                    const item = data[skillType];
                    console.log("Item:", item);
                    if (item) {  
                      const total = item.total;
                      const marked = item.yes + item.no;
                      if (!typeCompletionProgresses[course.course_id]) typeCompletionProgresses[course.course_id] = {};
                      if(!typeFamiliarityIndices[course.course_id]) typeFamiliarityIndices[course.course_id] = {};
                        typeCompletionProgresses[course.course_id][item.skill_type] =
                          total > 0 ? Math.round((marked / total) * 100) : 0;
                        typeFamiliarityIndices[course.course_id][item.skill_type] =
                          total > 0 ? Math.round((item.yes / total) * 100) : 0;
                        
                    }
                  })                
              } catch (error) {
                // ignore skill type progress error for this course
              }
              
            }
          })
        );
        setCourseCompletionProgresses(completionProgresses);
        setSkillTypeCompletionProgresses(typeCompletionProgresses);
        setSkillTypeFamiliarityIndices(typeFamiliarityIndices);
        //console.log("Course progresses:", progresses);
        console.log("typeCompletionProgresses::",typeCompletionProgresses);
      };
      fetchProgresses();
    }
  }, [empID, courses]);

  return (
    <div className="display-courses-container">

      <div className="course-transition-container {`${animation}`}">
        {screen === 'courses' && (
          <div>
            <HorizontalProgressBar 
        currentStep={2} 
        totalSteps={4} 
        stepLabels={["Authentication", "Select Course", "Select SkillType","Familiarity Marking"]} 
      />

      <DescriptionPanel
        heading="What is this page about?"
        body="This page displays all courses you are associated.
        You can select a course which will show associated 
        skill types of defined skills & subskills."
        defaultExpanded={true}
      />
          <div className="courses-screen">
            <h2 className="mb-4">Dashboard</h2>
                  
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
                    <p> Marking Completion : { courseCompletionProgresses[course.course_id] }% </p>
                    <ProgressBar
                      now={  courseFamiliarityIndices[course.course_id] || 0}
                      label={`${  courseFamiliarityIndices[course.course_id] || 0}%`}
                      style={{ marginTop: '10px' }}
                    /> 
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {screen === 'details' && (
          <div>
          <HorizontalProgressBar 
            currentStep={3} 
            totalSteps={4} 
            stepLabels={["Authentication", "Select Course", "Select SkillType", "Familiairity Marking"]} 
          />

          <DescriptionPanel
            heading="What is this page about?"
            body="In this page you can select a skill type, which will take you to the next page where you can mark your familiarity with the skills and subskills related to the course."
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
              {details
              .filter(item => choosenCourse.course_id !== "CAIA101")
              .map((item, idx) => (
                <div
                  className="detail-card"
                  key={idx}
                  onClick={() => handleSkillTypeClick(item.type_label)}
                >

                  <div className="card-3d-block">
                    <h4>{item.type_label}</h4>
                    <h4> Completion : { skillTypeCompletionProgresses[choosenCourse.course_id][item.type_label] || 0}% </h4>
                    <ProgressBar now={ skillTypeFamiliarityIndices[choosenCourse.course_id][item.type_label] || 0}
                    label ={`${ skillTypeFamiliarityIndices[choosenCourse.course_id][item.type_label] || 0}%`}
                    variant="success"
                    style={{ marginTop: '30px' }} 
                    />
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
