import BaseMethods from "@/api/baseMethods";
import { SERVICE_URL_V3 } from "@/api/urlsV3";
import { object, string } from "zod";

export class Service_V3 {
	static getAll = (params?: { filters?: Record<string, any> }) => {
		const filters = params?.filters ?? {};

		const query_params: Record<string, string> = {};

		Object.entries(filters).forEach(([Key, value]) => {
			if (value !== undefined && value !== null && value !== "") {
				query_params[Key] = String(value);
			}
		});

		return BaseMethods.getRequest(SERVICE_URL_V3, true, query_params);
	};

	static create = (data: any) => {
		return BaseMethods.postRequest(SERVICE_URL_V3, data, true);
	};

	static update = (id: string, data: any) => {
		return BaseMethods.patchRequest(`${SERVICE_URL_V3}/${id}`, data, true);
	};

	static delete = (id: string) => {
		return BaseMethods.deleteRequest(`${SERVICE_URL_V3}/${id}`, {}, true);
	};

	static restore = (id: string) => {
		return BaseMethods.patchRequest(
			`${SERVICE_URL_V3}/${id}/restore`,
			{},
			true
		);
	};
}
