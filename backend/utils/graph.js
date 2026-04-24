function processBFHL(data) {
    const user_id = "nitikachauhan_25062004";
    const email_id = "nc2402@srmist.edu.in";
    const college_roll_number = "RA2311003010329";

    const invalid_entries = [];
    const duplicate_edges = [];

    const edgeSet = new Set();
    const adj = {};
    const nodes = new Set();
    const children = new Set();
    const childParent = {};

    const isValid = (s) => /^[A-Z]->[A-Z]$/.test(s);

    // ---------------- VALIDATION ----------------
    for (let raw of data) {
        const edge = raw.trim();

        if (!isValid(edge)) {
            invalid_entries.push(raw);
            continue;
        }

        const [u, v] = edge.split("->");

        if (u === v) {
            invalid_entries.push(raw);
            continue;
        }

        if (edgeSet.has(edge)) {
            duplicate_edges.push(edge);
            continue;
        }

        if (childParent[v] && childParent[v] !== u) continue;
        childParent[v] = u;

        edgeSet.add(edge);

        if (/^[A-Z]$/.test(u) && /^[A-Z]$/.test(v)) {
            if (!adj[u]) adj[u] = [];
            adj[u].push(v);

            nodes.add(u);
            nodes.add(v);
            children.add(v);
        }
    }

    // ---------------- GRAPH ----------------
    const undirected = new Map();

    for (let u in adj) {
        for (let v of adj[u]) {
            if (!undirected.has(u)) undirected.set(u, []);
            if (!undirected.has(v)) undirected.set(v, []);

            undirected.get(u).push(v);
            undirected.get(v).push(u);
        }
    }

    function getComponent(start) {
        const stack = [start];
        const comp = new Set();

        while (stack.length) {
            const node = stack.pop();
            if (comp.has(node)) continue;
            comp.add(node);

            for (let nei of (undirected.get(node) || [])) {
                if (!comp.has(nei)) stack.push(nei);
            }
        }

        return comp;
    }

    function hasCycle(node, vis, rec) {
        vis.add(node);
        rec.add(node);

        for (let nei of (adj[node] || [])) {
            if (!vis.has(nei)) {
                if (hasCycle(nei, vis, rec)) return true;
            } else if (rec.has(nei)) return true;
        }

        rec.delete(node);
        return false;
    }

    function depth(node) {
        let max = 1;
        for (let nei of (adj[node] || [])) {
            max = Math.max(max, 1 + depth(nei));
        }
        return max;
    }

    function build(node) {
        const obj = {};
        for (let nei of (adj[node] || [])) {
            obj[nei] = build(nei);
        }
        return obj;
    }

    // ---------------- ORDER FIX ----------------
    const order = [];

    for (let r of data) {
        const e = r.trim();
        if (!e.includes("->")) continue;

        const [u, v] = e.split("->");

        if (/^[A-Z]$/.test(u) && !order.includes(u)) order.push(u);
        if (/^[A-Z]$/.test(v) && !order.includes(v)) order.push(v);
    }

    for (let n of nodes) {
        if (!order.includes(n)) order.push(n);
    }

    const visited = new Set();
    const hierarchies = [];

    for (let node of order) {
        if (visited.has(node)) continue;

        const comp = getComponent(node);

        for (let n of comp) visited.add(n);

        let vis = new Set();
        let rec = new Set();
        let cycle = false;

        for (let n of comp) {
            if (!vis.has(n)) {
                if (hasCycle(n, vis, rec)) {
                    cycle = true;
                    break;
                }
            }
        }

        let roots = [...comp].filter(n => !children.has(n));
        let root = roots.length ? roots.sort()[0] : [...comp].sort()[0];

        if (cycle) {
            hierarchies.push({
                root,
                tree: {},
                has_cycle: true
            });
            continue;
        }

        hierarchies.push({
            root,
            tree: { [root]: build(root) },
            depth: depth(root)
        });
    }

    const valid = hierarchies.filter(h => !h.has_cycle);

    let largest_tree_root = "";
    let maxDepth = -1;

    for (let t of valid) {
        if (t.depth > maxDepth || (t.depth === maxDepth && t.root < largest_tree_root)) {
            maxDepth = t.depth;
            largest_tree_root = t.root;
        }
    }

    return {
        user_id,
        email_id,
        college_roll_number,
        hierarchies,
        invalid_entries,
        duplicate_edges,
        summary: {
            total_trees: valid.length,
            total_cycles: hierarchies.length - valid.length,
            largest_tree_root
        }
    };
}

module.exports = { processBFHL };