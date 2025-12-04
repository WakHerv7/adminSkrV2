import BaseMethods from "@/api/baseMethods";
import { PAYMENT_PROVIDER_URL_V3 } from "@/api/urlsV3";
import { tree } from "next/dist/build/templates/app-page";

export class PaymentProviderServiceV3 {
	static create = (data: any) => {
		return BaseMethods.postRequest(PAYMENT_PROVIDER_URL_V3, data, true);
	};

	static update = (id: string, data: any) => {
		return BaseMethods.patchRequest(
			`${PAYMENT_PROVIDER_URL_V3}/${id}`,
			data,
			true
		);
	};

	static getAll = (params?: { filters?: Record<string, any> }) => {
		console.log("params dans le service", params);
		const filters = params?.filters ?? {};

		console.log("filtres dans le service", filters);
		// Génération automatique des query params
		const query_params: Record<string, string> = {};

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				query_params[key] = String(value);
			}
		});

		return BaseMethods.getRequest(
			PAYMENT_PROVIDER_URL_V3,
			true,
			query_params
		);
	};

	static delete = (id: string) => {
		return BaseMethods.deleteRequest(
			`${PAYMENT_PROVIDER_URL_V3}/${id}`,
			{},
			true
		);
	};

	static toggle_active = (id: string) => {
		return BaseMethods.patchRequest(
			`${PAYMENT_PROVIDER_URL_V3}/${id}/toggle-active`,
			{},
			true
		);
	};
}
