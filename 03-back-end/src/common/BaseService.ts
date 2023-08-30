import * as mysql2 from 'mysql2/promise';
import IModel from './IModel.interface';
import IServiceData from './IServiceData.interface';
import IAdapterOptions from '../../dist/common/IAdapterOptions.interface';

export default abstract class BaseService<ReturnModel extends IModel, AdapterOptions extends IAdapterOptions>{
    private database: mysql2.Connection;
    constructor(databaseConnection: mysql2.Connection) {
        this.database = databaseConnection;
    }


    protected get db(): mysql2.Connection {
        return this.database;
    }
    abstract tableName(): string;
    protected abstract adaptToModel(data: any, options: AdapterOptions): Promise<ReturnModel>;

    public getAll(options: AdapterOptions): Promise<ReturnModel[]> {
        const tableName = this.tableName();
        return new Promise<ReturnModel[]>(
            (resolve, reject) => {
                const sql: string = `SELECT * FROM \`${tableName}\`;`;
                console.log(sql);
                this.db.execute(sql)
                    .then(async ([rows]) => {
                        if (rows === undefined) {
                            return resolve([]);
                        }

                        const items: ReturnModel[] = [];

                        for (const row of rows as mysql2.RowDataPacket[]) {

                            if (!('is_deleted' in row) || !row.is_deleted) {
                                items.push(await this.adaptToModel(row, options));
                            }
                        }
                        resolve(items);


                    })
                    .catch(error => {
                        reject(error);
                    });

            }

        );




    }
    public getById(id: number, options: AdapterOptions): Promise<ReturnModel | null> {
        const tableName = this.tableName();
        return new Promise<ReturnModel>(
            (resolve, reject) => {
                const sql: string = `SELECT * FROM \`${tableName}\` WHERE ${tableName}_id = ?;`;
                this.db.execute(sql, [id])
                    .then(async ([rows]) => {
                        if (!Array.isArray(rows) || rows.length === 0) {
                            return resolve(null);
                        }
                        const row = rows[0] as mysql2.RowDataPacket;

                        if ('is_deleted' in row) {
                            if (1 === +row.is_deleted) {
                                return resolve(null);
                            }
                        }

                        resolve(await this.adaptToModel(row, options));
                    })
                    .catch(error => {
                        reject(error);
                    });

            }

        );

    }


    protected async getAllByFieldNameAndValue(fieldName: string, value: any, options: AdapterOptions): Promise<ReturnModel[] | null> {
        const tableName = this.tableName();
        return new Promise<ReturnModel[]>(
            (resolve, reject) => {
                const sql: string = `SELECT * FROM \`${tableName}\` WHERE ${fieldName}\ = ?;`;
                this.db.execute(sql, [value])
                    .then(async ([rows]) => {
                        if (!Array.isArray(rows) || rows.length === 0) {
                            return resolve([]);
                        }
                        const items: ReturnModel[] = [];

                        for (const row of rows as mysql2.RowDataPacket[]) {

                            if (!('is_deleted' in row) || !row.is_deleted) {
                                items.push(await this.adaptToModel(row, options));
                            }

                        }
                        resolve(items);
                    })
                    .catch(error => {
                        reject(error);
                    });

            }


        );

    }

    protected async baseAdd(data: IServiceData, options: AdapterOptions): Promise<ReturnModel> {
        const tableName = this.tableName();

        return new Promise((resolve, reject) => {
            const properties = Object.getOwnPropertyNames(data);
            if (properties.length === 0) {
                return reject({ message: 'There is nothing to add!' })
            }
            const sqlPairs = properties.map(property => "`" + property + "` = ?").join(", ");
            const values = properties.map(property => data[property]);
            const sql: string = "INSERT `" + tableName + "` SET " + sqlPairs + ";";
            this.db.execute(sql, values)
                .then(async result => {
                    const info: any = result;
                    const newItemId = +(info[0]?.insertId);
                    const newItem: ReturnModel | null = await this.getById(newItemId, options);
                    if (newItem === null) {
                        return reject({ message: 'Could not add a new item into the ' + tableName + 'table!', });
                    }
                    resolve(newItem);
                })
                .catch(error => {
                    reject(error);
                });

        });
    }

    protected async baseEditById(id: number, data: IServiceData, options: AdapterOptions): Promise<ReturnModel> {
        const tableName = this.tableName();
        return new Promise((resolve, reject) => {
            const properties = Object.getOwnPropertyNames(data);
            if (properties.length === 0) {
                return reject({ message: 'There is nothing to change!' })
            }
            const sqlPairs = properties.map(property => "`" + property + "` = ?").join(", ");
            const values = properties.map(property => data[property]);
            values.push(id);
            const sql: string = `UPDATE \`${tableName}\` SET ${sqlPairs} WHERE \`${tableName}_id\` = ?;`

            this.db.execute(sql, values)
                .then(async result => {
                    const info: any = result;
                    if (info[0]?.affectedRows === 0) {
                        return reject({ message: 'Could not change any items in the ' + tableName + 'table!', })
                    }
                    const item: ReturnModel | null = await this.getById(id, options);
                    if (item === null) {
                        return reject({ message: 'Could not find this item in the ' + tableName + 'table!', });
                    }
                    resolve(item);
                })
                .catch(error => {
                    reject(error);
                });

        });

    }
    protected async baseDeleteById(id: number): Promise<boolean> {
        const tableName = this.tableName();

        return new Promise<boolean>((resolve, reject) => {

            this.db.execute(`DESCRIBE ${tableName} is_deleted`)
                .then(([rows]: any) => {

                    if (rows.length) {
                        return this.db.execute(`UPDATE ${tableName} SET is_deleted = 1 WHERE ${tableName}_id = ?`, [id]);
                    } else {

                        return this.db.execute(`DELETE FROM ${tableName} WHERE ${tableName}_id = ?`, [id]);
                    }
                })
                .then(([result]: any) => {
                    if (result.affectedRows === 1) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}
