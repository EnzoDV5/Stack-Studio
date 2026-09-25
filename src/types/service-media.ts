import type { ImageAsset, VideoAsset } from './media'

export interface ServiceMediaItem {
  id: string
  image: ImageAsset
  video?: VideoAsset
}
