import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import './GitamBrand.css';
import HorizontalProgressBar from './HorizontalProgressBar';
import DescriptionPanel from './DescriptionPanel';
import './Rating.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import handleCourseClick from './views/DisplaySelectedCourses';
import setScreen from './views/DisplaySelectedCourses';

export default function Rating({ choosenCourse, choosenSkillType }) {
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState(choosenCourse.course_name);
  const [selectedSkillType, setSelectedSkillType] = useState(choosenSkillType);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [animation, setAnimation] = useState('none');
  const [facultySubskillData, setFacultySubskillData] = useState([]);
  const [facultyRating, setFacultyRatingData] = useState([]);
  const [editedfacultySubskillData, setEditedfacultySubskillData] = useState([]);
  const [changedRatings, setChangedRatings] = useState({});
  const [empID, setEmpID] = useState('');
  

  const initialFamiliaritiesRef = useRef({});

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  };

  const token = getCookie("token");
  //const decoded = jwtDecode(token);
  useEffect(() => {
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
 
  useEffect(() => {
    if(empID === '') return;
    console.log("Fetching faculty-subskill-mapping:",empID)
    fetch(`http://localhost:3000/api/faculty-subskill-mapping?employeeID=${empID}`)
      .then(res => res.json())
      .then(data => setFacultySubskillData(data))
      .catch(error => console.error('Error fetching facultySubskillData:', error));
  }, [empID]);

  useEffect(() => {
    if(empID === '') return; // Prevent fetching if empID is not set
    console.log("Fetching familiarity:",empID)
    fetch(`http://localhost:3000/api/familiarity?employeeID=${empID}`)
      .then(res => res.json())
      .then(data => setFacultyRatingData(data))
      .catch(error => console.error('Error fetching facultyRating:', error));
  }, [empID]);

  useEffect(() => {
    if (facultySubskillData.length > 0) {
      const updatedData = facultySubskillData.map(item => {
        const ratingEntry = facultyRating.find(
          rate => rate.subskill_id === item.subskill_id && rate.employee_id === item.employee_id
        );
        const familiarity = ratingEntry ? ratingEntry.familiarity : 'NA';
        return { ...item, familiarity };
      });
      setEditedfacultySubskillData(updatedData);

      if (Object.keys(initialFamiliaritiesRef.current).length === 0) {
        const newInitial = {};
        updatedData.forEach(item => {
          newInitial[item.subskill_id] = item.familiarity;
        });
        initialFamiliaritiesRef.current = newInitial;
      }
    }
  }, [facultySubskillData, facultyRating]);

  const handleFamiliarityCycle = (subskillName) => {
    const updatedData = editedfacultySubskillData.map(item => {
      if (item.subskill_name === subskillName) {
        let newFamiliarity = 'No';
        if (item.familiarity === 'NA') {
          newFamiliarity = 'Yes';          
        } else if (item.familiarity === 'Yes') {
          newFamiliarity = 'No';          
        } else {
          newFamiliarity = 'NA';          
        }
        //console.log("Changing familiarity:",item.familiarity,newFamiliarity)

        const ratingIndex = facultyRating.findIndex(
          rate => rate.subskill_id === item.subskill_id && rate.employee_id === item.employee_id
        );
        //console.log("Rating Index:",ratingIndex)
        let updatedFacultyRating = [...facultyRating];
        if (ratingIndex !== -1) {
          console.log("update:",item.subskill_id,",", newFamiliarity)
          updatedFacultyRating[ratingIndex] = {
            ...updatedFacultyRating[ratingIndex],
            familiarity: newFamiliarity
          };
        } else {
          //console.log("append:",item.subskill_id,",", newFamiliarity)
          updatedFacultyRating.push({
            //marking_id: item.marking_id,
            subskill_id: item.subskill_id,
            employee_id: item.employee_id,
            familiarity: newFamiliarity,
          });
        }
        setFacultyRatingData(updatedFacultyRating);

        setChangedRatings(prev => ({
          ...prev,
          [item.subskill_id]: {
            subskill_id: item.subskill_id,
            employee_id: item.employee_id,
            familiarity: newFamiliarity,
            previous: prev[item.subskill_id]?.previous || item.familiarity
          }
        }));

        return { ...item, familiarity: newFamiliarity };
      }
      return item;
    });
    setEditedfacultySubskillData(updatedData);
  };

  const handleSubmit = () => { 
    const changedPayload = [];
    Object.values(changedRatings).forEach(item => {
       const original = initialFamiliaritiesRef.current[item.subskill_id];
      if (
        item.familiarity !== original ||
        (item.familiarity === 'NA' && item.previous !== 'NA')
      ) {
        changedPayload.push({
          //marking_id: crypto.randomUUID(),
          employee_id: item.employee_id,
          subskill_id: item.subskill_id,
          familiarity: item.familiarity 
        });
      }
    });

    if (changedPayload.length === 0) {
      alert('No changes to submit.');
      return;
    }

    fetch('http://localhost:3000/api/v1/familiarity_marking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(changedPayload) //changedRatings
    })
      .then(response => response.json())
      .then(data => {
        console.log('Successfully posted rating data:', data);
        setFacultySubskillData(editedfacultySubskillData);

        const updatedInitialFams = { ...initialFamiliaritiesRef.current };
        changedPayload.forEach(changedItem => {
          updatedInitialFams[changedItem.subskill_id] = changedItem.familiarity;
        });
        initialFamiliaritiesRef.current = updatedInitialFams;

        const newChangedRatings = { ...changedRatings };
        changedPayload.forEach(changedItem => {
          delete newChangedRatings[changedItem.subskill_id];
        });
        setChangedRatings(newChangedRatings);

        alert('Changes saved successfully.');
      })
      .catch(error => console.error('Error posting rating data:', error));
  };

  const handleBackClick = () => {
    //setAnimation('slide-right');
    setTimeout(() => {
      //console.log("Back Button Clicked")
      window.location.href = '/rating/add';
      //navigate('/rating/add', { state: { screen: 'details' } });
      //handleCourseClick(selectedCourse) //as it is not defined
    }, 300);
  };

  const courses = [...new Set(editedfacultySubskillData.map(item => item.course_name))];
  const skillTypes = [...new Set(editedfacultySubskillData.map(item => item.skill_type))];
  const skills = [...new Set(editedfacultySubskillData.map(item => 
    //item.skill_type === "All Skill Types" ? setSelectedSkillType('') :
    item.skill_type === selectedSkillType && item.course_name === selectedCourse ? item.skill_name : null))].filter(Boolean)

  //editedfacultySubskillData
  const filteredfacultySubskillData = editedfacultySubskillData.filter(item =>
    (selectedCourse === '' || item.course_name === selectedCourse) &&
    (selectedSkillType === '' || item.skill_type === selectedSkillType) &&
    (selectedSkill === '' || item.skill_name === selectedSkill)
  );

  const clearFilters = () => {
    setSelectedCourse('');
    setSelectedSkillType('');
    setSelectedSkill('');
  };

  const cardFooterRef = useRef(null);
  const [floatingVisible, setFloatingVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setFloatingVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (cardFooterRef.current) observer.observe(cardFooterRef.current);
    return () => {
      if (cardFooterRef.current) observer.unobserve(cardFooterRef.current);
    };
  }, []);

  return (
    <>
      <HorizontalProgressBar 
      currentStep={4} 
      totalSteps={4} 
      stepLabels={["Authentication", "Select Course", "Select SkillType", "Familiairity Marking"]} 
      />
      <DescriptionPanel
        heading="What is this page about?"
        body="This page allows you to mark/change your familiarity with subskills related to the courses you are associated with. You can select a course, skill type, and skill to view and update your familiarity status."
        defaultExpanded={true}
      />
      
      <button className="btn btn-outline-primary" onClick={handleBackClick}>Back to Courses</button>

      <h3 className="mt-3">Mark the Familiarity</h3>
      <div className="container my-3">
        {/* Filters Section */}
        <div className="card mb-3 shadow-sm">
          <div className="card-body py-3 px-3">
            <form className="row g-3">
              <div className="col-12 col-md-4">
                <label htmlFor="courseSelect" className="form-label">Course</label>
                <select
                  id="courseSelect"
                  className="form-select"
                  value={selectedCourse}
                  onChange={e => setSelectedCourse(e.target.value)}
                >
                  {/* <option value="">All Courses</option>*/}
                  {courses.map((course, idx) => (
                    <option key={idx} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label htmlFor="skillTypeSelect" className="form-label">Skill Type</label>
                <select
                  id="skillTypeSelect"
                  className="form-select"
                  value={selectedSkillType}
                  onChange={e => setSelectedSkillType(e.target.value)}
                >
                  <option value="">All Skill Types</option>
                  {skillTypes.map((type, idx) => (
                    <option key={idx} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label htmlFor="skillSelect" className="form-label">Skill</label>
                <select
                  id="skillSelect"
                  className="form-select"
                  value={selectedSkill}
                  onChange={ e => setSelectedSkill(e.target.value)}
                >
                  <option value="">All Skills</option>
                  {skills.map((skill, idx) => (
                    <option key={idx} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-2 d-flex align-items-end">
                <button type="button" className="btn btn-secondary w-100" onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="d-none d-md-block">
          <div className="card shadow-sm rating-table">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">Skill Matrix : {empID} </h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-success">
                    <tr>
                      <th>Sr No.</th>
                      <th>Course</th>
                      <th>Skill Type</th>
                      <th>Skill</th>
                      <th>Subskill</th>
                      <th>Familiar?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredfacultySubskillData.length > 0 ? (
                      filteredfacultySubskillData.map((row, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{row.course_name}</td>
                          <td>{row.skill_type}</td>
                          <td>{row.skill_name}</td>
                          <td>{row.subskill_name}</td>
                          <td>
                            <button
                              className="btn"
                              style={{
                                backgroundColor:
                                  row.familiarity === 'Yes' ? 'green'
                                    : row.familiarity === 'No' ? 'red'
                                    : 'grey',
                                color: 'white',
                                width: '120px'
                              }}
                              onClick={() => handleFamiliarityCycle(row.subskill_name)}
                            >
                            {row.familiarity === 'Yes' ? 'Yes' : row.familiarity === 'No'? 'No' : 'NA'  }

                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">No facultySubskillData available (or) course, skill type, skill filters not selected completely.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer text-end" ref={cardFooterRef}>
              <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </div>          
          </div>
        </div>

      {/* Mobile Card View */}
<div className="d-block d-md-none">
  {filteredfacultySubskillData.length > 0 ? (
    filteredfacultySubskillData.map((row, idx) => (
      <div key={idx} className="card mb-3 shadow-sm mobile-card">
        <div className="card-body">
          <h5 className="card-title">{row.subskill_name}</h5>
          <p className="card-text"><strong>Course:</strong> {row.course_name}</p>
          <p className="card-text"><strong>Skill Type:</strong> {row.skill_type}</p>
          <p className="card-text"><strong>Skill:</strong> {row.skill_name}</p>
          <p className="card-text">
            <strong>Familiar?</strong>
            <br />
            <button
              className="btn mt-2"
              style={{
                backgroundColor:
                  row.familiarity === 'Yes' ? 'green'
                  : row.familiarity === 'No' ? 'red'
                  : 'grey',
                color: 'white',
                width: '120px'
              }}
              onClick={() => handleFamiliarityCycle(row.subskill_name)}
            >
              {row.familiarity === 'Yes' ? 'Yes' : row.familiarity === 'No'? 'No' : 'NA'  }
            </button>
          </p>
        </div>
      </div>
    ))
  ) : (
    <div className="text-center">No facultySubskillData available or course, skill type, skill filters not selected.</div>
  )}
</div>

      </div>

      {floatingVisible && (
        <div className="floating-submit-container">
          <button className="btn btn-primary floating-submit-button" onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </>
  );
}
