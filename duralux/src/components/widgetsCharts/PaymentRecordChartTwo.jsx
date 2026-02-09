'use client'
import React, { useEffect, useState, useMemo } from 'react'
import CardHeader from '@/components/shared/CardHeader';
import { paymentRecordChartOption } from '@/utils/chartsLogic/paymentRecordChartOption';
import useCardTitleActions from '@/hooks/useCardTitleActions';
import CardLoader from '@/components/shared/CardLoader';
import dynamic from 'next/dynamic'
import { proposalService } from "@/lib/services/proposal.service";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

const PaymentRecordChartTwo = () => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();
    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                setLoading(true);
                const res = await proposalService.list({ page: 1, limit: 100 }); 
                const items = res?.data?.items || [];

                const customerMap = {};
                let runningTotal = 0;

                items.forEach(item => {
                    if (!item.validUntil) return;
                    const date = new Date(item.validUntil);
                    const monthIndex = date.getMonth();
                    const name = item.customerName || "Tanımsız Müşteri";
                    const amount = Number(item.totalAmount) || 0;

                    if (!customerMap[name]) {
                        customerMap[name] = new Array(12).fill(0);
                    }
                    customerMap[name][monthIndex] += amount;
                    runningTotal += amount;
                });

                const finalSeries = Object.keys(customerMap).map(name => ({
                    name: name,
                    data: customerMap[name]
                }));

                setSeries(finalSeries);
                setTotalAmount(runningTotal);
            } catch (err) {
                console.error("Grafik hatası:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAndProcessData();
    }, [refreshKey]);

    const dynamicOptions = useMemo(() => {
        const base = paymentRecordChartOption();
        
        // Net geçişler için kontrastı yüksek kurumsal palet
        const mainColors = ['#0F172A', '#2563EB', '#059669', '#EA580C', '#7C3AED', '#DB2777'];
        const gradientToColors = ['#334155', '#60A5FA', '#34D399', '#FB923C', '#A78BFA', '#F472B6'];

        return {
            ...base,
            chart: {
                ...base.chart,
                type: 'bar',
                stacked: true,
                fontFamily: 'Public Sans, sans-serif',
                toolbar: { show: false },
                animations: { 
                    enabled: true, 
                    easing: 'easeinout', 
                    speed: 800,
                    animateGradually: { enabled: true, delay: 150 }
                }
            },
            colors: mainColors,
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: "vertical",
                    shadeIntensity: 0.5,
                    gradientToColors: gradientToColors, // Üst kısımların parlamasını sağlar
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 0.95,
                    stops: [0, 100]
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '50%',
                    borderRadius: 4, 
                    dataLabels: {
                        total: {
                            enabled: true,
                            offsetY: -10,
                            style: { fontSize: '12px', fontWeight: 800, color: '#1E293B' },
                            formatter: (val) => val > 0 ? (val >= 1000 ? (val / 1000).toFixed(1) + 'k' : '₺' + val) : ''
                        }
                    }
                },
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['#ffffff'] // Katmanlar arasındaki farkı netleştiren beyaz çizgi
            },
            dataLabels: { enabled: false },
            xaxis: {
                categories: MONTHS,
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: {
                    style: { colors: '#64748B', fontSize: '11px', fontWeight: 600 }
                }
            },
            yaxis: {
                forceNiceScale: true,
                labels: {
                    style: { colors: '#64748B', fontSize: '11px' },
                    formatter: (val) => val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : (val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val)
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'center',
                fontSize: '13px',
                fontWeight: 600,
                markers: { radius: 12, width: 12, height: 12 },
                itemMargin: { horizontal: 15, vertical: 8 }
            },
            grid: {
                borderColor: '#F1F5F9',
                strokeDashArray: 4,
            },
            tooltip: {
                theme: 'light',
                shared: true,
                intersect: false, // Hatanın çözümü için burası false kalmalı
                y: {
                    formatter: (val) => "₺" + val.toLocaleString('tr-TR'),
                }
            }
        };
    }, [series]);

    if (isRemoved) return null;

    return (
        <div className="col-xxl-8 col-lg-10 mx-auto">
            <div className={`card border-0 shadow-sm ${isExpanded ? "card-expand" : ""}`}>
                <CardHeader 
                    title={<span className="fw-bold text-dark fs-16">Kurumsal Teklif Analizi</span>} 
                    refresh={handleRefresh} 
                    remove={handleDelete} 
                    expanded={handleExpand} 
                />
                
                <div className="card-body p-4">
                    {series.length > 0 ? (
                        <div className="position-relative">
                            <ReactApexChart options={dynamicOptions} series={series} type="bar" height={420} />
                        </div>
                    ) : (
                        <div className="d-flex flex-column align-items-center justify-content-center text-muted" style={{height: 400}}>
                            {loading ? <div className="spinner-border text-primary mb-3"></div> : "Görüntülenecek veri bulunamadı."}
                        </div>
                    )}

                    <div className="mt-5 pt-4 border-top">
                        <div className="row align-items-center">
                            <div className="col-sm-7 text-center text-sm-start">
                                <p className="fs-11 fw-bold text-uppercase text-muted mb-1" style={{letterSpacing: '0.05em'}}>Konsolide Portföy Değeri</p>
                                <h2 className="fw-bold text-dark mb-0">
                                    ₺{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                                </h2>
                            </div>
                            <div className="col-sm-5 text-center text-sm-end mt-3 mt-sm-0">
                                <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fs-12">
                                    <i className="feather-pie-chart me-1"></i> Güncel Dağılım
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <CardLoader refreshKey={loading || refreshKey} />
            </div>
        </div>
    )
}

export default PaymentRecordChartTwo;