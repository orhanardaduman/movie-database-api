import { Injectable } from '@nestjs/common';

/**
 * Service for making external HTTP requests
 */
@Injectable()
export class ExternalRequest {
  /**
   * Makes a GET request to an external API endpoint
   * @param url - Base URL of the API endpoint
   * @param params - Query parameters to append to the URL
   * @param options - Additional fetch options like headers
   * @returns Promise resolving to the parsed response data
   * @throws Error if the request fails
   */
  async get<T>(url: string, params?: string, options?: object): Promise<T> {
    try {
      const response = await fetch(`${url}?${params}`, options);
      const data = await response.json();
      const results = data.results ? (data.results as T) : (data as T);

      return results;
    } catch (error) {
      throw new Error(
        `Failed to fetch data from external source with url: ${url}, params: ${params} and options: ${options}. Error: ${error}`,
      );
    }
  }
}
