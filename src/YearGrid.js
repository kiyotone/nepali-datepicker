import React from "react";
import { Box, Button } from "@mui/material";
import NepaliDateUtils from "./utils/DateUtils";

const YearGrid = ({ year, unicode, onYearSelect }) => {
  // Show 12-year grid, starting from the nearest decade
  const startYear = year - (year % 12);
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  return (
    <Box
      px={1}
      pb={1}
      display="grid"
      gridTemplateColumns="repeat(4, 1fr)"
      gap={0.5}
    >
      {years.map((y) => (
        <Button
          key={y}
          fullWidth
          size="small"
          variant={y === year ? "contained" : "text"}
          onClick={() => onYearSelect(y)}
          sx={{
            minWidth: 0,
            height: 34,
            fontWeight: y === year ? "bold" : "normal",
          }}
        >
          {unicode ? NepaliDateUtils.toNepaliNumber(y) : y}
        </Button>
      ))}
    </Box>
  );
};

export default YearGrid;
