import React from 'react';

export default function NetworkStatus({ isOnline, serverAvailable }) {
    if (isOnline && serverAvailable) {
        return (
            <div className="network-status online">
                You are online. Changes will sync immediately.
            </div>
        );
    }

    return (
        <div className="network-status offline">
            You are offline. Changes will be saved locally and synced when back online.
        </div>
    );
}