import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import '../AllPages.css'
import DescriptionPanel from '../DescriptionPanel.jsx';

export default function FacultyReportCourseWise() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [employeeID, setEmployeeID] = useState('');
    const [courseFamiliarityIndices, setCourseFamiliarityIndices] = useState({});
    
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
    useEffect(() => {
        if (courses.length > 0) {
            const fetchIndices = async () => {
                const indices = {};
                await Promise.all(
                    courses.map(async (course) => {
                        const res = await fetch(
                            `http://localhost:3000/api/course-index?employeeID=${employeeID}&courseID=${course.course_id}`,
                            { credentials: 'include' }
                        );
                        const data = await res.json();
                        console.log("Fetched data for course:", course.course_id, "Data:", data);
                        let totalIndex = 0;
                        if (data) {
                            data.forEach((item) => {
                                const index = item.yesCount / item.totalCount || 0;
                                totalIndex += index;
                            });
                            indices[course.course_id] = data.length > 0 ? (totalIndex / data.length * 100).toFixed(2) : 0;
                        } else {
                            indices[course.course_id] = 0;
                        }
                    })
                );
                //console.log("Course Familiarity Indices:", indices);
                setCourseFamiliarityIndices(indices);
            };
            fetchIndices();
        }
    }, [courses, employeeID]);

     return (
        <div className="display-courses-container">
        <a href="/home" className="btn btn-primary"> Home </a>
            <div className="table-responsive">
                    <table className="table align-middle">
                        <thead className="table-success">
                            <tr>
                                <th>Course ID</th>
                                <th>Course Name</th>
                                <th>Familiarity Index</th>                               
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length > 0 ? (
                                courses.map((item) => (
                                    <tr key={item.course_id}>
                                        <td>{item.course_id}</td>
                                        <td>{item.course_name}</td> 
                                        <td>{courseFamiliarityIndices[item.course_id] }</td>                                       
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No courses found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>    
        </div>     
    );
}