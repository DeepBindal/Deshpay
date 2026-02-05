export const OFFERS = [
  { id: "o1", title: "⚡ Electricity Cashback", subtitle: "Get ₹50 cashback on bills above ₹499", code: "POWER50", tone: "from-indigo-500 to-violet-600" },
  { id: "o2", title: "📱 Mobile Recharge Deal", subtitle: "Flat 2% off via UPI", code: "UPI2", tone: "from-emerald-500 to-teal-600" },
  { id: "o3", title: "🚗 FASTag Bonus", subtitle: "₹25 off on first FASTag top-up", code: "TAG25", tone: "from-amber-500 to-orange-600" },
  { id: "o4", title: "💳 Credit Card Reward", subtitle: "Pay CC bill & earn points (demo)", code: "CCPAY", tone: "from-sky-500 to-blue-600" },
];

export const CATEGORIES = [
  { id: "electricity", label: "Electricity", mode: "bill", icon: "⚡", hint: "BSES, Tata Power, MSEDCL…" },
  { id: "mobile-prepaid", label: "Mobile Recharge", mode: "topup", icon: "📱", hint: "Airtel, Jio, Vi, BSNL" },
  { id: "mobile-postpaid", label: "Mobile Postpaid", mode: "bill", icon: "📄", hint: "Fetch & pay dues" },
  { id: "water", label: "Water", mode: "bill", icon: "🚰", hint: "DJB, BWSSB…" },
  { id: "dth", label: "DTH / Cable", mode: "topup", icon: "📺", hint: "Tata Play, Dish…" },
  { id: "gas", label: "Gas", mode: "bill", icon: "🔥", hint: "IGL, MGL…" },

  // more categories
  { id: "fastag", label: "FASTag", mode: "topup", icon: "🚗", hint: "ICICI, Paytm, Airtel…" },
  { id: "broadband", label: "Broadband", mode: "bill", icon: "📶", hint: "JioFiber, Airtel…" },
  { id: "credit-card", label: "Credit Card", mode: "bill", icon: "💳", hint: "HDFC, ICICI, SBI…" },
  { id: "ott", label: "OTT", mode: "topup", icon: "🎬", hint: "Netflix, Hotstar…" },
  { id: "loan-emi", label: "Loan EMI", mode: "bill", icon: "🏦", hint: "Pay EMIs quickly" },
  { id: "education", label: "Education Fees", mode: "bill", icon: "🎓", hint: "Schools & colleges" },
];

const mk = (id, name, region, tags = []) => ({ id, name, region, tags });

export const PROVIDERS = {
  electricity: [
    mk("tata-power-ddl", "Tata Power-DDL", "Delhi", ["Fast Bill Fetch"]),
    mk("bses-rajdhani", "BSES Rajdhani", "Delhi", ["Autopay Eligible"]),
    mk("msedcl", "MSEDCL (Mahavitaran)", "Maharashtra", ["High Volume"]),
    mk("bescom", "BESCOM", "Karnataka", ["Quick Pay"]),
  ],
  "mobile-prepaid": [
    mk("airtel", "Airtel", "India", ["5G Packs"]),
    mk("jio", "Jio", "India", ["Popular"]),
    mk("vi", "Vi", "India", ["Weekend Data"]),
    mk("bsnl", "BSNL", "India", ["Budget"]),
  ],
  "mobile-postpaid": [
    mk("airtel-post", "Airtel Postpaid", "India", ["Bill Fetch"]),
    mk("jio-post", "Jio Postpaid", "India", ["Bill PDF"]),
    mk("vi-post", "Vi Postpaid", "India", ["Due Reminders"]),
  ],
  water: [
    mk("djb", "Delhi Jal Board", "Delhi", ["Bill Fetch"]),
    mk("bwssb", "BWSSB", "Bengaluru", ["Instant"]),
    mk("mcgm", "BMC Water", "Mumbai", ["High Volume"]),
  ],
  dth: [
    mk("tata-play", "Tata Play", "India", ["Top Packs"]),
    mk("dish", "Dish TV", "India", ["Offers"]),
    mk("airtel-dth", "Airtel Digital TV", "India", ["Popular"]),
  ],
  gas: [
    mk("igl", "Indraprastha Gas (IGL)", "Delhi-NCR", ["Bill Fetch"]),
    mk("mgl", "Mahanagar Gas (MGL)", "Mumbai", ["Instant"]),
  ],
  fastag: [
    mk("paytm-fastag", "Paytm FASTag", "India", ["Instant Top-up"]),
    mk("icici-fastag", "ICICI FASTag", "India", ["Popular"]),
    mk("airtel-fastag", "Airtel Payments FASTag", "India", ["Easy Recharge"]),
  ],
  broadband: [
    mk("jiofiber", "JioFiber", "India", ["Bill Fetch"]),
    mk("airtel-xstream", "Airtel Xstream Fiber", "India", ["Quick Pay"]),
    mk("act", "ACT Fibernet", "India", ["Fast"]),
  ],
  "credit-card": [
    mk("hdfc-cc", "HDFC Credit Card", "India", ["Bill Fetch"]),
    mk("icici-cc", "ICICI Credit Card", "India", ["Rewards"]),
    mk("sbi-cc", "SBI Card", "India", ["Popular"]),
  ],
  ott: [
    mk("netflix", "Netflix", "India", ["Subscription"]),
    mk("hotstar", "Disney+ Hotstar", "India", ["Popular"]),
    mk("prime", "Amazon Prime", "India", ["Bundle"]),
  ],
  "loan-emi": [
    mk("hdfc-loan", "HDFC Loans", "India", ["EMI Pay"]),
    mk("bajaj-fin", "Bajaj Finance", "India", ["Quick Pay"]),
    mk("sbi-loan", "SBI Loans", "India", ["Due Alerts"]),
  ],
  education: [
    mk("school-pay", "School Fees (Demo)", "India", ["Fee Receipt"]),
    mk("college-pay", "College Fees (Demo)", "India", ["Instant"]),
  ],
};

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", hint: "PhonePe / GPay / BHIM" },
  { id: "card", label: "Card", hint: "Debit / Credit" },
  { id: "netbanking", label: "NetBanking", hint: "All major banks" },
  { id: "wallet", label: "Wallet", hint: "Paytm / Others" },
];

export const QUICK_AMOUNTS = [199, 239, 299, 399, 499, 599, 799, 999];
