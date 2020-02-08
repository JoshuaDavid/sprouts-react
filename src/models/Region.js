class Region {
    inclusionBoundary;
    exclusionBoundaries;
    boundingNodes;
    enclosedRegions;

    constructor(boundingNodes, enclosedRegions) {
        this.id = Region.nextId++;
        this.boundingNodes = boundingNodes;
        this.enclosedRegions = enclosedRegions;
        this.updateBoundaries()
    }

    updateBoundaries() {
        this.inclusionBoundary = this.getInclusionBoundary();
        this.exclusionBoundaries = this.getExclusionBoundaries();
    }

    getInclusionBoundary() {
        if (this.boundingNodes.length == 0) {
            return [
                {x: -1000, y: -1000},
                {x: -1000, y: +1000},
                {x: +1000, y: +1000},
                {x: +1000, y: -1000},
            ];
        } else {
            var boundary = [];
            var excludedEdges = []
            for (var i = 0; i < this.boundingNodes.length; i++) {
                var src = this.boundingNodes[i];
                var dst = this.boundingNodes[(i+1)%this.boundingNodes.length];
                boundary.push(src);
                var edge = src.getFirstEdgeTo(dst, excludedEdges);
                edge.waypoints.forEach(waypoint => boundary.push(waypoint));
                excludedEdges.push(edge);
            }
            return boundary;
        }
    }

    addEnclosedRegion(enclosedRegion) {
        this.enclosedRegions.push(enclosedRegion);
    }

    getExclusionBoundaries() {
        return this.enclosedRegions.map(region => region.getInclusionBoundary());
    }

    getPathStr() {
        var commands = [];
        var ib = this.inclusionBoundary;
        commands.push('M' + ib[0].x + ' ' + ib[0].y);
        for (var i = 1; i < ib.length; i++) {
            commands.push('L' + ib[i].x + ' ' + ib[i].y);
        }
        commands.push('L' + ib[0].x + ' ' + ib[0].y);
        commands.push('z');
        for (var j = 0; j < this.exclusionBoundaries.length; j++) {
            var eb = this.exclusionBoundaries[j];
            commands.push('M' + eb[0].x + ' ' + eb[0].y);
            for (var i = 1; i < eb.length; i++) {
                commands.push('L' + eb[i].x + ' ' + eb[i].y);
            }
            commands.push('L' + eb[0].x + ' ' + eb[0].y);
            commands.push('z');
        }
        return commands.join(' ');
    }

    getColor() {
        return colors[this.id % colors.length];
    }

    isInsideBoundary(x, y, boundary) {
        var inside = false;
        for (var i = 0; i < boundary.length - 1; i++) {
            var {x:x1,y:y1} = boundary[i];
            var {x:x2,y:y2} = boundary[(i + 1) % boundary.length];

            if ((y1 > y) != (y2 > y)) {
                var dx = x2 - x1;
                var dy = y2 - y1;
                // dy can never be 0 because (y1 > y) != (y2 > y)
                if (x < x1 + dx * (y - y1) / dy) {
                    inside = !inside;
                }
            }
        }

        return inside;
    }

    containsPoint(x, y) {
        if (this.isInsideBoundary(x, y, this.inclusionBoundary)) {
            for (var i = 0; i < this.exclusionBoundaries.length; i++) {
                var eb = this.exclusionBoundaries[i];
                if (this.isInsideBoundary(x, y, eb)) {
                    return false;
                }
            }
            return true;
        } else {
            return false;
        }
    }

    containsNode(node) {
        for (var i = 0; i < this.boundingNodes.length; i++) {
            if (node === this.boundingNodes[i]) {
                return false;
            }
        }

        return this.containsPoint(node.x, node.y);
    }
}

var colors = [
    'white',
    'red',
    'blue',
    'green',
    'orange',
    'purple',
    'yellow',
    'black',
    'pink',
    'tan',
    'gray',
    'brown',
];

Region.nextId = 0;

export default Region;
