//  Reperisco le api

document.addEventListener("DOMContentLoaded", function () {
    const URL = "https://striveschool-api.herokuapp.com/api/product/";
    const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTcyZWMzOWZlMDMxZTAwMTliYTE0NzQiLCJpYXQiOjE3MDIwMzAzOTQsImV4cCI6MTcwMzIzOTk5NH0.eY6q98tzGfcJtYIqh8JhzpDD2Erk_6Si0eNKZiSYGC0";

    const requestOptions = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    fetch(URL, requestOptions)
        .then((response) => {
            if (response.status === 404) throw new Error("Errore, risorsa non trovata");
            if (response.status >= 400 && response.status < 500) throw new Error("Errore lato Client");
            if (response.status >= 500 && response.status < 600) throw new Error("Errore lato Server");
            if (!response.ok) throw new Error("Errore nel reperimento dei dati");

            return response.json();
        })

        // Genero le card
        .then((products) => {
            const cardContainer = document.getElementById("cardContainer");

            products.forEach((phone) => {
                const div = document.createElement("div");
                div.className = "card col-12 col-md-6 col-lg-4 col-xl-3 mb-3";

                const img = document.createElement("img");
                img.className = "card-img-top custom-img ";
                img.src = phone.imageUrl;

                const cardBody = document.createElement("div");
                cardBody.className = "card-body d-flex flex-column";

                const brand = document.createElement("h4");
                brand.className = "card-title";
                brand.textContent = phone.brand;

                const title = document.createElement("h5");
                title.className = "card-title";
                title.textContent = phone.name;

                const split = document.createElement("hr");
                const split_2 = document.createElement("hr");

                const text = document.createElement("p");
                text.className = "card-text";
                text.textContent = phone.description;

                const price = document.createElement("p");
                price.className = "card-text prezzo";
                price.textContent = phone.price + "$";

                const button = document.createElement("a");
                button.className = "btn personalButton mt-auto";
                button.textContent = "Dettagli";
                if (phone._id && token) {
                    button.href = `./dettagli.html?resourceId=${encodeURIComponent(
                        phone._id
                    )}&token=${encodeURIComponent(token)}`;
                } else {
                    console.error("phone._id o token non validi:", phone._id, token);
                }

                cardContainer.appendChild(div);
                div.appendChild(img);
                div.appendChild(cardBody);
                cardBody.appendChild(brand);
                cardBody.appendChild(title);
                cardBody.appendChild(text);
                cardBody.appendChild(price);
                text.appendChild(split);
                brand.appendChild(split_2);
                cardBody.appendChild(button);
            });
        })
        .catch((error) => {
            console.error("Si è verificato un errore:", error);
        });
    // rendo funzionante il search

    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchCards();
    });
});
function searchCards() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    const cards = document.getElementsByClassName("card");

    for (const card of cards) {
        const brand = card.querySelector(".card-body .card-title").textContent.toLowerCase();
        const title = card.querySelector(".card-body h5").textContent.toLowerCase();
        const description = card.querySelector(".card-body p").textContent.toLowerCase();

        if (brand.includes(searchTerm) || title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
}
