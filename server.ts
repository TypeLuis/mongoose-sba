import express from "express"
import * as rowdy from "rowdy-logger"
import globalerror from "./middleware/globalError.js";
import notFound from "./middleware/notFound.js";
import logReq from "./middleware/logReq.js";
import dotenv from "dotenv";
import connectDB from "./database/conn.js";
import testRoutes from "./routes/testRoutes.js";
import cors from "cors";
import helmet from "helmet";

// Setup
dotenv.config() // loads the env file
const port = process.env.PORT || 3015
const app = express()
connectDB()
const routesReport = rowdy.begin(app)


// Middleware
app.use(helmet()); // Adds security-related HTTP headers to help protect the app from common web vulnerabilities
app.use(cors()) // Allows controlled cross-origin requests so frontend apps on other domains can access this API
app.use(express.json()) // allows to use json like getting req.body
app.use(logReq);



// Routes
app.get('/', (_req, res, _next) => {
    res.send('Hello!')
})

app.use('/api/test', testRoutes)



// Error Middleware
app.use(notFound)
app.use(globalerror)

// Listener
app.listen(port, ()=> {
    console.log(`server is running on PORT: ${port}`)
    routesReport.print()
})