import { ITableHeader } from "@/components/AdminTable/Table";

export const headerKYCDataV3: ITableHeader = {
	serial: "S/N",
	name: "Nom",
	email: "Email",
	phone: "Numero",
	// country: "Pays",
	status: "KycStatut",
	date: "Date de création",
	action: "",
};

export const headerCountriesDataV3: ITableHeader = {
	serial: "S/N",
	name: "Nom",
	flag: "flag",
	currency: "Currency",
	dialCode: "Dial code",
	code: "Code",
	codeIso3: "Code ISO3",
	phoneLength: "Phone Length",
	actions: "",
};
