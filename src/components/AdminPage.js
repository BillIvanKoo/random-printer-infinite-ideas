import React, { Component } from 'react';
import { Table, Button } from 'react-bootstrap';

import ModalPrizeForm from './ModalPrizeForm';

const { ipcRenderer } = window.require('electron');

class AdminPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            prizes: []
        }
    }

    componentDidMount() {
        ipcRenderer.send("adminPageLoaded")
        ipcRenderer.on("prizeSent", (event, prizes) => {
            this.setState({
                prizes
            })
        })
    }

    addPrize(prize) {
        ipcRenderer.send("addPrize", prize);
        ipcRenderer.on("prizeAdded", (event, prize) => {
            this.setState({
                prizes: [...this.state.prizes, prize]
            })
        })
    }

    deletePrize(prize) {
        let that = this;
        ipcRenderer.send("deletePrize", prize);
        ipcRenderer.on("prizeDeleted", (event, result) => {
            if (result === 1) {
                that.setState({
                    prizes: that.state.prizes.filter(prizeItem => (
                        prizeItem !== prize 
                    ))
                })
            }
        })
    }

    editPrize(prize) {
        let that = this;
        ipcRenderer.send("editPrize", prize);
        ipcRenderer.on("prizeEdited", (event, result) => {
            if (result === 1) {
                that.setState({
                    prizes: that.state.prizes.map( element => {
                        if (element.id === prize.id) {
                            return prize
                        }
                        return element
                    })
                })
            }
        })
    }

    render() {
        return (
            <div>
            <ModalPrizeForm
                title="Add Prize"
                onSubmit={(prize) => {this.addPrize(prize)}}
            />
            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.prizes.map((prize)=>(
                        <tr key={prize.id}>
                            <td>
                                {prize.name}
                            </td>
                            <td>
                                {prize.quantity}
                            </td>
                            <td>
                                <ModalPrizeForm
                                    title="Edit"
                                    bsStyle="warning"
                                    onSubmit={(editedPrize) => {this.editPrize({...prize,...editedPrize})}}
                                    name={prize.name}
                                    quantity={prize.quantity}
                                />
                                <Button bsStyle="danger" onClick={()=>{this.deletePrize(prize)}}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
        )
    }
}

export default AdminPage;