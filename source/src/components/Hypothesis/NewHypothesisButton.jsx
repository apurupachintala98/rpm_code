import { Button, Stack, Typography } from '@mui/material';

export default function NewHypothesisButton({
  onClick,
  children = 'New Hypothesis',
  sx,
}) {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      disableElevation
      sx={{
        bgcolor: '#1565FF',           // blue from your reference
        color: '#FFFFFF',
        borderRadius: 0,              // ⬅️ square corners (no oval)
        minWidth: 180,                // tune as needed
        height: 44,                   // fixed height to match blocky look
        px: 2,                        // inner padding
        fontWeight: 500,
        fontSize: '1rem',
        textTransform: 'none',
        '&:hover': { bgcolor: '#1151CC' },
        '&:active': { bgcolor: '#0E44AD' },
        ...sx,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={3}>
        <Typography component="span" sx={{ lineHeight: 1 }}>
          {children}
        </Typography>
        <Typography component="span" sx={{ fontSize: '1.2rem', fontWeight: 600 }}>
          +
        </Typography>
      </Stack>
    </Button>
  );
}
