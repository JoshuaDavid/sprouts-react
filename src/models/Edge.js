class Edge {
    constructor(src, dst) {
        this.src = src;
        this.dst = dst;
        this.id = Edge.nextId++;
    }
}

Edge.nextId = 0;

export default Edge;
