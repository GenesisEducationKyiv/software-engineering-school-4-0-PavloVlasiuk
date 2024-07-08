import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
  stages: [
    { duration: '5s', target: 15 },
    { duration: '20s', target: 40 },
    { duration: '10s', target: 20 },
  ],
};

const url = 'http://localhost:3000/api/rate';

export default () => {
  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1);
};
