import { useState } from 'react';
import {
  Paper, Box, Typography, Chip, Link, Divider, IconButton,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { feedItems } from '../../data.js';

/**
 * ActivityFeed – pixel-close replica of your image.
 * - Grey header strip with "Activity Feed"
 * - Three cards: Information, Announcement, Release Update
 * - Bulleted lists, "See More" links
 * - Footer pager: ‹ 1 2 3 … 10 › with active underline on 1
 */
export default function ActivityFeed() {
  const GREY = '#E5E7EB';
  const DIVIDER = '#DADDE1';
  const TEXT = '#1B1B1B';
  const MUTED = '#4B4B4B';
  const LINK_BLUE = '#1565FF';

  // Tag color mapping - easily configurable for API integration
  const getTagColor = (tagType) => {
    const colorMap = {
      'Information': '#D8EEFF',     // soft blue
      'Announcement': '#FFDBE8',    // soft pink
      'Release Notes': '#DDF3E6',   // soft green
      'Release Update': '#DDF3E6'   // soft green (alternative name)
    };
    return colorMap[tagType] || '#F0F0F0'; // default gray if tag type not found
  };

  // Adaptive pagination - works with any content from API
  const [currentPage, setCurrentPage] = useState(0);
  
  // Flexible content height estimation
  const estimateContentSize = (item) => {
    let size = 'medium'; // default
    
    // Calculate total content length
    const bodyLength = item.body ? item.body.length : 0;
    const bulletLength = item.bullets ? item.bullets.join('').length : 0;
    const footerLength = item.footer ? item.footer.length : 0;
    const totalLength = bodyLength + bulletLength + footerLength;
    
    // Classify content size
    if (totalLength > 400) {
      size = 'large';
    } else if (totalLength > 200) {
      size = 'medium';
    } else {
      size = 'small';
    }
    
    return size;
  };
  
  // Smart pagination that ensures all items are displayed
  const createDynamicPages = () => {
    const pages = [];
    let currentPageItems = [];
    let currentPageContentSize = 0;
    const maxPageContentSize = 1200; // Total content threshold per page
    
    feedItems.forEach((item, index) => {
      const itemSize = estimateContentSize(item);
      const itemWeight = itemSize === 'large' ? 500 : itemSize === 'medium' ? 250 : 150;
      
      // Check if we should start a new page
      const wouldExceedLimit = currentPageContentSize + itemWeight > maxPageContentSize;
      const hasMinimumItems = currentPageItems.length >= 2;
      const isLastItem = index === feedItems.length - 1;
      
      if (wouldExceedLimit && hasMinimumItems && !isLastItem) {
        // Start new page
        pages.push(currentPageItems);
        currentPageItems = [item];
        currentPageContentSize = itemWeight;
      } else {
        // Add to current page
        currentPageItems.push(item);
        currentPageContentSize += itemWeight;
      }
      
      // Ensure we don't have more than 6 items per page
      if (currentPageItems.length >= 6) {
        pages.push(currentPageItems);
        currentPageItems = [];
        currentPageContentSize = 0;
      }
    });
    
    // Add the last page if it has items
    if (currentPageItems.length > 0) {
      pages.push(currentPageItems);
    }
    
    return pages;
  };
  
  const dynamicPages = createDynamicPages();
  const totalPages = dynamicPages.length;
  const currentItems = dynamicPages[currentPage] || [];

  // State to track which items are expanded
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Toggle expand/collapse for an item
  const toggleExpand = (itemIndex) => {
    const newExpandedItems = new Set(expandedItems);
    if (newExpandedItems.has(itemIndex)) {
      newExpandedItems.delete(itemIndex);
    } else {
      newExpandedItems.add(itemIndex);
    }
    setExpandedItems(newExpandedItems);
  };

  // Check if content should be truncated (more than 200 characters)
  const shouldTruncate = (text) => text && text.length > 200;



  // Pagination navigation functions
  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const pagerButtonSx = {
    width: 28,
    height: 28,
    bgcolor: '#FFFFFF',
    color: '#4B4B4B',
    borderRadius: 0,
    border: '1px solid #DADDE1',
    '&:hover': { bgcolor: '#FFFFFF' },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${DIVIDER}`,
        borderRadius: 0,
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        height: 905, // Increased height for ActivityFeed
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header strip */}
      <Box sx={{ bgcolor: GREY, px: 2, py: 1, borderBottom: `1px solid ${DIVIDER}` }}>
        <Typography variant="body1" sx={{ fontWeight: 600, color: TEXT, fontSize: '0.9rem' }}>
          Activity Feed
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 1.5, flex: 1, overflowY: 'auto', paddingBottom: '60px' }}>
        {currentItems.map((item, index) => {
          // Calculate global index for dynamic pagination
          let globalIndex = 0;
          for (let i = 0; i < currentPage; i++) {
            globalIndex += dynamicPages[i].length;
          }
          globalIndex += index;
          const isExpanded = expandedItems.has(globalIndex);
          const needsTruncation = shouldTruncate(item.body);
          const displayText = needsTruncation && !isExpanded 
            ? item.body.substring(0, 200) + '...' 
            : item.body;

          return (
            <div key={`${currentPage}-${index}`}>
              <FeedCard
                tag={item.tag}
                tagBg={getTagColor(item.tag)}
                title={item.tag === 'Release Notes' ? (
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
                    <Typography component="span" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>{'</>'}</Typography>
                    <Typography component="span" sx={{ fontWeight: 600 }}>{item.title}</Typography>
                  </Box>
                ) : item.title}
              >
                {/* Body text (for Information and Announcement with intro) */}
                {item.body && (
                  <Typography variant="body2" sx={{ color: MUTED, mb: item.bullets ? 1 : 1.5 }}>
                    {displayText}
                  </Typography>
                )}

                {/* Bullet points (for Announcement and Release Notes) */}
                {item.bullets && (
                  <Box component="ul" sx={{ m: 0, pl: 3, color: MUTED, mb: item.footer ? 1.25 : 1.5 }}>
                    {item.bullets.map((bullet, idx) => (
                      <li key={idx}>
                        <Typography variant="body2">
                          {bullet.includes('–') ? (
                            <>
                              <strong>{bullet.split(' –')[0]}</strong> – {bullet.split(' –')[1]}
                            </>
                          ) : (
                            bullet
                          )}
                        </Typography>
                      </li>
                    ))}
                  </Box>
                )}

                {/* Footer text (for Announcement) */}
                {item.footer && (
                  <Typography variant="body2" sx={{ color: MUTED, mt: 1.25, mb: 1.5 }}>
                    {item.footer}
                  </Typography>
                )}

                {needsTruncation && (
                  <SeeMore 
                    isExpanded={isExpanded}
                    onToggle={() => toggleExpand(globalIndex)}
                  />
                )}
                {!needsTruncation && <SeeMore />}
              </FeedCard>
              {index < currentItems.length - 1 && <Divider sx={{ my: 2, borderColor: DIVIDER }} />}
            </div>
          );
        })}
      </Box>

      {/* Pager */}
      <Box
        sx={{
          px: 2, py: 1.25,
          borderTop: `1px solid ${DIVIDER}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 1.5,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: '#FFFFFF',
          zIndex: 10,
        }}
      >
        <IconButton 
          size="small" 
          sx={{...pagerButtonSx, opacity: currentPage === 0 ? 0.4 : 1}} 
          onClick={goToPrevPage}
          disabled={currentPage === 0}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>

        {Array.from({ length: totalPages }, (_, index) => (
          <PagerNumber 
            key={index} 
            active={index === currentPage}
            onClick={() => goToPage(index)}
          >
            {index + 1}
          </PagerNumber>
        ))}

        <IconButton 
          size="small" 
          sx={{...pagerButtonSx, opacity: currentPage === totalPages - 1 ? 0.4 : 1}} 
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );

  // --- inner components ---

  function FeedCard({ tag, tagBg, title, children }) {
    return (
      <Box sx={{ mb: 2 }}>
        {/* Tag + Title */}
        <Box sx={{ mb: 1 }}>
          <Chip
            size="small"
            label={tag}
            sx={{
              bgcolor: tagBg,
              color: '#1B1B1B',
              height: 22,
              '& .MuiChip-label': { px: 0.75, fontSize: '0.75rem' },
              borderRadius: 9999,
              mb: 0.5,
              display: 'inline-block',
              width: 'fit-content'
            }}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1B1B1B' }}>
            {title}
          </Typography>
        </Box>

        {children}
      </Box>
    );
  }

  function SeeMore({ isExpanded, onToggle }) {
    return (
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (onToggle) {
            onToggle();
          }
        }}
        sx={{ color: LINK_BLUE, fontWeight: 600, mt: 1.25, display: 'inline-block' }}
      >
        {onToggle ? (isExpanded ? 'See Less' : 'See More') : 'See More'}
      </Link>
    );
  }

  function PagerNumber({ children, active = false, onClick }) {
    return (
      <Box
        onClick={onClick}
        sx={{
          minWidth: 24,
          textAlign: 'center',
          color: MUTED,
          cursor: 'pointer',
          px: 0.5,
          ...(active
            ? { color: '#1B1B1B', borderBottom: `3px solid ${LINK_BLUE}`, pb: 0.25 }
            : {}),
        }}
      >
        <Typography variant="body2">{children}</Typography>
      </Box>
    );
  }
}
