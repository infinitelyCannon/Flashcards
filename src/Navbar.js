import React, { Component } from 'react';

class Navbar extends Component{
    render(){
        return (
        <nav>
            <div className="nav-wrapper indigo darken-1">
                <span className="brand-logo left">Flashcards</span>
                <ul className="right">
                    <li><a><i className="material-icons">help_outline</i></a></li>
                    <li><a><i className="material-icons">info_outline</i></a></li>
                </ul>
            </div>
        </nav>
        );
    }
}

export default Navbar;