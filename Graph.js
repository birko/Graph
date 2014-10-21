var Graph;
(function (_Graph) {
    "use strict";

    var Edge = (function () {
        function Edge(startVertex, endVertex, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            this.unidirected = false;
            this.startVertex = startVertex;
            this.endVertex = endVertex;
            this.unidirected = unidirected;
        }
        Edge.prototype.identify = function () {
            return "[" + this.startVertex.identify() + ", " + this.endVertex.identify() + "]";
        };

        Edge.prototype.toString = function () {
            return "Edge: " + this.identify();
        };

        Edge.prototype.clone = function () {
            return new Edge(this.startVertex, this.endVertex, this.unidirected);
        };
        return Edge;
    })();
    _Graph.Edge = Edge;

    var Graph = (function () {
        function Graph() {
            this.vertices = new Array();
            this.edges = new Array();
        }
        Graph.prototype.hasVertex = function (vertex) {
            return (this.vertices[vertex.identify()] !== undefined);
        };

        Graph.prototype.addVertex = function (vertex) {
            if (!this.hasVertex(vertex)) {
                this.vertices[vertex.identify()] = vertex;
            }
        };

        Graph.prototype.getNeighbours = function (vertex) {
            var result = new Array();
            var edges = this.getEdges(vertex);
            edges.forEach(function (value, index) {
                var pushVertex = value.endVertex;
                if (result.indexOf(pushVertex) === -1 && pushVertex.compare(vertex) !== 0) {
                    result.push(pushVertex);
                }
            });
            return result;
        };

        Graph.prototype.getEdges = function (vertex, bothWay) {
            if (typeof bothWay === "undefined") { bothWay = true; }
            return this.edges.filter(function (value, index) {
                return (value.startVertex.compare(vertex) === 0 || (bothWay && !value.unidirected && value.endVertex.compare(vertex) === 0));
            });
        };

        Graph.prototype.removeVertex = function (vertex) {
            if (this.hasVertex(vertex)) {
                var index = this.vertices.indexOf(vertex);
                if (index !== -1) {
                    var edges = this.getEdges(vertex);
                    this.vertices.slice(index, 1);
                    edges.forEach(function (edge) {
                        this.removeEdge(edge);
                    }.bind(this));
                }
            }
        };

        Graph.prototype.getEdge = function (startVertex, endVertex, bothWay) {
            if (typeof bothWay === "undefined") { bothWay = true; }
            var edges = this.getEdges(startVertex, bothWay);
            var edge;
            edges.forEach(function (value) {
                if ((edge === undefined) && (value.endVertex.compare(endVertex) === 0)) {
                    edge = value;
                }
            });
            return edge;
        };

        Graph.prototype.hasEdge = function (startVertex, endVertex, bothWay) {
            if (typeof bothWay === "undefined") { bothWay = true; }
            var edge = this.getEdge(startVertex, endVertex, bothWay);
            return (edge !== undefined);
        };

        Graph.prototype.addEdge = function (edge) {
            var testEdge = this.getEdge(edge.startVertex, edge.endVertex, false);
            var testEdge2 = this.getEdge(edge.endVertex, edge.startVertex, false);
            if (edge !== undefined && ((testEdge === undefined) || (testEdge2 === undefined))) {
                this.addVertex(edge.startVertex);
                this.addVertex(edge.endVertex);
                this.edges.push(edge);
            }
        };

        Graph.prototype.removeEdge = function (startVertext, endVertext) {
            var edge = this.getEdge(startVertext, endVertext, false);
            if (edge !== undefined) {
                var index = this.edges.indexOf(edge);
                if (index !== -1) {
                    this.edges.slice(index, 1);
                }
            }
        };

        // shoortest path from vertex
        Graph.prototype.dijsktra = function (vertex, weightFunction) {
            var result = { weight: new Array(), previous: new Array() };
            var verticesQueue = new Array();

            // init result
            this.vertices.forEach(function (value, index) {
                result.weight[value.identify()] = Infinity;
                result.previous[value.identify()] = undefined;
                verticesQueue[index] = value;
            });

            result.weight[vertex.identify()] = 0;

            // sort verticesQueue according result.weight
            verticesQueue.sort(function (p1, p2) {
                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
            });

            while (verticesQueue.length > 0) {
                var u = verticesQueue.slice(0, 1)[0];
                if (result.weight[u.identify()] === Infinity) {
                    break;
                }

                // for each edges from vertex
                this.getEdges(u).forEach(function (value, index) {
                    // if endvertex was not removed from verticesQueue
                    var index2 = verticesQueue.indexOf(value.endVertex);
                    if (index2 !== -1) {
                        // compare weights
                        var alt = result.weight[u.identify()] + weightFunction(value);
                        if (alt < result.weight[u.identify()]) {
                            result.weight[value.endVertex.identify()] = alt;
                            result.previous[value.endVertex.identify()] = u;

                            // sort reduced verticesQueue according result.weight
                            verticesQueue.sort(function (p1, p2) {
                                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
                            });
                        }
                    }
                });
            }

            return result;
        };

        // shortest path for all vertices
        Graph.prototype.floydWarsshall = function (weightFunction) {
            var result = { weight: new Array(), next: new Array() };

            // init result
            var vertices = this.vertices;
            vertices.forEach(function (value, index) {
                vertices.forEach(function (value2, index2) {
                    result.weight[value.identify()][value2.identify()] = Infinity;
                    result.next[value.identify()][value2.identify()] = undefined;
                });
            });

            // the weight of the edge (u,v)
            this.edges.forEach(function (value, index) {
                result.weight[value.startVertex.identify()][value.endVertex.identify()] = weightFunction(value);
                if (!value.unidirected) {
                    result.weight[value.endVertex.identify()][value.startVertex.identify()] = weightFunction(value);
                }
            });

            // standard Floyd-Warshall implementation
            vertices.forEach(function (value, index) {
                vertices.forEach(function (value2, index2) {
                    vertices.forEach(function (value3, index3) {
                        var alt = (result.weight[value2.identify()][value.identify()] + result.weight[value.identify()][value3.identify()]);
                        if (alt < result.weight[value2.identify()][value3.identify()]) {
                            result.weight[value2.identify()][value3.identify()] = alt;
                        }
                    });
                });
            });

            this.vertices.forEach(function (value, index) {
                result.next[value.identify()][value.identify()] = 0;
                result = this.floydWarsshallShortestPaths(value, value, weightFunction, result);
            });

            return result;
        };

        Graph.prototype.floydWarsshallShortestPaths = function (start, end, weightFunction, data) {
            this.getEdges(start).forEach(function (value, index) {
                var alt = weightFunction(value) + data.weight[start.identify()][end.identify()];
                if ((data.weight[value.endVertex.identify()][end.identify()] === alt && data.next[start.identify()][value.endVertex.identify()] === undefined)) {
                    data.next[value.endVertex.identify()][end.identify()] = start;
                    data = this.floydWarsshallShortestPaths(value.endVertex, end, weightFunction, data);
                }
            });

            return data;
        };

        Graph.prototype.floydWarsshallShortestPath = function (start, end, data) {
            var result = new Array();
            if (data.next[start.identify()][end.identify()] === undefined) {
                return result;
            }
            result[0] = start;
            while (start !== end) {
                start = data.next[start.identify()][end.identify()];
                result.push(start);
            }

            return result;
        };

        // minimum spanning tree
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
                if (!(result.hasVertex(value.startVertex) && result.hasVertex(value.endVertex))) {
                    var edge = value.clone();
                    result.addEdge(edge);
                }
            });

            return result;
        };
        return Graph;
    })();
    _Graph.Graph = Graph;
})(Graph || (Graph = {}));
//# sourceMappingURL=Graph.js.map
