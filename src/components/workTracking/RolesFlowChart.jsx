import React, { useState } from 'react';
import './FlowChart.css';

const flowchartData = [
    {
      "label": "SuperAdmin",
      "children": [
        {
          "label": "DashboardViews",
          "description": "Overview of system health, aggregate metrics, and user engagement.",
          "features": [
            { "text": "Overall system health metrics", "status_id": 2 },
            { "text": "Aggregate counts of faculty, courses, skills, and ratings", "status_id": 1 },
            { "text": "System activity and user engagement dashboard", "status_id": 1 }
          ]
        },
        {
          "label": "DetailedReports",
          "description": "Comprehensive reports with breakdowns by campus, department, and overall performance.",
          "features": [
            { "text": "Detailed breakdown of faculty performance by campus and department", "status_id": 1 },
            { "text": "Comprehensive course and skill performance analysis", "status_id": 1 },
            { "text": "Audit logs and error reporting", "status_id": 1 }
          ]
        },
        {
          "label": "SemesterWiseProgressReports",
          "description": "Comparative semester trends and performance improvements across the organization.",
          "features": [
            { "text": "Comparative semester trends across campuses and departments", "status_id": 1 },
            { "text": "Aggregate performance improvements and challenges over time", "status_id": 1 }
          ]
        }
      ]
    },
    {
      "label": "CampusHead",
      "children": [
        {
          "label": "DashboardViews",
          "description": "Campus-level metrics including faculty counts, departmental performance, and alerts.",
          "features": [
            { "text": "Campus-level faculty count and performance metrics", "status_id": 1 },
            { "text": "Departmental performance summaries within the campus", "status_id": 1 },
            { "text": "Alerts and key issue indicators for the campus", "status_id": 1 }
          ]
        },
        {
          "label": "DetailedReports",
          "description": "In-depth departmental reports and course performance breakdowns at the campus level.",
          "features": [
            { "text": "Detailed department-wise performance reports", "status_id": 1 },
            { "text": "Faculty and course performance breakdown within the campus", "status_id": 1 }
          ]
        },
        {
          "label": "SemesterWiseProgressReports",
          "description": "Semester comparisons for overall campus metrics and departmental trends.",
          "features": [
            { "text": "Semester comparisons for campus-wide metrics", "status_id": 1 },
            { "text": "Trends in departmental performance and improvements over time", "status_id": 1 }
          ]
        }
      ]
    },
    {
      "label": "HeadOfInstitute",
      "children": [
        {
          "label": "DashboardViews",
          "description": "Institute-level aggregate metrics, academic performance, and strategic KPIs.",
          "features": [
            { "text": "Institute-level aggregate performance metrics", "status_id": 1 },
            { "text": "Overview of academic performance and faculty development initiatives", "status_id": 1 },
            { "text": "KPI summaries for institute-wide strategic goals", "status_id": 1 }
          ]
        },
        {
          "label": "DetailedReports",
          "description": "Detailed breakdowns per campus and department with comparative analyses.",
          "features": [
            { "text": "Detailed breakdowns per campus and per department", "status_id": 1 },
            { "text": "Comparative analysis across campuses", "status_id": 1 },
            { "text": "Reports on skill measurement and faculty development progress", "status_id": 1 }
          ]
        },
        {
          "label": "SemesterWiseProgressReports",
          "description": "Institute-wide performance trends and training effectiveness over semesters.",
          "features": [
            { "text": "Institute-wide performance trends over semesters", "status_id": 1 },
            { "text": "Analysis of training effectiveness and overall faculty development", "status_id": 1 }
          ]
        }
      ]
    },
    {
      "label": "HeadOfDepartment",
      "children": [
        {
          "label": "DashboardViews",
          "description": "Department-level metrics focusing on faculty ratings and course outcomes.",
          "features": [
            { "text": "Department-level performance metrics", "status_id": 1 },
            { "text": "Faculty ratings and course outcome summaries", "status_id": 1 },
            { "text": "Visual KPI dashboard for the department", "status_id": 1 }
          ]
        },
        {
          "label": "DetailedReports",
          "description": "Individual faculty reports, detailed course and skill outcome analysis.",
          "features": [
            { "text": "Individual faculty performance reports", "status_id": 1 },
            { "text": "Detailed skill measurement and course outcome analysis", "status_id": 1 },
            { "text": "Breakdowns of departmental achievements and challenges", "status_id": 1 }
          ]
        },
        {
          "label": "SemesterWiseProgressReports",
          "description": "Semester trends in faculty skill improvements and course performance within the department.",
          "features": [
            { "text": "Semester trends in faculty skill improvements", "status_id": 1 },
            { "text": "Course performance trends over time within the department", "status_id": 1 }
          ]
        }
      ]
    },
    {
      "label": "Dean",
      "children": [
        {
          "label": "DashboardViews",
          "description": "Aggregated metrics for a specific department across all campuses with cross-campus comparisons.",
          "features": [
            { "text": "Aggregated performance metrics for a specific department across all campuses", "status_id": 1 },
            { "text": "Comparative dashboard showing cross-campus performance", "status_id": 1 },
            { "text": "Key performance indicators (KPIs) for departmental initiatives", "status_id": 1 }
          ]
        },
        {
          "label": "DetailedReports",
          "description": "In-depth aggregated reports comparing faculty performance and course/skill measurements across campuses.",
          "features": [
            { "text": "Detailed, aggregated reports from each campus for the department", "status_id": 1 },
            { "text": "Comparison of faculty performance across campuses", "status_id": 1 },
            { "text": "In-depth course and skill measurement breakdowns", "status_id": 1 }
          ]
        },
        {
          "label": "SemesterWiseProgressReports",
          "description": "Semester-wise trends for departmental performance across campuses with comparative analysis.",
          "features": [
            { "text": "Semester-wise trends in departmental performance across campuses", "status_id": 1 },
            { "text": "Comparative analysis highlighting improvement areas and challenges", "status_id": 1 }
          ]
        }
      ]
    },
    {
      "label": "CourseCoordinator",
      "children": [
        {
          "label": "DashboardViews",
          "description": "Course-specific performance metrics including enrollment, ratings, and skill measurements.",
          "features": [
            { "text": "Course-specific performance metrics", "status_id": 1 },
            { "text": "Enrollment, average ratings, and skill measurement dashboards for the course", "status_id": 1 },
            { "text": "Real-time updates on course engagement", "status_id": 1 }
          ]
        },
        {
          "label": "DetailedReports",
          "description": "Detailed analyses of course outcomes, faculty involvement, and student engagement.",
          "features": [
            { "text": "Detailed analysis of course outcomes and faculty involvement", "status_id": 1 },
            { "text": "Course feedback and skill measurement breakdowns", "status_id": 1 },
            { "text": "Reports on student engagement and course effectiveness", "status_id": 1 }
          ]
        },
        {
          "label": "SemesterWiseProgressReports",
          "description": "Semester comparisons of course performance, satisfaction, and trends in faculty engagement.",
          "features": [
            { "text": "Semester comparisons of course performance and satisfaction", "status_id": 1 },
            { "text": "Trends in faculty and course performance over time", "status_id": 1 }
          ]
        }
      ]
    },
    {
      "label": "CourseChampion",
      "children": [
        {
          "label": "DashboardViews",
          "description": "Aggregated course metrics across all campuses with comparative performance overviews.",
          "features": [
            { "text": "Aggregated course metrics across all campuses", "status_id": 1 },
            { "text": "Comparative performance dashboard for the course", "status_id": 1 },
            { "text": "Overview of cross-campus course engagement and outcomes", "status_id": 1 }
          ]
        },
        {
          "label": "DetailedReports",
          "description": "Campus-wise detailed breakdowns of course performance and analysis of ratings and skill measurements.",
          "features": [
            { "text": "Campus-wise detailed breakdown of course performance", "status_id": 1 },
            { "text": "Analysis of course ratings and skill measurements per campus", "status_id": 1 },
            { "text": "Comparative reports highlighting strengths and improvement areas", "status_id": 1 }
          ]
        },
        {
          "label": "SemesterWiseProgressReports",
          "description": "Semester-wise progress trends for the course across campuses and identification of improvement areas.",
          "features": [
            { "text": "Semester-wise progress trends for the course across campuses", "status_id": 1 },
            { "text": "Identification of improvement areas over time", "status_id": 1 }
          ]
        }
      ]
    },
    {
      "label": "Faculty",
      "children": [
        {
          "label": "DashboardViews",
          "description": "Personal performance dashboards featuring ratings, skill metrics, and training recommendations.",
          "features": [
            { "text": "Personal performance dashboard with ratings and skill metrics", "status_id": 1 },
            { "text": "Self-assessment and progress indicators", "status_id": 1 },
            { "text": "Recommended training modules and certification status", "status_id": 1 }
          ]
        },
        {
          "label": "DetailedReports",
          "description": "Individual performance reports with detailed feedback, skill gap analysis, and comparative benchmarks.",
          "features": [
            { "text": "Individual performance reports with detailed feedback", "status_id": 1 },
            { "text": "Skill gap analysis and personalized improvement recommendations", "status_id": 1 },
            { "text": "Reports comparing personal progress with departmental benchmarks", "status_id": 1 }
          ]
        },
        {
          "label": "SemesterWiseProgressReports",
          "description": "Personal progress trends across semesters compared with departmental and campus averages.",
          "features": [
            { "text": "Personal progress trends over semesters", "status_id": 1 },
            { "text": "Comparative analysis with departmental and campus averages", "status_id": 1 }
          ]
        }
      ]
    }
  ]
  ;

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

  // const filteredFeatures = node.features
  //   ? node.features.filter(feature => !filterStatus || feature.status_id === filterStatus)
  //   : [];

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

.{flowchartData.map((data)=>(
    <div>
<FlowChartNode node={data} filterStatus={filterStatus} />
    </div>
))}
      
    </div>
  );
}
