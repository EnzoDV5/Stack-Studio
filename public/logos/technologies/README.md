# Technology logos

These are locally served, unmodified brand SVGs from maintained icon collections,
rendered as monochrome CSS masks. No icon font, runtime icon package or external
image service is needed. The SVG dimensions are reserved before loading.

| Assets                     | Pinned source                                                                                                                               | Licence                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| All except the three below | [Simple Icons 16.32.0](https://github.com/simple-icons/simple-icons/tree/16.32.0/icons)                                                     | CC0-1.0; see LICENSE.simple-icons.txt                  |
| `css3.svg`, `openai.svg`   | [Simple Icons 14.15.0](https://github.com/simple-icons/simple-icons/tree/14.15.0/icons)                                                     | CC0-1.0; these marks are absent from the newer release |
| `framermotion.svg`         | [Devicon 2.17.0, original Framer Motion SVG](https://github.com/devicons/devicon/blob/v2.17.0/icons/framermotion/framermotion-original.svg) | MIT; see LICENSE.devicon.txt                           |

Brand trademarks belong to their respective owners. These identify development
tools and capabilities, not partnerships or certifications. React Native uses the
React mark. SQL is a language standard without one official brand logo and is
therefore a text-only entry.

Edit `src/data/technologies.ts` to add, remove, label or categorise technologies.
Each entry has a stable ID, primary category followed by any additional categories,
a capability description and an optional local SVG path. Primary categories split
the two rows without duplicating entries. General capabilities such as REST APIs,
authentication, SQL/NoSQL, CI/CD and AI workflows are described on the relevant tools.

To fetch the selected, pinned assets again, run `node scripts/sync-technology-logos.mjs`.
For a new brand, use its Simple Icons filename or add an explicit source mapping
in that script. Keep version pins and this provenance record in sync.
