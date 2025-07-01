import React, { useState } from 'react';
import './FlowChart.css';

const flowchartData = {
  label: "Skill Matrix Software",
  children: [
    {
      label: "Faculty Management",
      description: "Manage skill data that faculty may possess or wish to develop.",
      features: [
        { text: "Faculty Profile Creation & Editing", status_id: 2 },
        { text: "Faculty Listing & Search", status_id: 1 },
        { text: "Mapping to Courses/Skills", status_id: 1 },
        { text: "User Authentication & Authorization", status_id: 2 }
      ]
    },
    {
      label: "Course Management",
      description: "Assess and record the proficiency of faculty in various skills.",
      features: [
        { text: "Course Creation & Editing", status_id: 2 },
        { text: "Course Listing & Search", status_id: 1 },
        { text: "Mapping with Faculty & Skills", status_id: 1 }
      ]
    },
    {
      label: "Skill Management",
      description: "Maintain and manage skills, subskills, and their integration with courses.",
      features: [
        { text: "Skill & Subskill Definition", status_id: 1 },
        { text: "Skill Listing & Filtering", status_id: 1 },
        { text: "Integration with Courses", status_id: 1 }
      ]
    },
    {
      label: "Skill Measurement For Faculty",
      description: "Provide functionality to assess and record faculty proficiency in various skills.",
      features: [
        { text: "Rating System", status_id: 2 },
        { text: "Mapping Ratings to Faculty", status_id: 2 },
        { text: "Automated Feedback", status_id: 3 }
      ]
    },
    {
      label: "Analysis And Reporting",
      description: "Provide insights through visualizations and detailed reports based on faculty, courses, and skills data.",
      features: [
        { text: "Dashboard Views", status_id: 3 },
        { text: "Detailed Reports", status_id: 3 },
        { text: "Semester-wise Progress Reports", status_id: 3 }
      ]
    },
    {
      label: "Action Plan And Results",
      description: "Recommend and manage development initiatives based on analysis, including certifications and faculty development programs.",
      features: [
        { text: "Action Plan Generation", status_id: 3 },
        { text: "Skill Development Program Management", status_id: 3 },
        { text: "Result Tracking & KPI Monitoring", status_id: 3 },
        { text: "Alerts & Notifications", status_id: 3 },
        { text: "Using AI for deep Insights", status_id: 2 }
      ]
    },
    {
      label: "Testing and Deployment",
      description: "Setting up deployment environment and making the website live",
      features: [
        { text: "Setting Up environment for deployment", status_id: 4 },
        { text: "Testing the system for bugs", status_id: 3 },
        { text: "Populating the system with data", status_id: 3 },
        { text: "Collecting skill rating of faculties", status_id: 3 }
      ]
    }
  ]
};

function getStatusColors(status_id) {
  switch (status_id) {
    case 1: return { main: '#28a745', light: '#d4edda' };  // Completed: green/light green
    case 2: return { main: '#007bff', light: '#cce5ff' };  // In progress: blue/light blue
    case 3: return { main: '#6c757d', light: '#e2e3e5' };  // Not started: gray/light gray
    case 4: return { main: '#dc3545', light: '#f8d7da' };  // Need external Support: red/light red
    default: return { main: '#000', light: '#f0f0f0' };
  }
}

function Legend() {
  return (
    <div className="legend">
      <span className="legend-item">
        <span className="legend-color" style={{
          backgroundColor: getStatusColors(1).light,
          borderColor: getStatusColors(1).main
        }}></span> Completed
      </span>
      <span className="legend-item">
        <span className="legend-color" style={{
          backgroundColor: getStatusColors(2).light,
          borderColor: getStatusColors(2).main
        }}></span> In progress
      </span>
      <span className="legend-item">
        <span className="legend-color" style={{
          backgroundColor: getStatusColors(3).light,
          borderColor: getStatusColors(3).main
        }}></span> Not started
      </span>
      <span className="legend-item">
        <span className="legend-color" style={{
          backgroundColor: getStatusColors(4).light,
          borderColor: getStatusColors(4).main
        }}></span> Need external Support
      </span>
    </div>
  );
}

function FlowChartNode({ node, filterStatus }) {
  const [expanded, setExpanded] = useState(false);

  const filteredFeatures = node.features 
  ? node.features.filter(feature => 
      filterStatus == null || filterStatus === 'all' || feature.status_id === Number(filterStatus)
    )
  : [];


  return (
    <div className="flowchart-node">
      <div className="node-title" onClick={() => setExpanded(!expanded)}>
        {node.label}
      </div>
      <div className={`node-content ${expanded ? 'expanded' : ''}`}>
        {node.description && (
          <div className="node-description">
            {node.description}
          </div>
        )}
        {filteredFeatures.length > 0 && (
          <ul className="node-features">
            {filteredFeatures.map((feature, idx) => {
              const { main, light } = getStatusColors(feature.status_id);
              return (
                <li
                  key={idx}
                  className="feature-item"
                  style={{ borderLeftColor: main, backgroundColor: light }}
                >
                  {feature.text}
                </li>
              );
            })}
          </ul>
        )}
        {node.children && node.children.length > 0 && (
          <div className="node-children">
            {node.children.map((child, idx) => (
              <FlowChartNode key={idx} node={child} filterStatus={filterStatus} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FlowChart() {
  // filterStatus: null means "All"; else 1,2,3,4
  const [filterStatus, setFilterStatus] = useState(null);

  return (
    <div className="flowchart-container">
      <div className="filter-container">
        <label htmlFor="statusFilter">Filter Features: </label>
        <select
          id="statusFilter"
          value={filterStatus === null ? 'all' : filterStatus}
          onChange={(e) => setFilterStatus(e.target.value === 'all' ? null : Number(e.target.value))}
        >
          <option value="all">All</option>
          <option value="1">Completed</option>
          <option value="2">In progress</option>
          <option value="3">Not started</option>
          <option value="4">Need external Support</option>
        </select>
      </div>

      <Legend />

      <FlowChartNode node={flowchartData} filterStatus={filterStatus} />
      
    </div>
  );
}
