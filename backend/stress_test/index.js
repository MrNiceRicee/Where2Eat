import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 100 }, // below normal load
    { duration: '10s', target: 100 },
    { duration: '5s', target: 200 }, // normal load
    { duration: '10s', target: 200 },
    { duration: '5s', target: 300 }, // around the breaking point
    { duration: '10s', target: 300 },
    { duration: '5s', target: 400 }, // beyond the breaking point
    { duration: '10s', target: 400 },
    { duration: '5s', target: 0 }, // scale down. Recovery stage.
  ],
  thresholds: {
    http_req_duration: ['p(95)<1500'], // 95% of requests must complete below 1.5s
  },
};

export default function () {
  const res = http.get('http://localhost:8000/api/visits/search/?user_id=1&restaurant_id=S-oLPRdhlyL5HAknBKTUcQ&time=monthly');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'less than 1500ms': (r) => r.timings.duration < 1500,
    'less than 1000ms': (r) => r.timings.duration < 1000,
    'less than 500ms': (r) => r.timings.duration < 500,
    'less than 200ms': (r) => r.timings.duration < 200,
    'less than 100ms': (r) => r.timings.duration < 20,
  });
}