export interface Client {
  name: string
  phone: string
  email: string
}

export interface ServiceOffering {
  id: string
  name: string
  durationInMinutes: number
  priceInCents?: number
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  available: boolean
}

export interface Appointment {
  id: string
  service: ServiceOffering
  client: Client
  date: string
  timeSlot: TimeSlot
  status: 'confirmed' | 'cancelled'
}

export interface AppointmentRequest {
  serviceId: string
  client: Client
  date: string
  timeSlotId: string
}

export interface AvailabilityQuery {
  serviceId: string
  date: string
}

export type BookingStep = 'client' | 'schedule' | 'confirmation' | 'success'