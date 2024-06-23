const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    date_of_birth: { type: Date, required: true},
    profileImage: { type: String, required: false },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
