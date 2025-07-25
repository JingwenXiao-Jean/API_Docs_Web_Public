import React, { createContext, MutableRefObject, useContext, useRef, useState } from 'react';
import { BookingStatus } from '../constants/options';

interface AIControlContextType {
  // tableBookingPageStatus: BookingStatus;
  // setTableBookingPageStatus: (tableBookingPageStatus: BookingStatus) => void;
  // openConfirmationModal: boolean;
  // setOpenConfirmationModal: (openConfirmationModal: boolean) => void;
  // showConfirmationModalOrderId: number | null;
  // setShowConfirmationModalOrderId: (showConfirmationModalOrderId: number | null) => void;
}

const AIControlContext = createContext<AIControlContextType | undefined>(undefined);

export const AIControlProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const [reservationDetails, setReservationDetails] = useState<any>(null);
  // const [tableBookingPageStatus, setTableBookingPageStatus] = useState<BookingStatus>(BookingStatus.NOT_BOOKED);
  // const [openConfirmationModal, setOpenConfirmationModal] = useState<boolean>(false);
  // const [showConfirmationModalOrderId, setShowConfirmationModalOrderId] = useState<number | null>(null);

  return (
    <AIControlContext.Provider value={{}}>
      {children}
    </AIControlContext.Provider>
  );
};

export const useAIContext = () => {
  const context = useContext(AIControlContext);
  if (context === undefined) {
    throw new Error('useAIControl must be used within an AIControlProvider');
  }
  return context;
};
