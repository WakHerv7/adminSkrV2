import Layout from "@/components/shared/Layout";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Countries from "./components/countries/Countries";
import ServiceProvider from "./components/serviceProvider/ServiceProvider";
import PaymentProvider from "./components/paymentProvider/PaymentProvider";
import Service_management from "./components/service_management/Service_management";

const Settingspage = () => {
	return (
		<Layout title="Settings">
			<section>
				<Tabs defaultValue="countries">
					<div className="border-b-0 md:border-b-1">
						<TabsList className="TabsList grid grid-cols-2 md:flex md:justify-start mb-[200px] md:mb-0">
							<TabsList>
								<TabsTrigger
									className="TabsTrigger border-b-1 md:border-b-0"
									value="countries"
								>
									Countries
								</TabsTrigger>

								<TabsTrigger
									className="TabsTrigger border-b-1 md:border-b-0"
									value="service-providers"
								>
									Service Providers
								</TabsTrigger>

								<TabsTrigger
									className="TabsTrigger border-b-1 md:border-b-0"
									value="payment-providers"
								>
									Payment Providers
								</TabsTrigger>

								<TabsTrigger
									className="TabsTrigger border-b-1 md:border-b-0"
									value="service"
								>
									services
								</TabsTrigger>
							</TabsList>
						</TabsList>
					</div>
					<div className={`mt-5`}>
						<TabsContent value="countries">
							<Countries />
						</TabsContent>

						<TabsContent value="service-providers">
							<ServiceProvider />
						</TabsContent>

						<TabsContent value="payment-providers">
							<PaymentProvider />
						</TabsContent>

						<TabsContent value="service">
							<Service_management />
						</TabsContent>
					</div>
				</Tabs>
			</section>
		</Layout>
	);
};

export default Settingspage;
