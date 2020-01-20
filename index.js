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
});

class UserDocument {
}

UserSchema.loadClass(UserDocument);

const User = mongoose.model("User", UserSchema);


mongoose.connect('mongodb://example:example@localhost:27017/example', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function run() {
  const user = await User({
    name: 'name',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  console.log(`user.isNew ${user.isNew}`);
  await user.save();
  console.log(`user.isNew ${user.isNew}`);

  const jsonOfUser = await user.toJSON();
  const hydratedUser = User.hydrate(jsonOfUser);
  console.log(`hydratedUser.isNew ${hydratedUser.isNew}`);
  await hydratedUser.save();
  console.log(`hydratedUser.isNew ${hydratedUser.isNew}`);
}

run().then(() => {
  console.log('done');
}).catch(err => {
  console.log(err);
});
