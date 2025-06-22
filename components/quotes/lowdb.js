import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { Path } from '#gc';
class DbService {
    constructor() {
        const adapter = new JSONFile(DbService.filepath);
        const defaultData = { quotes: [] };
        this.db = new Low(adapter, defaultData);
    }
    // get Singleton
    static async getInstance() {
        var _a;
        if (!DbService.instance) {
            DbService.instance = new DbService();
            await DbService.instance.db.read();
            (_a = DbService.instance.db).data || (_a.data = { quotes: [] });
            await DbService.instance.db.write();
        }
        return DbService.instance;
    }
    // -- CREATE
    async addQuote(quote) {
        quote.id || (quote.id = Date.now());
        this.db.data.quotes.push(quote);
        await this.db.write();
        return quote;
    }
    // -- READ
    getAllQuotes(group_id) {
        return this.db.data.quotes.filter(quote => quote.groupId === group_id);
    }
    findQuotesByTags(group_id, tags) {
        if (tags.length === 0) {
            return this.getAllQuotes(group_id);
        }
        return this.db.data.quotes.filter(quote => quote.groupId === group_id &&
            tags.every(tag => quote.tags.includes(tag)));
    }
    getQuoteById(id) {
        return this.db.data.quotes.find(quote => quote.id === id);
    }
    // -- UPDATE
    async updateQuoteTags(id, newTags) {
        const quote = this.db.data.quotes.find(q => q.id === id);
        if (quote) {
            quote.tags = newTags;
            await this.db.write();
        }
        return quote;
    }
    // -- REMOVE
    async removeQuote(id) {
        const index = this.db.data.quotes.findIndex(q => q.id === id);
        if (index !== -1) {
            this.db.data.quotes.splice(index, 1);
            await this.db.write();
            return true;
        }
        return false;
    }
}
DbService.filepath = Path.join(Path.Quotes, 'quotes.json');
export default DbService;
