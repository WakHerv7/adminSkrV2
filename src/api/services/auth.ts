import BaseMethods from "../baseMethods";
import { authUrls, userUrls } from "../urls";

export class AuthService {
    static login = (info:any) =>
        BaseMethods.postRequest(authUrls.LOGIN_USER, info, false);
    static logout = (info:any) =>
        BaseMethods.postRequest(authUrls.LOGOUT_USER, info, true);
    // static register = (info:any) =>
    //     BaseMethods.postRequest(authUrls.REGISTER_USER, info, false);
    // static current_user = () =>
    //     BaseMethods.getRequest(userUrls.CURRENT_USER, true);
    
}