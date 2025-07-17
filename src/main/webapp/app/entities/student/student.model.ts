export interface IStudent {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };
