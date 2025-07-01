import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DescriptionPanel from '../DescriptionPanel.jsx';

export default function DisplaySkills() {

  const [heading, description] = [`What is this page about?`,`This page allows you to manage and track your selected courses. 
    You can view course details, skill requirements, and rating information
    all in one place.`]

    const [skills, setSkills] = useState([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetch('http://localhost:3000/api/skill')
      .then((res) => res.json())
      .then((data) => setSkills(data))
      .catch((error) => console.error('Error fetching skill data:', error));
  }, []);


  // Filter the data based on universal search
  const filteredSkills = skills.filter((item) => {

    // Universal Search (case-insensitive check across all fields in the item)
    const combinedString = Object.values(item).join(' ').toLowerCase();
    if (!combinedString.includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <>
    <div className="container my-4">
      <h2 className="mb-4">Skill Details</h2>
      <DescriptionPanel
                      heading={heading}
                      body={description}
                      defaultExpanded={true}
                    />
      {/* Universal Search */}
      <div className="row mb-4">
        <div className="col-auto">
          <input
            type="text"
            id="searchTerm"
            className="form-control"
            style={{ width: '100%' }}
            placeholder="Search any field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      {/* Skills Table */}
      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="table-success">
            <tr>
              <th>Skill Name</th>
              <th>Skill Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredSkills.length > 0 ? (
              filteredSkills.map((item) => (
                <tr key={item.skill_id}>
                  <td>{item.skill_name}</td>
                  <td>{item.skill_description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No skills found
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
