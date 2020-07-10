const validator = require('validator');
const mongoose = require('../../config/database');

const userSchema = mongoose.Schema({
  name: {
    type: mongoose.SchemaTypes.String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid!');
      }
    }
  },
  password: {
    type: mongoose.SchemaTypes.String,
    required: true,
    select: false,
    minlength: 7,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error('Please enter your password!');
      } else if (validator.equals(value.toLowerCase(), 'password')) {
        throw new Error('Password is invalid!');
      } else if (validator.contains(value.toLowerCase(), 'password')) {
        throw new Error('Password should not contain password!');
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    }
  },
  tokens: [{
    token: {
      type: mongoose.SchemaTypes.String,
      required: false
    }
  }],
  createdDate: {
    type: Date,
    default: Date.now
  }
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;
