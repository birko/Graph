module Graph {
    "use strict";
    export interface IVertex {
        identify(): string;
        clone(): IVertex;
        compare(value: IVertex): number;
    }

    export class Edge {
        public startVertex: IVertex;
        public endVertex: IVertex ;
        public unidirected: boolean = false;

        constructor(startVertex: IVertex, endVertex: IVertex, unidirected: boolean = false) {
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

        clone(): Edge {
            return new Edge(this.startVertex, this.endVertex, this.unidirected);
        }
    }

    export class Graph {
        public vertices: Array<IVertex> = new Array();
        public edges: Array<Edge> = new Array();

        hasVertex(vertex: IVertex): boolean {
            return (this.vertices[vertex.identify()] !== undefined);
        }

        addVertex(vertex: IVertex): void {
            if (!this.hasVertex(vertex)) {
                this.vertices[vertex.identify()] = vertex;
            }
        }

        getNeighbours(vertex: IVertex): Array<IVertex> {
            var result: Array<IVertex> = new Array();
            var edges: Array<Edge> = this.getEdges(vertex);
            edges.forEach(function (value: Edge, index: number):void {
                var pushVertex: IVertex =  value.endVertex;
                if (result.indexOf(pushVertex) === -1 && pushVertex.compare(vertex) !== 0) {
                    result.push(pushVertex);
                }
            });
            return result;
        }

        getEdges(vertex: IVertex): Array<Edge> {
            return this.edges.filter(function (value: Edge, index: number): boolean {
                return (value.startVertex.compare(vertex) === 0);
            });
        }

        removeVertex(vertex: IVertex): void {
            if (this.hasVertex(vertex)) {
                var index:number = this.vertices.indexOf(vertex);
                if (index !== -1) {
                    var edges: Array<Edge> = this.getEdges(vertex);
                    this.vertices.slice(index, 1);
                    edges.forEach(function (edge: Edge):void {
                        this.removeEdge(edge);
                    }.bind(this));
                }
            }
        }

        getEdge(startVertex: IVertex, endVertex: IVertex): Edge {
            var edges: Array<Edge> = this.getEdges(startVertex);
            var edge: Edge;
            edges.forEach(function (value: Edge): void {
                if ((edge === undefined) && (value.endVertex.compare(endVertex) === 0)) {
                    edge = value;
                }
            });
            return undefined;
        }

        hasEdge(startVertex: IVertex, endVertex: IVertex): boolean {
            var edge: Edge = this.getEdge(startVertex, endVertex);
            return (edge !== undefined);
        }

        addEdge(edge: Edge): void {
            if (edge !== undefined && !this.hasEdge(edge.startVertex, edge.endVertex)) {
                this.addVertex(edge.startVertex);
                this.addVertex(edge.endVertex);
                this.edges.push(edge);
                if (!edge.unidirected) {
                    var cloneEdge: Edge = edge.clone();
                    cloneEdge.startVertex = edge.endVertex;
                    cloneEdge.endVertex = edge.startVertex;
                    this.edges.push(cloneEdge);
                }
            }
        }

        removeEdge(startVertext: IVertex, endVertext: IVertex): void {
            var edge: Edge = this.getEdge(startVertext, endVertext);
            if (edge !== undefined) {
                var index: number = this.edges.indexOf(edge);
                if (index !== -1) {
                    this.edges.slice(index, 1);
                }
                if (edge.unidirected) {
                    edge = this.getEdge(endVertext, startVertext);
                    if (edge !== undefined) {
                        index = this.edges.indexOf(edge);
                        if (index !== -1) {
                            this.edges.slice(index, 1);
                        }
                    }
                }
            }
        }

        // shoortest path from vertex
        dijsktra(vertex: IVertex, weightFunction:(edge: Edge) => number): { weight: Array<number>; previous: Array<IVertex> } {
            var result: { weight: Array<number>; previous: Array<IVertex> }  = { weight: new Array(), previous: new Array() };
            var verticesQueue: Array<IVertex> = new Array();
            // init result
            this.vertices.forEach(function (value: IVertex, index: number): void {
                result.weight[value.identify()] = Infinity;
                result.previous[value.identify()] = undefined;
                verticesQueue[index] = value;
            });
            
            result.weight[vertex.identify()] = 0;
            // sort verticesQueue according result.weight
            verticesQueue.sort(function(p1:IVertex, p2:IVertex): number {
                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
            });
            
            while(verticesQueue.length > 0) {
                var u:IVertex = verticesQueue.slice(0, 1)[0]; // get first vertex(with lowest weight)
                if (result.weight[u.identify()] === Infinity) {
                    break;
                }
                
                // for each edges from vertex
                this.getEdges(u).forEach(function (value: Edge, index: number): void {
                    // if endvertex was not removed from verticesQueue
                    var index2:number = verticesQueue.indexOf(value.endVertex);
                    if (index2 !== -1) {
                        // compare weights
                        var alt:number = result.weight[u.identify()] + weightFunction(value);
                        if (alt < result.weight[u.identify()]) {
                            result.weight[value.endVertex.identify()] = alt;
                            result.previous[value.endVertex.identify()] = u;
                            // sort reduced verticesQueue according result.weight
                            verticesQueue.sort(function(p1:IVertex, p2:IVertex): number {
                                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
                            });
                        }
                    }
                });
            }
            
            return result;
        }

        // shortest path for all vertices
        floydWarsshall(weightFunction:(edge: Edge) => number): { weight: Array<Array<number>>; next: Array<Array<IVertex>> } {
            var result: { weight: Array<Array<number>>; next: Array<Array<IVertex>> } = { weight: new Array(), next: new Array() };
            // init result
            var vertices: Array<IVertex> = this.vertices;
            vertices.forEach(function (value: IVertex, index: number): void {
                vertices.forEach(function (value2: IVertex, index2: number): void {
                    result.weight[value.identify()][value2.identify()] = Infinity;
                    result.next[value.identify()][value2.identify()] = undefined;
                });
            });
            // the weight of the edge (u,v)
            this.edges.forEach(function (value: Edge, index: number): void {
                result.weight[value.startVertex.identify()][value.endVertex.identify()] = weightFunction(value);
            });

            // standard Floyd-Warshall implementation
            vertices.forEach(function (value: IVertex, index: number): void {
                vertices.forEach(function (value2: IVertex, index2: number): void {
                    vertices.forEach(function (value3: IVertex, index3: number): void {
                        var alt: number = (result.weight[value2.identify()][value.identify()]
                            + result.weight[value.identify()][value3.identify()]);
                        if (alt < result.weight[value2.identify()][value3.identify()]) {
                            result.weight[value2.identify()][value3.identify()] = alt;
                        }
                    });
                });
            });
            
            this.vertices.forEach(function (value: IVertex, index: number): void {
                result.next[value.identify()][value.identify()] = 0;
                result = this.floydWarsshallShortestPaths(value, value, weightFunction, result);
            });
            
            return result;
        }
        
        floydWarsshallShortestPaths(start: IVertex, end: IVertex,
            weightFunction: (edge: Edge) => number,
            data: { weight: Array<Array<number>>; next: Array<Array<IVertex>> })
            : { weight: Array<Array<number>>; next: Array<Array<IVertex>> } {
            this.getEdges(start).forEach(function(value: Edge, index: number): void {
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
        
        floydWarsshallShortestPath(start: IVertex, end: IVertex, data: { weight: Array<Array<number>>; next: Array<Array<IVertex>> })
            : Array<IVertex> {
            var result:Array<IVertex> = new Array();
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
                    var start: IVertex = value.startVertex.clone();
                    var end: IVertex = value.endVertex.clone();;
                    var edge: Edge = value.clone();
                    edge.startVertex = start;
                    edge.endVertex = end;
                    result.addEdge(edge);
                }
            });
            
            return result;
        }
    }
}