const Redis = require('ioredis');

exports.cacheClient = new Redis('redis://127.0.0.1:6379');
