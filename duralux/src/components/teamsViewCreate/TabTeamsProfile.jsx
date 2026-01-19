import React from 'react'
import getIcon from '@/utils/getIcon';

const generalInfoData = [
    {
        title: 'Created',
        icon: 'feather-clock',
        text: '26 MAY, 2023',
    },
    {
        title: 'Assigned',
        image: '/images/avatar/1.png',
        text: 'Alexandra Della',
    },
    {
        title: 'Lead By',
        image: '/images/avatar/5.png',
        text: 'Green Cute - Website design and development',
    },
];

const leadInfoData = [
    {
        title: 'İsim Soyisim',
        content: <a href="#">Alexandra Dell</a>,
    },
    {
        title: 'Rol',
        content: <>CEO, Founder at <a href="#">Theme Ocean</a></>,
    },

    {
        title: 'Email',
        content: <a href="#">alex.della@outlook.com</a>,
    },
    {
        title: 'Telefon',
        content: <a href="#">+01 (375) 5896 654</a>,
    },
   
];

const TabLeadsProfile = () => {
    return (
        <div className="tab-pane fade show active" id="profileTab" role="tabpanel">
            <div className="card card-body lead-info">
                <div className="mb-4 d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">
                        <span className="d-block mb-2">Ekip Üyesi Bilgileri :</span>
                    </h5>
                </div>
                {leadInfoData.map((data, index) => (
                    <Card
                        key={index}
                        title={data.title}
                        content={data.content}
                    />
                ))}
            </div>
            <hr />
        </div>
    )
}

export default TabLeadsProfile

const Card = ({ title, content }) => {
    return (
        <div className="row mb-4">
            <div className="col-lg-2 fw-medium">{title}</div>
            <div className="col-lg-10">{content}</div>
        </div>
    );
};

const GeneralCard = ({ title, icon, text, image }) => {
    return (
        <div className="row mb-4">
            <div className="col-lg-2 fw-medium">{title}</div>
            <div className="col-lg-10 hstack gap-1">
                <a href="#" className="hstack gap-2">
                    {icon && (
                        <div className="avatar-text avatar-sm">
                            {getIcon(icon)}
                        </div>
                    )}
                    {image && (
                        <div className="avatar-image avatar-sm">
                            <img src={image} alt="" className="img-fluid" />
                        </div>
                    )}
                    <span>{text}</span>
                </a>
            </div>
        </div>
    );
};
