import type { SvgIconComponent } from '@mui/icons-material';
import {
  Dashboard,
  LocalHospital,
  MedicalServices,
  Person,
  Event,
  Work,
  ChildCare,
  Info,
  People,
  Security,
  Settings,
  LocalFireDepartment,
  CalendarMonth,
  BookOnline,
} from '@mui/icons-material';

export interface NavItem {
  label: string;
  i18nKey: string;
  path: string;
  icon: SvgIconComponent;
  roles: string[];
}

export const SIDEBAR_NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    i18nKey: 'nav.dashboard',
    path: '/',
    icon: Dashboard,
    roles: ['admin', 'super_admin'],
  },
  {
    label: 'Sites',
    i18nKey: 'nav.sites',
    path: '/sites',
    icon: LocalHospital,
    roles: ['admin', 'super_admin', 'site_manager'],
  },
  {
    label: 'Services',
    i18nKey: 'nav.services',
    path: '/services',
    icon: MedicalServices,
    roles: ['admin', 'super_admin', 'content_editor'],
  },
  {
    label: 'Doctors',
    i18nKey: 'nav.doctors',
    path: '/doctors',
    icon: Person,
    roles: ['admin', 'super_admin', 'site_manager'],
  },
  {
    label: 'Events',
    i18nKey: 'nav.events',
    path: '/events',
    icon: Event,
    roles: ['admin', 'super_admin', 'content_editor'],
  },
  {
    label: 'Jobs',
    i18nKey: 'nav.jobs',
    path: '/jobs',
    icon: Work,
    roles: ['admin', 'super_admin', 'hr_manager'],
  },
  {
    label: 'Newborns',
    i18nKey: 'nav.newborns',
    path: '/newborns',
    icon: ChildCare,
    roles: ['admin', 'super_admin'],
  },
  {
    label: 'Patient Info',
    i18nKey: 'nav.patient_info',
    path: '/patient-info',
    icon: Info,
    roles: ['admin', 'super_admin', 'content_editor'],
  },
  {
    label: 'Emergency Hotlines',
    i18nKey: 'nav.emergency_hotlines',
    path: '/emergency-hotlines',
    icon: LocalFireDepartment,
    roles: ['admin', 'super_admin', 'content_editor'],
  },
  {
    label: 'Appointments',
    i18nKey: 'nav.appointments',
    path: '/appointments',
    icon: CalendarMonth,
    roles: ['admin', 'super_admin', 'content_editor'],
  },
  {
    label: 'Appointment Bookings',
    i18nKey: 'nav.appointment_bookings',
    path: '/appointment-bookings',
    icon: BookOnline,
    roles: ['admin', 'super_admin'],
  },
  {
    label: 'Users',
    i18nKey: 'nav.users',
    path: '/users',
    icon: People,
    roles: ['admin', 'super_admin'],
  },
  {
    label: 'RBAC',
    i18nKey: 'nav.rbac',
    path: '/rbac',
    icon: Security,
    roles: ['super_admin'],
  },
  {
    label: 'Settings',
    i18nKey: 'nav.settings',
    path: '/settings',
    icon: Settings,
    roles: [], // All roles
  },
];
