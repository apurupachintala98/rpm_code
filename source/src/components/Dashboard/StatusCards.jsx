
import { Box, Paper, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useTheme } from '@mui/material/styles';

/**
 * StatusCards
 * props:
 *  - items: [{ id: 'draft'|'submitted'|'reviewed'|'approved', label, value }]
 *  - onCardClick?: (id) => void
 *  - onFilterClick?: (statusId) => void  // NEW: called when arrow icon is clicked
 *  - showMenuIcon?: boolean
 *  - cardWidth?: number
 *  - cardHeight?: number
 */
export default function StatusCards({
  items = [],
  onCardClick,
  onFilterClick,
  showMenuIcon = true,
  cardWidth = 260,
  cardHeight = 116,
}) {
  const theme = useTheme();
  const colors = theme.palette.statusColors || {};

  // only 4 tiles like the mock
  const normalized = items.slice(0, 4);

  // Number/label color by status (matches your screenshot tones)
  const tone = {
    draft:     { number: '#7A5A00', label: '#6B5A00' },
    submitted: { number: '#0B6B3A', label: '#0B6B3A' },
    reviewed:  { number: '#C62828', label: '#C62828' },
    approved:  { number: '#1565FF', label: '#1565FF' },
  };

  // Hover badge colors (slightly darker than the card background)
  // These show on hover/click of the chevron area
  const badgeHover = {
    draft:     '#E7BE4A', // darker yellow
    submitted: '#A9D8BD', // darker mint green
    reviewed:  '#F4B9CD', // darker pink
    approved:  '#B3CCFF', // darker light blue
  };

  return (
    <Box
      sx={{
        mt: 0.3,
        display: 'grid',
        gridTemplateColumns: `repeat(4, ${cardWidth}px)`,
        justifyContent: 'start',
        gap: 2,
        '@media (max-width: 1100px)': {
          gridTemplateColumns: `repeat(2, ${cardWidth}px)`,
        },
        '@media (max-width: 560px)': {
          gridTemplateColumns: `repeat(1, ${cardWidth}px)`,
        },
      }}
    >
      {normalized.map(({ id, label, value }) => {
        const numColor = tone[id]?.number || '#1B1B1B';
        const labelColor = tone[id]?.label || 'text.secondary';
        const hoverBg = badgeHover[id] || 'rgba(0,0,0,0.06)';

        return (
          <Paper
            key={id}
            elevation={0}
            onClick={() => {
              if (onCardClick) onCardClick(id);
              if (onFilterClick) onFilterClick(id);
            }}
            sx={{
              position: 'relative',  // needed for bottom-right chevron
              width: cardWidth,
              height: cardHeight,
              borderRadius: 0,
              bgcolor: colors[id] || theme.palette.background.paper,
              border: '1px solid',
              borderColor: '#DADDE1',
              cursor: (onCardClick || onFilterClick) ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              px: 2,
              py: 1.25,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                width: '100%',
              }}
            >
              {/* Left: caption + number */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    textTransform: 'none',
                    color: labelColor,
                    fontSize: '0.85rem',
                    letterSpacing: 0.1,
                  }}
                >
                  {label}
                </Typography>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: '2.25rem',
                    lineHeight: 1.1,
                    mt: 0.5,
                    color: numColor,
                  }}
                >
                  {String(value).padStart(2, '0')}
                </Typography>
              </Box>
            </Box>

            {/* Bottom-right chevron area for ALL statuses:
                - Default: transparent bg, grey icon (like your second image)
                - Hover/Active: darker status-colored badge (like first image Draft) */}
            {showMenuIcon && (
              <Box
                role="button"
                aria-label={`Filter by ${label}`}
                onClick={(e) => {
                  e.stopPropagation(); // do not trigger card click when icon is clicked
                  if (onFilterClick) {
                    onFilterClick(id); // Call filter function with status id
                  }
                }}
                sx={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: 52,
                  height: 36,
                  bgcolor: 'transparent',          // default: no colored box
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 140ms ease',
                  // show darker badge on hover/click
                  '&:hover':  { bgcolor: hoverBg },
                  '&:active': { bgcolor: hoverBg },
                }}
              >
                <KeyboardArrowDownIcon
                  fontSize="small"
                  sx={{
                    color: 'rgba(0,0,0,0.55)',      // subtle grey by default
                    transition: 'color 140ms ease',
                  }}
                />
              </Box>
            )}
          </Paper>
        );
      })}
    </Box>
  );
}