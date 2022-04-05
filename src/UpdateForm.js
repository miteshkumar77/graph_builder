import React, { useState } from "react";


function EditableList({ list, setListFn, className, placeholder }) {
  const [formText, setFormText] = useState("");
  return (
    <div className={className}>
      <ul className={`${className}-list`}>
        {list.map((e, i) => {
          return (
            <li key={i}>
              <h5 className={`${className}-item-name`}>{e}</h5>
              <button
                color="red"
                className={`${className}-del-buton`}
                onClick={(e) => {
                  e.preventDefault();
                  setListFn([].concat(list.slice(0, i), list.slice(i + 1)));
                }}
              >
                x
              </button>
            </li>
          );
        })}
      </ul>
        <input
          type="text"
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          placeholder={placeholder}
          className={`${className}-input`}
        />
        <button className={`${className}-submit-btn`}
          onClick={(e) => {
            e.preventDefault();
            setListFn(list.concat([formText]))
            setFormText("")
          }}>Add</button>
    </div>
  );
}

function NodeSettingForm({ old, setCb }) {
  if (old === undefined) {
    old = {
      name: "",
      contents: {
        display: {
          prompt: "",
          links: [],
          description: "",
        },
        keywords: [],
      },
    };
  }

  const [name, setName] = useState(old.name);
  const [prompt, setPrompt] = useState(old.contents.display.prompt);
  const [links, setLinks] = useState(old.contents.display.links);
  const [description, setDescription] = useState(
    old.contents.display.description
  );
  const [keywords, setKeywords] = useState(old.contents.keywords);

  const onSubmit = () => {

    setCb({
      name: name,
      contents: {
        display: {
          prompt: prompt,
          links: links,
          description: description,
        },
        keywords: keywords,
      },
    });
  };

  return (
    <div>
        <input
          type="text"
          onChange={(e) => {
            setName(e.target.value);
          }}
          value={name}
          placeholder="unique node id"
        />
        <textarea
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          value={prompt}
          placeholder="prompt"
        />
        <EditableList
          list={links}
          setListFn={setLinks}
          className="link-list"
          placeholder={"add a web url"}
        />
        <textarea
          type="text"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          value={description}
          placeholder="description"
        />
        <EditableList
          list={keywords}
          setListFn={setKeywords}
          className="keywords-list"
          placeholder={"add a keyword"}
        />
        <button onClick={onSubmit}>Submit</button>
    </div>
  );
}

export default NodeSettingForm;
