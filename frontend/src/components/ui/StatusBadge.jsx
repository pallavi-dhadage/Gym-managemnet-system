// Shared reusable StatusBadge component
const STATUS_STYLES = {
  // Payment statuses
  Paid:      'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
  Pending:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  Failed:    'bg-red-500/10 text-red-400 border-red-500/20',
  Refunded:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  // Member statuses
  Active:    'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
  Inactive:  'bg-gray-500/10 text-gray-400 border-gray-500/20',
  Expiring:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
  // Enquiry statuses
  open:      'bg-blue-500/10 text-blue-400 border-blue-500/20',
  responded: 'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
  follow_up_due: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  converted: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  closed:    'bg-gray-500/10 text-gray-400 border-gray-500/20',
  // Equipment
  'Available':         'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
  'Under Maintenance': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Out of Service':    'bg-red-500/10 text-red-400 border-red-500/20',
  // Trainer
  'On Leave': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  // Offer
  'Upcoming': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Expired:    'bg-gray-500/10 text-gray-400 border-gray-500/20',
  // Equipment condition
  Good:         'bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/20',
  Fair:         'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Needs Repair':'bg-red-500/10 text-red-400 border-red-500/20',
};

const STATUS_LABELS = {
  open:          'Open',
  responded:     'Responded',
  follow_up_due: 'Follow-Up Due',
  converted:     'Converted',
  closed:        'Closed',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const styles = STATUS_STYLES[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  const label  = STATUS_LABELS[status] || status;
  const textSize = size === 'xs' ? 'text-xs' : 'text-xs';

  return (
    <span className={`${textSize} font-semibold px-2.5 py-0.5 rounded-full border ${styles}`}>
      {label}
    </span>
  );
}
