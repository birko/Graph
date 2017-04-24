declare module DataStructures {
    interface IComparable {
        compare(item: IComparable): number;
    }
    interface IAssocArray<TValue> {
        [index: string]: TValue;
    }
    class KeyValuePair<TKey, TValue> {
        private key;
        private value;
        constructor(key: TKey, value: TValue);
        getKey(): TKey;
        setKey(key: TKey): KeyValuePair<TKey, TValue>;
        getValue(): TValue;
        setValue(value: TValue): KeyValuePair<TKey, TValue>;
    }
    class List<TValue> {
        private values;
        getValues(): TValue[];
        setValues(values: TValue[]): List<TValue>;
        clear(): List<TValue>;
        getLength(): number;
        hasValues(): boolean;
        indexOf(value: TValue): number;
        add(index: number, value: TValue): List<TValue>;
        addLast(value: TValue): List<TValue>;
        addFirst(value: TValue): List<TValue>;
        unshift(value: TValue): List<TValue>;
        push(value: TValue): List<TValue>;
        addRange(values: TValue[]): List<TValue>;
        get(index: number): TValue;
        set(index: number, value: TValue): List<TValue>;
        remove(index: number): List<TValue>;
        removeFirst(): List<TValue>;
        removeLast(): List<TValue>;
        shift(): List<TValue>;
        pop(): List<TValue>;
    }
    class Dictionary<TKey, TValue> {
        private values;
        private keys;
        getKeysList(): List<TKey>;
        getKeys(): TKey[];
        getValuesList(): List<TValue>;
        getValues(): TValue[];
        getItems(): KeyValuePair<TKey, TValue>[];
        clear(): Dictionary<TKey, TValue>;
        getLength(): number;
        containsKey(key: TKey): boolean;
        set(key: TKey, value: TValue): Dictionary<TKey, TValue>;
        get(key: TKey): TValue;
        remove(key: TKey): TValue;
    }
    class AbstractFactory<TValue> {
        private data;
        getData(): DataStructures.Dictionary<string, TValue>;
        hasData(): boolean;
        getItems(): TValue[];
        clear(): AbstractFactory<TValue>;
        set(name: string, agent: TValue): AbstractFactory<TValue>;
        has(name: string): boolean;
        get(name: string): TValue;
        remove(name: string): TValue;
    }
}
declare module Graph {
    interface IVertex {
        compare(value: IVertex): number;
        identify(): string;
    }
    class DijsktraItem {
        private weight;
        private previous;
        constructor(weight: number, previous: IVertex);
        getWeight(): number;
        setWeight(weight: number): DijsktraItem;
        getPrevious(): IVertex;
        setPrevious(previous: IVertex): DijsktraItem;
    }
    class FloydItem {
        private weight;
        private next;
        constructor(weight: number, next: IVertex);
        getWeight(): number;
        setWeight(weight: number): FloydItem;
        getNext(): IVertex;
        setNext(next: IVertex): FloydItem;
    }
    class DijsktraGraphData {
        private data;
        getData(): DataStructures.Dictionary<string, DijsktraItem>;
        clear(): DijsktraGraphData;
        set(identify: string, weight: number, previous: IVertex): DijsktraGraphData;
        getItem(identify: string): DijsktraItem;
        getWeight(identify: string): number;
        getPrevious(identify: string): IVertex;
    }
    class FloydGraphData {
        private data;
        getData(): DataStructures.Dictionary<string, DataStructures.Dictionary<string, FloydItem>>;
        clear(): FloydGraphData;
        getSubData(identify: string): DataStructures.Dictionary<string, FloydItem>;
        subClear(identify: string): FloydGraphData;
        getItem(identify: string, identify2: string): FloydItem;
        set(identify: string, identify2: string, weight: number, next: IVertex): FloydGraphData;
        getWeight(identify: string, identify2: string): number;
        getNext(identify: string, identify2: string): IVertex;
    }
    class Edge {
        private startVertex;
        private endVertex;
        private unidirected;
        constructor(startVertex: IVertex, endVertex: IVertex, unidirected?: boolean);
        getStartVertex(): IVertex;
        setStartVertex(vertex: IVertex): Edge;
        getEndVertex(): IVertex;
        setEndVertex(vertex: IVertex): Edge;
        isUnidirected(): boolean;
        setUnidirected(unidirected?: boolean): Edge;
        identify(): string;
        toString(): string;
        clone(): Edge;
    }
    class Graph {
        private vertices;
        private edges;
        getVerticles(): DataStructures.Dictionary<string, IVertex>;
        getVerticlesValues(): IVertex[];
        clearVerticles(): Graph;
        getEdgesValues(): Edge[];
        getEdges(): DataStructures.Dictionary<string, Edge>;
        clearEdges(): Graph;
        getVertex(identify: string): IVertex;
        hasVertex(vertex: IVertex): boolean;
        addVertex(vertex: IVertex): Graph;
        getNeighbours(vertex: IVertex): IVertex[];
        getEdgesByVertex(vertex: IVertex, bothWay?: boolean): Edge[];
        removeVertex(vertex: IVertex): Graph;
        getEdge(startVertex: IVertex, endVertex: IVertex, bothWay?: boolean): Edge;
        hasEdge(startVertex: IVertex, endVertex: IVertex, bothWay?: boolean): boolean;
        addEdge(edge: Edge): Graph;
        removeEdge(startVertext: IVertex, endVertext: IVertex): Graph;
        static dijsktra(graph: Graph, vertex: IVertex, weightFunction: (edge: Edge) => number): DijsktraGraphData;
        static floydWarshall(graph: Graph, weightFunction: (edge: Edge) => number): FloydGraphData;
        static floydWarsshallShortestPaths(graph: Graph, start: IVertex, end: IVertex, weightFunction: (edge: Edge) => number, data: FloydGraphData): FloydGraphData;
        static floydWarsshallShortestPath(start: IVertex, end: IVertex, data: FloydGraphData): IVertex[];
        static kruskal(graph: Graph, weightFunction: (edge: Edge) => number): Graph;
    }
}
