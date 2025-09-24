import { useMemo, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { add } from 'date-fns';
import { useLoaderData, useNavigate, useRevalidator, useSearchParams } from 'react-router-dom';
import { fmtDate, fmtTime, parseDate } from '../utils/date';
import { INTERVAL, RESTAURANT_OPENING_TIME, RESTAURANT_CLOSING_TIME } from '../constants/config';
import toast from 'react-hot-toast';
type Booking = { id?: number; date: string; time: string; name: string; };


BookingPage.route = {
  index: 3,
  path: '/booking',
  title: 'Booking',
  requiresAdmin: false,
  menuLabel: 'Book a table',
  loader: async ({ request }: { request: Request; }) => {
    const url = new URL(request.url);
    const dateParam = url.searchParams.get('date');
    if (!dateParam) return { bookings: [] as Booking[] };
    const res = await fetch(`/api/bookings?date=${dateParam}`);
    const data = res.ok ? await res.json() : [];
    return { bookings: Array.isArray(data) ? (data as Booking[]) : [] };
  },
};


export default function BookingPage() {
  const { bookings } = useLoaderData() as { bookings: Booking[]; };
  const [params] = useSearchParams();
  const revalidate = useRevalidator().revalidate;
  const navigate = useNavigate();

  const selected = params.get('date');
  const justDate = selected ? parseDate(selected) : null;

  const [dateTime, setDateTime] = useState<Date | null>(null);
  const [name, setName] = useState('');

  const times = useMemo(() => {
    if (!justDate) return [] as Date[];
    const start = add(justDate, { hours: RESTAURANT_OPENING_TIME });
    const end = add(justDate, { hours: RESTAURANT_CLOSING_TIME });
    const arr: Date[] = [];
    for (let t = start; t < end; t = add(t, { minutes: INTERVAL })) arr.push(t);
    return arr;
  }, [justDate]);

  const bookedSet = useMemo(() => {
    if (!justDate) return new Set<string>();
    const d = fmtDate(justDate);
    return new Set(bookings.filter(b => b.date === d).map(b => b.time));
  }, [bookings, justDate]);

  const pickDay = (day: Date) => { setDateTime(null); navigate(`/booking?date=${fmtDate(day)}`); };
  const pickTime = (t: Date) => { const s = fmtTime(t); if (!bookedSet.has(s)) setDateTime(t); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!justDate || !dateTime || !name.trim()) return;

    const payload = { date: fmtDate(justDate), time: fmtTime(dateTime), name: name.trim() };
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      console.error('POST /bookings failed', res.status);
      toast.error('Booking failed, please try again later.');
      return;
    }

    setName('');
    toast.success(`Booking successful! ${fmtDate(justDate)} • ${fmtTime(dateTime)}`);
    revalidate();
  };

  return (
    <div className="py-5">
      <div className="container">
        {!justDate ? (
          <div className="d-flex justify-content-center">
            <Calendar className="border rounded p-3" minDate={new Date()} onClickDay={pickDay} />
          </div>
        ) : (
          <Row className="justify-content-center">
            <Col xs={12} className="text-center mb-3 fw-semibold">
              {fmtDate(justDate)}{dateTime ? ` • ${fmtTime(dateTime)}` : ''}
            </Col>

            {dateTime && (
              <Col xs="auto" className="mb-3">
                <Form onSubmit={submit} className="d-flex gap-2">
                  <Form.Control style={{ maxWidth: 280 }} placeholder="Your name:"
                    value={name} onChange={(e) => setName(e.target.value)} />
                  <Button type="submit" disabled={!name.trim()}>Book</Button>
                </Form>
              </Col>
            )}

            {times.map((t, i) => {
              const s = fmtTime(t);
              const booked = bookedSet.has(s);
              return (
                <Col key={i} xs={4} sm={3} md={2} className="mb-3 text-center">
                  <button type="button"
                    className={`btn w-100 ${booked ? 'btn-outline-secondary' : 'btn-primary'}`}
                    onClick={() => pickTime(t)} disabled={booked}>
                    {s} {booked && <small>(booked)</small>}
                  </button>
                </Col>
              );
            })}

            <Col xs={12} className="text-center mt-2">
              <Button variant="link" onClick={() => navigate('/booking')}>Choose another date</Button>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
}
