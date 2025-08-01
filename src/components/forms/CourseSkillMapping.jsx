import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';
import SkillForm from './SkillForm';
import CourseForm from './CourseForm';
import SubskillsForm from './SubskillsForm';
import '../GitamBrand.css'
import '../AllPages.css'
import HorizontalProgressBar from '../HorizontalProgressBar';

export default function CourseSkillMapping() {

  // ----------------------------------------
  // States for storing available Courses/Skills
  // ----------------------------------------
  const [courses, setCourses] = useState([]);
  const [coursesName, setCoursesName] = useState([]);
  const [coursesId, setCoursesId] = useState([]);

  const [skills, setSkills] = useState([]);
  const [subskillNumber, setSubskillNumber] = useState([3])

  // ----------------------------------------
  // States for search terms
  // ----------------------------------------
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [skillSearchTerm, setSkillSearchTerm] = useState('');

  // ----------------------------------------
  // States for selected items
  // ----------------------------------------
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  // ----------------------------------------
  // Unique ID for the record
  // ----------------------------------------
  const [mappingId, setMappingId] = useState('');

  // ----------------------------------------
  // States for controlling Modals
  // ----------------------------------------
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showSkillMappingForm, setShowSkillMappingForm] = useState(true);

  // ----------------------------------------
  // States for new Course/Skill name when adding
  // ----------------------------------------
  const [newCourseName, setNewCourseName] = useState('');
  const [newSkillName, setNewSkillName] = useState('');

  // ----------------------------------------
  // States for skill types
  // ----------------------------------------
  const [skillTypes, setSkillTypes] = useState(["test"]);
  const [skillType, setSkillType] = useState('');

  // ----------------------------------------
  // Popup style color
  // ----------------------------------------

  const bgcolor = "#007090"


  // Generate a unique mapping ID when component mounts or after submission
  useEffect(() => {
    setMappingId(uuidv4());

    let courseList = []
    let courseNameList = []
    let courseIdList = []
    const response_course = fetch('http://localhost:3000/api/course')
      .then((res) => res.json())
      .then((data) => {
        data.forEach(element => {
          courseList.push({ id: element.course_id, name: element.course_name })
          courseNameList.push(element.course_name)
          courseIdList.push(element.course_id)
        });
        setCourses(courseList)
        setCoursesName(courseNameList)
        setCoursesId(courseIdList)
      })


    let skillList = []
    const response_skill = fetch('http://localhost:3000/api/skill')
      .then((res) => res.json())
      .then((data) => {
        data.forEach(element => {
          skillList.push({ id: element.skill_id, name: element.skill_name })
        });
        setSkills(skillList)
      })

    let skillTypeList = []
    const response = fetch('http://localhost:3000/api/skill-type')
      .then((res) => res.json())
      .then((data) => {
        data.forEach(element => {
          skillTypeList.push({ name: element.type_label })
        });

        setSkillTypes(skillTypeList)
        console.log(skillTypeList)
      })

  }, [skillTypes.length, skills.length, courses.length]);

  // ----------------------------------------
  // Filtered lists based on search terms
  // ----------------------------------------
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(courseSearchTerm.toLowerCase())
  );

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase())
  );

  // ----------------------------------------
  // Handlers: Add new Course/Skill
  // ----------------------------------------
  const handleAddCourse = () => {
    if (newCourseName.trim()) {
      setCourses([...courses, newCourseName.trim()]);
      setSelectedCourse(newCourseName.trim());
      setCourseSearchTerm(newCourseName.trim());
    }
    setNewCourseName('');
    setShowCourseModal(false);
  };

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      setSkills([...skills, newSkillName.trim()]);
      setSelectedSkill(newSkillName.trim());
      setSkillSearchTerm(newSkillName.trim());
    }
    setNewSkillName('');
    setShowSkillModal(false);
  };

  // ----------------------------------------
  // Submission logic
  // ----------------------------------------
  const handleSubmit = async (e) => {
    // e.preventDefault();

    // Prepare the payload
    const payload = {
      course_id: selectedCourse,
      skill_id: selectedSkill,
      skill_type: skillType
    };

    try {
      setShowSkillMappingForm(false)

      const response = await fetch('http://localhost:3000/api/course-skill-mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log('Mapping submitted successfully:', data);

      // Reset form & generate new ID
      // setMappingId(uuidv4());
      // setCourseSearchTerm('');
      // setSkillSearchTerm('');
      // setSelectedCourse('');
      // setSelectedSkill('');

    } catch (error) {
      console.error('Error submitting the mapping:', error);
    }
  };

  // ----------------------------------------
  // Render
  // ----------------------------------------

  return (
    <>
    <a href="/home" className="btn btn-primary"> Home </a>
    <HorizontalProgressBar/>
      {showSkillMappingForm && <div className="container py-5">
        <h2 className="text-center mb-4">Course-Skill Mapping</h2>
        <div className="card mx-auto shadow gitam-form">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Mapping ID (auto-generated) */}
              <div className="mb-3">
                <label className="form-label">Mapping ID (Auto-Generated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={mappingId}
                  readOnly
                />
              </div>

              {/* Course Name - Searchable */}
              <div className="mb-3">
                <label className="form-label">Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search or Enter Course Name"
                  value={courseSearchTerm}
                  onChange={(e) => {
                    setCourseSearchTerm(e.target.value);
                    setSelectedCourse(e.target.value); // tie selection to search term
                  }}
                  required
                />

                {/* Dropdown suggestions */}
                {courseSearchTerm && filteredCourses.length > 0 && (
                  <ul className="list-group mt-1">
                    {filteredCourses.map((course, idx) => (
                      <li
                        key={idx}
                        className="list-group-item list-group-item-action"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setCourseSearchTerm(course.id);
                          setSelectedCourse(course.id);
                        }}
                      >
                        {course.name}
                      </li>
                    ))}
                  </ul>
                )}
                {/* If no match, show button to add new course */}
                {courseSearchTerm &&
                  filteredCourses.length === 0 &&
                  (!coursesName.includes(courseSearchTerm.trim()) || !coursesId.includes(courseSearchTerm.trim())) && (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowCourseModal(true)}
                      >
                        Add New Course
                      </button>
                    </div>
                  )}
              </div>

              {/* Skill Name - Searchable */}
              <div className="mb-3">
                <label className="form-label">Skill Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search or Enter Skill Name"
                  value={skillSearchTerm}
                  onChange={(e) => {
                    setSkillSearchTerm(e.target.value);
                    setSelectedSkill(e.target.value);
                  }}
                  required
                />
                {/* Dropdown suggestions */}
                {skillSearchTerm && filteredSkills.length > 0 && (
                  <ul className="list-group mt-1">
                    {filteredSkills.map((skill, idx) => (
                      <li
                        key={idx}
                        className="list-group-item list-group-item-action"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setSkillSearchTerm(skill.id);
                          setSelectedSkill(skill.id);
                        }}
                      >
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                )}
                {/* If no match, show button to add new skill */}
                {skillSearchTerm &&
                  filteredSkills.length === 0 &&
                  !skills.includes(skillSearchTerm.trim()) && (
                    <div className="mt-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowSkillModal(true)}
                      >
                        Add New Skill
                      </button>
                    </div>
                  )}
              </div>

              <div className="mb-3">
                <label className="form-label">Skill Type</label>
                <select
                  className="form-select mb-3"
                  id="skillType"
                  value={skillType}
                  onChange={(e) => setSkillType(e.target.value)}
                  required
                >
                  <option value="">Select a Skill Type</option>
                  {skillTypes.map((type, index) => (
                    <option key={index} value={type.id}>
                      {type.id}) {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of Subskills */}
              <div className="mb-3">
                <label className="form-label">Number of Subskills</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Number of Subskills"
                  onChange={(e) => {
                    setSubskillNumber(e.target.value)
                  }}
                  required
                />
              </div>

              {/* Submit */}
              <button type="submit" className="btn gitam-button w-100" >
                Save and Add Subskills
              </button>
            </form>
          </div>
        </div>

        {/* Modal for adding new Course */}
        {showCourseModal && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered" >
              <div className="modal-content" style={{ backgroundColor: bgcolor }}>
                <div className="modal-header">
                  <h5 className="modal-title">Add New Course</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCourseModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* <input
                  type="text"
                  className="form-control"
                  placeholder="Enter new course name"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                /> */}
                  <CourseForm />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCourseModal(false)}
                  >
                    Close
                  </button>
                  {/* <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddCourse}
                >
                  Save Course
                </button> */}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for adding new Skill */}
        {showSkillModal && (
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content" style={{ backgroundColor: bgcolor }}>
                <div className="modal-header">
                  <h5 className="modal-title">Add New Skill</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowSkillModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* <input
                  type="text"
                  className="form-control"
                  placeholder="Enter new skill name"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                /> */}
                  <SkillForm />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowSkillModal(false)}
                  >
                    Close
                  </button>
                  {/* <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddSkill}
                >
                  Save Skill
                </button> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>}

      {!showSkillMappingForm && <SubskillsForm values={{ subskillNumber, selectedSkill }} />}


    </>
  )
}
