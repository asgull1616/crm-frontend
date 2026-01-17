'use client'
import React, { memo, useEffect, useState } from 'react'
import Table from '@/components/shared/table/Table'
import { FiEye, FiTrash2, FiEdit3 } from 'react-icons/fi'
import Link from 'next/link'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { customerService } from '@/lib/services/customer.service'




// const actions = [
    // { label: "Düzenle", icon: <FiEdit3 /> },
    // { label: "Print", icon: <FiPrinter /> },
    // { label: "Remind", icon: <FiClock /> },
    // { type: "divider" },
    // { label: "Archive", icon: <FiArchive /> },
    // { label: "Report Spam", icon: <FiAlertOctagon />, },
    // { type: "divider" },
    // { label: "Sil", icon: <FiTrash2 />, },
// ];

const TableCell = memo(({ options, defaultSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null)

  return (
    <SelectDropdown
      options={options}
      defaultSelect={defaultSelect}
      selectedOption={selectedOption}
      onSelectOption={setSelectedOption}
    />
  )
})
const CustomersTable = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  /* 🔹 Backend’den liste çek */
  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
  try {
    const res = await customerService.list()

    // 👇 Backend'in dönme şekline göre burası değişebilir
    const payload = res.data
    const items =
      Array.isArray(payload) ? payload :
      Array.isArray(payload?.items) ? payload.items :
      Array.isArray(payload?.data) ? payload.data :
      Array.isArray(payload?.customers) ? payload.customers :
      []

    console.log('📦 customers payload:', payload)
    console.log('✅ customers items array:', items)

    setCustomers(items)
  } finally {
    setLoading(false)
  }
}

  /* 🔹 Silme */
  const handleDelete = async (id) => {
    if (!confirm('Bu müşteri silinsin mi?')) return
    await customerService.delete(id)
    setCustomers(prev => prev.filter(c => c.id !== id))
  }

  /* 🔹 Backend → Table adapter */
const tableData = (Array.isArray(customers) ? customers : []).map(c => ({
  id: c.id,
  customer: { name: c.fullName, img: null },
  email: c.email,
  phone: c.phone,
  date: c.createdAt ? new Date(c.createdAt).toLocaleString() : '',
  status: {
    status: [
      { label: 'Yeni', value: 'NEW' },
  { label: 'İletişim Kuruldu', value: 'CONTACTED' },
  { label: 'Teklif Gönderildi', value: 'OFFER_SENT' },
  { label: 'Onay Bekliyor', value: 'WAITING_APPROVAL' },
  { label: 'Onaylandı', value: 'APPROVED' },
  { label: 'Kazanıldı', value: 'WON' },
  { label: 'Kaybedildi', value: 'LOST' },
    ],
    defaultSelect: c.status,
  },
}))


  const columns = [
    {
      accessorKey: 'id',
      header: ({ table }) => {
        const checkboxRef = React.useRef(null)

        useEffect(() => {
          if (checkboxRef.current) {
            checkboxRef.current.indeterminate = table.getIsSomeRowsSelected()
          }
        }, [table.getIsSomeRowsSelected()])

        return (
          <input
            type="checkbox"
            className="custom-table-checkbox"
            ref={checkboxRef}
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        )
      },
      cell: ({ row }) => (
        <input
          type="checkbox"
          className="custom-table-checkbox"
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      meta: { headerClassName: 'width-30' },
    },
    {
      accessorKey: 'customer',
      header: () => 'Müşteri',
      cell: (info) => {
        const c = info.getValue()
        return (
          <div className="hstack gap-3">
            <div className="text-white avatar-text avatar-md">
              {c.name.substring(0, 1)}
            </div>
            <span>{c.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'email',
      header: () => 'Email',
    },
    {
      accessorKey: 'phone',
      header: () => 'Telefon',
    },
    {
      accessorKey: 'date',
      header: () => 'Tarih',
    },
    {
      accessorKey: 'status',
      header: () => 'Durum',
      cell: (info) => (
        <TableCell
          options={info.getValue().status}
          defaultSelect={info.getValue().defaultSelect}
        />
      ),
    },
    {
      accessorKey: 'actions',
      header: () => 'Actions',
      cell: (info) => (
  <div className="hstack gap-2 justify-content-end">
    {/* ✏️ Güncelle */}
    <Link
      href={`/customers/edit/${info.row.original.id}`}
      className="avatar-text avatar-md"
      title="Güncelle"
    >
      <FiEdit3 />
    </Link>

    {/* 👁️ Detay */}
    <Link
      href={`/customers/view/${info.row.original.id}`}
      className="avatar-text avatar-md"
      title="Detayları Gör"
    >
      <FiEye />
    </Link>

    {/* 🗑️ Sil */}
    <button
      className="avatar-text avatar-md"
      title="Sil"
      onClick={() => handleDelete(info.row.original.id)}
    >
      <FiTrash2 />
    </button>
  </div>
),

      meta: { headerClassName: 'text-end' },
    },
  ]

  if (loading) return <div>Yükleniyor…</div>

    const columns = [
        {
            accessorKey: 'id',
            header: ({ table }) => {
                const checkboxRef = React.useRef(null);

                useEffect(() => {
                    if (checkboxRef.current) {
                        checkboxRef.current.indeterminate = table.getIsSomeRowsSelected();
                    }
                }, [table.getIsSomeRowsSelected()]);

                return (
                    <input
                        type="checkbox"
                        className="custom-table-checkbox"
                        ref={checkboxRef}
                        checked={table.getIsAllRowsSelected()}
                        onChange={table.getToggleAllRowsSelectedHandler()}
                    />
                );
            },
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    className="custom-table-checkbox"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            meta: {
                headerClassName: 'width-30',
            },
        },

        {
            accessorKey: 'customer',
            header: () => 'Musteri',
            cell: (info) => {
                const roles = info.getValue();
                return (
                    <a href="#" className="hstack gap-3">
                        {
                            roles?.img ?
                                <div className="avatar-image avatar-md">
                                    <img src={roles?.img} alt="" className="img-fluid" />
                                </div>
                                :
                                <div className="text-white avatar-text user-avatar-text avatar-md">{roles?.name.substring(0, 1)}</div>
                        }
                        <div>
                            <span className="text-truncate-1-line">{roles?.name}</span>
                        </div>
                    </a>
                )
            }
        },
        {
            accessorKey: 'email',
            header: () => 'Email',
            cell: (info) => <a href="apps-email.html">{info.getValue()}</a>
        },
        // {
        //     accessorKey: 'group',
        //     header: () => 'Grup',
        //     cell: (info) => {
        //         const x = info.getValue()
        //         return (
        //             <Select
        //                 defaultValue={x.defaultSelect}
        //                 isMulti
        //                 name="tags" 
        //                 options={x.tags}
        //                 className="basic-multi-select"
        //                 classNamePrefix="select"
        //                 hideSelectedOptions={false}
        //                 isSearchable={false}
        //                 // onChange={(e) => console.log(e)}
        //                 formatOptionLabel={tags => (
        //                     <div className="user-option d-flex align-items-center gap-2">
        //                         <span style={{ marginTop: "1px", backgroundColor: `${tags.color}` }} className={`wd-7 ht-7 rounded-circle`}></span>
        //                         <span>{tags.label}</span>
        //                     </div>
        //                 )}
        //             />
        //         )
        //     }
        // },
        {
            accessorKey: 'phone',
            header: () => 'Telefon',
            cell: (info) => <a href="tel:">{info.getValue()}</a>
            // meta: {
            //     className: "fw-bold text-dark"
            // }
        },
        {
            accessorKey: 'date',
            header: () => 'Tarih',
        },
        {
            accessorKey: 'status',
            header: () => 'Durum',
            cell: (info) => <TableCell options={info?.getValue().status} defaultSelect={info?.getValue().defaultSelect} />
        },
        {
            accessorKey: 'actions',
            header: () => "Actions",
            cell: info => (
                <div className="hstack gap-2 justify-content-end">
                    <Link href="/customers/view" className="avatar-text avatar-md">
                        <FiEye />
                    </Link>
                    {/* <Dropdown dropdownItems={actions} triggerClass='avatar-md' triggerPosition={"0,21"} triggerIcon={<FiMoreHorizontal />} /> */}
                    <button
                        className="avatar-text avatar-md"
                        onClick={() => handleDelete(info.row.original.id)}
                    >
                        <FiTrash2 />
                    </button>
                </div>
            ),
            meta: {
                headerClassName: 'text-end'
            }
        },
    ]

    return (
        <div>
            <Table data={customersTableData} columns={columns} />
        </div>
    )
  return (
    <div>
      <Table data={tableData} columns={columns} />
    </div>
  )


}

export default CustomersTable