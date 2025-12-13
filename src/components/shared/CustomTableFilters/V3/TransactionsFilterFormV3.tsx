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
import { ChevronDown, Check, RefreshCw } from "lucide-react";
import CButton from "../../CButton";

const transactionFilterSchema = z.object({
	type: z.enum(
		[
			"PAYMENT",
			"WITHDRAWAL",
			"TRANSFER",
			"PURCHASE",
			"INITIAL_LOAD",
			"TOPUP",
			"all",
		],
		{
			required_error: "Sélectionnez un type de transaction",
		}
	),
	status: z.enum(["PENDING", "SUCCESS", "FAILED", "all"], {
		required_error: "Sélectionnez un statut de transaction",
	}),
});

type TransactionFilterFormData = z.infer<typeof transactionFilterSchema>;

interface TransactionFilterFormProps {
	filterContent?: any;
	setFilterContent?: (data?: any) => void;
	onApplyFilters?: (filters: any) => void;
	onResetFilters?: () => void;
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
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
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

const TransactionsFilterFormV3: React.FC<TransactionFilterFormProps> = ({
	filterContent,
	setFilterContent,
	onApplyFilters,
	onResetFilters,
}) => {
	const form = useForm<TransactionFilterFormData>({
		resolver: zodResolver(transactionFilterSchema),
		defaultValues: {
			type: "all",
			status: "all",
		},
	});

	const onSubmit = (data: TransactionFilterFormData) => {
		console.log("Filtres transaction soumis:", data);

		// Préparer les données pour l'API
		const filterData: any = {};

		// Type - seulement si différent de "all"
		if (data.type && data.type !== "all") {
			filterData.type = data.type;
		}

		// Statut - seulement si différent de "all"
		if (data.status && data.status !== "all") {
			filterData.status = data.status;
		}

		if (setFilterContent) {
			console.log("Filtres appliqués:", filterData);
			setFilterContent(filterData);
		}

		if (onApplyFilters) {
			onApplyFilters(filterData);
		}
	};

	const onError = (errors: any) => {
		console.error("Erreurs de validation:", errors);
	};

	// Options pour les filtres
	const typeOptions = [
		{ value: "all", label: "Tous les types" },
		{ value: "PAYMENT", label: "Paiement" },
		{ value: "WITHDRAWAL", label: "Retrait" },
		{ value: "TRANSFER", label: "Transfert" },
		{ value: "PURCHASE", label: "Achat" },
		{ value: "INITIAL_LOAD", label: "Chargement initial" },
		{ value: "TOPUP", label: "Rechargement" },
	];

	const statusOptions = [
		{ value: "all", label: "Tous les statuts" },
		{ value: "PENDING", label: "En attente" },
		{ value: "SUCCESS", label: "Réussi" },
		{ value: "FAILED", label: "Échoué" },
	];

	// Réinitialiser tous les filtres
	const resetFilters = () => {
		form.reset({
			type: "all",
			status: "all",
		});

		if (setFilterContent) {
			setFilterContent({});
		}

		if (onResetFilters) {
			onResetFilters();
		}
	};

	return (
		<div className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
			<div className="flex gap-2 items-center font-bold text-md mb-6">
				<HiFilter className="w-5 h-5" />
				<span className="text-gray-900">Filtres Transactions</span>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit, onError)}
					className="w-full"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						{/* Filtre par type */}
						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-2 block">
										Type de transaction
									</FormLabel>
									<FormControl>
										<CustomSelect
											options={typeOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Sélectionnez un type"
											error={!!form.formState.errors.type}
										/>
									</FormControl>
									<FormMessage className="text-red-400 text-xs mt-1" />
								</FormItem>
							)}
						/>

						{/* Filtre par statut */}
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-900 text-sm font-semibold tracking-tight mb-2 block">
										Statut
									</FormLabel>
									<FormControl>
										<CustomSelect
											options={statusOptions}
											value={field.value}
											onChange={field.onChange}
											placeholder="Sélectionnez un statut"
											error={
												!!form.formState.errors.status
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
								text="Réinitialiser"
								btnStyle={"outlineDark"}
								onClick={resetFilters}
								icon={<RefreshCw className="w-4 h-4" />}
							/>
						</div>

						<div className="text-sm text-gray-500">
							{filterContent &&
							Object.keys(filterContent).length > 0 ? (
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 bg-green-500 rounded-full"></span>
									<span>Filtres actifs</span>
									<span className="ml-2 px-2 py-1 bg-gray-100 rounded text-xs">
										{Object.keys(filterContent).length}{" "}
										filtre(s)
									</span>
								</div>
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

export default TransactionsFilterFormV3;
