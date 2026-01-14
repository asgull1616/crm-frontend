'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import TabProfile from './TabProfile'
import TabPassword from './TabPassword'
import TabBilling from './TabBilling'
import TabNotificationsContent from '../customersView/TabNotificationsContent'
import TabConnections from '../customersView/TabConnections'
import TabBillingContent from '../customersView/TabBillingContent'
import CustomersCreateHeader from './CustomersCreateHeader'
import { customerService } from '@/lib/services/customer.service'


const CustomerCreateContent = () => {
    const router = useRouter()

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        designation: '',
        website: '',
        vatNumber: '',
        address: '',
        description: '',
        status: 'NEW'
    })

    const onChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }
    

    const onSubmit = async () => {
  console.log('🧪 FORM STATE:', form);

  if (!form.fullName || form.fullName.trim() === '') {
    alert('FULL NAME BOŞ – BACKEND 400 ATMASI NORMAL');
    return;
  }

  const cleanedForm = Object.fromEntries(
    Object.entries(form).filter(
      ([_, value]) => value !== '' && value !== null
    )
  );

  console.log('🧼 CLEANED FORM:', cleanedForm);

  try {
    await customerService.create(cleanedForm);
    router.push('/customers/list');
  } catch (e) {
    console.error(e);
    alert('Müşteri oluşturulamadı');
  }
};



    return (
        <>
            <CustomersCreateHeader onSubmit={onSubmit} />

            <div className="col-lg-12">
                <div className="card border-top-0">
                    <div className="card-header p-0">
                        <ul className="nav nav-tabs flex-wrap w-100 text-center customers-nav-tabs">
                            <li className="nav-item flex-fill border-top">
                                <a className="nav-link active" data-bs-toggle="tab" data-bs-target="#profileTab">
                                    Müşteri Profili
                                </a>
                            </li>
                            <li className="nav-item flex-fill border-top">
                                <a className="nav-link" data-bs-toggle="tab" data-bs-target="#billingTab">
                                    Fatura & Teslimat Adresi
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="tab-content">
                        <TabProfile form={form} onChange={onChange} />
                        <TabPassword />
                        <TabBilling />
                        <div className="tab-pane fade" id="subscriptionTab">
                            <TabBillingContent />
                        </div>
                        <TabNotificationsContent />
                        <TabConnections />
                    </div>
                </div>
            </div>
        </>
    )
}

export default CustomerCreateContent
