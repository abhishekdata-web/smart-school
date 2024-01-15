const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const userSchema = mongoose.Schema({
    mobile: {
        type: Number,
        unique: 1
    },
    password: {
        type: String
    },
    admit: {
        type: Date
    },
    unireg: {
        type: String
    },
    shift: {
        type: String
    },
    standard: {
        type: String
    },
    firstname: {
        type: String
    },
    middlename: {
        type: String
    },
    lastname: {
        type: String
    },
    gender: {
        type: String
    },
    bg: {
        type: String
    },
    dob: {
        type: Date
    },
    district: {
        type: String
    },
    address: {
        type: String
    },
    nationality: {
        type: String
    },
    ethinic: {
        type: String
    },
    religion: {
        type: String
    },
    detail: {
        type: String
    },
    status: {
        type: String,
        default: 0
    },
    role: {
        type: Number,
        default: 0
    },
    attendance:{
        type: Array,
        default: []
    },
    token: {
        type: String
    }
})

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);

                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), process.env.SECRET);

    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    })
}

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    jwt.verify(token, process.env.SECRET, function (err, decode) {
        user.findOne({ "_id": decode, "token": token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User };