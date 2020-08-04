const path = require("path");
const config = require("./config/default");
const NodemonPlugin = require("nodemon-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    name: "server",
    target: "node",
    externals: [nodeExternals()],
    entry: "./src/server/server.tsx",
    output: {
        filename: "server.js",
        path: path.resolve(__dirname, config.buildConfig.targetDir)
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "url-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [new NodemonPlugin()]
};
