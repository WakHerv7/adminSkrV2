import BaseMethods from "@/api/baseMethods";
import { BASE_URL_KYC_RAISON_REJECT } from "@/api/urlsV3";

export class KYCRaisonRejectServiceV3 {
	static getRaisonRejects = () => {
		return BaseMethods.getRequest(BASE_URL_KYC_RAISON_REJECT, true);
	};
}
