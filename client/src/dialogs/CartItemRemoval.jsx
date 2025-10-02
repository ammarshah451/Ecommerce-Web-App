import { Button, Dialog, Divider, Stack, Typography } from "@mui/material";
import React from "react";

const ItemRemovalFromCartDialog = ({
  details,
  open,
  closeHandler,
  cartHandler,
}) => {
  return (
    <Dialog
      open={open}
      onClose={closeHandler}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)", // Reduced opacity for a lighter backdrop
        },
      }}
      PaperProps={{
        sx: {
          padding: "2rem",
          borderRadius: "10px",
          backgroundColor: "#ffffff",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.2)",
          width: "400px",
        },
      }}
    >
      {/* Title */}
      <Typography
        id="confirm-dialog-title"
        variant="h6"
        sx={{
          fontWeight: 600,
          color: "#212121",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        Remove Item
      </Typography>

      <Divider sx={{ marginBottom: "1.5rem" }} />

      {/* Content */}
      <Typography
        id="confirm-dialog-description"
        sx={{
          fontSize: "1rem",
          color: "#424242",
          textAlign: "center",
          lineHeight: "1.6",
          marginBottom: "1.5rem",
        }}
      >
        Are you sure you want to remove{" "}
        <span style={{ fontWeight: 600, color: "#d32f2f" }}>
          {details.split(",")[1]}
        </span>{" "}
        from your cart?
      </Typography>

      {/* Action Buttons */}
      <Stack direction="row" justifyContent="space-evenly">
        <Button
          sx={{
            width: "120px",
            backgroundColor: "#1976d2",
            color: "#ffffff",
            fontWeight: 500,
            "&:hover": { backgroundColor: "#1565c0" },
          }}
          variant="contained"
          onClick={() => cartHandler(details.split(",")[0])}
        >
          Yes
        </Button>
        <Button
          color="error"
          sx={{
            width: "120px",
            fontWeight: 500,
            "&:hover": { backgroundColor: "#c62828" },
          }}
          variant="contained"
          onClick={closeHandler}
        >
          No
        </Button>
      </Stack>
    </Dialog>
  );
};

export default ItemRemovalFromCartDialog;
