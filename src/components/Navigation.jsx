import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import './GitamBrand.css';
import './AllPages.css';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';


export default function Navigation() {
  const navigate = useNavigate();

  // Helper function to retrieve a cookie's value
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  };

  const setCookie = (name,value) => {
    document.cookie = "$name=$value; path=/; max-age=3600";
    //Cookies.set(name,value, { expires: 1, path: '/' }); 
  }
  const [token, setToken] = useState(getCookie("token"));
  const [decoded, setDecoded] = useState({ role_id: '0' });
  //const [role, setRole] = useState('3');

  useEffect(() => {
    if (token) {
      try {
        setDecoded(jwtDecode(token));
        console.log("Decoded token:", decoded); 
      } catch (error) {
        console.error("Invalid token:", error);
        setDecoded({ role_id: '0' });
      }
    }
  }, [token]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setToken(null);
    setDecoded({ role_id: '0' });
    navigate('/');
  };

  // Features available in the system
  const featureAccess = [
    { feature_id: 1, feature_name: 'Campus', feature_description: 'Manage Campus' },
    { feature_id: 2, feature_name: 'All Faculty', feature_description: 'Manage Faculty' },
    { feature_id: 3, feature_name: 'All Courses', feature_description: 'Manage Course' },
    { feature_id: 4, feature_name: 'Skill', feature_description: 'Manage Skill' },
    { feature_id: 5, feature_name: 'Subskill', feature_description: 'Manage Subskill' },
    { feature_id: 6, feature_name: 'Course Skill Mapping', feature_description: 'Map Skills' },
    { feature_id: 7, feature_name: 'Faculty Mapping', feature_description: 'Map Faculty to Courses' },
    { feature_id: 8, feature_name: 'Mapped Courses', feature_description: 'Mapped Courses' },
    { feature_id: 9, feature_name: 'Faculty Reports', feature_description: 'Faculty Reports' },
    { feature_id: 10, feature_name: 'Dept Reports', feature_description: 'Dept Reports' },
    { feature_id: 11, feature_name: 'Artificial Intelligence', feature_description: 'AI Feature' }
  ];

  // Role-to-feature mapping: role_id => array of allowed feature_ids
  const roleFeatureMap = {
    0: [],
    1: [7, 8, 9],       // Faculty: Faculty Mapping, Rating
    2: [2, 3, 6, 10],   // HOD: Faculty, Course
    3: [3, 6, 7, 9],    // Faculty: All Courses, Course Skills, Mapped Courses 
    4: [3, 4, 5],       // Student: Course, Skill, Subskill
    5: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]  // Admin: All features
  };

  // Memoize allowedFeatures based on decoded.role_id
  const allowedFeatures = useMemo(() => roleFeatureMap[decoded.role_id] || [], [decoded]);

  return (
    <Navbar expand="md" fixed="top" className="bg-custom">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">
          Skill Matrix
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {allowedFeatures.includes(1) && (
              <NavDropdown title="Campus" id="campus-dropdown">
                <NavDropdown.Item as={Link} to="/csd/add">
                  Add Campus, School and Department 
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/csd/view">
                  View Campus, School and Department
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {allowedFeatures.includes(2) && (
              <NavDropdown title="All Faculty" id="faculty-dropdown">
                <NavDropdown.Item as={Link} to="/faculty/add">
                  Add
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/faculty/view">
                  View
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {allowedFeatures.includes(3) && (
              <NavDropdown title="All Courses" id="course-dropdown">
                <NavDropdown.Item as={Link} to="/course/add">
                  Add
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/course/view">
                  View
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {allowedFeatures.includes(4) && (
              <NavDropdown title="Skill" id="skill-dropdown">
                <NavDropdown.Item as={Link} to="/skill/add">
                  Add(IP)
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/skill/view">
                  View
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {allowedFeatures.includes(5) && (
              <NavDropdown title="Subskill" id="subskill-dropdown">
                <NavDropdown.Item as={Link} to="/subskill/add">
                  Add(IP)
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/subskill/view">
                  View
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {allowedFeatures.includes(6) && (
              <NavDropdown title="Course Skill Mapping" id="skill-mapping-dropdown">
                <NavDropdown.Item as={Link} to="/course-skill-mapping/add">
                  Add
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/course-skill-mapping/view">
                  View
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {allowedFeatures.includes(7) && (
              <NavDropdown title="Course Faculty Mapping" id="faculty-mapping-dropdown">
                <NavDropdown.Item as={Link} to="/course-faculty-mapping/add-single-course">
                  Map Single Course
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/course-faculty-mapping/add-multiple-courses">
                  Map Multiple Courses
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/course-faculty-mapping/view">
                  View Mapped Courses
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {allowedFeatures.includes(8) && (
              <NavDropdown title="Mapped Courses" id="mapping-dropdown">
                <NavDropdown.Item as={Link} to="/course-mapping/view">
                  View
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/course-mapping/add">
                  Add
                </NavDropdown.Item>
              </NavDropdown>              
            )}
            {allowedFeatures.includes(9) && (
              <NavDropdown title="Familiarity Marking" id="marking-dropdown">
                <NavDropdown.Item as={Link} to="/course-faculty-mapping/view">
                  View
                </NavDropdown.Item>
              </NavDropdown>              
            )}
            {allowedFeatures.includes(9) && (
              <NavDropdown title="Reports" id="freport-dropdown">
                <NavDropdown.Item as={Link} to="/freport/courses">
                  Courses
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/freport/skills">
                  Skills
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {allowedFeatures.includes(10) && (
              <NavDropdown title="Reports" id="report-dropdown">
                <NavDropdown.Item as={Link} to="/report/faculty">
                  Faculty
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/report/courses">
                  Courses
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/report/skills">
                  Skills
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {allowedFeatures.includes(11) && (
              <Nav className="d-flex align-items-center">
                <Nav.Link as={Link} to="/ai" className="text-dark">
                  Use Artificial Intelligence
                </Nav.Link>
              </Nav>
            )}
          </Nav>
          <Nav className="ms-auto">
            {token ? (
              <Nav.Link as={Link} to="/" onClick={handleLogout} className="text-white">
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login" onClick={handleLogin} className="text-white">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
