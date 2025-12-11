import { string } from "zod";
import { UserManagementServiceV3 } from "../services/v3/userManagement";
import { usermanagementUrlsV3 } from "../urlsV3";

export const handleGetUsers = async ({ queryKey }: any) => {
	const [_key, filters] = queryKey;

	console.log("filtres recus", filters);

	const response = await UserManagementServiceV3.getUsers({ filters });
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch users");
	}

	return responseJson;
};

export const handleGetUsersDetails = async ({ queryKey }: any) => {
	const [_key, id] = queryKey;
	const response = await UserManagementServiceV3.getUserDeatails(id);

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch user details");
	}

	return responseJson;
};

export const handleUpdateUser = async ({
	id,
	data,
}: {
	id: string;
	data: any;
}) => {
	console.log("data dans le handler", data);
	const response = await UserManagementServiceV3.updateuser(id, data);

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to update user profile"
		);
	}

	return responseJson;
};

export const hanldeDeactivateUser = async (userId: string) => {
	const response = await UserManagementServiceV3.deactivateUser(userId);

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to deactivate user");
	}

	return responseJson;
};

export const handleActivateUser = async (userId: string) => {
	const response = await UserManagementServiceV3.reactivateUser(userId);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to reactivate user");
	}

	return responseJson;
};
