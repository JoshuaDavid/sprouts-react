import React from 'react';

import SproutsBoard from './models/SproutsBoard.js'

class SproutsBoardViewer extends React.Component {
    regions;
    nodes;
    edges;
    svg;

    constructor(props) {
        super(props);
        var board = new SproutsBoard();
        window.board = board;
        this.state = {
            board: board,
            clicks: [],
            bounds: {
                xmin: -4,
                xmax: +4,
                ymin: -4,
                ymax: +4,
            },
            stage: 'ADD_UNCONNECTED',
            selectedSrc: null,
            selectedDst: null,
            selectedRegion: null,
        };
    }

    forceRerender() {
        this.forceUpdate();
    }

    addUnconnectedNode(x, y) {
        this.state.board.addUnconnectedNode(x, y);
        this.forceUpdate();
    }

    handleClick(e) {
        var {x, y} = this.getEventXY(e);
        this.addUnconnectedNode(x, y);
    }

    advanceToGame() {
        this.setState({stage: 'PLAY_GAME'});
    }

    getEventXY(e) {
        const {bounds} = this.state;
        var svgBoundingRect = this.svg.getBoundingClientRect();
        var pxw = svgBoundingRect.right - svgBoundingRect.left;
        var pxh = svgBoundingRect.bottom - svgBoundingRect.top;
        var pxx = e.clientX - svgBoundingRect.left;
        var pxy = e.clientY - svgBoundingRect.top;
        var w = bounds.xmax - bounds.xmin;
        var h = bounds.ymax - bounds.ymin;
        var x = bounds.xmin + (pxx / pxw) * w;
        var y = bounds.ymin + (pxy / pxh) * h;
        return {x: x, y: y};
    }

    render() {
        const {bounds, board, stage} = this.state;
        const {nodes, edges, regions} = board;

        return (
            <div style={{paddingTop: '117px', paddingLeft: '94px'}}>
                <svg
                    ref={svg => this.svg = svg}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={[
                        bounds.xmin,
                        bounds.ymin,
                        bounds.xmax - bounds.xmin,
                        bounds.ymax - bounds.ymin,
                    ].join(' ')}
                    style={{
                        height: '500px',
                        width: '500px',
                        border: '0px',
                    }}
                >
                    <g fillRule="evenodd" onClick={e => this.handleClick(e)}>
                        {regions.map(region => <path
                            d={region.getPathStr()}
                            fill={region.getColor()}
                        />)}
                        {nodes.map(node => <circle
                            cx={node.x}
                            cy={node.y}
                            r={0.1}
                        />)}
                        {edges.map(edge => <line
                            x1={edge.src.x}
                            y1={edge.src.y}
                            x2={edge.dst.x}
                            y2={edge.dst.y}
                            style={{
                                strokeWidth: 0.01,
                                stroke: 'black',
                            }}
                        />)}
                    </g>
                </svg>
                {stage === 'ADD_UNCONNECTED'?
                    <div>
                        <div>Click on places where you want to add some nodes.</div>
                        <div>When you are done, click Play below</div>
                        <button onClick={() => this.advanceToGame()}>Play</button>
                    </div>
                :stage === 'PLAY_GAME' ?
                    <div>
                        <div>Playing...</div>
                        <div>Click a node</div>
                    </div>
                :
                    <div>Unknown stage {stage}</div>
                }
                <button onClick={() => this.forceRerender()}>Rerender</button>
            </div>
        );
    }
}

export default SproutsBoardViewer;
