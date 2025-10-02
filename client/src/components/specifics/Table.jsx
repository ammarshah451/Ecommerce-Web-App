import { DataGrid } from "@mui/x-data-grid";
import React from "react";
const Table = ({ rows, columns, heading, rowHeight, pageSize = 2 }) => {
  return (
    <section style={{ marginTop: "3rem" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowHeight={rowHeight}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSize={[5]}
        pageSizeOptions={[5, 10, 20]}
        style={{
          height: "100%",
          width: "100%",
        }}
        sx={{
          border: "none",
          ".table-header": {
            bgcolor: "white",
            color: "gray",
          },
        }}
      />
    </section>
  );
};

export default Table;
