import type { PatientInfo } from '@/features/patient-info/patient-info.types';

export const mockPatientInfoPages: PatientInfo[] = [
  {
    _id: 'pi-1',
    title: {
      fr: "Admission à l'hôpital",
      en: 'Hospital Admission',
      de: 'Krankenhausaufnahme',
      it: "Ammissione all'ospedale",
    },
    slug: 'admission-a-l-hopital',
    url: 'https://www.rhne.ch/patient-info/admission',
    section: 'Séjour',
    sections: [
      {
        id: 'sec-1',
        title: {
          fr: 'Documents nécessaires',
          en: 'Required Documents',
          de: 'Erforderliche Dokumente',
          it: 'Documenti necessari',
        },
        content: {
          fr: "Veuillez apporter votre carte d'identité et votre carte d'assurance.",
          en: 'Please bring your ID card and insurance card.',
          de: 'Bitte bringen Sie Ihren Ausweis und Ihre Versicherungskarte mit.',
          it: "Si prega di portare la carta d'identità e la tessera assicurativa.",
        },
        list_items: [
          {
            fr: "Carte d'identité",
            en: 'ID card',
            de: 'Ausweis',
            it: "Carta d'identità",
          },
          {
            fr: "Carte d'assurance maladie",
            en: 'Health insurance card',
            de: 'Krankenversicherungskarte',
            it: 'Tessera assicurativa',
          },
        ],
      },
      {
        id: 'sec-2',
        title: {
          fr: 'Horaires de visite',
          en: 'Visiting Hours',
          de: 'Besuchszeiten',
          it: 'Orari di visita',
        },
        content: {
          fr: 'Les visites sont autorisées de 14h à 20h.',
          en: 'Visits are allowed from 2 PM to 8 PM.',
          de: 'Besuche sind von 14:00 bis 20:00 Uhr erlaubt.',
          it: 'Le visite sono consentite dalle 14:00 alle 20:00.',
        },
        list_items: [],
      },
    ],
    content: {
      fr: "Informations générales sur l'admission.",
      en: 'General information about admission.',
      de: 'Allgemeine Informationen zur Aufnahme.',
      it: "Informazioni generali sull'ammissione.",
    },
    image_url: 'https://example.com/images/admission.jpg',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
  },
  {
    _id: 'pi-2',
    title: {
      fr: 'Droits des patients',
      en: 'Patient Rights',
      de: 'Patientenrechte',
      it: 'Diritti dei pazienti',
    },
    slug: 'droits-des-patients',
    url: 'https://www.rhne.ch/patient-info/droits',
    section: 'Droits',
    sections: [
      {
        id: 'sec-3',
        title: {
          fr: 'Consentement éclairé',
          en: 'Informed Consent',
          de: 'Einwilligung',
          it: 'Consenso informato',
        },
        content: {
          fr: 'Vous avez le droit de recevoir des informations complètes sur votre traitement.',
          en: 'You have the right to receive complete information about your treatment.',
          de: 'Sie haben das Recht, vollständige Informationen über Ihre Behandlung zu erhalten.',
          it: 'Avete il diritto di ricevere informazioni complete sul vostro trattamento.',
        },
        list_items: [],
      },
    ],
    content: null,
    image_url: '',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    _id: 'pi-3',
    title: {
      fr: 'Sortie et suivi',
      en: 'Discharge and Follow-up',
      de: 'Entlassung und Nachsorge',
      it: 'Dimissione e follow-up',
    },
    slug: 'sortie-et-suivi',
    url: '',
    section: 'Séjour',
    sections: [],
    content: {
      fr: "Informations sur la sortie de l'hôpital.",
      en: 'Information about hospital discharge.',
      de: 'Informationen zur Krankenhausentlassung.',
      it: "Informazioni sulla dimissione dall'ospedale.",
    },
    image_url: '',
    createdAt: '2025-02-01T14:00:00Z',
    updatedAt: '2025-02-01T14:00:00Z',
  },
];
