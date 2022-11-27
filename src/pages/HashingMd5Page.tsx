import { useState } from "react";
import { DefaultLayout } from "../components/layouts/DefaultLayout";
import CryptoJS from "crypto-js";
import { Form } from 'react-bootstrap';


export function HashingMd5Page() {

  const [text, setText] = useState("");

  return <>
      <h2>MD5 hash functions</h2>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Text</Form.Label>
        <Form.Control 
          type="text" 
          placeholder="Enter any text to calculate the hash ..." 
          onChange={(event:any) => setText(event.currentTarget.value)} />
      </Form.Group>

      <br/>
      <hr/>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>MD5 - Hexadecimal</Form.Label>
        <Form.Control 
          type="text" 
          value={CryptoJS.MD5(text).toString()}
          readOnly={true} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>MD5 - Base64</Form.Label>
        <Form.Control 
          type="text" 
          value={CryptoJS.MD5(text).toString(CryptoJS.enc.Base64)}
          readOnly={true} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>MD5 - Base64-URL</Form.Label>
        <Form.Control 
          type="text" 
          value={CryptoJS.MD5(text).toString(CryptoJS.enc.Base64url)}
          readOnly={true} />
      </Form.Group>
  </>;
}
