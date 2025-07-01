import React from 'react';
import './HorizontalProgressBar.css';

function HorizontalProgressBar({ currentStep = 1, totalSteps = 3, stepLabels = [] }) {
  // Build steps array using provided labels (if available) or default labels.
  const steps = stepLabels.length === totalSteps
    ? stepLabels.map((label, i) => ({ step: i + 1, label }))
    : Array.from({ length: totalSteps }, (_, i) => ({
        step: i + 1,
        label: `Step ${i + 1}`
      }));

  // Calculate progress percentage (as a number) from the center of the first circle to the center of the last.
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <>
      <div className="top-space"></div>
      <div className="hp-container">
        <div className="hp-bar-wrapper">
          <div
            className="hp-progress-bar"
            style={{ '--hp-progress-percent': progressPercent }}
          >
            {steps.map(({ step, label }) => {
              const isActive = currentStep >= step;
              return (
                <div className="hp-step-wrapper" key={step}>
                  <div className={`hp-circle ${isActive ? 'hp-active' : ''}`}>
                    {currentStep > step ? (
                      <span className="hp-checkmark">&#10003;</span>
                    ) : (
                      <span className="hp-step-num">{step}</span>
                    )}
                  </div>
                  <div className="hp-label">{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default HorizontalProgressBar;
