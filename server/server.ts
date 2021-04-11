import express from "express";
const app = express();
const PORT = 8000;

const server = app.listen(PORT, () => {
    console.log(`server listening on port: ${PORT}`);
});
