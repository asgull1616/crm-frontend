import React from 'react'

const TablePagination = ({table}) => {
    return (
        <div className="row gy-2">
            <div className="col-sm-12 col-md-5 p-0">
                <div className="dataTables_info text-lg-start text-center" id="proposalList_info" role="status" aria-live="polite">1–10 arası gösteriliyor</div>
            </div>
            <div className="col-sm-12 col-md-7 p-0">
                <div className="dataTables_paginate paging_simple_numbers" id="proposalList_paginate">
                    <ul className="pagination mb-0 justify-content-md-end justify-content-center">
                        <li className={`paginate_button page-item previous ${!table.getCanPreviousPage() ? "disabled" : ""} `}
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <a href="#" className="page-link">Geri</a></li>
                       <li className="paginate_button page-item active">
  <a
    href="#"
    className="page-link"
    style={{
      backgroundColor: "#E92B63",
      borderColor: "#E92B63",
      color: "#fff",
    }}
  >
    {table.getState().pagination.pageIndex + 1}
  </a>
</li>

                        <li className={`paginate_button page-item next ${!table.getCanNextPage() ? "disabled" : ""}`}
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <a href="#" className="page-link">İleri</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TablePagination