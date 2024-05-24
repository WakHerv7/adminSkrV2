"use client"

import Notification from "./components/tabs/Notification";
import Layout from "@/components/shared/Layout";
import TabsComponent from "@/components/shared/TabsComponent";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const notificationData = ['Notifications', 'Emails', 'Message Sekure'];

export default function page() {
	return (
		<Layout
			title={"Notifications"}
		>
      <section className="">
				<Tabs defaultValue="Notifications">
					<TabsComponent data={notificationData} />
					<TabsContent value="Notifications">
						<Notification />
					</TabsContent>
					<TabsContent value="Emails">
						<Notification />
					</TabsContent>
					<TabsContent value="Message Sekure">
						<Notification />
					</TabsContent>
				</Tabs>
			</section>
	  </Layout>
	);
}