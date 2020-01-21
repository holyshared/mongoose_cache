const redis = require('redis');

exports.cacheClient = redis.createClient('redis://127.0.0.1:6379');
