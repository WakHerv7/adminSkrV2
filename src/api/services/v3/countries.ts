import BaseMethods from "@/api/baseMethods";
import { COUNTRIES_URL_V3 } from "@/api/urlsV3";
import { data } from "@/constants/Index";

export class CountriesServiceV3 {
	static getCountries = () => {
		return BaseMethods.getRequest(`${COUNTRIES_URL_V3}/secured`, true);
	};
	static createCountry = (data: any) => {
		return BaseMethods.postRequest(COUNTRIES_URL_V3, data, true);
	};

	static updateCountry = (countryId: string, data: any) => {
		return BaseMethods.putRequest(
			`${COUNTRIES_URL_V3}/${countryId}`,
			data,
			true
		);
	};

	static deleteCountry = (countryId: string) => {
		return BaseMethods.deleteRequest(
			`${COUNTRIES_URL_V3}/${countryId}`,
			{},
			true
		);
	};
}
