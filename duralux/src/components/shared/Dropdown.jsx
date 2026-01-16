'use client';

import React from 'react';
import Checkbox from './Checkbox';
import { FiMoreVertical } from 'react-icons/fi';
import Link from 'next/link';

const Dropdown = ({
  triggerPosition,
  triggerClass = 'avatar-sm',
  triggerIcon,
  triggerText,
  dropdownItems = [],
  dropdownPosition = 'dropdown-menu-end',
  dropdownAutoClose,
  dropdownParentStyle,
  tooltipTitle,
  dropdownMenuStyle,
  iconStrokeWidth = 1.7,
  isItemIcon = true,
  isAvatar = true,
}) => {
  return (
    <div className={`filter-dropdown ${dropdownParentStyle || ''}`}>
      {/* Dropdown Trigger */}
      {tooltipTitle ? (
        <span
          className="d-flex c-pounter"
          data-bs-toggle="dropdown"
          data-bs-offset={triggerPosition}
          data-bs-auto-close={dropdownAutoClose}
        >
          <div className={`avatar-text ${triggerClass}`}>
            {triggerIcon || <FiMoreVertical />} {triggerText}
          </div>
        </span>
      ) : (
        <button
          type="button"
          className={`avatar-text ${triggerClass}`}
          data-bs-toggle="dropdown"
          data-bs-offset={triggerPosition}
          data-bs-auto-close={dropdownAutoClose}
        >
          {triggerIcon || <FiMoreVertical />} {triggerText}
        </button>
      )}

      {/* Dropdown Menu */}
      <ul className={`dropdown-menu ${dropdownMenuStyle || ''} ${dropdownPosition}`}>
        {dropdownItems.map((item, index) => {
          if (item.type === 'divider') {
            return <li className="dropdown-divider" key={index} />;
          }

          return (
            <li key={index}>
              {item.checkbox ? (
                <Checkbox
                  checked={item.checked}
                  id={item.id}
                  name={item.label}
                  className=""
                />
              ) : (
                <button
                  type="button"
                  className={`dropdown-item ${
                    item.active ? 'active' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Link varsa
                    if (item.link) {
                      window.open(item.link, '_blank');
                      return;
                    }

                    // Modal varsa (Bootstrap uyumlu)
                    if (item.modalTarget && window.bootstrap) {
                      const modalEl = document.querySelector(item.modalTarget);
                      if (modalEl) {
                        const modal = new window.bootstrap.Modal(modalEl);
                        modal.show();
                      }
                      return;
                    }

                    // Normal action (Teams -> Sil gibi)
                    item.onClick?.();
                  }}
                >
                  {isItemIcon ? (
                    item.icon &&
                    React.cloneElement(item.icon, {
                      className: 'me-3',
                      size: 16,
                      strokeWidth: iconStrokeWidth,
                    })
                  ) : (
                    <span
                      className={`wd-7 ht-7 rounded-circle me-3 ${item.color || ''}`}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dropdown;
