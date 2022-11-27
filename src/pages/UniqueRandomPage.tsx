import { useState } from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';


export function UniqueRandomPage() {

  const [result, setResult] = useState<string>("");
  const [numberOfBits, setNumberOfBits] = useState<number>(32);
  const appendValue = (id: string) => setResult(result + id + "\r\n");

  return <>
    <h2>Random value functions</h2>
  
    <span>Create</span>     
    <ButtonGroup aria-label="Basic example">
      <Button 
        variant="light"
        onClick={() => appendValue("dsad")}>
        Append
      </Button>
    </ButtonGroup>
    
    <Button 
      variant="danger" 
      onClick={() => setResult("")}>
        Clear
    </Button>

    <Form.Group>
      <Form.Label>Size</Form.Label>
      <Form.Range onChange={() => setNumberOfBits(8)} />
    </Form.Group>


    <Form.Group>
      <Form.Check 
        type={"radio"}
        label={`Hexadecimal`}
      />
      <Form.Check
        type={"radio"}
        label={"Base64"}
      />
      <Form.Check
        type={"radio"}
        label={"Base64-URL"}
      />
    </Form.Group>

    <Form.Group>
      <Form.Control    
        className={"tools-uuids-result"}
        as="textarea" 
        rows={5} 
        value={result} />
    </Form.Group>

  </>;
}