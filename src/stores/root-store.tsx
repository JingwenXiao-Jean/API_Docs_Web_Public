
import { observable, action, makeObservable } from 'mobx';
import UserStore from './user-store';
// import PractitionerStore from './practitioner-store';
// import PatientStore from './patient-store';
// import ClinicStore from './clinic-store';

interface WebNotification {
  message: string;
  options?: {
    variant: "success" | "error" | "info" | "warning";
  };
}

export default class RootStore {
  testVal = "TEST_VALUE";

  destination = "Select";

  notification: WebNotification = {
    message: "",
    options: {
      variant: "info",
    },
  };

  userStore;
//   practitionerStore;
//   patientStore;
//   clinicStore;

  constructor() {
    makeObservable(this, {
      testVal: observable,
      destination: observable,
      notification: observable,
      notify: action,
    });
    this.userStore = new UserStore(this);
    // this.practitionerStore = new PractitionerStore(this);
    // this.patientStore = new PatientStore(this);
    // this.clinicStore = new ClinicStore(this);

  }

  notify(msg: string, level?: "success" | "error" | "info" | "warning") {
    if (level) {
      this.notification = {
        message: msg,
        options: {
          variant: level,
        },
      };
    } else {
      this.notification = {
        message: msg,
      };
    }
  }
}
