export class FetchWrap {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  async get(endPoint) {
    const response = await fetch(this.baseURL + endPoint);
    if (!response.ok) {
      // 4xx or 5xx error
      throw new Error(`API - ${response.status} ${response.statusText}`);
    }
    return await response.json();
  }
  put(endPoint, body) {
    return this.#send("put", endPoint, body);
  }
  post(endPoint, body) {
    return this.#send("post", endPoint, body);
  }
  delete(endPoint, body) {
    return this.#send("delete", endPoint, body);
  }
  #send(method, endPoint, body) {
    return fetch(this.baseURL + endPoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    }).then(response => response.json());
  }
}