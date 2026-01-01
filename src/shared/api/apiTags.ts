export const API_TAGS = [
  'Sites',
  'Services',
  'ServiceContacts',
  'ServiceLinks',
  'Doctors',
  'Events',
  'Jobs',
  'Newborns',
  'PatientInfo',
  'EmergencyHotlines',
  'Appointments',
  'Users',
  'Roles',
  'Permissions',
  'Dashboard',
  'Profile',
] as const;

export type ApiTag = (typeof API_TAGS)[number];
