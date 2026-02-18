"use client";
import React, { useEffect, useState } from "react";
import SelectDropdown from "@/components/shared/SelectDropdown";
import { projectStatusOptions, projectTypeOptions } from "@/utils/options";
import DatePicker from "react-datepicker";
import useDatePicker from "@/hooks/useDatePicker";
import useJoditConfig from "@/hooks/useJoditConfig";
import JoditEditor from "jodit-react";

const TabProjectDetails = ({ formData, setFormData, customers, error }) => {
  const { startDate, setStartDate, renderFooter } = useDatePicker();
  const config = useJoditConfig();
  const [value, setValue] = useState("");

  useEffect(() => {
    setStartDate(new Date(formData.deliveryDate || new Date()));
    setValue(formData.projectDescription || "");
  }, []);

  return (
    <section className="step-body mt-4 body current">
      <form id="project-details">
        <fieldset>
          <div className="mb-5">
            <h2 className="fs-16 fw-bold">Proje Detayları</h2>
          </div>
          <fieldset>
            {/* Proje Adı */}
            <div className="mb-4">
              <label htmlFor="projectName" className="form-label">
                Proje Adı <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${error && !formData.projectName ? "is-invalid" : ""}`}
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={(e) =>
                  setFormData({ ...formData, projectName: e.target.value })
                }
                required
              />
            </div>

            {/* Müşteri Seçimi (Kritik Alan) */}
            <div className="mb-4">
              <label htmlFor="projectClient" className="form-label">
                İlgili Müşteri <span className="text-danger">*</span>
              </label>
              <SelectDropdown
                options={customers.map((c) => ({
                  value: c.id,
                  label: c.fullName || (c.firstName || c.lastName ? `${c.firstName || ""} ${c.lastName || ""}`.trim() : c.companyName) || "İsimsiz Müşteri",
                }))}
                selectedOption={customers.find(
                  (c) => c.id === formData.customerId,
                )}
                defaultSelect="Müşteri Seçin"
                onSelectOption={(option) =>
                  setFormData({ ...formData, customerId: option.value })
                }
              />
              {error && !formData.customerId && (
                <div className="text-danger fs-12 mt-1">
                  Lütfen bir müşteri seçin.
                </div>
              )}
            </div>

            {/* Proje Tipi */}
            <div className="mb-4">
              <label htmlFor="projectType" className="form-label">
                Proje Tipi <span className="text-danger">*</span>
              </label>
              <SelectDropdown
                options={projectTypeOptions}
                selectedOption={projectTypeOptions.find(
                  (opt) => opt.value === formData.type,
                )}
                defaultSelect="DIGER"
                onSelectOption={(option) =>
                  setFormData({ ...formData, type: option.value })
                }
              />
            </div>

            {/* Proje Tanımı */}
            <div className="mb-4 ">
              <label className="form-label">
                Proje Tanımı <span className="text-danger">*</span>
              </label>
              <JoditEditor
                value={value}
                config={config}
                onChange={(htmlString) => {
                  setValue(htmlString);
                  setFormData({ ...formData, projectDescription: htmlString });
                }}
              />
            </div>

            {/* Proje Durumu */}
            <div className="mb-4">
              <label htmlFor="projectStatus" className="form-label">
                Proje Durumu <span className="text-danger">*</span>
              </label>
              <SelectDropdown
                options={projectStatusOptions}
                selectedOption={projectStatusOptions.find(
                  (opt) => opt.value === formData.status,
                )}
                defaultSelect="TEKLIF"
                onSelectOption={(option) =>
                  setFormData({ ...formData, status: option.value })
                }
              />
            </div>

            {/* Teslim Tarihi */}
            <div className="mb-4">
              <label htmlFor="projectReleaseDate" className="form-label">
                Teslim Tarihi <span className="text-danger">*</span>
              </label>
              <div className="input-group date ">
                <DatePicker
                  placeholderText="Teslim tarihi seçin"
                  selected={startDate}
                  showPopperArrow={false}
                  onChange={(date) => {
                    setStartDate(date);
                    setFormData({ ...formData, deliveryDate: date });
                  }}
                  className="form-control"
                  popperPlacement="bottom-start"
                  calendarContainer={({ children }) => (
                    <div className="bg-white react-datepicker">
                      {children}
                      {renderFooter("start")}
                    </div>
                  )}
                />
              </div>
            </div>

            <hr className="mb-5" />

            {/* Bilgilendirme Seçenekleri */}
            <div className="custom-control custom-checkbox mb-2">
              <input
                type="checkbox"
                className="custom-control-input"
                id="sendProjectEmail"
                defaultChecked
              />
              <label
                className="custom-control-label c-pointer"
                htmlFor="sendProjectEmail"
              >
                Proje oluşturulduğunda e-posta gönder.
              </label>
            </div>
            <div className="custom-control custom-checkbox mb-2">
              <input
                type="checkbox"
                className="custom-control-input"
                id="allowNotifications"
                defaultChecked
              />
              <label
                className="custom-control-label c-pointer"
                htmlFor="allowNotifications"
              >
                Bildirimlere izin ver.
              </label>
            </div>
          </fieldset>
        </fieldset>
      </form>
    </section>
  );
};

export default TabProjectDetails;
