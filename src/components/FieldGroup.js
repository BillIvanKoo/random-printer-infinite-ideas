import React from "react";
import { FormGroup, ControlLabel, FormControl } from "react-bootstrap";

function FieldGroup({ id, label, help, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
      </FormGroup>
    );
  }

export default FieldGroup