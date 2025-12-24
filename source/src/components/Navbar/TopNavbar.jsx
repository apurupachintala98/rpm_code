
// src/Navbar/TopNavbar.jsx
import {
  AppBar, Toolbar, Box, Typography, IconButton, Avatar, Tooltip, alpha
} from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import elevanceLogo from '../../assets/Elevance_logo.png';

/**
 * TopNavbar
 * Props:
 *  - title: string
 *  - logoSrc: string (path in /public or a CDN URL)
 *  - userName?: string
 *  - onLogoutClick?: () => void
 */
export default function TopNavbar({
  title = 'MCM: Competitive Intelligence',
  userName = 'User Name',
  onLogoutClick,
}) {
  return (
    <AppBar position="sticky" color="primary" elevation={0}>
      <Toolbar sx={{ minHeight: 56, px: { xs: 2, md: 3 } }}>
        {/* Left: Enhanced Logo + Title Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2.5,
          '&:hover': {
            '& .logo': {
              transform: 'scale(1.05)',
            },
            '& .title': {
              textShadow: '0 2px 8px rgba(255,255,255,0.3)',
            }
          }
        }}>
          <Box
            component="img"
            src={elevanceLogo}
            alt="Elevance Health"
            className="logo"
            sx={{
              height: 32,
              display: 'block',
              objectFit: 'contain',
              filter: 'brightness(1.1) drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              animation: 'subtlePulse 3s ease-in-out infinite',
              '&:hover': {
                filter: 'brightness(1.2) drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              },
              '@keyframes subtlePulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.95 }
              }
            }}
          />
          
          {/* Vertical Divider */}
          <Box
            sx={{
              width: '1px',
              height: 30,
              backgroundColor: 'white',
              mx: 0.5
            }}
          />
          
          <Typography
            variant="h4"
            className="title"
            sx={{ 
              fontWeight: 550,
              color: 'common.white',
              fontSize: { xs: '1.25rem', md: '1.4rem' },
              letterSpacing: '0.5px',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -2,
                left: 0,
                width: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #ffffff, rgba(255,255,255,0.5))',
                transition: 'width 0.3s ease',
              },
              '&:hover': {
                textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)',
                transform: 'translateY(-1px)',
                '&::after': {
                  width: '100%',
                }
              }
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right: Enhanced User Section */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: { xs: 1.5, md: 2.5 },
          padding: '6px 12px',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: alpha('#ffffff', 0.05),
          }
        }}>
          <Typography
            variant="body2"
            sx={{ 
              color: 'rgba(255,255,255,0.95)', 
              display: { xs: 'none', sm: 'block' },
              fontWeight: 500,
              fontSize: { sm: '0.85rem', md: '0.9rem' },
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: '4px 8px',
              borderRadius: 1,
              '&:hover': {
                color: 'common.white',
                textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-1px)',
              }
            }}
          >
            {userName}
          </Typography>

          <Avatar
            sx={{
              width: 38,
              height: 38,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.1) 100%)',
              color: 'common.white',
              fontSize: 18,
              border: '2px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.1)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -2,
                left: -2,
                right: -2,
                bottom: -2,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              },
              '&:hover': {
                transform: 'translateY(-2px) scale(1.08)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.2)',
                borderColor: 'rgba(255,255,255,0.5)',
                '&::before': {
                  opacity: 1,
                },
                '& .MuiSvgIcon-root': {
                  transform: 'rotate(360deg)',
                }
              },
              '& .MuiSvgIcon-root': {
                transition: 'transform 0.6s ease',
              }
            }}
          >
            <PersonOutlinedIcon fontSize="small" />
          </Avatar>

          <Tooltip title="Logout" arrow placement="bottom">
            <IconButton
              size="medium"
              color="inherit"
              onClick={onLogoutClick}
              sx={{ 
                color: 'rgba(255,255,255,0.85)',
                bgcolor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                width: 40,
                height: 40,
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: 0,
                  height: 0,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(244, 67, 54, 0.3), transparent)',
                  transition: 'all 0.4s ease',
                  transform: 'translate(-50%, -50%)',
                },
                '&:hover': {
                  color: '#ffebee',
                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                  borderColor: 'rgba(244, 67, 54, 0.4)',
                  transform: 'translateY(-2px) scale(1.05)',
                  boxShadow: '0 6px 16px rgba(244, 67, 54, 0.25), 0 2px 8px rgba(0,0,0,0.15)',
                  '&::before': {
                    width: '100%',
                    height: '100%',
                  },
                  '& .MuiSvgIcon-root': {
                    transform: 'scale(1.1)',
                  }
                },
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.3s ease',
                  zIndex: 1,
                  position: 'relative',
                }
              }}
            >
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}