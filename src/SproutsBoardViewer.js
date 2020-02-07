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
        var {
            stage,
            board,
            selectedSrc,
            selectedDst,
        } = this.state;
        var {x, y} = this.getEventXY(e);
        if (stage === 'ADD_UNCONNECTED') {
            this.addUnconnectedNode(x, y);
        } else if (stage === 'PLAY_GAME') {
            if (selectedSrc === null) {
                alert("You must select a start node for your line");
            } else if (selectedDst === null) {
                alert("You must select an end node for your line");
            } else {
                board.addEdgeWithNode(selectedSrc, selectedDst, x, y);
                this.setState({
                    selectedSrc: null,
                    selectedDst: null,
                });
            }
        }
    }

    handleNodeClick(e, node) {
        var {stage} = this.state;
        if (stage === 'ADD_UNCONNECTED') {
            alert("Please place your node a bit farther from any existing nodes");
        } else if (stage === 'PLAY_GAME') {
            if (node.edges.length >= 3) {
                alert("A node cannot have more than 3 edges");
            } else if (this.state.selectedSrc === null) {
                this.setState({selectedSrc: node});
            } else if (this.state.selectedDst === null) {
                this.setState({selectedDst: node});
            }
        }
        e.stopPropagation();
        e.preventDefault();
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
        const {
            bounds,
            board,
            stage,
            selectedSrc,
            selectedDst,
        } = this.state;
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
                        {edges.map(edge => <polyline
                            points={edge.getPointsStr()}
                            style={{
                                strokeWidth: 0.01,
                                stroke: 'black',
                                fill: 'none',
                            }}
                        />)}
                        {nodes.map(node => <circle
                            cx={node.x}
                            cy={node.y}
                            r={0.1}
                            style={{
                                fill: (node === selectedSrc
                                    ? 'blue'
                                    : node === selectedDst
                                    ? 'yellow'
                                    : node.edges.length >= 3
                                    ? 'black'
                                    : 'gray'
                                ),
                            }}
                            onClick={e => this.handleNodeClick(e, node)}
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
