import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';

class DatabaseClient {
  private api: AxiosInstance;

  constructor(apiKey: string, baseUrl: string) {
    this.api = axios.create({
      baseURL: baseUrl,
      headers: {
        'x-api-key': apiKey
      }
    });
  }

  async addItem(database: string, table: string, data: any, id?: string) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (id) formData.append('id', id);
    return this.api.post(`/${database}/${table}/add`, formData, {
      headers: { ...formData.getHeaders() }
    });
  }

  async getItem(database: string, table: string, id: string) {
    return this.api.get(`/${database}/${table}/find/${id}`);
  }

  async getAllItems(database: string, table: string, orderBy: 'asc' | 'desc' = 'asc') {
    return this.api.get(`/${database}/${table}/all`, { params: { orderBy } });
  }

  async getRandomItem(database: string, table: string) {
    return this.api.get(`/${database}/${table}/random`);
  }

  async getWhere(database: string, table: string, condition: Record<string, any>) {
    return this.api.post(`/${database}/${table}/where`, condition);
  }

  async removeItem(database: string, table: string, id: string) {
    return this.api.delete(`/${database}/${table}/${id}`);
  }
}

export default DatabaseClient;
