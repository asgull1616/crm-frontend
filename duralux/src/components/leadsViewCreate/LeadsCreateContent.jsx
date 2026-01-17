'use client'
import React, { useState } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import TextArea from '@/components/shared/TextArea'
import { customerListTagsOptions, leadsGroupsOptions, leadsSourceOptions, leadsStatusOptions, propsalVisibilityOptions, taskAssigneeOptions } from '@/utils/options'
import useLocationData from '@/hooks/useLocationData'
import { currencyOptionsData } from '@/utils/fackData/currencyOptionsData'
import { languagesData } from '@/utils/fackData/languagesData'
import { timezonesData } from '@/utils/fackData/timeZonesData'
import Loading from '@/components/shared/Loading'
import Input from '@/components/shared/Input'
import MultiSelectImg from '@/components/shared/MultiSelectImg' 
import MultiSelectTags from '@/components/shared/MultiSelectTags'



const LeadsCreateContent = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { countries, states, cities, loading, error, fetchStates, fetchCities, } = useLocationData();
    const leadsTags = customerListTagsOptions
    return (
        <>
            {loading && <Loading />}
            <div className="col-lg-12">
                <div className="card stretch stretch-full">
                    <div className="card-body lead-status">
                        <div className="mb-5 d-flex align-items-center justify-content-between">
                            <h5 className="fw-bold mb-0 me-4">
                                <span className="d-block mb-2">Ekip Üyesi Ekle :</span>
                            </h5>
                        </div>
                        <div className="row">
                            <div className="col-lg-4 mb-4">
                                <label className="form-label">Rol</label>
                                <SelectDropdown
                                    options={leadsStatusOptions}
                                    selectedOption={selectedOption}
                                    defaultSelect="new"
                                    onSelectOption={(option) => setSelectedOption(option)}
                                />
                            </div>
                        </div>
                    </div>
                    <hr className="mt-0" />
                    <div className="card-body general-info">
                        <div className="mb-5 d-flex align-items-center justify-content-between">
                            <h5 className="fw-bold mb-0 me-4">
                                <span className="d-block mb-2">Genel Bilgi :</span>
                                <span className="fs-12 fw-normal text-muted text-truncate-1-line">Ekip üyesi için genel bilgiler</span>
                            </h5>
                        </div>
                        <Input
                            icon='feather-mail'
                            label={"Email"}
                            labelId={"emailInput"}
                            placeholder={"Email"}
                            name={"email"}
                            type={"email"}
                        />
                        <Input
                            icon='feather-link-2'
                            label={"Kullanıcı Adı"}
                            labelId={"usernameInput"}
                            placeholder={"Kullanıcı Adı"}
                            name={"username"}
                        />
                        <Input
                            icon='feather-phone'
                            label={"Telefon"}
                            labelId={"phoneInput"}
                            placeholder={"Telefon"}
                            name={"phone"}
                        />
                        <Input
                            icon='feather-briefcases'
                            label={"Şifre"}
                            labelId={"passwordInput"}
                            placeholder={"Şifre"}
                            name={"password"}
                        />
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default LeadsCreateContent