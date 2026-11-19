// Brand. One source of truth so a later domain move is a one-line change.
export const SITE_NAME = "Asili Safaris";
export const SITE_URL = "https://www.taranghirani.com";
export const SITE_TAGLINE = "Wildlife Photography Experiences";
export const SITE_DESCRIPTION =
  "Photography-led wildlife experiences in India and Africa. Small groups of six or fewer, led by wildlife photographer Tarang Hirani, with teaching in the field.";
export const LOGO_URL = `${SITE_URL}/brand/asili-safaris-mark.png`;

export const FOUNDER_NAME = "Tarang Hirani";
export const FOUNDER_INSTAGRAM_URL = "https://www.instagram.com/tarang.hirani/";

export const INSTAGRAM_HANDLE = "@asili.safaris";
export const INSTAGRAM_URL = "https://www.instagram.com/asili.safaris/";
export const INSTAGRAM_DM_URL = "https://ig.me/m/asili.safaris";

export const PHONE_NUMBER_DISPLAY = "+91 91753 47045";
export const PHONE_TEL = "tel:+919175347045";
export const WHATSAPP_URL = "https://wa.me/919175347045";
export const EMAIL = "tarang@asilisafaris.in";
export const EMAIL_MAILTO = "mailto:tarang@asilisafaris.in";

// Schema.org references. The Organization node is defined in full in the home
// page JSON-LD (pages/index.tsx); other pages point at it by @id.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const FOUNDER_ID = `${SITE_URL}/#founder`;

export const FOUNDER_JSON_LD = {
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: FOUNDER_NAME,
  jobTitle: "Wildlife Photographer",
  url: SITE_URL,
  sameAs: [FOUNDER_INSTAGRAM_URL],
};

export const ORGANIZATION_REF = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
};
