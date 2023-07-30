import React, {Component, SyntheticEvent} from "react";
import { components, default as ReactSelect } from "react-select";

import UsersData from '../utils/NASAtypes';
import FriendTipData from '../utils/NASAtypes';

import NASADataService from '../utils/NASADataService';

import {Column, Cell, Table2} from '@blueprintjs/table';
import {Hotkey, HotkeysProvider, HTMLSelect, EditableText, InputGroup, IRef} from '@blueprintjs/core';
import {Spinner, ControlGroup, Button, Checkbox, Dialog, Classes} from '@blueprintjs/core';
import Input from "react-select/dist/declarations/src/components/Input";
import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import { LabTest } from "@blueprintjs/icons/lib/esm/generated/16px/paths";


type Props = {};
type State = {
    response: Array<UsersData>,
    loading: boolean,
    selected: Array<UsersData>,
    allUsers: Array<UsersData>,
    userId: string, 
    userInfo: Array<string>,
    friendsList: Array<UsersData>,
    latestTip: Array<any>,
    lat: string,
    long: string
};

const UserState: string[] = []

class UserSearch extends Component<Props, State>{
    constructor(props: Props){
        super(props);
        this.getUserByID = this.getUserByID.bind(this);
        this.state = {
            response: [],
            loading: true,
            selected: [],
            allUsers: [],
            userId: '4XChL029mKr5hydo79Ljxg',
            userInfo: ["Name", "Stars", "Fans", "Yelped Since", "Tip Count", "Total Likes", "Cool", "Funny", "Useful"],
            friendsList: [],
            latestTip: [],
            lat: "",
            long: ""
        }
    }

    componentDidMount(){
        this.getUsers();
        this.getUserByID(this.state.userId)
        this.getUsersFriends(this.state.userId)
        this.getFriendsLatestTips(this.state.userId)
    }

    getUsers() {
        NASADataService.getAllUsers()
            .then((res: any) => {
                this.setState({
                    allUsers: res.data,
                    loading:false
                });
            })
            .catch((e: Error) => {
                console.log(e)
            })
    }

    getUsersFriends(id: string) {
        NASADataService.getUsersFriends(id)
            .then((res: any) => {
                this.setState({
                    friendsList: res.data,
                    loading:false
                });
            })
            .catch((e: Error) => {
                console.log(e)
            })
    }

    getFriendsLatestTips(id: string) {
        NASADataService.getLatestTips(id)
            .then((res: any) => {
                this.setState({
                    latestTip: res.data,
                    loading:false
                });
            })
            .catch((e: Error) => {
                console.log(e)
            })
    }

    getUserByID(id: string) {
        NASADataService.getUserByID(id)
            .then((res: any) => {
               this.setState({
                   response: res.data,
                   loading: false
               }); 
            })
            .catch((e: Error) => {
                console.log(e);
            })
    }

    render() {
        const {response, loading, selected} = this.state;
        if (loading){
            return(
                <div>
                    <br/>
                    <br/>
                    <Spinner intent="primary" />
                </div>
            );
        }

        const all = this.state.response;
        var userValues = [all[0].name, all[0].stars, all[0].fans, all[0].yelping_since, all[0].tip_count, all[0].total_likes, all[0].cool, all[0].funny, all[0].useful]
        //set value locally, not through the state i guess
        var localLong = all[0].longitude;
        var localLat = all[0].latitude;

        const TitleCellRenderer = (rowIndex: number) => (
            <Cell>{this.state.userInfo[rowIndex]}</Cell>
        );

        const ValueCellRenderer = (rowIndex: number) => (
            <Cell>{userValues[rowIndex]}</Cell>
        );

        const NameCellRenderer = (rowIndex: number) => (
            <Cell>{this.state.friendsList[rowIndex].name}</Cell>
        );

        const LikesCellRenderer = (rowIndex: number) => (
            <Cell>{this.state.friendsList[rowIndex].total_likes}</Cell>
        );
        
        const StarsCellRenderer = (rowIndex: number) => (
            <Cell>{this.state.friendsList[rowIndex].average_stars}</Cell>
        );
        
        const YelpedSinceCellRenderer = (rowIndex: number) => (
            <Cell>{this.state.friendsList[rowIndex].yelping_since}</Cell>
        );

        const UserNameCellRenderer = (rowIndex: number) => (
            <Cell>{this.state.latestTip[rowIndex].uname}</Cell>
        );

        const BusinessNameCellRenderer = (rowIndex: number) => (
            <Cell>{this.state.latestTip[rowIndex].bname}</Cell>
        );

        const CityCellRenderer = (rowIndex: number) => (
            <Cell>{this.state.latestTip[rowIndex].city}</Cell>
        );

        const TextCellRenderer = (rowIndex: number) => (
            <Cell>{this.state.latestTip[rowIndex].text}</Cell>
        );

        const DateCellRenderer = (rowIndex: number) => (
            <Cell>{this.state.latestTip[rowIndex].tip_date}</Cell>
        );

        var userOptions = []
        for (var i in this.state.allUsers){
            userOptions.push({label: this.state.allUsers[i].name, value: this.state.allUsers[i].user_id})
        }

        //handler for the user selector
        const UserSelectionChanged = (value: any) => {
            console.log(value)
            this.setState({
               userId : value
            })
        }

        const UserChanged = () => {
            console.log(this.state.userId)
            console.log("User changed")
            this.getUserByID(this.state.userId)
            this.getUsersFriends(this.state.userId)
            this.getFriendsLatestTips(this.state.userId)
        }
     
        var long: any;
        var lat: any;
        const handleUpdateLocation = () => {
           NASADataService.UpdateUserLocation(this.state.userId, lat, long);
        }

        const setLong = (event: string) => {
            long = event
        }

        const setLat = (event: string) => {
            lat = event
        }

        return(
            <div>
                <h3>User: {this.state.response[0].name}</h3>
                <div style={{outline: 'auto'}}>
                   <EditableText placeholder="Search User" onChange={UserSelectionChanged} maxLength={23}/>
                </div>
                <Button icon='filter' text="Change User" onClick={UserChanged}/> 
                <br />
                <br />
              <div style={{height: '210px', width: '310px'}}>
                  <HotkeysProvider>
                      <Table2 numRows={this.state.userInfo.length}>
                          <Column name="" cellRenderer={TitleCellRenderer} />
                          <Column name="" cellRenderer={ValueCellRenderer} />
                      </Table2>
                    </HotkeysProvider>
              </div> 
              <br />
              <ControlGroup>
                   <p>User Location (Longitude, Latitude):  </p>
                    <InputGroup 
                        placeholder="longitude"
                        defaultValue={localLong}
                        value={long}
                        onChange={e=>setLong(e.target.value)}
                        />
                    <InputGroup 
                        placeholder="latitude"
                        defaultValue={localLat}
                        value={lat}
                        onChange={e=>setLat(e.target.value)}
                        />
                    <Button 
                        text="Update Location"
                        onClick={handleUpdateLocation}/>
                </ControlGroup>
                <br />
                <hr/>
              <div style={{padding:'5px', height: '600px', width: '650px'}}>
                <h3>{this.state.response[0].name}'s Friends</h3>
                  <HotkeysProvider>
                      <Table2 numRows={this.state.friendsList.length}>
                          <Column name="Name" cellRenderer={NameCellRenderer} />
                          <Column name="Likes" cellRenderer={LikesCellRenderer} />
                          <Column name="Stars" cellRenderer={StarsCellRenderer} />
                          <Column name="Yelped Since" cellRenderer={YelpedSinceCellRenderer} />
                      </Table2>
                    </HotkeysProvider>
              </div> 
              <div style={{padding:'50px', height: '600px', width: '880px'}}>
                <h3>Latest Friend's Tips</h3>
                  <HotkeysProvider>
                      <Table2 numRows={this.state.latestTip.length}>
                          <Column name="User Name" cellRenderer={UserNameCellRenderer} />
                          <Column name="Business Name" cellRenderer={BusinessNameCellRenderer} />
                          <Column name="City" cellRenderer={CityCellRenderer} />
                          <Column name="Text" cellRenderer={TextCellRenderer} />
                          <Column name="Tip Date" cellRenderer={DateCellRenderer} />
                      </Table2>
                    </HotkeysProvider>
              </div>  
            </div>
          );
    }
}

export default UserSearch;