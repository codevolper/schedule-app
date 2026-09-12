export interface ApiClient {
  get<TResponse>(path: string): Promise<TResponse>
  post<TRequest, TResponse>(path: string, body: TRequest): Promise<TResponse>
}

export interface ApiClientOptions {
  baseUrl: string
  fetchImplementation?: typeof fetch
}

export class FetchApiClient implements ApiClient {
  private readonly baseUrl: string
  private readonly fetchImplementation: typeof fetch

  constructor(options: ApiClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '')
    this.fetchImplementation = options.fetchImplementation ?? fetch
  }

  async get<TResponse>(path: string): Promise<TResponse> {
    return this.request<TResponse>(path, { method: 'GET' })
  }

  async post<TRequest, TResponse>(
    path: string,
    body: TRequest,
  ): Promise<TResponse> {
    return this.request<TResponse>(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  private async request<TResponse>(
    path: string,
    options: RequestInit,
  ): Promise<TResponse> {
    const response = await this.fetchImplementation(`${this.baseUrl}${path}`, options)

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return response.json() as Promise<TResponse>
  }
}