export interface WebsiteProduct {
  id: string;
  title: string;
  category: string;
  deliveryTime: string;
  price: number;
  originalPrice: number;
  rating: number;
  ordersCount: number;
  featuresCount: number;
  image: string;
  tags: string[];
  demoUrl?: string;
  features?: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  priceStarting: string;
  duration: string;
  techs: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  client: string;
  year: string;
  tags: string[];
  demoUrl?: string;
}

export interface PortfolioCategory {
  id: string;
  label: string;
  active: boolean;
  iconName?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  text: string;
  rating: number;
  type: "readymade" | "custom";
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  skills: string[];
  bio: string;
  facebookUrl?: string;
  instagramUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  whatsappUrl?: string;
  showFacebook?: boolean;
  showInstagram?: boolean;
  showGithub?: boolean;
  showLinkedin?: boolean;
  showWhatsapp?: boolean;
}

export interface NoticeItem {
  id: string;
  iconName: string;
  text: string;
  badge?: string;
  highlight?: string;
}

export interface NoticeConfig {
  show: boolean;
  notices: NoticeItem[];
}

export interface OfferConfig {
  show: boolean;
  badgeText: string;
  urgencyText: string;
  descriptionText: string;
  timerType: "midnight" | "custom_target";
  customTargetDate?: string;
  discountActive?: boolean;
  discountPercentage?: number;
}

export interface ContactConfig {
  officeAddress: string;
  helplineNumbers: string;
  officialEmails: string;
  supportHours: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  bkashNumber?: string;
  nagadNumber?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
  smsApiUrl?: string;
  smsApiKey?: string;
  smsSenderId?: string;
  smsAdminNumber?: string;
  smsEnabledClient?: boolean;
  smsEnabledAdmin?: boolean;
  smsClientTemplate?: string;
  smsAdminTemplate?: string;
  smsEnabledDone?: boolean;
  smsDoneTemplate?: string;
}

export interface PackagePlan {
  id: string;
  name: string;
  banglaName: string;
  price: number;
  badge?: string;
  deliveryTime: string;
  description: string;
  features: string[];
  color: string;
  glowColor: string;
  tagline?: string;
  featuresDetailed?: { title: string; desc: string }[];
  suitableFor?: string[];
  whyChoose?: string[];
}

export interface PromoPopupConfig {
  show: boolean;
  imageUrl: string;
  linkUrl?: string;
  buttonText?: string;
}





