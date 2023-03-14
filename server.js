import http from  "http";
import app from "./app/app.js";
import mongoose from "mongoose";

//server
const PORT = process.env.PORT || 9000
const server = http.createServer(app)
server.listen(PORT, console.log(`CEO PAUL server is running on port ${PORT}`))