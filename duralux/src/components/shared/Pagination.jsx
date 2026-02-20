import Link from "next/link";
import React from "react";
import { BsArrowLeft, BsArrowRight, BsDot } from "react-icons/bs";

const Pagination = ({ page, totalPages, onChange }) => {
  // ✅ Eğer props GELMEDİYSE: eski davranış aynen devam etsin
  const hasDynamic = typeof page === "number" && typeof totalPages === "number" && typeof onChange === "function";

  // ✅ Eski statik pagination (hiç bir şey ellemiyoruz)
  if (!hasDynamic) {
    return (
      <ul className="list-unstyled d-flex align-items-center gap-2 mb-0 pagination-common-style">
        <li>
          <Link href="#"><BsArrowLeft size={16} /></Link>
        </li>
        <li><Link href="#" className="active">1</Link></li>
        <li><Link href="#">2</Link></li>
        <li>
          <Link href="#"><BsDot size={16} /></Link>
        </li>
        <li><Link href="#">8</Link></li>
        <li><Link href="#">9</Link></li>
        <li>
          <Link href="#"><BsArrowRight size={16} /></Link>
        </li>
      </ul>
    );
  }

  // ✅ Dinamik pagination (sadece LatestLeads gibi yerler kullanacak)
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const maxButtons = 7;

  if (totalPages <= maxButtons) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages);
  }

  const Btn = ({ children, disabled, active, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={active ? "active" : ""}
      style={{
        background: "transparent",
        border: 0,
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontWeight: active ? 800 : 600,
      }}
    >
      {children}
    </button>
  );

  return (
    <ul className="list-unstyled d-flex align-items-center gap-2 mb-0 pagination-common-style">
      <li>
        <Btn disabled={page === 1} onClick={() => onChange(page - 1)}>
          <BsArrowLeft size={16} />
        </Btn>
      </li>

      {pages.map((p, idx) => {
        if (p === "...") {
          return (
            <li key={`dot-${idx}`}>
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <BsDot size={16} />
              </span>
            </li>
          );
        }

        const isActive = p === page;

        return (
          <li key={p}>
            <Btn active={isActive} onClick={() => onChange(p)}>
              {p}
            </Btn>
          </li>
        );
      })}

      <li>
        <Btn disabled={page === totalPages} onClick={() => onChange(page + 1)}>
          <BsArrowRight size={16} />
        </Btn>
      </li>
    </ul>
  );
};

export default Pagination;
