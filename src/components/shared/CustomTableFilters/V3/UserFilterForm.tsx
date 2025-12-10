"use client";

import React from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HiFilter } from "react-icons/hi";
import { ChevronDown, Check, X } from "lucide-react";
import CButton from "../../CButton";

const userFilterSchema = z.object({
	role: z.enum(["ADMIN", "CUSTOMER", "all"], {
		required_error: "Sélectionnez un rôle",
	}),
	isActive: z.enum(["true", "false", "all"], {
		required_error: "Sélectionnez un statut",
	}),
	kycStatus: z.enum(
		["PENDING", "IN_PROGRESS", "COMPLETED", "REJECTED", "all"],
		{
			required_error: "Sélectionnez un statut KYC",
		}
	),
	transactionEnableStatus: z.enum(
		["DISABLED", "IN_PROGRESS", "ALMOST_ENABLED", "ENABLED", "all"],
		{
			required_error: "Sélectionnez un statut de transaction",
		}
	),
	countryCode: z.string().optional(),
});

type UserFilterFormData = z.infer<typeof userFilterSchema>;

interface UserFilterFormProps {
	filterContent?: any;
	setFilterContent?: (data?: any) => void;
}

// Composant CustomSelect pour le dropdown
interface CustomSelectProps {
	options: { value: string; label: string }[];
	value: string | undefined;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
	options,
	value,
	onChange,
	placeholder = "Sélectionnez une option",
	disabled = false,
	error = false,
}) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const containerRef = React.useRef<HTMLDivElement>(null);

	const selectedOption = options.find((opt) => opt.value === value);

	const handleSelect = (optionValue: string) => {
		onChange(optionValue);
		setIsOpen(false);
	};

	return (
		<div className="relative w-full" ref={containerRef}>
			<button
				type="button"
				onClick={() => !disabled && setIsOpen(!isOpen)}
				disabled={disabled}
				className={`flex h-11 w-full items-center justify-between rounded-lg bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:shadow-md hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 ${
					error ? "ring-2 ring-red-500/30 shadow-red-100" : ""
				}`}
			>
				<span
					className={
						selectedOption ? "text-gray-900" : "text-gray-500"
					}
				>
					{selectedOption ? selectedOption.label : placeholder}
				</span>
				<ChevronDown
					className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && !disabled && (
				<div className="absolute z-[1000] w-full mt-2 rounded-xl bg-white shadow-lg border-0 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
					<div className="max-h-[300px] overflow-y-auto p-1">
						{options.length === 0 ? (
							<div className="px-4 py-3 text-sm text-gray-500 text-center">
								Aucune option disponible
							</div>
						) : (
							options.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => handleSelect(option.value)}
									className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left rounded-lg transition-all duration-150 ${
										value === option.value
											? "bg-blue-50 text-blue-700 font-medium"
											: "text-gray-700 hover:bg-gray-50"
									}`}
								>
									<span>{option.label}</span>
									{value === option.value && (
										<Check className="h-4 w-4 text-blue-700" />
									)}
								</button>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
};

const UserFilterForm: React.FC<UserFilterFormProps> = ({
	filterContent,
	setFilterContent,
}) => {
	const form = useForm<UserFilterFormData>({
		resolver: zodResolver(userFilterSchema),
		defaultValues: {
			role: "all",
			isActive: "all",
			kycStatus: "all",
			transactionEnableStatus: "all",
			countryCode: "",
		},
	});

	const onSubmit = (data: UserFilterFormData) => {
		console.log("Filtres utilisateur soumis:", data);

		// Préparer les données pour l'API
		const filterData: any = {};

		// Rôle - seulement si différent de "all" et non vide
		if (data.role && data.role !== "all") {
			filterData.role = data.role;
		}

		// Statut actif - seulement si différent de "all" et non vide
		if (data.isActive && data.isActive !== "all") {
			filterData.isActive = data.isActive === "true";
		}

		// Statut KYC - seulement si différent de "all" et non vide
		if (data.kycStatus && data.kycStatus !== "all") {
			filterData.kycStatus = data.kycStatus;
		}

		// Statut de transaction - seulement si différent de "all" et non vide
		if (
			data.transactionEnableStatus &&
			data.transactionEnableStatus !== "all"
		) {
			filterData.transactionEnableStatus = data.transactionEnableStatus;
		}

		// Code pays - seulement si non vide
		if (data.countryCode && data.countryCode.trim() !== "") {
			filterData.countryCode = data.countryCode.toUpperCase();
		}

		if (setFilterContent) {
			console.log("Filtres appliqués:", filterData);
			setFilterContent(filterData);
		}
	};

	const onError = (errors: any) => {
		console.error("Erreurs de validation:", errors);
	};

	// Options pour les filtres
	const roleOptions = [
		{ value: "all", label: "Tous les rôles" },
		{ value: "ADMIN", label: "Administrateur" },
		{ value: "CUSTOMER", label: "Client" },
	];

	const statusOptions = [
		{ value: "all", label: "Tous les statuts" },
		{ value: "true", label: "Actif" },
		{ value: "false", label: "Inactif" },
	];

	const kycOptions = [
		{ value: "all", label: "Tous les statuts KYC" },
		{ value: "PENDING", label: "En attente" },
		{ value: "IN_PROGRESS", label: "En progression" },
		{ value: "COMPLETED", label: "Completé" },
		{ value: "REJECTED", label: "Rejeté" },
	];

	const transactionOptions = [
		{ value: "all", label: "Tous les statuts" },
		{ value: "DISABLED", label: "Désactivé" },
		{ value: "IN_PROGRESS", label: "En progression" },
		{ value: "ALMOST_ENABLED", label: "Presque activé" },
		{ value: "ENABLED", label: "Activé" },
	];

	// Codes pays courants
	const countryCodes = ["CM", "BJ", "CG", "CD", "TD", "GA", "NG"];

	const countryOptions = [
		{ value: "", label: "Tous les pays" },
		...countryCodes.map((code) => ({
			value: code,
			label: `${code} - ${getCountryName(code)}`,
		})),
	];

	// Fonction pour obtenir le nom du pays
	function getCountryName(code: string): string {
		const countries: Record<string, string> = {
			CM: "Cameroun",
			BJ: "Benin",
			CG: "Congo",
			CD: "Rdc",
			TD: "Tchad",
			GA: "Gabon",
			NG: "Nigeria",
		};
		return countries[code] || code;
	}

	// Réinitialiser tous les filtres
	const resetFilters = () => {
		form.reset({
			role: "all",
			isActive: "all",
			kycStatus: "all",
			transactionEnableStatus: "all",
			countryCode: "",
		});
		if (setFilterContent) {
			setFilterContent({});
		}
	};

	return (
		<div className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
			<div className="flex gap-2 items-center font-bold text-md mb-6">
				<HiFilter className="w-5 h-5" />
				<span className="text-gray-900">Filtres Utilisateurs</span>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className="w-full"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{/* Filtre par rôle */}
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-2 block">
										Rôle
									</FormLabel>
									<FormControl>
										<CustomSelect
											options={roleOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Sélectionnez un rôle"
											error={!!form.formState.errors.role}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs mt-1" />
								</FormItem>
							)}
						/>

						{/* Filtre par statut actif */}
						<FormField
							control={form.control}
							name="isActive"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-2 block">
										Statut Actif
									</FormLabel>
									<FormControl>
										<CustomSelect
											options={statusOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Sélectionnez un statut"
											error={
												!!form.formState.errors.isActive
											}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs mt-1" />
								</FormItem>
							)}
						/>

						{/* Filtre par statut KYC */}
						<FormField
							control={form.control}
							name="kycStatus"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-2 block">
										Statut KYC
									</FormLabel>
									<FormControl>
										<CustomSelect
											options={kycOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Sélectionnez un statut KYC"
											error={
												!!form.formState.errors
													.kycStatus
											}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs mt-1" />
								</FormItem>
							)}
						/>

						{/* Filtre par statut de transaction */}
						<FormField
							control={form.control}
							name="transactionEnableStatus"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-2 block">
										Transactions
									</FormLabel>
									<FormControl>
										<CustomSelect
											options={transactionOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Sélectionnez un statut"
											error={
												!!form.formState.errors
													.transactionEnableStatus
											}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs mt-1" />
								</FormItem>
							)}
						/>

						{/* Filtre par code pays */}
						<FormField
							control={form.control}
							name="countryCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-2 block">
										Pays
									</FormLabel>
									<FormControl>
										<CustomSelect
											options={countryOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Sélectionnez un pays"
											error={
												!!form.formState.errors
													.countryCode
											}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs mt-1" />
								</FormItem>
							)}
						/>
					</div>

					{/* Boutons d'action */}
					<div className="flex flex-wrap gap-4 items-center justify-between pt-4 border-t border-gray-100">
						<div className="flex gap-4">
							<CButton
								text="Appliquer les filtres"
								btnStyle={"dark"}
								height="44px"
								type="submit"
							/>

							<CButton
								text="	Réinitialiser tous"
								btnStyle={"outlineDark"}
								onClick={resetFilters}
							/>
						</div>

						<div className="text-sm text-gray-500">
							{filterContent &&
							Object.keys(filterContent).length > 0 ? (
								<span className="inline-flex items-center gap-2">
									<span className="w-2 h-2 bg-green-500 rounded-full"></span>
									Filtres actifs
								</span>
							) : (
								"Aucun filtre actif"
							)}
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default UserFilterForm;
