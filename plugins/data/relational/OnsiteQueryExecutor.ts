import {IRelationalDatabase, IRetrievalPlan, IDataSet} from "./IRelationalDatabase"
import {RestRequestor} from "../../../helpers/RestRequestor"
import {Steroid} from "../../../Steroids"

interface QueryRequest{
    Query:string,
    Authentication:string
}

interface QueryResponse{
    isSuccess:boolean,
    result:any[],
    Exception: any
}

export class OnsiteQueryExecutor implements IRelationalDatabase {
    
    private _steroid:Steroid;
    private _config:any;

    executeQuery<T>(type: {new(): T;}, query: string): Promise<T[]> {       
        
        return new Promise<T[]>((resolve,reject)=>{
            let requestor = new RestRequestor(this._steroid);
            let request:QueryRequest ={
                Query:query,
                Authentication:""
            };

            var headers = {
                "Authorization" : this._config.database.settings.authToken,
                "Content-type" : "application/json"
            }
            
            requestor.post<QueryResponse>(this._config.database.settings.url ,JSON.stringify(request),headers)
            .then(function(result){
                if (result.isSuccess)
                    resolve(result.result);
                else
                    reject(result.Exception);
            })
            .catch(function(result){
                reject(result);
            });
        });

    }

    getDataSet(retrievalPlan:IRetrievalPlan[], inputSet?: Object):Promise<any> {
        return new Promise<any>((resolve,reject)=>{
            resolve({});
        });
    }

    getMultipleResultSets(query:string, ...dataSetNames:IDataSet[]):Promise<any>{
        return new Promise<any>((resolve,reject)=>{
            resolve({});
        });
    }

    constructor(steroid: Steroid){
        this._steroid = steroid;
        this._config = steroid.config;
    }


}