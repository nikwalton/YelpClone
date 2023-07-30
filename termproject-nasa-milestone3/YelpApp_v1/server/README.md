# API Backend
In order to properly run the client, the API server needs to be running. This server is built off of Expressjs and the node-postgres library.

## Running the server
once you ran ```yarn install``` to install the dependencies run ```node index.js```
You should see "We Are listening on port 4040" in the terminal to indicate that it's active.
All errors are sent through the API Responses.

## Creating Routes

All routes should go in the index.js file in this directory (not in /db). We can seperate the routes
into seperate files later, but for now this allows for quick development.