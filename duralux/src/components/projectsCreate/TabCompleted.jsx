import Link from 'next/link'
import React from 'react'

const TabCompleted = ({ onSave, saving, projectName }) => {
  return (
    <section className="step-body mt-4 text-center">
      <img src="/images/general/completed-steps.png" alt="" className="img-fluid wd-300 mb-4" />
      <h4 className="fw-bold">PROJE OLUŞTURMAYA HAZIR!</h4>
      <p className="text-muted mt-2">
        {projectName?.trim() ? (
          <>Oluşturulacak proje: <b>{projectName}</b></>
        ) : (
          <>Proje adı girilmemiş.</>
        )}
      </p>

      <div className="d-flex justify-content-center gap-2 mt-5 flex-wrap">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "KAYDEDİLİYOR..." : "PROJEYİ KAYDET"}
        </button>

        <Link href="/projects" className="btn btn-light">
          Proje Listesi
        </Link>
      </div>
    </section>
  )
}

export default TabCompleted
