"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var plugin_react_1 = require("@vitejs/plugin-react");
var vite_1 = require("vite");
var kimi_plugin_inspect_react_1 = require("kimi-plugin-inspect-react");
// https://vite.dev/config/
exports.default = (0, vite_1.defineConfig)({
    base: './',
    plugins: [(0, kimi_plugin_inspect_react_1.inspectAttr)(), (0, plugin_react_1.default)()],
    server: {
        port: 3000,
    },
    resolve: {
        alias: {
            "@": path_1.default.resolve(__dirname, "./src"),
        },
    },
});
