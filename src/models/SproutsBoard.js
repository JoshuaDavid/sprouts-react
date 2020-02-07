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
}

export default SproutsBoard;
