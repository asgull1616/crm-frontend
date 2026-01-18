import React from 'react'
import { FiEdit, FiPlus, FiX } from 'react-icons/fi'

const NotesTabContent = () => {
    return (
        <div className="tab-pane fade" id="notesTab">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card stretch stretch-full">
                        <div className="card-header d-flex justify-content-between border-bottom-0">
                            <div>
                                <h5>Notes:</h5>
                                <p className="fs-12 text-muted">Notes for this tasks</p>
                            </div>
                            <a href="#">3 Notes </a>
                        </div>
                        <div className="card-body py-0">
                            <textarea className="form-control" rows="5" placeholder="Write note here..."></textarea>
                        </div>
                        <div className="card-footer border-top-0">
                            <a href="#" className="btn btn-primary wd-200">
                                <FiPlus size={16} className='me-2' />
                                <span>Add Note</span>
                            </a>
                        </div>
                    </div>
                </div>
                <UserCard
                    avatarSrc=""
                    userName=""
                    dateTime=""
                    description=""
                />
           
                
                
            </div>
        </div>
    )
}

export default NotesTabContent

const UserCard = ({ avatarSrc, userName, dateTime, description }) => {
    return (
        <div className="col-lg-6">
            <div className="card stretch stretch-full">
                <div className="card-body d-flex justify-content-between">
                    <div className="d-flex">
                        <a href="#" className="avatar-image me-3">
                            <img src={avatarSrc} className="img-fluid" alt="" />
                        </a>
                        <div>
                            <div className="mb-2">
                                <a href="#" className="mb-1 d-block">{userName}</a>
                                <a href="#" className="fs-11 fw-normal text-uppercase text-muted d-block">{dateTime}</a>
                            </div>
                            <p className="text-muted">{description}</p>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <a href="#" className="avatar-text avatar-sm" data-toggle="tooltip" data-title="Edit" >
                            <FiEdit />
                        </a>
                        <a href="#" className="avatar-text avatar-sm text-danger" data-toggle="tooltip" data-title="Delete">
                            <FiX />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
