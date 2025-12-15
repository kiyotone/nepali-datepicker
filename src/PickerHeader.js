import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NepaliDateUtils from "./utils/DateUtils";
import { NEPALI_MONTHS, NEPALI_MONTHS_NEPALI } from "./constants/DateConstants";

const PickerHeader = ({
  year,
  month,
  unicode,
  mode, // "day" | "month" | "year"
  onPrev,
  onNext,
  onCenterClick,
}) => {
  const months = unicode ? NEPALI_MONTHS_NEPALI : NEPALI_MONTHS;


  const yearRangeStart = year - (year % 12);
  const yearRangeEnd = yearRangeStart + 11;
  const displayYearRange = unicode
    ? `${NepaliDateUtils.toNepaliNumber(yearRangeStart)} - ${NepaliDateUtils.toNepaliNumber(yearRangeEnd)}`
    : `${yearRangeStart} - ${yearRangeEnd}`;

    const displayYear = mode === "year" ? displayYearRange : unicode ? NepaliDateUtils.toNepaliNumber(year) : year;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      bgcolor="grey.100"
      px={1}
      py={0.5}
      borderRadius={1}
      mb={1.5}
    >
      {/* Previous */}
      <IconButton
        size="small"
        onClick={onPrev}
        sx={{ "&:focus": { outline: "none" } }}
      >
        <ArrowBackIosNewIcon fontSize="small" />
      </IconButton>

      {/* Center */}
      <Box
        textAlign="center"
        flexGrow={1}
        onClick={onCenterClick}
        sx={{ cursor: "pointer", userSelect: "none" }}
      >
        <Typography variant="subtitle1" fontWeight="bold">
          {displayYear}
        </Typography>
        {mode === "day" && (
          <Typography variant="body2">{months[month - 1]}</Typography>
        )}
      </Box>

      {/* Next */}
      <IconButton
        size="small"
        onClick={onNext}
        sx={{ "&:focus": { outline: "none" } }}
      >
        <ArrowForwardIosIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default PickerHeader;
