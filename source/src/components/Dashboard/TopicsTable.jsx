import React, { useMemo, useState } from 'react';
import {
  Paper, Box, Typography, Chip, FormControl, Select, MenuItem,
  Table, TableHead, TableRow, TableCell, TableBody, TableContainer,
  IconButton
} from '@mui/material';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckIcon from '@mui/icons-material/Check';

// ---------- Footer colors ----------
const FOOTER_BG = '#E5E7EB';
const FOOTER_BORDER = '#DADDE1';
const FOOTER_TEXT = '#4B4B4B';
const CONTROL_BG = '#FFFFFF';

/** Format as dd-MMM-yy (e.g., 30-Oct-25) */
function formatDate(dateLike) {
  const d = new Date(dateLike);
  const day = String(d.getDate()).padStart(2, '0');
  const mon = d.toLocaleString('en-US', { month: 'short' });
  const yy = String(d.getFullYear()).slice(-2);
  return `${day}-${mon}-${yy}`;
}

/**
 * Header sort toggle with side-by-side ↑↓ arrows and tri-state cycle:
 *   click cycles: asc (↑) -> desc (↓) -> none (↑↓)
 *   dark grey arrows (#4B4B4B), NO circular background; minimal spacing.
 */
function HeaderSortToggle({ title, column, sortBy, sortDir, onToggle }) {
  const ARROW_COLOR = '#4B4B4B';
  const SPACING_PX = 2; // tiny gap; set 0 for fully flush

  const isActive = sortBy === column;

  const renderArrows = () => {
    if (!isActive || !sortDir) {
      // neutral: both arrows side-by-side
      return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
          <Typography sx={{ color: ARROW_COLOR, fontSize: '0.9rem', mr: `${SPACING_PX}px` }}>↑</Typography>
          <Typography sx={{ color: ARROW_COLOR, fontSize: '0.9rem' }}>↓</Typography>
        </Box>
      );
    }
    if (sortDir === 'asc') {
      return <Typography sx={{ color: ARROW_COLOR, fontSize: '0.9rem' }}>↑</Typography>;
    }
    return <Typography sx={{ color: ARROW_COLOR, fontSize: '0.9rem' }}>↓</Typography>;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ fontWeight: 600, fontSize: 'inherit' }}>{title}</Typography>

      {/* Entire arrow area is clickable to cycle */}
      <Box
        role="button"
        aria-label={`toggle sort for ${title}`}
        onClick={() => onToggle(column)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {renderArrows()}
      </Box>
    </Box>
  );
}

/** Cycle sort state: asc -> desc -> none (null)
 *  If switching to a new column, start with asc.
 */
function cycleSort(col, sortBy, sortDir, setSortBy, setSortDir) {
  if (sortBy !== col) {
    setSortBy(col);
    setSortDir('asc');
    return;
  }
  if (sortDir === 'asc') {
    setSortDir('desc');
  } else if (sortDir === 'desc') {
    setSortBy(null);
    setSortDir(null);
  } else {
    setSortDir('asc');
    setSortBy(col);
  }
}

export default function TopicsTable({
  rows = [],
  statuses = ['All', 'Open', 'Closed', 'In Progress'], // pass your own array (MUST include "All")
  multiSelect = true,
  heightPx = 667,
  onRowClick,
  statusFilter, // NEW: external filter from StatusCards (overrides dropdown selection)
  onClearFilter, // NEW: callback to clear external filter
}) {
  // ---------- State ----------
  const [selectedStatuses, setSelectedStatuses] = useState([]); // default: empty -> table shows all
  const [statusOpen, setStatusOpen] = useState(false);

  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState(null);

  const [rowsPerPage, setRpp] = useState(100);
  const [page, setPage] = useState(0);

  // Optional: show chip text based on selection (null when default)
  const allOtherStatuses = useMemo(
    () => statuses.filter((s) => s !== 'All'),
    [statuses]
  );

  const effectiveSelection = useMemo(() => {
    // Normalize to array for filtering
    return Array.isArray(selectedStatuses)
      ? selectedStatuses
      : selectedStatuses
        ? [selectedStatuses]
        : [];
  }, [selectedStatuses]);

  // Default view when empty OR full selection
  const isDefaultView = useMemo(() => {
    return (
      effectiveSelection.length === 0 ||
      (allOtherStatuses.length > 0 &&
        allOtherStatuses.every((s) => effectiveSelection.includes(s)))
    );
  }, [effectiveSelection, allOtherStatuses]);

  // Note: Dropdown filter chip logic removed since external filter takes priority

  // ---------- Selection handlers ----------

  // Single-select handler (if you ever set multiSelect=false)
  const handleSingleChange = (value) => {
    if (value === 'All') {
      // Select all individual statuses; "All" is not stored
      setSelectedStatuses([...allOtherStatuses]);
    } else {
      setSelectedStatuses(value);
    }
    setPage(0);
  };

  // Multi-select toggle handler via mouse
  const toggleMultiOption = (opt) => {
    setSelectedStatuses((prev) => {
      const current = Array.isArray(prev) ? [...prev] : [];

      if (opt === 'All') {
        // Toggle between "select all" and "clear all"
        const allSelected =
          allOtherStatuses.length > 0 &&
          allOtherStatuses.every((s) => current.includes(s));
        return allSelected ? [] : [...allOtherStatuses];
      }

      // Toggle individual option
      const next = [...current];
      const idx = next.indexOf(opt);
      if (idx >= 0) next.splice(idx, 1);
      else next.push(opt);
      return next;
    });
    setPage(0);
  };

  // Helper: is option selected? (controls the tick icon)
  const isSelected = (opt) => {
    if (multiSelect) {
      const arr = Array.isArray(selectedStatuses) ? selectedStatuses : [];
      if (opt === 'All') {
        // "All" is shown as checked only when all individual statuses are selected
        return (
          allOtherStatuses.length > 0 &&
          allOtherStatuses.every((s) => arr.includes(s))
        );
      }
      return arr.includes(opt);
    }
    // Single select mode
    if (opt === 'All') {
      const arr = Array.isArray(selectedStatuses) ? selectedStatuses : [];
      const allOtherSelected =
        allOtherStatuses.length > 0 &&
        allOtherStatuses.every((s) => arr.includes(s));
      return allOtherSelected;
    }
    return Array.isArray(selectedStatuses)
      ? selectedStatuses.includes(opt)
      : selectedStatuses === opt;
  };

  // Always render "Select Status" in the field (placeholder)
  const renderFieldValue = () => 'Select Status';

  // The value prop shape depends on multiSelect
  const selectValue = multiSelect
    ? (Array.isArray(selectedStatuses) ? selectedStatuses : [])
    : selectedStatuses;

  // ---------- Sorting ----------
  const sortedRows = useMemo(() => {
    if (!sortBy || !sortDir) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      let av = a[sortBy];
      let bv = b[sortBy];
      // For dates
      if (sortBy === 'updatedAt') {
        av = new Date(av).getTime();
        bv = new Date(bv).getTime();
      }
      // String compare
      if (typeof av === 'string' && typeof bv === 'string') {
        const cmp = av.localeCompare(bv);
        return sortDir === 'asc' ? cmp : -cmp;
      }
      // Numeric/date compare
      const cmp = (av > bv) - (av < bv);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortBy, sortDir]);

  // ---------- Filtering ----------
  const visibleRows = useMemo(() => {
    // External filter from StatusCards takes priority
    if (statusFilter) {
      return sortedRows.filter((r) => r.status === statusFilter);
    }
    // Default view shows all rows
    if (isDefaultView) return sortedRows;
    // Filter by selected statuses
    return sortedRows.filter((r) => effectiveSelection.includes(r.status));
  }, [sortedRows, isDefaultView, effectiveSelection, statusFilter]);

  // ---------- Pagination ----------
  const total = visibleRows.length;
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
  const from = total === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(total, (page + 1) * rowsPerPage);

  const slice = useMemo(() => {
    const start = page * rowsPerPage;
    return visibleRows.slice(start, start + rowsPerPage);
  }, [visibleRows, page, rowsPerPage]);

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  // ---------- Render ----------
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        bgcolor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 0,
      }}
    >
      {/* Title row with Select Status at the right */}
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>My Topics</Typography>
            {statusFilter && (
              <Chip
                label={`Filtered by: ${statusFilter}`}
                size="small"
                color="primary"
                variant="outlined"
                onDelete={onClearFilter || (() => {})} // Clear external filter when X is clicked
                sx={{
                  height: 24,
                  fontSize: '0.75rem',
                  '& .MuiChip-deleteIcon': {
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }
                }}
              />
            )}
          </Box>

          {/* SELECT STATUS — ALWAYS shows "Select Status" in the field; not bold; no header in dropdown */}
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <Select
              open={statusOpen}
              onOpen={() => setStatusOpen(true)}
              onClose={() => setStatusOpen(false)}
              multiple={multiSelect}
              value={selectValue}
              onChange={(e) => {
                if (multiSelect) {
                  const raw = Array.isArray(e.target.value) ? e.target.value : [];
                  const current = Array.isArray(selectedStatuses) ? selectedStatuses : [];

                  if (raw.includes('All')) {
                    // Treat selecting/deselecting "All" via keyboard as a toggle
                    const allSelected =
                      allOtherStatuses.length > 0 &&
                      allOtherStatuses.every((s) => current.includes(s));
                    setSelectedStatuses(allSelected ? [] : [...allOtherStatuses]);
                  } else {
                    // Normal keyboard selection: ensure "All" is never stored
                    const val = raw.filter((v) => v !== 'All');
                    setSelectedStatuses(val);
                  }
                  setPage(0);
                } else {
                  handleSingleChange(e.target.value);
                }
              }}
              displayEmpty
              renderValue={renderFieldValue}
              inputProps={{ 'aria-label': 'Select Status' }}
              variant="outlined"
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                bgcolor: '#F3F4F6',
                borderRadius: 0,
                height: 36,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: statusOpen ? '#2563EB' : '#DADDE1', // blue outline while open
                  borderWidth: statusOpen ? '2px' : '1px',
                },
                '& .MuiSelect-icon': {
                  transform: statusOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 120ms ease',
                },
                '& .MuiSelect-select': {
                  fontWeight: 400, // not bold
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 0,
                    border: '1.5px solid #2563EB', // blue outline
                    boxShadow: 'none',
                  },
                },
              }}
            >
              {statuses.map((opt) => (
                <MenuItem
                  key={opt}
                  value={multiSelect ? opt : opt}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (multiSelect) toggleMultiOption(opt);
                    else handleSingleChange(opt);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1,
                    fontWeight: 400, // not bold
                    borderBottom:
                      opt === statuses[statuses.length - 1] ? 'none' : '1px solid #EFEFEF',
                  }}
                >
                  <Typography sx={{ color: '#1B1B1B', fontWeight: 400 }}>
                    {opt}
                  </Typography>
                  {isSelected(opt) && (
                    <CheckIcon sx={{ color: '#4B4B4B', fontSize: 18 }} />
                  )}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table with sticky full-grey header and vertical scrollbar in the data area */}
      <TableContainer
        sx={{
          maxHeight: heightPx,
          borderTop: '1px solid #E5E7EB',
          overflowX: 'hidden',
        }}
      >
        <Table stickyHeader size="small" sx={{ width: '100%' }}>
          <TableHead>
            <TableRow>
              {/* Name */}
              <TableCell
                width="30%"
                sx={{ bgcolor: '#E5E7EB', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}
              >
                <HeaderSortToggle
                  title="Name"
                  column="name"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onToggle={(col) => cycleSort(col, sortBy, sortDir, setSortBy, setSortDir)}
                />
              </TableCell>

              {/* Summary */}
              <TableCell
                width="35%"
                sx={{ bgcolor: '#E5E7EB', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}
              >
                <HeaderSortToggle
                  title="Summary"
                  column="summary"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onToggle={(col) => cycleSort(col, sortBy, sortDir, setSortBy, setSortDir)}
                />
              </TableCell>

              {/* Last updated Date */}
              <TableCell
                width="25%"
                sx={{ bgcolor: '#E5E7EB', fontWeight: 600, borderBottom: '1px solid #E5E7EB' }}
              >
                <HeaderSortToggle
                  title="Last Updated Date"
                  column="updatedAt"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onToggle={(col) => cycleSort(col, sortBy, sortDir, setSortBy, setSortDir)}
                />
              </TableCell>

              {/* Status */}
              <TableCell
                width="10%"
                sx={{
                  bgcolor: '#E5E7EB',
                  fontWeight: 600,
                  borderBottom: '1px solid #E5E7EB',
                  textAlign: 'center',
                }}
              >
                <HeaderSortToggle
                  title="Status"
                  column="status"
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onToggle={(col) => cycleSort(col, sortBy, sortDir, setSortBy, setSortDir)}
                />
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {slice.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  '& td': { borderBottom: '1px solid #E5E7EB' }, // thin row separators
                }}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {/* Name as blue underlined link */}
                <TableCell>
                  <Typography
                    component="span"
                    sx={{
                      color: '#1565FF',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    {row.name}
                  </Typography>
                </TableCell>

                {/* Summary (comma-separated → line breaks) */}
                <TableCell sx={{ color: '#4B4B4B', whiteSpace: 'pre-line' }}>
                  {row.summary.split(',').map((part, index, arr) => (
                    <span key={index}>
                      {part.trim()}
                      {index < arr.length - 1 && ',\n'}
                    </span>
                  ))}
                </TableCell>

                {/* Date dd-MMM-yy (e.g., 30-Oct-25) */}
                <TableCell sx={{ color: '#4B4B4B' }}>
                  {formatDate(row.updatedAt)}
                </TableCell>

                {/* Status */}
                <TableCell sx={{ color: '#4B4B4B', textAlign: 'center' }}>
                  {row.status}
                </TableCell>
              </TableRow>
            ))}

            {slice.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                    No topics found.
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Footer bar */}
      <Box
        sx={{
          bgcolor: FOOTER_BG,
          borderTop: `1px solid ${FOOTER_BORDER}`,
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto auto auto',
          alignItems: 'stretch',
        }}
      >
        {/* Items per page */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            height: 44,
            borderRight: `1px solid ${FOOTER_BORDER}`,
          }}
        >
          <Typography sx={{ color: FOOTER_TEXT }}>Items per page:</Typography>
          <Select
            size="small"
            value={rowsPerPage}
            onChange={(e) => { setRpp(parseInt(e.target.value, 10)); setPage(0); }}
            variant="outlined"
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              minWidth: 80,
              bgcolor: CONTROL_BG,
              borderRadius: 0,
              height: 28,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: FOOTER_BORDER },
            }}
          >
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </Box>

        {/* 1–100 of N items */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            color: FOOTER_TEXT,
            borderRight: `1px solid ${FOOTER_BORDER}`,
          }}
        >
          {`${from}–${to} of ${total} items`}
        </Box>

        {/* "page ▾ of X pages" */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            borderRight: `1px solid ${FOOTER_BORDER}`,
          }}
        >
          <Select
            size="small"
            value={page + 1}
            onChange={(e) => setPage(Number(e.target.value) - 1)}
            variant="outlined"
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              minWidth: 60,
              bgcolor: CONTROL_BG,
              borderRadius: 0,
              height: 28,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: FOOTER_BORDER },
            }}
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
            ))}
          </Select>
          <Typography sx={{ color: FOOTER_TEXT }}>
            {`of ${totalPages} pages`}
          </Typography>
        </Box>

        {/* Prev */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRight: `1px solid ${FOOTER_BORDER}`,
          }}
        >
          <IconButton
            size="small"
            onClick={goPrev}
            disabled={page === 0}
            sx={{
              width: 28,
              height: 28,
              color: FOOTER_TEXT,
              bgcolor: CONTROL_BG,
              borderRadius: 0,
              '&.Mui-disabled': { color: '#9CA3AF', bgcolor: CONTROL_BG },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Next */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
          }}
        >
          <IconButton
            size="small"
            onClick={goNext}
            disabled={page >= totalPages - 1}
            sx={{
              width: 28,
              height: 28,
              color: FOOTER_TEXT,
              bgcolor: CONTROL_BG,
              borderRadius: 0,
              '&.Mui-disabled': { color: '#9CA3AF', bgcolor: CONTROL_BG },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
}
