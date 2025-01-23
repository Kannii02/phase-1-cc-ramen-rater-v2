let currentRamenId = null;

// Function to fetch and display all ramen images
const displayRamens = () => {
  fetch("http://localhost:3000/ramens")
    .then((res) => res.json())
    .then((ramens) => {
      document.getElementById("ramen-menu").innerHTML = ""; 
      ramens.forEach((ramen) => renderRamenImage(ramen));

      // Automatically display the first ramen's details
      if (ramens.length > 0) {
        handleClick(ramens[0]);
      }
    });
};

// Function to render a ramen image in the menu
const renderRamenImage = (ramen) => {
  const ramenMenu = document.getElementById("ramen-menu");
  const img = document.createElement("img");
  img.src = ramen.image;
  img.alt = ramen.name;

  // Add click event to show ramen details
  img.addEventListener("click", () => handleClick(ramen));

  ramenMenu.appendChild(img);
};

// Function to update ramen details when an image is clicked
const handleClick = (ramen) => {
  currentRamenId = ramen.id;
  document.querySelector(".detail-image").src = ramen.image;
  document.querySelector(".name").textContent = ramen.name;
  document.querySelector(".restaurant").textContent = ramen.restaurant;
  document.getElementById("rating-display").textContent = ramen.rating;
  document.getElementById("comment-display").textContent = ramen.comment;

  // Pre-fill the edit form with existing values
  document.getElementById("edit-rating").value = ramen.rating;
  document.getElementById("edit-comment").value = ramen.comment;
};

// Function to add event listener for new ramen form submission
const addSubmitListener = () => {
  const form = document.querySelector("#new-ramen");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const newRamen = {
      name: event.target["new-name"].value,
      restaurant: event.target["new-restaurant"].value,
      image: event.target["new-image"].value,
      rating: event.target["new-rating"].value,
      comment: event.target["new-comment"].value
    };

    // Create a new ramen image element
    const img = document.createElement("img");
    img.src = newRamen.image;
    img.alt = newRamen.name;

    // Add click event listener to display ramen details when clicked
    img.addEventListener("click", () => handleClick(newRamen));

    // Append new ramen image to the menu
    document.querySelector("#ramen-menu").appendChild(img);

    // Send POST request to add new ramen to the server
    fetch("http://localhost:3000/ramens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRamen)
    })
    .then((res) => res.json())
    .then((createdRamen) => {
      console.log("New ramen added:", createdRamen);
    });

    // Reset the form after submission
    form.reset();
  });
};

// Function to handle updating ramen details
const addEditListener = () => {
  document.getElementById("edit-ramen").addEventListener("submit", (event) => {
    event.preventDefault();

    const updatedData = {
      rating: event.target["edit-rating"].value,
      comment: event.target["edit-comment"].value
    };

    fetch(`http://localhost:3000/ramens/${currentRamenId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    })
    .then((res) => res.json())
    .then((updatedRamen) => {
      document.getElementById("rating-display").textContent = updatedRamen.rating;
      document.getElementById("comment-display").textContent = updatedRamen.comment;
    });
  });
};

// Function to delete a ramen from the menu
const addDeleteListener = () => {
  document.getElementById("delete-button").addEventListener("click", () => {
    if (!currentRamenId) return;

    fetch(`http://localhost:3000/ramens/${currentRamenId}`, {
      method: "DELETE"
    })
    .then(() => {
      displayRamens(); 
    });
  });
};

// Main function to start the app
const main = () => {
  displayRamens();
  addSubmitListener();
  addEditListener();
  addDeleteListener();
};

document.addEventListener("DOMContentLoaded", main);

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
  addEditListener,
  addDeleteListener
};
