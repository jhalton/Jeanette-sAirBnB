import React, { useState } from "react";
import "./Tooltip.css";

const Tooltip = ({ text, children, ...rest }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <div className="tooltip-container">
        <div
          style={isVisible ? { visibility: "visible" } : {}}
          className="tooltip"
        >
          {" "}
          {text}
        </div>
        <span className="tooltip-arrow" />
      </div>
      <div
        {...rest}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
        {/* {isVisible ? <div className="tooltip">{text}</div> : null} */}
      </div>
    </div>
  );
};

export default Tooltip;
