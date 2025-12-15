import React, { useState, useRef } from "react";
import { Box, Popover } from "@mui/material";
import PickerInput from "./PickerInput";
import PickerHeader from "./PickerHeader";
import DaysGrid from "./DaysGrid";
import MonthGrid from "./MonthGrid";
import YearGrid from "./YearGrid";
import NepaliDateUtils from "./utils/DateUtils";

const NepaliDatePicker = ({ value = "", onChange, placeholder = "२०८२-०८-२६", unicode = true, range = false }) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("day"); // day, month, year
  const [year, setYear] = useState(2082);
  const [month, setMonth] = useState(8);
  const [selected, setSelected] = useState([]);

  const today = NepaliDateUtils.AD2BS(new Date());

  const formatBSDate = (d) =>
    `${unicode ? NepaliDateUtils.toNepaliNumber(d.year) : d.year}-${
      unicode ? NepaliDateUtils.toNepaliNumber(String(d.month).padStart(2, "0")) : String(d.month).padStart(2, "0")
    }-${unicode ? NepaliDateUtils.toNepaliNumber(String(d.day).padStart(2, "0")) : String(d.day).padStart(2, "0")}`;

  const compare = (a, b) => new Date(a.year, a.month - 1, a.day) - new Date(b.year, b.month - 1, b.day);

  const handleSelect = (d) => {
    if (!range) {
      setSelected([d]);
      onChange?.(formatBSDate(d));
      setOpen(false);
      return;
    }
    if (selected.length === 0 || selected.length === 2) {
      setSelected([d]);
      return;
    }
    const start = selected[0];
    const end = compare(d, start) < 0 ? start : d;
    const newStart = compare(d, start) < 0 ? d : start;
    setSelected([newStart, end]);
    onChange?.(`${formatBSDate(newStart)} - ${formatBSDate(end)}`);
    setOpen(false);
  };

  const isInRange = (d) => {
    if (selected.length !== 2) return false;
    return compare(d, selected[0]) >= 0 && compare(d, selected[1]) <= 0;
  };

  const handlePrev = () => {
    if (mode === "day") month === 1 ? (setMonth(12), setYear(year - 1)) : setMonth(month - 1);
    if (mode === "month") setYear(year - 1);
    if (mode === "year") setYear(year - 12);
  };

  const handleNext = () => {
    if (mode === "day") month === 12 ? (setMonth(1), setYear(year + 1)) : setMonth(month + 1);
    if (mode === "month") setYear(year + 1);
    if (mode === "year") setYear(year + 12);
  };

  const handleCenterClick = () => {
    if (mode === "day") setMode("month");
    else if (mode === "month") setMode("year");
    else setMode("day");
  };

  return (
    <>
      <Box ref={anchorRef}>
        <PickerInput value={value} placeholder={placeholder} onOpen={() => setOpen(true)} />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorRef.current}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box width={280} p={1}>
          <PickerHeader
            mode={mode}
            year={year}
            month={month}
            unicode={unicode}
            onPrev={handlePrev}
            onNext={handleNext}
            onCenterClick={handleCenterClick}
          />

          {mode === "day" && (
            <Box mt={0.5}>
              <DaysGrid
                year={year}
                month={month}
                unicode={unicode}
                selected={selected}
                today={today}
                onSelect={handleSelect}
                isDisabled={() => false}
                isInRange={isInRange}
              />
            </Box>
          )}

          {mode === "month" && (
            <Box mt={0.5}>
              <MonthGrid
                month={month}
                unicode={unicode}
                onMonthSelect={(m) => {
                  setMonth(m);
                  setMode("day");
                }}
              />
            </Box>
          )}

          {mode === "year" && (
            <Box mt={0.5}>
              <YearGrid
                year={year}
                unicode={unicode}
                onYearSelect={(y) => {
                  setYear(y);
                  setMode("month");
                }}
              />
            </Box>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NepaliDatePicker;
