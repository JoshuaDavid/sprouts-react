class Edge {
    constructor(src, dst, waypoints) {
        this.src = src;
        this.dst = dst;
        this.waypoints = waypoints;
        this.id = Edge.nextId++;
    }

    getPointsStr() {
        var pts = [];
        pts.push(this.src.x + ',' + this.src.y);
        this.waypoints.forEach(({x,y}) => pts.push(x + ',' + y));
        pts.push(this.dst.x + ',' + this.dst.y);
        return pts.join(' ');
    }
}

Edge.nextId = 0;

export default Edge;
