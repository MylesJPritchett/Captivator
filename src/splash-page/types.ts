/** A CSS hex colour, e.g. "#1e3a8a". */
export type Colour = string;

/** An in-memory object URL for an uploaded image (ADR-0001), e.g. "blob:…". */
export type ImageUrl = string;

export type Background = {
  /** Which value shows. The colour always sits underneath as a fallback. */
  kind: "colour" | "image";
  colour: Colour;
  /** The uploaded Background image, if any. */
  imageUrl?: ImageUrl;
};

export type TextBlock = {
  id: string;
  text: string;
  colour: Colour;
  /** Font size in px. */
  size: number;
};

export type InputFieldType = "Name" | "Email" | "Phone";

export type InputField = {
  type: InputFieldType;
};

export type ConnectButton = {
  backgroundColour: Colour;
  textColour: Colour;
};

/** The whole design: one plain, serialisable object (ADR-0002). */
export type SplashPage = {
  /** The uploaded Logo image, if any. */
  logo?: ImageUrl;
  background: Background;
  textBlocks: TextBlock[];
  inputFields: InputField[];
  connectButton: ConnectButton;
};
