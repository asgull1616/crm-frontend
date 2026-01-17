'use client'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import TextArea from '@/components/shared/TextArea'
import Input from '@/components/shared/Input'
import {
  customerListStatusOptions,
  customerListTagsOptions
} from '@/utils/options'
import useLocationData from '@/hooks/useLocationData'
import useDatePicker from '@/hooks/useDatePicker'
import { customerService } from '@/lib/services/customer.service'

const TabProfile = ({ form, onChange }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker()
  const { countries, states, cities, loading, error, fetchStates, fetchCities } = useLocationData()

  return (
    <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
      <div className="card-body personal-info">
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h5 className="fw-bold mb-0 me-4">
            <span className="d-block mb-2">Müşteri Bilgileri:</span>
          </h5>
        </div>

        <Input
          icon="feather-user"
          label="İsim Soyisim"
          value={form.name}
          onChange={e => onChange('name', e.target.value)}
        />

        <Input
          icon="feather-mail"
          label="Email"
          type="email"
          value={form.email}
          onChange={e => onChange('email', e.target.value)}
        />

        <Input
          icon="feather-link-2"
          label="Kullanıcı Adı"
          value={form.username}
          onChange={e => onChange('username', e.target.value)}
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
          icon="feather-briefcase"
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
          value={form.vat}
          onChange={e => onChange('vat', e.target.value)}
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
    </div>
  )
}

export default TabProfile
