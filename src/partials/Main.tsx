import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useStateObject } from '../utils/useStateObject';

export default function Main() {
  const stateAndSetter = useStateObject({
    categoryChoice: 'All',
    sortChoice: 'Default',
  });

  return <main className="mt-5">
    <Container className=" mb-4">
      <Outlet context={stateAndSetter} />
    </Container>
  </main>;
}