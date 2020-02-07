class Region {
    inclusionBoundary;
    exclusionBoundaries;

    constructor(inclusionBoundary, exclusionBoundaries) {
        this.id = Region.nextId++;
        this.inclusionBoundary = inclusionBoundary;
        this.exclusionBoundaries = exclusionBoundaries;
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
}

var colors = [
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
