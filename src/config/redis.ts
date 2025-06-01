import Redis from 'ioredis';

const redis = new Redis({
  host: '127.0.0.1', // hoặc tên host Redis nếu dùng Docker
  port: 6379,        // cổng mặc định Redis
  // password: 'your_password', // nếu Redis có bảo mật
});

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

export default redis;
