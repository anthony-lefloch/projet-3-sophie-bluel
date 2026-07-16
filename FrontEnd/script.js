// Vérifie que le fichier JavaScript est bien relié au fichier HTML
console.log("Le fichier JavaScript est bien connecté");

// Sélectionne la galerie dans le HTML
const gallery = document.querySelector(".gallery");

// Sélectionne la zone où seront affichés les filtres
const filters = document.querySelector(".filters");

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

// Appel à l'API pour récupérer les travaux de Sophie Bluel
fetch("http://localhost:5678/api/works")
  .then(function (response) {
    // Transforme la réponse de l'API en données JavaScript
    return response.json();
  })
  .then(function (works) {
    // Affiche tous les travaux récupérés dans la console
    console.log(works);

    // Vide la galerie avant d'ajouter les projets dynamiquement
    gallery.innerHTML = "";

    // Pour chaque projet récupéré depuis l'API
    works.forEach(function (work) {
      // Crée un élément HTML pour le projet
      const workElement = createWorkElement(work);

      // Ajoute ce projet dans la galerie
      gallery.appendChild(workElement);
    });
  });