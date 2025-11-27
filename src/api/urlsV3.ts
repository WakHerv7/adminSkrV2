export const BASE_URL_V3 = "https://api-dev.getsekure.dev";

const BASE_URL_AUTH = `${BASE_URL_V3}/ums/api/admin/auth`;

export const authUrlsV3 = {
	LOGIN_USER: `${BASE_URL_AUTH}/login`,
	LOGOUT_USER: `${BASE_URL_AUTH}/logout`,
	GENERATE_TOKEN: `${BASE_URL_AUTH}/refresh`,
	VERIFY_TOKEN: `${BASE_URL_AUTH}/change-password`,
};

const BASE_URL_USERMANAGEMENT = `${BASE_URL_V3}/ums/api/admin/users`;
export const usermanagementUrlsV3 = {
	GET_ALL_USERS: `${BASE_URL_USERMANAGEMENT}`,
	GET_USERS_DETAILS: (userId: string) =>
		`${BASE_URL_USERMANAGEMENT}/${userId}`,
	DEACTIVATE_USER: (userId: string) =>
		`${BASE_URL_USERMANAGEMENT}/${userId}/deactivate`,
	ACTIVATE_USER: (userId: string) =>
		`${BASE_URL_USERMANAGEMENT}/${userId}/activate`,
};

const Base_URL_KYC = `${BASE_URL_V3}/kyc-management/kyc`;
export const kycUrlsV3 = {
	GET_KYCS: `${Base_URL_KYC}`,
	GET_KYC_DETAILS: (kycId: string) => `${Base_URL_KYC}/kyc-user/${kycId}`,
	GET_KYC_DETAILS_BY_USER_ID: (userId: string) =>
		`${Base_URL_KYC}/by-user/${userId}`,
	ADMIN_UPDATE_KYC_STATUS: `${Base_URL_KYC}/admin/update-kyc-status`,
	DEACTIVATE_KYC: (kycId: string) => `${Base_URL_KYC}/deactivate/${kycId}`,
	UPDATE_KYC: (kycId: string) => `${Base_URL_KYC}/admin/${kycId}`,
};

export const BASE_URL_KYC_RAISON_REJECT = `${BASE_URL_V3}/kyc-management/kyc-raison-rejects`;
