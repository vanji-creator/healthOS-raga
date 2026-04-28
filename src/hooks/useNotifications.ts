import { useCallback } from 'react';
import { useUiStore } from '../store/uiStore';
import { sendLocalNotification } from '../utils/notifications';
import type { AppNotification } from '../types';

export function useNotifications() {
  const addNotification = useUiStore((s) => s.addNotification);

  const notify = useCallback(
    async (
      title: string,
      message: string,
      type: AppNotification['type'] = 'info',
      pushToSystem = false
    ) => {
      addNotification({ title, message, type });
      if (pushToSystem) {
        await sendLocalNotification(title, message);
      }
    },
    [addNotification]
  );

  const notifyCritical = useCallback(
    (patientName: string) =>
      notify(
        'Critical Patient Alert',
        `${patientName} requires immediate attention.`,
        'critical',
        true
      ),
    [notify]
  );

  const notifyAppointment = useCallback(
    (patientName: string, time: string) =>
      notify(
        'Upcoming Appointment',
        `${patientName} has an appointment at ${time}.`,
        'info',
        true
      ),
    [notify]
  );

  return { notify, notifyCritical, notifyAppointment };
}
