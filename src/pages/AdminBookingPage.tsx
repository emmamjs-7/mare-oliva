import { useState, useMemo, useEffect } from "react";
import { Button, Col, Form, Row, Spinner, Modal } from "react-bootstrap";
import { useBookings } from "../utils/useBookings";
import { useAuth } from "../auth/AuthContext";
import type { Booking } from "../types/bookings";
import BookingsTable from "../parts/BookingsTable";
import { buildTimeSlots, isValidSlot } from "../utils/timeslots";

export default function AdminBookingsPage() {
  const { isAdmin } = useAuth();
  const [dateInput, setDateInput] = useState("");
  const date = (dateInput ?? "").slice(0, 10);

  const { items, loading, error, refresh, remove, update, deletingId } =
    useBookings({ date: date || undefined });

  const [edit, setEdit] = useState<Booking | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isAdmin) return <p className="text-center py-5">Admin access required.</p>;

  async function onDelete(b: Booking) {
    if (!b.id) return;
    if (!confirm(`Delete "${b.name}" on ${b.date.slice(0, 10)} at ${b.time.slice(0, 5)}?`)) return;
    try { await remove(b.id); } catch { alert("Delete failed"); }
  }
  const editDate = edit?.date?.slice(0, 10) ?? "";
  const editTime = edit?.time?.slice(0, 5) ?? "";

  const bookedTimesForDate = useMemo(
    () =>
      items
        .filter(b => b.id !== edit?.id && b.date.slice(0, 10) === editDate)
        .map(b => b.time.slice(0, 5)),
    [items, edit?.id, editDate]
  );

  const timeOptions = useMemo(() => {
    const opts = buildTimeSlots(editDate, bookedTimesForDate);
    if (editTime && !opts.includes(editTime) && isValidSlot(editTime)) {
      return [editTime, ...opts];
    }
    return opts;
  }, [editDate, bookedTimesForDate, editTime]);

  useEffect(() => {
    if (!edit) return;
    const hhmm = (edit.time ?? "").slice(0, 5);
    if (editDate && hhmm && !timeOptions.includes(hhmm)) {
      setEdit({ ...edit, time: "" as any });
    }
  }, [editDate, timeOptions]);

  async function saveEdit() {
    if (!edit?.id) return;

    const safeDate = edit.date.slice(0, 10);
    const safeTime = (edit.time ?? "").slice(0, 5);

    if (!safeTime || !isValidSlot(safeTime)) {
      alert("Välj en tid inom öppettiderna i 20-minutersintervall.");
      return;
    }
    if (
      items.some(
        b =>
          b.id !== edit.id &&
          b.date.slice(0, 10) === safeDate &&
          b.time.slice(0, 5) === safeTime
      )
    ) {
      alert("Tiden är redan bokad.");
      return;
    }

    setSaving(true);
    try {
      await update(edit.id, {
        name: edit.name.trim(),
        date: safeDate,
        time: safeTime,
      });
      setEdit(null);
    } catch {
      alert("Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-4">
      <Row className="align-items-end g-3 mb-3">
        <Col xs={12} md="auto"><h2 className="mb-0">Bookings</h2></Col>
        <Col xs={12} md={3}>
          <Form.Label htmlFor="date">Filter by date</Form.Label>
          <Form.Control
            id="date"
            type="date"
            value={date}
            onChange={e => setDateInput(e.currentTarget.value)}
          />
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="secondary" onClick={refresh} disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Search"}
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => setDateInput("")}
            disabled={!date || loading}
          >
            Clear
          </Button>
        </Col>
      </Row>

      {error && <div className="text-danger mb-3">Error: {error}</div>}

      <BookingsTable
        items={items}
        showName
        canEdit
        canDelete
        deletingId={deletingId ?? undefined}
        onEdit={(b) => setEdit(b)}
        onDelete={onDelete}
      />

      <Modal show={!!edit} onHide={() => setEdit(null)} centered>
        <Modal.Header closeButton><Modal.Title>Edit booking</Modal.Title></Modal.Header>
        <Modal.Body>
          {edit && (
            <Form className="d-grid gap-3">
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  value={edit.name}
                  onChange={(e) => setEdit({ ...edit, name: e.currentTarget.value })}
                />
              </Form.Group>
              <Row className="g-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={editDate}
                      onChange={(e) => setEdit({ ...edit, date: e.currentTarget.value })}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Time</Form.Label>
                    <Form.Select
                      value={editTime}
                      onChange={(e) => setEdit({ ...edit!, time: e.currentTarget.value })}
                      disabled={!editDate}
                    >
                      {(!editDate || timeOptions.length === 0) && (
                        <option value="" disabled>
                          {editDate ? "No available times" : "Select a date first"}
                        </option>
                      )}
                      {timeOptions.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEdit(null)} disabled={saving}>Cancel</Button>
          <Button variant="primary" onClick={saveEdit} disabled={saving || !edit?.name.trim()}>
            {saving ? <Spinner size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
