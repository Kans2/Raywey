// src/components/JsonViewer.jsx – Syntax-highlighted JSON display
export default function JsonViewer({ data }) {
    const stringify = (val, indent = 0) => {
        const pad = "  ".repeat(indent);
        const childPad = "  ".repeat(indent + 1);

        if (val === null) return <span className="json-null">null</span>;
        if (typeof val === "boolean") return <span className="json-bool">{String(val)}</span>;
        if (typeof val === "number") return <span className="json-number">{val}</span>;
        if (typeof val === "string") return <span className="json-string">"{val}"</span>;

        if (Array.isArray(val)) {
            if (val.length === 0) return <span>{"[]"}</span>;
            return (
                <>
                    {"[\n"}
                    {val.map((item, i) => (
                        <span key={i}>
                            {childPad}
                            {stringify(item, indent + 1)}
                            {i < val.length - 1 ? "," : ""}
                            {"\n"}
                        </span>
                    ))}
                    {pad}
                    {"]"}
                </>
            );
        }

        if (typeof val === "object") {
            const keys = Object.keys(val);
            if (keys.length === 0) return <span>{"{}"}</span>;
            return (
                <>
                    {"{\n"}
                    {keys.map((key, i) => (
                        <span key={key}>
                            {childPad}
                            <span className="json-key">"{key}"</span>: {stringify(val[key], indent + 1)}
                            {i < keys.length - 1 ? "," : ""}
                            {"\n"}
                        </span>
                    ))}
                    {pad}
                    {"}"}
                </>
            );
        }
        return <span>{String(val)}</span>;
    };

    return (
        <div className="json-viewer">
            <pre style={{ margin: 0, fontFamily: "inherit" }}>{stringify(data)}</pre>
        </div>
    );
}
