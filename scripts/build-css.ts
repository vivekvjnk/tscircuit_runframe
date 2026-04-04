import fs from "node:fs"
import postcss from "postcss"
import tailwindcss from "tailwindcss"
import autoprefixer from "autoprefixer"
import cssnano from "cssnano"
import tailwindConfig from "../tailwind.config"

async function buildCss() {
  // Read your base CSS file with @tailwind directives
  const css = `
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
  :root {
    --radius: 0.5rem
  }
}

@layer utilities {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
  .rf-markdown h1 { @apply rf-text-xl rf-font-bold rf-mb-4 rf-mt-2; }
  .rf-markdown h2 { @apply rf-text-lg rf-font-bold rf-mb-3 rf-mt-2; }
  .rf-markdown h3 { @apply rf-text-base rf-font-bold rf-mb-2 rf-mt-2; }
  .rf-markdown p { @apply rf-mb-2 rf-leading-relaxed; }
  .rf-markdown ul { @apply rf-list-disc rf-pl-5 rf-mb-3; }
  .rf-markdown ol { @apply rf-list-decimal rf-pl-5 rf-mb-3; }
  .rf-markdown li { @apply rf-mb-1; }
  .rf-markdown code { @apply rf-bg-gray-800/10 rf-px-1 rf-py-0.5 rf-rounded rf-font-mono rf-text-[0.9em]; }
  .rf-markdown pre { @apply rf-bg-gray-900 rf-text-gray-100 rf-p-3 rf-rounded-lg rf-overflow-x-auto rf-mb-3 rf-mt-1 rf-font-mono rf-text-xs; }
  .rf-markdown blockquote { @apply rf-border-l-4 rf-border-gray-200 rf-pl-4 rf-italic rf-my-2; }
  .rf-markdown strong { @apply rf-font-bold; }
  .rf-markdown em { @apply rf-italic; }
}
`

  const result = await postcss([
    tailwindcss(tailwindConfig),
    autoprefixer,
    cssnano,
  ]).process(css, {
    from: undefined,
  })

  fs.writeFileSync(
    "./lib/hooks/styles.generated.ts",
    `export default ${JSON.stringify(result.css)}`,
  )
}

buildCss()
