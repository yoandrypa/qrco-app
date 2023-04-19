const freeDynamicQRs = process.env.FREE_DYNAMIC_QRS;

export const free = {
  title: "Free",
  description: "Upgrade to a paid plan for additional features and support",
  buttonText: "FREE",
  planType: "free",
  legend: "Limited set of core features",
  highlighted: false,
  priceAmount: "$0",
  features: {
    // [ 0 is Not-Allow ] and [ -1 is Unlimited ]
    upToDynamicQR: freeDynamicQRs,    // Up to x dynamic QR code
    amountByAdditionalDynamicQR: 0,   // No additional Dynamic QR codes are allowed
    upToPreGeneratedQR: -1,           // Unlimited pre-generated QRs
    upToMicroSite: 1,                 // Up to 1 micro-site (mobile-friendly landing page)
    upToStaticQR: -1,                 // Unlimited static QR codes
    upToScans: -1,                    // Unlimited scans
    allowQRCodesDesign: true,         // QR codes design customization and edition
    allowEditDynamicQRContent: true,  // Dynamic QR codes content edition
    allowEditMicroSite: true,         // Micro-sites appearance customization and edition
  },
};

export const basic = {
  title: "Basic",
  description: "For small businesses/freelancers at an affordable price",
  buttonText: "SUBSCRIBE",
  planType: "basic",
  legend: "A good choice to get started",
  highlighted: false,
  priceAmount: "$9.00",
  features: {
    // [ 0 is Not-Allow ] and [ -1 is Unlimited ]
    upToDynamicQR: 50,                // Up to 50 dynamic QR code
    amountByAdditionalDynamicQR: 1,   // $1 per additional Dynamic QR
    upToPreGeneratedQR: -1,           // Unlimited pre-generated QRs
    upToMicroSite: 50,                // Up to 50 micro-site (mobile-friendly landing page)
    upToStaticQR: -1,                 // Unlimited static QR codes
    upToScans: -1,                    // Unlimited scans
    allowQRCodesDesign: true,         // QR codes design customization and edition
    allowEditDynamicQRContent: true,  // Dynamic QR codes content edition
    allowEditMicroSite: true,         // Micro-sites appearance customization and edition
  },
};

// export const basicAnnual = {
//   title: "Basic",
//   description: "A good choice to get started and save some cash.",
//   buttonText: "SUBSCRIBE",
//   planType: "basicAnnual",
//   legend: "Save two months",
//   highlighted: false,
//   priceAmount: "$90.00",
//   features: {
//     // [ 0 is Not-Allow ] and [ -1 is Unlimited ]
//     upToDynamicQR: 50,                // Up to 50 dynamic QR code
//     amountByAdditionalDynamicQR: 1,   // $1 per additional Dynamic QR
//     upToPreGeneratedQR: -1,           // Unlimited pre-generated QRs
//     upToMicroSite: 50,                // Up to 50 micro-site (mobile-friendly landing page)
//     upToStaticQR: -1,                 // Unlimited static QR codes
//     upToScans: -1,                    // Unlimited scans
//     allowQRCodesDesign: true,         // QR codes design customization and edition
//     allowEditDynamicQRContent: true,  // Dynamic QR codes content edition
//     allowEditMicroSite: true,         // Micro-sites appearance customization and edition
//   },
// };

export const business = {
  title: "Business",
  description: "For medium businesses who need a larger solution",
  buttonText: "SUBSCRIBE",
  planType: "business",
  legend: "Have plenty of room to grow.",
  highlighted: true,
  priceAmount: "$15.00",
  features: {
    // [ 0 is Not-Allow ] and [ -1 is Unlimited ]
    upToDynamicQR: 100,               // Up to 100 dynamic QR code
    amountByAdditionalDynamicQR: 0.9, // $0.90 per additional Dynamic QR
    upToPreGeneratedQR: -1,           // Unlimited pre-generated QRs
    upToMicroSite: 100,               // Up to 100 micro-site (mobile-friendly landing page)
    upToStaticQR: -1,                 // Unlimited static QR codes
    upToScans: -1,                    // Unlimited scans
    allowQRCodesDesign: true,         // QR codes design customization and edition
    allowEditDynamicQRContent: true,  // Dynamic QR codes content edition
    allowEditMicroSite: true,         // Micro-sites appearance customization and edition
  },
};

// export const businessAnnual = {
//   title: "Business",
//   description: "Receive a fair discount with our annual plan.",
//   buttonText: "SUBSCRIBE",
//   planType: "businessAnnual",
//   legend: "Save three months",
//   highlighted: true,
//   priceAmount: "$135.OO",
//   features: {
//     // [ 0 is Not-Allow ] and [ -1 is Unlimited ]
//     upToDynamicQR: 100,               // Up to 100 dynamic QR code
//     amountByAdditionalDynamicQR: 0.9, // $0.90 per additional Dynamic QR
//     upToPreGeneratedQR: -1,           // Unlimited pre-generated QRs
//     upToMicroSite: 100,               // Up to 100 micro-site (mobile-friendly landing page)
//     upToStaticQR: -1,                 // Unlimited static QR codes
//     upToScans: -1,                    // Unlimited scans
//     allowQRCodesDesign: true,         // QR codes design customization and edition
//     allowEditDynamicQRContent: true,  // Dynamic QR codes content edition
//     allowEditMicroSite: true,         // Micro-sites appearance customization and edition
//   },
// };

export const premium = {
  title: "Premium",
  description: "The definitive plan. You're completely covered.",
  buttonText: "SUBSCRIBE",
  planType: "premium",
  legend: "Best price",
  highlighted: true,
  priceAmount: "$45.00",
  features: {
    // [ 0 is Not-Allow ] and [ -1 is Unlimited ]
    upToDynamicQR: 500,               // Up to 500 dynamic QR code
    amountByAdditionalDynamicQR: 0.8, // $0.80 per additional Dynamic QR
    upToPreGeneratedQR: -1,           // Unlimited pre-generated QRs
    upToMicroSite: 500,               // Up to 500 micro-site (mobile-friendly landing page)
    upToStaticQR: -1,                 // Unlimited static QR codes
    upToScans: -1,                    // Unlimited scans
    allowQRCodesDesign: true,         // QR codes design customization and edition
    allowEditDynamicQRContent: true,  // Dynamic QR codes content edition
    allowEditMicroSite: true,         // Micro-sites appearance customization and edition
  },
};

// export const premiumAnnual = {
//   title: "Premium",
//   description: "Receive a great discount and get completely covered.",
//   buttonText: "SUBSCRIBE",
//   planType: "premiumAnnual",
//   legend: "Save four months",
//   highlighted: true,
//   priceAmount: "$360.00",
//   features: {
//     // [ 0 is Not-Allow ] and [ -1 is Unlimited ]
//     upToDynamicQR: 500,               // Up to 500 dynamic QR code
//     amountByAdditionalDynamicQR: 0.8, // $0.80 per additional Dynamic QR
//     upToPreGeneratedQR: -1,           // Unlimited pre-generated QRs
//     upToMicroSite: 500,               // Up to 500 micro-site (mobile-friendly landing page)
//     upToStaticQR: -1,                 // Unlimited static QR codes
//     upToScans: -1,                    // Unlimited scans
//     allowQRCodesDesign: true,         // QR codes design customization and edition
//     allowEditDynamicQRContent: true,  // Dynamic QR codes content edition
//     allowEditMicroSite: true,         // Micro-sites appearance customization and edition
//   },
// };

export default { free, basic, business, premium };