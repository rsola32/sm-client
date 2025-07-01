import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../AllPages.css'

export default function SkillForm() {

    const [skillId, setSkillId] = useState('');
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [skillType, setSkillType] = useState('');

  const bgcolor = "#B8D0EB"

  // Generate unique skill ID on component mount
  useEffect(() => {
    const newSkillId = uuidv4(); 
    setSkillId(newSkillId);

  }, []);

  const handleSubmit = async (e) => {
    // e.preventDefault();

    const payload = {
      skillId,
      skillName,
      skillDescription,
      skillType
    };

      const response = await fetch('http://localhost:3000/api/skill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

        // const data = await response.json();
        // console.log('Skill submitted successfully');

        // Clear the form fields and regenerate a new skill ID
        setSkillId(uuidv4());
        setSkillName('');
        setSkillDescription('');
        setSkillType('');
    
    
  };

  return (
    <>
    {/* <div className="container d-flex justify-content-center align-items-center vh-100"> */}
    <div className="card shadow-sm" style={{ width: '100%', maxWidth: '500px', backgroundColor: bgcolor }}>
      <div className="card-body">
        {/* <h3 className="card-title text-center mb-4">Add New Skill</h3> */}
        <form onSubmit={handleSubmit}>
          {/* Skill ID (auto-generated) */}
          <div className="mb-3">
            <label htmlFor="skillId" className="form-label">Skill ID (Auto-Generated)</label>
            <input
              type="text"
              className="form-control"
              id="skillId"
              value={skillId}
              readOnly
            />
          </div>

          {/* Skill Name */}
          <div className="mb-3">
            <label htmlFor="skillName" className="form-label">Skill Name</label>
            <input
              type="text"
              className="form-control"
              id="skillName"
              placeholder="Enter Skill Name"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              required
            />
          </div>

          {/* Skill Description */}
          <div className="mb-3">
            <label htmlFor="skillDescription" className="form-label">Skill Description</label>
            <textarea
              className="form-control"
              id="skillDescription"
              rows="3"
              placeholder="Enter Skill Description"
              value={skillDescription}
              onChange={(e) => setSkillDescription(e.target.value)}
              required
            ></textarea>
          </div>


          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </div>
    </div>
  {/* </div> */}
  </>
  )
}
