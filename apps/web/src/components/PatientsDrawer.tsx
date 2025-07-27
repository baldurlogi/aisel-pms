'use client';

import type { Patient } from '../../../../libs/dtos/patient.schema';
import { PatientForm } from './PatientForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';

type Props = {
  patient: Patient | null;
  open: boolean;
  onClose: () => void;
  refetch: () => void;
};

export function PatientsDrawer({ patient, open, onClose, refetch }: Props) {
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
          <PatientForm
            mode="edit"
            defaultValues={{
              firstName: patient?.firstName ?? '',
              lastName: patient?.lastName ?? '',
              email: patient?.email ?? '',
              phoneNumber: patient?.phoneNumber ?? '',
              dob: patient?.dob?.slice(0, 10) ?? '',
            }}
            onSubmit={async data => {
              try {
                if (!patient) return;
                console.log('Updating patient:', patient.id, data);
                await api.patch(`/patients/${patient.id}`, data);
                onClose();
                await refetch();
              } catch (err) {
                console.error('❌ Update failed:', err);
                alert('Failed to update patient. Check the console for details.');
              }
            }}
          />
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-red-600 mt-4 text-sm hover:underline">Delete Patient</button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the patient.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  if (!patient) return;
                  await api.delete(`/patients/${patient.id}`);
                  onClose();
                  await refetch(); // refresh the list
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
