import * as mysql2 from 'mysql2/promise';
import IModel from './IModel.interface';
import IServiceData from './IServiceData.interface';
import IAdapterOptions from './IAdapterOptions.interface';
import IApplicationResources, { IServices } from './IApplicationResources.interface';



export default abstract class BaseService<ReturnModel extends IModel, AdapterOptions extends IAdapterOptions>{
    private database: mysql2.Connection;
    private serviceInstances: IServices;

    constructor(resources: IApplicationResources) {
        this.database = resources.databaseConnection;
        this.serviceInstances = resources.services;
    }
    protected get services(): IServices {
        return this.serviceInstances;
    }
    protected get db(): mysql2.Connection {
        return this.database;
    }
    abstract tableName(): string;
    protected abstract adaptToModel(data: any, options: AdapterOptions): Promise<ReturnModel>;

    public getAll(options: AdapterOptions): Promise<ReturnModel[]|null> {
        const tableName = this.tableName();
        return new Promise<ReturnModel[]>(
            (resolve, reject) => {
                const sql: string = `SELECT * FROM \`${tableName}\`;`;
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
                       return resolve(items);


                    })
                    .catch(error => {
                        return reject(error);
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
                        return resolve(await this.adaptToModel(row, options));
                    })
                    .catch(error => {
                        return reject(error);
                    });

            }

        );

    }

    protected async baseGetAllFromTableByFieldNameAndValue(tableName: string, fieldName: string, value: any): Promise<ReturnModel[]|null> {
        return new Promise((resolve, reject) => {
                let sql = null;
                if(tableName.includes("administrator")){
                    sql =  `SELECT * FROM \`${ tableName }\` WHERE \`${ fieldName }\` = ? AND is_active = 1;`;
                }else{
                    sql =  `SELECT * FROM \`${ tableName }\` WHERE \`${ fieldName }\` = ? AND (is_deleted IS NULL OR is_deleted = 0);`;
                }
                
                this.db.execute(sql, [ value ])
                .then( async ( [ rows ] ) => {
                    if (rows === undefined) {
                        return resolve([]);
                    }
                    const items: ReturnModel[] = [];

                    for (const row of rows as mysql2.RowDataPacket[]) {
                        items.push(row as ReturnModel);
                    }

                    return resolve(items);
                })
                .catch(error => {
                    return reject(error);
                });
            }
        );
    }
    
    
    protected async baseGetAllByFieldNameAndValue(fieldName: string, value: any, options: AdapterOptions): Promise<ReturnModel[]|null> {
        const tableName = this.tableName();
        let sql = null;
        if(tableName.includes("administrator")){
            sql =  `SELECT * FROM \`${ tableName }\` WHERE \`${ fieldName }\` = ? AND is_active = 1;`;
        }else{
            sql =  `SELECT * FROM \`${ tableName }\` WHERE \`${ fieldName }\` = ? AND (is_deleted IS NULL OR is_deleted = 0);`;
        }
        try {
            const [rows]: any = await this.db.execute(sql, [value]);
            const items: ReturnModel[] = [];

            if (Array.isArray(rows)) {
                for (const row of rows as mysql2.RowDataPacket[]) {
                    items.push(await this.adaptToModel(row, options));
                }
            }

            return items;
        } catch (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }
    }

    protected async baseGetRelated(id: number, fieldName: string, options: AdapterOptions): Promise<ReturnModel[]> {
        if(id === undefined){
            return [];
        }
        const tableName = this.tableName();
        const sql = `SELECT * FROM \`${tableName}\` WHERE \`${fieldName}\` = ? AND (is_deleted IS NULL OR is_deleted = 0) LIMIT 5;`;
        const [rows]: any = await this.db.execute(sql, [id]);
        if (rows === undefined) {
          return [];
      } 
        const items: ReturnModel[] = [];
          for (const row of rows as mysql2.RowDataPacket[]) {
          items.push(await this.adaptToModel(row, options));
                      }
        return items;
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
                    return resolve(newItem);
                })
                .catch(error => {
                    return reject(error);
                });


        });
    }

    protected async baseEditById(id: number, data: IServiceData, options: AdapterOptions): Promise<ReturnModel> {
        const tableName = this.tableName();
        return new Promise((resolve, reject) => {
            const properties = Object.getOwnPropertyNames(data);
            if (properties.length === 0) {
                return reject({ message: 'There is nothing to edit!' })
            }
            const sqlPairs = properties.map(property => "`" + property + "` = ?").join(", ");
            const values = properties.map(property => data[property]);
            values.push(id);
            const sql: string = `UPDATE \`${tableName}\` SET ${sqlPairs} WHERE \`${tableName}_id\` = ?;`

            this.db.execute(sql, values)
                .then(async result => {
                    const info: any = result;
                    if (info[0]?.affectedRows === 0) {
                        return reject({ message: 'Could not edit any items in the ' + tableName + ' table!', })
                    }
                    const item: ReturnModel | null = await this.getById(id, options);
                    if (item === null) {
                        return reject({ message: 'Could not find this item in the ' + tableName + ' table!', });
                    }
                    return resolve(item);
                })
                .catch(error => {
                    return reject(error);
                });

        });

    }
    protected async baseDeleteById(id: number): Promise<boolean> {
        const tableName = this.tableName();
        return new Promise<boolean>((resolve, reject) => {
            if(!tableName.includes("administrator")){
                this.db.execute(`DESCRIBE ${tableName} is_deleted`)
                .then(([rows]: any) => {
                        if (rows.length) {
                            return this.db.execute(`UPDATE ${tableName} SET is_deleted = 1 WHERE ${tableName}_id = ?`, [id]);
                        } else {
    
                            return this.db.execute(`DELETE FROM ${tableName} WHERE ${tableName}_id = ?`, [id]);
                        }
                })
                .then(([result]: any) => {
                    return resolve(result.affectedRows === 1);
                })
                .catch(error => {
                    return reject(error);
                });

            }else{
                      this.db.execute(`UPDATE ${tableName} SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END WHERE ${tableName}_id = ?`, [id])
                .then(() => {
                    return this.db.execute(`SELECT is_active FROM ${tableName} WHERE ${tableName}_id = ?`, [id]);
                })
                .then(([selectResult]: any) => {
                    const newIsActiveStatus = selectResult[0].is_active;
                    return resolve(newIsActiveStatus === 1);
                })
                .catch(error => {
                    console.error("Database Error: ", error.message);
                    return reject(error);
                });
            }            
            
            
        });

    }

   
}


