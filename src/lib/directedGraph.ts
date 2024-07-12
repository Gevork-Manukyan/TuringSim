interface Node {
    id: string;
    value?: any;
}

interface Edge {
    from: string;
    to: string;
}

class DirectedGraph {
    private nodes: Map<string, Node>;
    private adjacencyList: Map<string, Edge[]>;

    constructor() {
        this.nodes = new Map();
        this.adjacencyList = new Map();
    }

    // Add node to 'nodes' if it doesn't exist already
    addNode(node: Node): void {
        if (!this.nodes.has(node.id)) {
            this.nodes.set(node.id, node);
            this.adjacencyList.set(node.id, []);
        }
    }

    removeNode() {
        // TODO:
    }

    addEdge(edge: Edge): void {
        const { from, to } = edge;

        if (!this.nodes.has(from) || !this.nodes.has(to)) {
            throw new Error("Both nodes must exist to make an edge")
        }

        this.adjacencyList.get(from)!.push({ from, to });
    }

    removeEdge() {
        // TODO:
    }

}