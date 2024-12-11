import axios, { AxiosInstance } from 'axios';

class DatabaseClient {
  private api: AxiosInstance;

  constructor(apiKey: string, baseUrl: string) {
    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
  }

  async addItem(database: string, table: string, data: any, id?: string) {
    try {
      const response = await this.api.post(`/${database}/${table}/add`, { data, id });
      return response.data;
    } catch (error) {
      console.error('Add item error:', error);
      throw error;
    }
  }

  async getItem(database: string, table: string, id: string) {
    const response = await this.api.get(`/${database}/${table}/find/${id}`);
    return response.data;
  }

  async getAllItems(database: string, table: string, orderBy: 'asc' | 'desc' = 'asc') {
    const response = await this.api.get(`/${database}/${table}/all`, { params: { orderBy } });
    return response.data;
  }

  async getRandomItem(database: string, table: string) {
    const response = await this.api.get(`/${database}/${table}/random`);
    return response.data;
  }

  async getWhere(database: string, table: string, condition: Record<string, any>) {
    const response = await this.api.post(`/${database}/${table}/where`, condition);
    return response.data;
  }

  async removeItem(database: string, table: string, id: string) {
    // Send empty object as body to satisfy Fastify's JSON requirement
    const response = await this.api.delete(`/${database}/${table}/${id}`, { data: {} });
    return response.data;
  }
}

export default DatabaseClient;