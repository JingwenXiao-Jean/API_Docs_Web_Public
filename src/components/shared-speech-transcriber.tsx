import { observer } from 'mobx-react'
import React, { useEffect, useRef, useState } from 'react'
import { ELEVEN_LABS_API_KEY } from '../constants/settings';
import axios from 'axios';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { Mic, MicOff, StopCircle } from '@mui/icons-material';
import VmIconButton from './shared-icon-button';
import { ColorScheme } from '../constants/options';
import useStores from '../hooks/use-stores';
import { GetErrorInfo } from '../utilities/general';
import { t, use } from 'i18next';

interface VmSpeechTranscriberRes {
  language_code: string;
  language_probability: number;  // 0 - 1
  transcript: string;
}

interface OptionProps {
  tag_audio_events?: boolean,
  diarize?: boolean,
  language_code?: TranscriberLanguageCode | null
}

export enum TranscriberLanguageCode {
  ENGLISH = 'en',
  CHINESE = 'zh',
  // Add more languages as needed
}

const VmSpeechTranscriber = observer(({ className, preCheckPermission = true, onTranscriptReady, recordingStatusCallback, options = {} }: { className?: string, preCheckPermission?: boolean, onTranscriptReady?: (transcription: VmSpeechTranscriberRes) => void, recordingStatusCallback?: (isRecording: boolean) => void | any, options?: OptionProps }) => {
  const { rootStore } = useStores();
  const [recording, setRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [transcribing, setTranscribing] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [transcription, setTranscription] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    if (!preCheckPermission) return;

    const checkMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasPermission(true);
        stream.getTracks().forEach(track => track.stop()); // Stop the stream after checking permission
      } catch (error) {
        setHasPermission(false);
      }
    }

    checkMicrophonePermission();
  }, []);

  const handleStartRecording = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('getUserMedia not supported on this browser');
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        recordingStatusCallback && recordingStatusCallback(true);
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        handleUploadAudio()
      };

      audioChunks.current = [];
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      setHasPermission(false);
      rootStore.notify("Failed to access user media", "error");
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleUploadAudio = async () => {
    setTranscribing(true);
    recordingStatusCallback && recordingStatusCallback(false);

    const audioBlob = new Blob(audioChunks.current, { type: 'audio/mp3' });
    const url = URL.createObjectURL(audioBlob);
    setAudioURL(url);

    const file = new File([audioBlob], "recording.mp3", { type: "audio/mp3" });

    // Upload to ElevenLabs
    const formData = new FormData();
    formData.append("file", file);

    formData.append("tag_audio_events", options?.tag_audio_events ? "true" : "false");  // whether to tag audio events
    formData.append("diarize", options?.diarize ? "true" : "false");  // whether to check for multiple speakers
    formData.append("model_id", "scribe_v1");  // only one modal atm
    if (options?.language_code) {
      formData.append("language_code", options.language_code.toString());  // language code
    }

    console.log(options?.language_code?.toString())

    try {
      const response = await axios.post("https://api.elevenlabs.io/v1/speech-to-text", formData, {
        headers: {
          "xi-api-key": ELEVEN_LABS_API_KEY,
        },
      })

      const result = await response.data;

      setTranscription(result.text);
      onTranscriptReady && onTranscriptReady({
        language_code: result.language_code,
        language_probability: result.language_probability,
        transcript: result.text
      }); // Call the callback function with the transcription

      setTranscribing(false);
    } catch (error) {
      setTranscribing(false);
      const errorMessage = GetErrorInfo(error);
      rootStore.notify(errorMessage, "error");
    }
  }

  return (
    <Box className={` ${className}`}>
      <Tooltip title={recording ? t('STOP_RECORDING') : t('SPEECH_TO_TEXT')} placement='top' arrow>
        <Button variant='contained' color={recording ? "error" : undefined} onClick={recording ? handleStopRecording : handleStartRecording} disabled={!hasPermission} sx={{ opacity: hasPermission ? 1 : 0.5, paddingX: 1, borderRadius: "1rem", textTransform: "unset" }}>
          <Box className={`flex gap-1 items-center justify-center`}>
            {
              recording ? <StopCircle sx={{ color: "white" }} />
                : !hasPermission ? <MicOff color='disabled' />
                  : <Mic />
            }
            {
              !hasPermission ? <p className='text-sm' >{t('FAILED_TO_ACCESS_MICROPHONE')}</p>
                : recording ? <p className='text-sm' >{t('LISTENING')}...</p>
                  : transcribing ? <p className='text-sm' >{t('TRANSCRIBING')}...</p>
                    : <></>
            }
          </Box>
        </Button>
      </Tooltip>
    </Box>
  )
})

export default VmSpeechTranscriber