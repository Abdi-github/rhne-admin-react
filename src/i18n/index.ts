import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frDashboard from './locales/fr/dashboard.json';
import frSettings from './locales/fr/settings.json';
import frSites from './locales/fr/sites.json';
import frServices from './locales/fr/services.json';
import frDoctors from './locales/fr/doctors.json';
import frEvents from './locales/fr/events.json';
import frJobs from './locales/fr/jobs.json';
import frNewborns from './locales/fr/newborns.json';
import frPatientInfo from './locales/fr/patient-info.json';
import frUsers from './locales/fr/users.json';
import frRbac from './locales/fr/rbac.json';
import frEmergencyHotlines from './locales/fr/emergency-hotlines.json';
import frAppointments from './locales/fr/appointments.json';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enSettings from './locales/en/settings.json';
import enSites from './locales/en/sites.json';
import enServices from './locales/en/services.json';
import enDoctors from './locales/en/doctors.json';
import enEvents from './locales/en/events.json';
import enJobs from './locales/en/jobs.json';
import enNewborns from './locales/en/newborns.json';
import enPatientInfo from './locales/en/patient-info.json';
import enUsers from './locales/en/users.json';
import enRbac from './locales/en/rbac.json';
import enEmergencyHotlines from './locales/en/emergency-hotlines.json';
import enAppointments from './locales/en/appointments.json';
import deCommon from './locales/de/common.json';
import deAuth from './locales/de/auth.json';
import deDashboard from './locales/de/dashboard.json';
import deSettings from './locales/de/settings.json';
import deSites from './locales/de/sites.json';
import deServices from './locales/de/services.json';
import deDoctors from './locales/de/doctors.json';
import deEvents from './locales/de/events.json';
import deJobs from './locales/de/jobs.json';
import deNewborns from './locales/de/newborns.json';
import dePatientInfo from './locales/de/patient-info.json';
import deUsers from './locales/de/users.json';
import deRbac from './locales/de/rbac.json';
import deEmergencyHotlines from './locales/de/emergency-hotlines.json';
import deAppointments from './locales/de/appointments.json';
import itCommon from './locales/it/common.json';
import itAuth from './locales/it/auth.json';
import itDashboard from './locales/it/dashboard.json';
import itSettings from './locales/it/settings.json';
import itSites from './locales/it/sites.json';
import itServices from './locales/it/services.json';
import itDoctors from './locales/it/doctors.json';
import itEvents from './locales/it/events.json';
import itJobs from './locales/it/jobs.json';
import itNewborns from './locales/it/newborns.json';
import itPatientInfo from './locales/it/patient-info.json';
import itUsers from './locales/it/users.json';
import itRbac from './locales/it/rbac.json';
import itEmergencyHotlines from './locales/it/emergency-hotlines.json';
import itAppointments from './locales/it/appointments.json';

const resources = {
  fr: { common: frCommon, auth: frAuth, dashboard: frDashboard, settings: frSettings, sites: frSites, services: frServices, doctors: frDoctors, events: frEvents, jobs: frJobs, newborns: frNewborns, 'patient-info': frPatientInfo, users: frUsers, rbac: frRbac, 'emergency-hotlines': frEmergencyHotlines, appointments: frAppointments },
  en: { common: enCommon, auth: enAuth, dashboard: enDashboard, settings: enSettings, sites: enSites, services: enServices, doctors: enDoctors, events: enEvents, jobs: enJobs, newborns: enNewborns, 'patient-info': enPatientInfo, users: enUsers, rbac: enRbac, 'emergency-hotlines': enEmergencyHotlines, appointments: enAppointments },
  de: { common: deCommon, auth: deAuth, dashboard: deDashboard, settings: deSettings, sites: deSites, services: deServices, doctors: deDoctors, events: deEvents, jobs: deJobs, newborns: deNewborns, 'patient-info': dePatientInfo, users: deUsers, rbac: deRbac, 'emergency-hotlines': deEmergencyHotlines, appointments: deAppointments },
  it: { common: itCommon, auth: itAuth, dashboard: itDashboard, settings: itSettings, sites: itSites, services: itServices, doctors: itDoctors, events: itEvents, jobs: itJobs, newborns: itNewborns, 'patient-info': itPatientInfo, users: itUsers, rbac: itRbac, 'emergency-hotlines': itEmergencyHotlines, appointments: itAppointments },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    defaultNS: 'common',
    ns: ['common', 'auth', 'dashboard', 'settings', 'sites', 'services', 'doctors', 'events', 'jobs', 'newborns', 'patient-info', 'users', 'rbac', 'emergency-hotlines', 'appointments'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'rhne_language',
      caches: ['localStorage'],
    },
  });

export default i18n;
