import type { PrismaClient } from "@workspaces/db/src/generated/prisma/client";
import type { Product } from "@workspaces/db/src/generated/prisma/client";
import type { Cache } from "../../../cache/cache"

export class Repository {
    private readonly client: PrismaClient;
    private readonly cache: Cache;

    constructor(prisma: PrismaClient, cache: Cache) {
        this.client = prisma;
        this.cache = cache;

    }


    public async createProduct(name: string, price: number): Promise<void> {
        const result = await this.client.product.create({
            data: {
                name: name,
                price: price
            }
        });

    }

    public async getDbProduct(productId: string): Promise<Product | null> {
        const product = await this.client.product.findFirst({
            where: {
                id: productId
            }
        })

        return product;


    }


    public async getCacheProduct(productId: string): Promise<{
        price: number;
        ttl: number;
    } | undefined> {
        const isCached = await this.cache.cache.get(productId);


        if (isCached) {
            return isCached;
        }

        this.getDbProduct(productId);
    }


    public async updateProduct(productId: string, price: number): Promise<void> {
        await this.client.product.update({
            where: {
                id: productId
            },
            data: {
                price
            }
        })

        const currentTime = new Date();


        this.cache.cacheItem(productId, price, currentTime.getTime());
    }


    public async deleteCache(productId: string) {
        this.cache.removeCache(productId);
    }

    public async deleteProduct(productId: string): Promise<void> {
        await this.client.product.delete({
            where: { id: productId }
        })

        if (!this.getCacheProduct(productId)) {
            return;
        }

        this.deleteCache(productId);


    }



}