import React, { Component } from 'react';
import { Button } from "react-bootstrap";

import FieldGroup from './FieldGroup';

const initialHandler = (props) => (
    <div>
        <FieldGroup
            type="password"
            label="enter six digit number"
        />
        <Button
            bsStyle='primary'
            onClick={() => {props.getRandomPrize()}}
        >
            Submit
        </Button>
    </div>
);

const winningPage = props => (
    <p>Congratulations! You win a {props.prize}</p>
)

const { ipcRenderer } = window.require('electron');

const PAGES = {
    initialHandler: initialHandler,
    winning: winningPage
}

class GuestPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 'initialHandler',
            prize: ""
        }
    }
    getRandomPrize() {
        let that = this
        ipcRenderer.send("getRandomPrize")
        ipcRenderer.on("randomPrizeSent", (event, prize) => {
            that.setState({
                page: 'winning',
                prize: prize.name
            }, () => {
                window.setTimeout(
                    function(){
                        that.setState({
                            page: 'initialHandler'
                        });
                    }
                    .bind(that)
                , 1500)
            })

            
            
        })
    }

    render() {
        const Handler = PAGES[this.state.page]
        return (
            <Handler getRandomPrize={()=>{this.getRandomPrize()}} prize={this.state.prize}/>
        )
    }
}

export default GuestPage