import Image from 'next/image'
import React from 'react'
import { BsPatchCheckFill } from 'react-icons/bs'
import { FiEdit, FiMail, FiMapPin, FiPhone, FiTrash2 } from 'react-icons/fi'
const Profile = () => {
    return (
 
        <div className="card stretch stretch-full">
            <div className="card-body">
                <div className="d-flex gap-2 text-center pt-4">
                    <a href="#" className="w-50 btn btn-light-brand">
                        <FiTrash2 size={16} className='me-2' />
                        <span>Sil</span>
                    </a>
                    <a href="#" className="w-50 btn btn-primary">
                        <FiEdit size={16} className='me-2' />
                        <span>Profili Düzenle</span>
                    </a>
                </div>
            </div>
        </div>


    )
}

export default Profile