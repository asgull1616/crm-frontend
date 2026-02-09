'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import CardHeader from '@/components/shared/CardHeader'
import { salesPipelineChartOption } from '@/utils/chartsLogic/salesPipelineChartOption'
import { salesPipelineData } from '@/utils/fackData/salesPipelineData'
import CardLoader from '@/components/shared/CardLoader'
import useCardTitleActions from '@/hooks/useCardTitleActions'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const SalesPipelineChart = ({ isFooterShow }) => {
    const [activeTab, setActiveTab] = useState("Müşteriler")
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) return null;

    return (
        <div className="col-xxl-7"> {/* Yanına Trend Chart gelebilmesi için alanı biraz daralttık */}
            <div className={`card stretch stretch-full border-0 shadow-sm ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={"Satış Endeksi"} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />
                <div className="card-body custom-card-action">
                    {/* Tab yapısını daha temiz ve modern hale getirdik */}
                    <ul className="nav mb-4 gap-3 sales-pipeline-tabs border-0" role="tablist">
                        {
                            salesPipelineData.map(({ deals, name, revenue }) => {
                                return (
                                    <li key={name} className="nav-item" role="presentation">
                                        <a href="#"
                                            onClick={(e) => { e.preventDefault(); setActiveTab(name); }}
                                            className={`nav-link text-start rounded-3 border-0 ${name === activeTab ? "bg-soft-primary" : "bg-light"}`}
                                            role="tab"
                                            style={{ minWidth: '120px', transition: 'all 0.3s' }}
                                        >
                                            <span className="text-muted fs-11 text-uppercase fw-semibold d-block">{name}</span>
                                            <span className="amount fs-18 fw-bold my-1 d-block text-dark">${revenue}</span>
                                            <span className="deals fs-12 text-muted d-block">{deals} Anlaşmalar</span>
                                        </a>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="tab-content">
                        {
                            salesPipelineData.map(({ name, data, chartColors }) =>
                                <TabCard key={name} activeTab={activeTab} name={name} data={data} chartColors={chartColors} />
                            )
                        }
                    </div>
                    <CardLoader refreshKey={refreshKey} />
                </div>
                {
                    isFooterShow &&
                    <div className="card-footer d-flex align-items-center justify-content-between p-4 bg-transparent border-top border-gray-5">
                        <div className="text-center flex-fill">
                            <p className="fs-11 fw-bold text-uppercase text-muted mb-1">Mevcut</p>
                            <h2 className="fs-18 fw-bold mb-0 text-primary">$65,658</h2>
                        </div>
                        <div className="vr mx-3 text-gray-300"></div>
                        <div className="text-center flex-fill">
                            <p className="fs-11 fw-bold text-uppercase text-muted mb-1">Gecikmiş</p>
                            <h2 className="fs-18 fw-bold mb-0 text-danger">$3,454</h2>
                        </div>
                        <div className="vr mx-3 text-gray-300"></div>
                        <div className="text-center flex-fill">
                            <p className="fs-11 fw-bold text-uppercase text-muted mb-1">Ekstra</p>
                            <h2 className="fs-18 fw-bold mb-0 text-success">$20,478</h2>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default SalesPipelineChart

const TabCard = ({ name, activeTab, data, chartColors }) => {
    const series = { name, data }
    const copyData = [...data]
    copyData.sort((a, b) => b - a);
    const maxValue = copyData[0];

    // Önemli: salesPipelineChartOption fonksiyonunun içinde 
    // plotOptions: { bar: { borderRadius: 6 } } olduğundan emin ol kanka.
    const chartOption = salesPipelineChartOption(series, chartColors, maxValue)
    
    return (
        <div className={`tab-pane fade show ${name === activeTab ? "active" : ""}`} id={name} role="tabpanel">
            <ReactApexChart
                type='bar'
                options={chartOption}
                series={chartOption?.series}
                height={320}
            />
        </div>
    )
}