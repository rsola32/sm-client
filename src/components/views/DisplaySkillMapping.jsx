import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DescriptionPanel from '../DescriptionPanel.jsx';

export default function DisplaySkillMapping() {

    const [heading, description] = [`What is this page about?`,`This page allows you to manage and track your selected courses. 
                      You can view course details, skill requirements, and rating information
                      all in one place.`]

    const [mappings, setMappings] = useState([]);

    // Filter states
    const [courseFilter, setCourseFilter] = useState('');
    const [skillTypeFilter, setSkillTypeFilter] = useState('');
    const [deptFilter, setDeptFilter] = useState('');
    const [schoolFilter, setSchoolFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch data on component mount
    useEffect(() => {
        fetch('http://localhost:3000/api/course-skill-mapping')
            .then((res) => res.json())
            .then((data) => setMappings(data))
            .catch((error) => console.error('Error fetching mapping data:', error));
    }, []);

    // Create unique options for each dropdown (remove duplicates)
    const courseNameOptions = [...new Set(mappings.map((item) => item.course_name))];
    const skillTypeOptions = [...new Set(mappings.map((item) => item.skill_type))];
    const deptOptions = [...new Set(mappings.map((item) => item.department_short_name))];
    const schoolOptions = [...new Set(mappings.map((item) => item.school_short_name))];

    // Filter the data based on dropdowns and universal search
    const filteredMappings = mappings.filter((item) => {
        // Course Name
        if (courseFilter && item.course_name !== courseFilter) {
            return false;
        }
        // Skill Type
        if (skillTypeFilter && item.type_label !== skillTypeFilter) {
            return false;
        }
        // Department Name
        if (deptFilter && item.department_name !== deptFilter) {
            return false;
        }
        // School Name
        if (schoolFilter && item.school_name !== schoolFilter) {
            return false;
        }

        // Universal Search (case-insensitive check across all item fields)
        const combinedString = Object.values(item).join(' ').toLowerCase();
        if (!combinedString.includes(searchTerm.toLowerCase())) {
            return false;
        }

        return true;
    });

    return (
        <>
            <div className="container my-4">
                <h2 className="mb-4">Course-Skill Mapping</h2>
                <DescriptionPanel
                heading={heading}
                body={description}
                defaultExpanded={true}
              />

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
                    {/* Course Name Filter */}
                    <div className="col-sm-6 col-md-3">
                        <label htmlFor="courseFilter" className="form-label">
                            Course Name
                        </label>
                        <select
                            id="courseFilter"
                            className="form-select"
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            {courseNameOptions.map((cName) => (
                                <option key={cName} value={cName}>
                                    {cName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Skill Type Filter */}
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

                    {/* School Name Filter */}
                    <div className="col-sm-6 col-md-3">
                        <label htmlFor="schoolFilter" className="form-label">
                            School Name
                        </label>
                        <select
                            id="schoolFilter"
                            className="form-select"
                            value={schoolFilter}
                            onChange={(e) => setSchoolFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            {schoolOptions.map((school) => (
                                <option key={school} value={school}>
                                    {school}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Mappings Table */}
                <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className="table-success">
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Skill Name</th>
                                <th>Skill Type</th>
                                <th>Skill Description</th>
                                <th>Department</th>
                                <th>School</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMappings.length > 0 ? (
                                filteredMappings.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.course_id}</td>
                                        <td>{item.course_name}</td>
                                        <td>{item.skill_name}</td>
                                        <td>{item.skill_type}</td>
                                        <td>{item.skill_description}</td>
                                        <td>{item.department_short_name}</td>
                                        <td>{item.school_short_name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No mappings found
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
