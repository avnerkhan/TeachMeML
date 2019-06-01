import React from "react"
import ReactTable from 'react-table'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import '../css_files/App.css'
import 'react-table/react-table.css'


class Apriori extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            transactionItems: ["A", "B", "C", "D", "E"],
            transactions: this.generateRandomTransaction()
        }
    }

    generateRandomTransaction() {
        let randomTransactions = []
        let transactionItems = this.state.transactionItems

        for(let i = 0; i < 5; i++) {
            let transaction = []
            let transactionLength = Math.floor(Math.random() * transactionItems.length)

            for(let c = 0; c < transactionLength; c++) {
                let item = Math.floor(Math.random() * transaction.length)
                transaction.push(transactionItems[item])
            }

            randomTransactions.push(transaction)
        }

        return randomTransactions

    }

    render() {
        return(
            <div className="App">
                <header className="App-header">
                </header>
            </div>
        )
    }


}

export default Apriori