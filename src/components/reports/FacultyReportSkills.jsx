import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import '../AllPages.css'
import DescriptionPanel from '../DescriptionPanel.jsx';

export default function FacultyReportCourseWiseSkills() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [employeeID, setEmployeeID] = useState('');
    const [courseFamiliarityIndices, setCourseFamiliarityIndices] = useState({});

    const [courseFilter, setCourseFilter] = useState('');
    const [skillIndices, setSkillIndices] = useState('');

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
                setEmployeeID(decoded.employee_id);
            } catch (err) {
                console.error("Error decoding token:", err);
            }
        } else {
            console.warn("No token found in cookies.");
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (employeeID) {
            fetch(`http://localhost:3000/api/course-faculty-mapping?employee_id=${employeeID}`, {
                credentials: 'include'
            })
                .then((res) => res.json())
                .then((data) => setCourses(data))
                .catch((error) => console.error('Error fetching courses:', error));
        }
        console.log("Courses:", courses);
    }, [employeeID]);

    const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);

    useEffect(() => {
        const fetchCourseIndex = async () => {
            if (courseFilter) {
                const res = await fetch(
                    `http://localhost:3000/api/course-index?employeeID=${employeeID}&courseID=${courseFilter}`,
                    { credentials: 'include' }
                );
                const data = await res.json();
                var indices = {};
                var totalIndex = 0;

                if (data) {
                    data.forEach((item) => {
                        const index = item.yesCount / item.totalCount || 0;
                        indices[item.skill_id] = index.toFixed(2);
                        totalIndex += index;
                    });
                    setSkillIndices(indices);  
                    setSelectedCourseIndex(courseFilter);              
                } 
            } else {
                setSelectedCourseIndex(null);
            }
        };
        fetchCourseIndex();
    }, [courseFilter, employeeID]);

    return (
        <>
            <DescriptionPanel
                        title="Faculty Report - Course Wise Skills & Familiarity"
                        body="This report displays the skill familiarity associated with the selected course."
                        defaultExpanded={true}
            />  
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
                    {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                            {course.course_name}
                        </option>
                    ))}
                </select>
            </div>
            <a href="/home" className="btn btn-primary"> Home </a>
            {courseFilter && (
                <div className="mt-3">
                    <h5>Skill wise Index </h5>
                    <table className="table table-striped">     
                        <thead>
                            <tr>
                                <th>Skill ID</th>
                                <th>Index</th>
                            </tr>
                        </thead>
                        <tbody>
                            { Object.entries(skillIndices).length > 0 ? 
                              ( Object.entries(skillIndices).map(([skillID, index]) => (
                                <tr key={skillID}>
                                    <td>{skillID}</td>
                                    <td>{index}</td>
                                </tr>
                            ))
                            ) : (  <tr>
                                    <td colSpan="7" className="text-center">
                                        No skill familiarity marked for this course
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    
                </div>
            )}
        </>
    );
}

/**
 <pre style={{ background: "#f8f9fa", padding: "10px" }}>
                        {Object.keys(skillIndices).length > 0
                            ? JSON.stringify(skillIndices, null, 2)
                            : "Loading..."}
 </pre>
*/