import React from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

const Pagination = ({
  page = 1,
  totalPages = 1,
  onChange = () => {},
}) => {
  if (totalPages <= 1) return null;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <ul className="list-unstyled d-flex align-items-center gap-2 mb-0 pagination-common-style">
      {/* Previous */}
      <li>
        <button
          onClick={() => page > 1 && onChange(page - 1)}
          disabled={page === 1}
          className="bg-transparent border-0"
        >
          <BsArrowLeft size={16} />
        </button>
      </li>

      {/* Page Numbers */}
      {pages.map((p) => (
        <li key={p}>
          <button
            onClick={() => onChange(p)}
            className={`bg-transparent border-0 ${
              p === page ? "active" : ""
            }`}
          >
            {p}
          </button>
        </li>
      ))}

      {/* Next */}
      <li>
        <button
          onClick={() => page < totalPages && onChange(page + 1)}
          disabled={page === totalPages}
          className="bg-transparent border-0"
        >
          <BsArrowRight size={16} />
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
