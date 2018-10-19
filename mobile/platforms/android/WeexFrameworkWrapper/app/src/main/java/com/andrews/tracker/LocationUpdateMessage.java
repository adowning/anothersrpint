package com.andrews.tracker;

import io.ably.lib.types.ErrorInfo;

public class LocationUpdateMessage{
    String position;
    ErrorInfo error;
    public LocationUpdateMessage(String _position ) {
        this.position = _position ;
    }
    public LocationUpdateMessage(ErrorInfo error ) {
        this.error = error ;
    }
}