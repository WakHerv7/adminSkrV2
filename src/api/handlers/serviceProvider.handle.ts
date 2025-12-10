import { ServiceProviderV3 } from "../services/v3/service_provider";

export const handleGetServiceProvider = async ({ queryKey }: any) => {
	const [_key, filters] = queryKey;

	const response = await ServiceProviderV3.getSPs({ filters });
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fecth service providers"
		);
	}

	return responseJson;
};

export const handleGetSPs = async ({ queryKey }: any) => {
	const [_key, token] = queryKey;

	const response = await ServiceProviderV3.getSPs();
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fecth service providers"
		);
	}

	return responseJson;
};

export const handleCreateSp = async (data: any) => {
	const response = await ServiceProviderV3.create_SP(data);
	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.error || "Failed to create service provider"
		);
	}

	return responseJson;
};

export const handleUpdateServiceProvider = async (id: string, data: any) => {
	const response = await ServiceProviderV3.updateSP(id, data);

	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message ||
				"Erreur lors de la modification du service provider"
		);
	}
	return responseJson;
};

export const handleDeleteServiceProvider = async (id: string) => {
	const response = await ServiceProviderV3.deleteSP(id);

	// Gérer le cas 204 No Content
	if (response.status === 204) {
		return {
			success: true,
			message: "Service provider supprimé avec succès",
		};
	}

	// Gérer les erreurs
	if (!response.ok) {
		let errorMessage = "Erreur lors de la suppression du service provider";
		try {
			const errorData = await response.json();
			errorMessage = errorData.message || errorMessage;
		} catch {
			errorMessage = `Erreur ${response.status}: ${response.statusText}`;
		}
		throw new Error(errorMessage);
	}

	// Gérer les autres réponses réussies
	try {
		return await response.json();
	} catch {
		return { success: true, message: "Suppression réussie" };
	}
};
