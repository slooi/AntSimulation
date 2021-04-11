const path = require("path");
const exec = require("child_process").exec;
const nodeExternals = require("webpack-node-externals");

const beginPath = path.resolve(__dirname, "..");

module.exports = {
    watch: true,
    target: "node",
    devServer: {
        hot: true,
    },
    devtool: "source-map",
    mode: "development",
    entry: path.resolve(beginPath, "src", "server", "server.ts"),
    output: {
        path: path.resolve(beginPath, "build", "server"),
        filename: "server.js",
    },
    module: {
        rules: [
            // {
            // 	test: /\.ts$/,
            // 	loader: "babel-loader",
            // 	// use: [""],
            // },
            {
                test: /\.js$/i,
                use: ["source-map-loader"],
                enforce: "pre",
            },
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: "/node_modules/",
            },
        ],
    },
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder

    // plugins: [
    // 	{
    // 		apply: (compiler) => {
    // 			compiler.hooks.afterEmit.tap(
    // 				"AfterEmitPlugin",
    // 				(compilation) => {
    // 					console.log("NPM RUN START:SERVER!");
    // 					exec(
    // 						"node ./dist/server/server.js",
    // 						(err, stdout, stderr) => {
    // 							if (stdout) process.stdout.write(stdout);
    // 							if (stderr) process.stdout.write(stderr);
    // 						}
    // 					);
    // 				}
    // 			);
    // 		},
    // 	},
    // ],
};
