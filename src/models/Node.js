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

    getFirstEdgeTo(other, excludedEdges) {
        var edges = this.getEdgesTo(other);
        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            if (excludedEdges.filter(e => e === edge).length === 0) {
                return edge;
            }
        }
    }

    dfs(targetNode, seenNodes, predicate) {
        if (!predicate(this)) {
            return;
        }
        if (this === targetNode) {
            return [this];
        }
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            var dst = edge.getOtherEnd(this);
            if (!predicate(dst)) {
                continue;
            } else if (seenNodes.filter(n => n === dst).length > 0) {
                continue;
            } else if (dst === targetNode) {
                return [this, dst];
            } else {
                var res = dst.dfs(targetNode, seenNodes.concat(this), predicate);
                if (res) {
                    res.unshift(this);
                    return res;
                }
            }
        };
    }
}

Node.nextId = 0;

export default Node;
