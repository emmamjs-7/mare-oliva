import { Spinner, Alert } from "react-bootstrap";
import { useAuth } from "../auth/AuthContext";
import { useBookings } from "../utils/useBookings";
import BookingsTable from "../parts/BookingsTable";
import type { Booking } from "../types/bookings";

export default function MyBookingsPage() {
  const { user, isLoading } = useAuth();

  const userId = user ? user.id : null;
  const { items: bookings, loading, error, remove, deletingId } = useBookings({
    mine: true,
    userId,
  });

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center py-5">Please log in to see your bookings.</p>;
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <Alert variant="danger" className="mb-3">Failed to load: {error}</Alert>
      </div>
    );
  }

  const handleDelete = async (b: Booking) => {
    const ok = window.confirm(`Delete booking ${b.date?.slice(0, 10)} ${b.time?.slice(0, 5)}?`);
    if (!ok) return;
    try { await remove(b.id); } catch (e: any) { alert(`Delete failed: ${e?.message ?? e}`); }
  };

  return (
    <div className="container py-4">
      <h2>My bookings</h2>
      <BookingsTable
        items={bookings}
        showName={false}
        canEdit={false}
        canDelete={true}
        deletingId={deletingId}
        onDelete={handleDelete}
      />
      {bookings.length === 0 && <p className="text-muted mt-3">No bookings yet.</p>}
    </div>
  );
}
