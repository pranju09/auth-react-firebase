import React from "react";

function SectionWrapper({ children, className = "" }) {
  return (
    <section className="section-wrapper">
      <div className="container">
        <div className={`content-wrapper ${className}`}>{children}</div>
      </div>
    </section>
  );
}

export default SectionWrapper;
