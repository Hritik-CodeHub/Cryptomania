import React from "react";
import { Box } from "@mui/material";

const SelectButton = ({ children, selected, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: "1px solid gold",
        borderRadius: 1,
        px: 2.5,
        py: 1.2,
        fontFamily: "Montserrat",
        cursor: "pointer",
        backgroundColor: selected ? "gold" : "transparent",
        color: selected ? "black" : "white",
        fontWeight: selected ? 700 : 500,
        width: "22%",
        textAlign: "center",
        "&:hover": {
          backgroundColor: "gold",
          color: "black",
        },
        transition: "all 0.3s ease",
      }}
    >
      {children}
    </Box>
  );
};

export default SelectButton;
