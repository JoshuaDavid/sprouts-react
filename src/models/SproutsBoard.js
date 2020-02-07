import Node from './Node.js';
import Edge from './Edge.js';
import Region from './Region.js';

class SproutsBoard {
    regions;
    nodes;
    edges;

    constructor() {
        this.regions = [
            new Region([
                {x: -1000, y: -1000},
                {x: -1000, y: +1000},
                {x: +1000, y: +1000},
                {x: +1000, y: -1000},
            ], []),
        ];
        this.nodes = [];
        this.edges = [];
    }

    getRegionOfXy(x, y) {
        // this is wrong
        return this.regions[0];
    }

    addUnconnectedNode(x, y) {
        var region = this.getRegionOfXy(x, y);
        var node = new Node(x, y, [region]);
        this.nodes.push(node);
    }

    addEdgeWithNode(src, dst, x, y) {
        var region = this.getRegionOfXy(x, y);
        var mid = new Node(x, y, [region]);
        var wssm = [], wsmd = [];
        if (src == dst) {
            var dx = mid.x - src.x;
            var dy = mid.y - src.y;
            var wssm = [{
                x: src.x + dx / 2 + dy / 2,
                y: src.y + dy / 2 - dx / 2,
            }];
            var wsmd = [{
                x: src.x + dx / 2 - dy / 2,
                y: src.y + dy / 2 + dx / 2,
            }];
        }
        var esm = new Edge(src, mid, wssm);
        var emd = new Edge(mid, dst, wsmd);
        mid.edges = [esm, emd];
        src.edges.push(esm);
        dst.edges.push(emd);
        this.nodes.push(mid);
        this.edges.push(esm);
        this.edges.push(emd);
    }
}

export default SproutsBoard;
