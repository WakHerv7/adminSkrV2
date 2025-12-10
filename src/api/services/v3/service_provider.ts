import BaseMethods from "@/api/baseMethods";
import { SERVICE_PROVIDER_URL_V3 } from "@/api/urlsV3";

export class ServiceProviderV3 {
	static create_SP = (data: any) => {
		return BaseMethods.postRequest(SERVICE_PROVIDER_URL_V3, data, true);
	};

	static getSPs = (params?: { filters?: Record<string, any> }) => {
		const filters = params?.filters ?? {};

		const query_params: Record<string, string> = {};
		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				query_params[key] = String(value);
			}
		});

		return BaseMethods.getRequest(
			SERVICE_PROVIDER_URL_V3,
			true,
			query_params
		);
	};

	static updateSP = (id: string, data: any) => {
		return BaseMethods.patchRequest(
			`${SERVICE_PROVIDER_URL_V3}/${id}`,
			data,
			true
		);
	};

	static deleteSP = (id: string) => {
		return BaseMethods.deleteRequest(
			`${SERVICE_PROVIDER_URL_V3}/${id}`,
			{},
			true
		);
	};
}
