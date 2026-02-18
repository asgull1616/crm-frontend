'use client'
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from "next/navigation";
import TabProjectType from './TabProjectType'
import TabProjectAssigned from './TabProjectAssigned'
import TabAttachement from './TabAttachement'
import TabCompleted from './TabCompleted'
import { projectService } from "@/lib/services/project.service"; // ✅ EKLENDİ

const TabProjectDetails = dynamic(() => import('./TabProjectDetails'), { ssr: false })
const TabProjectTarget = dynamic(() => import('./TabProjectTarget'), { ssr: false })

const steps = [
  { name: "Tür", required: true },
  { name: "Detaylar", required: false },
  { name: "Proje Ekibi", required: false },
  { name: "Dosya Yükleme", required: false },
  { name: "Tamamlandı", required: false },
];

const ProjectCreateContent = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    // ✅ backend için gerekli alanlar
    name: "",
    description: "",
    status: "ACTIVE",

    // mevcut wizard alanların
    projectType: "",
    projectManage: "",
    projectBudgets: "",
    budgetsSpend: "",
  });

  const validateFields = () => {
    const { name, projectManage, projectType, budgetsSpend, projectBudgets } = formData;

    if (steps[currentStep].required) {
      if (
        (currentStep === 0 && (name.trim() === "" || projectManage === "" || projectType === "")) ||
        (currentStep === 3 && (projectBudgets === "" || budgetsSpend === ""))
      ) {
        setError(true);
        return false;
      }
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateFields()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleTabClick = (e, index) => {
    e.preventDefault();
    if (validateFields()) {
      setCurrentStep(index);
    }
  };

  // ✅ backend'e kaydet
  const handleSaveProject = async () => {
    if (!formData.name.trim()) {
      setError(true);
      setCurrentStep(0);
      return;
    }

    setSaving(true);
    try {
      await projectService.create({
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
        status: formData.status || "ACTIVE",
      });

      // proje list sayfan varsa oraya
      router.push("/projects/board");
    } catch (err) {
      console.error(err);
      alert("Proje oluşturulamadı");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card border-top-0">
        <div className="card-body p-0 wizard" id="project-create-steps">
          <div className='steps clearfix'>
            <ul role="tablist">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className={`${currentStep === index ? "current" : ""} ${currentStep === index && error ? "error" : ""}`}
                  onClick={(e) => handleTabClick(e, index)}
                >
                  <a href="#" className='d-block fw-bold'>{step.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="content clearfix">
            {currentStep === 0 && (
              <TabProjectType
                setFormData={setFormData}
                formData={formData}
                error={error}
                setError={setError}
              />
            )}

            {currentStep === 1 && <TabProjectDetails />}

            {currentStep === 2 && <TabProjectAssigned />}

            {currentStep === 3 && <TabAttachement />}

            {currentStep === 4 && (
              <TabCompleted
                onSave={handleSaveProject}
                saving={saving}
                projectName={formData.name}
              />
            )}
          </div>

          {/* Buttons */}
          <div className="actions clearfix">
            <ul>
              <li className={`${currentStep === 0 ? "disabled" : ""}`} onClick={(e) => handlePrev(e)} disabled={currentStep === 0}>
                <a href="#">Geri</a>
              </li>

              <li className={`${currentStep === steps.length - 1 ? "disabled" : ""}`} onClick={(e) => handleNext(e)} disabled={currentStep === steps.length - 1}>
                <a href="#">İleri</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCreateContent
