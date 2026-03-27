import type { Dictionary } from "./ru";

const en: Dictionary = {
  meta: {
    siteTitle: "Korvex — Private Connection. No Traces.",
    siteDescription:
      "Fast private connection for iOS, Android, and Smart TV. European servers, 24/7 monitoring.",
  },

  nav: {
    features: "Features",
    pricing: "Pricing",
    support: "Support",
    toggleMenu: "Toggle menu",
    menu: "Menu",
    tv: "Smart TV",
  },

  hero: {
    badge: "Servers online — ping from 11ms",
    title: "Online Freedom.",
    titleHighlight: "No Traces.",
    subtitle:
      "Fast private connection with European servers. No logs, no registration. iOS, Android, and Smart TV.",
  },

  features: {
    title: "Why Korvex?",
    subtitle: "Everything you need for a secure internet",
    speed: {
      title: "High Speed",
      desc: "WireGuard protocol for maximum speed without quality loss.",
    },
    anonymity: {
      title: "Complete Anonymity",
      desc: "Zero-logging policy. We do not store any data about your activity.",
    },
    noReg: {
      title: "No Registration",
      desc: "No accounts, no passwords. Get your key and connect instantly.",
    },
    smartTv: {
      title: "Smart TV",
      desc: "Built-in support for Android TV, Apple TV, and Samsung TV.",
    },
    euServers: {
      title: "EU Servers",
      desc: "Netherlands, Germany, Finland, Sweden — low ping and high stability.",
    },
    monitoring: {
      title: "24/7 Monitoring",
      desc: "Automatic server monitoring and instant problem alerts.",
    },
  },

  pricing: {
    title: "Pricing",
    subtitle: "Start with a free trial",
    pageTitle: "Choose a plan",
    pageSubtitle:
      "All plans include a free trial. Cancel anytime.",
    recommended: "Recommended",
    start: "Get Started",
    storePayment: "Payment available through app stores:",
    autoRenew:
      "Subscriptions through App Store and Google Play renew automatically. Manage your subscription in device settings.",
    faqTitle: "Frequently Asked Questions",
    faq: [
      {
        q: "Can I cancel my subscription?",
        a: "Yes, you can cancel your subscription at any time through App Store, Google Play, or by contacting support.",
      },
      {
        q: "How does the trial period work?",
        a: "You get full access to all features for free. You are only charged after the trial period ends.",
      },
      {
        q: "What payment methods are available?",
        a: "Apple Pay, Google Pay, bank cards via App Store / Google Play, and Paddle for web payments.",
      },
      {
        q: "How many devices?",
        a: "From 5 to 10 devices simultaneously depending on your plan.",
      },
    ],
    plans: {
      weekly: {
        name: "Weekly",
        period: "week",
        trial: "3 days free",
      },
      monthly: {
        name: "Monthly",
        period: "month",
        trial: "7 days free",
      },
      annual: {
        name: "Annual",
        period: "year",
        trial: "7 days free",
      },
    },
    downloadTitle: "Download the app",
    downloadSubtitle: "Payment is handled securely inside the app via App Store or Google Play. No registration required.",
    storeNote: "Manage your subscription in App Store / Google Play settings.",
    planFeatures: {
      allServers: "All EU servers",
      devices5: "Up to 5 devices",
      devices10: "Up to 10 devices",
      wireguard: "WireGuard protocol",
      support247: "24/7 Support",
      prioritySupport: "Priority support",
      savings65: "Save 65%",
    },
  },

  steps: {
    title: "How It Works",
    items: [
      {
        title: "Choose a plan",
        desc: "Weekly, monthly, or annual — with a free trial period.",
      },
      {
        title: "Download the app",
        desc: "Available for iOS, Android, and Smart TV.",
      },
      {
        title: "Connect",
        desc: "One tap — and you're protected. No setup or registration required.",
      },
    ],
  },

  telegram: {
    title: "Our Telegram Bot",
    desc: "Manage your subscription, get support, and configure your connection through our bot.",
    cta: "Open @KorvexVPN_Bot",
  },

  footer: {
    desc: "Fast and secure private connection.",
    navTitle: "Navigation",
    pricing: "Pricing",
    activation: "Key Activation",
    support: "Support",
    legalTitle: "Legal",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    copyright: "Korvex. All rights reserved.",
    smartTv: "Smart TV",
  },

  ios: {
    metaTitle: "Korvex for iOS — Download from App Store",
    metaDesc: "Download Korvex for iPhone and iPad from the App Store.",
    header: "Korvex for iOS",
    downloadPrompt:
      "Download the app from the App Store and connect in seconds.",
    invalidKey: "Invalid key. Please contact support.",
    contactSupport: "Contact Support",
    hasKey: "Already have a key?",
    activate: "Activate",
  },

  android: {
    metaTitle: "Korvex for Android — Download from Google Play",
    metaDesc: "Download Korvex for Android from Google Play.",
    header: "Korvex for Android",
    downloadPrompt:
      "Download the app from Google Play and connect in seconds.",
    invalidKey: "Invalid key. Please contact support.",
    contactSupport: "Contact Support",
    hasKey: "Already have a key?",
    activate: "Activate",
  },

  platformFeatures: [
    "WireGuard protocol — maximum speed",
    "Zero logging — complete anonymity",
    "European servers with ping from 11ms",
  ],

  tv: {
    metaTitle: "Korvex for Smart TV — Android TV, Apple TV, Samsung TV",
    metaDesc:
      "Set up Korvex on your Smart TV. Support for Android TV, Apple TV, and Samsung TV.",
    header: "Korvex for Smart TV",
    subtitle: "Protect your TV and enjoy secure streaming.",
    quickSetup: "Quick setup on Android TV",
    scanQR: "Scan the QR code with your phone camera",
    androidTv: "Android TV",
    appleTv: "Apple TV",
    otherTv: "Xiaomi / Samsung / Other",
    androidSteps: [
      "Open Google Play on your Android TV",
      "Open the download link on your phone and install the app",
      "Open the app and enter your activation key",
      "Select a server and tap \"Connect\"",
    ],
    appleSteps: [
      "Open the App Store on Apple TV",
      "Open the download link on your phone and install",
      "Enter the activation key from your email",
      "Connect to a server",
    ],
    otherSteps: [
      "Configure your router or use Smart DNS",
      "Go to the network settings on your TV",
      "Enter the DNS server from your Korvex dashboard",
      "Restart your TV — done!",
    ],
    needHelp: "Need help with setup?",
    contactSupport: "Contact Support",
  },

  activate: {
    metaTitle: "Key Activation — Korvex",
    metaDesc: "Enter your activation key to connect to Korvex.",
    header: "Key Activation",
    subtitle: "Enter the 32-character activation key you received after purchase.",
    faqTitle: "Frequently Asked Questions",
    faq: [
      {
        id: "where-key",
        q: "Where can I find my key?",
        a: "The activation key is sent to your email immediately after payment through Paddle. Check your Spam folder if you haven't received it.",
      },
      {
        id: "no-app",
        q: "What if I don't have the app?",
        a: "First, download Korvex from the App Store (iOS) or Google Play (Android). After installation, return to this page and enter your key — the app will open automatically.",
      },
      {
        id: "key-not-working",
        q: "Key not working?",
        a: "Make sure you are entering all 32 characters without spaces. If the key is still not accepted, it may have been used previously. Contact support via Telegram for assistance.",
      },
    ],
    noAnswer: "Didn't find an answer?",
    contactSupport: "Contact Support",
  },

  offline: {
    title: "No Connection",
    desc: "Check your internet connection and try again. Some data may be available from cache.",
    retry: "Try Again",
    cached: "Page saved from app cache",
  },

  activationFlow: {
    invalidKey: "Invalid activation key format.",
    processingError: "Failed to process the activation key.",
    step1Title: "Download the app",
    step1Sub: "If you don't have Korvex yet",
    downloadFrom: "Download from",
    step2Title: "Activate your subscription",
    step2Sub:
      "Tap the button below to open the app and activate your key",
    openAndActivate: "Open Korvex and activate",
    yourKey: "Your key",
  },

  activationForm: {
    label: "Activation Key",
    placeholder: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    invalidFormat: "Invalid format. Expected 32 characters (0-9, a-f).",
    valid: "Key is valid",
    hexChars: "32 hex characters",
    activateBtn: "Activate",
    processingError:
      "Failed to process the key. Check the format and try again.",
    scanQR: "Scan the QR code with your phone camera",
    orCopyKey: "Or copy the key and paste it in the app",
  },

  platformGuard: {
    usingPlatform: "It looks like you're using",
    switchQ: "Switch?",
    close: "Close",
  },

  qrCode: {
    error: "Failed to generate QR code",
  },

  common: {
    appStore: "App Store",
    googlePlay: "Google Play",
    telegram: "Telegram",
    telegramBot: "Telegram Bot",
  },
};

export default en;
