import type {
  Appointment,
  AppointmentRequest,
  AvailabilityQuery,
  ServiceOffering,
  TimeSlot,
} from '../types/booking.ts'
import type { ApiClient } from './apiClient.ts'

export interface AppointmentService {
  getService(serviceId: string): Promise<ServiceOffering>
  getAvailableTimeSlots(query: AvailabilityQuery): Promise<TimeSlot[]>
  createAppointment(request: AppointmentRequest): Promise<Appointment>
}

export class HttpAppointmentService implements AppointmentService {
  private readonly apiClient: ApiClient

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient
  }

  getService(serviceId: string): Promise<ServiceOffering> {
    return this.apiClient.get<ServiceOffering>(`/services/${serviceId}`)
  }

  getAvailableTimeSlots(query: AvailabilityQuery): Promise<TimeSlot[]> {
    const searchParams = new URLSearchParams({
      serviceId: query.serviceId,
      date: query.date,
    })

    return this.apiClient.get<TimeSlot[]>(`/availability?${searchParams}`)
  }

  createAppointment(request: AppointmentRequest): Promise<Appointment> {
    return this.apiClient.post<AppointmentRequest, Appointment>(
      '/appointments',
      request,
    )
  }
}

export class MockAppointmentService implements AppointmentService {
  private readonly service: ServiceOffering = {
    id: 'consultation',
    name: 'Initial consultation',
    durationInMinutes: 50,
    priceInCents: 7500,
  }

  getService(serviceId: string): Promise<ServiceOffering> {
    if (serviceId !== this.service.id) {
      return Promise.reject(new Error('Service not found'))
    }

    return Promise.resolve(this.service)
  }

  getAvailableTimeSlots(query: AvailabilityQuery): Promise<TimeSlot[]> {
    const slots = Array.from({ length: 9 }, (_, index) => {
      const startHour = index + 9
      const startTime = `${String(startHour).padStart(2, '0')}:00`
      const endTime = `${String(startHour + 1).padStart(2, '0')}:00`

      return {
        id: `${query.date}-${startTime}`,
        startTime,
        endTime,
        available: startHour !== 12 && startHour !== 15,
      }
    })

    return Promise.resolve(slots)
  }

  async createAppointment(request: AppointmentRequest): Promise<Appointment> {
    const [service, timeSlots] = await Promise.all([
      this.getService(request.serviceId),
      this.getAvailableTimeSlots({
        serviceId: request.serviceId,
        date: request.date,
      }),
    ])
    const timeSlot = timeSlots.find((slot) => slot.id === request.timeSlotId)

    if (!timeSlot || !timeSlot.available) {
      throw new Error('Selected time slot is no longer available')
    }

    return {
      id: crypto.randomUUID(),
      service,
      client: request.client,
      date: request.date,
      timeSlot,
      status: 'confirmed',
    }
  }
}