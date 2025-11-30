import BaseMethods from "@/api/baseMethods";
import { usermanagementUrlsV3 } from "@/api/urlsV3";
import { isObject } from "@/utils/utils";

export class UserManagementServiceV3 {
	static getUsers = (params: any) => {
		let query_params: any = {};
		if (isObject(params)) {
			Object.entries(params).map(([key, value]: any[]) => {
				if (value) query_params[key] = value;
			});
		}
		return BaseMethods.getRequest(
			usermanagementUrlsV3.GET_ALL_USERS,
			true,
			query_params
		);
	};

	static getUserDeatails = (userId: string) => {
		return BaseMethods.getRequest(
			usermanagementUrlsV3.GET_USERS_DETAILS(userId),
			true
		);
	};
}
