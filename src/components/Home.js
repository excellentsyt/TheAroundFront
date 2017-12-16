import React from 'react';
import { Tabs, Button, Spin } from 'antd';
import { GEO_OPTIONS} from "../constants"
import { POS_KEY, AUTH_PREFIX, TOKEN_KEY, API_ROOT } from "../constants"
import $ from 'jquery';

const TabPane = Tabs.TabPane;
const operations = <Button>Extra Action</Button>;

export class Home extends React.Component {
    state = {
        posts: [],
        error: "",
        loadingPosts: false,
        loadingGeoLocation: false,
    }


    componentDidMount() {
        if ("geolocation" in navigator) {
            this.setState({
                loadingGeoLocation:true,
            });
            navigator.geolocation.getCurrentPosition(
                this.onSuccessGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            this.setState({
                error: "Your browser does not support geolocattion!"
            });
        }
    }

    onSuccessGeoLocation = (position) => {
        console.log(position);
        this.setState({
            error: "",
            loadingGeoLocation: false,
        });
        const {latitude: lat, longitude: lon} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({lat: lat, lon: lon}));

        this.loadNearByPosts();
    }

    onFailedLoadGeoLocation = (error) => {
        this.setState({
            loadingGeoLocation: false,
            error: "Failed to load geo location!",
        });
    }

    getGalleryPanelContent = () => {
        if (this.state.error) {
            return <div>{this.state.error}</div>
        } else if (this.state.loadingGeoLocation) {
            // show spinner
            return <Spin tip="Loading geo location ..."/>
        } else if (this.state.loadingPosts) {
            return <Spin tip={"Loading posts ..."}/>
        }

        return null;
    }

    loadNearByPosts = () => {
        //const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        const { lat, lon } = {"lat": 37.56, "lon": -122.3255};

        this.setState({loadingPosts: true});
        $.ajax({
           url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20`,
           method: 'GET',
           headers: {
               Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
           }
        }).then((response) => {
                console.log(response);
                this.setState({
                    posts: response,
                    loadingPosts: false,
                });
            }, (error) => {
                this.setState({
                    error: error.responseText,
                    loadingPosts: false,
                });
            }
        ).catch((error) => {
                this.setState({ error: error });
            }
        );
    }

    render() {
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">
                    Content of tab 2
                </TabPane>
            </Tabs>
        );
    }
}