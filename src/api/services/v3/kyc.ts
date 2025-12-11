import BaseMethods from "@/api/baseMethods";
import { kycUrlsV3 } from "@/api/urlsV3";

export class KYCServiceV3 {
	static getkycs = (params: any) => {
		console.log("params dans le service", params);
		let query_params: any = {};

		if (isObject(params)) {
			Object.entries(params).map(([key, value]: any[]) => {
				if (value) {
					// Si la valeur est un tableau (ex: status = ["PENDING", "IN_PROGRESS"])
					// On le transforme en string séparé par des virgules
					// que le backend pourra parser
					if (Array.isArray(value)) {
						// Option 1: Envoyer comme une seule valeur séparée par des virgules
						// query_params[key] = value.join(",");

						// Option 2: Créer plusieurs clés (status[0], status[1])
						// value.forEach((item, index) => {
						//   query_params[`${key}[${index}]`] = item;
						// });

						// Option 3: Créer plusieurs paramètres identiques via la string
						// Ce qui générera: status=PENDING&status=IN_PROGRESS
						// Pour cela, on doit construire manuellement la query string
						query_params[key] = value;
					} else {
						query_params[key] = value;
					}
				}
			});
		}

		// Si on a des tableaux, construire manuellement la query string
		let customQueryString = "";
		const regularParams: any = {};

		Object.entries(query_params).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				// Construire: status=PENDING&status=IN_PROGRESS
				const paramParts = value
					.map(
						(item) =>
							`${encodeURIComponent(key)}=${encodeURIComponent(
								item
							)}`
					)
					.join("&");
				customQueryString +=
					(customQueryString ? "&" : "") + paramParts;
			} else {
				regularParams[key] = value;
			}
		});

		console.log("query params traités", {
			regularParams,
			customQueryString,
		});

		// Si on a une query string personnalisée, on l'ajoute à l'URL
		if (customQueryString) {
			const baseUrl = kycUrlsV3.GET_KYCS;
			const separator = baseUrl.includes("?") ? "&" : "?";

			// Construire les params réguliers
			let regularQueryString = "";
			if (Object.keys(regularParams).length > 0) {
				regularQueryString = new URLSearchParams(
					regularParams
				).toString();
			}

			// Combiner tout
			const fullQueryString = [regularQueryString, customQueryString]
				.filter(Boolean)
				.join("&");

			const fullUrl = baseUrl + separator + fullQueryString;

			// Appeler sans params puisqu'ils sont déjà dans l'URL
			return BaseMethods.getRequest(fullUrl, true);
		}

		// Sinon, comportement normal
		return BaseMethods.getRequest(kycUrlsV3.GET_KYCS, true, query_params);
	};

	static getKycDetails = (kycId: string) => {
		return BaseMethods.getRequest(kycUrlsV3.GET_KYC_DETAILS(kycId), true);
	};

	static getKycDetailsByUserId = (userId: string) => {
		return BaseMethods.getRequest(
			kycUrlsV3.GET_KYC_DETAILS_BY_USER_ID(userId),
			true
		);
	};

	static updateKyc = (kycId: string, data: any) => {
		return BaseMethods.putRequest(kycUrlsV3.UPDATE_KYC(kycId), data, true);
	};
}

function isObject(value: any): boolean {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
