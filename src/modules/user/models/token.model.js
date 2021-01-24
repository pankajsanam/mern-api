const mongoose = require('mongoose');
const { toJSON } = require('../../../utils/db/plugins');

const {
  String, Date, Boolean, ObjectId
} = mongoose.SchemaTypes;

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['refresh', 'resetPassword'],
      required: true
    },
    expires: {
      type: Date,
      required: true
    },
    blacklisted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
