(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  window.lucide?.createIcons();
  document.querySelectorAll(".js-only").forEach((element) => {
    element.hidden = false;
  });
  const scenes = {
    baseball: {
      label: "Baseball: a batter, catcher, and umpire",
      size: [654, 486],
    },
    zebras: { label: "Three zebras", size: [556, 367] },
    equestrian: {
      label: "A rider and horse jumping an obstacle",
      size: [556, 366],
    },
    donuts: { label: "A box of donuts", size: [556, 406] },
  };
  const media = (name) => `static/media/${name}.webp`;
  let sceneRequest = 0;
  const preload = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = resolve;
      image.onerror = reject;
      image.src = src;
    });
  const applyImage = (element, src, alt, size) => {
    element.src = src;
    element.alt = alt;
    [element.width, element.height] = size;
  };
  let currentScene = "baseball";
  $("scene-select").addEventListener("change", async (event) => {
    const name = event.target.value;
    const scene = scenes[name];
    if (!scene) return;
    const request = ++sceneRequest;
    $("visual-triptych").setAttribute("aria-busy", "true");
    try {
      await Promise.all(
        ["input", "tokens", "prediction"].map((kind) =>
          preload(media(`${name}-${kind}`)),
        ),
      );
      if (request !== sceneRequest) return;
      applyImage(
        $("scene-input"),
        media(`${name}-input`),
        `${scene.label}: complete input scene.`,
        scene.size,
      );
      applyImage($("token-context"), media(`${name}-input`), "", scene.size);
      applyImage(
        $("scene-tokens"),
        media(`${name}-tokens`),
        `${scene.label}: token usage across Transformer layers.`,
        scene.size,
      );
      applyImage(
        $("scene-prediction"),
        media(`${name}-prediction`),
        `${scene.label}: SViT detection and instance-segmentation predictions.`,
        scene.size,
      );
      currentScene = name;
    } catch {
      if (request === sceneRequest) event.target.value = currentScene;
    } finally {
      if (request === sceneRequest)
        $("visual-triptych").setAttribute("aria-busy", "false");
    }
  });
  $("heatmap-opacity").addEventListener("input", (event) => {
    const value = Number(event.target.value);
    document
      .querySelector(".token-frame")
      .style.setProperty("--heatmap-opacity", value / 100);
    $("opacity-value").value = `${value}%`;
  });
  let reactivationRequest = 0;
  let currentReactivation = "football";
  $("reactivation-select").addEventListener("change", async (event) => {
    const name = event.target.value;
    if (!["football", "office"].includes(name)) return;
    const request = ++reactivationRequest;
    $("reactivation-pair").setAttribute("aria-busy", "true");
    try {
      await Promise.all(
        ["input", "reactivation"].map((kind) =>
          preload(media(`${name}-${kind}`)),
        ),
      );
      if (request !== reactivationRequest) return;
      applyImage(
        $("reactivation-input"),
        media(`${name}-input`),
        `Complete ${name} input scene.`,
        [492, 364],
      );
      applyImage(
        $("reactivation-pruned"),
        media(`${name}-reactivation`),
        `Token pruning in the same ${name} scene. Cyan tokens will reactivate later; white tokens will not.`,
        [492, 364],
      );
      currentReactivation = name;
    } catch {
      if (request === reactivationRequest)
        event.target.value = currentReactivation;
    } finally {
      if (request === reactivationRequest)
        $("reactivation-pair").setAttribute("aria-busy", "false");
    }
  });
  // WACV 2024, Table 5: box AP, mask AP, whole-network FPS, backbone FPS.
  const results = {
    tiny: [
      [45.8, 40.9, 18.45, 27.61],
      [44.5, 39.8, 22.76, 35.8],
      [44.8, 39.9, 22.12, 34.33],
      [43.9, 39.1, 16.41, 22.38],
      [41.2, 37.1, 23.1, 36.45],
      [44.1, 39.3, 22.95, 36.38],
      [45.5, 40.7, 22.32, 34.69],
    ],
    small: [
      [48.5, 42.8, 11.7, 14.2],
      [47.1, 41.6, 15.34, 20.01],
      [47.2, 41.6, 15.48, 20.26],
      [46.7, 41.1, 11.63, 14.24],
      null,
      [47.2, 41.6, 15.66, 20.79],
      [48.2, 42.5, 15.75, 20.78],
    ],
  };
  document.querySelectorAll('input[name="scale"]').forEach((input) =>
    input.addEventListener("change", (event) => {
      const scale = event.target.value;
      if (!results[scale]) return;
      $("scale-name").textContent = scale === "tiny" ? "Tiny" : "Small";
      $("results-summary").textContent =
        scale === "tiny"
          ? "SViT-T retains 45.5 box AP and 40.7 mask AP, while improving whole-network throughput from 18.45 to 22.32 images per second."
          : "SViT-S retains 48.2 box AP and 42.5 mask AP, while improving whole-network throughput from 11.70 to 15.75 images per second.";
      $("results-table")
        .querySelectorAll("tbody tr")
        .forEach((row, index) => {
          row.querySelectorAll("td").forEach((cell) => cell.remove());
          const values = results[scale][index];
          if (!values) {
            const cell = row.insertCell();
            cell.colSpan = 4;
            cell.className = "nonconvergence";
            cell.textContent = "Training did not converge";
          } else {
            values.forEach((value, column) => {
              row.insertCell().textContent = value.toFixed(column < 2 ? 1 : 2);
            });
          }
        });
    }),
  );
  $("video-play").addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    const iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube-nocookie.com/embed/LlMIyEG8wcs?autoplay=1&rel=0";
    iframe.title = "SViT: Revisiting Token Pruning - video presentation";
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    $("video-player").replaceChildren(iframe);
    iframe.focus();
  });
  $("copy-citation").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("bibtex").textContent);
      $("copy-status").textContent = "BibTeX copied.";
    } catch {
      const range = document.createRange();
      range.selectNodeContents($("bibtex"));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      $("copy-status").textContent =
        "Clipboard unavailable. Citation selected.";
    }
  });
})();
