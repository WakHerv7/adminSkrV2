import BaseMethods from "../../baseMethods";
import { customerUrlsV2 } from "../../urls";


export class CustomerService {
    static get_all_customers = ({label, searchTerm}: {label?:string, searchTerm?:string}) =>{
        let query_params:any = {};
        if(label) query_params.label =label;
        if(searchTerm) query_params.searchTerm =searchTerm;
        return BaseMethods.getRequest(customerUrlsV2.GET_CUSTOMERS, true, query_params);
    }
    static get_kyc_customers = ({kyc_result, kyc_status, searchTerm}: {kyc_result?:string, kyc_status?:string, searchTerm?:string}) =>{
        let query_params:any = {};
        if(kyc_result) query_params.kyc_result =kyc_result;
        if(kyc_status) query_params.kyc_status =kyc_status;
        if(searchTerm) query_params.searchTerm =searchTerm;
        return BaseMethods.getRequest(customerUrlsV2.GET_KYC_CUSTOMERS, true, query_params);
    }
    static get_kyc_stats = () => {
        return BaseMethods.getRequest(customerUrlsV2.GET_KYC_STATS, true);
    }
    static get_one_customer = (id:string) =>{
        return BaseMethods.getRequest(customerUrlsV2.GET_ONE_CUSTOMER(id), true);
    }    
    static update_one_customer = ({ userId, customerId, body }: { userId:string, customerId:string, body:any }) => {
        let query_params:any = {};
        if(userId) query_params.adminUserId =userId;
        return BaseMethods.putRequest(customerUrlsV2.UPDATE_ONE_CUSTOMER(customerId), body, true, query_params);
    }
    static get_one_customer_transactions= (id:string) =>{
        return BaseMethods.getRequest(customerUrlsV2.GET_ONE_CUSTOMER_TRANSACTIONS(id), true);
    }
    static get_one_customer_transfers= (id:string) =>{
        return BaseMethods.getRequest(customerUrlsV2.GET_ONE_CUSTOMER_TRANSFERS(id), true);
    }
    static get_stats_countries = () =>
        BaseMethods.getRequest(customerUrlsV2.STATS_PER_COUNTRY, true);
}