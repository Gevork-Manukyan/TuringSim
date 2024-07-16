export interface Node {
    id: string;
    value?: any;
}

export interface Edge {
    from: string;
    to: string;
}

export default class DirectedGraph {
    private nodes: Map<string, Node>;
    // string: node id
    // Edge[]: all edges going from this node out
    private adjacencyList: Map<string, Edge[]>;

    constructor() {
        this.nodes = new Map();
        this.adjacencyList = new Map();
    }

    addNode(node: Node): void {
        if (!this.nodes.has(node.id)) {
            this.nodes.set(node.id, node);
            this.adjacencyList.set(node.id, []);
        }
    }

    removeNode(nodeId: string) {
        const isNodeDeleted = this.nodes.delete(nodeId);
        if (!isNodeDeleted) throw new Error("Node must exist to be deleted")
        
        // Remove all edges going out of node
        this.adjacencyList.delete(nodeId)

        // Remove all edges going into node
        for (const fromNodeId of this.adjacencyList.keys()) this.removeEdge(fromNodeId, nodeId);
    }

    addEdge(edge: Edge): void {
        const { from, to } = edge;
        this.doNodesExist(from, to);
        this.adjacencyList.get(from)!.push({ from, to });
    }

    removeEdge(from: string, to: string) {
        this.doNodesExist(from, to);
        
        const filteredEdges = this.adjacencyList.get(from)!.filter(edge => edge.to !== to);
        this.adjacencyList.set(
            from,
            filteredEdges
        )
    }

    private doNodesExist(from: string, to: string): boolean {
        if (!this.nodes.has(from) || !this.nodes.has(to)) throw new Error("Both nodes must exist to make an edge");
        return true;
    }
}