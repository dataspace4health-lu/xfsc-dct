import * as redisStore from 'cache-manager-redis-store';

export default {
  create: (args) => {
    try {
      return redisStore.create(args);
    } catch (error) {
      console.error(error);
    }
  },
};
