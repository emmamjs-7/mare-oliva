import { Row, Col } from 'react-bootstrap';


AboutPage.route = {
  path: '/about',
  menuLabel: 'About us',
  index: 2
};

export default function AboutPage() {
  return <>
    <Row>
      <Col md={8}>
        <h2 className=" mt-4 text-dark">Contact</h2>
        <address className='contact text-dark'>
          Mare & Oliva<br />
          Via Cimone 14<br />
          Syracuse<br />
          Italy<br />
          <br />
          Phone: <a href="tel:+1234567890">+1 234 567 890</a><br />
          Email: <a href="mailto:info@mareoliva.com">info@mareoliva.com</a>
        </address>
      </Col>
      <Col md={4} className='mt-4'>
        <iframe
          title="Mare & Oliva Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6366.452768082268!2d15.284821395778357!3d37.07591472548023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1313cea3650e5425%3A0xb177da6aaa549504!2sVia%20Cimone%2C%2014%2C%2096100%20Siracusa%20SR%2C%20Italy!5e0!3m2!1sen!2sde!4v1759136913254!5m2!1sen!2sde"
          width="100%"
          height="250"
          style={{ border: 0 }}
          loading="lazy"
        ></iframe>
      </Col>
    </Row >
  </>;
}