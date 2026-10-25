let items = JSON.parse(
    localStorage.getItem("kitchenItems") || "[]"
);

// Display all items
function showItems() {
    let list = document.getElementById("itemList");
    list.innerHTML = "";

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    items.forEach(function(item, index) {

        let status = "Available";
        let color = "green";

        // Check expiry date
        let expiryDate = item.expiry
            ? new Date(item.expiry + "T00:00:00")
            : null;

        if (expiryDate && expiryDate < today) {
            status = "Expired";
            color = "red";
        }

        // Check quantity
        else if (Number(item.quantity) === 0) {
            status = "Out of Stock";
            color = "red";
        }

        else if (Number(item.quantity) <= 2) {
            status = "Low Stock";
            color = "orange";
        }

        // Add item to the table
        list.innerHTML += `
            <tr>
                <td>${escapeHTML(item.name)}</td>
                <td>${item.quantity}</td>
                <td>${item.expiry || "Not set"}</td>
                <td style="color:${color}; font-weight:bold">
                    ${status}
                </td>
                <td>
                    <button onclick="editItem(${index})">
                        Edit
                    </button>

                    <button class="delete"
                    onclick="removeItem(${index})">
                        Remove
                    </button>
                </td>
            </tr>
        `;
    });

    // Update total item count
    document.getElementById("total").innerText = items.length;

    // Save items in browser
    localStorage.setItem(
        "kitchenItems",
        JSON.stringify(items)
    );
}

// Prevent item names from being treated as HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        }[character];
    });
}

// Add a new item
function addItem() {
    let name = document.getElementById("name").value.trim();
    let quantity = document.getElementById("quantity").value;
    let expiry = document.getElementById("expiry").value;

    if (name === "" || quantity === "" ||
        !Number.isFinite(Number(quantity)) ||
        Number(quantity) < 0) {
        alert("Please enter a valid item name and quantity!");
        return;
    }

    // Store new item
    items.push({
        name: name,
        quantity: Number(quantity),
        expiry: expiry
    });

    showItems();

    // Clear input fields
    document.getElementById("name").value = "";
    document.getElementById("quantity").value = "";
    document.getElementById("expiry").value = "";
}

// Edit an existing item
function editItem(index) {
    let item = items[index];

    let newName = prompt("Enter item name:", item.name);

    if (newName === null) return;

    newName = newName.trim();

    if (newName === "") {
        alert("Item name cannot be empty!");
        return;
    }

    let newQuantity = prompt(
        "Enter quantity:",
        item.quantity
    );

    if (newQuantity === null) return;

    if (newQuantity.trim() === "" ||
        !Number.isFinite(Number(newQuantity)) ||
        Number(newQuantity) < 0) {
        alert("Please enter a valid quantity!");
        return;
    }

    let newExpiry = prompt(
        "Enter expiry date (YYYY-MM-DD):",
        item.expiry || ""
    );

    if (newExpiry === null) return;

    if (newExpiry !== "" &&
        !/^\d{4}-\d{2}-\d{2}$/.test(newExpiry)) {
        alert("Enter the date in YYYY-MM-DD format!");
        return;
    }

    item.name = newName;
    item.quantity = Number(newQuantity);
    item.expiry = newExpiry;

    showItems();
}

// Remove an item
function removeItem(index) {
    let confirmDelete = confirm(
        "Do you want to remove " + items[index].name + "?"
    );

    if (confirmDelete) {
        items.splice(index, 1);
        showItems();
    }
}

// Show inventory when the page opens
showItems();