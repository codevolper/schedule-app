import { useReducer, useRef } from 'react'
import type {
  Appointment,
  Client,
  ServiceOffering,
  TimeSlot,
} from '../types/booking.ts'
import type { BookingStep } from '../types/booking.ts'
import {
  MockAppointmentService,
  type AppointmentService,
} from '../services/appointmentService.ts'

export interface BookingState {
  step: BookingStep
  client: Client
  selectedService?: ServiceOffering
  selectedDate?: string
  selectedTimeSlot?: TimeSlot
  availableTimeSlots: TimeSlot[]
  appointment?: Appointment
  isLoading: boolean
  error?: string
}

interface UpdateClientAction {
  type: 'updateClient'
  client: Partial<Client>
}

interface SetServiceAction {
  type: 'setService'
  service: ServiceOffering
}

interface SetDateAction {
  type: 'setDate'
  date: string
}

interface SetTimeSlotsAction {
  type: 'setTimeSlots'
  timeSlots: TimeSlot[]
}

interface SetTimeSlotAction {
  type: 'setTimeSlot'
  timeSlot: TimeSlot
}

interface SetStepAction {
  type: 'setStep'
  step: BookingStep
}

interface SetLoadingAction {
  type: 'setLoading'
  isLoading: boolean
}

interface SetErrorAction {
  type: 'setError'
  error?: string
}

interface SetAppointmentAction {
  type: 'setAppointment'
  appointment: Appointment
}

interface ResetAction {
  type: 'reset'
}

type BookingAction =
  | UpdateClientAction
  | SetServiceAction
  | SetDateAction
  | SetTimeSlotsAction
  | SetTimeSlotAction
  | SetStepAction
  | SetLoadingAction
  | SetErrorAction
  | SetAppointmentAction
  | ResetAction

const defaultClient: Client = {
  name: '',
  phone: '',
  email: '',
}

const initialBookingState: BookingState = {
  step: 'client',
  client: defaultClient,
  availableTimeSlots: [],
  isLoading: false,
}

const defaultAppointmentService = new MockAppointmentService()

function bookingReducer(
  state: BookingState,
  action: BookingAction,
): BookingState {
  switch (action.type) {
    case 'updateClient':
      return {
        ...state,
        client: { ...state.client, ...action.client },
        error: undefined,
      }
    case 'setService':
      return {
        ...state,
        selectedService: action.service,
        selectedDate: undefined,
        selectedTimeSlot: undefined,
        availableTimeSlots: [],
        error: undefined,
      }
    case 'setDate':
      return {
        ...state,
        selectedDate: action.date,
        selectedTimeSlot: undefined,
        availableTimeSlots: [],
        error: undefined,
      }
    case 'setTimeSlots':
      return { ...state, availableTimeSlots: action.timeSlots }
    case 'setTimeSlot':
      return { ...state, selectedTimeSlot: action.timeSlot, error: undefined }
    case 'setStep':
      return { ...state, step: action.step, error: undefined }
    case 'setLoading':
      return { ...state, isLoading: action.isLoading }
    case 'setError':
      return { ...state, error: action.error, isLoading: false }
    case 'setAppointment':
      return {
        ...state,
        appointment: action.appointment,
        step: 'success',
        isLoading: false,
        error: undefined,
      }
    case 'reset':
      return {
        ...initialBookingState,
        client: { ...defaultClient },
      }
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong'
}

function isClientComplete(client: Client): boolean {
  return Boolean(client.name.trim() && client.phone.trim() && client.email.trim())
}

export function useBooking(
  appointmentService: AppointmentService = defaultAppointmentService,
) {
  const [state, dispatch] = useReducer(bookingReducer, initialBookingState)
  const availabilityRequestId = useRef(0)

  const updateClient = (client: Partial<Client>) => {
    dispatch({ type: 'updateClient', client })
  }

  const selectService = async (serviceId: string) => {
    dispatch({ type: 'setLoading', isLoading: true })

    try {
      const service = await appointmentService.getService(serviceId)
      dispatch({ type: 'setService', service })
    } catch (error) {
      dispatch({ type: 'setError', error: getErrorMessage(error) })
    } finally {
      dispatch({ type: 'setLoading', isLoading: false })
    }
  }

  const selectDate = async (date: string) => {
    if (!state.selectedService) {
      dispatch({ type: 'setError', error: 'Select a service first' })
      return
    }

    const requestId = availabilityRequestId.current + 1
    availabilityRequestId.current = requestId
    dispatch({ type: 'setDate', date })
    dispatch({ type: 'setLoading', isLoading: true })

    try {
      const timeSlots = await appointmentService.getAvailableTimeSlots({
        serviceId: state.selectedService.id,
        date,
      })

      if (requestId === availabilityRequestId.current) {
        dispatch({ type: 'setTimeSlots', timeSlots })
      }
    } catch (error) {
      if (requestId === availabilityRequestId.current) {
        dispatch({ type: 'setError', error: getErrorMessage(error) })
      }
    } finally {
      if (requestId === availabilityRequestId.current) {
        dispatch({ type: 'setLoading', isLoading: false })
      }
    }
  }

  const selectTimeSlot = (timeSlot: TimeSlot) => {
    if (!timeSlot.available) {
      dispatch({ type: 'setError', error: 'Select an available time slot' })
      return
    }

    dispatch({ type: 'setTimeSlot', timeSlot })
  }

  const goToNextStep = () => {
    if (state.step === 'client') {
      if (!isClientComplete(state.client)) {
        dispatch({ type: 'setError', error: 'Complete your contact details' })
        return
      }

      dispatch({ type: 'setStep', step: 'schedule' })
      return
    }

    if (state.step === 'schedule') {
      if (!state.selectedService || !state.selectedDate || !state.selectedTimeSlot) {
        dispatch({ type: 'setError', error: 'Select a service, date, and time' })
        return
      }

      dispatch({ type: 'setStep', step: 'confirmation' })
    }
  }

  const goToPreviousStep = () => {
    if (state.step === 'schedule') {
      dispatch({ type: 'setStep', step: 'client' })
    } else if (state.step === 'confirmation') {
      dispatch({ type: 'setStep', step: 'schedule' })
    }
  }

  const submitBooking = async (): Promise<Appointment | null> => {
    if (!state.selectedService || !state.selectedDate || !state.selectedTimeSlot) {
      dispatch({ type: 'setError', error: 'Complete the booking details first' })
      return null
    }

    dispatch({ type: 'setLoading', isLoading: true })

    try {
      const appointment = await appointmentService.createAppointment({
        serviceId: state.selectedService.id,
        client: state.client,
        date: state.selectedDate,
        timeSlotId: state.selectedTimeSlot.id,
      })
      dispatch({ type: 'setAppointment', appointment })
      return appointment
    } catch (error) {
      dispatch({ type: 'setError', error: getErrorMessage(error) })
      return null
    }
  }

  const resetBooking = () => {
    availabilityRequestId.current += 1
    dispatch({ type: 'reset' })
  }

  return {
    state,
    canContinue:
      state.step === 'client'
        ? isClientComplete(state.client)
        : state.step === 'schedule'
          ? Boolean(
              state.selectedService &&
                state.selectedDate &&
                state.selectedTimeSlot,
            )
          : state.step === 'confirmation',
    updateClient,
    selectService,
    selectDate,
    selectTimeSlot,
    goToNextStep,
    goToPreviousStep,
    submitBooking,
    resetBooking,
  }
}