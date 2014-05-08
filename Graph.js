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

        Point.prototype.copy = function (value) {
            this.x = value.x;
            this.y = value.y;
            this.z = value.z;

            return this;
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

        Edge.prototype.copy = function (value) {
            this.startPoint.copy(value.startPoint);
            this.endPoint.copy(value.endPoint);
            this.unidirected = value.unidirected;

            return this;
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
        Graph.prototype.dijsktra = function (point, weightFunction) {
            var result = { weight: new Array(), previous: new Array() };
            var pointQueue = new Array();

            //init result
            this.points.forEach(function (value, index) {
                result.weight[value.toString()] = Graph.infinity;
                result.previous[value.toString()] = undefined;
                pointQueue[index] = value;
            });

            result.weight[point.toString()] = 0;

            //sort pointQueue according result.weight
            pointQueue.sort(function (p1, p2) {
                return (result.weight[p1.toString()] - result.weight[p2.toString()]);
            });

            while (pointQueue.length > 0) {
                var u = pointQueue.slice(0, 1)[0];
                if (result.weight[u.toString()] == Graph.infinity) {
                    break;
                }

                //for each edges from point
                u.edges.forEach(function (value, index) {
                    //if endpoint was not removed from pointQueue
                    var index = pointQueue.indexOf(value.endPoint);
                    if (index !== -1) {
                        //compare weights
                        var alt = result.weight[u.toString()] + weightFunction(value);
                        if (alt < result.weight[u.toString()]) {
                            result.weight[value.endPoint.toString()] = alt;
                            result.previous[value.endPoint.toString()] = u;

                            //sort reduced pointQueue according result.weight
                            pointQueue.sort(function (p1, p2) {
                                return (result.weight[p1.toString()] - result.weight[p2.toString()]);
                            });
                        }
                    }
                });
            }

            return result;
        };

        //shortest path for all points
        Graph.prototype.floydWarsshall = function (weightFunction) {
            var result = { weight: new Array(), next: new Array() };

            //init result
            this.points.forEach(function (value, index) {
                this.points.forEach(function (value2, index2) {
                    result.weight[value.toString()][value2.toString()] = Graph.infinity;
                    result.next[value.toString()][value2.toString()] = undefined;
                });
            });

            // the weight of the edge (u,v)
            this.edges.forEach(function (value, index) {
                result.weight[value.startPoint.toString()][value.endPoint.toString()] = weightFunction(value);
            });

            // standard Floyd-Warshall implementation
            this.points.forEach(function (value, index) {
                this.points.forEach(function (value2, index2) {
                    this.points.forEach(function (value3, index3) {
                        var alt = (result.weight[value2.toString()][value.toString()] + result.weight[value.toString()][value3.toString()]);
                        if (alt < result.weight[value2.toString()][value3.toString()]) {
                            result.weight[value2.toString()][value3.toString()] = alt;
                        }
                    });
                });
            });

            this.points.forEach(function (value, index) {
                result.next[value.toString()][value.toString()] = 0;
                result = this.floydWarsshallShortestPaths(value, value, weightFunction, result);
            });

            return result;
        };

        Graph.prototype.floydWarsshallShortestPaths = function (start, end, weightFunction, data) {
            start.edges.forEach(function (value, index) {
                var alt = weightFunction(value) + data.weight[start.toString()][end.toString()];
                if ((data.weight[value.endPoint.toString()][end.toString()] == alt && data.next[start.toString()][value.endPoint.toString()] == undefined)) {
                    data.next[value.endPoint.toString()][end.toString()] = start;
                    data = this.floydWarsshallShortestPaths(value.endPoint, end, weightFunction, data);
                }
            });

            return data;
        };

        Graph.prototype.floydWarsshallShortestPath = function (start, end, data) {
            var result = new Array();
            if (data.next[start.toString()][end.toString()] == undefined) {
                return result;
            }
            result[0] = start;
            while (start != end) {
                start = data.next[start.toString()][end.toString()];
                result.push(start);
            }

            return result;
        };

        //minimum spanning tree
        Graph.prototype.kruskal = function (weightFunction) {
            var edges = new Array();
            this.edges.forEach(function (value, index) {
                edges[index] = value;
            });
            edges.sort(function (e1, e2) {
                return (weightFunction(e1) - weightFunction(e2));
            });
            var result = new Graph();
            edges.forEach(function (value, index) {
                if (!(result.hasPoint(value.startPoint) && result.hasPoint(value.endPoint))) {
                    var start = undefined;
                    var end = undefined;

                    if (result.hasPoint(value.startPoint)) {
                        start = result.points[value.startPoint.toString()];
                    } else {
                        start = new Point();
                        start.copy(value.startPoint);
                    }
                    if (result.hasPoint(value.endPoint)) {
                        end = result.points[value.endPoint.toString()];
                    } else {
                        end = new Point();
                        end.copy(value.endPoint);
                    }

                    result.addEdge(start, end, value.unidirected);
                }
            });

            return result;
        };
        Graph.infinity = 18437736874454810627;
        return Graph;
    })();
    _Graph.Graph = Graph;
})(Graph || (Graph = {}));
//# sourceMappingURL=Graph.js.map
