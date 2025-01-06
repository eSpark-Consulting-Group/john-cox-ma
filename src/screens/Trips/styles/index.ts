import {StyleSheet} from 'react-native';

/**
 * Layout constants for consistent spacing and sizing
 */
const LAYOUT = {
  screenPadding: '90%',
  contentWidth: '70%',
  inputWidth: '50%',
  buttonWidth: 130,
  rowGap: 5,
  cardHeight: 50,
  confirmationWidth: '85%',
} as const;

/**
 * Common style mixins for reusable patterns
 */
const mixins = {
  centerContent: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceEvenly: {
    justifyContent: 'space-evenly',
  },
} as const;

/**
 * Application styles organized by component/section
 */
export const styles = StyleSheet.create({
  // Screen layout styles
  screen: {
    ...mixins.centerContent,
    flexGrow: 1,
  },

  // Title section styles
  titleContainer: {
    width: LAYOUT.screenPadding,
  },
  title: {
    alignSelf: 'flex-start',
    paddingBottom: 10,
  },

  // Input and control styles
  switchContainer: {
    ...mixins.row,
    ...mixins.centerContent,
    ...mixins.spaceEvenly,
    width: LAYOUT.inputWidth,
    gap: 2,
  },
  inputContainer: {
    ...mixins.centerContent,
    width: LAYOUT.inputWidth,
    paddingHorizontal: 15,
    gap: LAYOUT.rowGap,
  },

  // Button styles
  button: {
    width: LAYOUT.buttonWidth,
    alignSelf: 'center',
  },
  buttonRow: {
    ...mixins.row,
    ...mixins.centerContent,
    ...mixins.spaceEvenly,
    width: '100%',
  },
  rowButtons: {
    fontSize: 18,
    paddingHorizontal: 10,
  },

  // Confirmation section styles
  confirmation: {
    ...mixins.centerContent,
    width: LAYOUT.confirmationWidth,
    textAlign: 'center',
  },
  confirmationMessage: {
    textAlign: 'center',
    paddingBottom: 5,
    lineHeight: 30,
  },

  // Content container styles
  inner: {
    width: LAYOUT.contentWidth,
    ...mixins.centerContent,
    gap: 20,
  },

  // Card styles
  card2: {
    ...mixins.row,
    width: '100%',
  },
  innercard2: {
    ...mixins.spaceBetween,
    flexGrow: 1,
    height: LAYOUT.cardHeight,
  },
  boxes: {
    ...mixins.row,
    ...mixins.centerContent,
    justifyContent: 'flex-end',
    gap: LAYOUT.rowGap,
  },
});
