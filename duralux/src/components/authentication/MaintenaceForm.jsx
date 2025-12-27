import React from 'react'
import { FiFacebook, FiGithub, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi'

const MaintenaceForm = () => {
    return (
        <>
            <h2 className="fs-20 fw-bolder mb-4">Bakım Çalışması</h2>
            <h4 className="fs-13 fw-bold mb-2">Şu anda bakım aşamasındayız</h4>
            <p className="fs-12 fw-medium text-muted">Verdiğimiz rahatsızlıktan dolayı özür dileriz; şu anda sistemi iyileştirmek için bazı çalışmalar yapıyoruz.</p>
            <form action="#" className="w-100 mt-4 pt-2">
                <div className="mb-4">
                    <input type="email" className="form-control" placeholder="E-posta Adresinizi Girin" required />
                </div>
                <div className="mt-5">
                    <button type="submit" className="btn btn-lg btn-primary w-100">Bana Haber Ver</button>
                </div>
            </form>
            {/* <div className="mt-5 d-flex justify-content-center gap-2">
                <a href="#" className="avatar-text avatar-md" data-toggle="tooltip" data-title="Follow on Facebook">
                    <FiFacebook />
                </a>
                <a href="#" className="avatar-text avatar-md" data-toggle="tooltip" data-title="Follow on Twitter">
                    <FiTwitter />
                </a>
                <a href="#" className="avatar-text avatar-md" data-toggle="tooltip" data-title="Follow on Instagram">
                    <FiInstagram />
                </a>
                <a href="#" className="avatar-text avatar-md" data-toggle="tooltip" data-title="Follow on Github">
                    <FiGithub />
                </a>
                <a href="#" className="avatar-text avatar-md" data-toggle="tooltip" data-title="Follow on Linkedin">
                    <FiLinkedin />
                </a>
            </div> */}
        </>
    )
}

export default MaintenaceForm