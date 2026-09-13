# SViT Project Website

Project page for **Revisiting Token Pruning for Object Detection and Instance
Segmentation**, WACV 2024, pp. 2658-2668.

Live URL: https://kaikai23.github.io/SViT-project-page/index.html

## Structure

- `index.html`: paper, authors, visualizations, results, resources, and citation.
- `static/css/svit.css`: standalone responsive styles; reuses the homepage's
  locally hosted Source Sans 3 and Crimson Pro fonts.
- `static/js/svit.js`: scene switching, opacity control, model-scale comparison,
  citation copying, and click-to-load YouTube presentation.
- `static/media/`: crops of published figures. Provenance is in `SOURCES.txt`.
- `static/js/lucide.min.js`: locally hosted Lucide 0.468.0 icons.

The page is static HTML and does not require Jekyll or a JavaScript framework.
It can be previewed through any local HTTP server serving the repository root.
It is also included in the parent site's existing GitHub Pages deployment.
With JavaScript disabled, the default figures, Small-model table, paper resources,
video link, and full citation remain available.

## Scientific Content

The token-usage heatmaps count how many Transformer layers process each token.
They are not per-layer binary pruning masks. The separate reactivation examples
come from Figure 5b: cyan marks currently pruned tokens reused later, and white
marks tokens not reactivated later.

Both result-table variants are transcribed from Table 5 of the published WACV
paper. Throughput was measured with batch size 1 on a single NVIDIA A100.
The visualizations are published model outputs, not browser-side inference.

## Attribution

The earlier page used the Academic Project Page Template by Eliahu Horwitz,
based on Nerfies. This redesigned website retains those credits and the
CC BY-SA 4.0 website-design license. Research figures and text are separate
content and remain with their respective authors. Lucide uses the ISC license;
the bundled fonts use the SIL Open Font License (see `../assets/fonts/`).

Legacy template assets are retained but not loaded by the new page.
