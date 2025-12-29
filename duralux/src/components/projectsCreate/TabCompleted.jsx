import Link from 'next/link'
import React from 'react'


const TabCompleted = () => {
    return (
        <section className="step-body mt-4 text-center">
            <img src="/images/general/completed-steps.png" alt className="img-fluid wd-300 mb-4" />
            <h4 className="fw-bold">GÖREV OLUŞTURULDU !</h4>
            <p className="text-muted mt-2"></p>
            <div className="d-flex justify-content-center gap-1 mt-5">
                <a href="#" className="btn btn-light">Yeni Görev Oluştur </a>
                <Link href="/projects/view" className="btn btn-primary">Önceki Görev</Link>
            </div>
        </section>

    )
}

export default TabCompleted