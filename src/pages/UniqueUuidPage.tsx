import { useState } from 'react';
import { Button, ButtonGroup, Form } from 'react-bootstrap';
import { v1 as uuidV1, v4 as uuidV4, version as uuidVersion, validate as uuidValidate } from 'uuid';


export function UniqueUuidPage() {

  const [result, setResult] = useState("");
  const [validate, setValidate] = useState("");
  const appendUuid = (id: string) => setResult(result + id + "\r\n");
  const uuidToDate = (id: string) => {
    const arr = id.split( '-' );
    const timeText = [ arr[ 2 ].substring( 1 ), arr[ 1 ], arr[ 0 ] ].join( '' );
    const time = parseInt(timeText, 16 ) - 122192928000000000;
    return new Date(Math.floor( time / 10000 ));
  };

  const validateUuid = (id: string) => {

    if (!uuidValidate(id)) {
      return "Not a valid UUID";
    }
    const version = uuidVersion(id);
    if (version === 1) {
      return `UUID Version: ${version}\r\nDateTime: ${uuidToDate(id)}`;
    }
    return `UUID Version: ${version}`;
  };


  return <>
    <h2>UUID functions</h2>
  
    <h4>Create UUIDs</h4>
    <span>Create</span>     
    <ButtonGroup aria-label="Basic example">
      <Button 
        variant="light"
        onClick={() =>  appendUuid(uuidV4())}>
        Random UUIDv4
      </Button>            
      <Button 
        variant="light"
        onClick={() =>  appendUuid(uuidV1())}>
        Time-based UUIDv1
      </Button>
    </ButtonGroup>
    
    <Button 
      variant="danger" 
      onClick={() => setResult("")}>
        Clear
    </Button>

    <Form.Group>
      <Form.Control    
        className={"tools-uuids-result"}
        as="textarea" 
        rows={5} 
        value={result} />
    </Form.Group>

    <br/>
    <h4>Analyze UUID</h4>
    <Form.Group>
      <Form.Label>Analyse UUID</Form.Label>
      <Form.Control 
        placeholder="Enter UUID to return its properties ..."
        type="text" 
        onChange={(event:any) => setValidate(event.currentTarget.value)}
        />
    </Form.Group>
    
    <Form.Group>
      <Form.Label>Result of UUID</Form.Label>
      <Form.Control    
        className={"tools-uuids-result"}
        as="textarea" 
        rows={2} 
        value={validateUuid(validate)} />
    </Form.Group>
  </>;
}