import React from 'react';
import { Tabs, Spin } from 'antd';
import { GEO_OPTIONS} from "../constants"
import { POS_KEY, AUTH_PREFIX, TOKEN_KEY, API_ROOT } from "../constants"
import $ from 'jquery';
import {Gallery} from "./Gallery"
import { CreatePostButton} from "./CreatePostButton"
import { WrappedAroundMap } from "./AroundMap"

const TabPane = Tabs.TabPane;

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
        } else if (this.state.posts.length > 0) {
            const images = this.state.posts.map((post) => {
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                    caption: post.message,
                };
            });
            console.log(images);
            return <Gallery images={images}/>
        }
        return null;
    }

    loadNearByPosts = (location) => {
        let { lat, lon } = location ? location : JSON.parse(localStorage.getItem(POS_KEY));
        // const { lat, lon } = {"lat": 37.56, "lon": -122.3255};

        this.setState({loadingPosts: true});
        return $.ajax({
           url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20`,
           method: 'GET',
           headers: {
               Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
           }
        }).then((response) => {
                console.log(response);
                this.setState({
                    posts: response == null ? [] : response,
                    loadingPosts: false,
                    error: "",
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
        const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearByPosts}/>
        return (
            <Tabs tabBarExtraContent={createPostButton} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                </TabPane>
                <TabPane tab="Map" key="2">
                    <WrappedAroundMap
                        loadNearByPosts={this.loadNearByPosts}
                        posts={this.state.posts}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `400px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </TabPane>
            </Tabs>
        );
    }
}