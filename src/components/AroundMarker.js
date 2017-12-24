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
        return (
            <Marker
                position={this.props.position}
                onClick={this.onToggleOpen}
            >
                {this.state.isOpen && <InfoWindow onCloseClick={this.onToggleOpen}>
                    <div>wrwrwerewr</div>
                </InfoWindow>}
            </Marker>
        );
    }
}
