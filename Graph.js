var Graph;
(function (_Graph) {
    "use strict";
    var Vertex = (function () {
        function Vertex() {
            this.edges = new Array();
            this.edges = new Array();
        }
        Vertex.prototype.identify = function () {
            throw new Error("This method is abstract");
        };

        Vertex.prototype.toString = function () {
            return "Vertex: " + this.identify();
        };

        Vertex.prototype.addEdge = function (vertex, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            if (!this.hasEdge(vertex)) {
                this.edges[vertex.identify()] = new Edge(this, vertex, unidirected);
                if (!unidirected) {
                    vertex.addEdge(this, unidirected);
                }
            }
            return this.getEdge(vertex);
        };

        Vertex.prototype.getEdge = function (vertex) {
            if (this.hasEdge(vertex)) {
                this.edges[vertex.identify()];
            }
            return undefined;
        };

        Vertex.prototype.hasEdge = function (vertex) {
            return (this.edges[vertex.identify()] !== undefined);
        };

        Vertex.prototype.removeEdge = function (vertex, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            if (this.hasEdge(vertex)) {
                var edge = this.getEdge(vertex);
                var index = this.edges.indexOf(edge);
                if (index !== -1) {
                    this.edges.splice(index, 1);
                    if (!unidirected && !edge.unidirected) {
                        vertex.removeEdge(this);
                    }
                    return edge;
                }
            }
            return undefined;
        };

        Vertex.prototype.copy = function (value) {
            return this;
        };
        return Vertex;
    })();
    _Graph.Vertex = Vertex;

    var Edge = (function () {
        function Edge(startVertex, endVertex, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            this.startVertex = new Vertex();
            this.endVertex = new Vertex();
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

        Edge.prototype.copy = function (value) {
            this.startVertex.copy(value.startVertex);
            this.endVertex.copy(value.endVertex);
            this.unidirected = value.unidirected;

            return this;
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

        Graph.prototype.removeVertex = function (vertex) {
            if (this.hasVertex(vertex)) {
                var index = this.vertices.indexOf(vertex);
                if (index !== -1) {
                    this.vertices.slice(index, 1);
                    vertex.edges.forEach(function (edge) {
                        this.removeEdge(vertex, edge.endVertex, edge.unidirected);
                    }.bind(this));
                }
            }
        };

        Graph.prototype.hasEdge = function (startVertex, endVertex) {
            if (this.hasVertex(startVertex)) {
                return startVertex.hasEdge(endVertex);
            }
            return false;
        };

        Graph.prototype.inEdges = function (edge) {
            return (this.edges[edge.identify()] !== undefined);
        };

        Graph.prototype.addEdge = function (startVertex, endVertex, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            this.addVertex(startVertex);
            this.addVertex(endVertex);
            var edge = startVertex.addEdge(endVertex, unidirected);
            if (edge !== undefined && !this.inEdges(edge)) {
                this.edges[edge.identify()] = edge;
                if (!unidirected) {
                    edge = endVertex.getEdge(startVertex);
                    if (edge !== undefined && !this.inEdges(edge)) {
                        this.edges[edge.identify()] = edge;
                    }
                }
            }
        };

        Graph.prototype.removeEdge = function (startVertext, endVertext, unidirected) {
            if (typeof unidirected === "undefined") { unidirected = false; }
            var edge = startVertext.removeEdge(endVertext, true);
            var index = -1;
            if (this.inEdges(edge)) {
                index = this.edges.indexOf(edge);
                if (index !== -1) {
                    this.edges.splice(index, 1);
                }
            }
            if (!unidirected) {
                edge = endVertext.removeEdge(startVertext, true);
                if (this.inEdges(edge)) {
                    index = this.edges.indexOf(edge);
                    if (index !== -1) {
                        this.edges.splice(index, 1);
                    }
                }
            }
        };

        // shoortest path from vertex
        Graph.prototype.dijsktra = function (vertex, weightFunction) {
            var result = { weight: new Array(), previous: new Array() };
            var verticesQueue = new Array();

            // init result
            this.vertices.forEach(function (value, index) {
                result.weight[value.identify()] = Graph.infinity;
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
                if (result.weight[u.identify()] === Graph.infinity) {
                    break;
                }

                // for each edges from vertex
                u.edges.forEach(function (value, index) {
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
                    result.weight[value.identify()][value2.identify()] = Graph.infinity;
                    result.next[value.identify()][value2.identify()] = undefined;
                });
            });

            // the weight of the edge (u,v)
            this.edges.forEach(function (value, index) {
                result.weight[value.startVertex.identify()][value.endVertex.identify()] = weightFunction(value);
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
            start.edges.forEach(function (value, index) {
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
                    var start = undefined;
                    var end = undefined;

                    if (result.hasVertex(value.startVertex)) {
                        start = result.vertices[value.startVertex.identify()];
                    } else {
                        start = new Vertex();
                        start.copy(value.startVertex);
                    }
                    if (result.hasVertex(value.endVertex)) {
                        end = result.vertices[value.endVertex.identify()];
                    } else {
                        end = new Vertex();
                        end.copy(value.endVertex);
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
