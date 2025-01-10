// export const BASE_URL = `${process.senv.NEXT_PUBLIC_API_URI}/api/v1`;
export const BASE_URL = `https://adminskrapi.fly.dev/api/v1`;
export const GETSEKURE_API_URL = `https://api.getsekure.com/api/v1`; 

// export const API_V2_BASE_URL = `http://localhost:3000/api/v2/admin`;
// export const API_V2_BASE_URL = `https://apigetsekure.com/api/v2/admin`;
export const API_V2_PROD_BASE_URL = `https://apigetsekure.com/api/v2/admin`;
export const API_V2_BASE_URL = `https://skr-api-v2.fly.dev/api/v2/admin`;



// export const BASE_URL_AUTH = `${BASE_URL}/admin/auth`;
// export const authUrls = {
//   LOGIN_USER: `${BASE_URL_AUTH}/login`,
//   LOGOUT_USER: `${BASE_URL_AUTH}/logout`,
//   // REGISTER_USER: `${BASE_URL}/signup`,  
// };

/** ======================================================== */
export const BASE_URL_AUTH = `${API_V2_BASE_URL}/auth`;
export const authUrls = {
  LOGIN_USER: `${BASE_URL_AUTH}/login`,
  LOGOUT_USER: `${BASE_URL_AUTH}/logout`,
  // REGISTER_USER: `${BASE_URL}/signup`,  
};

export const V2_BASE_URL_CUSTOMER = `${API_V2_BASE_URL}/customers`;
export const customerUrlsV2 = {  
  GET_CUSTOMERS: `${V2_BASE_URL_CUSTOMER}`,
  GET_KYC_STATS: `${V2_BASE_URL_CUSTOMER}/kyc-stats`,
  GET_ONE_CUSTOMER: (id:any) => `${V2_BASE_URL_CUSTOMER}/${id}`,
  UPDATE_ONE_CUSTOMER: (id:any) => `${V2_BASE_URL_CUSTOMER}/${id}`,
  GET_ONE_CUSTOMER_TRANSACTIONS: (id:any) => `${V2_BASE_URL_CUSTOMER}/${id}/transactions`,
  GET_ONE_CUSTOMER_TRANSFERS: (id:any) => `${V2_BASE_URL_CUSTOMER}/${id}/transfers`,
};
/** ------------------------------------ */
export const V2_BASE_URL_KYC = `${API_V2_BASE_URL}/kyc`;
export const kycUrlsV2 = {  
  GET_KYC_WARNINGS_LIST: `${V2_BASE_URL_KYC}/warnings-list`,
};
/** ------------------------------------ */
export const V2_BASE_URL_TRANSACTION = `${API_V2_BASE_URL}/transactions`;
export const transactionUrlsV2 = {  
  MANAGE_USER_ACCOUNT_TRANSACTIONS: `${V2_BASE_URL_TRANSACTION}/manage-user-account-balance`,

  // GET_ALL_TRANSACTIONS: `${BASE_URL_TRANSACTION}`,
  // GET_PERIODIC_TRANSACTIONS: `${BASE_URL_TRANSACTION}/periodic`,
  // GET_USER_TRANSACTIONS: (id:any) => `${BASE_URL_TRANSACTION}/user/${id}`,
  // GET_USER_TRANSACTIONS_STATS: (id:any) => `${BASE_URL_TRANSACTION}/user-stats/${id}`,
  // // GET_WALLETS_TRANSACTIONS: `${BASE_URL_TRANSACTION}/wallets`,
  // GET_WALLETS_TRANSACTIONS_STATS: `${BASE_URL_TRANSACTION}/wallets-stats`,
  // GET_TRANSFERS_STATS: `${BASE_URL_TRANSACTION}/transfers-stats`,

  // GET_COUNTRIES_TRANSACTIONS: `${BASE_URL_TRANSACTION}/countries`,
  // GET_CATEGORY_TYPE_TRANSACTIONS: `${BASE_URL_TRANSACTION}/categorytype`,
  // GET_LAST_10_TRANSACTIONS: `${BASE_URL_TRANSACTION}/last10`,  
};
  /** ------------------------------------ */
  export const V2_BASE_URL_CHNPAYMENT = `${API_V2_BASE_URL}/chnpayment`;
  export const chnpaymentUrlsV2 = {  
    GET_ALL_CHNPAYMENTS: `${V2_BASE_URL_CHNPAYMENT}`,
    GET_ONE_CHNPAYMENT: (id:any) => `${V2_BASE_URL_CHNPAYMENT}/transaction/${id}`,
    UPDATE_CHNPAYMENT: (id:any) => `${V2_BASE_URL_CHNPAYMENT}/status/${id}`,
    UPDATE_CHNPAYMENT_PROOF: (id:any) => `${V2_BASE_URL_CHNPAYMENT}/proof/${id}`,
  };
/** ======================================================== */

export const BASE_URL_USER = `${BASE_URL}/admin/users`;
export const userUrls = {  
  GET_USERS: `${BASE_URL_USER}`,
  GET_KYC: `${BASE_URL_USER}/kyc`,
  GET_KYC_STATS: `${BASE_URL_USER}/kyc-stats`,
  GET_CUSTOMERS: `${BASE_URL_USER}/customers`,
  GET_CUSTOMERS_STATS: `${BASE_URL_USER}/customers-stats`,
  GET_ONE_CUSTOMER: (id:any) => `${BASE_URL_USER}/customer/${id}`,
  GET_ONE_CUSTOMER_TRANSACTIONS: (id:any) => `${BASE_URL_USER}/customer-transactions/${id}`,
  GET_ONE_CUSTOMER_TRANSFERS: (id:any) => `${BASE_URL_USER}/customer-transfers/${id}`,
  GET_ONE_USER: (id:any) => `${BASE_URL_USER}/${id}`,
  ACTIVATE_USER_ACCOUNT: (id:any) => `${BASE_URL_USER}/activate/${id}`,
  BLOCK_USER_ACCOUNT: (id:any) => `${BASE_URL_USER}/block/${id}`,
  UNBLOCK_USER_ACCOUNT: (id:any) => `${BASE_URL_USER}/unblock/${id}`,
  UPDATE_USER_INFOS: (id:any) => `${BASE_URL_USER}/update/${id}`,
  UPDATE_USER_PASSWORD: (id:any) => `${BASE_URL_USER}/updatePassword/${id}`,
  UPDATE_USER_PHOTO: (id:any) => `${BASE_URL_USER}/updatePhoto/${id}`,
  UPDATE_USER_SELFIE: (id:any) => `${BASE_URL_USER}/updateSelfie/${id}`,
  UPDATE_USER_PAPER_IMAGES: (id:any) => `${BASE_URL_USER}/updatePaperImages/${id}`,
  UPDATE_USER_VERIFICATION_STATUS: (id:any) => `${BASE_URL_USER}/updateVerificationStatus/${id}`,
  
};

export const BASE_URL_CARD = `${BASE_URL}/admin/cards`;
export const cardUrls = {
  GET_CARDS: `${BASE_URL_CARD}`,
  GET_CARDS_STATS: `${BASE_URL_CARD}/stats`,
  RECHARGE_CARD: (id:any) => `${BASE_URL_CARD}/fund/${id}`,
  WITHDRAW_CARD: (id:any) => `${BASE_URL_CARD}/withdraw/${id}`,
  FREEZE_CARD: (id:any) => `${BASE_URL_CARD}/freeze/${id}`,
  UNFREEZE_CARD: (id:any) => `${BASE_URL_CARD}/unfreeze/${id}`,
  GET_CARD_TRANSACTIONS: (id:any) => `${BASE_URL_CARD}/transactions/${id}`,
  GET_ONE_CARD: (id:any) => `${BASE_URL_CARD}/${id}`,
};

export const BASE_URL_TRANSACTION = `${BASE_URL}/admin/transactions`;
export const transactionUrls = {  
  GET_ALL_TRANSACTIONS: `${BASE_URL_TRANSACTION}`,
  GET_PERIODIC_TRANSACTIONS: `${BASE_URL_TRANSACTION}/periodic`,
  GET_USER_TRANSACTIONS: (id:any) => `${BASE_URL_TRANSACTION}/user/${id}`,
  GET_USER_TRANSACTIONS_STATS: (id:any) => `${BASE_URL_TRANSACTION}/user-stats/${id}`,
  // GET_WALLETS_TRANSACTIONS: `${BASE_URL_TRANSACTION}/wallets`,
  GET_WALLETS_TRANSACTIONS_STATS: `${BASE_URL_TRANSACTION}/wallets-stats`,
  GET_TRANSFERS_STATS: `${BASE_URL_TRANSACTION}/transfers-stats`,

  GET_COUNTRIES_TRANSACTIONS: `${BASE_URL_TRANSACTION}/countries`,
  GET_CATEGORY_TYPE_TRANSACTIONS: `${BASE_URL_TRANSACTION}/categorytype`,
  GET_LAST_10_TRANSACTIONS: `${BASE_URL_TRANSACTION}/last10`,
  
  HANDLE_USER_ACCOUNT_TRANSACTIONS: `${BASE_URL_TRANSACTION}/user-account-balance`,
};

export const BASE_URL_NOTIFICATION = `${BASE_URL}/admin/notifications`;
export const notificationUrls = {
  GET_NOTIFICATIONS: `${BASE_URL_NOTIFICATION}`,
  SEND_NOTIFICATION: `${BASE_URL_NOTIFICATION}/send`,
};


export const BASE_URL_GABON = `${API_V2_PROD_BASE_URL}/gabon`;
export const gabonUrls = {  
  GET_GABON_BALANCE: `${BASE_URL_GABON}/check-balance`,
  GABON_PAYOUT: `${BASE_URL_GABON}/payout`,
}








