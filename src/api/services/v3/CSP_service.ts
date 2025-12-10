import BaseMethods from "@/api/baseMethods";
import { CSP_URL_V3 } from "@/api/urlsV3";

export class CSP_ServiceV3 {
	static create = (data: any) => {
		return BaseMethods.postRequest(CSP_URL_V3, data, true);
	};

	static getByCountry = ({
		filters,
		countryCode,
	}: {
		filters?: any;
		countryCode: string;
	}) => {
		return BaseMethods.getRequest(
			`  ${CSP_URL_V3}/public/country/${countryCode}`,
			true
		);
	};

	static update = (id: string, data: any) => {
		return BaseMethods.patchRequest(`${CSP_URL_V3}/${id}`, data, true);
	};
}
