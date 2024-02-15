import axios, { AxiosInstance } from 'axios';
import {
  CheckoutPageResponse,
  Event,
  UserProductAccessStatusResponse
} from './types'

export class Subgram {
  private BASE_URL: string = "https://api.subgram.io";
  private apiToken: string;

  constructor(token: string) {
    this.apiToken = token;
  }

  private get client(): AxiosInstance {
    return axios.create({
      baseURL: this.BASE_URL,
      timeout: 10000,
    });
  }

  public async hasAccess(userId: number, productId: number): Promise<boolean> {
    try {
      const response = await this.client.get(`/api/v1/${this.apiToken}/products/${productId}/${userId}`);
      if (response.status !== 200) return false;

      const subscriptionStatus = response.data as UserProductAccessStatusResponse;
      return subscriptionStatus.has_access ?? false;
    } catch (error) {
      console.error(`Error in hasAccess: ${error}`);
      return false;
    }
  }

  public async createCheckoutPage(productId: number, userId: number, name: string, languageCode?: string): Promise<CheckoutPageResponse> {
    const response = await this.client.post(`/api/v1/${this.apiToken}/products/${productId}`, {
      user_id: userId,
      name: name,
      language_code: languageCode,
    });
    return response.data as CheckoutPageResponse;
  }

  public async *listenToEvents(timeout: number = 2): AsyncGenerator<Event, void, undefined> {
    let eventId = 0;
    while (true) {
      try {
        const response = await this.client.get(`/api/v1/${this.apiToken}/events`, { params: { event_id: eventId } });
        const pollingResponse = response.data;

        for (const event_data of pollingResponse.result ?? []) {
          const event = event_data as Event;
          eventId = event.event_id;
          yield event;
        }
      } catch (error) {
        console.error(`Subgram API is not available, reason: ${error}`);
        await new Promise(resolve => setTimeout(resolve, timeout * 10000));
        continue;
      }

      await new Promise(resolve => setTimeout(resolve, timeout * 1000));
    }
  }
}