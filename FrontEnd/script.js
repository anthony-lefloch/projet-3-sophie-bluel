// Vérifie que le fichier JavaScript est bien relié au fichier HTML
console.log("Le fichier JavaScript est bien connecté");

// Récupère le token enregistré lors de la connexion
const token = localStorage.getItem("token");

// Sélectionne le lien login dans le menu
const loginLink = document.querySelector("#login-link");

// Sélectionne la galerie dans le HTML
const gallery = document.querySelector(".gallery");

// Sélectionne la zone où seront affichés les filtres
const filters = document.querySelector(".filters");

// Sélectionne le bandeau du mode édition
const editBanner = document.querySelector(".edit-banner");

// Sélectionne le bouton modifier
const editButton = document.querySelector(".edit-button");

// Vérifie si l'utilisateur est connecté
if (token) {
  // Remplace login par logout
  loginLink.innerText = "logout";

  // Affiche le bandeau du mode édition
  editBanner.style.display = "block";

  // Cache les filtres
  filters.style.display = "none";

  // Affiche le bouton modifier
  editButton.style.display = "block";

  console.log("Utilisateur connecté");

  // Déconnecte l'utilisateur au clic
  loginLink.addEventListener("click", function (event) {
    event.preventDefault();

    // Supprime le token
    localStorage.removeItem("token");

    // Recharge la page d'accueil
    window.location.href = "./index.html";
  });
} else {
  console.log("Utilisateur non connecté");
}

// Stocke tous les travaux récupérés depuis l'API
let allWorks = [];

// Met à jour le bouton actif
function updateActiveButton(clickedButton) {
  // Sélectionne tous les boutons de filtre
  const filterButtons = document.querySelectorAll(".filter-button");

  // Retire la classe active de tous les boutons
  filterButtons.forEach(function (button) {
    button.classList.remove("active");
  });

  // Ajoute la classe active au bouton cliqué
  clickedButton.classList.add("active");
}

// Vérifie que la zone des filtres est bien récupérée
console.log(filters);

// Vérifie que la galerie est bien récupérée
console.log(gallery);

// Crée le bouton "Tous"
const allButton = document.createElement("button");

// Ajoute le texte du bouton
allButton.innerText = "Tous";

// Ajoute les classes CSS au bouton "Tous"
allButton.classList.add("filter-button", "active");

// Ajoute le bouton dans la zone des filtres
filters.appendChild(allButton);

// Au clic sur "Tous", affiche tous les projets
allButton.addEventListener("click", function () {
  updateActiveButton(allButton);
  displayWorks(allWorks);
});

// Appel à l'API pour récupérer les catégories
fetch("http://localhost:5678/api/categories")
  .then(function (response) {
    // Transforme la réponse en données JavaScript
    return response.json();
  })
  .then(function (categories) {
    // Affiche les catégories dans la console
    console.log(categories);

    // Pour chaque catégorie récupérée depuis l'API
    categories.forEach(function (category) {
      // Crée un bouton
      const categoryButton = document.createElement("button");

      // Ajoute le nom de la catégorie dans le bouton
      categoryButton.innerText = category.name;

      // Ajoute une classe CSS au bouton
      categoryButton.classList.add("filter-button");

      // Ajoute le bouton dans la zone des filtres
      filters.appendChild(categoryButton);

      // Au clic sur une catégorie, affiche seulement les projets de cette catégorie
      categoryButton.addEventListener("click", function () {
        updateActiveButton(categoryButton);

        const filteredWorks = allWorks.filter(function (work) {
          return work.categoryId === category.id;
        });

        displayWorks(filteredWorks);
      });
    });
  });

// Fonction qui crée un élément HTML pour afficher un projet
function createWorkElement(work) {
    // Crée une balise <figure>
    const figure = document.createElement("figure");

    // Crée une balise <img>
    const image = document.createElement("img");

    // Ajoute l'image récupérée depuis l'API
    image.src = work.imageUrl;

    // Ajoute un texte alternatif à l'image
    image.alt = work.title;

    // Crée une balise <figcaption>
    const caption = document.createElement("figcaption");

    // Ajoute le titre du projet dans la légende
    caption.innerText = work.title;

    // Ajoute l'image dans la figure
    figure.appendChild(image);

    // Ajoute la légende dans la figure
    figure.appendChild(caption);

    // Retourne la figure complète
    return figure;
}

// Fonction qui affiche une liste de projets dans la galerie
function displayWorks(works) {
    // Vide la galerie avant d'afficher les projets
    gallery.innerHTML = "";

    // Pour chaque projet récupéré
    works.forEach(function (work) {
        // Crée un élément HTML pour le projet
        const workElement = createWorkElement(work);

        // Ajoute ce projet dans la galerie
        gallery.appendChild(workElement);
    });
}

// Appel à l'API pour récupérer les travaux de Sophie Bluel
fetch("http://localhost:5678/api/works")
  .then(function (response) {
    // Transforme la réponse de l'API en données JavaScript
    return response.json();
  })
  .then(function (works) {
    // Stocke tous les travaux dans la variable allWorks
    allWorks = works;

    // Affiche tous les travaux récupérés dans la console
    console.log(allWorks);

    // Affiche les projets dans la galerie
    displayWorks(allWorks);
  });