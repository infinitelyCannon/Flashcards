import React, { Component } from 'react';

class Navbar extends Component{
    render(){
        return (
        <nav>
            <div className="nav-wrapper indigo darken-1">
                <span className="brand-logo left">Flashcards</span>
            </div>
        </nav>
        );
    }
}

export default Navbar;