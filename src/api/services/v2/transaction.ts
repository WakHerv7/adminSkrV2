import BaseMethods from "../../baseMethods";
import { transactionUrlsV2 } from "../../urls";


export class TransactionService {
    static manage_user_account_transactions = ({ userId, customerId, label, body, limitDate }: { userId:string, customerId:string, label:string, body:any, limitDate?:string }) => {
        let query_params:any = {};
        if(label) query_params.label =label;
        if(userId) query_params.adminUserId =userId;
        if(customerId) query_params.customerId =customerId;
        if(limitDate) query_params.limitDate =limitDate;
        return BaseMethods.postRequest(transactionUrlsV2.MANAGE_USER_ACCOUNT_TRANSACTIONS, body, true, query_params);
    }
    static get_stats_periodic = ({period, limitDate, separateDecline}: {period?:string, limitDate?:string, separateDecline?:boolean}) => {
        let query_params:any = {};
        if(period) query_params.period =period;
        if(limitDate) query_params.limitDate =limitDate;        
        if(separateDecline) query_params.separateDecline ='true';
        return BaseMethods.getRequest(transactionUrlsV2.STATS_PERIODIC, true, query_params);
    }
    static get_stats_countries = ({limitDate}: {limitDate?:string}) => {
        let query_params:any = {};
        if(limitDate) query_params.limitDate =limitDate;        
        return BaseMethods.getRequest(transactionUrlsV2.STATS_PER_COUNTRY, true, query_params);
    }
        
    static get_stats_category_type = ({limitDate}: {limitDate?:string}) => {
        let query_params:any = {};
        if(limitDate) query_params.limitDate =limitDate;
        return BaseMethods.getRequest(transactionUrlsV2.STATS_PER_CATEGORY_TYPE, true, query_params);
    }
}