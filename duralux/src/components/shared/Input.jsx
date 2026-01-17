'use client'
import React from 'react'
import getIcon from '@/utils/getIcon'

const Input = ({
  label,
  icon,
  type = "text",
  placeholder,
  labelId,
  name,
  centerLink,
  value,
  onChange,
}) => {
  return (
    <div className="row mb-4 align-items-center">
      <div className="col-lg-4">
        <label htmlFor={labelId} className="fw-semibold">
          {label}:
        </label>
      </div>
      <div className="col-lg-8">
        <div className="input-group">
          <div className="input-group-text">{getIcon(icon)}</div>
          {centerLink && (
            <div className="input-group-text">
              https://wrapbootstrap.com/user/theme_ocean
            </div>
          )}
          <input
            type={type}
            name={name}
            id={labelId}
            className="form-control"
            placeholder={placeholder}
            value={value}          // 🔥 KRİTİK
            onChange={onChange}    // 🔥 KRİTİK
          />
        </div>
      </div>
    </div>
  )
}

export default Input
