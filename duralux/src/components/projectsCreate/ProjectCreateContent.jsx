'use client'
import React, { useState, useEffect } from 'react' // useEffect eklendi
import dynamic from 'next/dynamic'
import TabProjectType from './TabProjectType'
import TabProjectSettings from './TabProjectSettings';
import TabProjectBudget from './TabProjectBudget';
import TabProjectAssigned from './TabProjectAssigned';
import TabAttachement from './TabAttachement';
import TabCompleted from './TabCompleted';
import { customerService } from "@/lib/services/customer.service";
import { projectsApi } from "@/lib/services/projects.service";

const TabProjectDetails = dynamic(() => import('./TabProjectDetails'), { ssr: false })
const TabProjectTarget = dynamic(() => import('./TabProjectTarget'), { ssr: false })

const steps = [
    { name: "Tür", required: true },
    { name: "Detaylar", required: true }, // Detaylar genellikle zorunludur
    { name: "Proje Ekibi", required: false },
    { name: "Dosya Yükleme", required: false },
    { name: "Tamamlandı", required: false },
];

const ProjectCreateContent = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [customers, setCustomers] = useState([]); // Müşteri listesi state'i
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({
        projectType: "project_personal", // Uygulama içi mantık için kalabilir
        projectManage: "project_everyone",
        projectBudgets: "",
        budgetsSpend: "",
        customerId: "",
        projectName: "",
        projectDescription: "",
        type: "DIGER", // Backend ProjectType
        status: "TEKLIF", // Backend ProjectStatus
        deliveryDate: new Date(),
    });

    // ✅ Komponent yüklendiğinde müşterileri çek
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await customerService.list({ limit: 100 });
                // Backend return: { data: [...], meta: ... }
                // Axios response: res.data = { data: [...], meta: ... }
                const customerList = res.data?.data || res.data || [];
                setCustomers(Array.isArray(customerList) ? customerList : []);
            } catch (err) {
                console.error("Müşteriler yüklenirken hata oluştu:", err);
            }
        };
        fetchCustomers();
    }, []);

    const validateFields = () => {
        if (!steps[currentStep].required) return true;

        const { projectManage, projectType, customerId, projectName } = formData;
        
        // Adım 0: Tür Seçimi Doğrulaması
        if (currentStep === 0 && (projectManage === "" || projectType === "")) {
            setError(true);
            return false;
        }
        // Adım 1: Detaylar Doğrulaması
        if (currentStep === 1) {
            if (!projectName || !customerId) {
                setError(true);
                return false;
            }
        }
        
        setError(false);
        return true;
    };

    const handleNext = async (e) => {
        e.preventDefault()
        if (validateFields()) {
            if (currentStep === steps.length - 2) {
                try {
                    // Backend'in beklediği formatta payload hazırla
                    const payload = {
                        name: formData.projectName,
                        customerId: formData.customerId,
                        type: formData.type || 'DIGER', 
                        status: formData.status || 'TEKLIF',
                        deliveryDate: formData.deliveryDate
                    };
                    
                    await projectsApi.create(payload);
                    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
                } catch (err) {
                    console.error("Proje oluşturma hatası:", err);
                    alert("Proje oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
                }
            } else {
                setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
            }
        }
    };

    const handlePrev = (e) => {
        e.preventDefault()
        setCurrentStep((prev) => Math.max(prev - 1, 0));
        setError(false); // Geri giderken hatayı temizle
    };

    const handleTabClick = (e, index) => {
        e.preventDefault()
        if (validateFields()) {
            setCurrentStep(index);
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

                    <div className="content clearfix p-4">
                        {/* Step 0: Tür */}
                        {currentStep === 0 && (
                            <TabProjectType 
                                setFormData={setFormData} 
                                formData={formData} 
                                error={error} 
                                setError={setError} 
                            />
                        )}

                        {/* Step 1: Detaylar (Müşteri seçimi genellikle burada olur) */}
                        {currentStep === 1 && (
                            <TabProjectDetails 
                                setFormData={setFormData} 
                                formData={formData} 
                                customers={customers} // ✅ Müşteri listesini prop olarak gönderiyoruz
                                error={error}
                            />
                        )}

                        {/* Step 2: Proje Ekibi */}
                        {currentStep === 2 && <TabProjectAssigned />}

                        {/* Step 3: Dosya Yükleme */}
                        {currentStep === 3 && <TabAttachement />}

                        {/* Step 4: Tamamlandı */}
                        {currentStep === 4 && <TabCompleted formData={formData} />}
                    </div>

                    {/* Buttons */}
                    <div className="actions clearfix p-4">
                        <ul className="d-flex list-unstyled justify-content-end gap-2">
                            <li 
                                className={`btn btn-secondary ${currentStep === 0 ? "disabled" : ""}`} 
                                onClick={(e) => handlePrev(e)}
                            >
                                <a href="#" className="text-white text-decoration-none">Geri</a>
                            </li>
                            <li 
                                className={`btn btn-primary ${currentStep === steps.length - 1 ? "disabled" : ""}`} 
                                onClick={(e) => handleNext(e)}
                            >
                                <a href="#" className="text-white text-decoration-none">
                                    {currentStep === steps.length - 2 ? "Projeyi Oluştur" : "İleri"}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectCreateContent;