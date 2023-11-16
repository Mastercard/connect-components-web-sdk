/**
 * @param {import('./types').ServiceImports} $inject 
 * @returns {import('./types').ServiceExports}
 */
function sleep_injector($inject) {
  const { Promise } = $inject;
  /**
   * @param {number} time
   * @returns Promise<void>
   */
  return function sleep(time = 1) {
    return new Promise((/** @type {(arg0: null) => void} */ resolve) => {
      setTimeout(() => {
        resolve(null);
      }, time);
    });
  }

}

export default sleep_injector;