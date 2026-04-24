async function submitData() {
    let data;

    try {
        data = JSON.parse(document.getElementById("input").value);
    } catch {
        alert("Invalid JSON");
        return;
    }

    const res = await fetch("/bfhl", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    document.getElementById("output").innerText =
        JSON.stringify(result, null, 2);
}