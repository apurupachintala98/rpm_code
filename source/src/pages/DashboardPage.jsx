// import { Container, Grid, Box, Typography } from '@mui/material';
// import StatusCards from '../components/StatusCards.jsx';
// import TopicsTable from '../components/TopicsTable.jsx';
// import ActivityFeed from '../components/ActivityFeed.jsx';
// import NewHypothesisButton from '../components/NewHypothesisButton.jsx';
// import HelpButton from '../components/HelpButton.jsx';
// import { useNavigate } from 'react-router-dom'
// import { metrics, topics, statusOptions, feedItems } from '../data.js';

// export default function DashboardPage() {
//   const lastLogin = new Date().toLocaleString();
//   const navigate = useNavigate();

//   return (
//     <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
//       <Box sx={{ py: 1, px: 3, width: '100%' }}>
//         {/* Actions and Last Login on same line */}
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
//           <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//             Last login: {lastLogin}
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <NewHypothesisButton onClick={() => navigate('new')} />
//             <HelpButton onClick={() => alert('Help')} />
//           </Box>
//         </Box>

//         {/* Two-column layout via CSS Grid:
//             - Left cell: StatusCards + TopicsTable (stacked)
//             - Right cell: ActivityFeed
//             This is a placement-only change. */}
//         <Box
//           sx={{
//             mt: 1,
//             display: 'grid',
//             gridTemplateColumns: '1fr 340px',  // Slightly smaller right column
//             gap: 8,                            // Reduced gap to bring ActivityFeed closer
//             alignItems: 'start',
//             // Stack on smaller screens
//             '@media (max-width: 1200px)': { gridTemplateColumns: '1fr' },
//           }}
//         >
//           {/* Left cell */}
//           <Box>
//             <StatusCards
//               items={metrics}
//               onCardClick={(id) => console.log('Card', id)}
//             />

//             <Box sx={{ mt: 1 }}>
//               <TopicsTable
//                 rows={topics}
//                 statuses={statusOptions}
//                 onRowClick={(row) => console.log('Row clicked:', row)}
//                 dense
//               />
//             </Box>
//           </Box>

//           {/* Right cell */}
//           <Box>
//             <ActivityFeed items={feedItems} />
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// }

import { useState } from 'react';
import { Container, Grid, Box, Typography } from '@mui/material';
import StatusCards from '../components/Dashboard/StatusCards.jsx';
import TopicsTable from '../components/Dashboard/TopicsTable.jsx';
import ActivityFeed from '../components/Dashboard/ActivityFeed.jsx';
import NewHypothesisButton from '../components/Hypothesis/NewHypothesisButton.jsx';
import HelpButton from '../components/Dashboard/HelpButton.jsx';
import { useNavigate } from 'react-router-dom';
import { metrics, topics, statusOptions, feedItems } from '../data.js';

export default function DashboardPage() {
  const lastLogin = new Date().toLocaleString();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState(null); // null means no filter

  // Handle status card filter click
  const handleStatusFilter = (statusId) => {
    // Map status IDs to the actual status values used in data
    const statusMap = {
      'draft': 'Draft',
      'submitted': 'Submitted', 
      'reviewed': 'Reviewed',
      'approved': 'Approved'
    };
    
    const filterValue = statusMap[statusId];
    // Toggle filter: if same status clicked, remove filter; otherwise apply new filter
    setStatusFilter(current => current === filterValue ? null : filterValue);
  };

  // Handle clearing the status filter (from chip X button)
  const handleClearFilter = () => {
    setStatusFilter(null);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <Box sx={{ py: 1, px: 3, width: '100%' }}>
        {/* Actions and Last Login on same line */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Last login: {lastLogin}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NewHypothesisButton onClick={() => navigate('new')} />
            <HelpButton onClick={() => alert('Help')} />
          </Box>
        </Box>

        {/* Two-column layout via CSS Grid:
            - Left cell: StatusCards + TopicsTable (stacked)
            - Right cell: ActivityFeed
            This is a placement-only change. */}
        <Box
          sx={{
            mt: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 340px',  // Slightly smaller right column
            gap: 8,                            // Reduced gap to bring ActivityFeed closer
            alignItems: 'start',
            // Stack on smaller screens
            '@media (max-width: 1200px)': { gridTemplateColumns: '1fr' },
          }}
        >
          {/* Left cell */}
          <Box>
            <StatusCards
              items={metrics}
              onCardClick={(id) => console.log('Card', id)}
              onFilterClick={handleStatusFilter}
            />

            <Box sx={{ mt: 1 }}>
              <TopicsTable
                rows={topics}
                statuses={statusOptions}
                onRowClick={(row) => console.log('Row clicked:', row)}
                statusFilter={statusFilter}
                onClearFilter={handleClearFilter}
                dense
              />
            </Box>
          </Box>

          {/* Right cell */}
          <Box>
            <ActivityFeed items={feedItems} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}