/* Import reflect metadata to enable it */
import "reflect-metadata";
import {Connection, createConnection} from "typeorm";

let currentConnection: Connection = null;
export function getCurrentConnection(){
    if(!currentConnection){
        throw Error('Not connected. Must init Connector first');
    }
    return currentConnection;
}

export class Connector{
    private connection: Connection;
    private _rootConnection: Connection;

    async connect(host: string, port: number, user: string, pass: string, db: string){
        await this.createTableIfNotExists('postgres', host, port, user, pass, db);
        await this.connectDatabase(host, port, user, pass, db);
        currentConnection = this.connection;
        return this;
    }

    private async createTableIfNotExists(rootDatabase: string, host: string, port: number, user: string, pass: string, db: string) {
        this._rootConnection = await createConnection({
            name: '_rootConnection',
            type: "postgres",
            host: host,
            port: port,
            username: user,
            password: pass,
            database: rootDatabase,
        });

        try {
            await this._rootConnection.query(`CREATE DATABASE ${db}`);
        } catch (queryFailedError) {
            if (queryFailedError.message.indexOf(`"${db}" already exists`) < 0) {
                throw queryFailedError;
            }
        }
    }

    private async connectDatabase(host: string, port: number, user: string, pass: string, db: string) {
        this.connection = await createConnection({
            type: "postgres",
            host: host,
            port: port,
            username: user,
            password: pass,
            database: db,
            entities: [
                __dirname + "/../model/*.ts"
            ],
            synchronize: true,
            logging: false
        });
    }
}