'use client';

import type { Patient } from '../../../../libs/dtos/patient.schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type Props = {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
};

export function PatientsDrawer({ patient, open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {patient?.firstName} {patient?.lastName}
          </DialogTitle>
          <DialogDescription>Patient Details</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {patient?.email}
          </p>
          <p>
            <strong>Phone:</strong> {patient?.phoneNumber || 'N/A'}
          </p>
          <p>
            <strong>DOB:</strong> {patient ? new Date(patient.dob).toLocaleDateString() : ''}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
