import React, { useRef } from "react";

function TextInput({
  type = "text",
  placeholder,
  value,
  name,
  onChange,
  error,
  disabled = false
}) {
  let haserror = error ? "haserror" : "";
  const inputRef = useRef(null);
  if (error) {
    inputRef.current.focus();
  }
  return (
    <>
      <div className="input-group text-input">
        <input
          type={type || "text"}
          className={`form-control ${haserror}`}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete="off"
          ref={inputRef}
          disabled={disabled}
        />
        <label>{placeholder}</label>
      </div>
      {error && <p className="error-text">{error}</p>}
    </>
  );
}

export default TextInput;
