import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import 'bootstrap/dist/css/bootstrap.min.css';
import { use } from 'react';
import '../AllPages.css'

export default function SubskillsForm(props) {
  // Create an initial array of 5 subskills, each with a unique ID.
  console.log(props.values)
  const [length, setLength] = useState(props.values.subskillNumber)
  const initialSubskills = Array.from({ length: length }, () => ({
    id: uuidv4(),
    subskillName: '',
    subskillDescription: '',
    skillId: props.values.selectedSkill,
    required: false
  }));

  // State to hold our subskills
  const [subskills, setSubskills] = useState(initialSubskills);

  // Update a particular field in a subskill (name, description, required)
  const handleChange = (index, field, value) => {
    const updatedSubskills = [...subskills];
    updatedSubskills[index] = {
      ...updatedSubskills[index],
      [field]: value
    };
    setSubskills(updatedSubskills);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare payload (an array of subskills)
    const payload = {
      subskills
    };

    try {
      const response = await fetch('http://localhost:3000/api/subskill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Subskills submitted successfully:', data);

        // Optionally reset the form with new UUIDs if you want another submission
        const resetSubskills = initialSubskills.map(() => ({
          id: uuidv4(),
          subskillName: '',
          subskillDescription: '',
          skillId: '',
          required: false
        }));
        setSubskills(resetSubskills);


      } else {
        const errorText = await response.text();
        console.error('Failed to submit subskills:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error submitting subskills:', error);
    }
  };

  return (
    <>
    <div className="container py-4">
      <h2 className="text-center mb-4">Add Subskills</h2>
      <form onSubmit={handleSubmit}>
        {subskills.map((subskill, index) => (
            <div key={subskill.id}>
            <div className="row mb-3" >
            {/* Subskill Name */}
            <div className="col">
              <label className="form-label" htmlFor={`subskillName-${subskill.id}`}>
                Subskill Name
              </label>
              <input
                type="text"
                className="form-control"
                id={`subskillName-${subskill.id}`}
                value={subskill.subskillName}
                onChange={(e) => handleChange(index, 'subskillName', e.target.value)}
                placeholder="Enter subskill name"
                required
              />
            </div>

            {/* Subskill Description */}
            <div className="col">
              <label className="form-label" htmlFor={`subskillDescription-${subskill.id}`}>
                Subskill Description
              </label>
              <textarea
                className="form-control"
                id={`subskillDescription-${subskill.id}`}
                rows = "2"
                value={subskill.subskillDescription}
                onChange={(e) => handleChange(index, 'subskillDescription', e.target.value)}
                placeholder="Enter subskill description"
                required
              />
            </div>

            {/* Required Checkbox */}
            <div className="col d-flex align-items-center mt-4 mt-sm-0">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`required-${subskill.id}`}
                  checked={subskill.required}
                  onChange={(e) => handleChange(index, 'required', e.target.checked)}
                />
                <label className="form-check-label" htmlFor={`required-${subskill.id}`}>
                  Required
                </label>
              </div>
            </div>
          </div>
          <div className="row mb-2" ><hr></hr></div>
          </div>
          
        ))}

        {/* Submit all 5 subskills at once */}
        <button type="submit" className="btn btn-primary w-100 mt-3 gitam-button">
          Submit
        </button>
      </form>
    </div>

    </>
  )
}
