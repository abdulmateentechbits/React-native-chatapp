// TODO: write documentation about fonts and typography along with guides on how to add custom fonts in own
// markdown file and add links from here

import { Platform } from "react-native"


import {
  Roboto_100Thin as robotoThin,
  Roboto_100Thin_Italic as robotoThinItalic,
  Roboto_300Light as robotoLight,
  Roboto_300Light_Italic as robotoLightItalic,
  Roboto_400Regular as robotoRegular,
  Roboto_400Regular_Italic as robotoRegularItalic,
  Roboto_500Medium as robotoMedium,
  Roboto_500Medium_Italic as robotoMediumItalic,
  Roboto_700Bold as robotoBold,
  Roboto_700Bold_Italic as robotoBoldItalic,
  Roboto_900Black as robotoBlack,
  Roboto_900Black_Italic as robotoBlackItalic,
} from '@expo-google-fonts/roboto';

export const customFontsToLoad = {
  robotoThin,
  robotoThinItalic,
  robotoLight,
  robotoLightItalic,
  robotoRegular,
  robotoRegularItalic,
  robotoMedium,
  robotoMediumItalic,
  robotoBold,
  robotoBoldItalic,
  robotoBlack,
  robotoBlackItalic,
}

const fonts = {
  roboto: {
    // Cross-platform Google font.
    thin: "robotoThin",
    thinItalic: "robotoThinItalic",
    light: "robotoLight",
    lightItalic: "robotoLightItalic",
    normal: "robotoRegular",
    normalItalic: "robotoRegularItalic",
    medium: "robotoMedium",
    mediumItalic: "robotoMediumItalic",
    bold: "robotoBold",
    boldItalic: "robotoBoldItalic",
    black: "robotoBlack",
    blackItalic: "robotoBlackItalic",
  },
  helveticaNeue: {
    // iOS only font.
    thin: "HelveticaNeue-Thin",
    light: "HelveticaNeue-Light",
    normal: "Helvetica Neue",
    medium: "HelveticaNeue-Medium",
  },
  courier: {
    // iOS only font.
    normal: "Courier",
  },
  sansSerif: {
    // Android only font.
    thin: "sans-serif-thin",
    light: "sans-serif-light",
    normal: "sans-serif",
    medium: "sans-serif-medium",
  },
  monospace: {
    // Android only font.
    normal: "monospace",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  fonts,
  /**
   * The primary font. Used in most places.
   */
  primary: fonts.roboto,
  /**
   * An alternate font used for perhaps titles and stuff.
   */
  secondary: Platform.select({ ios: fonts.helveticaNeue, android: fonts.sansSerif }),
  /**
   * Lets get fancy with a monospace font!
   */
  code: Platform.select({ ios: fonts.courier, android: fonts.monospace }),
}
