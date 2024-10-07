import {
  linear,
  easeInQuad,
  easeOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInQuint,
  easeOutQuint,
} from "easing-utils";

export const easingFunctions: { [key: string]: (t: number) => number } = {
  easeInQuad,
  easeOutQuad,
  easeInCubic,
  easeOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInQuint,
  easeOutQuint,
  linear,
};
