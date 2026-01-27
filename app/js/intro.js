document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video-vinheta");
  const vinheta = document.getElementById("vinheta");
  const menu = document.getElementById("menu");

  function showMainMenu() {
    if (video) {
      video.pause();
      video.currentTime = 0;
    }

    vinheta.classList.remove("tela-ativa");
    vinheta.classList.add("tela");

    menu.classList.remove("tela");
    menu.classList.add("tela-ativa");

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    console.log("✅ Menu principal exibido");
  }

  if (!video) {
    showMainMenu();
    return;
  }

  video.addEventListener("ended", showMainMenu);
  video.addEventListener("error", showMainMenu);

  setTimeout(() => {
    if (vinheta.classList.contains("tela-ativa")) {
      showMainMenu();
    }
  }, 8000);

  document.addEventListener("keydown", (e) => {
    if (["Space", "Enter", "Escape"].includes(e.code)) {
      showMainMenu();
    }
  });
});