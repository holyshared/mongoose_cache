const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  createdAt: {
    type: Date,
    require: true,
  },
  updatedAt: {
    type: Date,
    require: true,
  },
}, {
  toJSON: {
    getters: true,
    versionKey: false,
    transform: (_doc, ret, _) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },    
  }
});

class UserDocument {
}

UserSchema.loadClass(UserDocument);

exports.User = mongoose.model("User", UserSchema);
