import Layout from "@/components/shared/Layout";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Countries from "./components/countries/Countries";

const Settingspage = () => {
	return (
		<Layout title="Settings">
			<section>
				<Tabs defaultValue="countries">
					<div className="border-b-0 md:border-b-1">
						<TabsList className="TabsList grid grid-cols-2 md:flex mb-[200px] md:mb-0">
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="countries"
							>
								Countries
							</TabsTrigger>
						</TabsList>
					</div>
					<div className={`mt-5`}>
						<TabsContent value="countries">
							<Countries />
						</TabsContent>
					</div>
				</Tabs>
			</section>
		</Layout>
	);
};

export default Settingspage;
