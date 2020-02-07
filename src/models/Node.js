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
}

Node.nextId = 0;

export default Node;
