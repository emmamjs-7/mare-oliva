import { useMemo, useState } from "react";
import { Row, Col, Form, Button, Nav } from "react-bootstrap";
import { NavLink, useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import Calendar from "react-calendar";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import { fmtDate, parseDate, fmtTime } from "../utils/date";
import type { Booking } from "../types/bookings";
import {
  buildTimeSlots,
  isValidSlot,
} from "../utils/timeSlots";



BookingPage.route = {
  index: 3,
  path: "/booking",
  title: "Booking",
  requiresAdmin: false,
  menuLabel: "Book a table",
  loader: async ({ request }: { request: Request; }) => {
    try {
      const url = new URL(request.url);
      const dateParam = (url.searchParams.get("date") ?? "").slice(0, 10);
      if (!dateParam) return { bookings: [] as Booking[] };

      const res = await fetch(
        `/api/bookings?date=${encodeURIComponent(dateParam)}&$order=time&$limit=1000`,
        { credentials: "include" }
      );
      if (!res.ok) return { bookings: [] as Booking[] };

      const data = await res.json();
      const rows = Array.isArray(data) ? (data as Booking[]) : [];

      const normalized = rows.map((b) => ({
        ...b,
        date: (b.date ?? "").slice(0, 10),
        time: (b.time ?? "").slice(0, 5),
      }));

      normalized.sort((a, b) =>
        a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
      );

      return { bookings: normalized };
    } catch {
      return { bookings: [] as Booking[] };
    }
  },
};

export default function BookingPage() {
  const data = useLoaderData() as { bookings: Booking[]; } | undefined;
  const bookings = data?.bookings ?? [];

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  const selected = (params.get("date") ?? "").slice(0, 10);
  const justDate = selected ? parseDate(selected) : null;

  const [selectedTime, setSelectedTime] = useState<string>("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookedTimes = useMemo(() => {
    if (!selected) return [] as string[];
    return bookings
      .filter(b => (b.date ?? "").slice(0, 10) === selected)
      .map(b => (b.time ?? "").slice(0, 5));
  }, [bookings, selected]);


  const slots = useMemo(() => {
    if (!selected) return [] as string[];
    let s = buildTimeSlots(selected, bookedTimes);
    const todayStr = fmtDate(new Date());
    if (selected === todayStr) {
      const nowHHmm = fmtTime(new Date());
      s = s.filter((t) => t > nowHHmm);
    }
    return s;
  }, [selected, bookedTimes]);

  const pickDay = (day: Date) => {
    setSelectedTime("");
    navigate(`/booking?date=${fmtDate(day)}`);
  };

  const pickTime = (slot: string) => {
    if (bookedTimes.includes(slot)) return;
    setSelectedTime(slot);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!justDate || !selectedTime || !name.trim() || isSubmitting) return;

    if (!isValidSlot(selectedTime)) {
      toast.error("Choose a time within opening time.");
      return;
    }

    setIsSubmitting(true);
    try {
      const uid = Number(user?.id);
      if (!Number.isFinite(uid)) {
        toast.error("Not logged in.");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        date: fmtDate(justDate),
        time: selectedTime,
        name: name.trim(),
        user_id: uid,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("POST /api/bookings failed", res.status, text);
        toast.error("Booking failed, please try again later.");
        setIsSubmitting(false);
        return;
      }

      setName("");
      toast.success(`Booking successful! ${payload.date} • ${payload.time}`);
      navigate(`/mypage`, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return null;

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} className="text-center">
            <h3>Please sign in to book a table</h3>
            <p className="text-muted">You need an account to make a booking.</p>
            <NavLink to="/login">Go to login</NavLink>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="container">
      {!justDate ? (
        <div className="d-flex justify-content-center">
          <Calendar className="border rounded p-3" minDate={new Date()} onClickDay={pickDay} />
        </div>
      ) : (
        <Row className="justify-content-center">
          <Col xs={12} className="text-center mb-3 fw-semibold" aria-live="polite">
            {fmtDate(justDate)}{selectedTime ? ` • ${selectedTime}` : ""}
          </Col>

          {selectedTime && (
            <Col xs="auto" className="mb-3">
              <Form onSubmit={submit} className="d-flex gap-2">
                <Form.Control
                  style={{ maxWidth: 280 }}
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Button type="submit" disabled={!name.trim() || isSubmitting}>
                  {isSubmitting ? "Saving…" : "Book"}
                </Button>
              </Form>
            </Col>
          )}

          {slots.map((s) => {
            const booked = bookedTimes.includes(s);
            const selected = selectedTime === s;
            return (
              <Col key={s} xs={4} sm={3} md={2} className="mb-3 text-center">
                <Button
                  type="button"
                  className={`btn w-100 ${selected ? "btn-primary" : booked ? "btn-outline-secondary" : "btn-info"
                    }`}
                  onClick={() => pickTime(s)}
                  disabled={booked || isSubmitting}
                  aria-pressed={!!selected}
                  aria-label={`${s}${booked ? " (booked)" : ""}`}
                >
                  {s} {booked && <small>(booked)</small>}
                </Button>
              </Col>
            );
          })}

          <Col xs={12} className="text-center mt-2">
            <Nav.Link as={NavLink} to="/booking" className="another-date-link">
              Choose another date
            </Nav.Link>
          </Col>
        </Row>
      )}
    </div>
  );
}
