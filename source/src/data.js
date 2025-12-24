
export const metrics = [
  { id: 'draft', label: 'Draft', value: 7 },
  { id: 'submitted', label: 'Submitted', value: 2 },
  { id: 'reviewed', label: 'Reviewed', value: 5 },
  { id: 'approved', label: 'Approved', value: 8 },
];

export const statusOptions = ['All', 'Draft', 'Submitted', 'Reviewed', 'Approved'];

export const topics = Array.from({ length: 25 }).map((_, i) => {
  let status;
  
  if (i < 5) status = 'Draft';           // Items 1-5: Draft
  else if (i < 10) status = 'Submitted'; // Items 6-10: Submitted  
  else if (i < 15) status = 'Reviewed';  // Items 11-15: Reviewed
  else if (i < 20) status = 'Approved';  // Items 16-20: Approved
  else status = 'Draft';                 // Items 21-25: Draft (extra ones)

  return {
    id: i + 1,
    name: `Topic Name ${i + 1}`,
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    status: status,
    updatedAt: '2025-10-30',
  };
});

export const feedItems = [
  {
    tag: 'Information',
    title: 'What is hypothesis?',
    body:
      'A Reimbursement Policy Hypothesis is a testable, evidence-based statement that predicts how a proposed or existing reimbursement policy will affect clinical, financial, operational, or member-experience outcomes.',
    link: '#',
  },
  {
    tag: 'Announcement',
    title: 'App Announcement',
    body:
      'We are excited to bring you a faster, smarter, and more intuitive app experience:',
    bullets: [
      'Brand-new Activity Feed – stay up-to-date with policy hypotheses, announcements and release notes.',
      'Reimbursement Policy Hypothesis Tracking – now you can search, view and monitor all active hypothesis in the app.'
    ],
    footer: 'Thank you for your continued feedback – this release is built for you!',
    link: '#',
  },
  {
    tag: 'Release Notes',
    title: 'v2.8.0 — 02 Dec 2025',
    bullets: [
      'Introduced Activity Feed with real-time announcements and hypothesis updates.',
      'Added Reimbursement Policy Hypothesis Module.',
      'Implemented global search across policies.'
    ],
    link: '#',
  },
  {
    tag: 'Information',
    title: 'Policy Guidelines Update',
    body:
      'New guidelines for policy evaluation and assessment procedures have been released. These comprehensive updates include enhanced criteria for evaluating policy effectiveness, streamlined assessment workflows, and improved documentation standards. The guidelines also incorporate feedback from healthcare professionals and policy experts to ensure practical implementation. Additionally, new compliance requirements have been established to maintain consistency across all policy evaluations. Training materials and resources are being developed to support teams in adopting these updated procedures.',
    link: '#',
  },
  {
    tag: 'Announcement',
    title: 'System Maintenance',
    body:
      'Scheduled maintenance window for system upgrades and performance improvements.',
    link: '#',
  },
  {
    tag: 'Release Notes',
    title: 'v2.9.0 — 10 Dec 2025',
    body:
      'Enhanced user interface with improved navigation and new dashboard features.',
    link: '#',
  },
  {
    tag: 'Information',
    title: 'Training Resources',
    body:
      'New training materials and documentation are now available to help you get started.',
    link: '#',
  },
  {
    tag: 'Announcement',
    title: 'Feature Enhancement',
    body:
      'We added speed improvements, guided steps, and better policy search.',
    link: '#',
  },
  {
    tag: 'Release Notes',
    title: 'v3.0.0 — 15 Dec 2025',
    body:
      'Major release with new collaboration features and enhanced workflow management.',
    link: '#',
  }
];
