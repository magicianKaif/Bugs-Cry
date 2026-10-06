"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_router_1 = require("react-router");
require("./index.css");
var App_tsx_1 = require("./App.tsx");
(0, client_1.createRoot)(document.getElementById('root')).render(<react_1.StrictMode>
    <react_router_1.BrowserRouter>
      <App_tsx_1.default />
    </react_router_1.BrowserRouter>
  </react_1.StrictMode>);
