'use client'
import React, { useState } from 'react'
import useLocationData from '@/hooks/useLocationData'
import Input from '@/components/shared/Input'
import TextArea from '@/components/shared/TextArea'
import SelectDropdown from '@/components/shared/SelectDropdown'

const TabBilling = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { countries, states, cities, loading, error, fetchStates, fetchCities, } = useLocationData();
    return (
        <div className="tab-pane fade" id="billingTab" role="tabpanel">
            <div className="card-body pass-info">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0 me-4">
                        <span className="d-block mb-2">Fatura Adresi:</span>
                        <span className="fs-12 fw-normal text-muted text-truncate-1-line">Fatura adresinizi girin.</span>
                    </h5>
                    <a href="#" className="btn btn-sm btn-light-brand">Müşteri Bilgileriyle Aynı</a>
                </div>

                <TextArea
                    icon="feather-map-pin"
                    label={"Adres"}
                    labelId={"addressInput"}
                    placeholder={"Adres"}
                />

                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Ülke: </label>
                    </div>
                    <div className="col-lg-8">
                        <SelectDropdown
                            options={countries}
                            selectedOption={selectedOption}
                            defaultSelect="usa"
                            onSelectOption={(option) => {
                                fetchStates(option.label);
                                fetchCities(option.label);
                                setSelectedOption(option)
                            }}
                        />
                    </div>
                </div>
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Şehir: </label>
                    </div>
                    <div className="col-lg-8">
                        <SelectDropdown
                            options={cities}
                            selectedOption={selectedOption}
                            defaultSelect="new-york"
                            onSelectOption={(option) => setSelectedOption(option)}
                        />
                    </div>
                </div>
            </div>
            <hr className="my-0" />
            <div className="card-body pass-info">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0 me-4">
                        <span className="d-block mb-2">Teslimat Adresi</span>
                        {/* <span className="fs-12 fw-normal text-muted text-truncate-1-line">A shipping address is the address to which a purchased item or service is to be delivered.</span> */}
                    </h5>
                    <a href="#" className="btn btn-sm btn-light-brand">Fatura adresini kopyala</a>
                </div>
                <TextArea
                    icon="feather-map-pin"
                    label={"Adres"}
                    labelId={"addressInput"}
                    placeholder={"Adres"}
                />
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Ülke: </label>
                    </div>
                    <div className="col-lg-8">
                        <SelectDropdown
                            options={countries}
                            selectedOption={selectedOption}
                            defaultSelect="usa"
                            onSelectOption={(option) => {
                                fetchStates(option.label);
                                fetchCities(option.label);
                                setSelectedOption(option)
                            }}
                        />
                    </div>
                </div>
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Şehir: </label>
                    </div>
                    <div className="col-lg-8">
                        <SelectDropdown
                            options={cities}
                            selectedOption={selectedOption}
                            defaultSelect="new-york"
                            onSelectOption={(option) => setSelectedOption(option)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TabBilling