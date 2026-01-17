'use client'
import React, { useState } from 'react'
import { FiCalendar, FiCamera } from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import TextArea from '@/components/shared/TextArea'
import SelectDropdown from '@/components/shared/SelectDropdown'
import Input from '@/components/shared/Input'
import { timezonesData } from '@/utils/fackData/timeZonesData'
import { currencyOptionsData } from '@/utils/fackData/currencyOptionsData'
import { languagesData } from '@/utils/fackData/languagesData'
import MultiSelectTags from '@/components/shared/MultiSelectTags'
import { customerCreatePrivacyOptions, customerListStatusOptions, customerListTagsOptions } from '@/utils/options'
import useLocationData from '@/hooks/useLocationData'
import useDatePicker from '@/hooks/useDatePicker'
import { customerService } from '@/lib/services/customer.service'


const TabProfile = ({form, onChange}) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker();
    const { countries, states, cities, loading, error, fetchStates, fetchCities, } = useLocationData();
    const group = customerListTagsOptions
    const status = customerListStatusOptions

    return (
        <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
            <div className="card-body personal-info">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0 me-4">
                        <span className="d-block mb-2">Müşteri Bilgileri:</span>
                        {/* <span className="fs-12 fw-normal text-muted text-truncate-1-line">Following information is publicly displayed, be careful! </span> */}
                    </h5>
                    <a href="#" className="btn btn-sm btn-light-brand">Ekleyin</a>
                </div>
                {/* <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Resim: </label>
                    </div>
                    <div className="col-lg-8">
                        <div className="mb-4 mb-md-0 d-flex gap-4 your-brand">
                            <label htmlFor='img' className="wd-100 ht-100 position-relative overflow-hidden border border-gray-2 rounded">
                                <img src="/images/avatar/1.png" className="upload-pic img-fluid rounded h-100 w-100" alt="" />
                                <div className="position-absolute start-50 top-50 end-0 bottom-0 translate-middle h-100 w-100 hstack align-items-center justify-content-center c-pointer upload-button">
                                    <i aria-hidden="true" className='camera-icon'><FiCamera /></i>
                                </div>
                                <input className="file-upload" type="file" accept="image/*" id='img' hidden />
                            </label>
                            <div className="d-flex flex-column gap-1">
                                <div className="fs-11 text-gray-500 mt-2"># Upload your prifile</div>
                                <div className="fs-11 text-gray-500"># Avatar size 150x150</div>
                                <div className="fs-11 text-gray-500"># Max upload size 2mb</div>
                                <div className="fs-11 text-gray-500"># Allowed file types: png, jpg, jpeg</div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <Input
                    icon="feather-user"
                    label="İsim Soyisim"
                    value={form.fullName}
                    onChange={e => onChange('fullName', e.target.value)}
                />

                <Input
                    icon="feather-mail"
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={e => onChange('email', e.target.value)}
                />

                <Input
                    icon="feather-phone"
                    label="Telefon"
                    value={form.phone}
                    onChange={e => onChange('phone', e.target.value)}
                />

                <Input
                    icon="feather-compass"
                    label="Şirket"
                    value={form.companyName}
                    onChange={e => onChange('companyName', e.target.value)}
                />

                <Input
  label="Unvan"
  value={form.designation}
  onChange={e => onChange('designation', e.target.value)}
/>

                <Input
                    icon="feather-link"
                    label="Website"
                    value={form.website}
                    onChange={e => onChange('website', e.target.value)}
                />

                <Input
                    icon="feather-dollar-sign"
                    label="VAT"
                    value={form.vatNumber}
                    onChange={e => onChange('vatNumber', e.target.value)}
                />

                <TextArea
                    icon="feather-map-pin"
                    label="Adres"
                    value={form.address}
                    onChange={e => onChange('address', e.target.value)}
                />

                <TextArea
                    icon="feather-type"
                    label="Tanım"
                    row="5"
                    value={form.description}
                    onChange={e => onChange('description', e.target.value)}
                />
            </div>
            <hr className="my-0" />
            {/* <div className="card-body additional-info">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0 me-4">
                        <span className="d-block mb-2">Additional Information:</span>
                        <span className="fs-12 fw-normal text-muted text-truncate-1-line">Communication details in case we want to connect with you.</span>
                    </h5>
                    <a href="#" className="btn btn-sm btn-light-brand">Add New</a>
                </div>
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label htmlFor="dateofBirth" className="fw-semibold">Date of Birth: </label>
                    </div>
                    <div className="col-lg-8">
                        <div className="input-group flex-nowrap">
                            <div className="input-group-text"><FiCalendar size={16} /></div>
                            <div className='w-100 d-flex date  rounded-0' style={{ flexBasis: "95%" }}>
                                <DatePicker
                                    placeholderText='Pick date of birth'
                                    selected={startDate}
                                    showPopperArrow={false}
                                    onChange={(date) => setStartDate(date)}
                                    className='form-control rounded-0'
                                    popperPlacement="bottom-start"
                                    calendarContainer={({ children }) => (
                                        <div className='bg-white react-datepicker'>
                                            {children}
                                            {renderFooter("start")}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Country: </label>
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
                        <label className="fw-semibold">State: </label>
                    </div>
                    <div className="col-lg-8">
                        <SelectDropdown
                            options={states}
                            selectedOption={selectedOption}
                            defaultSelect={"new-york"}
                            onSelectOption={(option) => setSelectedOption(option)}
                        />
                    </div>
                </div>
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">City: </label>
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
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Time Zone: </label>
                    </div>
                    <div className="col-lg-8">
                        <SelectDropdown
                            options={timezonesData}
                            selectedOption={selectedOption}
                            defaultSelect="Western Europe Time"
                            onSelectOption={(option) => setSelectedOption(option)}
                        />
                    </div>
                </div>
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Languages: </label>
                    </div>
                    <div className="col-lg-8">
                        <MultiSelectTags
                            options={languagesData}
                            defaultSelect={[languagesData[25], languagesData[10], languagesData[45]]}
                        />
                    </div>
                </div>
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Currency: </label>
                    </div>
                    <div className="col-lg-8">
                        <SelectDropdown
                            options={currencyOptionsData}
                            selectedOption={selectedOption}
                            defaultSelect="usd"
                            onSelectOption={(option) => setSelectedOption(option)}
                        />
                    </div>
                </div>
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label htmlFor="Input" className="fw-semibold">Group: </label>
                    </div>
                    <div className="col-lg-8">
                        <MultiSelectTags
                            options={group}
                            defaultSelect={[group[4], group[2]]}
                        />
                    </div>
                </div>
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Status: </label>
                    </div>
                    <div className="col-lg-8">
                        <SelectDropdown
                            options={status}
                            selectedOption={selectedOption}
                            defaultSelect="active"
                            onSelectOption={(option) => setSelectedOption(option)}
                        />
                    </div>
                </div>
                <div className="row mb-0 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Privacy: </label>
                    </div>
                    <div className="col-lg-8">
                        <SelectDropdown
                            options={customerCreatePrivacyOptions}
                            selectedOption={selectedOption}
                            defaultSelect="everyone"
                            onSelectOption={(option) => setSelectedOption(option)}
                        />
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default TabProfile