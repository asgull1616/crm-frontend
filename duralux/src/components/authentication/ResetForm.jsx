import Link from 'next/link'
import React from 'react'

const ResetForm = ({ path }) => {
    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Şifreyi Sıfırla</h2>
            <h4 className="fs-13 fw-bold mb-2">Kullanıcı/Şifreyi sıfırla</h4>
            <p className="fs-12 fw-medium text-muted">E-postanızı girin, size bir şifre sıfırlama bağlantısı gönderelim</p>
            <form action="auth-resetting-cover.html" className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input className="form-control" placeholder="Kullanıcı adı veya E-mail" required />
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100">Şimdi Sıfırla</button>
                </div>
            </form>
            <div className="mt-5 text-muted">
                <span>Hesabın yoksa</span>
                <Link href={path} className="fw-bold">   Kayıt ol</Link>
            </div>
        </>
    )
}

export default ResetForm