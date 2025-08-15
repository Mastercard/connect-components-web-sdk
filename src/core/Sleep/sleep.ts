import { ServiceImports } from "./types";
function sleep_injector($inject: ServiceImports) {
  const { Promise } = $inject;
  /**
   * @param {number} time
   * @returns Promise<void>
   */
  return function sleep(time = 1) {
    return new Promise((resolve: (arg0: null) => void) => {
      setTimeout(() => {
        resolve(null);
      }, time);
    });
  }

}

export { sleep_injector };