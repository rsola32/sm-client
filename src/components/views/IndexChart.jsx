import React, { useRef, useState, useLayoutEffect } from 'react';
import { PieChart, Pie, Cell, Label, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './IndexChart.css';

// Memoized chart component to avoid re-rendering the PieChart when title state updates.
const ChartComponent = React.memo(({ progress, color }) => {
  const data = [
    { name: 'progress', value: progress },
    { name: 'remaining', value: 100 - progress }
  ];
  const COLORS = [color, '#e0e0e0'];
  
  return (
    <PieChart width={250} height={250}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={0}
        outerRadius={80}
        dataKey="value"
        startAngle={90}
        endAngle={-270}
        animationDuration={1500}
        animationEasing="ease-out"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index]} />
        ))}
        <Label
          value={`${progress}%`}
          position="center"
          style={{ fontSize: '24px', fill: '#004740', fontWeight: 'bold' }}
        />
      </Pie>
      <Tooltip />
    </PieChart>
  );
});

export default function IndexChart({ progress, title, detail, routeLink, color = "#0088FE" }) {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const [isOverflowed, setIsOverflowed] = useState(false);
  const [scrollDistance, setScrollDistance] = useState('0px');

  // useLayoutEffect to measure the title before paint.
  useLayoutEffect(() => {
    if (titleRef.current) {
      const containerWidth = titleRef.current.parentElement.clientWidth;
      const textWidth = titleRef.current.scrollWidth;
      if (textWidth > containerWidth) {
        setIsOverflowed(true);
        const extra = containerWidth - textWidth; // negative value for leftward scroll
        setScrollDistance(`${extra}px`);
      } else {
        setIsOverflowed(false);
      }
    }
  }, [title]);

  const handleClick = () => {
    if (routeLink) {
      navigate(routeLink);
    }
  };

  return (
    <div className="index-chart-container">
      {title && (
        <div className="index-chart-title-container">
          <h3
            ref={titleRef}
            className={`index-chart-title ${isOverflowed ? 'scrollable' : ''}`}
            style={isOverflowed ? { '--scroll-distance': scrollDistance } : {}}
          >
            {title}
          </h3>
        </div>
      )}
      <ChartComponent progress={progress} color={color} />
      <button
        className="view-details-btn"
        onClick={handleClick}
      >
        View Details
      </button>
    </div>
  );
}
