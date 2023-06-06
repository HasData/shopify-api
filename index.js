const { SHOPIFY_COLLECTIONS_API, SHOPIFY_PRODUCTS_API } = require('./consts');
const { doRequest } = require('./utils/http');

class ShopifyAPI {
  /**
    *
    * @param {apiKey} apiKey - Scrape-It.Cloud API Key
    * @throws {Error}
    *
    */
  constructor(apiKey = null) {
    if (!apiKey) {
      throw new Error('API Key is not provided');
    }

    this.apiKey = apiKey;
  }

  handleErrors(result, statusCode) {
    if (result.status === 'error' && result.message) {
      throw new Error(result.message)
    }

    if (statusCode === 403) {
      throw new Error('You don\'t have enough API credits to perform this request');
    }

    if (statusCode === 401) {
      throw new Error('Invalid API Key');
    }

    if (statusCode === 429) {
      throw new Error('You reached concurrency limit');
    }

    if (result.errors && result.errors.length) {
      const error = new Error(`Validation error`)
      error.validationErrors = result.errors

      throw error
    }

    if (!result.requestMetadata) {
      throw new Error('Invalid response');
    }

    if (result.requestMetadata.status === 'error') {
      throw new Error('Invalid response');
    }
  }

  /**
    *
    * @param {params} params - Scrape-It.Cloud Shopify API Params
    * @throws {Error}
    * @returns {object} Scrape-It.Cloud Shopify API Response
    *
    */
  async collections(params) {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(value => searchParams.append(key, value.toString()))
      } else if (typeof value === 'object') {
        Object.keys(value).forEach(objKey => {
          searchParams.append(`${key}[${objKey}]`, value[objKey])
        })
      } else {
        searchParams.append(key, value.toString())
      }
    });

    const { responseBody, statusCode } = await doRequest(
      `${SHOPIFY_COLLECTIONS_API}?${searchParams.toString()}`,
      {
        'x-api-key': this.apiKey,
      },
      {
        ...params,
        source: 'nodejs_sdk'
      }
    );

    let result = {};

    try {
      result = JSON.parse(responseBody);
    } catch (e) {
      result = responseBody;
    }

    this.handleErrors(result, statusCode)

    if (result.requestMetadata.status === 'ok') {
      return result;
    }

    return result;
  }

  /**
    *
    * @param {params} params - Scrape-It.Cloud Shopify API Params
    * @throws {Error}
    * @returns {object} Scrape-It.Cloud Shopify API Response
    *
    */
  async products(params) {
    const searchParams = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(value => searchParams.append(key, value.toString()))
      } else if (typeof value === 'object') {
        Object.keys(value).forEach(objKey => {
          searchParams.append(`${key}[${objKey}]`, value[objKey])
        })
      } else {
        searchParams.append(key, value.toString())
      }
    });

    const { responseBody, statusCode } = await doRequest(
      `${SHOPIFY_PRODUCTS_API}?${searchParams.toString()}`,
      {
        'x-api-key': this.apiKey,
      },
      {
        ...params,
        source: 'nodejs_sdk'
      }
    );

    let result = {};

    try {
      result = JSON.parse(responseBody);
    } catch (e) {
      result = responseBody;
    }

    this.handleErrors(result, statusCode)

    if (result.requestMetadata.status === 'ok') {
      return result;
    }

    return result;
  }
}

module.exports = ShopifyAPI;
