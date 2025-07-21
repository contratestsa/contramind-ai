export type DashboardData = {
  uniqueDocs: number;
  contractType: Record<string, number>;
  executed: { yes: number; no: number };
  language: Record<string, number>;
  internalParties: Record<string, number>;
  counterparties: Record<string, number>;
  governingLaw: Record<string, number>;
};

export const mockAnalyticsData: DashboardData = {
  uniqueDocs: 705,
  contractType: {
    "Service Agreement": 145,
    "NDA": 98,
    "Purchase Order": 87,
    "License Agreement": 76,
    "Employment Contract": 65,
    "Lease Agreement": 54,
    "Consulting Agreement": 43,
    "Distribution Agreement": 38,
    "Partnership Agreement": 32,
    "Supply Agreement": 28,
    "Others": 39
  },
  executed: {
    yes: 523,
    no: 182
  },
  language: {
    "English": 412,
    "Arabic": 268,
    "Unknown": 25
  },
  internalParties: {
    "ContraMind Legal Department": 234,
    "ContraMind Sales": 156,
    "ContraMind Engineering": 98,
    "ContraMind HR": 87,
    "ContraMind Finance": 45,
    "ContraMind Operations": 32,
    "ContraMind Marketing": 28,
    "ContraMind IT": 15,
    "ContraMind Procurement": 8,
    "ContraMind Executive": 2
  },
  counterparties: {
    "Acme Corporation": 89,
    "Global Tech Solutions": 67,
    "Desert Innovations LLC": 54,
    "Saudi Digital Partners": 48,
    "Emirates Consulting Group": 43,
    "TechVentures MENA": 38,
    "Innovation Labs Dubai": 32,
    "Qatar Business Solutions": 28,
    "Riyadh Technologies": 25,
    "Kuwait Enterprises": 22,
    "Others": 259
  },
  governingLaw: {
    "Saudi Arabia": 289,
    "UAE": 178,
    "Egypt": 87,
    "Qatar": 54,
    "Kuwait": 43,
    "Bahrain": 21,
    "Jordan": 18,
    "English Law": 10,
    "New York Law": 3,
    "Singapore Law": 2
  }
};