import BaseMethods from "@/api/baseMethods";
import { kycUrlsV3 } from "@/api/urlsV3";
import { isObject } from "@/utils/utils";

export class KYCServiceV3 {
	static getkycs = (params: any) => {
		let query_params: any = {};
		if (isObject(params)) {
			Object.entries(params).map(([key, value]: any[]) => {
				if (value) query_params[key] = value;
			});
		}

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
