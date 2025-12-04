import BaseMethods from "../baseMethods";
import { Service_V3 } from "../services/v3/service";

export const handleGetService = async ({ queryKey }: any) => {
	const [_key, filters] = queryKey;
	const response = await Service_V3.getAll({ filters });

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to fetch Service");
	}

	return responseJson;
};

export const handleCreateService = async (data: any) => {
	const response = await Service_V3.create(data);

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(responseJson.message || "Failed to create service");
	}

	return responseJson;
};

export const handleUpdateService = async ({
	id,
	data,
}: {
	id: string;
	data: any;
}) => {
	const response = await Service_V3.update(id, data);

	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la modification du service"
		);
	}
	return responseJson;
};

export const handleDeleteService = async (id: string) => {
	const response = await Service_V3.delete(id);

	// Gérer le cas 204 No Content
	if (response.status === 204) {
		return { success: true, message: "Service supprimé avec succès" };
	}

	// Gérer les erreurs
	if (!response.ok) {
		let errorMessage = "Erreur lors de la suppression du service";
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

export const handleRestoreService = async (id: string) => {
	const response = await Service_V3.restore(id);

	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message || "Erreur lors de la restoration du service"
		);
	}
	return responseJson;
};
