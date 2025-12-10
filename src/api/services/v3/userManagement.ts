import BaseMethods from "@/api/baseMethods";
import { usermanagementUrlsV3 } from "@/api/urlsV3";
import { isObject } from "@/utils/utils";

export class UserManagementServiceV3 {
	static getUsers = (params?: { filters?: Record<string, any> }) => {
		const filters = params?.filters ?? {};

		const query_params: Record<string, string> = {};

		Object.entries(filters).forEach(([Key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				query_params[Key] = String(value);
			}
		});
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

	// static
}
