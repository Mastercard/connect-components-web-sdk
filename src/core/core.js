/**
 * This file provides a sort of framework for our project
 */

function core_injector() {
  const service = {
    sleep,
  };


  return service;

  function sleep(time = 1) {
    return new window.Promise(resolve => {
      setTimeout(() => {
        resolve(null);
      }, time);
    });
  }
}

module.exports = core_injector;
