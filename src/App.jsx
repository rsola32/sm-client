import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import './App.css'
import Login from './components/Login';
import CourseForm from './components/forms/CourseForm';
import SkillForm from './components/forms/SkillForm';
import CourseSkillMapping from './components/forms/CourseSkillMapping';
import Navigation from './components/Navigation';
import SubskillsForm from './components/forms/SubskillsForm';
import DisplayCourses from './components/views/DisplayCourses';
import DisplaySkillMapping from './components/views/DisplaySkillMapping';
import DisplaySkills from './components/views/DisplaySkills';
import WorkInProgress from './components/WorkInProgress';
import DisplayCourseSubskillMapping from './components/views/DisplayCourseSubskillMapping';
import DisplayFaculty from './components/views/DisplayFaculty';
import FacultyForm from './components/forms/FacultyForm';
import FacultyCourseMapping from './components/forms/FacultyCourseMapping';
import Rating from './components/Rating';
import FacultyMultipleCoursesMapping from './components/forms/FacultyMultipleCoursesMapping';
import DisplaySelectedCourses from './components/views/DisplaySelectedCourses';
import AI from './components/views/AI';
import FlowChart from './components/workTracking/FlowChart';
import RolesFlowChart from './components/workTracking/RolesFlowChart';
import HorizontalProgressBar from './components/HorizontalProgressBar';
import DescriptionPanel from './components/DescriptionPanel';
import IndexChart from './components/views/IndexChart';
import Report from './components/views/Report';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        {/* <Navigation /> */}

        {/* Define the route pages here */}
        <Routes>

          {/* HomePage Route */}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Navigation/>} />

          {/* Campus Routes */}
          <Route path="/campus/add" element={<WorkInProgress />} />
          <Route path="/campus/view" element={<WorkInProgress />} />

          {/* Faculty Routes */}
          <Route path="/faculty/add" element={<FacultyForm />} />
          <Route path="/faculty/view" element={<DisplayFaculty />} />

          {/* Course Routes */}
          <Route path="/course/add" element={<CourseForm />} />
          <Route path="/course/view" element={<DisplayCourses />} />

          {/* Skill Routes */}
          <Route path="/skill/add" element={<WorkInProgress />} />
          <Route path="/skill/view" element={<DisplaySkills />} />

          {/* Subskill Routes */}
          <Route path="/subskill/add" element={<WorkInProgress />} />
          <Route path="/subskill/view" element={<DisplayCourseSubskillMapping />} />

          {/* Skill Mapping Routes */}
          <Route path="/skill-mapping/add" element={<CourseSkillMapping />} />
          <Route path="/skill-mapping/view" element={<DisplaySkillMapping />} />

          {/* Faculty Mapping Routes */}
          <Route path="/faculty-mapping/add-single-course" element={<FacultyCourseMapping />} />
          <Route path="/faculty-mapping/add-multiple-courses" element={<FacultyMultipleCoursesMapping/>} />
          <Route path="/faculty-mapping/view" element={<WorkInProgress />} />

          {/* Rating Routes */}
          <Route path="/rating/add" element={<DisplaySelectedCourses/>} />
          <Route path="/rating/view" element={<WorkInProgress />} />

          {/* Report Routes */}
          <Route path="/report/courses" element={<Report/>} />
          <Route path="/report/skill-types" element={<DisplaySelectedCourses/>} />
          <Route path="/report/skill" element={<DisplaySelectedCourses/>} />

{/* Pie Chart */}
          <Route path="/piechart" element={<IndexChart  
        progress={75} 
        title="Course Progress" 
        detail="Click here to view course details." 
        routeLink="/course-details"
        />} />
        
          

{/* AI Route */}
<Route path="/ai" element={<AI/>} />

          {/* Login Route */}
          <Route path="/login" element={<Login />} />


          {/* Development Status */}
          <Route path="/status" element={<FlowChart/>} />
          <Route path="/roles" element={<RolesFlowChart/>} />
          
{/* Horizontal Progress Bar */}
<Route path="/progress" element={<HorizontalProgressBar 
         currentStep={2} 
         totalSteps={3} 
         stepLabels={["Faculty Profile", "Select Course", "Course Skill Rating"]} 
      />} />
      
      {/* Page Description */}
<Route path="/description" element={<DescriptionPanel
        heading="What is this page about?"
        body="This page allows you to manage and track your selected courses. 
              You can view course details, skill requirements, and rating information
              all in one place."
        defaultExpanded={true}
      />} />
        </Routes>
      </Router>


      {/* <Login/> */}
      {/* <CourseForm/> */}
      {/* <SkillForm/> */}
      {/* <CourseSkillMapping/> */}
    </>
  )
}

export default App
