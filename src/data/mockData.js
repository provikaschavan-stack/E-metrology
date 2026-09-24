// Mock dataset for E-Metrology SIH 26036 Prototype

export const SAMPLE_CERTIFICATES = {
  "LM-CERT-2026-00001": {
    certNo: "LM-CERT-2026-00001",
    instrumentId: "INS-2026-00001",
    instrumentName: "Electronic Weighing Scale (Class III)",
    category: "Non-Automatic Weighing Instruments (NAWI)",
    ownerName: "Bharat Retailers & Logistics Ltd.",
    location: "Market Yard, Gultekdi, Pune - 411037",
    manufacturer: "Demo Instruments Pvt. Ltd.",
    model: "DIGI-SCALE 50KG v2",
    serialNo: "WS-458921",
    maxCapacity: "50 kg",
    verificationDate: "26 Aug 2026",
    validUntil: "26 Aug 2027",
    status: "VALID",
    officer: "Rajesh Sharma (LMO-MH-042)",
    sealNumber: "GOV-SEAL-88912",
    standardsUsed: "Class F2 Standard Weights (OIML R111)",
    qrPayload: "https://emetrology.gov.in/verify/LM-CERT-2026-00001"
  },
  "LM-CERT-2026-00002": {
    certNo: "LM-CERT-2026-00002",
    instrumentId: "INS-2026-00084",
    instrumentName: "Fuel Dispensing Pump (Nozzle 1-4)",
    category: "Liquid Fuel Measuring Systems",
    ownerName: "Hindustan Petroleum Highway Outlet",
    location: "NH-48, Khed Shivapur, Maharashtra",
    manufacturer: "Gilbarco Veeder-Root",
    model: "Frontier MPD 4-Arm",
    serialNo: "FDP-992014",
    maxCapacity: "45 L/min",
    verificationDate: "10 Jul 2026",
    validUntil: "09 Jul 2027",
    status: "VALID",
    officer: "Priya Kulkarni (LMO-MH-019)",
    sealNumber: "GOV-SEAL-77142",
    standardsUsed: "5L/20L Proving Measures (NABL Traceable)",
    qrPayload: "https://emetrology.gov.in/verify/LM-CERT-2026-00002"
  },
  "LM-CERT-2025-00912": {
    certNo: "LM-CERT-2025-00912",
    instrumentId: "INS-2025-00411",
    instrumentName: "Jewellery Precision Balance (Class II)",
    category: "Precision High Accuracy Instruments",
    ownerName: "Shree Ganesh Gold & Silver Mart",
    location: "Zaveri Bazaar, Mumbai",
    manufacturer: "Mettler Toledo Inc.",
    model: "ME-204 Jewel",
    serialNo: "MT-338102",
    maxCapacity: "220 g (e=1mg)",
    verificationDate: "15 Jan 2025",
    validUntil: "14 Jan 2026",
    status: "EXPIRED",
    officer: "Anand Verma (LMO-MH-003)",
    sealNumber: "GOV-SEAL-33109",
    standardsUsed: "Class E2 Weight Set",
    qrPayload: "https://emetrology.gov.in/verify/LM-CERT-2025-00912"
  }
};

export const QUICK_ACTIONS = [
  {
    id: "apply",
    icon: "ClipboardList",
    title: "Apply for Verification",
    desc: "Submit fresh or periodic verification applications for commercial weighing and measuring instruments.",
    badge: "Fast Track",
    color: "blue"
  },
  {
    id: "verify",
    icon: "SearchCheck",
    title: "Verify Certificate",
    desc: "Instantly validate authenticity of legal metrology certificates using certificate number or QR code.",
    badge: "Instant",
    color: "emerald"
  },
  {
    id: "track",
    icon: "CalendarClock",
    title: "Track Application",
    desc: "Check real-time status of verification workflow, officer assignment, and scheduled inspection dates.",
    badge: "Live Status",
    color: "amber"
  },
  {
    id: "certificates",
    icon: "FileCheck2",
    title: "Digital Certificates",
    desc: "Access, download, and share tamper-evident digital certificates with cryptographically signed QR.",
    badge: "24x7 Vault",
    color: "indigo"
  },
  {
    id: "renewal",
    icon: "BellRing",
    title: "Renewal & Expiry",
    desc: "Automated SMS/Email reminders 30 and 15 days before certificate expiration to avoid penalties.",
    badge: "Alerts Active",
    color: "rose"
  }
];

export const WORKFLOW_STEPS = [
  {
    step: "01",
    title: "Register",
    desc: "Trader or manufacturer registers on portal with GSTIN / Aadhaar & instrument specs.",
    icon: "UserPlus"
  },
  {
    step: "02",
    title: "Apply",
    desc: "Select instrument type, calibration standard, and submit online fee payment.",
    icon: "FileText"
  },
  {
    step: "03",
    title: "Schedule",
    desc: "System assigns Legal Metrology Officer (LMO) or GATC and fixes inspection slot.",
    icon: "Calendar"
  },
  {
    step: "04",
    title: "Inspect",
    desc: "Officer conducts on-site field testing using mobile app & records standard weights.",
    icon: "ClipboardCheck"
  },
  {
    step: "05",
    title: "Approve",
    desc: "Verification data, physical seals, and error tolerances evaluated by authority.",
    icon: "CheckCircle2"
  },
  {
    step: "06",
    title: "Certify",
    desc: "Digital certificate generated with tamper-proof QR code and digital stamp.",
    icon: "Award"
  },
  {
    step: "07",
    title: "Verify",
    desc: "Public and consumers scan QR on physical scale to confirm valid certification.",
    icon: "QrCode"
  },
  {
    step: "08",
    title: "Monitor",
    desc: "System tracks validity and sends automated proactive re-verification alerts.",
    icon: "Activity"
  }
];

export const SERVICES_LIST = [
  {
    title: "Instrument Registration",
    desc: "Centralized digital registry for all legal weighing & measuring devices across states.",
    icon: "Layers"
  },
  {
    title: "Verification Application",
    desc: "End-to-end paperless submission with instant acknowledgement and application ID.",
    icon: "FileSignature"
  },
  {
    title: "Re-Verification",
    desc: "Periodic mandatory verification lifecycle management as per Legal Metrology Act 2009.",
    icon: "RefreshCw"
  },
  {
    title: "Verification Scheduling",
    desc: "Intelligent slot booking and route optimization for field inspection teams.",
    icon: "Clock"
  },
  {
    title: "Field Inspection",
    desc: "Dedicated mobile app for LMOs with offline capability, GPS tags, and camera evidence.",
    icon: "Smartphone"
  },
  {
    title: "Digital Certificates",
    desc: "Legally valid, downloadable PDF certificates with embedded cryptographic metadata.",
    icon: "FileBadge2"
  },
  {
    title: "QR Verification",
    desc: "Public-facing scan engine to instantly verify device legitimacy at point of sale.",
    icon: "QrCode"
  },
  {
    title: "Expiry Alerts",
    desc: "Multi-channel automated reminders via WhatsApp, SMS, and Email prior to due date.",
    icon: "Bell"
  },
  {
    title: "Verification History",
    desc: "Complete chronological audit trail and historical calibration logs for every device.",
    icon: "History"
  },
  {
    title: "Reports & Monitoring",
    desc: "Real-time administrative dashboards for pendency tracking, revenue, and compliance.",
    icon: "BarChart3"
  }
];

export const FAQS_DATA = [
  {
    q: "What is Legal Metrology verification?",
    a: "Legal Metrology verification is the statutory process of testing and stamping commercial weighing and measuring instruments (such as grocery scales, petrol dispensers, weighbridges, and jewellery balances) to ensure they comply with prescribed maximum permissible error limits and regulatory standards under the Legal Metrology Act, 2009."
  },
  {
    q: "Who can apply for verification?",
    a: "Any instrument owner, commercial business, trader, manufacturer, dealer, repairer, or petrol pump operator who uses weighing and measuring instruments for commercial transactions or trade can register and submit verification requests."
  },
  {
    q: "How can I track my application?",
    a: "You can track your application anytime using the 'Track Application' feature on this portal by entering your Application Reference ID (e.g., APP-2026-9812). The system shows real-time officer assignment, inspection schedule, and certificate generation status."
  },
  {
    q: "How can I verify a certificate?",
    a: "Citizens, consumers, and enforcement authorities can verify any certificate in seconds by entering the Certificate Number (e.g., LM-CERT-2026-00001) in the QR Verification section or by scanning the QR code physically printed on the verified instrument."
  },
  {
    q: "What happens when a certificate expires?",
    a: "Using an unverified or expired instrument for trade is a punishable offence under Section 24 of the Legal Metrology Act. The E-Metrology platform automatically issues automated alerts 30 days and 15 days in advance, allowing owners to schedule re-verification seamlessly before expiry."
  },
  {
    q: "Can field officers use mobile devices for inspections?",
    a: "Yes. The E-Metrology platform features a dedicated Mobile Inspection Module for Legal Metrology Officers (LMOs) and GATC inspectors to record test observations, capture geo-tagged photographic evidence of physical seals, and submit verification reports directly from the field."
  }
];
