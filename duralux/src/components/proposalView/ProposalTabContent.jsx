'use client'
import React, { useState } from 'react'
import { FiAirplay, FiAnchor, FiArchive, FiBook, FiEdit, FiFacebook, FiGithub, FiInstagram, FiLinkedin, FiPlus, FiSend, FiSettings, FiTwitter } from 'react-icons/fi'
import { servicesData } from '@/utils/fackData/servicesData'
import { accordionData } from '@/utils/fackData/accordionData'
import JoditEditor from 'jodit-react'
import useJoditConfig from '@/hooks/useJoditConfig'


const editorContent = `  <p>
                                    bu k
                                </p>
                                <br />
                                <p>
                                   kısım
                                </p>
                                <br />
                                <p>
                                  teklifte
                                </p>
                                <br />
                                <p>
                                 ne 
                                </p>
                                <br />
                                <p>
                                olduğunu
                                </p>
                                <br />
                                <p>
                                anlatacak.
                                </p>
                                <br />
                                <p>
                                    <strong className="text-dark">Reputation:</strong> ppepepep
                                </p>
                                <br />
                                <p>
                                    <strong className="text-dark">
                                        Communication and responsiveness:
                                    </strong>{" "}
                                  ossooslslsl
                                </p>`
const ProposalTabContent = () => {
    const [value, setValue] = useState(editorContent);
    const config = useJoditConfig()

    return (
        <div className="tab-pane fade active show" id="proposalTab">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-body">
                            <div className="d-sm-flex justify-content-between">
                                <div className="proposal-from">
                                    <h4 className="fw-bold mb-4">Form:</h4>
                                    <div className="fs-13 text-muted lh-lg">
                                        <div>
                                            <span className="fw-semibold text-dark border-bottom border-bottom-dashed">
                                                Telefon:
                                            </span>
                                            <span>(123) 456-7890</span>
                                        </div>
                                        <div>
                                            <span className="fw-semibold text-dark border-bottom border-bottom-dashed">
                                                Email:
                                            </span>
                                            <span>exmalple@email.com</span>
                                        </div>
                                        <address>
                                            <span className="fw-semibold text-dark border-bottom border-bottom-dashed">
                                                Adres:
                                            </span>
                                            <span>P.O. Box 18728,</span>
                                            <br />
                                            <span>Delorean New York,</span>
                                            <br />
                                            <span>VAT No: 2617 348 2752</span>
                                            <br />
                                        </address>
                                        <div className="d-flex gap-2">
                                            <a href="#" className="avatar-text avatar-sm">
                                                <FiFacebook />
                                            </a>
                                            {/* <a href="#" className="avatar-text avatar-sm">
                                                <FiTwitter />
                                            </a> */}
                                            <a href="#" className="avatar-text avatar-sm">
                                                <FiInstagram />
                                            </a>
                                            <a href="#" className="avatar-text avatar-sm">
                                                <FiLinkedin />
                                            </a>
                                            <a href="#" className="avatar-text avatar-sm">
                                                <FiGithub />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <hr className="d-md-none" />
                                <div className="proposal-to">
                                    <h6 className="fw-bold mb-4">To:</h6>
                                    <div className="fs-13 lh-lg">
                                        <div>
                                            <span className="fw-semibold text-dark border-bottom border-bottom-dashed">
                                                Teklif No:
                                            </span>
                                            <span className="fw-bold text-primary">#NXL369852</span>
                                        </div>
                                            <div>
                                            <span className="fw-semibold text-dark border-bottom border-bottom-dashed">
                                                Müşteri Adı:
                                            </span>
                                            <span className="fw-bold text-primary">sasad</span>
                                        </div>
                                        <div>
                                            <span className="fw-semibold text-dark border-bottom border-bottom-dashed">
                                               Son Tarih:
                                            </span>
                                            <span className="text-muted">28 May, 2023</span>
                                        </div>
                                        <div>
                                            <span className="fw-semibold text-dark border-bottom border-bottom-dashed">
                                               Oluşturma Tarihi:
                                            </span>
                                            <span className="text-muted">25 May, 2023</span>
                                        </div>
                                    </div>
                                    <div className="fs-13 text-muted lh-lg mt-3">
                                        <div>
                                            <span className="fw-semibold text-dark border-bottom border-bottom-dashed">
                                                Telefon:
                                            </span>
                                            <span>(123) 456-7890</span>
                                        </div>
                                        <div>
                                            <span className="fw-semibold text-dark border-bottom border-bottom-dashed">
                                                Email:
                                            </span>
                                            <span>exmalple@email.com</span>
                                        </div>
                                        <address className="mb-0">
                                            <span className="fw-semibold text-dark border-bottom border-bottom-dashed">
                                                Adres:
                                            </span>
                                            <span>9498 Harvard Street,</span>
                                            <br />
                                            <span>Fairfield, Chicago Town 06824</span>
                                            <br />
                                        </address>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-header">
                            <h5 className="card-title">Teklif Notları</h5>
                            <a
                                href="#"
                                className="avatar-text avatar-md"
                                data-bs-toggle="tooltip"
                                title="Update Proposal"
                            >
                                <FiEdit />
                            </a>
                        </div>
                        <div className="card-body p-0 proposal-tab-editor">
                            <JoditEditor
                                value={value}
                                config={config}
                                onChange={(htmlString) => setValue(htmlString)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default ProposalTabContent


const ServiceCard = ({ icon, title, description, link }) => {
    return (
        <div className="col-xxl-4 col-md-6">
            <div className="card stretch stretch-full">
                <div className="card-body">
                    <div className="avatar-text rounded-2 mb-4">
                        {getIcon(icon)}
                    </div>
                    <h6 className="fw-bold mb-3 text-truncate-1-line">
                        {title}
                    </h6>
                    <p className="text-muted mb-4 text-truncate-3-line">
                        {description}
                    </p>
                    <a
                        href={link}
                        className="d-block fs-10 fw-bold text-dark text-uppercase text-spacing-1"
                    >
                        Learn More →
                    </a>
                </div>
            </div>
        </div>
    );
};


const AccordionItem = ({ id, header, content }) => {
    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={`flush-heading${id}`}>
                <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#flush-collapse${id}`}
                    aria-expanded="false"
                    aria-controls={`flush-collapse${id}`}
                >
                    {header}
                </button>
            </h2>
            <div
                id={`flush-collapse${id}`}
                className="accordion-collapse collapse"
                aria-labelledby={`flush-heading${id}`}
                data-bs-parent="#accordionFaqGroup"
            >
                <div className="accordion-body">
                    {content}
                </div>
            </div>
        </div>
    );
}


const getIcon = (icon) => {
    switch (icon) {
        case "feather-archive":
            return <FiArchive size={16} strokeWidth={1.6} />
        case "feather-airplay":
            return <FiAirplay size={16} strokeWidth={1.6} />
        case "feather-settings":
            return <FiSettings size={16} strokeWidth={1.6} />
        case "feather-send":
            return <FiSend size={16} strokeWidth={1.6} />
        case "feather-anchor":
            return <FiAnchor size={16} strokeWidth={1.6} />
        case "feather-book":
            return <FiBook size={16} strokeWidth={1.6} />

        default:
            break;
    }
}