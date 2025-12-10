// import { AuthService } from "@/api/services/auth";
// import { setCredentials } from "@/redux/slices/auth";
// import { store } from "@/redux/store";

// let isRefreshing = false;
// let refreshSubscribers: ((token: string) => void)[] = [];

// const subscribeTokenRefresh = (cb: (token: string) => void) => {
// 	refreshSubscribers.push(cb);
// };

// const onTokenRefreshed = (token: string) => {
// 	refreshSubscribers.forEach((cb) => cb(token));
// 	refreshSubscribers = [];
// };

// export const refreshAccessToken = async (): Promise<string | null> => {
// 	if (isRefreshing) {
// 		return new Promise((resolve) => {
// 			subscribeTokenRefresh((token: string) => {
// 				resolve(token);
// 			});
// 		});
// 	}

// 	isRefreshing = true;

// 	try {
// 		const refreshToken = localStorage.getItem("refreshToken");

// 		if (!refreshToken) {
// 			throw new Error("No refresh token available");
// 		}

// 		const response = await AuthService.refreshTokenV3({ refreshToken });

// 		if (!response.ok) {
// 			throw new Error("Failed to refresh token");
// 		}

// 		const data = await response.json();
// 		const newAccessToken = data.data.accessToken;
// 		const newRefreshToken = data.data.refreshToken;

// 		localStorage.setItem("sktoken", newAccessToken);
// 		localStorage.setItem("refreshToken", newRefreshToken);

// 		const state = store.getState();
// 		store.dispatch(
// 			setCredentials({
// 				token: newAccessToken,
// 				getSekureApiToken: state.auth.getSekureApiToken,
// 				user: state.auth.user,
// 			})
// 		);

// 		onTokenRefreshed(newAccessToken);
// 		isRefreshing = false;

// 		return newAccessToken;
// 	} catch (error) {
// 		isRefreshing = false;
// 		localStorage.removeItem("sktoken");
// 		localStorage.removeItem("refreshToken");
// 		// store.dispatch(clearCredentials());
// 		window.location.href = "/login";
// 		return null;
// 	}
// };
