import React from "react";

function Button({
  children,
  className = "",
  disabled = false,
  onClick,
  dataToggle,
  dataTarget,
  dataDismiss,
  dataLabel,
  btnLoading
}) {
  var classes = `btn ${className} `;
  disabled = btnLoading ? true : false;
  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      onClick={onClick}
      data-toggle={dataToggle}
      data-target={dataTarget}
      data-dismiss={dataDismiss}
      aria-label={dataLabel}
    >
      {children}
    </button>
  );
}

export { Button };
