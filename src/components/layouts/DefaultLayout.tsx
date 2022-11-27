import { Navigation } from "../navigation/Navigation";
import { Container, Row, Col } from 'react-bootstrap';

export type DefaultLayoutProps = {
  children: React.ReactNode
};

export function DefaultLayout(props: DefaultLayoutProps) {

  return <>
    <Container fluid>
      <Row>
        <Col xs={3}>
          <Navigation />  
        </Col>
        <Col>
          {props.children}
        </Col>
      </Row>
    </Container>
  </>;
}