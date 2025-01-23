import BaseMethods from "../../baseMethods";
import { nairapaymentUrlsV2 } from "../../urls";


export class NairapayService {
    static get_all_trxs = ({status, searchTerm}: {status?:string, searchTerm?:string}) =>{
        let query_params:any = {};        
        if(status) query_params.status =status;
        if(searchTerm) query_params.searchTerm =searchTerm;
        return BaseMethods.getRequest(nairapaymentUrlsV2.GET_ALL_NAIRAPAYMENTS, true, query_params);
    }
    static get_one_trx = (id:string) =>{
        return BaseMethods.getRequest(nairapaymentUrlsV2.GET_ONE_NAIRAPAYMENT(id), true);
    }    
    static update_nairapayment = ({ userId, transactionId, body }: { userId:string, transactionId:string, body:any }) => {
        let query_params:any = {};
        if(userId) query_params.adminUserId =userId;
        return BaseMethods.putRequest(nairapaymentUrlsV2.UPDATE_NAIRAPAYMENT(transactionId), body, true, query_params);
    }    
}