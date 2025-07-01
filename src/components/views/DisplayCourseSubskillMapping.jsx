import React, { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DisplayCourseSubskillMapping() {

    const [data, setData] = useState([]);

  // Dropdown filter states
  const [courseNameFilter, setCourseNameFilter] = useState('');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState('');
  const [skillNameFilter, setSkillNameFilter] = useState('');
  const [skillTypeFilter, setSkillTypeFilter] = useState('');
  const [requiredFilter, setRequiredFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [caiaFilter, setCaiaFilter] = useState('');

  // Universal search
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/course-subskill')
      .then((res) => res.json())
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

  /**
   * STEP 1: Filter the data based on the current states
   */
  const filteredData = data.filter((item) => {
    // 1. Course Name
    if (courseNameFilter && item.course_name !== courseNameFilter) {
      return false;
    }
    // 2. Course Category
    if (courseCategoryFilter && item.category_name !== courseCategoryFilter) {
      return false;
    }
    // 3. Skill Name
    if (skillNameFilter && item.skill_name !== skillNameFilter) {
      return false;
    }
    // 4. Skill Type
    if (skillTypeFilter && item.type_label !== skillTypeFilter) {
      return false;
    }
    // 5. Required
    if (requiredFilter && item.required !== requiredFilter) {
      return false;
    }
    // 6. Department Name
    if (departmentFilter && item.department_name !== departmentFilter) {
      return false;
    }
    // 7. School Name
    if (schoolFilter && item.school_name !== schoolFilter) {
      return false;
    }
    // 8. CAIA Coordinator
    if (caiaFilter && item.caia_coordinator !== caiaFilter) {
      return false;
    }

    // Universal search across all fields in the item
    const combinedString = Object.values(item).join(' ').toLowerCase();
    if (!combinedString.includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  /**
   * STEP 2: Generate the dropdown options dynamically based on filteredData
   * so that each dropdown is "cascaded" according to the current filter selection.
   */
  const courseNameOptions = [
    ...new Set(filteredData.map((item) => item.course_name)),
  ];
  const courseCategoryOptions = [
    ...new Set(filteredData.map((item) => item.category_name)),
  ];
  const skillNameOptions = [...new Set(filteredData.map((item) => item.skill_name))];
  const skillTypeOptions = [...new Set(filteredData.map((item) => item.type_label))];
  const requiredOptions = [...new Set(filteredData.map((item) => item.required))];
  const departmentOptions = [
    ...new Set(filteredData.map((item) => item.department_name)),
  ];
  const schoolOptions = [...new Set(filteredData.map((item) => item.school_name))];
  const caiaOptions = [...new Set(filteredData.map((item) => item.caia_coordinator))];

  /**
   * Tooltip overlay: Delay is 2 seconds (2000ms) to show the tooltip.
   * We'll display subskill_description, course_coordinator, course_champion, caia_coordinator in it.
   */
  const renderTooltip = (props, record) => (
    <Tooltip {...props}>
      <div>
        <strong>Subskill Desc:</strong> {record.subskill_description}
      </div>
      <div>
        <strong>Coordinator:</strong> {record.course_coordinator}
      </div>
      <div>
        <strong>Champion:</strong> {record.course_champion}
      </div>
      <div>
        <strong>CAIA:</strong> {record.caia_coordinator}
      </div>
    </Tooltip>
  );

  return (
    <>
    <div className="container my-4">
      <h2 className="mb-4">Course-Subskill Details</h2>

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
        {/* Course Name */}
        <div className="col-sm-6 col-md-3">
          <label htmlFor="courseNameFilter" className="form-label">
            Course Name
          </label>
          <select
            id="courseNameFilter"
            className="form-select"
            value={courseNameFilter}
            onChange={(e) => setCourseNameFilter(e.target.value)}
          >
            <option value="">All</option>
            {courseNameOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Course Category */}
        <div className="col-sm-6 col-md-3">
          <label htmlFor="courseCategoryFilter" className="form-label">
            Course Category
          </label>
          <select
            id="courseCategoryFilter"
            className="form-select"
            value={courseCategoryFilter}
            onChange={(e) => setCourseCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {courseCategoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Skill Name */}
        <div className="col-sm-6 col-md-3">
          <label htmlFor="skillNameFilter" className="form-label">
            Skill Name
          </label>
          <select
            id="skillNameFilter"
            className="form-select"
            value={skillNameFilter}
            onChange={(e) => setSkillNameFilter(e.target.value)}
          >
            <option value="">All</option>
            {skillNameOptions.map((sName) => (
              <option key={sName} value={sName}>
                {sName}
              </option>
            ))}
          </select>
        </div>

        {/* Skill Type */}
        <div className="col-sm-6 col-md-3">
          <label htmlFor="skillTypeFilter" className="form-label">
            Skill Type
          </label>
          <select
            id="skillTypeFilter"
            className="form-select"
            value={skillTypeFilter}
            onChange={(e) => setSkillTypeFilter(e.target.value)}
          >
            <option value="">All</option>
            {skillTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Required */}
        <div className="col-sm-6 col-md-3">
          <label htmlFor="requiredFilter" className="form-label">
            Required
          </label>
          <select
            id="requiredFilter"
            className="form-select"
            value={requiredFilter}
            onChange={(e) => setRequiredFilter(e.target.value)}
          >
            <option value="">All</option>
            {requiredOptions.map((rOpt) => (
              <option key={rOpt} value={rOpt}>
                {rOpt}
              </option>
            ))}
          </select>
        </div>

        {/* Department Name */}
        <div className="col-sm-6 col-md-3">
          <label htmlFor="departmentFilter" className="form-label">
            Department
          </label>
          <select
            id="departmentFilter"
            className="form-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* School Name */}
        <div className="col-sm-6 col-md-3">
          <label htmlFor="schoolFilter" className="form-label">
            School
          </label>
          <select
            id="schoolFilter"
            className="form-select"
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
          >
            <option value="">All</option>
            {schoolOptions.map((sch) => (
              <option key={sch} value={sch}>
                {sch}
              </option>
            ))}
          </select>
        </div>

        {/* CAIA Coordinator */}
        <div className="col-sm-6 col-md-3">
          <label htmlFor="caiaFilter" className="form-label">
            CAIA Coordinator
          </label>
          <select
            id="caiaFilter"
            className="form-select"
            value={caiaFilter}
            onChange={(e) => setCaiaFilter(e.target.value)}
          >
            <option value="">All</option>
            {caiaOptions.map((coor) => (
              <option key={coor} value={coor}>
                {coor}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-success">
            <tr>
              <th>Course Name</th>
              <th>Course Category</th>
              <th>Skill Name</th>
              <th>Skill Type</th>
              <th>Subskill Name</th>
              <th>Department</th>
              <th>School</th>
              <th>Required</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={`${item.id}-${item.subskill_id}`}>
                  {/* Course Name */}
                  <td>{item.course_name}</td>
                  {/* Course Category */}
                  <td>{item.category_name}</td>
                  {/* Skill Name */}
                  <td>{item.skill_name}</td>
                  {/* Skill Type */}
                  <td>{item.type_label}</td>
                  {/* Subskill Name with Tooltip */}
                  <td>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 1000, hide: 100 }}
                      overlay={(props) => renderTooltip(props, item)}
                    >
                      <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                        {item.subskill_name}
                      </span>
                    </OverlayTrigger>
                  </td>
                  {/* Department */}
                  <td>{item.department_name}</td>
                  {/* School */}
                  <td>{item.school_name}</td>
                  {/* Required */}
                  <td>{item.required}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No matching records found
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
