import type { ID } from '../../types';

export type EventItem = {
  id: ID;
  description: string;
  startDate: string; // ISO ou dd/mm/aaaa
  endDate: string; // ISO ou dd/mm/aaaa
  cep: string;
  address: string; // Rua, Bairro, Cidade - UF
  createdAt?: string;
};

export type NewEventInput = Omit<EventItem, 'id' | 'createdAt'>;

