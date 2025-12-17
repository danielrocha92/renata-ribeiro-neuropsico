import React, { useState, useEffect } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import styles from '@/styles/JitsiMeet.module.css';

interface JitsiMeetComponentProps {
    roomName: string;
    userName: string;
    onEnd: () => void;
}

const JitsiMeetComponent: React.FC<JitsiMeetComponentProps> = ({ roomName, userName, onEnd }) => {
    return (
        <div className={styles.container}>
            <JitsiMeeting
                domain="meet.jit.si"
                roomName={roomName}
                configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    prejoinPageEnabled: false,
                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security'
                    ],
                }}
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
