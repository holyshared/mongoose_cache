const models = require('./models');
const cacheClient = require('./redis').cacheClient;

const User = models.User;

const redisCache = {
  users: {
    set: (id, payload) => {
      cacheClient.set(id.toString(), JSON.stringify(payload.data), 'EX', payload.cacheSeconds);
    },
    get: async (id) => {
      return new Promise((resolve, reject) => {
        cacheClient.get(id.toString(), (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(JSON.parse(data));
        });
      });
    }
  }
};


const cacheResolve = (cacheStorage, options) => {
  const { cacheKey, resolve, serialize, deserialize, cacheSeconds } = options;

  const fetchAndCache = async (id) => {
    const data = await resolve(id);
    cacheStorage.set(cacheKey(id), {
      data: serialize(data),
      cacheSeconds
    });
    return data;
  };

  return async (id) => {
    const cache = await cacheStorage.get(cacheKey(id));

    if (!cache) {
      console.log('retribute from database');
      return fetchAndCache(id);
    }
    console.log('retribute from cache');

    return deserialize(cache);
  };
}




exports.retributeUser = cacheResolve(
  redisCache.users,
  {
    cacheKey: (user) => `web-user-${user._id}`,
    resolve: async (id) => User.findById(id),
    serialize: (user) => user.toJSON(),
    deserialize: (user) => {
      const { id: _id } = user;
      return User.hydrate({ ...user, _id });
    },
    cacheSeconds: 60
  }
);
