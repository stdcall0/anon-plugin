import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

import { Path } from '#gc';
import { Quote } from '#gc.model';
import { group } from 'node:console';

interface DbSchema {
    quotes: Quote[];
}

export default class DbService {
    private static readonly filepath = Path.join(Path.Quotes, 'quotes.json');
    private static instance: DbService;
    private db: Low<DbSchema>;

    private constructor() {
        const adapter = new JSONFile<DbSchema>(DbService.filepath);
        const defaultData: DbSchema = { quotes: [] };
        this.db = new Low(adapter, defaultData);
    }

    // get Singleton
    public static async getInstance(): Promise<DbService> {
        if (!DbService.instance) {
            DbService.instance = new DbService();
            await DbService.instance.db.read();
            DbService.instance.db.data ||= { quotes: [] };
            await DbService.instance.db.write();
        }
        return DbService.instance;
    }

    // -- CREATE
    public async addQuote(quote: Quote): Promise<Quote> {
        quote.id ||= Date.now();
        this.db.data.quotes.push(quote);
        await this.db.write();
        return quote;
    }

    // -- READ
    public getAllQuotes(group_id: number, ): Quote[] {
        return this.db.data.quotes.filter(quote => quote.groupId === group_id);
    }

    public findQuotesByTags(group_id: number, tags: string[]): Quote[] {
        if (tags.length === 0) {
            return this.getAllQuotes(group_id);
        }
        return this.db.data.quotes.filter(quote =>
            quote.groupId === group_id && 
            tags.every(tag => quote.tags.includes(tag))
        );
    }

    public getQuoteById(id: number): Quote | undefined {
        return this.db.data.quotes.find(quote => quote.id === id);
    }

    // -- UPDATE
    async updateQuoteTags(id: number, newTags: string[]): Promise<Quote | undefined> {
        const quote = this.db.data.quotes.find(q => q.id === id);
        if (quote) {
            quote.tags = newTags;
            await this.db.write();
        }
        return quote;
    }

    // -- REMOVE
    async removeQuote(id: number): Promise<boolean> {
        const index = this.db.data.quotes.findIndex(q => q.id === id);
        if (index !== -1) {
            this.db.data.quotes.splice(index, 1);
            await this.db.write();
            return true;
        }
        return false;
    }
}
