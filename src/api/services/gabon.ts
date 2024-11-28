import BaseMethods from "../baseMethods";
import { gabonUrls } from "../urls";


export class GabonService {
    static get_gabon_balance = ({token}: {token?:string}) =>{
        let query_params:any = {};
        return BaseMethods.getRequest(gabonUrls.GET_GABON_BALANCE, true, query_params, token);
    }
    static handle_gabon_balance_withdrawal = ({amount, phone, token}: {amount:string, phone?:string, token?:string}) =>{
        let query_params:any = {};
        if(amount) query_params.amount =amount;
        if(phone) query_params.phone =phone;        
        
        const body = {amount, phone};
        
        return BaseMethods.postRequest(gabonUrls.GABON_PAYOUT, body, true, query_params, token);
    }
};