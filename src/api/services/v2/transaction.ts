import BaseMethods from "../../baseMethods";
import { transactionUrlsV2 } from "../../urls";


export class TransactionService {
    static manage_user_account_transactions = ({ userId, customerId, label, body }: { userId:string, customerId:string, label:string, body:any }) => {
        let query_params:any = {};
        if(label) query_params.label =label;
        if(userId) query_params.adminUserId =userId;
        if(customerId) query_params.customerId =customerId;
        return BaseMethods.postRequest(transactionUrlsV2.MANAGE_USER_ACCOUNT_TRANSACTIONS, body, true, query_params);
    }
    static get_stats_periodic = ({period, separateDecline}: {period?:string, separateDecline?:boolean}) =>{
        let query_params:any = {};
        if(period) query_params.period =period;
        if(separateDecline) query_params.separateDecline ='true';
        return BaseMethods.getRequest(transactionUrlsV2.STATS_PERIODIC, true, query_params);
    }
    static get_stats_countries = () =>
        BaseMethods.getRequest(transactionUrlsV2.STATS_PER_COUNTRY, true);
    static get_stats_category_type = () =>
        BaseMethods.getRequest(transactionUrlsV2.STATS_PER_CATEGORY_TYPE, true);
}