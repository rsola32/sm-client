import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../GitamBrand.css'
import '../AllPages.css'


function CourseForm() {
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [courseCoordinator, setCourseCoordinator] = useState('');
  const [courseChampion, setCourseChampion] = useState('');
  const [caiaCoordinator, setCaiaCoordinator] = useState('');
  const [visibility, setVisibility] = useState(true)

  // Sample options for dropdowns — update with real data as needed.
  const courseCategories = ['Core', 'Elective'];
  const departments = ['Computer Science Engineering', 'Electrical and Electronics Engineering', 'Mechanical Engineering', 'Civil Engineering'];


  
  const handleSubmit = async (e) => {
    
    // e.preventDefault();
    const payload = {
      courseId,
      courseName,
      courseCategory,
      department,
      courseCoordinator,
      courseChampion,
      caiaCoordinator
    };

      const response = await fetch('http://localhost:3000/api/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

        const data = await response.json();
        console.log('Course submitted successfully:', data);
        // Clear form
        setCourseId('');
        setCourseName('');
        setCourseCategory('');
        setDepartment('');
        setCourseCoordinator('');
        setCourseChampion(null);
        setCaiaCoordinator(null);

        
      // await handleClick()
      
  };

  async function handleClick(){
    setVisibility(false)
  }

  return (
    <>
    <div style={{ marginTop: '70px' }}>
    {/* <div className="container d-flex justify-content-center align-items-center vh-100"> */}
    { visibility && <div className="card shadow-sm gitam-form">
        <div className="card-body">
          {/* <h3 className="card-title text-center mb-4">Add New Course</h3> */}
          <form onSubmit={handleSubmit}>

            {/* <div className="row"> */}
            <div className="col mb-3">
                <label htmlFor="courseId" className="form-label">Course ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="courseId"
                  placeholder="Enter Course ID"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  required
                />
              </div>
              <div className="col mb-3">
                <label htmlFor="courseName" className="form-label">Course Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="courseName"
                  placeholder="Enter Course Name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />
              </div>
              <div className="col mb-3">
                <label htmlFor="courseCategory" className="form-label">Course Category</label>
                <select
                  className="form-select"
                  id="courseCategory"
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {courseCategories.map((category, idx) => (
                    <option key={idx} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col mb-3">
                <label htmlFor="department" className="form-label">Department</label>
                <select
                  className="form-select"
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, idx) => (
                    <option key={idx} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            {/* </div> */}

            {/* Second row: Course Coordinator, Course Champion, CAIA Coordinator */}
            {/* <div className="row"> */}
              <div className="col mb-3">
                <label htmlFor="courseCoordinator" className="form-label">Course Coordinator</label>
                <input
                  type="text"
                  className="form-control"
                  id="courseCoordinator"
                  placeholder="Enter Coordinator Name"
                  value={courseCoordinator}
                  onChange={(e) => setCourseCoordinator(e.target.value)}
                  required
                />
              </div>
              <div className="col mb-3">
                <label htmlFor="courseChampion" className="form-label">Course Champion</label>
                <input
                  type="text"
                  className="form-control"
                  id="courseChampion"
                  placeholder="Enter Champion Name"
                  value={courseChampion}
                  onChange={(e) => setCourseChampion(e.target.value)}
                  required
                />
              </div>
              <div className="col mb-3">
                <label htmlFor="caiaCoordinator" className="form-label">CAIA Coordinator</label>
                <input
                  type="text"
                  className="form-control"
                  id="caiaCoordinator"
                  placeholder="Enter CAIA Coordinator Name"
                  value={caiaCoordinator}
                  onChange={(e) => setCaiaCoordinator(e.target.value)}
                  required
                />
              </div>
            {/* </div> */}

            <button type="submit" className="btn w-100 gitam-button"  >Submit</button>
          </form>
        </div>
      </div>}

      {!visibility && <h2>Courses Added</h2>}
    {/* </div> */}
    </div>
    </>

  );
}

export default CourseForm;
