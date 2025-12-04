import Layout from "@/components/shared/Layout";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CSP from "./components/CSP/CSP";

const page = () => {
	return (
		<Layout title="Manage country">
			<section>
				<Tabs defaultValue="csp">
					<div className="border-b-0 md:border-b-1">
						<TabsList className="TabsList grid grid-cols-2 md:flex md:justify-start mb-[200px] md:mb-0">
							<TabsTrigger
								className="TabsTrigger border-b-1 md:border-b-0"
								value="csp"
							>
								Country serivce provider
							</TabsTrigger>
						</TabsList>
					</div>

					<div className={`mt-5`}>
						<TabsContent value="csp">
							<CSP />
						</TabsContent>
					</div>
				</Tabs>
			</section>
		</Layout>
	);
};

export default page;
