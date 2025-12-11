// store/slices_v3/userV3.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
	id: string;
	phoneNumber: string;
	email: string;
	firstName: string;
	lastName: string;
	roles: string[];
	isActive: boolean;
	kycStatus: string;
	transactionEnableStatus: string;
	countryCode: string;
	city: string;
	state: string;
	dateOfBirth: string;
	gender: string;
	createdAt: string;
	updatedAt: string;
}

interface UserV3State {
	currentUser: User | null;
}

const initialState: UserV3State = {
	currentUser: null,
};

// Changez le nom de la slice en "userV3"
const userV3Slice = createSlice({
	name: "userV3", // <-- ICI: changez "user" en "userV3"
	initialState,
	reducers: {
		// Définir l'utilisateur
		setUserV3: (state, action: PayloadAction<User>) => {
			// <-- Renommez en setUserV3
			state.currentUser = action.payload;
		},

		// Mettre à jour un champ spécifique
		updateUserV3: (state, action: PayloadAction<Partial<User>>) => {
			// <-- Renommez en updateUserV3
			if (state.currentUser) {
				state.currentUser = {
					...state.currentUser,
					...action.payload,
				};
			}
		},

		// Effacer l'utilisateur
		clearUserV3: (state) => {
			// <-- Renommez en clearUserV3
			state.currentUser = null;
		},
	},
});

// Exportez avec les nouveaux noms
export const { setUserV3, updateUserV3, clearUserV3 } = userV3Slice.actions;

// Créez un sélecteur spécifique
export const selectUserV3 = (state: { userV3: UserV3State }) =>
	state.userV3.currentUser;

export default userV3Slice.reducer;
