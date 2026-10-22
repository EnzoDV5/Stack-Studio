/** Shared copy for failures visitors can recover from. */
export const feedbackCopy = {
  label: 'Something went wrong',
  dismiss: 'Dismiss notification',
  downloadFailure: {
    title: 'Your PDF couldn’t be downloaded.',
    body: 'Your brief is still available. Please try the download again in a moment.',
  },
} as const
