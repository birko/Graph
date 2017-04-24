/// <reference path="../DataStructures/Types.ts" />

module Graph {
    "use strict";
    export interface IVertex {
        compare(value: IVertex): number;
        identify(): string;
    }

    export class DijsktraItem {
        private weight: number = Infinity;
        private previous: IVertex = null;

        constructor(weight: number, previous: IVertex) {
            this
                .setWeight(weight)
                .setPrevious(previous);
        }

        public getWeight(): number {
            return this.weight;
        }

        public setWeight(weight: number): DijsktraItem {
            this.weight = weight;
            return this;
        }

        public getPrevious(): IVertex {
            return this.previous;
        }

        public setPrevious(previous: IVertex): DijsktraItem {
            this.previous = previous;
            return this;
        }
    }

    export class FloydItem {
        private weight: number = Infinity;
        private next: IVertex = null;

        constructor(weight: number, next: IVertex) {
            this
                .setWeight(weight)
                .setNext(next);
        }

        public getWeight(): number {
            return this.weight;
        }

        public setWeight(weight: number): FloydItem {
            this.weight = weight;
            return this;
        }

        public getNext(): IVertex {
            return this.next;
        }

        public setNext(next: IVertex): FloydItem {
            this.next = next;
            return this;
        }
    }

    export class DijsktraGraphData {
        private data: DataStructures.Dictionary<string, DijsktraItem> = new DataStructures.Dictionary<string, DijsktraItem>();

        public getData(): DataStructures.Dictionary<string, DijsktraItem> {
            if (this.data === null || this.data === undefined) {
                this.clear();
            }
            return this.data;
        }

        public clear(): DijsktraGraphData {
            this.data = new DataStructures.Dictionary<string, DijsktraItem>();
            return this;
        }

        public set(identify: string, weight: number, previous: IVertex): DijsktraGraphData{
            this.data.set(identify, new DijsktraItem(weight, previous));
            return this;
        }

        public getItem(identify: string): DijsktraItem {
            if (this.getData().containsKey(identify)) {
                return this.getData().get(identify);
            }
            return null;
        }

        public getWeight(identify: string): number {

            if (this.getData().containsKey(identify)) {
                return this.getData().get(identify).getWeight();
            } 
            return Infinity;
        }

        public getPrevious(identify: string): IVertex {
            if (this.getData().containsKey(identify)) {
                return this.getData().get(identify).getPrevious();
            } 
            return null;
        }
    }

    export class FloydGraphData {
        private data: DataStructures.Dictionary<string, DataStructures.Dictionary<string, FloydItem>> = new DataStructures.Dictionary<string, DataStructures.Dictionary<string, FloydItem>>();

        public getData(): DataStructures.Dictionary<string, DataStructures.Dictionary<string, FloydItem>> {
            if (this.data === null || this.data === undefined) {
                this.clear()
            }
          
            return this.data;
        }

        public clear(): FloydGraphData {
            this.data = new DataStructures.Dictionary<string, DataStructures.Dictionary<string, FloydItem>>();
            return this;
        }

        public getSubData(identify: string): DataStructures.Dictionary<string, FloydItem> {
            if (!this.getData().containsKey(identify)) {
                this.subClear(identify);
            }
            return this.getData().get(identify);
        }

        public subClear(identify: string): FloydGraphData {
            this.getData().set(identify, new DataStructures.Dictionary<string, FloydItem>());
            return this;
        }

        public getItem(identify: string, identify2: string): FloydItem {
            if (this.getSubData(identify).containsKey(identify2)) {
                return this.getSubData(identify).get(identify2);
            }
            return null;
        }

        public set(identify: string, identify2: string, weight: number, next: IVertex): FloydGraphData {
            this.getSubData(identify).set(identify2, new FloydItem(weight, next));
            return this;
        }

        public getWeight(identify: string, identify2: string): number {
            if (this.getSubData(identify).containsKey(identify2)) {
                return this.getSubData(identify).get(identify2).getWeight();
            }
            return Infinity;
        }

        public getNext(identify: string, identify2: string): IVertex {
            if (this.getSubData(identify).containsKey(identify2)) {
                return this.getSubData(identify).get(identify2).getNext();
            }
            return null;
        }
    }

    export class Edge {
        private startVertex: IVertex = null;
        private endVertex: IVertex = null;
        private unidirected: boolean = false;

        constructor(startVertex: IVertex, endVertex: IVertex, unidirected: boolean = false) {
            this
            .setEndVertex(startVertex)
            .setEndVertex(endVertex)
            .setUnidirected(unidirected);
        }

        public getStartVertex() : IVertex {
            return this.startVertex;
        }

        public setStartVertex(vertex: IVertex) : Edge {
            this.startVertex = vertex;
            return this;
        }

        public getEndVertex() : IVertex {
            return this.endVertex;
        }

        public setEndVertex(vertex: IVertex) : Edge {
            this.endVertex= vertex;
            return this;
        }

        public isUnidirected() : boolean {
            return this.unidirected === true;
        }

        public setUnidirected(unidirected: boolean = false) : Edge {
            this.unidirected = unidirected;
            return this;
        }

        public identify(): string {
            return "[" + this.getStartVertex().identify() + ", " + this.getEndVertex().identify() + "]";
        }

        public toString(): string {
            return "Edge: " + this.identify();
        }

        public clone(): Edge {
            return new Edge(this.getStartVertex(), this.getEndVertex(), this.isUnidirected());
        }
    }

    export class Graph {
        private vertices: DataStructures.Dictionary<string, IVertex> = new DataStructures.Dictionary<string, IVertex>();
        private edges: DataStructures.Dictionary<string, Edge> = new DataStructures.Dictionary<string, Edge>();


        public getVerticles(): DataStructures.Dictionary<string, IVertex> {
            if (this.vertices === null || this.vertices === undefined) {
                this.clearVerticles();
            }
            return this.vertices
        }

        public getVerticlesValues(): IVertex[] {
            return this.getVerticles().getValues();
        }

        public clearVerticles(): Graph {
            this.vertices = new DataStructures.Dictionary<string, IVertex>();
            return this;
        }

        public getEdgesValues(): Edge[] {
            return this.getEdges().getValues();
        }

        public getEdges(): DataStructures.Dictionary<string, Edge> {
            if (this.edges === null || this.edges === undefined) {
                this.clearEdges();
            }
            return this.edges;
        }

        public clearEdges(): Graph{
            this.edges = new DataStructures.Dictionary<string, Edge>();
            return this;
        }

        public getVertex(identify: string): IVertex {
            return this.vertices.get(identify);
        }

        public hasVertex(vertex: IVertex): boolean {
            return this.getVerticles().containsKey(vertex.identify());
        }

        public addVertex(vertex: IVertex): Graph {
            this.getVerticles().set(vertex.identify(), vertex);
            return this;
        }

        public getNeighbours(vertex: IVertex): IVertex[] {
            var result: IVertex[] = [];
            var edges: Edge[] = this.getEdgesByVertex(vertex);
            edges.forEach(function (value: Edge, index: number):void {
                var pushVertex: IVertex =  value.getEndVertex()
                if (result.indexOf(pushVertex) === -1 && pushVertex.compare(vertex) !== 0) {
                    result.push(pushVertex);
                }
            });
            return result;
        }

        public getEdgesByVertex(vertex: IVertex, bothWay: boolean = true): Edge[] {
            return this.getEdgesValues().filter(function (value: Edge, index: number): boolean {
                return (value.getStartVertex().compare(vertex) === 0 ||
                    (bothWay && !value.isUnidirected() && value.getEndVertex().compare(vertex) === 0)
                );
            });
        }

        public removeVertex(vertex: IVertex): Graph {
            if (this.hasVertex(vertex)) {
                this.getVerticles().remove(vertex.identify());
                var edges: Edge[] = this.getEdgesByVertex(vertex);
                edges.forEach(function (edge: Edge): void {
                    this.removeEdge(edge);
                }.bind(this));
            }
            return this;
        }

        public getEdge(startVertex: IVertex, endVertex: IVertex, bothWay: boolean = true): Edge {
            var edges: Array<Edge> = this.getEdgesByVertex(startVertex, bothWay);
            var edgesLenght: number = edges.length;
            for (var i: number = 0; i < edgesLenght; i++) {
                var value = edges[i];
                if (value.getEndVertex().compare(endVertex) === 0) {
                    return value;
                }
            }
            return null;
        }

        public hasEdge(startVertex: IVertex, endVertex: IVertex, bothWay: boolean = true): boolean {
            var edge: Edge = this.getEdge(startVertex, endVertex, bothWay);
            return (edge !== undefined);
        }

        public addEdge(edge: Edge): Graph {
            var testEdge: Edge = this.getEdge(edge.getStartVertex(), edge.getEndVertex(), false);
            var testEdge2: Edge = this.getEdge(edge.getEndVertex(), edge.getStartVertex(), false);
            if (edge !== undefined && ((testEdge === undefined) || (testEdge2 === undefined))) {
                this.addVertex(edge.getStartVertex());
                this.addVertex(edge.getEndVertex());
                this.edges.set(edge.identify(), edge);
            }
            return this;
        }

        public removeEdge(startVertext: IVertex, endVertext: IVertex): Graph {
            var edge: Edge = this.getEdge(startVertext, endVertext, false);
            this.getEdges().remove(edge.identify());
            return this;
        }

        /// static methods
        // shoortest path from vertex
        static dijsktra(graph: Graph, vertex: IVertex, weightFunction:(edge: Edge) => number): DijsktraGraphData {
            var result: DijsktraGraphData  = new DijsktraGraphData();
            var verticesQueue: IVertex[] = [];
            // init result
            graph.getVerticlesValues().forEach(function (value: IVertex, index: number): void {
                result
                .set(value.identify(), Infinity, null);
                verticesQueue[index] = value;
            });
            
            result.set(vertex.identify(), 0, null);
            // sort verticesQueue according result.weight
            verticesQueue.sort(function(p1:IVertex, p2:IVertex): number {
                return (result.getWeight(p1.identify()) - result.getWeight(p2.identify()));
            });
            
            while(verticesQueue.length > 0) {
                var u:IVertex = verticesQueue.slice(0, 1)[0]; // get first vertex(with lowest weight)
                if (result.getWeight(u.identify()) === Infinity) {
                    break;
                }
                
                // for each edges from vertex
                graph.getEdgesByVertex(u).forEach(function (value: Edge, index: number): void {
                    // if endvertex was not removed from verticesQueue
                    var index2:number = verticesQueue.indexOf(value.getEndVertex());
                    if (index2 !== -1) {
                        // compare weights
                        var alt:number = result.getWeight(u.identify()) + weightFunction(value);
                        if (alt < result.getWeight(u.identify())) {
                            result.set(value.getEndVertex().identify(), alt, u);
                            // sort reduced verticesQueue according result.weight
                            verticesQueue.sort(function(p1:IVertex, p2:IVertex): number {
                                return (result.getWeight(p1.identify()) - result.getWeight(p2.identify()));
                            });
                        }
                    }
                });
            }
            
            return result;
        }

        // shortest path for all vertices
        static floydWarshall(graph: Graph, weightFunction:(edge: Edge) => number): FloydGraphData {
            var result: FloydGraphData = new FloydGraphData();
            // init result
            var vertices: IVertex[] = graph.getVerticlesValues();
            vertices.forEach(function (value: IVertex, index: number): void {
                vertices.forEach(function (value2: IVertex, index2: number): void {
                    result.set(value.identify(), value2.identify(), Infinity, null);
                });
            });
            // the weight of the edge (u,v)
            graph.getEdgesValues().forEach(function (value: Edge, index: number): void {
                result.set(value.getStartVertex().identify(), value.getEndVertex().identify(), weightFunction(value), null);
                if (!value.isUnidirected()) {
                    result.set(value.getEndVertex().identify(), value.getStartVertex().identify(), weightFunction(value), null);
                }
            });

            // standard Floyd-Warshall implementation
            vertices.forEach(function (value: IVertex, index: number): void {
                vertices.forEach(function (value2: IVertex, index2: number): void {
                    vertices.forEach(function (value3: IVertex, index3: number): void {
                        var alt: number = (result.getWeight(value2.identify(), value.identify())
                            + result.getWeight(value.identify(),value3.identify()));
                        if (alt < result.getWeight(value2.identify(), value3.identify())) {
                            result.set(value2.identify(),value3.identify(),alt, null);
                        }
                    });
                });
            });

            graph.getVerticlesValues().forEach(function (value: IVertex, index: number): void {
                result.set(value.identify(), value.identify(), 0, null);
                result = Graph.floydWarsshallShortestPaths(graph, value, value, weightFunction, result);
            });
            
            return result;
        }
        
        static floydWarsshallShortestPaths(graph: Graph, start: IVertex, end: IVertex, weightFunction: (edge: Edge) => number, data: FloydGraphData): FloydGraphData {
            graph.getEdgesByVertex(start).forEach(function (value: Edge, index: number): void {
                var alt:number = weightFunction(value) + data.getWeight(start.identify(), end.identify());
                if ((data.getWeight(value.getEndVertex().identify(), end.identify()) === alt &&
                    data.getNext(start.identify(), value.getEndVertex().identify()) === null
                )) {
                    data.set(value.getEndVertex().identify(), end.identify(), alt,  start);
                    data = this.floydWarsshallShortestPaths(value.getEndVertex(), end, weightFunction, data);
                }
            });
            
            return data;
        }
        
        static floydWarsshallShortestPath(start: IVertex, end: IVertex, data: FloydGraphData)
            : IVertex[] {
            var result:IVertex[] = [];
            if (data.getNext(start.identify(),end.identify()) === null) {
                return result;
            }
            result[0] = start;
            while(start !== end) {
                start = data.getNext(start.identify(),end.identify());
                result.push(start);
            }
            
            return result;
        }

        // minimum spanning tree
        static kruskal(graph: Graph, weightFunction:(edge: Edge) => number): Graph {
            var edges: Edge[] = [];
            graph.getEdgesValues().forEach(function (value: Edge, index: number): void {
                edges[index] = value;
            });
            edges.sort(function(e1: Edge, e2: Edge):number {
                return (weightFunction(e1) - weightFunction(e2));
            });
            var result: Graph = new Graph();
            edges.forEach(function (value: Edge, index: number): void {
                if (!(result.hasVertex(value.getStartVertex()) && result.hasVertex(value.getEndVertex()))) {
                    var edge: Edge = value.clone();
                    result.addEdge(edge);
                }
            });
            
            return result;
        }
    }
}