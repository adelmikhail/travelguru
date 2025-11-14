document.addEventListener("DOMContentLoaded", () => {

    const input = document.querySelector(".navlinks input");
    const searchBtn = document.getElementById("searchBtn");
    const resetBtn = document.getElementById("resetBtn");

    // Load JSON data
    async function loadData() {
        const response = await fetch("./travel_recommendation_api.json");
        return response.json();
    }

    // Convert word to its stem (simple English stemmer)
function stem(word) {
    return word
        .toLowerCase()
        .replace(/(es|s|ing|ed|er|ly)$/i, "");  
}

// Search handler
async function handleSearch() {
    const rawQuery = input.value.trim().toLowerCase();
    const query = stem(rawQuery); // turn “beaches” → “beach”

    if (!query) return alert("Please enter a search term.");

    const data = await loadData();

    // Flatten JSON
    const allDestinations = Object.values(data).flat();

    // Match both keywords + name using stemmed comparison
    const results = allDestinations.filter(item => {
        const nameStem = stem(item.name);
        const keywordMatch =
            item.keywords &&
            item.keywords.some(k => stem(k).includes(query));

        return nameStem.includes(query) || keywordMatch;
    });

    displayResults(results);
}


    // Display results inside .maindiv
    function displayResults(results) {
        const mainDiv = document.querySelector(".maindiv");

        if (results.length === 0) {
            mainDiv.innerHTML = `
                <h1 class="maintext">No Results Found</h1>
                <p class="maintext">Try another destination like beach, mountain, city...</p>
            `;
            return;
        }

        let html = `<h1 class="maintext">Search Results</h1>`;

        results.forEach(result => {
            html += `
                <div class="result-card" style="background: rgba(0,0,0,0.5); padding: 1rem; margin-bottom: 1rem; border-radius: 8px;">
                    <h2>${result.name}</h2>
                    <p>${result.description}</p>
                </div>
            `;
        });

        document.querySelector(".maindiv").innerHTML = html;
    }

    // Reset handler
    function handleReset() {
        input.value = "";
        document.querySelector(".maindiv").innerHTML = `
            <h1 class="maintext">Explore Dream Destination</h1>
            <p class="maintext">You will not regret it. I promise</p>
        `;
    }

    // Event listeners
    searchBtn.addEventListener("click", handleSearch);
    resetBtn.addEventListener("click", handleReset);
});