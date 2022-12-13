import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 3,
    duration: '60s',
  };

export default function () {
  let res = null;
  res = http.get('http://localhost:3000/fast?tenant=eins');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
  res = http.get('http://localhost:3000/slow?tenant=eins');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
  res = http.get('http://localhost:3000/fast?tenant=eins');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
  res = http.get('http://localhost:3000/slow?tenant=eins');
  check(res, { 'status was 200': (r) => r.status == 200 });
  sleep(1);
}
