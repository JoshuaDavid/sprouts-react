class Node {
    id;
    x;
    y;
    regions;

    constructor(x, y, regions) {
        this.x = x;
        this.y = y;
        this.regions = regions;
        this.id = Node.nextId++;
    }
}

Node.nextId = 0;

export default Node;
