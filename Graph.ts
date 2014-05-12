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

        addEdge(edge: Edge): void {
            if (!this.hasEdge(edge.endVertex)) {
                edge.startVertex = this;
                this.edges[edge.endVertex.identify()] = edge;
                if (!edge.unidirected) {
                    var cloneedge = edge.clone();
                    cloneedge.endVertex = this;
                    edge.endVertex.addEdge(cloneedge);
                }
            }
        }

        createEdge(vertex: Vertex, unidirected: boolean = false): Edge {
            var edge = new Edge(this, vertex, unidirected);
            this.addEdge(edge);
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

        clone(): Edge {
            return new Edge(this.startVertex, this.endVertex, this.unidirected);
        }
    }

    export class Graph {
        public static infinity:number = 18437736874454810627;
        public vertices: Array<Vertex> = new Array();
        public edges: Array<Edge> = new Array();

        hasVertex(vertex: Vertex): boolean {
            return (this.vertices[vertex.identify()] !== undefined);
        }

        addVertex(vertex: Vertex): void {
            if (!this.hasVertex(vertex)) {
                this.vertices[vertex.identify()] = vertex;
            }
        }

        removeVertex(vertex: Vertex): void {
            if (this.hasVertex(vertex)) {
                var index:number = this.vertices.indexOf(vertex);
                if (index !== -1) {
                    this.vertices.slice(index, 1);
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

        addEdge(edge: Edge): void {
            if (edge !== undefined && !this.inEdges(edge)) {
                this.addVertex(edge.startVertex);
                this.addVertex(edge.endVertex);
                this.edges[edge.identify()] = edge;
                if (!edge.unidirected) {
                    var edgeopisite = edge.endVertex.getEdge(edge.startVertex);
                    this.edges[edgeopisite.identify()] = edgeopisite;
                }
            }
        }

        createEdge(startVertex:Vertex, endVertex: Vertex, unidirected: boolean = false) : Edge {
            var edge: Edge = new Edge(startVertex, endVertex, unidirected);
            this.addEdge(edge);
            if (this.inEdges(edge)) {
                return edge;
            }

            return undefined;
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
            var verticesQueue: Array<Vertex> = new Array();
            // init result
            this.vertices.forEach(function (value: Vertex, index: number): void {
                result.weight[value.identify()] = Graph.infinity;
                result.previous[value.identify()] = undefined;
                verticesQueue[index] = value;
            });
            
            result.weight[vertex.identify()] = 0;
            // sort verticesQueue according result.weight
            verticesQueue.sort(function(p1:Vertex, p2:Vertex): number {
                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
            });
            
            while(verticesQueue.length > 0) {
                var u:Vertex = verticesQueue.slice(0, 1)[0]; // get first vertex(with lowest weight)
                if (result.weight[u.identify()] === Graph.infinity) {
                    break;
                }
                
                // for each edges from vertex
                u.edges.forEach(function (value: Edge, index: number): void {
                    // if endvertex was not removed from verticesQueue
                    var index2:number = verticesQueue.indexOf(value.endVertex);
                    if (index2 !== -1) {
                        // compare weights
                        var alt:number = result.weight[u.identify()] + weightFunction(value);
                        if (alt < result.weight[u.identify()]) {
                            result.weight[value.endVertex.identify()] = alt;
                            result.previous[value.endVertex.identify()] = u;
                            // sort reduced verticesQueue according result.weight
                            verticesQueue.sort(function(p1:Vertex, p2:Vertex): number {
                                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
                            });
                        }
                    }
                });
            }
            
            return result;
        }

        // shortest path for all vertices
        floydWarsshall(weightFunction:(edge: Edge) => number): { weight: Array<Array<number>>; next: Array<Array<Vertex>> } {
            var result: { weight: Array<Array<number>>; next: Array<Array<Vertex>> } = { weight: new Array(), next: new Array() };
            // init result
            var vertices: Array<Vertex> = this.vertices;
            vertices.forEach(function (value: Vertex, index: number): void {
                vertices.forEach(function (value2: Vertex, index2: number): void {
                    result.weight[value.identify()][value2.identify()] = Graph.infinity;
                    result.next[value.identify()][value2.identify()] = undefined;
                });
            });
            // the weight of the edge (u,v)
            this.edges.forEach(function (value: Edge, index: number): void {
                result.weight[value.startVertex.identify()][value.endVertex.identify()] = weightFunction(value);
            });

            // standard Floyd-Warshall implementation
            vertices.forEach(function (value: Vertex, index: number): void {
                vertices.forEach(function (value2: Vertex, index2: number): void {
                    vertices.forEach(function (value3: Vertex, index3: number): void {
                        var alt: number = (result.weight[value2.identify()][value.identify()]
                            + result.weight[value.identify()][value3.identify()]);
                        if (alt < result.weight[value2.identify()][value3.identify()]) {
                            result.weight[value2.identify()][value3.identify()] = alt;
                        }
                    });
                });
            });
            
            this.vertices.forEach(function (value: Vertex, index: number): void {
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
                    var edge: Edge = value.clone();

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
                    edge.startVertex = start;
                    edge.endVertex = end;
                    result.addEdge(edge);
                }
            });
            
            return result;
        }
    }
}