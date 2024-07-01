/* eslint-disable import/no-unresolved */
import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500'],
  },
  stages: [
    { duration: '5s', target: 5 },
    { duration: '20s', target: 20 },
    { duration: '10s', target: 10 },
  ],
};

const url = 'http://localhost:3000/api/email/subscribe';

const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

export default () => {
  const email = `invalid.email${getRandomNumber(1, 10000)}@mail`;

  const res = http.post(url, { email });

  check(res, {
    'status is 400': (r) => r.status === 400,
  });

  sleep(1);
};
