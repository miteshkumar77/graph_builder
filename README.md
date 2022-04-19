# Graph Builder
A simple graphical tool to construct a set of rules for a rule-based chatbot.

## Why a tree

In our design, the client is programmed to send the user's message, as well as the current node_id of the user to the chatbot API. The API will then analyze the message to extract its key words, and then pick the most relevant child node of node_id, in order to determine the next message to respond with. The API will also send back the identifier of the new node, allowing the client to update its current node_id in preparation for the next user message. The more detailed this tree is, the better the chatbot will perform. In general, the tree should reflect the structure of the EDN wiki, but it can deviate from it as well. Please make sure to read the General Guidelines section before attempting to construct your own tree.

## Loading an existing rule spec file

Download the attached rule_spec2.json file at the bottom of this page. Drag and drop it near the Choose File button and click submit. This will
load the tree onto the canvas.

## Manipulating the tree

### Adding a new node

Add a new node by clicking the Add New Node button at the top. This will bring up a form. To cancel the form,
press the escape key, or click anywhere outside of the form.

### Adding an edge

Click and drag from one node to another in order to add a directional edge. 

### Deleting a node

Click on the node you want to delete, and press back space.

### Deleting an edge

Click on the edge you want to delete, causing it to become bolded, and press back space.

### Editing an edge

Each node will have an edit button, which will open up the same form as the Add New Node button, but with the existing information filled in already. Editing this and saving it will reflect in the new tree.

## Saving the tree to a json file

Scroll all the way to the bottom using the scroll bar on the right (scroll wheel may not work). Then click the Download Rule Spec button.

## General Guidelines

1. The *unique node id* must be unique, and each tree must have a root node with the id "entry", in order for it to work with the back-end.
1. The *prompt* is the "message" that the chatbot sends to the user when encountering this node. It should use conversational language.
1. The list of *web urls* should link to associated pages in the wiki, if any.
1. The *description* Should provide more details that elaborate on the prompt, and can include what further topics stem from this node.
1. The *keywords* will be used to match user messages to nodes based on relevance. The chatbot will "follow" the edge that leads to the most relevant node in order to determine the next message to respond to the user with. These keywords don't need to exactly match the user's input, they must only be similar, so there is no need to add multiple forms of the same word (e.g. website, web-site, websites, web site, etc.). The chatbot will be more effective the less similar the keywords of the sibling nodes are. Lastly, the required "entry" node can have an empty keyword list since it will never have any parent nodes.
