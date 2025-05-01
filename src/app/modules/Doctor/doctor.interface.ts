export interface ISpecialty {
    specialtiesId: string;
    isDeleted: boolean
};

export type IDoctorFilterRequest = {
    searchTerm?: string | undefined;
    email?: string | undefined;
    contactNo?: string | undefined;
    gender?: string | undefined;
    specialties?: string | undefined;
};