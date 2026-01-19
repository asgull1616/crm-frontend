"use client";

import React from "react";
import Checkbox from "./Checkbox";
import { FiMoreVertical } from "react-icons/fi";

const Dropdown = ({
  triggerPosition,
  triggerClass = "avatar-sm",
  triggerIcon,
  triggerText,
  dropdownItems = [],
  dropdownPosition = "dropdown-menu-end",
  dropdownAutoClose = "outside",
  dropdownParentStyle,
  tooltipTitle,
  dropdownMenuStyle,
  iconStrokeWidth = 1.7,
  isItemIcon = true,
}) => {
  const closeDropdown = () => {
    // Bootstrap dropdown'u güvenli şekilde kapat
    document.body.click();
  };

  return (
    <div
      className={`filter-dropdown dropdown ${dropdownParentStyle || ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Dropdown Trigger */}
      <button
        type="button"
        className={`avatar-text ${triggerClass}`}
        data-bs-toggle="dropdown"
        data-bs-offset={triggerPosition}
        data-bs-auto-close={dropdownAutoClose}
        onClick={(e) => e.stopPropagation()}
      >
        {triggerIcon || <FiMoreVertical />} {triggerText}
      </button>

      {/* Dropdown Menu */}
      <ul
        className={`dropdown-menu ${dropdownMenuStyle || ""} ${dropdownPosition}`}
        onClick={(e) => e.stopPropagation()}
      >
        {dropdownItems.map((item, index) => {
          if (item.type === "divider") {
            return <li className="dropdown-divider" key={index} />;
          }

          return (
            <li key={index}>
              {item.checkbox ? (
                <Checkbox
                  checked={item.checked}
                  id={item.id}
                  name={item.label}
                />
              ) : (
                <button
                  type="button"
                  className={`dropdown-item ${item.active ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (item.link) {
                      window.open(item.link, "_blank");
                      closeDropdown();
                      return;
                    }

                    if (item.modalTarget && window.bootstrap) {
                      const modalEl = document.querySelector(item.modalTarget);
                      if (modalEl) {
                        const modal =
                          window.bootstrap.Modal.getOrCreateInstance(modalEl);
                        modal.show();
                      }
                      closeDropdown();
                      return;
                    }

                    item.onClick?.();
                    closeDropdown();
                  }}
                >
                  {isItemIcon ? (
                    item.icon &&
                    React.cloneElement(item.icon, {
                      className: "me-3",
                      size: 16,
                      strokeWidth: iconStrokeWidth,
                    })
                  ) : (
                    <span
                      className={`wd-7 ht-7 rounded-circle me-3 ${item.color || ""}`}
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
