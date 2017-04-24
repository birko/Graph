"use strict";
var DataStructures;
(function (DataStructures) {
    "use strict";
    var KeyValuePair = (function () {
        function KeyValuePair(key, value) {
            this.key = null;
            this.value = null;
            this
                .setKey(key)
                .setValue(value);
        }
        KeyValuePair.prototype.getKey = function () {
            return this.key;
        };
        KeyValuePair.prototype.setKey = function (key) {
            this.key = key;
            return this;
        };
        KeyValuePair.prototype.getValue = function () {
            return this.value;
        };
        KeyValuePair.prototype.setValue = function (value) {
            this.value = value;
            return this;
        };
        return KeyValuePair;
    }());
    DataStructures.KeyValuePair = KeyValuePair;
    var List = (function () {
        function List() {
            this.values = [];
        }
        List.prototype.getValues = function () {
            if (this.values === undefined || this.values === null) {
                this.clear();
            }
            return this.values;
        };
        List.prototype.setValues = function (values) {
            this.values = values;
            return this;
        };
        List.prototype.clear = function () {
            return this.setValues([]);
        };
        List.prototype.getLength = function () {
            return this.getValues().length;
        };
        List.prototype.hasValues = function () {
            return this.getLength() > 0;
        };
        List.prototype.indexOf = function (value) {
            return this.getValues().indexOf(value);
        };
        List.prototype.add = function (index, value) {
            if (index <= 0) {
                return this.addFirst(value);
            }
            else if (index > this.getLength()) {
                return this.addLast(value);
            }
            else {
                this.values.splice(index, 0, value);
                return this;
            }
        };
        List.prototype.addLast = function (value) {
            return this.push(value);
        };
        List.prototype.addFirst = function (value) {
            return this.unshift(value);
        };
        List.prototype.unshift = function (value) {
            this.getValues();
            this.values.unshift(value);
            return this;
        };
        List.prototype.push = function (value) {
            this.getValues();
            this.values.push(value);
            return this;
        };
        List.prototype.addRange = function (values) {
            var _this = this;
            if (values !== null && values !== undefined) {
                values.forEach(function (value) {
                    _this.addLast(value);
                });
            }
            return this;
        };
        List.prototype.get = function (index) {
            if (index >= 0 && index < this.getLength()) {
                return this.values[index];
            }
            return null;
        };
        List.prototype.set = function (index, value) {
            if (index >= 0 && index < this.getLength()) {
                this.values[index] = value;
            }
            return this;
        };
        List.prototype.remove = function (index) {
            if (this.hasValues() && index >= 0 && index < this.getLength()) {
                this.values.splice(index, 1);
            }
            return this;
        };
        List.prototype.removeFirst = function () {
            return this.shift();
        };
        List.prototype.removeLast = function () {
            return this.pop();
        };
        List.prototype.shift = function () {
            if (this.hasValues()) {
                this.values.shift();
            }
            return this;
        };
        List.prototype.pop = function () {
            if (this.hasValues()) {
                this.values.pop();
            }
            return this;
        };
        return List;
    }());
    DataStructures.List = List;
    var Dictionary = (function () {
        function Dictionary() {
            this.values = new List();
            this.keys = new List();
        }
        Dictionary.prototype.getKeysList = function () {
            if (this.keys === undefined || this.keys === null) {
                this.clear();
            }
            return this.keys;
        };
        Dictionary.prototype.getKeys = function () {
            return this.getKeysList().getValues();
        };
        Dictionary.prototype.getValuesList = function () {
            if (this.values === undefined || this.values === null) {
                this.clear();
            }
            return this.values;
        };
        Dictionary.prototype.getValues = function () {
            return this.getValuesList().getValues();
        };
        Dictionary.prototype.getItems = function () {
            var _this = this;
            return this.getKeys().map(function (value, index) {
                return new KeyValuePair(value, _this.get(value));
            });
        };
        Dictionary.prototype.clear = function () {
            this.values = new List();
            this.keys = new List();
            return this;
        };
        Dictionary.prototype.getLength = function () {
            return this.getKeysList().getLength();
        };
        Dictionary.prototype.containsKey = function (key) {
            return this.getKeys().indexOf(key) >= 0;
        };
        Dictionary.prototype.set = function (key, value) {
            if (!this.containsKey(key)) {
                this.getKeysList().addLast(key);
                this.getValuesList().addLast(value);
            }
            else {
                var index = this.getKeysList().indexOf(key);
                this.getValuesList().set(index, value);
            }
            return this;
        };
        Dictionary.prototype.get = function (key) {
            if (this.containsKey(key)) {
                var index = this.getKeysList().indexOf(key);
                return this.getValuesList().get(index);
            }
            return null;
        };
        Dictionary.prototype.remove = function (key) {
            if (this.containsKey(key)) {
                var index = this.getKeysList().indexOf(key);
                var value = this.getValuesList().get(index);
                this.getKeysList().remove(index);
                this.getValuesList().remove(index);
                return value;
            }
            return null;
        };
        return Dictionary;
    }());
    DataStructures.Dictionary = Dictionary;
    var AbstractFactory = (function () {
        function AbstractFactory() {
            this.data = new DataStructures.Dictionary();
        }
        AbstractFactory.prototype.getData = function () {
            if (this.data === null || this.data === undefined) {
                this.clear();
            }
            return this.data;
        };
        AbstractFactory.prototype.hasData = function () {
            return this.getData().getLength() > 0;
        };
        AbstractFactory.prototype.getItems = function () {
            return this.getData().getValues();
        };
        AbstractFactory.prototype.clear = function () {
            this.data = new DataStructures.Dictionary();
            return this;
        };
        AbstractFactory.prototype.set = function (name, agent) {
            this.getData().set(name, agent);
            return this;
        };
        AbstractFactory.prototype.has = function (name) {
            return (this.getData().containsKey(name));
        };
        AbstractFactory.prototype.get = function (name) {
            return this.getData().get(name);
        };
        AbstractFactory.prototype.remove = function (name) {
            return this.getData().remove(name);
        };
        return AbstractFactory;
    }());
    DataStructures.AbstractFactory = AbstractFactory;
})(DataStructures || (DataStructures = {}));
"use strict";
var Graph;
(function (Graph_1) {
    "use strict";
    var DijsktraItem = (function () {
        function DijsktraItem(weight, previous) {
            this.weight = Infinity;
            this.previous = null;
            this
                .setWeight(weight)
                .setPrevious(previous);
        }
        DijsktraItem.prototype.getWeight = function () {
            return this.weight;
        };
        DijsktraItem.prototype.setWeight = function (weight) {
            this.weight = weight;
            return this;
        };
        DijsktraItem.prototype.getPrevious = function () {
            return this.previous;
        };
        DijsktraItem.prototype.setPrevious = function (previous) {
            this.previous = previous;
            return this;
        };
        return DijsktraItem;
    }());
    Graph_1.DijsktraItem = DijsktraItem;
    var FloydItem = (function () {
        function FloydItem(weight, next) {
            this.weight = Infinity;
            this.next = null;
            this
                .setWeight(weight)
                .setNext(next);
        }
        FloydItem.prototype.getWeight = function () {
            return this.weight;
        };
        FloydItem.prototype.setWeight = function (weight) {
            this.weight = weight;
            return this;
        };
        FloydItem.prototype.getNext = function () {
            return this.next;
        };
        FloydItem.prototype.setNext = function (next) {
            this.next = next;
            return this;
        };
        return FloydItem;
    }());
    Graph_1.FloydItem = FloydItem;
    var DijsktraGraphData = (function () {
        function DijsktraGraphData() {
            this.data = new DataStructures.Dictionary();
        }
        DijsktraGraphData.prototype.getData = function () {
            if (this.data === null || this.data === undefined) {
                this.clear();
            }
            return this.data;
        };
        DijsktraGraphData.prototype.clear = function () {
            this.data = new DataStructures.Dictionary();
            return this;
        };
        DijsktraGraphData.prototype.set = function (identify, weight, previous) {
            this.data.set(identify, new DijsktraItem(weight, previous));
            return this;
        };
        DijsktraGraphData.prototype.getItem = function (identify) {
            if (this.getData().containsKey(identify)) {
                return this.getData().get(identify);
            }
            return null;
        };
        DijsktraGraphData.prototype.getWeight = function (identify) {
            if (this.getData().containsKey(identify)) {
                return this.getData().get(identify).getWeight();
            }
            return Infinity;
        };
        DijsktraGraphData.prototype.getPrevious = function (identify) {
            if (this.getData().containsKey(identify)) {
                return this.getData().get(identify).getPrevious();
            }
            return null;
        };
        return DijsktraGraphData;
    }());
    Graph_1.DijsktraGraphData = DijsktraGraphData;
    var FloydGraphData = (function () {
        function FloydGraphData() {
            this.data = new DataStructures.Dictionary();
        }
        FloydGraphData.prototype.getData = function () {
            if (this.data === null || this.data === undefined) {
                this.clear();
            }
            return this.data;
        };
        FloydGraphData.prototype.clear = function () {
            this.data = new DataStructures.Dictionary();
            return this;
        };
        FloydGraphData.prototype.getSubData = function (identify) {
            if (!this.getData().containsKey(identify)) {
                this.subClear(identify);
            }
            return this.getData().get(identify);
        };
        FloydGraphData.prototype.subClear = function (identify) {
            this.getData().set(identify, new DataStructures.Dictionary());
            return this;
        };
        FloydGraphData.prototype.getItem = function (identify, identify2) {
            if (this.getSubData(identify).containsKey(identify2)) {
                return this.getSubData(identify).get(identify2);
            }
            return null;
        };
        FloydGraphData.prototype.set = function (identify, identify2, weight, next) {
            this.getSubData(identify).set(identify2, new FloydItem(weight, next));
            return this;
        };
        FloydGraphData.prototype.getWeight = function (identify, identify2) {
            if (this.getSubData(identify).containsKey(identify2)) {
                return this.getSubData(identify).get(identify2).getWeight();
            }
            return Infinity;
        };
        FloydGraphData.prototype.getNext = function (identify, identify2) {
            if (this.getSubData(identify).containsKey(identify2)) {
                return this.getSubData(identify).get(identify2).getNext();
            }
            return null;
        };
        return FloydGraphData;
    }());
    Graph_1.FloydGraphData = FloydGraphData;
    var Edge = (function () {
        function Edge(startVertex, endVertex, unidirected) {
            if (unidirected === void 0) { unidirected = false; }
            this.startVertex = null;
            this.endVertex = null;
            this.unidirected = false;
            this
                .setEndVertex(startVertex)
                .setEndVertex(endVertex)
                .setUnidirected(unidirected);
        }
        Edge.prototype.getStartVertex = function () {
            return this.startVertex;
        };
        Edge.prototype.setStartVertex = function (vertex) {
            this.startVertex = vertex;
            return this;
        };
        Edge.prototype.getEndVertex = function () {
            return this.endVertex;
        };
        Edge.prototype.setEndVertex = function (vertex) {
            this.endVertex = vertex;
            return this;
        };
        Edge.prototype.isUnidirected = function () {
            return this.unidirected === true;
        };
        Edge.prototype.setUnidirected = function (unidirected) {
            if (unidirected === void 0) { unidirected = false; }
            this.unidirected = unidirected;
            return this;
        };
        Edge.prototype.identify = function () {
            return "[" + this.getStartVertex().identify() + ", " + this.getEndVertex().identify() + "]";
        };
        Edge.prototype.toString = function () {
            return "Edge: " + this.identify();
        };
        Edge.prototype.clone = function () {
            return new Edge(this.getStartVertex(), this.getEndVertex(), this.isUnidirected());
        };
        return Edge;
    }());
    Graph_1.Edge = Edge;
    var Graph = (function () {
        function Graph() {
            this.vertices = new DataStructures.Dictionary();
            this.edges = new DataStructures.Dictionary();
        }
        Graph.prototype.getVerticles = function () {
            if (this.vertices === null || this.vertices === undefined) {
                this.clearVerticles();
            }
            return this.vertices;
        };
        Graph.prototype.getVerticlesValues = function () {
            return this.getVerticles().getValues();
        };
        Graph.prototype.clearVerticles = function () {
            this.vertices = new DataStructures.Dictionary();
            return this;
        };
        Graph.prototype.getEdgesValues = function () {
            return this.getEdges().getValues();
        };
        Graph.prototype.getEdges = function () {
            if (this.edges === null || this.edges === undefined) {
                this.clearEdges();
            }
            return this.edges;
        };
        Graph.prototype.clearEdges = function () {
            this.edges = new DataStructures.Dictionary();
            return this;
        };
        Graph.prototype.getVertex = function (identify) {
            return this.vertices.get(identify);
        };
        Graph.prototype.hasVertex = function (vertex) {
            return this.getVerticles().containsKey(vertex.identify());
        };
        Graph.prototype.addVertex = function (vertex) {
            this.getVerticles().set(vertex.identify(), vertex);
            return this;
        };
        Graph.prototype.getNeighbours = function (vertex) {
            var result = [];
            var edges = this.getEdgesByVertex(vertex);
            edges.forEach(function (value, index) {
                var pushVertex = value.getEndVertex();
                if (result.indexOf(pushVertex) === -1 && pushVertex.compare(vertex) !== 0) {
                    result.push(pushVertex);
                }
            });
            return result;
        };
        Graph.prototype.getEdgesByVertex = function (vertex, bothWay) {
            if (bothWay === void 0) { bothWay = true; }
            return this.getEdgesValues().filter(function (value, index) {
                return (value.getStartVertex().compare(vertex) === 0 ||
                    (bothWay && !value.isUnidirected() && value.getEndVertex().compare(vertex) === 0));
            });
        };
        Graph.prototype.removeVertex = function (vertex) {
            if (this.hasVertex(vertex)) {
                this.getVerticles().remove(vertex.identify());
                var edges = this.getEdgesByVertex(vertex);
                edges.forEach(function (edge) {
                    this.removeEdge(edge);
                }.bind(this));
            }
            return this;
        };
        Graph.prototype.getEdge = function (startVertex, endVertex, bothWay) {
            if (bothWay === void 0) { bothWay = true; }
            var edges = this.getEdgesByVertex(startVertex, bothWay);
            var edgesLenght = edges.length;
            for (var i = 0; i < edgesLenght; i++) {
                var value = edges[i];
                if (value.getEndVertex().compare(endVertex) === 0) {
                    return value;
                }
            }
            return null;
        };
        Graph.prototype.hasEdge = function (startVertex, endVertex, bothWay) {
            if (bothWay === void 0) { bothWay = true; }
            var edge = this.getEdge(startVertex, endVertex, bothWay);
            return (edge !== undefined);
        };
        Graph.prototype.addEdge = function (edge) {
            var testEdge = this.getEdge(edge.getStartVertex(), edge.getEndVertex(), false);
            var testEdge2 = this.getEdge(edge.getEndVertex(), edge.getStartVertex(), false);
            if (edge !== undefined && ((testEdge === undefined) || (testEdge2 === undefined))) {
                this.addVertex(edge.getStartVertex());
                this.addVertex(edge.getEndVertex());
                this.edges.set(edge.identify(), edge);
            }
            return this;
        };
        Graph.prototype.removeEdge = function (startVertext, endVertext) {
            var edge = this.getEdge(startVertext, endVertext, false);
            this.getEdges().remove(edge.identify());
            return this;
        };
        Graph.dijsktra = function (graph, vertex, weightFunction) {
            var result = new DijsktraGraphData();
            var verticesQueue = [];
            graph.getVerticlesValues().forEach(function (value, index) {
                result
                    .set(value.identify(), Infinity, null);
                verticesQueue[index] = value;
            });
            result.set(vertex.identify(), 0, null);
            verticesQueue.sort(function (p1, p2) {
                return (result.getWeight(p1.identify()) - result.getWeight(p2.identify()));
            });
            while (verticesQueue.length > 0) {
                var u = verticesQueue.slice(0, 1)[0];
                if (result.getWeight(u.identify()) === Infinity) {
                    break;
                }
                graph.getEdgesByVertex(u).forEach(function (value, index) {
                    var index2 = verticesQueue.indexOf(value.getEndVertex());
                    if (index2 !== -1) {
                        var alt = result.getWeight(u.identify()) + weightFunction(value);
                        if (alt < result.getWeight(u.identify())) {
                            result.set(value.getEndVertex().identify(), alt, u);
                            verticesQueue.sort(function (p1, p2) {
                                return (result.getWeight(p1.identify()) - result.getWeight(p2.identify()));
                            });
                        }
                    }
                });
            }
            return result;
        };
        Graph.floydWarshall = function (graph, weightFunction) {
            var result = new FloydGraphData();
            var vertices = graph.getVerticlesValues();
            vertices.forEach(function (value, index) {
                vertices.forEach(function (value2, index2) {
                    result.set(value.identify(), value2.identify(), Infinity, null);
                });
            });
            graph.getEdgesValues().forEach(function (value, index) {
                result.set(value.getStartVertex().identify(), value.getEndVertex().identify(), weightFunction(value), null);
                if (!value.isUnidirected()) {
                    result.set(value.getEndVertex().identify(), value.getStartVertex().identify(), weightFunction(value), null);
                }
            });
            vertices.forEach(function (value, index) {
                vertices.forEach(function (value2, index2) {
                    vertices.forEach(function (value3, index3) {
                        var alt = (result.getWeight(value2.identify(), value.identify())
                            + result.getWeight(value.identify(), value3.identify()));
                        if (alt < result.getWeight(value2.identify(), value3.identify())) {
                            result.set(value2.identify(), value3.identify(), alt, null);
                        }
                    });
                });
            });
            graph.getVerticlesValues().forEach(function (value, index) {
                result.set(value.identify(), value.identify(), 0, null);
                result = Graph.floydWarsshallShortestPaths(graph, value, value, weightFunction, result);
            });
            return result;
        };
        Graph.floydWarsshallShortestPaths = function (graph, start, end, weightFunction, data) {
            graph.getEdgesByVertex(start).forEach(function (value, index) {
                var alt = weightFunction(value) + data.getWeight(start.identify(), end.identify());
                if ((data.getWeight(value.getEndVertex().identify(), end.identify()) === alt &&
                    data.getNext(start.identify(), value.getEndVertex().identify()) === null)) {
                    data.set(value.getEndVertex().identify(), end.identify(), alt, start);
                    data = this.floydWarsshallShortestPaths(value.getEndVertex(), end, weightFunction, data);
                }
            });
            return data;
        };
        Graph.floydWarsshallShortestPath = function (start, end, data) {
            var result = [];
            if (data.getNext(start.identify(), end.identify()) === null) {
                return result;
            }
            result[0] = start;
            while (start !== end) {
                start = data.getNext(start.identify(), end.identify());
                result.push(start);
            }
            return result;
        };
        Graph.kruskal = function (graph, weightFunction) {
            var edges = [];
            graph.getEdgesValues().forEach(function (value, index) {
                edges[index] = value;
            });
            edges.sort(function (e1, e2) {
                return (weightFunction(e1) - weightFunction(e2));
            });
            var result = new Graph();
            edges.forEach(function (value, index) {
                if (!(result.hasVertex(value.getStartVertex()) && result.hasVertex(value.getEndVertex()))) {
                    var edge = value.clone();
                    result.addEdge(edge);
                }
            });
            return result;
        };
        return Graph;
    }());
    Graph_1.Graph = Graph;
})(Graph || (Graph = {}));
//# sourceMappingURL=graph.js.map