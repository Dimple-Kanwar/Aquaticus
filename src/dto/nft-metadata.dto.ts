export class NFTAttribute {
  trait_type!: string;
  value!: string | number | boolean;
}
  
export class NFTMetadata {
  name!: string;
  description!: string;
  image?: string;
  attributes!: NFTAttribute[];
}
  