'use client'

import Link from 'next/link'
import React from 'react'
import { useRouter } from 'next/navigation'
import { FiEye, FiHash } from 'react-icons/fi'

const RegisterForm = ({path}) => {
      const router = useRouter()
      const handleSubmit = (e) => {
    e.preventDefault()
      router.push('/authentication/login/minimal')}
    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Kayıt ol</h2>
            <h4 className="fs-13 fw-bold mb-2"></h4>
            <p className="fs-12 fw-medium text-muted">Profilinizi oluşturmaya başlamak ve hesabınızı doğrulamak için kurulumunuzu tamamlayalım..</p>
          <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input type="text" className="form-control" placeholder="Ad Soyad" required />
                </div>
                <div className="mb-4">
                    <input type="email" className="form-control" placeholder="E-posta" required />
                </div>
                <div className="mb-4">
                    <input type="tel" className="form-control" placeholder="Kullanıcı Adı" required />
                </div>
                <div className="mb-4 generate-pass">
                    <div className="input-group field">
                        <input type="password" className="form-control password" id="newPassword" placeholder="Şifre" />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
                <div className="mb-4">
                    <input type="password" className="form-control" placeholder="Şifre Tekrar" required />
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100">Hesap Oluştur</button>
                </div>
            </form>
            <div className="mt-5 text-muted">
                <span>Zaten hesabın varsa </span>
                <Link href={path} className="fw-bold"> Giriş Yap</Link>
            </div>
        </>
    )
}

export default RegisterForm