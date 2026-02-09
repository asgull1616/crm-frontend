'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import CardHeader from '@/components/shared/CardHeader'
import { trendAnalysisChartOption } from '@/utils/chartsLogic/trendAnalysisChartOption'
import useCardTitleActions from '@/hooks/useCardTitleActions'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const TrendAnalysisChart = () => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    // Örnek veri (Tarih seçici değiştikçe bu veri backend'den gelecek)
    const series = [
        { name: 'Hasılat', data: [31, 40, 28, 51, 42, 109, 100] },
        { name: 'Anlaşmalar', data: [11, 32, 45, 32, 34, 52, 41] }
    ]

    if (isRemoved) return null;

    return (
        <div className="col-xxl-5"> {/* Sales Pipeline (7) + Trend (5) = 12 (Tam Satır) */}
            <div className={`card stretch stretch-full border-0 shadow-sm ${isExpanded ? "card-expand" : ""}`}>
                <CardHeader 
                    title={"Tarih Aralığına Göre Trend Analizi"} 
                    refresh={handleRefresh} 
                    remove={handleDelete} 
                    expanded={handleExpand} 
                />
                <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between mb-4">
                        <div>
                            <h4 className="fs-20 fw-bold mb-1">$42,580</h4>
                            <span className="text-success fs-12 fw-medium">
                                <i className="fi fi-rr-arrow-trend-up me-1"></i> +12.5% 
                                <span className="text-muted fw-normal ms-1">son döneme kıyasla</span>
                            </span>
                        </div>
                    </div>
                    
                    <ReactApexChart
                        options={trendAnalysisChartOption()}
                        series={series}
                        type="area"
                        height={320}
                    />
                </div>
            </div>
        </div>
    )
}

export default TrendAnalysisChart