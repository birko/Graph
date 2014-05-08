module Graph {
    export class Point {
        public edges: Array<Edge> = new Array();

        constructor() {}

        identify(): string {
            throw new Error('This method is abstract');
        }

        toString() {
            return "Point: " + this.identify();
        }

        addEdge(point: Point, unidirected: boolean = false): Edge {
            if (!this.hasEdge(point)) {
                this.edges[point.identify()] = new Edge(this, point, unidirected);
                if (!unidirected) {
                    point.addEdge(this, unidirected);
                }
            }
            return this.getEdge(point);
        }

        getEdge(point: Point): Edge {
            if (this.hasEdge(point)) {
                this.edges[point.identify()]
            }
            return undefined;
        }

        hasEdge(point: Point): boolean {
            return (this.edges[point.identify()] != undefined);
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

        identify(): string {
            return "[" + this.startPoint.identify() + ', '+ this.endPoint.identify() + "]";
        }

        toString() {
            return "Edge: " + this.identify();
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
            return (this.points[point.identify()] != undefined);
        }

        addPoint(point: Point) {
            if (!this.hasPoint(point)) {
                this.points[point.identify()] = point;
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
            return (this.edges[edge.identify()] !== undefined);
        }

        addEdge(startPoint, endPoint: Point, unidirected: boolean = false) {
            this.addPoint(startPoint);
            this.addPoint(endPoint);
            var edge = startPoint.addEdge(endPoint, unidirected);
            if (edge !== undefined && !this.inEdges(edge)) {
                this.edges[edge.identify()] = edge;
                if (!unidirected) {
                    edge = endPoint.getEdge(startPoint);
                    if (edge !== undefined && !this.inEdges(edge)) {
                        this.edges[edge.identify()] = edge;
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
                result.weight[value.identify()] = Graph.infinity;
                result.previous[value.identify()] = undefined;
                pointQueue[index] = value;
            });
            
            result.weight[point.identify()] = 0;
            //sort pointQueue according result.weight
            pointQueue.sort(function(p1, p2) {
                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
            });
            
            while(pointQueue.length > 0) {
                var u = pointQueue.slice(0, 1)[0]; //get first point(with lowest weight)
                if (result.weight[u.identify()] == Graph.infinity) {
                    break;
                }
                
                //for each edges from point
                u.edges.forEach(function (value: Edge, index: number) {
                    //if endpoint was not removed from pointQueue
                    var index = pointQueue.indexOf(value.endPoint);
                    if (index !== -1) {
                        //compare weights
                        var alt = result.weight[u.identify()] + weightFunction(value);
                        if (alt < result.weight[u.identify()]) {
                            result.weight[value.endPoint.identify()] = alt;
                            result.previous[value.endPoint.identify()] = u;
                            //sort reduced pointQueue according result.weight
                            pointQueue.sort(function(p1, p2) {
                                return (result.weight[p1.identify()] - result.weight[p2.identify()]);
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
                    result.weight[value.identify()][value2.identify()] = Graph.infinity;
                    result.next[value.identify()][value2.identify()] = undefined;
                });
            });
            // the weight of the edge (u,v)
            this.edges.forEach(function (value: Edge, index: number) {
                result.weight[value.startPoint.identify()][value.endPoint.identify()] = weightFunction(value);
            });
            
            // standard Floyd-Warshall implementation
            this.points.forEach(function (value: Point, index: number) {
                this.points.forEach(function (value2: Point, index2: number) {
                    this.points.forEach(function (value3: Point, index3: number) {
                        var alt = (result.weight[value2.identify()][value.identify()] + result.weight[value.identify()][value3.identify()]);
                        if (alt < result.weight[value2.identify()][value3.identify()]) {
                            result.weight[value2.identify()][value3.identify()] = alt;
                        }
                    });
                });
            });
            
            this.points.forEach(function (value: Point, index: number) {
                result.next[value.identify()][value.identify()] = 0;
                result = this.floydWarsshallShortestPaths(value, value, weightFunction, result);
            });
            
            return result;
        }
        
        floydWarsshallShortestPaths(start: Point, end: Point, weightFunction:(edge: Edge) => number, data: { weight: Array<Array<number>>; next: Array<Array<Point>> }): { weight: Array<Array<number>>; next: Array<Array<Point>> } {
            start.edges.forEach(function(value: Edge, index: number){
                var alt = weightFunction(value) + data.weight[start.identify()][end.identify()];
                if ((data.weight[value.endPoint.identify()][end.identify()] == alt && 
                    data.next[start.identify()][value.endPoint.identify()] == undefined
                )) {
                    data.next[value.endPoint.identify()][end.identify()] = start;
                    data = this.floydWarsshallShortestPaths(value.endPoint, end, weightFunction, data);
                }
            });
            
            return data;
        }
        
        floydWarsshallShortestPath(start: Point, end: Point, data: { weight: Array<Array<number>>; next: Array<Array<Point>> }): Array<Point> {
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
                if (!(result.hasPoint(value.startPoint) && result.hasPoint(value.endPoint))) {
                    var start = undefined;
                    var end = undefined;

                    if (result.hasPoint(value.startPoint)) {
                        start = result.points[value.startPoint.identify()];
                    } else {
                        start = new Point();
                        start.copy(value.startPoint);
                    }
                    if (result.hasPoint(value.endPoint)) {
                        end = result.points[value.endPoint.identify()];
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