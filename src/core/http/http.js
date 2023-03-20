function http_injector($inject) {
  const { appConfig, fetch } = $inject;

  const service = {
    get,
    post,
  };

  return service;

  /**
   * @access private
   * @returns {Promise<any>}
   */
  async function post(endpoint) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    const url = `${appConfig.sdkBase}${endpoint}`;

    const config = {
      method: 'POST',
      headers
    };
    const data = await fetch(url, config);
    return await data.json();
  }

  /**
   * @access private
   * @returns {Promise<any>}
   */
  async function get(endpoint) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    const url = `${appConfig.sdkBase}${endpoint}`;

    const config = {
      method: 'GET',
      headers
    };
    const data = await fetch(url, config);
    return await data.json();
  }
}

export default http_injector;