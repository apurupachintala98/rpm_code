import { Button } from '@mui/material';

export default function HelpButton({
  onClick,
  children = 'Help',
  sx,
}) {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      disableElevation
      sx={{
        bgcolor: '#3C3C3C',          // dark gray from your reference
        color: '#FFFFFF',
        borderRadius: 0,              // ⬅️ square corners
        minWidth: 120,                // tune if you need wider/narrower
        height: 44,                   // consistent height with New Hypothesis
        px: 2,
        fontWeight: 500,
        fontSize: '1rem',
        textTransform: 'none',
        '&:hover': { bgcolor: '#2F2F2F' },
        '&:active': { bgcolor: '#262626' },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}
