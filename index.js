const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Correctly encode the password
const password = encodeURIComponent('Moaz@Ali123');
const url = `mongodb+srv://amoaz14109:${password}@ecommerce-api.rqbexrw.mongodb.net/`;

// Connect to MongoDB
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Optional: reduce the server selection timeout
})
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

app.use(express.json());

// API endpoints
const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

// Authentication routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

app.listen(3000, () => {
    console.log("Server Running");
});
