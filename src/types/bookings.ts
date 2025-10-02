export type Booking = {
  id: number;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:mm"
  name: string;
  user_id?: number;
};