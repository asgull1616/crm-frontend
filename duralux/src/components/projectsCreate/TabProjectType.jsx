import React from 'react'
import getIcon from '@/utils/getIcon'
import { FiAlertTriangle } from 'react-icons/fi'

const TabProjectType = ({ setFormData, formData, error, setError }) => {
  return (
    <section className="step-body mt-4 body current">
      <form id="project-type">
        {/* ✅ PROJE ADI */}
        <fieldset>
          <div className="mb-4">
            <h2 className="fs-16 fw-bold">Proje Bilgileri</h2>
            <p className="text-muted">Proje adını girin (zorunlu).</p>

            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-bold">Proje Adı *</label>
                <input
                  className={`form-control ${error && !formData.name?.trim() ? "is-invalid" : ""}`}
                  placeholder="Örn: Duralux Web Projesi"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, name: e.target.value }));
                    setError(false);
                  }}
                />
                {error && !formData.name?.trim() && (
                  <div className="invalid-feedback">Proje adı zorunludur.</div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label fw-bold">Açıklama</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Kısa açıklama (opsiyonel)"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </div>
        </fieldset>

        <hr className="mb-5" />

        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Görev</h2>
            <p className="text-muted">Proje tipini seçin.</p>
            {error && <label id="project-type-error" className="error"><FiAlertTriangle /> This field is required.</label>}
          </div>

          <fieldset>
            <ProjectTypeCard
              icon={"feather-user"}
              title={"Kişisel Proje"}
              id={"project_personal"}
              name={"project-type"}
              isRequired={true}
              setFormData={setFormData}
              formData={formData}
              setError={setError}
            />
            <ProjectTypeCard
              icon={"feather-users"}
              title={"Ekip Projesi"}
              id={"project_team"}
              name={"project-type"}
              isRequired={false}
              setFormData={setFormData}
              formData={formData}
              setError={setError}
            />
          </fieldset>
        </fieldset>

        <hr className="mb-5" />

        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Proje Yönetimi</h2>
            <p className="text-muted">Projeyi kim yönetebilir?</p>
            {error && <label id="project-type-error" className="error"><FiAlertTriangle /> This field is required.</label>}
          </div>

          <fieldset>
            <ProjectTypeCard
              icon={"feather-globe"}
              title={"Herkes"}
              description={"Tüm kullanıcılar görebilir ancak misafirler erişemez."}
              id={"project_everyone"}
              name={"project-manage"}
              isRequired={true}
              setFormData={setFormData}
              formData={formData}
              setError={setError}
            />
            <ProjectTypeCard
              icon={"feather-shield"}
              title={"Sadece Yöneticiler"}
              description={"Sadece yöneticiler her şeyi yönetebilir."}
              id={"project_admin"}
              name={"project-manage"}
              isRequired={false}
              setFormData={setFormData}
              formData={formData}
              setError={setError}
            />
            <ProjectTypeCard
              icon={"feather-settings"}
              title={"Sadece Belirli Kişiler"}
              description={"Sadece seçilen belirli kişiler bunu görebilir."}
              id={"project_specific"}
              name={"project-manage"}
              isRequired={false}
              setFormData={setFormData}
              formData={formData}
              setError={setError}
            />
          </fieldset>
        </fieldset>
      </form>
    </section>
  )
}

export default TabProjectType

export const ProjectTypeCard = ({ icon, title, description, id, isRequired, name, setFormData, formData, setError }) => {
  const handleOnChange = (e) => {
    const name = e.target.name
    const id = e.target.id
    let updatedType = { ...formData };

    if (name === "project-type") {
      updatedType = { ...updatedType, projectType: id };
      setError(false)
    }
    if (name === "project-manage") {
      updatedType = { ...updatedType, projectManage: id };
      setError(false)
    }
    if (name === "budget-spend") {
      updatedType = { ...updatedType, budgetsSpend: id };
      setError(false)
    }
    setFormData({ ...formData, ...updatedType });
  }

  const { projectType, projectManage, budgetsSpend } = formData
  return (
    <label className="w-100" htmlFor={id}>
      <input
        className="card-input-element"
        type="radio"
        name={name}
        id={id}
        required={isRequired}
        onClick={(e) => handleOnChange(e)}
        defaultChecked={projectType === id || projectManage === id || budgetsSpend === id ? true : false}
      />
      <span className="card card-body d-flex flex-row justify-content-between align-items-center ">
        <span className="hstack gap-3">
          <span className="avatar-text">
            {React.cloneElement(getIcon(icon), { size: "16", strokeWidth: "1.6" })}
          </span>
          <span>
            <span className="d-block fs-13 fw-bold text-dark">{title}</span>
            <span className="d-block text-muted mb-0" dangerouslySetInnerHTML={{ __html: description }} />
          </span>
        </span>
      </span>
    </label>
  )
}
