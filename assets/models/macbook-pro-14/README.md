# MacBook Pro 14" model

`macbook-pro-14.glb`: a MacBook Pro 14-inch (M5) model downloaded from Sketchfab (exported from
Blender, textures embedded). It is a source file for `scripts/devices`, which renders the laptop
opening on the Services page ("Desktop software") into `public/media/laptop`. It is **not**
deployed: nothing in `assets/` is served, and the site never loads a 3D model.

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

The export scrambles part names, so `scripts/devices/laptop-scene.js` names the ones it needs:
the display material (`HlQwFCAPWzetDQy`, the wallpaper) is swapped for an app screen, the lid
group (`RcexTyyhpuJYATQ`) is re-hung on a hinge along the top of the base (`EhCmdLAMoLoXcIA`) so
it can open from shut (the model comes open about 112°), and the display wakes as the lid
rises. The model file itself is unchanged.
