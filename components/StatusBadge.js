const STATUS_CONFIG = {
  'booked':     { label: 'Booked',     bg: 'bg-blue-100',   text: 'text-blue-700'   },
  'checked-in': { label: 'Checked In', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'no-show':    { label: 'No-Show',    bg: 'bg-red-100',    text: 'text-red-700'    },
  'cancelled':  { label: 'Cancelled',  bg: 'bg-gray-100',   text: 'text-gray-600'   },
  'open':       { label: 'Open',       bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'closed':     { label: 'Closed',     bg: 'bg-red-100',    text: 'text-red-700'    },
}

export default function StatusBadge({ status, fullWidth = false }) {
  const cfg = STATUS_CONFIG[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-600' }
  const display = fullWidth ? 'flex w-full justify-center rounded-lg' : 'inline-flex rounded-full'

  return (
    <span className={`${display} items-center px-2.5 py-1 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  )
}
