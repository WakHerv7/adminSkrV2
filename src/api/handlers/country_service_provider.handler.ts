import { CSP_ServiceV3 } from "../services/v3/CSP_service";

export const handleCreateCSP = async (data: any) => {
	const response = await CSP_ServiceV3.create(data);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message ||
				"Failed to create a country service provided"
		);
	}

	return responseJson;
};

export const handleUpdateCSP = async ({
	id,
	data,
}: {
	id: string;
	data: any;
}) => {
	const response = await CSP_ServiceV3.update(id, data);

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message ||
				"Failed to create a country service provided"
		);
	}

	return responseJson;
};
