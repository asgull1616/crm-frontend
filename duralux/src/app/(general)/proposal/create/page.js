'use client'
import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import ProposalEditHeader from '@/components/proposalEditCreate/ProposalEditHeader'
import ProposalCreateContent from '@/components/proposalEditCreate/ProposalCreateContent'

const ProposalSent = dynamic(
    () => import('@/components/proposalEditCreate/ProposalSent'),
    { ssr: false }
)

const page = () => {
    const submitRef = useRef(null)

    return (
        <>
            <PageHeader>
                {/* <ProposalEditHeader
                    onSubmit={() => submitRef.current?.save()}
                    onSend={() => submitRef.current?.send()}
                /> */}
            </PageHeader>

            <div className="main-content">
                <div className="row ">
                    <ProposalCreateContent
                        onRegisterSubmit={(actions) => {
                            submitRef.current = actions
                        }}
                    />
                </div>
            </div>

            <ProposalSent />
        </>
    )
}

export default page
