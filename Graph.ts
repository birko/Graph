module Graph {
    "use strict";
    export class Vertex {
        public edges: Array<Edge> = new Array();

        constructor() {
            this.edges = new Array();
        }

        identify(): string {
            throw new Error("This method is abstract");
        }

        toString(): string {
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
                this.edges[vertex.identify()];
            }
            return undefined;
        }

        hasEdge(vertex: Vertex): boolean {
            return (this.edges[vertex.identify()] !== undefined);
        }

        removeEdge(vertex: Vertex, unidirected: boolean = false):Edge {
            if (this.hasEdge(vertex)) {
                var edge:Edge = this.getEdge(vertex);
                var index:number = this.edges.indexOf(edge);
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

        constructor(startVertex: Vertex, endVertex: Vertex, unidirected: boolean = false) {
            this.startVertex = startVertex;
            this.endVertex = endVertex;
            this.unidirected = unidirected;
        }

        identify(): string {
            return "[" + this.startVertex.identify() + ", " + this.endVertex.identify() + "]";
        }

        toString(): string {
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
        public static infinity:number = 18437736874454810627;
        public verticles: Array<Vertex> = new Array();
        public edges: Array<Edge> = new Array();

        hasVertex(vertex: Vertex): boolean {
            return (this.verticles[vertex.identify()] !== undefined);
        }

        addVertex(vertex: Vertex): void {
            if (!this.hasVertex(vertex)) {
                this.verticles[vertex.identify()] = vertex;
            }
        }

        removeVertex(vertex: Vertex): void {
            if (this.hasVertex(vertex)) {
                var index:number = this.verticles.indexOf(vertex);
                if (index !== -1) {
                    this.verticles.slice(index, 1);
                    vertex.edges.forEach(function (edge: Edge):void {
                        this.removeEdge(vertex, edge.endVertex, edge.unidirected);
                    }.bind(this));
                }
            }
        }

        hasEdge(startVertex: Vertex, endVertex: Vertex): boolean {
            if (this.hasVertex(startVertex)) {
                return startVertex.hasEdge(endVertex);
            }
            return false;
        }

        inEdges(edge:Edge): boolean {
            return (this.edges[edge.identify()] !== undefined);
        }

        addEdge(startVertex:Vertex, endVertex: Vertex, unidirected: boolean = false) : void {
            this.addVertex(startVertex);
            this.addVertex(endVertex);
            var edge: Edge = startVertex.addEdge(endVertex, unidirected);
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

        removeEdge(startVertext: Vertex, endVertext: Vertex, unidirected: boolean = false): void {
            var edge: Edge = startVertext.removeEdge(endVertext, true);
            var index: number = -1;
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
        }

        // shoortest path from vertex
        dijsktra(vertex: Vertex, weightFunction:(edge: Edge) => number): { weight: Array<number>; previous: Array<Vertex> } {
            var result: { weight: Array<number>; previous: Array<Vertex> }  = { weight: new Array(), previous: new Array() };
            var verticlesQueue: Array<Vertex> = new Array();
            // init result
            this.verticles.forEach(function (value: Vertex, index: number): void {
                result.weight[value.identify()] = Graph.infinity;
                result.previous[value.identify()] = undefined;
                verticlesQueue[index] = value;
            });
            
            result.weight[vertex.identify()] = 0;
            // sort verticlesQueue according result.weight
            verticlesQueue.sort(function(p1:Vertex, p2:Vertex): number {
                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
            });
            
            while(verticlesQueue.length > 0) {
                var u:Vertex = verticlesQueue.slice(0, 1)[0]; // get first vertex(with lowest weight)
                if (result.weight[u.identify()] === Graph.infinity) {
                    break;
                }
                
                // for each edges from vertex
                u.edges.forEach(function (value: Edge, index: number): void {
                    // if endvertex was not removed from verticlesQueue
                    var index2:number = verticlesQueue.indexOf(value.endVertex);
                    if (index2 !== -1) {
                        // compare weights
                        var alt:number = result.weight[u.identify()] + weightFunction(value);
                        if (alt < result.weight[u.identify()]) {
                            result.weight[value.endVertex.identify()] = alt;
                            result.previous[value.endVertex.identify()] = u;
                            // sort reduced verticesQueue according result.weight
                            verticlesQueue.sort(function(p1:Vertex, p2:Vertex): number {
                                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
                            });
                        }
                    }
                });
            }
            
            return result;
        }

        // shortest path for all verticles
        floydWarsshall(weightFunction:(edge: Edge) => number): { weight: Array<Array<number>>; next: Array<Array<Vertex>> } {
            var result: { weight: Array<Array<number>>; next: Array<Array<Vertex>> } = { weight: new Array(), next: new Array() };
            // init result
            var verticles: Array<Vertex> = this.verticles;
            verticles.forEach(function (value: Vertex, index: number): void {
                verticles.forEach(function (value2: Vertex, index2: number): void {
                    result.weight[value.identify()][value2.identify()] = Graph.infinity;
                    result.next[value.identify()][value2.identify()] = undefined;
                });
            });
            // the weight of the edge (u,v)
            this.edges.forEach(function (value: Edge, index: number): void {
                result.weight[value.startVertex.identify()][value.endVertex.identify()] = weightFunction(value);
            });

            // standard Floyd-Warshall implementation
            verticles.forEach(function (value: Vertex, index: number): void {
                verticles.forEach(function (value2: Vertex, index2: number): void {
                    verticles.forEach(function (value3: Vertex, index3: number): void {
                        var alt: number = (result.weight[value2.identify()][value.identify()]
                            + result.weight[value.identify()][value3.identify()]);
                        if (alt < result.weight[value2.identify()][value3.identify()]) {
                            result.weight[value2.identify()][value3.identify()] = alt;
                        }
                    });
                });
            });
            
            this.verticles.forEach(function (value: Vertex, index: number): void {
                result.next[value.identify()][value.identify()] = 0;
                result = this.floydWarsshallShortestPaths(value, value, weightFunction, result);
            });
            
            return result;
        }
        
        floydWarsshallShortestPaths(start: Vertex, end: Vertex,
            weightFunction: (edge: Edge) => number,
            data: { weight: Array<Array<number>>; next: Array<Array<Vertex>> })
            : { weight: Array<Array<number>>; next: Array<Array<Vertex>> } {
            start.edges.forEach(function(value: Edge, index: number): void {
                var alt:number = weightFunction(value) + data.weight[start.identify()][end.identify()];
                if ((data.weight[value.endVertex.identify()][end.identify()] === alt &&
                    data.next[start.identify()][value.endVertex.identify()] === undefined
                )) {
                    data.next[value.endVertex.identify()][end.identify()] = start;
                    data = this.floydWarsshallShortestPaths(value.endVertex, end, weightFunction, data);
                }
            });
            
            return data;
        }
        
        floydWarsshallShortestPath(start: Vertex, end: Vertex, data: { weight: Array<Array<number>>; next: Array<Array<Vertex>> })
            : Array<Vertex> {
            var result:Array<Vertex> = new Array();
            if (data.next[start.identify()][end.identify()] === undefined) {
                return result;
            }
            result[0] = start;
            while(start !== end) {
                start = data.next[start.identify()][end.identify()];
                result.push(start);
            }
            
            return result;
        }

        // minimum spanning tree
        kruskal(weightFunction:(edge: Edge) => number): Graph {
            var edges: Array<Edge> = new Array();
            this.edges.forEach(function(value: Edge, index: number): void {
                edges[index] = value;
            });
            edges.sort(function(e1: Edge, e2: Edge):number {
                return (weightFunction(e1) - weightFunction(e2));
            });
            var result: Graph = new Graph();
            edges.forEach(function(value: Edge, index: number):void {
                if (!(result.hasVertex(value.startVertex) && result.hasVertex(value.endVertex))) {
                    var start:Vertex = undefined;
                    var end:Vertex = undefined;

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