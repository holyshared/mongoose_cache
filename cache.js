const models = require('./models');

const User = models.User;

const memoryCache = {
  users: new Map()
};


const cacheResolve = (cacheStorage, options) => {
  const { resolve, serialize, deserialize, cacheSeconds } = options;

  const fetchAndCache = async (id) => {
    const data = await resolve(id);
    cacheStorage.set(id, {
      data: serialize(data),
      expireAt: (new Date().getTime() + (cacheSeconds * 10000))
    });
    return data;
  };

  return async (id) => {
    const cache = cacheStorage.get(id);
  
    if (!cache) {
      return fetchAndCache(id);
    }
  
    if (cache.expireAt < new Date().getTime()) {
      return fetchAndCache(id);
    }
  
    return deserialize(cache.data);
  };
}




exports.retributeUser = cacheResolve(
  memoryCache.users,
  {
    resolve: async (id) => User.findById(id),
    serialize: (user) => user.toJSON(),
    deserialize: (user) => User.hydrate(user),
    cacheSeconds: 60
  }
);
