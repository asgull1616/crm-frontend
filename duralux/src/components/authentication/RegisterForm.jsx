'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/services/auth.service'

const RegisterForm = ({ path }) => {
    const router = useRouter()

    // 🔹 STATE’LER
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            console.log('📨 REGISTER PAYLOAD:', {
                username,
                email,
                password,
            })

            const res = await authService.register({
                username,
                email,
                password,
            })

            console.log('✅ REGISTER SUCCESS:', res.data)

            // 🎯 Register sonrası login ekranına
            router.replace('/authentication/login/minimal')
        } catch (error) {
            console.error(
                '❌ REGISTER FAILED:',
                error.response?.data || error.message
            )
            alert('Kayıt sırasında bir hata oluştu')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Kayıt ol</h2>
            <p className="fs-12 fw-medium text-muted">
                Profilinizi oluşturmaya başlamak ve hesabınızı doğrulamak için
                kurulumunuzu tamamlayalım..
            </p>

            <form onSubmit={handleSubmit} className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="E-posta"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Kullanıcı Adı"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4 generate-pass">
                    <div className="input-group field">
                        <input
                            type="password"
                            className="form-control password"
                            placeholder="Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>

                <div className="mt-5">
                    <button
                        type="submit"
                        className="btn btn-lg btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
                    </button>
                </div>
            </form>

            <div className="mt-5 text-muted">
                <span>Zaten hesabın varsa </span>
                <Link href={path} className="fw-bold">
                    {' '}
                    Giriş Yap
                </Link>
            </div>
        </>
    )
}

export default RegisterForm
