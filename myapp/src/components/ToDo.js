import React, { useState, useEffect, Component } from "react";

class ToDo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: "",
            items: [],
            token: sessionStorage.getItem("auth_token")
        };

        this.addItem = this.addItem.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    async addItem() {
        console.log("Posting to API")
         await fetch("https://localhost:44374/api/todo", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            },
            body: JSON.stringify({
                "Priority": 1,
                "Description": this.state.item,
                "IsComplete": false
            })
        })
        console.log("Fetching From API")
        this.CallApi()
  }

  async removeItem(e) {
      var index = e.target.value;
      await fetch(`https://localhost:44374/api/todo/${index}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.state.token}`
        }})
      this.setState({ items: this.state.items.filter(i => (i.id != index))});
    }

  handleChange(event) {
    this.state.item = event.target.value;
    }

    componentDidMount() {
        this.CallApi()
    }

     async CallApi() {
        const response = await fetch("https://localhost:44374/api/todo", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.state.token}`
            }})
         const data = await response.json();
         this.setState({items: data})
    }

    render () {
    return (
        <div>
            <button onClick={this.addItem}>Add to the list</button>
            <input type="text" onChange={this.handleChange} />
            <ul>
                {this.state.items.map(i => (
                    <li key={i.id} id={i.id}>
                        {i.description}{" "}
                        <button onClick={this.removeItem} value={i.id}>
                            X
                             </button>
                    </li>
                ))}
            </ul>
        </div>
    )
    }
}

export default ToDo;