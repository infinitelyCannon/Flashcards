import React, { Component } from 'react';

class Dialog extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event){
        
    }

    render(){
        return (

        );
    }

    validate(name){
        var result = {isValid: null, errorMsg: ''};
    }
}