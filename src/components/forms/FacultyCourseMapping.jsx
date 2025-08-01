import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FacultyForm from './FacultyForm';
import CourseForm from './CourseForm';
import Rating from '../Rating';
import '../GitamBrand.css'
import '../AllPages.css'


export default function FacultyCourseMapping() {


  // State for storing existing faculties/courses (in real app, fetch from API)
  const [courses, setCourses] = useState([]);
    const [coursesName, setCoursesName] = useState([]);
    const [coursesId, setCoursesId] = useState([]);

  // State for faculty search
  const [facultySearch, setFacultySearch] = useState('');
  // State for course search
  const [courseSearch, setCourseSearch] = useState('');

  // Final selected faculty + course
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Unique ID for the mapping
  const [mappingId, setMappingId] = useState('');

  // Modal controls
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

    // Form submit status
    const [submitStatus, setSubmitStatus] = useState(false);

    const [faculty, setFaculty] = useState([]);
    const [facultyName, setFacultyName] = useState([]);
    const [facultyId, setFacultyId] = useState([]);

  // Generate a unique mapping ID when component mounts
  useEffect(() => {
    setMappingId(uuidv4());

    let facultyList = []
    let facultyNameList = []
    let facultyIdList = []
    const response_faculty = fetch('http://localhost:3000/api/employee')
      .then((res) => res.json())
      .then((data) => {

        data.forEach(element => {
            facultyList.push({ id: element.employee_id, name: element.employee_name })
            facultyNameList.push(element.employee_name)
            facultyIdList.push(element.employee_id)
          });
  
          setFaculty(facultyList)
          setFacultyName(facultyNameList)
          setFacultyId(facultyIdList)

    })

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



  }, []);

  // Handlers to open/close modals
  const handleOpenFacultyModal = () => setShowFacultyModal(true);
  const handleCloseFacultyModal = () => setShowFacultyModal(false);

  const handleOpenCourseModal = () => setShowCourseModal(true);
  const handleCloseCourseModal = () => setShowCourseModal(false);

  // After a new faculty is added, update faculties list
  const handleFacultyAdded = (newFacultyName) => {
    setFaculty([...faculties, newFacultyName]);
    setFacultySearch(newFacultyName);
    setSelectedFaculty(newFacultyName);
    handleCloseFacultyModal();
  };

  // After a new course is added, update courses list
  const handleCourseAdded = (newCourseName) => {
    setCourses([...courses, newCourseName]);
    setCourseSearch(newCourseName);
    setSelectedCourse(newCourseName);
    handleCloseCourseModal();
  };

  // Submit handler
  const handleSubmit = async (e) => {
    // e.preventDefault();
    setSubmitStatus(true)
    const payload = {
      id: mappingId,
      faculty: selectedFaculty,
      course: selectedCourse
    };
    try {
      const response = await fetch('http://localhost:3000/api/course-faculty-mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

        console.log('Mapping created successfully');
        // Navigate to <Rating /> after success
        // navigate('/rating/add');
      
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  // Filter faculties + courses based on search terms
  const filteredFaculties = faculty.filter((f) =>
    f.name.toLowerCase().includes(facultySearch.toLowerCase())
  );
  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(courseSearch.toLowerCase())
  );

  // Check if facultySearch or courseSearch is not in the lists (to show Add button)
  const facultyExists = faculty.some(
    (f) => f.name.toLowerCase() === facultySearch.toLowerCase() || f.id.toLowerCase() === facultySearch.toLowerCase()
  );
  const courseExists = courses.some(
    (c) => c.name.toLowerCase() === courseSearch.toLowerCase() || c.id.toLowerCase() === courseSearch.toLowerCase()
  );

  return (
    <>
    <a href="/home" className="btn btn-primary"> Home </a>

    { !submitStatus && <div className="container py-5">
      <h2 className="mb-4">Faculty-Course Mapping</h2>
      <div className="card mx-auto shadow gitam-form">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Mapping ID (read-only) */}
            <div className="mb-3">
              <label className="form-label">Mapping ID (Auto-generated)</label>
              <input
                type="text"
                className="form-control"
                value={mappingId}
                readOnly
              />
            </div>

            {/* Faculty Name Searchable */}
            <div className="mb-3">
              <label className="form-label">Faculty Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search or enter faculty name"
                value={facultySearch}
                onChange={(e) => {
                  setFacultySearch(e.target.value);
                  setSelectedFaculty(e.target.value);
                }}
                required
              />
              {/* Suggestions */}
              {facultySearch && filteredFaculties.length > 0 && (
                <ul className="list-group mt-1">
                  {filteredFaculties.map((fac) => (
                    <li
                      key={fac.id}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setFacultySearch(fac.id);
                        setSelectedFaculty(fac.id);
                      }}
                    >
                      {fac.name}
                    </li>
                  ))}
                </ul>
              )}
              {/* Add New Faculty Button */}
              {facultySearch && !facultyExists && (
                <div className="mt-2">
                  <Button variant="outline-primary" onClick={handleOpenFacultyModal}>
                    Add New Faculty
                  </Button>
                </div>
              )}
            </div>

            {/* Course Name Searchable */}
            <div className="mb-3">
              <label className="form-label">Course Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search or enter course name"
                value={courseSearch}
                onChange={(e) => {
                  setCourseSearch(e.target.value);
                  setSelectedCourse(e.target.value);
                }}
                required
              />
              {/* Suggestions */}
              {courseSearch && filteredCourses.length > 0 && (
                <ul className="list-group mt-1">
                  {filteredCourses.map((course) => (
                    <li
                      key={course.id}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setCourseSearch(course.id);
                        setSelectedCourse(course.id);
                      }}
                    >
                      {course.name}
                    </li>
                  ))}
                </ul>
              )}
              {/* Add New Course Button */}
              {courseSearch && !courseExists && (
                <div className="mt-2">
                  <Button variant="outline-primary" onClick={handleOpenCourseModal}>
                    Add New Course
                  </Button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="primary" className="w-100 gitam-button">
              Submit
            </Button>
          </form>
        </div>
      </div>

      {/* Faculty Modal */}
      <Modal show={showFacultyModal} onHide={handleCloseFacultyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Render <FacultyForm /> here, passing a callback for when new faculty is added */}
          <FacultyForm onFacultyAdded={handleFacultyAdded} />
        </Modal.Body>
      </Modal>

      {/* Course Modal */}
      <Modal show={showCourseModal} onHide={handleCloseCourseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Render <CourseForm /> here, passing a callback for when new course is added */}
          <CourseForm onCourseAdded={handleCourseAdded} />
        </Modal.Body>
      </Modal>
    </div>
}

{submitStatus && <Rating/>}
    </>
  )
}
