import { XCircle } from "lucide-react";
import StatusBadge from "./StatusBadge";
import toast from "react-hot-toast";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BookingCard({ booking, onCancel }) {
  const canCancel = booking.booking_status === "booked";

  function handleCancel() {
    if (onCancel) onCancel(booking.booking_id);
    toast("Booking cancelled", { icon: "🚫" });
  }

  return (
    <div
      className={`bg-white rounded-2xl border p-4 sm:p-5 transition-shadow duration-200 hover:shadow-md ${
        booking.booking_status === "cancelled"
          ? "border-gray-100 opacity-70"
          : "border-gray-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        {/* Left: facility + details */}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
            {booking.facility_name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(booking.booking_date)} · {booking.booking_time_slot} · {booking.booking_group_size}{" "}
            {booking.booking_group_size === 1 ? "person" : "people"}
          </p>
          {booking.booking_cancel_reason && (
            <p className="mt-1 text-xs text-gray-400">
              {booking.booking_cancel_reason}
            </p>
          )}
        </div>

        {/* Right: status + cancel */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
          <StatusBadge status={booking.booking_status} fullWidth />
          {canCancel && (
            <button
              onClick={handleCancel}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              <XCircle size={13} />
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
