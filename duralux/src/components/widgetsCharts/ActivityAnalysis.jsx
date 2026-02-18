'use client'
import React from 'react'
import CardHeader from '@/components/shared/CardHeader'
import dynamic from 'next/dynamic'

const WorldMap = dynamic(() => import('./WorldMap'), { ssr: false });

const ActivityAnalysis = () => {
    return (
        <div className="col-xxl-12">
            <div className="card stretch stretch-full border-0 shadow-sm">
                <CardHeader title="Faaliyet ve Coğrafi Dağılım" />
                <div className="card-body">
                    <div className="row align-items-center">
                        <div className="col-md-5">
                            <h5 className="fs-14 fw-bold mb-4">Popüler Bölgeler</h5>
                            <div className="mb-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fs-12 fw-medium">Türkiye</span>
                                    <span className="fs-12 text-muted">85%</span>
                                </div>
                                <div className="progress style-1" style={{height: '6px'}}>
                                    <div className="progress-bar bg-primary" style={{width: '85%'}}></div>
                                </div>
                            </div>
                            <div className="mb-0">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="fs-12 fw-medium">Avrupa</span>
                                    <span className="fs-12 text-muted">5%</span>
                                </div>
                                <div className="progress style-1" style={{height: '6px'}}>
                                    <div className="progress-bar bg-primary" style={{width: '5%'}}></div>
                                </div>
                            <div className="mb-4">
                              <div className="d-flex justify-content-between mb-2">
                                    <span className="fs-12 fw-medium">Amerika</span>
                                    <span className="fs-12 text-muted">5%</span>
                              </div>
                                <div className="progress style-1" style={{height: '6px'}}>
                                    <div className="progress-bar bg-primary" style={{width: '5%'}}></div>
                                </div>
                            </div>
                            <div className="mb-4">
                              <div className="d-flex justify-content-between mb-2">
                                    <span className="fs-12 fw-medium">Asya</span>
                                    <span className="fs-12 text-muted">5%</span>
                              </div>
                                <div className="progress style-1" style={{height: '6px'}}>
                                    <div className="progress-bar bg-primary" style={{width: '5%'}}></div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="col-md-7">
                            <div className="bg-light rounded-4 p-3 overflow-hidden">
                                <WorldMap />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityAnalysis