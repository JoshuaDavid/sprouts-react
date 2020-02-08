class Node {
    id;
    x;
    y;
    regions;
    edges;

    constructor(x, y, regions) {
        this.x = x;
        this.y = y;
        this.regions = regions;
        this.id = Node.nextId++;
        this.edges = [];
    }

    getEdgesTo(other) {
        var edges = [];
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            if (edge.src === other || edge.dst === other) {
                edges.push(edge);
            }
        }

        return edges;
    }
}

Node.nextId = 0;

export default Node;
