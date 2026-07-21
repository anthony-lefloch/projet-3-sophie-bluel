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

// Sélectionne la modale dans le HTML
const modal = document.querySelector(".modal");

// Sélectionne le bouton qui ferme la modale
const modalClose = document.querySelector(".modal-close");

// Sélectionne la vue galerie de la modale
const modalGalleryView = document.querySelector(".modal-gallery-view");

// Sélectionne la galerie située dans la modale
const modalGallery = document.querySelector(".modal-gallery");

// Sélectionne la vue formulaire de la modale
const modalFormView = document.querySelector(".modal-form-view");

// Sélectionne le bouton Ajouter une photo
const addPhotoButton = document.querySelector(".add-photo-button");

// Sélectionne la flèche de retour de la modale
const modalBack = document.querySelector(".modal-back");

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

  // Ouvre la modale au clic sur le bouton Modifier
  editButton.addEventListener("click", function () {
    // Affiche la vue galerie
    modalGalleryView.style.display = "block";

    // Cache la vue formulaire
    modalFormView.style.display = "none";

    // Affiche la modale avec Flexbox
    modal.style.display = "flex";
  });

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

// Ferme la modale au clic sur la croix
modalClose.addEventListener("click", function () {
  // Cache la modale
  modal.style.display = "none";
});

// Ferme la modale au clic sur le fond sombre
modal.addEventListener("click", function (event) {
  // Vérifie si le clic a été fait directement sur le fond de la modale
  if (event.target === modal) {
    // Cache la modale
    modal.style.display = "none";
  }
});

// Affiche le formulaire au clic sur le bouton Ajouter une photo
addPhotoButton.addEventListener("click", function () {
  // Cache la vue galerie
  modalGalleryView.style.display = "none";

  // Affiche la vue formulaire
  modalFormView.style.display = "block";
});

// Affiche la galerie au clic sur la flèche de retour
modalBack.addEventListener("click", function () {
  // Cache la vue formulaire
  modalFormView.style.display = "none";

  // Affiche la vue galerie
  modalGalleryView.style.display = "block";
});


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

// Affiche les projets dans la galerie de la modale
function displayModalWorks(works) {
  // Vide la galerie de la modale avant d'afficher les projets
  modalGallery.innerHTML = "";

  // Parcourt tous les projets
  works.forEach(function (work) {
    // Crée un conteneur pour le projet dans la modale
    const workContainer = document.createElement("div");

    // Ajoute une classe au conteneur
    workContainer.classList.add("modal-work");

    // Crée une balise image
    const image = document.createElement("img");

    // Ajoute l'image du projet
    image.src = work.imageUrl;

    // Ajoute un texte alternatif
    image.alt = work.title;

    // Crée le bouton de suppression
    const deleteButton = document.createElement("button");

    // Enregistre l'id du projet sur le bouton de suppression
    deleteButton.dataset.id = work.id;

    // Ajoute une classe au bouton de suppression
    deleteButton.classList.add("delete-work");

    // Ajoute le symbole de corbeille
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    // Supprime le projet au clic sur la corbeille
    deleteButton.addEventListener("click", function () {
      // Récupère l'id du projet à supprimer
      const workId = deleteButton.dataset.id;

      // Envoie une requête DELETE à l'API
      fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",

        // Envoie le token pour prouver que l'utilisateur est connecté
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      .then(function (response) {
        // Vérifie que la suppression a bien été acceptée par l'API
        if (response.ok) {
          console.log("Projet supprimé avec succès");
          
          // Retire le projet supprimé du tableau allWorks
          allWorks = allWorks.filter(function (work) {
            return work.id !== Number(workId);
          });

          // Met à jour la galerie principale
          displayWorks(allWorks);

          // Met à jour la galerie de la modale
          displayModalWorks(allWorks);
        } else {
          console.log("Erreur lors de la suppression du projet");
        }
      });
    });

    // Ajoute l'image dans le conteneur
    workContainer.appendChild(image);

    // Ajoute le bouton de suppression dans le conteneur
    workContainer.appendChild(deleteButton);

    // Ajoute le conteneur complet dans la galerie de la modale
    modalGallery.appendChild(workContainer);
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

    // Affiche aussi les projets dans la galerie de la modale
    displayModalWorks(allWorks);
  });