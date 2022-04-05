import React, { useState } from "react";

function FileDownloader({ getFileInfo }) {
  const downloadFile = () => {
    const element = document.createElement("a");
    const { fname, fcontents, ok } = getFileInfo();
    if (!ok) return;
    const file = new Blob([fcontents], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = fname;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  return <button onClick={(_) => downloadFile()}>Download Rule Spec</button>;
}

export default FileDownloader;
