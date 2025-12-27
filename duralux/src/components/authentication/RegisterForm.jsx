import Link from 'next/link'
import React from 'react'
import { FiEye, FiHash } from 'react-icons/fi'

const RegisterForm = ({path}) => {
    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Kayıt ol</h2>
            <h4 className="fs-13 fw-bold mb-2"></h4>
            <p className="fs-12 fw-medium text-muted">Profilinizi oluşturmaya başlamak ve hesabınızı doğrulamak için kurulumunuzu tamamlayalım..</p>
            <form action="index.html" className="w-100 mt-4 pt-2">
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
                        {/* <div className="input-group-text c-pointer gen-pass" data-toggle="tooltip" data-title="Otomatik Şifre Oluştur"><FiHash size={16}/></div>
                        <div className="input-group-text border-start bg-gray-2 c-pointer" data-toggle="tooltip" data-title="Şifreyi Göster / Gizle"><FiEye size={16}/></div>
                    </div>
                    <div className="progress-bar mt-2">
                        <div /> */}
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
                <div className="mb-4">
                    <input type="password" className="form-control" placeholder="Şifre Tekrar" required />
                </div>
                {/* <div className="mt-4">
                    <div className="custom-control custom-checkbox mb-2">
                        <input type="checkbox" className="custom-control-input" id="receiveMial" required />
                        <label className="custom-control-label c-pointer text-muted" htmlFor="receiveMial" style={{ fontWeight: '400 !important' }}>Yes, I wnat to receive Duralux community
                            emails</label>
                    </div>
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="termsCondition" required />
                        <label className="custom-control-label c-pointer text-muted" htmlFor="termsCondition" style={{ fontWeight: '400 !important' }}>I agree to all the <a href="#">Terms &amp;
                            Conditions</a> and <a href="#">Fees</a>.</label>
                    </div>
                </div> */}
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