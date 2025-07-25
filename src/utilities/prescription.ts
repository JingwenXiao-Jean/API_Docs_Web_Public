export enum Section { COMPLAINTS, SIGNS, TREATMENT, ACUPUNCTURE_PTS, MOXIBUSTION, MASSAGE, GUASHA, OTHER, REMARKS }

export const GetHistoryContentBySection = (section: any) => {
  switch (section) {
    case Section.COMPLAINTS: return "complaintSymptoms";
    case Section.SIGNS: return "signDiagnosis";
    case Section.TREATMENT: return "treatmentStrategies";
    case Section.ACUPUNCTURE_PTS: return "acupuncturePoints";
    case Section.MOXIBUSTION: return "moxibustion";
    case Section.MASSAGE: return "therapeuticalMessage";
    case Section.GUASHA: return "gusha";
    case Section.OTHER: return "others";
    default: return "remarks";
  }
};