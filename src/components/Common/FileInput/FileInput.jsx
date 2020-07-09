import React, { useState, useEffect } from "react";

import app from "firebase/app";
import "firebase/storage";

const FileInput = ({ value, profile_picture, onChange }) => {
  const [defaultAvatar, setDefaultAvatar] = useState("");

  useEffect(() => {
    app
      .storage()
      .ref("default/dummy-avatar.jpg")
      .getDownloadURL()
      .then(url => {
        setDefaultAvatar(url);
      });
  });
  return (
    <div className="profile-upload">
      <img
        src={profile_picture || defaultAvatar}
        alt="User Image"
        className="img-container"
      />
      <label>
        <input type="file" className="file-input" onChange={onChange} />
      </label>
    </div>
  );
};

export default FileInput;
