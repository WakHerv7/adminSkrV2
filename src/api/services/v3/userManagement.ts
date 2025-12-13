import BaseMethods from "@/api/baseMethods";
import { usermanagementUrlsV3 } from "@/api/urlsV3";
import { isObject } from "@/utils/utils";

export interface UpdateUserProfileData {
	firstName?: string;
	lastName?: string;
	email?: string;
	state?: string;
	address?: string;
	gender?: string;
	dateOfBirth?: string;
	city?: string;
	referralSource?: string;
	usageReason?: string;
}

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

	static updateUserProfile = (
		userId: string,
		data: UpdateUserProfileData
	) => {
		return BaseMethods.patchRequest(
			usermanagementUrlsV3.UPDATE_USER_PROFILE(userId),
			data,
			true
		);
	};

	static updateuser = (userId: string, data: any) => {
		return BaseMethods.patchRequest(
			usermanagementUrlsV3.UPDATE_USER(userId),
			data,
			true
		);
	};

	static deactivateUser = (userId: string) => {
		return BaseMethods.patchRequest(
			usermanagementUrlsV3.DEACTIVATE_USER(userId),
			{},
			true
		);
	};

	static activateUser = (userId: string) => {
		return BaseMethods.patchRequest(
			usermanagementUrlsV3.ACTIVATE_USER(userId),
			{},
			true
		);
	};

	static updateTransactionStatus = (
		userId: string,
		transactionEnableStatus: string
	) => {
		return BaseMethods.patchRequest(
			usermanagementUrlsV3.UPDATE_TRANSACTION_STATUS(userId),
			{ transactionEnableStatus },
			true
		);
	};

	static reactivateUser = (userId: string) => {
		return BaseMethods.patchRequest(
			usermanagementUrlsV3.ACTIVATE_USER(userId),
			{},
			true
		);
	};
}
