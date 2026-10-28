export class Cache {
    public cache: Map<string, { price: number, ttl: number }>;

    constructor() {
        this.cache = new Map();
    }

    public cacheItem(productId: string, price: number, ttl: number) {
        this.cache.set(productId, { price: price, ttl: ttl + 15 * 60 * 1000 });
        return true;
    }

    public removeCache(productId: string) {
        return this.cache.delete(productId);
    }

}