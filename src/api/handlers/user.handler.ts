import { string } from "zod";
import { UserManagementServiceV3 } from "../services/v3/userManagement";

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

// export const handleChangeRole = async ({
// 	id,
// 	data,
// }: {
// 	id: string;
// 	data: any;
// }) => {
// 	const response = await UserManagementServiceV3.changeRole(id, data);

// 	const responseJson = await response.json();
// 	if (!response.ok) {
// 		throw new Error(responseJson.message || "Failed to change user role");
// 	}

// 	return responseJson;
// };

// export const handleDeactivateUser = async ({ id }: { id: string }) => {
// 	const response = await UserManagementServiceV3.deactivateUser(id);

// 	const responseJson = await response.json();
// 	if (!response.ok) {
// 		throw new Error(responseJson.message || "Failed to deactivate user ");
// 	}

// 	return responseJson;
// };

// export const handleActivateUser = async ({ id }: { id: string }) => {
// 	const response = await UserManagementServiceV3.activateUser(id);

// 	const responseJson = await response.json();
// 	if (!response.ok) {
// 		throw new Error(responseJson.message || "Failed to activate user ");
// 	}

// 	return responseJson;
// };
