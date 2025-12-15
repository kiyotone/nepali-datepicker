import React from "react";
import { Box, Button } from "@mui/material";
import { NEPALI_MONTHS, NEPALI_MONTHS_NEPALI } from "./constants/DateConstants";

const MonthGrid = ({ month, unicode, onMonthSelect }) => {
  const months = unicode ? NEPALI_MONTHS_NEPALI : NEPALI_MONTHS;

  return (
    <Box
      px={1}
      pb={1}
      display="grid"
      gridTemplateColumns="repeat(4, 1fr)"
      gap={0.5}
    >
      {months.map((m, i) => (
        <Button
          key={i}
          fullWidth
          size="small"
          variant={month === i + 1 ? "contained" : "text"}
          onClick={() => onMonthSelect(i + 1)}
          sx={{
            minWidth: 0,
            height: 34,
            fontWeight: month === i + 1 ? "bold" : "normal",
          }}
        >
          {m}
        </Button>
      ))}
    </Box>
  );
};

export default MonthGrid;
