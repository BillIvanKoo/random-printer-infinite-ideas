import React, { Component } from 'react';
import { Modal, Button } from "react-bootstrap";

import FieldGroup from './FieldGroup';

class ModalPrizeForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            quantity: '',
            modalShow: false
        }
    }

    componentDidMount() {
        this.setState({
            name: this.props.name,
            quantity: this.props.quantity
        })
    }

    componentWillReceiveProps(props) {
        this.setState({
            name: props.name,
            quantity: props.quantity
        })
    }

    showModal() {
        this.setState({
            modalShow: true
        })
    }

    hideModal() {
        this.setState({
            modalShow:false
        })
    }

    handleName(e) {
        this.setState({
            name: e.target.value
        })
    }

    handleQuantity(e) {
        this.setState({
            quantity: e.target.value
        })
    }

    handleSubmit() {
        this.props.onSubmit({
            name: this.state.name,
            quantity: parseInt(this.state.quantity)
        })
    }

    render() {
        return (
            <div>
            <Button bsStyle={this.props.bsStyle} onClick={()=>{this.showModal()}}>
                {this.props.title}
            </Button>
            <Modal show={this.state.modalShow} onHide={()=>{this.hideModal()}}>
                <Modal.Header>
                    {this.props.title}
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <FieldGroup
                            placeholder="enter item name"
                            value={this.state.name}
                            onChange={(e)=>{this.handleName(e)}}
                        />
                        <FieldGroup
                            placeholder="enter quantity"
                            value={this.state.quantity}
                            onChange={(e)=>{this.handleQuantity(e)}}
                        />
                        <Button bsStyle="primary" onClick={()=>{this.handleSubmit()}}>
                            Submit
                        </Button>
                    </form>
                </Modal.Body>
            </Modal>
            </div>
        )
    }
}

export default ModalPrizeForm