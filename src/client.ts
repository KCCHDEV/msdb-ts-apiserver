import axios from 'axios';
import FormData from 'form-data';

class DatabaseClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  handleError(error: any): void {
    console.error('Error:', error.response?.data?.message || error.message);
  }

  async addItem(database: string, tableName: string, item: any, id: string): Promise<void> {
    try {
      let data = new FormData();
      data.append('db',  JSON.stringify(item));
      data.append('id', id);

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${this.baseUrl}/api/${this.apiKey}/${database}/add/${tableName}`,
        headers: {
          ...data.getHeaders()
        },
        data: data
      };

      const response = await axios.request(config)
      console.log(response.data.message);
    } catch (error) {
      this.handleError(error);
    }
  }


  async getItem(database: string, tableName: string, key: string): Promise<void> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/${this.apiKey}/${database}/get/${tableName}/${key}`);
      console.log(response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllItems(database: string, tableName: string): Promise<void> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/${this.apiKey}/${database}/getall/${tableName}`);
      console.log(response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getRandomItem(database: string, tableName: string): Promise<void> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/${this.apiKey}/${database}/random/${tableName}`);
      console.log(response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getItemsByCondition(database: string, tableName: string, condition: string): Promise<void> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/${this.apiKey}/${database}/getwhere/${tableName}/${condition}`);
      console.log(response.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeItem(database: string, tableName: string, key: string): Promise<void> {
    try {
      const response = await axios.get(`${this.baseUrl}/api/${this.apiKey}/${database}/remove/${tableName}/${key}`);
      console.log(response.data.message);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default DatabaseClient;
