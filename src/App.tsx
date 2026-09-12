import { useState, type FormEvent } from 'react'
import { useBooking } from './hooks/useBooking.ts'
import { translations, type Locale } from './i18n/translations.ts'
import type { BookingStep } from './types/booking.ts'
import './App.css'

function getTodayInputValue() {
  const today = new Date()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${today.getFullYear()}-${month}-${day}`
}

function formatDate(date: string | undefined, locale: Locale, notSelected: string) {
  if (!date) return notSelected

  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

function formatTime(time: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: locale === 'en-US',
    timeZone: 'UTC',
  }).format(new Date(`1970-01-01T${time}:00Z`))
}

function translateError(error: string | undefined, locale: Locale) {
  if (!error) return undefined

  const errorTranslations: Record<string, keyof typeof translations['en-US']['errors']> = {
    'Complete your contact details': 'completeDetails',
    'Select a service first': 'selectServiceFirst',
    'Select an available time slot': 'selectAvailableSlot',
    'Select a service, date, and time': 'selectBookingDetails',
    'Selected time slot is no longer available': 'unavailableSlot',
    'Service not found': 'serviceNotFound',
  }

  const translationKey = errorTranslations[error]
  return translationKey ? translations[locale].errors[translationKey] : error
}

function App() {
  const [locale, setLocale] = useState<Locale>('en-US')
  const [isDark, setIsDark] = useState(false)
  const booking = useBooking()
  const { state } = booking
  const t = translations[locale]
  const steps: Array<{ id: BookingStep; label: string }> = [
    { id: 'client', label: t.steps.client },
    { id: 'schedule', label: t.steps.schedule },
    { id: 'confirmation', label: t.steps.confirmation },
  ]
  const displayError = translateError(state.error, locale)

  const handleClientSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (event.currentTarget.reportValidity()) booking.goToNextStep()
  }

  const handleScheduleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    booking.goToNextStep()
  }

  const handleConfirmationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await booking.submitBooking()
  }

  const currentStepIndex = state.step === 'success'
    ? steps.length
    : steps.findIndex((step) => step.id === state.step)

  return (
    <main className={`booking-shell ${isDark ? 'theme-dark' : ''}`} lang={locale}>
      <header className="topbar">
        <a className="brand" href="/" aria-label="Morrow home">
          <span className="brand-mark">M</span>
          <span>Morrow</span>
        </a>
        <div className="header-actions">
          <button
            className="language-toggle"
            type="button"
            aria-label={locale === 'en-US' ? 'Mudar para português brasileiro' : 'Switch to English'}
            onClick={() => setLocale(locale === 'en-US' ? 'pt-BR' : 'en-US')}
          >
            {locale === 'en-US' ? 'PT-BR' : 'EN-US'}
          </button>
          <button
            className="theme-toggle"
            type="button"
            aria-label={isDark ? t.themeLight : t.themeDark}
            aria-pressed={isDark}
            onClick={() => setIsDark((dark) => !dark)}
          >
            <span aria-hidden="true">{isDark ? '☼' : '◐'}</span>
            <span>{isDark ? t.themeLight : t.themeDark}</span>
          </button>
          <p className="secure-note"><span aria-hidden="true">&#9670;</span> {t.secure}</p>
        </div>
      </header>

      <div className="booking-layout">
        <aside className="booking-intro">
          <p className="eyebrow">{t.appointmentStudio}</p>
          <h1>{t.heroTitle}</h1>
          <p className="intro-copy">{t.introCopy}</p>
          <div className="availability-note">
            <span className="availability-dot" aria-hidden="true" />
            <span><strong>{t.responseTime}</strong><br />{t.availability}</span>
          </div>
          <div className="step-list" aria-label="Booking progress">
            {steps.map((step, index) => {
              const isActive = step.id === state.step
              const isComplete = index < currentStepIndex

              return (
                <div className={`step-item ${isActive ? 'is-active' : ''} ${isComplete ? 'is-complete' : ''}`} key={step.id}>
                  <span className="step-number">{isComplete ? '✓' : String(index + 1).padStart(2, '0')}</span>
                  <span>{step.label}</span>
                </div>
              )
            })}
          </div>
        </aside>

        <section className="booking-panel" aria-live="polite">
          {state.step !== 'success' && (
            <div className="panel-heading">
              <div>
                <p className="eyebrow">{t.stepOf(currentStepIndex + 1, steps.length)}</p>
                <h2>{steps[currentStepIndex]?.label}</h2>
              </div>
              <span className="duration-label">{t.sessionDuration}</span>
            </div>
          )}

          {displayError && <p className="error-message" role="alert">{displayError}</p>}

          {state.step === 'client' && (
            <form className="flow-form" onSubmit={handleClientSubmit}>
              <p className="form-lead">{t.clientLead}</p>
              <label>
                {t.fullName}
                <input
                  type="text"
                  value={state.client.name}
                  onChange={(event) => booking.updateClient({ name: event.target.value })}
                  placeholder={t.namePlaceholder}
                  autoComplete="name"
                  required
                />
              </label>
              <div className="field-row">
                <label>
                  {t.phone}
                  <input
                    type="tel"
                    value={state.client.phone}
                    onChange={(event) => booking.updateClient({ phone: event.target.value })}
                    placeholder={t.phonePlaceholder}
                    autoComplete="tel"
                    required
                  />
                </label>
                <label>
                  {t.email}
                  <input
                    type="email"
                    value={state.client.email}
                    onChange={(event) => booking.updateClient({ email: event.target.value })}
                    placeholder={t.emailPlaceholder}
                    autoComplete="email"
                    required
                  />
                </label>
              </div>
              <div className="form-actions form-actions-end">
                <button className="primary-button" type="submit">{t.continue} <span aria-hidden="true">→</span></button>
              </div>
            </form>
          )}

          {state.step === 'schedule' && (
            <form className="flow-form" onSubmit={handleScheduleSubmit}>
              <div className="service-picker">
                <div>
                  <span className="field-caption">{t.sessionType}</span>
                  <strong>{state.selectedService?.id === 'consultation' ? t.initialConsultation : t.chooseSession}</strong>
                  <span className="service-meta">{t.sessionMeta}</span>
                </div>
                <button className="text-button" type="button" onClick={() => booking.selectService('consultation')}>
                  {state.selectedService ? t.change : t.choose}
                </button>
              </div>

              <label>
                {t.date}
                <input
                  type="date"
                  min={getTodayInputValue()}
                  value={state.selectedDate ?? ''}
                  onChange={(event) => booking.selectDate(event.target.value)}
                  required
                />
              </label>

              <div className="slot-section">
                <div className="slot-heading">
                  <div>
                    <span className="field-caption">{t.availableTimes}</span>
                    <strong>{state.selectedDate ? formatDate(state.selectedDate, locale, t.notSelected) : t.selectDate}</strong>
                  </div>
                  {state.isLoading && <span className="loading-label">{t.loading}</span>}
                </div>
                <div className="time-grid">
                  {state.availableTimeSlots.map((slot) => (
                    <button
                      className={`time-slot ${state.selectedTimeSlot?.id === slot.id ? 'is-selected' : ''}`}
                      type="button"
                      key={slot.id}
                      disabled={!slot.available || state.isLoading}
                      aria-pressed={state.selectedTimeSlot?.id === slot.id}
                      onClick={() => booking.selectTimeSlot(slot)}
                    >
                      {formatTime(slot.startTime, locale)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button className="secondary-button" type="button" onClick={booking.goToPreviousStep}>{t.back}</button>
                <button className="primary-button" type="submit" disabled={!booking.canContinue || state.isLoading}>{t.continue} <span aria-hidden="true">→</span></button>
              </div>
            </form>
          )}

          {state.step === 'confirmation' && state.selectedService && state.selectedTimeSlot && (
            <form className="flow-form" onSubmit={handleConfirmationSubmit}>
              <p className="form-lead">{t.confirmationLead}</p>
              <dl className="summary-list">
                <div><dt>{t.session}</dt><dd>{t.initialConsultation}<span>{t.sessionMeta}</span></dd></div>
                <div><dt>{t.date}</dt><dd>{formatDate(state.selectedDate, locale, t.notSelected)}</dd></div>
                <div><dt>{t.time}</dt><dd>{formatTime(state.selectedTimeSlot.startTime, locale)} – {formatTime(state.selectedTimeSlot.endTime, locale)}</dd></div>
                <div><dt>{t.client}</dt><dd>{state.client.name}<span>{state.client.email} · {state.client.phone}</span></dd></div>
              </dl>
              <div className="form-actions">
                <button className="secondary-button" type="button" onClick={booking.goToPreviousStep}>{t.back}</button>
                <button className="primary-button" type="submit" disabled={state.isLoading}>{state.isLoading ? t.booking : t.confirmBooking} <span aria-hidden="true">→</span></button>
              </div>
            </form>
          )}

          {state.step === 'success' && state.appointment && (
            <div className="success-state">
              <div className="success-icon" aria-hidden="true">✓</div>
              <p className="eyebrow">{t.successEyebrow}</p>
              <h2>{t.successTitle}</h2>
              <p>{t.successCopy(state.client.email)}</p>
              <div className="success-date">
                <strong>{formatDate(state.appointment.date, locale, t.notSelected)}</strong>
                <span>{formatTime(state.appointment.timeSlot.startTime, locale)} – {formatTime(state.appointment.timeSlot.endTime, locale)} · {t.initialConsultation}</span>
              </div>
              <button className="secondary-button" type="button" onClick={booking.resetBooking}>{t.bookAnother}</button>
            </div>
          )}
        </section>
      </div>
      <footer className="footer-note">{t.footer}</footer>
    </main>
  )
}

export default App
