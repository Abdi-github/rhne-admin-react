import type { Service, ServiceContact, ServiceLink } from '@/features/services/services.types';

export const mockServices: Service[] = [
  {
    _id: 'service-1',
    name: { fr: 'Cardiologie', en: 'Cardiology', de: 'Kardiologie', it: 'Cardiologia' },
    slug: 'cardiologie',
    category: 'Médecine interne',
    image_url: 'https://example.com/cardio.jpg',
    description: {
      fr: 'Service de cardiologie interventionnelle',
      en: 'Interventional cardiology service',
      de: 'Interventionelle Kardiologie',
      it: 'Servizio di cardiologia interventistica',
    },
    prestations: [
      { fr: 'Échocardiographie', en: 'Echocardiography', de: 'Echokardiographie', it: 'Ecocardiografia' },
      { fr: 'Cathétérisme cardiaque', en: 'Cardiac catheterization', de: 'Herzkatheteruntersuchung', it: 'Cateterismo cardiaco' },
    ],
    is_active: true,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-06-10T11:00:00Z',
  },
  {
    _id: 'service-2',
    name: { fr: 'Oncologie', en: 'Oncology', de: 'Onkologie', it: 'Oncologia' },
    slug: 'oncologie',
    category: 'Médecine interne',
    image_url: '',
    description: {
      fr: 'Centre d\'oncologie et d\'hématologie',
      en: 'Oncology and hematology center',
      de: 'Zentrum für Onkologie und Hämatologie',
      it: 'Centro di oncologia ed ematologia',
    },
    prestations: [],
    is_active: true,
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-06-12T11:00:00Z',
  },
  {
    _id: 'service-3',
    name: { fr: 'Pédiatrie', en: 'Pediatrics', de: 'Pädiatrie', it: 'Pediatria' },
    slug: 'pediatrie',
    category: 'Chirurgie',
    image_url: '',
    description: null,
    prestations: [],
    is_active: false,
    createdAt: '2024-02-05T10:00:00Z',
    updatedAt: '2024-05-20T12:00:00Z',
  },
];

export const mockServiceContacts: ServiceContact[] = [
  {
    _id: 'contact-1',
    service_id: 'service-1',
    site_id: 'site-1',
    site_name: 'Hôpital Pourtalès',
    email: 'cardio@rhne.ch',
    phone: '+41 32 713 30 50',
    hours: { fr: 'Lun-Ven 08:00-17:00', en: 'Mon-Fri 08:00-17:00', de: 'Mo-Fr 08:00-17:00', it: 'Lun-Ven 08:00-17:00' },
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-03-01T10:00:00Z',
  },
  {
    _id: 'contact-2',
    service_id: 'service-1',
    site_id: 'site-2',
    site_name: 'La Chaux-de-Fonds',
    email: 'cardio.lcf@rhne.ch',
    phone: '+41 32 967 21 50',
    hours: null,
    createdAt: '2024-03-02T10:00:00Z',
    updatedAt: '2024-03-02T10:00:00Z',
  },
];

export const mockServiceLinks: ServiceLink[] = [
  {
    _id: 'link-1',
    service_id: 'service-1',
    title: { fr: 'Guide du patient', en: 'Patient guide', de: 'Patientenleitfaden', it: 'Guida del paziente' },
    url: 'https://example.com/guide-cardio',
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-03-10T10:00:00Z',
  },
  {
    _id: 'link-2',
    service_id: 'service-1',
    title: { fr: 'Brochure informative', en: 'Information brochure', de: 'Informationsbroschüre', it: 'Opuscolo informativo' },
    url: 'https://example.com/brochure-cardio',
    createdAt: '2024-03-12T10:00:00Z',
    updatedAt: '2024-03-12T10:00:00Z',
  },
];
