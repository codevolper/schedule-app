export type Locale = 'en-US' | 'pt-BR'

export interface Translation {
  languageName: string
  themeLabel: string
  themeLight: string
  themeDark: string
  secure: string
  appointmentStudio: string
  heroTitle: string
  introCopy: string
  responseTime: string
  availability: string
  sessionDuration: string
  stepOf: (current: number, total: number) => string
  steps: {
    client: string
    schedule: string
    confirmation: string
  }
  clientLead: string
  fullName: string
  namePlaceholder: string
  phone: string
  phonePlaceholder: string
  email: string
  emailPlaceholder: string
  continue: string
  sessionType: string
  chooseSession: string
  initialConsultation: string
  sessionMeta: string
  choose: string
  change: string
  date: string
  availableTimes: string
  selectDate: string
  loading: string
  back: string
  confirmationLead: string
  session: string
  time: string
  client: string
  booking: string
  confirmBooking: string
  successEyebrow: string
  successTitle: string
  successCopy: (email: string) => string
  bookAnother: string
  footer: string
  notSelected: string
  errors: {
    completeDetails: string
    selectServiceFirst: string
    selectAvailableSlot: string
    selectBookingDetails: string
    unavailableSlot: string
    serviceNotFound: string
  }
}

export const translations: Record<Locale, Translation> = {
  'en-US': {
    languageName: 'English',
    themeLabel: 'Theme',
    themeLight: 'Light mode',
    themeDark: 'Dark mode',
    secure: 'Private and secure',
    appointmentStudio: 'Appointment studio',
    heroTitle: 'Make space for what matters.',
    introCopy: 'Reserve a focused session with Jordan Lee, independent consultant.',
    responseTime: 'Usually replies in 1 hour',
    availability: 'Monday to Friday, 9am to 6pm',
    sessionDuration: '50 min session',
    stepOf: (current, total) => `Step ${current} of ${total}`,
    steps: {
      client: 'Your details',
      schedule: 'Choose a time',
      confirmation: 'Review booking',
    },
    clientLead: 'A few details first, so Jordan knows who to expect.',
    fullName: 'Full name',
    namePlaceholder: 'Your name',
    phone: 'Phone number',
    phonePlaceholder: '+1 555 000 0000',
    email: 'Email address',
    emailPlaceholder: 'you@example.com',
    continue: 'Continue',
    sessionType: 'Session type',
    chooseSession: 'Choose your session',
    initialConsultation: 'Initial consultation',
    sessionMeta: '50 minutes · $75',
    choose: 'Choose',
    change: 'Change',
    date: 'Date',
    availableTimes: 'Available times',
    selectDate: 'Select a date to see times',
    loading: 'Loading...',
    back: 'Back',
    confirmationLead: 'Everything look right? Confirm your appointment below.',
    session: 'Session',
    time: 'Time',
    client: 'Client',
    booking: 'Booking...',
    confirmBooking: 'Confirm booking',
    successEyebrow: 'You are all set',
    successTitle: 'Your session is booked.',
    successCopy: (email) => `We sent the details to ${email}. Jordan is looking forward to meeting you.`,
    bookAnother: 'Book another session',
    footer: 'Morrow Studio · Independent practice scheduling',
    notSelected: 'Not selected',
    errors: {
      completeDetails: 'Complete your contact details',
      selectServiceFirst: 'Select a service first',
      selectAvailableSlot: 'Select an available time slot',
      selectBookingDetails: 'Select a service, date, and time',
      unavailableSlot: 'Selected time slot is no longer available',
      serviceNotFound: 'Service not found',
    },
  },
  'pt-BR': {
    languageName: 'Português',
    themeLabel: 'Tema',
    themeLight: 'Modo claro',
    themeDark: 'Modo escuro',
    secure: 'Privado e seguro',
    appointmentStudio: 'Agenda de consultas',
    heroTitle: 'Abra espaço para o que importa.',
    introCopy: 'Reserve uma sessão focada com Jordan Lee, consultor independente.',
    responseTime: 'Normalmente responde em 1 hora',
    availability: 'De segunda a sexta, das 9h às 18h',
    sessionDuration: 'Sessão de 50 min',
    stepOf: (current, total) => `Etapa ${current} de ${total}`,
    steps: {
      client: 'Seus dados',
      schedule: 'Escolha um horário',
      confirmation: 'Revise o agendamento',
    },
    clientLead: 'Primeiro, alguns dados para Jordan saber quem irá atender.',
    fullName: 'Nome completo',
    namePlaceholder: 'Seu nome',
    phone: 'Telefone',
    phonePlaceholder: '(11) 99999-9999',
    email: 'E-mail',
    emailPlaceholder: 'voce@exemplo.com',
    continue: 'Continuar',
    sessionType: 'Tipo de sessão',
    chooseSession: 'Escolha sua sessão',
    initialConsultation: 'Consulta inicial',
    sessionMeta: '50 minutos · R$ 75',
    choose: 'Escolher',
    change: 'Alterar',
    date: 'Data',
    availableTimes: 'Horários disponíveis',
    selectDate: 'Selecione uma data para ver os horários',
    loading: 'Carregando...',
    back: 'Voltar',
    confirmationLead: 'Está tudo certo? Confirme seu agendamento abaixo.',
    session: 'Sessão',
    time: 'Horário',
    client: 'Cliente',
    booking: 'Agendando...',
    confirmBooking: 'Confirmar agendamento',
    successEyebrow: 'Tudo pronto',
    successTitle: 'Sua sessão foi agendada.',
    successCopy: (email) => `Enviamos os detalhes para ${email}. Jordan espera encontrar você.`,
    bookAnother: 'Agendar outra sessão',
    footer: 'Morrow Studio · Agendamento para profissionais independentes',
    notSelected: 'Não selecionado',
    errors: {
      completeDetails: 'Preencha seus dados de contato',
      selectServiceFirst: 'Selecione um serviço primeiro',
      selectAvailableSlot: 'Selecione um horário disponível',
      selectBookingDetails: 'Selecione o serviço, a data e o horário',
      unavailableSlot: 'O horário selecionado não está mais disponível',
      serviceNotFound: 'Serviço não encontrado',
    },
  },
}
