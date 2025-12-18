import React, { useState, useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import styles from '@/styles/JitsiMeet.module.css';

interface JitsiMeetComponentProps {
    roomName: string;
    userName: string;
    onEnd: () => void;
}

const JitsiMeetComponent: React.FC<JitsiMeetComponentProps> = ({ roomName, userName, onEnd }) => {
    const configOverwrite = React.useMemo(() => ({
        startWithAudioMuted: true,
        disableModeratorIndicator: false, // Enable to see if user is moderator
        startScreenSharing: true,
        enableEmailInStats: false,
        prejoinPageEnabled: true, // Enable prejoin page to allow host authentication
    }), []);

    const interfaceConfigOverwrite = React.useMemo(() => ({
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        // Removed explicit TOOLBAR_BUTTONS to restore default UI elements,
        // ensuring the 'I am the host' authentication flow works correctly on desktop.
        SHOW_JITSI_WATERMARK: true,
        SHOW_WATERMARK_FOR_GUESTS: true,
    }), []);

    return (
        <div className={styles.container}>
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={configOverwrite}
                interfaceConfigOverwrite={interfaceConfigOverwrite}
                userInfo={{
                    displayName: userName,
                    email: '' // Email is required by type but can be empty if privacy is needed
                }}
                onApiReady={(externalApi) => {
                    // here you can attach custom event listeners to the Jitsi Meet External API
                    // e.g. externalApi.addEventListener('videoConferenceLeft', () => onEnd())
                    externalApi.addEventListener('videoConferenceLeft', () => {
                        onEnd(); // Call parent callback when user hangs up
                    });
                }}
                getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = '600px';
                }}
            />
        </div>
    );
};

export default JitsiMeetComponent;
