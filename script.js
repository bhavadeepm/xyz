document.addEventListener("DOMContentLoaded", () => {
    const searchTypeRadios = document.querySelectorAll("input[name='search-type']");
    const searchButton = document.getElementById("search-button");
    const plantNameInput = document.getElementById("plant-name-input");
    const therapeuticCheckboxes = document.querySelectorAll("input[name='therapeutic-use']");
    const resultsSection = document.getElementById("results-section");
    const plantModal = document.getElementById("plant-modal");
    const modalDetails = document.getElementById("modal-details");
    const closeButton = document.querySelector(".close-button");
  
    // Event listener to toggle search input fields
    searchTypeRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const searchByPlant = document.getElementById("search-by-plant");
        const searchByDisease = document.getElementById("search-by-disease");
        if (e.target.value === "plant") {
          searchByPlant.style.display = "block";
          searchByDisease.style.display = "none";
        } else {
          searchByPlant.style.display = "none";
          searchByDisease.style.display = "block";
        }
      });
    });
  
    // Fetch plant data
    const fetchPlantData = async () => {
      try {
        const response = await fetch("data.json"); // Update with the correct path
        if (!response.ok) throw new Error("Error fetching data");
        return await response.json();
      } catch (error) {
        console.error(error);
        alert("Failed to load plant data.");
        return [];
      }
    };
  
    // Search logic
    const searchPlants = async () => {
      const data = await fetchPlantData();
      const searchType = document.querySelector("input[name='search-type']:checked").value;
      let results = [];
  
      if (searchType === "plant") {
        const query = plantNameInput.value.trim().toLowerCase();
        results = data.filter((plant) =>
          plant.commonName.toLowerCase().includes(query)
        );
      } else if (searchType === "disease") {
        const selectedUses = Array.from(therapeuticCheckboxes)
          .filter((checkbox) => checkbox.checked)
          .map((checkbox) => checkbox.value);
        results = data.filter((plant) =>
          selectedUses.some((use) => plant.therapeuticUses.includes(use))
        );
      }
  
      displayResults(results);
    };
  
    // Display search results
    const displayResults = (plants) => {
      resultsSection.innerHTML = "";
      if (plants.length === 0) {
        resultsSection.innerHTML = "<p>No plants found.</p>";
        return;
      }
  
      plants.forEach((plant) => {
        const plantCard = document.createElement("div");
        plantCard.className = "plant-card";
        plantCard.innerHTML = `
          <img src="${plant.image}" alt="${plant.commonName}" class="plant-image">
          <h3>${plant.commonName}</h3>
          <button class="details-button" data-id="${plant.id}">Details</button>
        `;
        resultsSection.appendChild(plantCard);
      });
  
      const detailButtons = document.querySelectorAll(".details-button");
      detailButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const plantId = e.target.getAttribute("data-id");
          const plant = plants.find((p) => p.id === plantId);
          if (plant) displayModal(plant);
        });
      });
    };
  
    // Display modal with plant details
    const displayModal = (plant) => {
      modalDetails.innerHTML = `
        <img src="${plant.image}" alt="${plant.commonName}" class="modal-image">
        <h2>${plant.commonName}</h2>
        <p><strong>Therapeutic Uses:</strong> ${plant.therapeuticUses.join(", ")}</p>
        <p><strong>Parts Used:</strong> ${plant.partsUsed}</p>
        <p><strong>Taxonomy:</strong> ${plant.taxonomy}</p>
        <p><strong>References:</strong> ${plant.references}</p>
      `;
      plantModal.style.display = "block";
    };
  
    // Close modal
    closeButton.addEventListener("click", () => {
      plantModal.style.display = "none";
    });
  
    // Search button event
    searchButton.addEventListener("click", searchPlants);
  });
  