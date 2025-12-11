// import { refreshAccessToken } from "@/app/services/v3/tokenService";

// // Helper pour ajouter le token aux headers
// export const getAuthHeaders = (additionalHeaders?: HeadersInit) => {
// 	const token = localStorage.getItem("sktoken");
// 	return {
// 		"Content-Type": "application/json",
// 		...(token && { Authorization: `Bearer ${token}` }),
// 		...additionalHeaders,
// 	};
// };

// // Wrapper pour les requêtes avec gestion auto du refresh
// export const fetchWithRetry = async (
// 	url: string,
// 	options: RequestInit = {}
// ): Promise<Response> => {
// 	// Première tentative
// 	let response = await fetch(url, {
// 		...options,
// 		headers: getAuthHeaders(options.headers),
// 	});

// 	// Si 401, tenter le refresh et retry
// 	if (response.status === 401) {
// 		const newToken = await refreshAccessToken();

// 		if (newToken) {
// 			// Retry avec le nouveau token
// 			response = await fetch(url, {
// 				...options,
// 				headers: getAuthHeaders(options.headers),
// 			});
// 		}
// 	}

// 	return response;
// };
