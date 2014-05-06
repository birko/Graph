module Graph {
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
    }

    export class Graph {
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
        dijsktra(point: Point): { dist: Array<number>; previous: Array<Point> } {
            var result = { dist: new Array(), previous: new Array() };
            var infinity = 18437736874454810627;
            this.points.forEach(function (value: Point, index: number) {
                result.dist[value.toString()] = infinity;
                result.previous[value.toString()] = undefined;
            });
            result[point.toString()] = 0;
            return result;
        }

        //shortest path for all points
        flojdWarsshall() {
        }

        //minimum spanning tree
        kruskal() {
        }
    }
}