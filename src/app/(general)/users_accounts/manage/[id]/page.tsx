"use client"
import Layout from "@/components/shared/Layout";
import Cartes from "./components/Tabs/Cartes";
import Details from "./components/Tabs/Details";
import Transactions from "./components/Tabs/Transactions/Transactions";
import Transferts from "./components/Tabs/Transferts/Transferts";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import React from 'react'

export default function ManageUserAccount() {
    return (
      <Layout
      title={"Comptes utilisateurs"}
      backLink={'/users_accounts'}
      >
        <>
          <Tabs defaultValue="Details" className="w-full">
            <div className="border-b-1">
            <TabsList className="TabsList">
              <TabsTrigger className="TabsTrigger" value="Details">Details</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="Cartes">Cartes</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="Transferts">Transferts</TabsTrigger>
              <TabsTrigger className="TabsTrigger" value="Transactions">Transactions</TabsTrigger>
            </TabsList>
            </div>
            <div className={`mt-5`}>
              <TabsContent value="Details">
                <Details/>
              </TabsContent>
              <TabsContent value="Cartes">
                <Cartes />
              </TabsContent>
              <TabsContent value="Transferts">
                <Transferts />
              </TabsContent>
              <TabsContent value="Transactions">
                <Transactions />
              </TabsContent>
            </div>
          </Tabs>
        </>
      </Layout>
    )
}
