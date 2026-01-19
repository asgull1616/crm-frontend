'use client'
import React, { useState } from 'react'
import { FiCalendar, FiCamera } from 'react-icons/fi'
import DatePicker from 'react-datepicker'
import TextArea from '@/components/shared/TextArea'
import Input from '@/components/shared/Input'
import { customerCreatePrivacyOptions, customerListStatusOptions, customerListTagsOptions } from '@/utils/options'
import useLocationData from '@/hooks/useLocationData'
import useDatePicker from '@/hooks/useDatePicker'
import { customerService } from '@/lib/services/customer.service'
import {
    PHONE_REGEX,
    WEBSITE_REGEX,
    VAT_REGEX,
    EMAIL_REGEX,
} from '@/utils/validators';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'




const TabProfile = ({ form, onChange, errors, setErrors }) => {
    const [selectedOption, setSelectedOption] = useState(null)
    const validateField = (field, value) => {
        // 🔴 ZORUNLU ALAN KONTROLÜ
        if (!value || value.trim() === '') {
            if (field === 'fullName') return 'İsim soyisim zorunlu';
            if (field === 'email') return 'Email zorunlu';
            if (field === 'phone') return 'Telefon zorunlu';
            return '';
        }

        switch (field) {
            case 'email':
                if (!EMAIL_REGEX.test(value)) {
                    return 'Geçerli bir email adresi giriniz';
                }
                break;

            case 'phone': {
                const digits = value.replace(/\D/g, '');
                if (digits.length < 10) {
                    return 'Telefon numarası eksik veya geçersiz';
                }
                break;
            }

            case 'website':
                if (value && !WEBSITE_REGEX.test(value)) {
                    return 'Website geçerli bir formatta değil';
                }
                break;

            case 'vatNumber':
                if (value && !VAT_REGEX.test(value)) {
                    return 'Vergi numarası 10 haneli olmalıdır';
                }
                break;

            case 'fullName':
                if (value.length > 160) {
                    return 'İsim Soyisim en fazla 160 karakter olabilir';
                }
                break;
        }

        return '';
    };


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
                    </h5>
                </div>
                {/* İSİM SOYİSİM */}
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-12"> {/* İçerideki Input bileşeni kendi col yapısını kullandığı için tam genişlik veriyoruz */}
                        <Input
                            icon="feather-user"
                            label="İsim Soyisim"
                            value={form.fullName}
                            onChange={e => {
                                const value = e.target.value;
                                onChange('fullName', value);
                                setErrors(prev => ({
                                    ...prev,
                                    fullName: value.trim() ? '' : 'İsim soyisim zorunlu',
                                }));
                            }}
                        />
                        {/* Hata mesajını Input'un hemen altına, sağ tarafa hizalamak için: */}
                        {errors.fullName && (
                            <div className="row">
                                <div className="col-lg-4"></div>
                                <div className="col-lg-8">
                                    <small className="text-danger d-block mt-1">{errors.fullName}</small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* EMAIL */}
                <div className="row mb-4 align-items-center">
                    <div className="col-lg-12">
                        <Input
                            icon="feather-mail"
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={e => {
                                const value = e.target.value;
                                onChange('email', value);
                                setErrors(prev => ({
                                    ...prev,
                                    email: value.trim()
                                        ? EMAIL_REGEX.test(value) ? '' : 'Geçerli bir email adresi giriniz'
                                        : 'Email zorunlu',
                                }));
                            }}
                        />
                        {errors.email && (
                            <div className="row">
                                <div className="col-lg-4"></div>
                                <div className="col-lg-8">
                                    <small className="text-danger d-block mt-1">{errors.email}</small>
                                </div>
                            </div>
                        )}
                    </div>
                </div>




                <div className="row mb-4 align-items-center">
                    <div className="col-lg-4">
                        <label className="fw-semibold">Telefon:</label>
                    </div>

                    <div className="col-lg-8">
                        <div className="input-group">
                            <PhoneInput
                                country="tr"
                                enableSearch
                                value={form.phone}
                                onChange={(value) => {
                                    const phone = `+${value}`;
                                    onChange('phone', phone);

                                    setErrors(prev => ({
                                        ...prev,
                                        phone: PHONE_REGEX.test(phone)
                                            ? ''
                                            : 'Telefon numarası geçerli değil',
                                    }));
                                }}
                                inputClass="form-control"
                                buttonClass="btn btn-light"
                                containerClass="w-100"
                                inputStyle={{
                                    width: '100%',
                                    height: '38px',
                                }}
                            />
                        </div>

                        {errors.phone && (
                            <small className="text-danger">{errors.phone}</small>
                        )}
                    </div>
                </div>

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
                    onChange={e => {
                        const value = e.target.value;
                        onChange('website', value);

                        setErrors(prev => ({
                            ...prev,
                            website: validateField('website', value),
                        }));
                    }}
                />
                {errors.website && (
                    <small className="text-danger">{errors.website}</small>
                )}


                <Input
                    icon="feather-dollar-sign"
                    label="VAT"
                    value={form.vatNumber}
                    onChange={e => {
                        const value = e.target.value;
                        onChange('vatNumber', value);

                        setErrors(prev => ({
                            ...prev,
                            vatNumber: validateField('vatNumber', value),
                        }));
                    }}
                />
                {errors.vatNumber && (
                    <small className="text-danger">{errors.vatNumber}</small>
                )}


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
        </div>
    )
}

export default TabProfile