"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
var react_router_1 = require("react-router");
var Home_1 = require("./pages/Home");
function App() {
    return (<react_router_1.Routes>
      <react_router_1.Route path="/" element={<Home_1.default />}/>
    </react_router_1.Routes>);
}
