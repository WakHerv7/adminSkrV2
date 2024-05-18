import React from 'react'
import Main from './Main'
import Side from './Side'
import Layout from '@/components/shared/Layout'

export default function Page() {
  return (
    <Layout 
    title="Details Carte"
    backLink='/cards'>
        <section className="flex flex-between items-start gap-5 mb-6">
        <Side/>
        <Main/>
        </section>
    </Layout>
  )
}
