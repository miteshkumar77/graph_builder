import React from "react";

function FlowNode({
  name,
  contents: {
    display: { prompt, description },
    keywords,
  },
  onNodeModalOpen,
}) {
  return (
    <div className="displayNode" id={name}>
      <h4>{prompt}</h4>

      <ul className="keywordList">
        {keywords.map((e, i) => {
          return (
            <li className="keywordListComponent" key={i}>
              {e}
            </li>
          );
        })}
      </ul>
      <p className="nodeDescription">
        <b>Description: </b>
        {description}
      </p>
      <button onClick={(e) => onNodeModalOpen(name)}>Edit</button>
    </div>
  );
}

export default FlowNode;
