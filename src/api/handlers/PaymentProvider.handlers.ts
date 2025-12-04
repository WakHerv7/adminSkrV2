import { PaymentProviderServiceV3 } from "../services/v3/Payment_Provider";

export const handleGetPaymentProviders = async ({ queryKey }: any) => {
	const [_key, filters] = queryKey;

	const response = await PaymentProviderServiceV3.getAll({ filters });

	const responseJson = await response.json();

	if (!response.ok) {
		throw new Error(
			responseJson.message || "Failed to fetch Payment Providers"
		);
	}

	return responseJson;
};

export const handleToggleActivePaymentpoviders = async (id: string) => {
	const response = await PaymentProviderServiceV3.toggle_active(id);

	const responseJson = await response.json();
	if (!response.ok) {
		throw new Error(
			responseJson.message ||
				"Erreur lors de la restoration du service payment"
		);
	}
	return responseJson;
};
