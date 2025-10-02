import { Table, Button, Spinner } from "react-bootstrap";
import type { Booking } from "../types/bookings";

type Props = {
  items: Booking[];
  showName?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  deletingId?: number | null;
  onEdit?: (b: Booking) => void;
  onDelete?: (b: Booking) => void;
};

export default function BookingsTable({
  items, showName = true, canEdit = true, canDelete = true,
  deletingId, onEdit, onDelete,
}: Props) {
  if (!items.length) return null;

  return (
    <div className="table-responsive shadow-sm rounded">
      <Table hover className="mb-0 align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ width: 120 }}>Date</th>
            <th style={{ width: 100 }}>Time</th>
            {showName && <th>Name</th>}
            {(canEdit || canDelete) && <th style={{ width: 220 }} className="text-end">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {items.map(b => {
            const d = (b.date ?? "").slice(0, 10);
            const t = (b.time ?? "").slice(0, 5);
            const busyDelete = deletingId === b.id;
            return (
              <tr key={b.id ?? `${d}T${t}-${b.name}`}>
                <td>{d}</td>
                <td>{t}</td>
                {showName && <td>{b.name}</td>}
                {(canEdit || canDelete) && (
                  <td className="text-end d-flex gap-2 justify-content-end">
                    {canEdit && (
                      <Button size="sm" variant="outline-primary" onClick={() => onEdit?.(b)}>
                        Edit
                      </Button>
                    )}
                    {canDelete && (
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => onDelete?.(b)}
                        disabled={busyDelete}
                      >
                        {busyDelete ? <Spinner size="sm" /> : "Delete"}
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
