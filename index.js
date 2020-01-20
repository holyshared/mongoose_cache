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

console.log('User1');

mongoose.connect('mongodb://example:example@localhost:27017/example', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

console.log('User2');

async function run() {
  console.log('User3');
  const createdUser = await User.create({
    name: 'name',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  });
  console.log('User4');
  console.log(createdUser);
}

run().then(() => {
  console.log('done');
}).catch(err => {
  console.log(err);
});
