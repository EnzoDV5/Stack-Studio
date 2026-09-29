# iPhone 17 Pro model

`iphone-17-pro.glb`: a free iPhone 17 Pro model downloaded from Sketchfab (exported from
Blender, textures embedded). It is a source file for `scripts/devices`, which renders the phone turn
on the Services page into `public/media/phone`. It is **not** deployed: nothing in `assets/`
is served, and the site never loads a 3D model.

`textures/` holds the loose copies of the textures that came with the download. They are
already inside the `.glb`, so the folder is gitignored and only kept locally.

## Licence: check before launch

Free Sketchfab downloads still carry a licence, most often **CC Attribution (CC BY 4.0)**,
which requires a visible credit (author, model name and a link) wherever the renders are used.
The author and licence haven't been recorded yet:

- Model page: TODO
- Author: TODO
- Licence: TODO

If it is CC BY, add the credit to the site (the Privacy page or the footer) before launch.

## What the render changes

`scripts/devices/phone-scene.js` swaps the wallpaper on the `OLED` material for a site capture (with an
iOS status bar), thins the dark `Glass` layer so the unlit screen shows true colours, and
recolours the body (`Anodized aluminum`), back glass (`Frosted glass`) and back accents
(`Glass tint`) to Cosmic Orange. The model file itself is unchanged.
