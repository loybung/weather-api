import * as DEFAULT from "@/constants";
import axios, { AxiosInstance } from "axios";
import axiosRetry from "axios-retry";
import { LRUCache } from "lru-cache";
import { WeatherOptions, Current } from "@/types";

export class Weather {
	private apiKey: string;
	private instance: AxiosInstance;
	private cacheCurrent: LRUCache<string, Current>;

	constructor(options: WeatherOptions) {
		this.apiKey = options.apiKey;

		this.instance = axios.create({
			baseURL: DEFAULT.BASE_URL,
			timeout: DEFAULT.TIMEOUT,
		});

		axiosRetry(this.instance, {
			retries: DEFAULT.RETRY_COUNT,
			retryDelay: axiosRetry.exponentialDelay,
			retryCondition: (error) =>
				axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error),
		});

		this.cacheCurrent = new LRUCache<string, Current>({
			max: options.cacheSize ?? DEFAULT.CACHE_MAX,
			ttl: options.cacheTTL ?? DEFAULT.CACHE_TTL,
		});
	}

	async current(location: string): Promise<Current> {
		const key = location.toLowerCase();

		const cached = this.cacheCurrent.get(key);
		if (cached) return cached;

		const response = await this.instance.get<Current>("current.json", {
			params: {
				key: this.apiKey,
				q: location,
				aqi: "yes",
			},
		});

		this.cacheCurrent.set(key, response.data);
		return response.data;
	}
}
