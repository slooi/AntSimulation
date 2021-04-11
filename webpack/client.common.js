const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const typescriptIsTransformer = require("typescript-is/lib/transform-inline/transformer").default;

const beginPath = path.resolve(__dirname, "..");

module.exports = {
    // watch: true,	// already true becuse webpack serve
    target: "web",
    devtool: "source-map",
    devServer: {
        port: 8080,
        hot: true,
        open: true,
        // contentBase: path.resolve(beginPath, "src", "client"),
        // publicPath: path.resolve(beginPath, "src", "client"),
        // contentBase: ["./src", "./build"],
        // inline: true,

        // proxy: {
        //     "/": {
        //         target: "http://localhost:8000/",
        //     },
        // },
    },
    mode: "development",
    entry: path.resolve(beginPath, "src", "client", "main.ts"),
    output: {
        path: path.resolve(beginPath, "build", "client"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/i,
                loader: "babel-loader",
                exclude: "/node_modules/",
            },
            {
                test: /\.ts$/i,
                loader: "ts-loader",
                exclude: "/node_modules/",
                options: {
                    getCustomTransformers: (program) => ({
                        before: [typescriptIsTransformer(program)],
                    }),
                },
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
                use: ["file-loader"],
            },
            {
                test: /\.(glsl|vs|fs)$/,
                loader: "ts-shader-loader",
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 16384, // in bytes
                        },
                    },
                ],
            },
            // {
            //     test: /\.ts$/,
            //     exclude: /node_modules/,
            //     loader: "ts-loader",
            //     options: {
            //         getCustomTransformers: (program) => ({
            //             before: [typescriptIsTransformer(program)],
            //         }),
            //     },
            // },
            // {
            //     test: /\.js$/,
            //     enforce: "pre",
            //     use: ["source-map-loader"],
            // },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(beginPath, "src", "client", "index.html"),
        }),
    ],
    resolve: {
        extensions: [".ts", ".js", ".json"],
        fallback: { util: require.resolve("util/") },
    },
};
