import { sleep_injector } from './sleep';
const $inject = {
  Promise
};
export const sleep = sleep_injector($inject);
export default sleep;