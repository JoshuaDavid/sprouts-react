import React from 'react';

export default class SpringySim extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nodes: {},
            edges: [],
            bounds: {
                xmin: -4,
                xmax: +4,
                ymin: -4,
                ymax: +4,
            },
            repulsion: 0.0001,
            springiness: 0.01,
            damping: 0.95,
        };

        setTimeout(() => {
            this.addNode('a', -1, -1, 'main');
            this.addNode('b', +1, -1, 'main');
            this.addNode('c', -1, +1, 'main');
            this.addNode('d', +1, +1, 'main');
            this.addNode('e', -1, +2, 'main');
            this.addNode('f',  0, +2, 'main');
            this.addNode('g', +1, +2, 'main');
            this.addNode('h', -1, +3, 'main');
            this.addNode('i', +1, +3, 'main');

            this.addSpringyEdge('a', 'b', 1, 3);
            this.addSpringyEdge('a', 'c', 1, 3);
            this.addSpringyEdge('b', 'c', 1, 3);
            this.addSpringyEdge('c', 'd', 1, 3);
            this.addSpringyEdge('d', 'e', 1, 3);
            this.addSpringyEdge('d', 'f', 1, 3);
            this.addSpringyEdge('d', 'g', 1, 3);
            this.addSpringyEdge('f', 'h', 1, 3);
            this.addSpringyEdge('f', 'i', 1, 3);

            this.stepn(10);
        }, 10);
    }

    addNode(nid, x, y, type) {
        this.setState({
            nodes: Object.assign({}, this.state.nodes, {
                [nid]: {
                    x: x,
                    y: y,
                    dx: 0,
                    dy: 0,
                    type: type,
                },
            }),
        });
    }

    addEdge(src, dst, len) {
        this.setState({
            edges: this.state.edges.concat({
                src: src,
                dst: dst,
                len: len
            }),
        });
    }

    addSpringyEdge(srcNid, dstNid, len, nSegments) {
        var {
            nodes,
        } = this.state;

        var src = nodes[srcNid];
        var dst = nodes[dstNid];
        var dx = dst.x - src.x;
        var dy = dst.y - src.y;

        var prvNid = srcNid;
        for (var i = 1; i < nSegments; i++) {
            var curNid = srcNid + '-' + dstNid + ':' + i;
            var d = i / nSegments;
            var x = src.x + d * dx;
            var y = src.y + d * dy;
            this.addNode(curNid, x, y, 'intermediate');
            this.addEdge(prvNid, curNid, len / nSegments);
            prvNid = curNid;
        }
        this.addEdge(prvNid, dstNid, len / nSegments);
    }

    getActualLen(edge) {
        var srcNid = edge.src;
        var dstNid = edge.dst;
        var src = this.state.nodes[srcNid];
        var dst = this.state.nodes[dstNid];
        return this.getDistance(src, dst);
    }

    getDistance(src, dst) {
        var dx = dst.x - src.x;
        var dy = dst.y - src.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    getAccels(nodes) {
        var {
            edges,
            repulsion,
            springiness,
        } = this.state;

        var accels = {}

        Object.keys(nodes).forEach(srcNid => {
            accels[srcNid] = {ddx: 0, ddy: 0};
            var src = nodes[srcNid];
            Object.keys(nodes).forEach(dstNid => {
                if (srcNid == dstNid) {
                    return;
                }
                var dst = nodes[dstNid];
                var d = this.getDistance(src, dst);
                var f = repulsion / (d * d);
                var dx = dst.x - src.x;
                var dy = dst.y - src.y;
                var ddx = f * dx / d;
                var ddy = f * dy / d;
                accels[srcNid].ddx -= ddx;
                accels[srcNid].ddy -= ddy;
            });
        });

        edges.forEach(edge => {
            var srcNid = edge.src;
            var dstNid = edge.dst;
            var src = nodes[srcNid];
            var dst = nodes[dstNid];

            var dx = dst.x - src.x;
            var dy = dst.y - src.y;

            var targetLen = edge.len;
            var actualLen = this.getDistance(src, dst);
            var f = springiness * (targetLen - actualLen)

            accels[srcNid].ddx -= f * dx / actualLen;
            accels[srcNid].ddy -= f * dy / actualLen;
            accels[dstNid].ddx += f * dx / actualLen;
            accels[dstNid].ddy += f * dy / actualLen;
        });

        return accels;
    }

    stepn(n) {
        var {
            nodes,
            damping,
        } = this.state;

        nodes = Object.assign({}, nodes);
        for (var i = 0; i < n; i++) {
            var accels = this.getAccels(nodes);

            var isOk = true;

            Object.keys(accels).forEach(nid => {
                var node = nodes[nid];
                var accel = accels[nid];
                console.log(node, accel);
                node.x += node.dx;
                node.y += node.dy;
                node.dx += accel.ddx;
                node.dy += accel.ddy;
                console.log(node, accel);
                if (isNaN(node.dx) || isNaN(node.dy)) {
                    isOk = false;
                }
            });

            Object.keys(accels).forEach(nid => {
                var node = nodes[nid];
                node.dx *= damping;
                node.dy *= damping;
            });
        }

        this.setState({
            nodes: nodes,
        }, () => {
            if (isOk) {
                setTimeout(() => this.stepn(n), 10);
            }
        });
    }

    render() {
        var {
            nodes,
            edges,
            bounds,
        } = this.state;

        return (
            <div>
                {false?
                    <div>
                        <div><b>Nodes:</b></div>
                        {Object.keys(nodes).map(nid => {
                            var node = nodes[nid];
                            return (
                                <div key={nid}>
                                    <b>id: </b>
                                    <span>{nid} </span>
                                    <b>x: </b>
                                    <span>{node.x} </span>
                                    <b>y: </b>
                                    <span>{node.y} </span>
                                    <b>dx: </b>
                                    <span>{node.dx} </span>
                                    <b>dy: </b>
                                    <span>{node.dy} </span>
                                </div>
                            );
                        })}
                        <div><b>Edges:</b></div>
                        {edges.map(edge => {
                            var srcNid = edge.src;
                            var dstNid = edge.dst;
                            var edgeId = srcNid + ',' + dstNid;
                            var len = edge.len;
                            return (
                                <div key={edgeId}>
                                    <b>src: </b>
                                    <span>{srcNid} </span>
                                    <b>dst: </b>
                                    <span>{dstNid} </span>
                                    <b>target len: </b>
                                    <span>{len} </span>
                                    <b>actual len: </b>
                                    <span>{this.getActualLen(edge)} </span>
                                </div>
                            );
                        })}
                    </div>
                :
                    null
                }

                <svg
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
                        border: '1px solid black',
                    }}
                >
                    <g>
                        {edges.map(edge => {
                            var srcNid = edge.src;
                            var dstNid = edge.dst;
                            var edgeId = srcNid + ',' + dstNid;
                            var src = nodes[srcNid];
                            var dst = nodes[dstNid];
                            return (
                                <line
                                    key={edgeId}
                                    x1={src.x} y1={src.y}
                                    x2={dst.x} y2={dst.y}
                                    style={{
                                        stroke: 'red',
                                        strokeWidth: 0.01,
                                    }}
                                />
                            );
                        })}
                        {Object.keys(nodes).map(nid => {
                            var node = nodes[nid];
                            if (node.type == 'main') {
                                return (
                                    <circle
                                        key={nid}
                                        cx={node.x}
                                        cy={node.y}
                                        r="0.1"
                                    />
                                )
                            } else {
                                return null;
                            }
                        })}
                    </g>
                </svg>
            </div>
        );
    }
}
