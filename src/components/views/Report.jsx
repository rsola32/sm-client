import React, { useState } from 'react';
import IndexChart from './IndexChart';
import './Report.css';

export default function Report() {
  const colors = ['#008800', '#E0B541', '#5E95CD'];

  const [data, setData] = useState([]);

  return (
    <div className="report-container">
      {data.map((item, index) => (
        <div key={index} className="index-chart-card">
          <IndexChart  
            progress={item.course_index} 
            title={item.course_name} 
            detail="Click here to view course details." 
            routeLink={`/report/${item.course_name.split(' ')
              .filter(word => word.length > 0)
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join('')}`}
            color={colors[2]}
          />
        </div>
      ))}
    </div>
  );
}
