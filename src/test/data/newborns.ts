import type { Newborn } from '@/features/newborns/newborns.types';

export const mockNewborns: Newborn[] = [
  {
    _id: 'newborn-1',
    name: 'Emma',
    date: '2025-06-15T00:00:00Z',
    image_url: 'https://example.com/photos/emma.jpg',
    createdAt: '2025-06-15T10:00:00Z',
    updatedAt: '2025-06-15T10:00:00Z',
  },
  {
    _id: 'newborn-2',
    name: 'Léo',
    date: '2025-06-10T00:00:00Z',
    image_url: 'https://example.com/photos/leo.jpg',
    createdAt: '2025-06-10T08:00:00Z',
    updatedAt: '2025-06-10T08:00:00Z',
  },
  {
    _id: 'newborn-3',
    name: 'Chloé',
    date: '2025-05-20T00:00:00Z',
    image_url: '',
    createdAt: '2025-05-20T14:00:00Z',
    updatedAt: '2025-05-20T14:00:00Z',
  },
];
