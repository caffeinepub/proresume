# ProResume

## Current State
The app requires users to sign in with Internet Identity before paying and downloading. The download paywall dialog blocks payment if the user is not logged in. There's a sign-in banner in the editor and a sign-out button in the preview topbar. Backend `recordPayment` is called after Razorpay payment to verify via authenticated canister call.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `BuilderPage.tsx`: Remove all Internet Identity auth logic (`useInternetIdentity`, `useIsPaid`, `useGetResume`, `useSaveResume`). Remove sign-in banner in editor panel. Remove sign-out button from preview topbar. Simplify download flow: payment via Razorpay, on success immediately trigger `window.print()` without backend verification.
- `DownloadPaywallDialog`: Remove `isLoggedIn`, `isLoggingIn`, `onLogin` props. Remove sign-in prompt UI. Allow anyone to pay and download directly.
- `PaywallScreen.tsx`: Remove sign-out button (no longer needed).

### Remove
- Sign-in banner in editor
- Sign-out button in topbar
- All `useInternetIdentity` usage
- All backend payment recording (no auth = no canister identity = use client-side payment confirmation only)
- `useIsPaid`, `useSaveResume`, `useGetResume` calls in BuilderPage

## Implementation Plan
1. Rewrite `BuilderPage.tsx`: remove auth hooks, simplify download dialog props, keep `paidLocally` state for within-session repeat downloads.
2. Simplify `DownloadPaywallDialog` inside BuilderPage: Razorpay → success → `onPaymentSuccess()` directly, no backend call.
3. Remove sign-in UI from editor and topbar.
