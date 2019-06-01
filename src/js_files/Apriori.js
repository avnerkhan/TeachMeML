import React from "react"
import ReactTable from 'react-table'
import Table from 'react-bootstrap/Table'
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


        this.defaultTransactionSelection = ["A", "B", "C", "D", "E"]
        
        this.state = {
            transactionItems: this.defaultTransactionSelection,
            transactions: this.generateRandomTransaction()
        }
    }

    // Random transaction generator for state
    generateRandomTransaction() {
        let randomTransactions = []
        let transactionItems = this.state == undefined ? this.defaultTransactionSelection : this.state.transaction

        for(let i = 0; i < 5; i++) {
            let transaction = []
            let transactionLength = Math.floor(Math.random() * transactionItems.length) + 1

            for(let c = 0; c < transactionLength; c++) {
                let item = Math.floor(Math.random() * transaction.length)
                transaction.push(transactionItems[item])
            }

            randomTransactions.push(transaction)
        }


        return randomTransactions

    }

    // Either adds or subtracts an element from a transaction
    changeTransactionState(currentTransactionIndex, isAdd) {

        let currentTransactionState = this.state.transactions
        const transactionItems = this.state.transactionItems

        if(isAdd) {
            currentTransactionState[currentTransactionIndex].push(transactionItems[0])
        } else {
            currentTransactionState[currentTransactionIndex].pop()
        }

        this.setState({transaction: currentTransactionState})

    }


    // Changes an item in a transaction without adding or subtracting from transaction
    changeItemInTransaction(transaction, item, itemIndexInTransaction) {

        let currentTransactionState = this.state.transactions
        const transactionItems = this.state.transactionItems
        const currentTransactionIndex = currentTransactionState.indexOf(transaction)
        const currentItemIndex = transactionItems.indexOf(item)
        const nextItemIndex = (currentItemIndex + 1) % transactionItems.length
        currentTransactionState[currentTransactionIndex][itemIndexInTransaction] = transactionItems[nextItemIndex]

        this.setState({transactions: currentTransactionState})




    }

    // Displays the JSX for transaction table
    displayTransactionTable() {
        let transactions = this.state.transactions
        return(
            <Table responsive="sm">
                <tbody>
                    {transactions.map((transaction, index) => {
                        return(
                            <tr>
                                <td>{index + 1}</td>
                                {transaction.map((item, index) => {
                                    return(
                                        <td onClick={() => this.changeItemInTransaction(transaction, item, index)}>{item}</td>
                                    )
                                })}
                                <td onClick={() => this.changeTransactionState(index, true)}>+</td>
                                <td onClick={() => this.changeTransactionState(index, false)}>-</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }

    render() {
        return(
            <div className="App">
                <header className="App-header">
                    {this.state != undefined ? this.displayTransactionTable() : null}
                </header>
            </div>
        )
    }


}

export default Apriori