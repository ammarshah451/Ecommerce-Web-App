import { Dialog, Stack, Button, Divider, Typography } from "@mui/material";
import React from "react";

const ConfirmOrder = ({ open, closeHandler, handler }) => {
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
        You sure you want to place the order?
      </Typography>

      <Divider sx={{ marginBottom: "1.5rem" }} />

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
          onClick={handler}
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

export { ConfirmOrder };
