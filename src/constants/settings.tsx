export const isProduction = process.env.NODE_ENV === "production";
const prodAiVoiceBackendUrl = "https://vai-voice-api.vmor.com.au"

const enum BackendUrl {
  DEMO = 'https://demo_pmadminapi.vmor.com.au',
  PRODUCTION = 'https://vai-practitioner-api.vmor.com.au',
  LOCAL_254 = 'http://192.168.15.254:5193',
  LOCAL_253 = 'http://192.168.15.253:5001',
  LOCAL_252 = 'http://192.168.15.252:5001',
  LOCAL_249 = 'http://192.168.15.249:5195',
  LOCAL_250 = 'http://192.168.15.250:5193',
  JUNE = 'http://localhost:5001'
}

const prodBackEndUrl = BackendUrl.PRODUCTION;
const devBackEndUrl = BackendUrl.LOCAL_249;

export const backEndBaseURL = devBackEndUrl;
export const aiVoiceBackendUrl = isProduction ? prodAiVoiceBackendUrl : "https://106b-120-150-254-137.ngrok-free.app"; // 'http://192.168.15.252:45467/';
export const communityUrl = "https://community.propnova.com.au";
export const encryptedPassword = "*ENCRYPTEDPASSWORD*";
export const aiVoiceCategory = "clinic";

export const version = "0.0.8.1";

export const CURRENT_PLATFORM = 1;

export const ELEVEN_LABS_API_KEY = "sk_0e789f7c098ac9efad1bbd4fa63273a6f89f64ee48c5a04b";