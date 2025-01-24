export const clerkTheme = {
  layout: {
    socialButtonsVariant: "blockButton",
    socialButtonsPlacement: "bottom",
    privacyPageUrl: "https://clerk.dev/privacy",
    termsPageUrl: "https://clerk.dev/terms",
  },
  variables: {
    colorPrimary: "#6366f1",
    colorTextOnPrimaryBackground: "#ffffff",
    colorBackground: "#ffffff",
    colorInputBackground: "#f9fafb",
    colorInputText: "#111827",
    borderRadius: "0.75rem",
  },
  elements: {
    card: "shadow-2xl border border-gray-100",
    headerTitle: "text-2xl font-bold text-gray-900",
    headerSubtitle: "text-gray-600",
    formButtonPrimary: 
      "bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-200 ease-in-out",
    formFieldInput: 
      "rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500",
    footerActionLink: "text-indigo-600 hover:text-indigo-700",
    identityPreviewText: "text-gray-700",
    formFieldLabel: "text-gray-700 font-medium",
    dividerLine: "bg-gray-200",
    dividerText: "text-gray-500 bg-white px-2",
    formFieldError: "text-red-500 text-sm",
    socialButtonsIconButton: 
      "border border-gray-300 hover:bg-gray-50 transition-all duration-200",
  },
};
