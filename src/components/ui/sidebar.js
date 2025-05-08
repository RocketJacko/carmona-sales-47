// Seleccionar elementos del DOM
const menuToggle = document.querySelector(".menuToggle");
const sidebar = document.querySelector(".sidebar");
const menuItems = document.querySelectorAll(".Menulist li");

// Función para manejar el toggle del menú
menuToggle.onclick = function() {
  menuToggle.classList.toggle("active");
  sidebar.classList.toggle("active");
  
  // Añadir efecto de rotación al botón
  if (menuToggle.classList.contains("active")) {
    menuToggle.style.transform = "rotate(180deg)";
  } else {
    menuToggle.style.transform = "rotate(0deg)";
  }
};

// Función para manejar el estado activo de los items del menú
function activeLink() {
  // Remover clase active de todos los items
  menuItems.forEach((item) => {
    item.classList.remove("active");
    // Resetear transformación
    item.style.transform = "translateX(0)";
  });
  
  // Añadir clase active al item clickeado
  this.classList.add("active");
  
  // Añadir efecto de desplazamiento
  this.style.transform = "translateX(5px)";
  
  // Añadir efecto de escala al ícono
  const icon = this.querySelector(".icon");
  if (icon) {
    icon.style.transform = "scale(1.1)";
  }
}

// Añadir event listeners a los items del menú
menuItems.forEach((item) => {
  item.addEventListener("click", activeLink);
  
  // Añadir efectos hover
  item.addEventListener("mouseenter", function() {
    if (!this.classList.contains("active")) {
      this.style.transform = "translateX(5px)";
    }
  });
  
  item.addEventListener("mouseleave", function() {
    if (!this.classList.contains("active")) {
      this.style.transform = "translateX(0)";
    }
  });
}); 