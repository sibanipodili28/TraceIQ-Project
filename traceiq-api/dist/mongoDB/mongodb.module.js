"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBModule = void 0;
const common_1 = require("@nestjs/common");
const mongodb_1 = require("mongodb");
const mongoClientProvider = {
    provide: 'MONGO_CLIENT',
    useFactory: async () => {
        try {
            const mongoUri = process.env.MONGODB_CONNECTION_STRING;
            if (!mongoUri) {
                throw new Error("MONGODB_CONNECTION_STRING is not defined");
            }
            const client = await mongodb_1.MongoClient.connect(mongoUri);
            return client;
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    },
};
const databaseProvider = {
    provide: 'DATABASE_CONNECTION',
    useFactory: (client) => {
        return client.db(process.env.MONGO_DB_DATABASE_NAME);
    },
    inject: ['MONGO_CLIENT'],
};
let MongoDBModule = class MongoDBModule {
};
exports.MongoDBModule = MongoDBModule;
exports.MongoDBModule = MongoDBModule = __decorate([
    (0, common_1.Module)({
        providers: [databaseProvider, mongoClientProvider],
        exports: ['DATABASE_CONNECTION', 'MONGO_CLIENT'],
    })
], MongoDBModule);
//# sourceMappingURL=mongodb.module.js.map