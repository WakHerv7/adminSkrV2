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

export const COUNTRIES_URL_V3 = `${BASE_URL_V3}/cms/countries`;

export const SERVICE_PROVIDER_URL_V3 = `${BASE_URL_V3}/payment/providers`;

export const PAYMENT_PROVIDER_URL_V3 = `${BASE_URL_V3}/payment/payment-providers`;

export const CSP_URL_V3 = `${BASE_URL_V3}/payment/country-service-provided`;

export const SERVICE_URL_V3 = `${BASE_URL_V3}/payment/services`;

export const CARDS_BASE_URLS_V3 = `${BASE_URL_V3}/cms-cards/api/admin`;
export const cardsUrlV3 = {
	GET_CARDS: (userId: string) =>
		`${CARDS_BASE_URLS_V3}/users/${userId}/cards`,
	GET_CARDS_DETAILS: (cardsId: string) =>
		`${CARDS_BASE_URLS_V3}/cards/${cardsId}/details`,
	FREEZE_CARD: (cardId: string) =>
		`${CARDS_BASE_URLS_V3}/cards/${cardId}/freeze`,
	UNFREEZE_CARD: (cardId: string) =>
		`${CARDS_BASE_URLS_V3}/cards/${cardId}/unfreeze`,
	TERMINATE_CARD: (cardId: string) =>
		`${CARDS_BASE_URLS_V3}/cards/${cardId}/terminate`,
	ALL_CARDS_TRANSACTION: (userId: string) =>
		`${CARDS_BASE_URLS_V3}/users/${userId}/card-transactions`,
	CARD_TRANSACTION: (cardId: string) =>
		`${CARDS_BASE_URLS_V3}/cards/${cardId}/transactions`,
};

// Transactions Management Service
const TRANSACTIONS_BASE_URL_V3 = `${BASE_URL_V3}/tms/api/admin`;
export const transactionsUrlV3 = {
	// User wallets
	GET_USER_WALLETS: (userId: string) =>
		`${TRANSACTIONS_BASE_URL_V3}/users/${userId}/wallets`,
	GET_USER_DEFAULT_WALLET: (userId: string) =>
		`${TRANSACTIONS_BASE_URL_V3}/users/${userId}/default-wallet`,
	GET_USER_BALANCE: (userId: string) =>
		`${TRANSACTIONS_BASE_URL_V3}/users/${userId}/balance`,
	// User transactions
	GET_USER_TRANSACTIONS: (userId: string) =>
		`${TRANSACTIONS_BASE_URL_V3}/users/${userId}/transactions`,
	// Transaction details
	GET_TRANSACTION_DETAILS: (transactionId: string) =>
		`${TRANSACTIONS_BASE_URL_V3}/transactions/${transactionId}`,
	// All transactions (admin)
	GET_ALL_TRANSACTIONS: `${TRANSACTIONS_BASE_URL_V3}/transactions`,
	// Balance adjustment (admin)
	ADJUST_WALLET_BALANCE: `${TRANSACTIONS_BASE_URL_V3}/wallets/adjust-balance`,
	// Debt creation (admin)
	CREATE_DEBT: `${TRANSACTIONS_BASE_URL_V3}/debts/create`,
	// Wallet transfer (admin - no fees)
	WALLET_TRANSFER: `${TRANSACTIONS_BASE_URL_V3}/wallets/transfer`,
};
