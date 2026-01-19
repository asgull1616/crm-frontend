'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import ProposalEditContent from '@/components/proposalEditCreate/ProposalEditContent'
import ProposalEditHeader from '@/components/proposalEditCreate/ProposalEditHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'

// Client-side bileşenleri ssr: false ile yükleyerek hidrasyon hatalarını önlüyoruz
const ProposalSent = dynamic(() => import('@/components/proposalEditCreate/ProposalSent'), { ssr: false })

/**
 * Proposal Edit Page
 * Next.js, [id] klasörü sayesinde URL'deki UUID'yi params objesi içinde buraya iletir.
 */
const Page = ({ params }) => {
    // URL'den gelen dinamik ID (Örn: 9346a828-6a9d...)
    const { id } = params;

    return (
        <>
            {/* Sayfa başlığı ve üst aksiyon butonlarını içeren header */}
            <PageHeader>
                <ProposalEditHeader />
            </PageHeader>

            <div className='main-content'>
                <div className='row'>
                    {/* Düzenleme formunun ana içeriği. 
                      proposalId prop'u sayesinde bileşen içinde useEffect ile veri çekilebilir.
                    */}
                    <div className="col-12">
                        <ProposalEditContent proposalId={id} />
                    </div>
                </div>
            </div>

            {/* Teklif gönderildi onay modalı veya bileşeni */}
            <ProposalSent />
        </>
    )
}

export default Page