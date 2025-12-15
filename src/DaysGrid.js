import { Box, Button, Typography } from "@mui/material";
import NepaliDateUtils from "./utils/DateUtils";
import { WEEKDAYS_SHORT_NEPALI } from "./constants/DateConstants";

/**
 * DaysGrid
 * ----------
 * Renders:
 * 1. Weekday header (7 days)
 * 2. Calendar day grid (7 columns)
 *
 * Uses CSS grid instead of MUI Grid for correct 7-column layout
 */
const DaysGrid = ({
  year,
  month,
  unicode,
  selected = [],
  today,
  isDisabled = () => false,
  isInRange = () => false,
  onSelect,
}) => {
  // Number of days in current BS month
  const daysInMonth = NepaliDateUtils.getDaysInBSMonth(year, month - 1);

  // Day index of 1st of the month (0 = Sunday)
  const startDay = NepaliDateUtils.BS2AD(year, month, 1).getDay();

  // Build calendar cells (null = empty before month starts)
  const cells = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      year,
      month,
      day: i + 1,
    })),
  ];

  return (
    <Box px={1} pb={1}>
      {/* ===== Weekdays Header (7 columns) ===== */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        mb={0.5}
      >
        {WEEKDAYS_SHORT_NEPALI.map((d) => (
          <Typography
            key={d}
            align="center"
            variant="caption"
            fontWeight="bold"
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* ===== Days Grid (7 columns) ===== */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gap={0.5}
      >
        {cells.map((d, i) => {
          if (!d) return <Box key={i} />;

          const isSelected = selected.some(
            (x) =>
              x.year === d.year &&
              x.month === d.month &&
              x.day === d.day
          );

          return (
            <Button
              key={i}
              size="small"
              onClick={() => onSelect(d)}
              disabled={isDisabled(d)}
              variant={
                isSelected
                  ? "contained"
                  : isInRange(d)
                  ? "outlined"
                  : "text"
              }
              sx={{
                minWidth: 0,
                height: 34,
                fontWeight: isSelected ? "bold" : "normal",
              }}
            >
              {unicode
                ? NepaliDateUtils.toNepaliNumber(d.day)
                : d.day}
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default DaysGrid;
