module Graph {
    export class Vertex {
        public edges: Array<Edge> = new Array();

        constructor() {}

        identify(): string {
            throw new Error('This method is abstract');
        }

        toString() {
            return "Vertex: " + this.identify();
        }

        addEdge(vertex: Vertex, unidirected: boolean = false): Edge {
            if (!this.hasEdge(vertex)) {
                this.edges[vertex.identify()] = new Edge(this, vertex, unidirected);
                if (!unidirected) {
                    vertex.addEdge(this, unidirected);
                }
            }
            return this.getEdge(vertex);
        }

        getEdge(vertex: Vertex): Edge {
            if (this.hasEdge(vertex)) {
                this.edges[vertex.identify()]
            }
            return undefined;
        }

        hasEdge(vertex: Vertex): boolean {
            return (this.edges[vertex.identify()] != undefined);
        }

        removeEdge(vertex: Vertex, unidirected: boolean = false):Edge {
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
        }

        copy(value: Vertex) : Vertex {
            return this;
        }
    }

    export class Edge {
        public startVertex: Vertex = new Vertex();
        public endVertex: Vertex = new Vertex();
        public unidirected: boolean = false;

        constructor(startVertex, endVertex: Vertex, unidirected: boolean = false) {
            this.startVertex = startVertex;
            this.endVertex = endVertex;
            this.unidirected = unidirected;
        }

        identify(): string {
            return "[" + this.startVertex.identify() + ', '+ this.endVertex.identify() + "]";
        }

        toString() {
            return "Edge: " + this.identify();
        }

        copy(value: Edge): Edge {
            this.startVertex.copy(value.startVertex);
            this.endVertex.copy(value.endVertex);
            this.unidirected = value.unidirected;

            return this;
        }
    }

    export class Graph {
        public static infinity = 18437736874454810627;
        public verticles: Array<Vertex> = new Array();
        public edges: Array<Edge> = new Array();

        hasVertex(vertex: Vertex): boolean {
            return (this.verticles[vertex.identify()] != undefined);
        }

        addVertex(vertex: Vertex) {
            if (!this.hasVertex(vertex)) {
                this.verticles[vertex.identify()] = vertex;
            }
        }

        removeVertex(vertex: Vertex) {
            if (this.hasVertex(vertex)) {
                var index = this.verticles.indexOf(vertex);
                if (index !== -1) {
                    this.verticles.slice(index, 1);
                    var _this = this;
                    vertex.edges.forEach(function (edge) {
                        _this.removeEdge(vertex, edge.endVertex, edge.unidirected);
                    });
                }
            }
        }

        hasEdge(startVertex, endVertex: Vertex): boolean {
            if (this.hasVertex(startVertex)) {
                return startVertex.hasEdge(endVertex);
            }
            return false;
        }

        inEdges(edge:Edge): boolean {
            return (this.edges[edge.identify()] !== undefined);
        }

        addEdge(startVertex, endVertex: Vertex, unidirected: boolean = false) {
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
        }

        removeEdge(startVertext, endVertext: Vertex, unidirected: boolean = false) {
            var edge = startVertext.removeEdge(endVertext, true);
            if (this.inEdges(edge)) {
                var index = this.edges.indexOf(edge);
                if (index !== -1) {
                    this.edges.splice(index, 1);
                }
            }
            if (!unidirected) {
                edge = endVertext.removeEdge(startVertext, true);
                if (this.inEdges(edge)) {
                    var index = this.edges.indexOf(edge);
                    if (index !== -1) {
                        this.edges.splice(index, 1);
                    }
                }
            }
        }

        //shoortest path from vertex
        dijsktra(vertex: Vertex, weightFunction:(edge: Edge) => number): { weight: Array<number>; previous: Array<Vertex> } {
            var result = { weight: new Array(), previous: new Array() };
            var verticlesQueue = new Array();
            //init result
            this.verticles.forEach(function (value: Vertex, index: number) {
                result.weight[value.identify()] = Graph.infinity;
                result.previous[value.identify()] = undefined;
                verticlesQueue[index] = value;
            });
            
            result.weight[vertex.identify()] = 0;
            //sort verticlesQueue according result.weight
            verticlesQueue.sort(function(p1, p2) {
                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
            });
            
            while(verticlesQueue.length > 0) {
                var u = verticlesQueue.slice(0, 1)[0]; //get first vertex(with lowest weight)
                if (result.weight[u.identify()] == Graph.infinity) {
                    break;
                }
                
                //for each edges from vertex
                u.edges.forEach(function (value: Edge, index: number) {
                    //if endvertex was not removed from verticlesQueue
                    var index = verticlesQueue.indexOf(value.endVertex);
                    if (index !== -1) {
                        //compare weights
                        var alt = result.weight[u.identify()] + weightFunction(value);
                        if (alt < result.weight[u.identify()]) {
                            result.weight[value.endVertex.identify()] = alt;
                            result.previous[value.endVertex.identify()] = u;
                            //sort reduced verticesQueue according result.weight
                            verticlesQueue.sort(function(p1, p2) {
                                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
                            });
                        }
                    }
                });
            }
            
            return result;
        }

        //shortest path for all verticles
        floydWarsshall(weightFunction:(edge: Edge) => number): { weight: Array<Array<number>>; next: Array<Array<Vertex>> } {
            var result = { weight: new Array(), next: new Array() };
            //init result
            var verticles = this.verticles;
            verticles.forEach(function (value: Vertex, index: number) {
                verticles.forEach(function (value2: Vertex, index2: number) {
                    result.weight[value.identify()][value2.identify()] = Graph.infinity;
                    result.next[value.identify()][value2.identify()] = undefined;
                });
            });
            // the weight of the edge (u,v)
            this.edges.forEach(function (value: Edge, index: number) {
                result.weight[value.startVertex.identify()][value.endVertex.identify()] = weightFunction(value);
            });

            // standard Floyd-Warshall implementation
            verticles.forEach(function (value: Vertex, index: number) {
                verticles.forEach(function (value2: Vertex, index2: number) {
                    verticles.forEach(function (value3: Vertex, index3: number) {
                        var alt = (result.weight[value2.identify()][value.identify()] + result.weight[value.identify()][value3.identify()]);
                        if (alt < result.weight[value2.identify()][value3.identify()]) {
                            result.weight[value2.identify()][value3.identify()] = alt;
                        }
                    });
                });
            });
            
            this.verticles.forEach(function (value: Vertex, index: number) {
                result.next[value.identify()][value.identify()] = 0;
                result = this.floydWarsshallShortestPaths(value, value, weightFunction, result);
            });
            
            return result;
        }
        
        floydWarsshallShortestPaths(start: Vertex, end: Vertex, weightFunction:(edge: Edge) => number, data: { weight: Array<Array<number>>; next: Array<Array<Vertex>> }): { weight: Array<Array<number>>; next: Array<Array<Vertex>> } {
            start.edges.forEach(function(value: Edge, index: number){
                var alt = weightFunction(value) + data.weight[start.identify()][end.identify()];
                if ((data.weight[value.endVertex.identify()][end.identify()] == alt && 
                    data.next[start.identify()][value.endVertex.identify()] == undefined
                )) {
                    data.next[value.endVertex.identify()][end.identify()] = start;
                    data = this.floydWarsshallShortestPaths(value.endVertex, end, weightFunction, data);
                }
            });
            
            return data;
        }
        
        floydWarsshallShortestPath(start: Vertex, end: Vertex, data: { weight: Array<Array<number>>; next: Array<Array<Vertex>> }): Array<Vertex> {
            var result = new Array();
            if (data.next[start.identify()][end.identify()] == undefined) {
                return result;
            }
            result[0] = start;
            while(start != end){
                start = data.next[start.identify()][end.identify()];
                result.push(start);
            }
            
            return result;
        }

        //minimum spanning tree
        kruskal(weightFunction:(edge: Edge) => number) {
            var edges = new Array();
            this.edges.forEach(function(value: Edge, index: number){
                edges[index] = value;
            });
            edges.sort(function(e1, e2) {
                return (weightFunction(e1) - weightFunction(e2));
            });
            var result = new Graph();
            edges.forEach(function(value: Edge, index: number){
                if (!(result.hasVertex(value.startVertex) && result.hasVertex(value.endVertex))) {
                    var start = undefined;
                    var end = undefined;

                    if (result.hasVertex(value.startVertex)) {
                        start = result.verticles[value.startVertex.identify()];
                    } else {
                        start = new Vertex();
                        start.copy(value.startVertex);
                    }
                    if (result.hasVertex(value.endVertex)) {
                        end = result.verticles[value.endVertex.identify()];
                    } else {
                        end = new Vertex();
                        end.copy(value.endVertex);
                    }

                    result.addEdge(start, end, value.unidirected);
                }
            });
            
            return result;
        }
    }
}