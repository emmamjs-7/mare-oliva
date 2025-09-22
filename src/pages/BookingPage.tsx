import { useState } from 'react';
import { Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { add } from 'date-fns';
import { INTERVAL, RESTAURANT_CLOSING_TIME, RESTAURANT_OPENING_TIME } from '../constants/config';


BookingPage.route = {
  index: 3,
  path: '/booking',
  title: 'Booking'
};

interface DateType {
  justDate: Date | null;
  dateTime: Date | null;
}

export default function BookingPage() {
  const [date, setDate] = useState<DateType>({
    justDate: null,
    dateTime: null,
  });
  console.log(date.dateTime);
  function getTimes() {
    if (!date.justDate) return;
    const { justDate } = date;
    const beginning = add(justDate, { hours: RESTAURANT_OPENING_TIME });
    const end = add(justDate, { hours: RESTAURANT_CLOSING_TIME });
    const interval = INTERVAL;

    const times = [];

    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
      times.push(i);
    }
    return times;
  }
  const times = getTimes();


  return (
    <div className="py-5">
      <div className="container d-flex justify-content-center">
        {date.justDate ? (
          <div className="row g-2 justify-content-center text-center">
            {times?.map((time, i) => (
              <Col key={`time-${i}`} className="mb-3" xs={4} sm={3} md={2}>
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => setDate(prev => ({ ...prev, dateTime: time }))}
                >
                  {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
              </Col>
            ))}
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <Calendar
              className="border rounded p-3"
              tileClassName={() => "rounded-circle mb-1"}
              minDate={new Date()}
              view="month"
              onClickDay={(day) => setDate(prev => ({ ...prev, justDate: day }))}
            />
          </div>
        )}
      </div>
    </div>
  );

}
