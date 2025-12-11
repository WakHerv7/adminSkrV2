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
import { ChevronDown, Check } from "lucide-react";
import CButton from "../../CButton";

const kycFilterSchema = z.object({
	status: z.enum(
		["PENDING", "IN_PROGRESS", "COMPLETED", "REJECTED", "RESEND_INFO", "all"],
		{
			required_error: "Sélectionnez un statut",
		}
	),
	email: z.string().optional(),
	phone: z.string().optional(),
});

type KycFilterFormData = z.infer<typeof kycFilterSchema>;

interface KycFilterFormProps {
	filterContent?: any;
	setFilterContent?: (data?: any) => void;
	// Statut par défaut pour les tabs spécifiques (pending, completed, etc.)
	defaultStatus?: string | string[];
	// Masquer le filtre de statut si le tab a un statut fixe
	hideStatusFilter?: boolean;
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

	// Fermer le dropdown quand on clique en dehors
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

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

const KycFilterForm: React.FC<KycFilterFormProps> = ({
	filterContent,
	setFilterContent,
	defaultStatus,
	hideStatusFilter = false,
}) => {
	const form = useForm<KycFilterFormData>({
		resolver: zodResolver(kycFilterSchema),
		defaultValues: {
			status: "all",
			email: "",
			phone: "",
		},
	});

	const onSubmit = (data: KycFilterFormData) => {
		console.log("Filtres KYC soumis:", data);

		// Préparer les données pour l'API
		const filterData: any = {};

		// Statut - utiliser le defaultStatus si hideStatusFilter est true, sinon utiliser la valeur du formulaire
		if (hideStatusFilter && defaultStatus) {
			filterData.status = defaultStatus;
		} else if (data.status && data.status !== "all") {
			filterData.status = data.status;
		}

		// Email - seulement si non vide
		if (data.email && data.email.trim() !== "") {
			filterData.email = data.email.trim();
		}

		// Téléphone - seulement si non vide
		if (data.phone && data.phone.trim() !== "") {
			filterData.phone = data.phone.trim();
		}

		if (setFilterContent) {
			console.log("Filtres KYC appliqués:", filterData);
			setFilterContent(filterData);
		}
	};

	const onError = (errors: any) => {
		console.error("Erreurs de validation:", errors);
	};

	// Options pour les filtres
	const statusOptions = [
		{ value: "all", label: "Tous les statuts" },
		{ value: "PENDING", label: "En attente" },
		{ value: "IN_PROGRESS", label: "En cours" },
		{ value: "COMPLETED", label: "Approuvé" },
		{ value: "REJECTED", label: "Rejeté" },
		{ value: "RESEND_INFO", label: "Renvoi d'infos" },
	];

	// Réinitialiser tous les filtres
	const resetFilters = () => {
		form.reset({
			status: "all",
			email: "",
			phone: "",
		});
		if (setFilterContent) {
			// Si on a un statut par défaut, le garder
			if (defaultStatus) {
				setFilterContent({ status: defaultStatus });
			} else {
				setFilterContent({});
			}
		}
	};

	return (
		<div className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
			<div className="flex gap-2 items-center font-bold text-md mb-6">
				<HiFilter className="w-5 h-5" />
				<span className="text-gray-900">Filtres KYC</span>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className="w-full"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
						{/* Filtre par statut - masqué si hideStatusFilter */}
						{!hideStatusFilter && (
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-2 block">
											Statut KYC
										</FormLabel>
										<FormControl>
											<CustomSelect
												options={statusOptions}
												value={field.value}
												onChange={field.onChange}
												placeholder="Sélectionnez un statut"
												error={!!form.formState.errors.status}
											/>
										</FormControl>
										<FormMessage className="text-red-400 text-xs mt-1" />
									</FormItem>
								)}
							/>
						)}

						{/* Filtre par email */}
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-2 block">
										Email
									</FormLabel>
									<FormControl>
										<input
											type="email"
											placeholder="Rechercher par email"
											className="flex h-11 w-full items-center rounded-lg bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:shadow-md hover:shadow-md"
											{...field}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs mt-1" />
								</FormItem>
							)}
						/>

						{/* Filtre par téléphone */}
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-2 block">
										Téléphone
									</FormLabel>
									<FormControl>
										<input
											type="tel"
											placeholder="Rechercher par téléphone"
											className="flex h-11 w-full items-center rounded-lg bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:shadow-md hover:shadow-md"
											{...field}
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
								text="Réinitialiser"
								btnStyle={"outlineDark"}
								onClick={resetFilters}
							/>
						</div>

						<div className="text-sm text-gray-500">
							{filterContent &&
							Object.keys(filterContent).filter(k => k !== 'status' || !hideStatusFilter).length > 0 ? (
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

export default KycFilterForm;
