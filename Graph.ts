﻿module Graph {
    export class Point {
        public x: number = 0;
        public y: number = 0;
        public z: number = 0;
        public edges: Array<Edge> = new Array();

        constructor(x:number = 0, y:number = 0, z:number = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        toString():string {
            return "[" + this.x + "," + this.y + "," + this.z + "]";
        }

        addEdge(point: Point, unidirected: boolean = false): Edge {
            if (!this.hasEdge(point)) {
                this.edges[point.toString()] = new Edge(this, point, unidirected);
                if (!unidirected) {
                    point.addEdge(this, unidirected);
                }
            }
            return this.getEdge(point);
        }

        getEdge(point: Point): Edge {
            if (this.hasEdge(point)) {
                this.edges[point.toString()]
            }
            return undefined;
        }

        hasEdge(point: Point): boolean {
            return (this.edges[point.toString()] != undefined);
        }

        removeEdge(point: Point, unidirected: boolean = false):Edge {
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
        }

        copy(value: Point) : Point {
            this.x = value.x;
            this.y = value.y;
            this.z = value.z;

            return this;
        }
    }

    export class Edge {
        public startPoint: Point = new Point();
        public endPoint: Point = new Point();
        public unidirected: boolean = false;

        constructor(startPoint, endPoint: Point, unidirected: boolean = false) {
            this.startPoint = startPoint;
            this.endPoint = endPoint;
            this.unidirected = unidirected;
        }

        toString():string {
            return "[" + this.startPoint.toString() + this.endPoint.toString() + "]";
        }

        copy(value: Edge): Edge {
            this.startPoint.copy(value.startPoint);
            this.endPoint.copy(value.endPoint);
            this.unidirected = value.unidirected;

            return this;
        }
    }

    export class Graph {
        public static infinity = 18437736874454810627;
        public points: Array<Point> = new Array();
        public edges: Array<Edge> = new Array();

        hasPoint(point: Point): boolean {
            return (this.points[point.toString()] != undefined);
        }

        addPoint(point: Point) {
            if (!this.hasPoint(point)) {
                this.points[point.toString()] = point;
            }
        }

        removePoint(point: Point) {
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
        }

        hasEdge(startPoint, endPoint: Point): boolean {
            if (this.hasPoint(startPoint)) {
                return startPoint.hasEdge(endPoint);
            }
            return false;
        }

        inEdges(edge:Edge): boolean {
            return (this.edges[edge.toString()] !== undefined);
        }

        addEdge(startPoint, endPoint: Point, unidirected: boolean = false) {
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
        }

        removeEdge(startPoint, endPoint: Point, unidirected: boolean = false) {
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
        }

        //shoortest path from point
        dijsktra(point: Point, weightFunction:(edge: Edge) => number): { weight: Array<number>; previous: Array<Point> } {
            var result = { weight: new Array(), previous: new Array() };
            var pointQueue = new Array();
            //init result
            this.points.forEach(function (value: Point, index: number) {
                result.weight[value.toString()] = Graph.infinity;
                result.previous[value.toString()] = undefined;
                pointQueue[index] = value;
            });
            
            result.weight[point.toString()] = 0;
            //sort pointQueue according result.weight
            pointQueue.sort(function(p1, p2) {
                return (result.weight[p1.toString()] - result.weight[p2.toString()]);
            });
            
            while(pointQueue.length > 0) {
                var u = pointQueue.slice(0, 1)[0]; //get first point(with lowest weight)
                if (result.weight[u.toString()] == Graph.infinity) {
                    break;
                }
                
                //for each edges from point
                u.edges.forEach(function (value: Edge, index: number) {
                    //if endpoint was not removed from pointQueue
                    var index = pointQueue.indexOf(value.endPoint);
                    if (index !== -1) {
                        //compare weights
                        var alt = result.weight[u.toString()] + weightFunction(value);
                        if (alt < result.weight[u.toString()]) {
                            result.weight[value.endPoint.toString()] = alt;
                            result.previous[value.endPoint.toString()] = u;
                            //sort reduced pointQueue according result.weight
                            pointQueue.sort(function(p1, p2) {
                                return (result.weight[p1.toString()] - result.weight[p2.toString()]);
                            });
                        }
                    }
                });
            }
            
            return result;
        }

        //shortest path for all points
        floydWarsshall(weightFunction:(edge: Edge) => number): { weight: Array<Array<number>>; next: Array<Array<Point>> } {
            var result = { weight: new Array(), next: new Array() };
            //init result
            this.points.forEach(function (value: Point, index: number) {
                this.points.forEach(function (value2: Point, index2: number) {
                    result.weight[value.toString()][value2.toString()] = Graph.infinity;
                    result.next[value.toString()][value2.toString()] = undefined;
                });
            });
            // the weight of the edge (u,v)
            this.edges.forEach(function (value: Edge, index: number) {
                result.weight[value.startPoint.toString()][value.endPoint.toString()] = weightFunction(value);
            });
            
            // standard Floyd-Warshall implementation
            this.points.forEach(function (value: Point, index: number) {
                this.points.forEach(function (value2: Point, index2: number) {
                    this.points.forEach(function (value3: Point, index3: number) {
                        var alt = (result.weight[value2.toString()][value.toString()] + result.weight[value.toString()][value3.toString()]);
                        if (alt < result.weight[value2.toString()][value3.toString()]) {
                            result.weight[value2.toString()][value3.toString()] = alt;
                        }
                    });
                });
            });
            
            this.points.forEach(function (value: Point, index: number) {
                result.next[value.toString()][value.toString()] = 0;
                result = this.floydWarsshallShortestPaths(value, value, weightFunction, result);
            });
            
            return result;
        }
        
        floydWarsshallShortestPaths(start: Point, end: Point, weightFunction:(edge: Edge) => number, data: { weight: Array<Array<number>>; next: Array<Array<Point>> }): { weight: Array<Array<number>>; next: Array<Array<Point>> } {
            start.edges.forEach(function(value: Edge, index: number){
                var alt = weightFunction(value) + data.weight[start.toString()][end.toString()];
                if (( data.weight[value.endPoint.toString()][end.toString()] == alt && 
                     data.next[start.toString()][value.endPoint.toString()] == undefined
                )) {
                    data.next[value.endPoint.toString()][end.toString()] = start;
                    data = this.floydWarsshallShortestPaths(value.endPoint, end, weightFunction, data);
                }
            });
            
            return data;
        }
        
        floydWarsshallShortestPath(start: Point, end: Point, data: { weight: Array<Array<number>>; next: Array<Array<Point>> }): Array<Point> {
            var result = new Array();
            if (data.next[start.toString()][end.toString()] == undefined) {
                return result;
            }
            result[0] = start;
            while(start != end){
                start = data.next[start.toString()][end.toString()];
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
        }
    }
}