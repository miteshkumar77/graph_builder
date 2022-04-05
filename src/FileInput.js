import React, { useState } from "react";

function getFileStr(file, cb) {
  file
    .text()
    .then(cb)
    .catch((e) => console.log("Error opening file..."));
}

function FileInput({ onFileInput }) {
  const [selectedFile, setSelectedFile] = useState();
  const handleFile = (e) => {
    e.preventDefault();
    getFileStr(selectedFile, onFileInput);
  };

  return (
    <form onSubmit={handleFile}>
      <input
        type="file"
        onChange={(e) => {
          setSelectedFile(e.target.files[0]);
        }}
      />
      <button>Submit</button>
    </form>
  );
}

export default FileInput;