import React from 'react';
import { Marker, InfoWindow } from 'react-google-maps';


export class AroundMarker extends React.Component {
    state = {
        isOpen: false,
    }

    onToggleOpen = () => {
        this.setState(preState => {
            return {isOpen: !preState.isOpen,}
        })
    }

    render() {
        const {location, url, message, user} = this.props.post;
        return (
            <Marker
                position={{lat: location.lat, lng: location.lon}}
                onClick={this.onToggleOpen}
                // onMouseOver={this.onToggleOpen()}
                // onMouseOut={this.onToggleOpen()}
            >
                {this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpen}>
                    <div>
                        <img className="around-marker-image" src={url} alt={`${user}:${message}`}/>
                        <p>{`${user}:${message}`}</p>
                    </div>
                </InfoWindow>}
            </Marker>
        );
    }
}
