import React, { useEffect, useState } from 'react'
import SelectDropdown from '@/components/shared/SelectDropdown'
import { customerListTagsOptions, projectBillingOptions, projectStatusOptions, propasalLeadOptions } from '@/utils/options'
import MultiSelectTags from '@/components/shared/MultiSelectTags';
import DatePicker from 'react-datepicker';
import useDatePicker from '@/hooks/useDatePicker';
import useJoditConfig from '@/hooks/useJoditConfig';
import JoditEditor from 'jodit-react';

const TabProjectDetails = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const { startDate, endDate, setStartDate, setEndDate, renderFooter } = useDatePicker();
    const config = useJoditConfig()
    const [value, setValue] = useState('');
    useEffect(() => {
        setStartDate(new Date())
        setValue(`
            
            `)
    }, []);

    return (
        <section className="step-body mt-4 body current">
            <form id="project-details">
                <fieldset>
                    <div className="mb-5">
                        <h2 className="fs-16 fw-bold">Görev Detayı</h2>
                        {/* <p className="text-muted">You project details gose here.</p> */}
                    </div>
                    <fieldset>
                        <div className="mb-4">
                            <label htmlFor="projectName" className="form-label">Görev Adı <span className="text-danger">*</span></label>
                            <input type="text" className="form-control" id="projectName" name="projectName" defaultValue="" required />
                        </div>
                        <div className="mb-4 ">
                            <label className="form-label">Görev Tanımı <span className="text-danger">*</span></label>
                            <JoditEditor
                                value={value}
                                config={config}
                                onChange={(htmlString) => setValue(htmlString)}
                            />
                        </div>
                        {/* <div className="mb-4">
                            <label htmlFor="ratePerHour" className="form-label">Rate Per Hour <span className="text-danger">*</span></label>
                            <input type="number" className="form-control" id="ratePerHour" name="ratePerHour" defaultValue={20} required />
                        </div> */}
                        <div className="mb-4">
                            <label htmlFor="projectClient" className="form-label">Görev Sahibi <span className="text-danger">*</span></label>
                            <SelectDropdown
                                options={propasalLeadOptions}
                                selectedOption={selectedOption}
                                defaultSelect="ui"
                                onSelectOption={(option) => setSelectedOption(option)}
                            />
                        </div>
                        {/* <div className="mb-4">
                            <label htmlFor="billingType" className="form-label">Billing type <span className="text-danger">*</span></label>
                            <SelectDropdown
                                options={projectBillingOptions}
                                selectedOption={selectedOption}
                                defaultSelect="tasks-hours"
                                onSelectOption={(option) => setSelectedOption(option)}
                            />
                        </div> */}
                        <div className="mb-4">

                            <label htmlFor="projectStatus" className="form-label">Görev Durumu <span className="text-danger">*</span></label>
                            <SelectDropdown
                                options={projectStatusOptions}
                                selectedOption={selectedOption}
                                defaultSelect="active"
                                onSelectOption={(option) => setSelectedOption(option)}
                            />

                        </div>
                        {/* <div className="mb-4">
                            <label htmlFor="projectTags" className="form-label">Project tags <span className="text-danger">*</span></label>
                            <MultiSelectTags
                                options={customerListTagsOptions}
                                selectedOption={selectedOption}
                                defaultSelect={[customerListTagsOptions[10]]}
                                onSelectOption={(option) => setSelectedOption(option)}
                            />
                        </div> */}
                        <div className="mb-4">
                            <label htmlFor="projectReleaseDate" className="form-label">Teslim Tarihi <span className="text-danger">*</span></label>
                            <div className='input-group date '>
                                <DatePicker
                                    placeholderText='Pick start date'
                                    selected={startDate}
                                    showPopperArrow={false}
                                    onChange={(date) => setStartDate(date)}
                                    className='form-control'
                                    popperPlacement="bottom-start"
                                    calendarContainer={({ children }) => (
                                        <div className='bg-white react-datepicker'>
                                            {children}
                                            {renderFooter("start")}
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <hr className="mb-5" />
                        <div className="custom-control custom-checkbox mb-2">
                            <input type="checkbox" className="custom-control-input" id="sendProjectEmail" defaultChecked />
                            <label className="custom-control-label c-pointer" htmlFor="sendProjectEmail">Görev oluşturulduğunda e-posta gönder..</label>
                        </div>
                        <div className="custom-control custom-checkbox mb-2">
                            <input type="checkbox" className="custom-control-input" id="calculateTasks" defaultChecked />
                            <label className="custom-control-label c-pointer" htmlFor="calculateTasks">İlerlemeyi alt görevlere göre hesapla.</label>
                        </div>
                        <div className="custom-control custom-checkbox mb-2">
                            <input type="checkbox" className="custom-control-input" id="allowNotifications" defaultChecked />
                            <label className="custom-control-label c-pointer" htmlFor="allowNotifications">Telefon veya e-posta bildirimlerine izin ver..</label>
                        </div>
                    </fieldset>
                </fieldset>
            </form>
        </section>

    )
}

export default TabProjectDetails