const express = require("express"); 
const cors = require("cors");
require("dotenv").config();
require("../config/db.config"); 
const routerConfig = require("../config/router.config");

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }
        const allowedOrigins = ["http://localhost:5173", "https://smart-career-companion-sibv.vercel.app/" ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and credentials
    optionsSuccessStatus: 200 // For legacy browser support
};
//parser
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use((req, res, next) => {   
    next();
});

app.use(routerConfig)

app.use((req, res, next) => {
    next({ status: 404, message: "Resource not found." });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.log(error)
    let statusCode = error.status || 500;
    let message = error.message || "Server error ...";
    let details = error.details || null;

    res.status(statusCode).json({
        result: details,// Include details if available
        message: message,  // Include the messagecd 
        meta: null
    });
});


module.exports = app;
