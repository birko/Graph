var Graph;
(function (_Graph) {
    var Point = (function () {
        function Point(x, y, z) {
            if (typeof x === "undefined") { x = 0; }
            if (typeof y === "undefined") { y = 0; }
            if (typeof z === "undefined") { z = 0; }
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.edges = new Array();
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Point.prototype.toString = function () {
            return "[" + this.x + "," + this.y + "," + this.z + "]";
        };

        Point.prototype.addEdge = function (point, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            if (!this.hasEdge(point)) {
                this.edges[point.toString()] = new Edge(this, point, unidirected);
                if (!unidirected) {
                    point.addEdge(this, unidirected);
                }
            }
            return this.getEdge(point);
        };

        Point.prototype.getEdge = function (point) {
            if (this.hasEdge(point)) {
                this.edges[point.toString()];
            }
            return undefined;
        };

        Point.prototype.hasEdge = function (point) {
            return (this.edges[point.toString()] != undefined);
        };

        Point.prototype.removeEdge = function (point, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            if (this.hasEdge(point)) {
                var edge = this.getEdge(point);
                var index = this.edges.indexOf(edge);
                if (index !== -1) {
                    this.edges.splice(index, 1);
                    if (!unidirected && !edge.unidirected) {
                        point.removeEdge(this);
                    }
                    return edge;
                }
            }
            return undefined;
        };
        return Point;
    })();
    _Graph.Point = Point;

    var Edge = (function () {
        function Edge(startPoint, endPoint, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            this.startPoint = new Point();
            this.endPoint = new Point();
            this.unidirected = false;
            this.startPoint = startPoint;
            this.endPoint = endPoint;
            this.unidirected = unidirected;
        }
        Edge.prototype.toString = function () {
            return "[" + this.startPoint.toString() + this.endPoint.toString() + "]";
        };
        return Edge;
    })();
    _Graph.Edge = Edge;

    var Graph = (function () {
        function Graph() {
            this.points = new Array();
            this.edges = new Array();
        }
        Graph.prototype.hasPoint = function (point) {
            return (this.points[point.toString()] != undefined);
        };

        Graph.prototype.addPoint = function (point) {
            if (!this.hasPoint(point)) {
                this.points[point.toString()] = point;
            }
        };

        Graph.prototype.removePoint = function (point) {
            if (this.hasPoint(point)) {
                var index = this.points.indexOf(point);
                if (index !== -1) {
                    this.points.slice(index, 1);
                    var _this = this;
                    point.edges.forEach(function (edge) {
                        _this.removeEdge(point, edge.endPoint, edge.unidirected);
                    });
                }
            }
        };

        Graph.prototype.hasEdge = function (startPoint, endPoint) {
            if (this.hasPoint(startPoint)) {
                return startPoint.hasEdge(endPoint);
            }
            return false;
        };

        Graph.prototype.inEdges = function (edge) {
            return (this.edges[edge.toString()] !== undefined);
        };

        Graph.prototype.addEdge = function (startPoint, endPoint, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            this.addPoint(startPoint);
            this.addPoint(endPoint);
            var edge = startPoint.addEdge(endPoint, unidirected);
            if (edge !== undefined && !this.inEdges(edge)) {
                this.edges[edge.toString()] = edge;
                if (!unidirected) {
                    edge = endPoint.getEdge(startPoint);
                    if (edge !== undefined && !this.inEdges(edge)) {
                        this.edges[edge.toString()] = edge;
                    }
                }
            }
        };

        Graph.prototype.removeEdge = function (startPoint, endPoint, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            var edge = startPoint.removeEdge(endPoint, true);
            if (this.inEdges(edge)) {
                var index = this.edges.indexOf(edge);
                if (index !== -1) {
                    this.edges.splice(index, 1);
                }
            }
            if (!unidirected) {
                edge = endPoint.removeEdge(startPoint, true);
                if (this.inEdges(edge)) {
                    var index = this.edges.indexOf(edge);
                    if (index !== -1) {
                        this.edges.splice(index, 1);
                    }
                }
            }
        };

        //shoortest path from point
        Graph.prototype.dijsktra = function (point) {
            var result = { dist: new Array(), previous: new Array() };
            var infinity = 18437736874454810627;
            this.points.forEach(function (value, index) {
                result.dist[value.toString()] = infinity;
                result.previous[value.toString()] = undefined;
            });
            result[point.toString()] = 0;
            return result;
        };

        //shortest path for all points
        Graph.prototype.flojdWarsshall = function () {
        };

        //minimum spanning tree
        Graph.prototype.kruskal = function () {
        };
        return Graph;
    })();
    _Graph.Graph = Graph;
})(Graph || (Graph = {}));
//# sourceMappingURL=Graph.js.map
