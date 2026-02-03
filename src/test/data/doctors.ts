import type { Doctor } from '@/features/doctors/doctors.types';

export const mockDoctors: Doctor[] = [
  {
    _id: 'doctor-1',
    name: 'Jean Dupont',
    title: 'Dr',
    service_id: 'service-1',
    service_name: 'Médecine interne',
    image_url: 'https://example.com/dupont.jpg',
    is_active: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-06-01T10:00:00Z',
  },
  {
    _id: 'doctor-2',
    name: 'Marie Curie',
    title: 'Pr',
    service_id: 'service-2',
    service_name: 'Oncologie',
    image_url: '',
    is_active: true,
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2024-05-20T14:00:00Z',
  },
  {
    _id: 'doctor-3',
    name: 'Pierre Martin',
    title: null,
    service_id: 'service-1',
    service_name: 'Médecine interne',
    image_url: '',
    is_active: false,
    createdAt: '2024-03-01T11:00:00Z',
    updatedAt: '2024-04-10T16:00:00Z',
  },
];
