import React from 'react';
// import logo from './logo.svg';
import './App.css';
import SpringySim from './SpringySim.js';
import SproutsBoardViewer from './SproutsBoardViewer.js';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            bounds: {
                xmin: -4,
                xmax: +4,
                ymin: -4,
                ymax: +4,
            },
        }
    }

    render() {
        const {bounds} = this.state;

        return (
            <div>
                <SproutsBoardViewer />
            </div>
        );
    }
}

export default App;
