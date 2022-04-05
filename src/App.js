import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import FileInput from "./FileInput";
import FileDownloader from "./FileDownloader";
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "react-flow-renderer";
import customStyles from "./ModalStyles";
import NodeSettingForm from "./UpdateForm";
import Modal from "react-modal";

function getWindowDims() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function displayNode({
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

      {/* <ul>
        {links.map((e, i) => {
          <li className="linkList" key={i}>
            {e}
          </li>;
        })}
      </ul> */}

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

Modal.setAppElement("#root");

function App() {
  const [decNodeList, updateDecNodeList] = useState(new Object());
  const { initialNodes, initialEdges } = decListToGraph(decNodeList);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalId, setModalId] = useState("");
  const [addingNewNode, setAddingNewNode] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  function onNodeModalOpen(modal_mod_name) {
    setAddingNewNode(false);
    setModalId(modal_mod_name);
    openModal();
  }

  function onAddNewClick() {
    setAddingNewNode(true);
    openModal();
  }

  function decListToGraph(decNodeList_) {
    const nodes_ = Object.entries(decNodeList_).map(([k, v], i) => {
      return {
        id: k,
        data: {
          label: displayNode({
            name: k,
            contents: v,
            onNodeModalOpen: onNodeModalOpen,
          }),
          store: v,
        },
        position:
          v.x_loc !== undefined && v.y_loc !== undefined
            ? { x: v.x_loc, y: v.y_loc }
            : { x: 100 + i * 100, y: 100 + i * 100 },
      };
    });
    const edges_ = [];
    Object.entries(decNodeList_).forEach(([k, v]) => {
      v.children.forEach((c) => {
        edges_.push({
          id: `${k}->${c}`,
          source: k,
          target: c,
        });
      });
    });
    return { initialNodes: nodes_, initialEdges: edges_ };
  }

  const onNodeEdit = (id, newNodeValue) => {
    let nodesCpy = [...nodes];
    let edgesCpy = [...edges];
    let createNew = true;
    nodesCpy.forEach(({ id: id_ }, i) => {
      if (id === id_) {
        createNew = false;
        nodesCpy[i].name = newNodeValue.name;
        nodesCpy[i].data.store = newNodeValue.contents;
        nodesCpy[i].data.label = displayNode({
          name: newNodeValue.name,
          contents: newNodeValue.contents,
          onNodeModalOpen: onNodeModalOpen,
        });
      }
    });
    if (createNew) {
      nodesCpy.push({
        id: newNodeValue.name,
        data: {
          label: displayNode({
            name: newNodeValue.name,
            contents: newNodeValue.contents,
            onNodeModalOpen: onNodeModalOpen,
          }),
          store: newNodeValue.contents,
        },
        position: { x: width / 2, y: height / 2 },
      });
    }
    edgesCpy.forEach(({ id, source, target }, i_) => {
      if (source === id) {
        edgesCpy[i_].source = newNodeValue.name;
      }
      if (target === id) {
        edgesCpy[i_].target = newNodeValue.target;
      }
    });
    setNodes(nodesCpy);
    setEdges(edgesCpy);
  };

  const setGraph = (decNodeList) => {
    const { initialNodes, initialEdges } = decListToGraph(decNodeList);
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  useEffect(() => setGraph(decNodeList), [decNodeList]);

  const onFileInput = (content_str) => {
    try {
      updateDecNodeList(JSON.parse(content_str));
    } catch (e) {
      alert("File must be valid json.");
    }
  };

  const getGraphStr = () => {
    let decNodeListCopy = {};
    nodes.forEach(({ id, data: { store }, position }) => {
      decNodeListCopy[id] = {
        ...store,
      };
      decNodeListCopy[id].x_loc = position.x;
      decNodeListCopy[id].y_loc = position.y;
      decNodeListCopy[id].children = [];
    });

    edges.forEach(({ id, source, target }) => {
      decNodeListCopy[source].children.push(target);
    });
    const fname = prompt("Enter file name:", "rule_spec.json");
    return {
      fname: fname,
      fcontents: JSON.stringify(decNodeListCopy),
      ok: true,
    };
  };

  const { width, height } = getWindowDims();

  return (
    <div className="App" style={{ width: `${width}px`, height: `${height}px` }}>
      {modalIsOpen ? (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
        >
          <NodeSettingForm
            old={(() => {
              if (addingNewNode) {
                return undefined;
              } else {
                let ret;
                nodes.forEach(({ id, data: { store } }) => {
                  if (id === modalId) {
                    ret = { name: id, contents: store };
                  }
                });
                return ret;
              }
            })()}
            setCb={(newNodeValue) => {
              onNodeEdit(
                addingNewNode ? newNodeValue.name : modalId,
                newNodeValue
              );
              closeModal();
            }}
          />
        </Modal>
      ) : (
        <>
          <FileInput onFileInput={onFileInput} />
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddNewClick();
            }}
          >
            Add New Node
          </button>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            defaultEdgeOptions={{
              markerEnd: {
                type: "arrowclosed",
                color: "red",
              },
            }}
            fitView
          />
          <FileDownloader getFileInfo={getGraphStr} />
        </>
      )}
    </div>
  );
}
export default App;

