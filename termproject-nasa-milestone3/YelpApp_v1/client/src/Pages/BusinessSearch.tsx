import React, {Component, SyntheticEvent} from "react";
import { components, default as ReactSelect } from "react-select";

import BusinessResponse from '../utils/NASAtypes';
import BusinessData from '../utils/NASAtypes';
import CategoriesData from '../utils/NASAtypes';
import AttributesData from '../utils/NASAtypes';
import hoursData from '../utils/NASAtypes';
import distanceData from '../utils/NASAtypes';

import NASADataService from '../utils/NASADataService';

import {Column, Cell, Table2} from '@blueprintjs/table';
import {EditableText, Hotkey, HotkeysProvider, HTMLSelect} from '@blueprintjs/core';
import {Label, Spinner, ControlGroup, Button, Checkbox, Dialog, Classes} from '@blueprintjs/core';
import { isParameter, isTemplateTail } from "typescript";

import CanvasJSReact from '../canvasjs.react.js';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

type Props = {};
type State = {
    response: Array<BusinessData>,
    loading: boolean,
    selected: Array<BusinessData>,
    categories: Array<CategoriesData>,
    businessIDs: Array<string>
    selectedState: string,
    isStateSelected: boolean,
    popup: {bid: string, data: Array<any>},
    selectedCity: string,
    selectedZipCode: string,
    checkins: Array<any>,
    businessNameCheckIn: any,
    businessIDCheckIn: any,
    allSelected: string,
    selectedAttributes: string,
    selectedPrice: string,
    selectedMeal: string,
    selectedSort: string,
    tipText: string,
    filteredState: Array<BusinessData>,
    businessCategory: Array<CategoriesData>,
    businessAttributes: Array<AttributesData>,
    BuisnessAttributes: Array<any>,
    BusinessDisplayName: string,
    SelectedBusiness: any,
    SelectedBusinessHours: Array<hoursData>,
    user_id: string
    distances : Array<distanceData>
};

const BusinessStates: string[] = []

class BusinessSearch extends Component<Props, State>
{
    constructor(props: Props) 
    {
        super(props);
        this.getBusinessByID = this.getBusinessByID.bind(this)
        this.getTipsByBusinessID = this.getTipsByBusinessID.bind(this)
        this.getCategories = this.getCategories.bind(this)
        this.postNewCheckIn = this.postNewCheckIn.bind(this)
        this.postNewTip = this.postNewTip.bind(this)
        this.getDistance = this.getDistance.bind(this)
        // this.postLikeTip = this.postLikeTip.bind(this)
        this.state = {
            response: [],
            loading: true,
            selected: [],
            businessIDs: [],
            categories: [],
            selectedState: "",
            isStateSelected: false,
            checkins: [], 
            businessNameCheckIn: "",
            businessIDCheckIn: "",
            popup: {bid: "", data: []},
            tipText: "",
            selectedCity: "",
            selectedZipCode: "",
            allSelected: "",
            selectedAttributes: "",
            selectedPrice: "",
            selectedMeal: "",
            selectedSort: "",
            filteredState: [],
            businessCategory: [],
            businessAttributes: [],
            BuisnessAttributes: [],
            BusinessDisplayName: "",
            SelectedBusiness: '',
            SelectedBusinessHours: [],
            user_id: '4XChL029mKr5hydo79Ljxg',
            distances: []
        }
    }

    componentDidMount(){
       this.getAllBusinesses();
       this.getDistance();
       this.getSort('name');
       this.getCategories();
    }

    getBusinessByID(id: string) {
        NASADataService.getBusinessByID(id)
            .then((res: any) => {
               this.setState({
                   response: res.data,
                   selected: res.data,
                   loading: false
               }); 
            })
            .catch((e: Error) => {
                console.log(e);
            })
    }

    getDistance() {
        NASADataService.getDistance(this.state.user_id)
        .then((res: any) => {
            this.setState({
                distances: res.data
            })
        })
        .catch((e: Error) => {
            console.log(e);
        })
    }

    postLikeTip(uid: string, bid: string, text: string) {
        NASADataService.postLikeTip(uid, bid, text)
           .then((res: any) => {
              console.log(res)
           })
    }

    getTipsByBusinessID(id: string)
    {
        NASADataService.getTipsBusinessByID(id)
            .then((res: any) => {
                this.setState({
                    popup: {bid: id, data: res.data}
                });
            })
            .catch((e: Error) => {
                console.log(e);
            }) 
    }

    getCheckInsByBusinessID(bid: string)
    {
        NASADataService.getCheckInsBusinessID(bid)
            .then((res: any) => {
                this.setState({
                    checkins: res.data
                });
            })
            .catch((e: Error) => {
                console.log(e);
            })
    }

    getAllBusinesses(){
        NASADataService.getAllBusinesses()
        .then((res: any) => {
           this.setState({
               response: res.data,
               selected: res.data,
               loading: false
           }); 
        })
        .catch((e: Error) => {
            console.log(e);
        }) 
    }

    getBuisnessHours(bid: string) {
        NASADataService.getBusinessHours(bid)
        .then((res: any) => {
            this.setState({
                SelectedBusinessHours: res.data
            });
        })
        .catch((e: Error) => {
            console.log(e);
        })
    }

    getCategories(){
        NASADataService.getCategories()
            .then((res: any) => {
               this.setState({
                   categories: res.data,
                   loading: false
               }); 
            })
            .catch((e: Error) => {
                console.log(e);
            })
    }

    getCategoriesByID(id: string) {
        NASADataService.getCategoriesBusinessID(id)
            .then((res: any) => {
               this.setState({
                   businessCategory: res.data,
                   selected: res.data,
                   loading: false
               }); 
            })
            .catch((e: Error) => {
                console.log(e);
            })
    }

    getAttributesByID(id: string) {
        NASADataService.getAttributesBusinessID(id)
            .then((res: any) => {
               this.setState({
                   businessAttributes: res.data,
                   selected: res.data,
                   loading: false
               }); 
            })
            .catch((e: Error) => {
                console.log(e);
            })
    }

    postNewCheckIn(bmonth:string, bday:string, btime:string, bid: string) { 
        NASADataService.postNewCheckIn(bmonth, bday, btime, bid)
           .then((res: any) => {
                console.log(res)
           })
    }
    
    postNewTip(uid: string, bid: string, text: string) {
      NASADataService.postNewTip(uid, bid, text)
         .then((res: any) => {
            console.log(res)
         })
    }

    getState(state: string) {
        NASADataService.getState(state)
            .then((res: any) => {
               this.setState({
                   selected: res.data,
                   loading: false
               }); 
            })
            .catch((e: Error) => {
                console.log(e);
            })
    }

    getFilterByAttributes(attribute: string) {
        NASADataService.getAttributesByAttribute(attribute)
            .then((res: any) => {
               this.setState({
                   selected: res.data,
                   loading: false
               }); 
            })
            .catch((e: Error) => {
                console.log(e);
            })
    }

    getSort(sort: string) {
        NASADataService.getSort(sort)
            .then((res: any) => {
               this.setState({
                   selected: res.data,
                   loading: false
               }); 
            })
            .catch((e: Error) => {
                console.log(e);
            })
    }

    getFilteredByCategories(category: string , zipcode: string, city: string, state: string){
        NASADataService.getFilteredByCategories(category, zipcode, city, state)
            .then((res: any) => {
               this.setState({
                   selected: res.data,
                   loading: false
               }); 
            })
            .catch((e: Error) => {
                console.log(e);
            })
    }

    render() {
    const {response, loading, selected, selectedState, isStateSelected, selectedCity, selectedZipCode} = this.state;
    if (loading) {
        return(
            <div>
                <br/>
                <br/>
                <Spinner intent="primary" />
            </div>
        );
    }

    for (var i in response)
    {
        BusinessStates.push(response[i].state);
    }
    var uniqueStates = BusinessStates.filter(((item, i, ar) => ar.indexOf(item) === i))

    //getting the unique cities for a given state
    var statesAndCities = [];

    for (var i in uniqueStates)
    {
        const cities = []
        const selectedState = response.filter(function(business) {
            return business.state === uniqueStates[i];
        })
        for(var j in selectedState)
        {
            cities.push(selectedState[j].city)
        }

        const uniqueCities = cities.filter(((item,i,ar) => ar.indexOf(item) === i))
        statesAndCities.push({
            state: uniqueStates[i],
            cities: uniqueCities
        })
    }

    const DisplayTips = (bid: string) => {
        this.getTipsByBusinessID(bid);
    }

    const ViewCheckIns = (bid: string, bname: string) => {
        this.getCheckInsByBusinessID(bid);
        this.setState({'businessNameCheckIn': bname, 'businessIDCheckIn': bid})
    }

    const PostLikeATip = async(uid: string, bid: string, tiptext: string) => {
        await this.postLikeTip(uid, bid, tiptext)
        this.setState( {'popup': {bid:"", data:[]}})
        this.getTipsByBusinessID(bid)
    }
      
    var allZipcodes = []; 

    //Gets all zipcodes
    for (var i in response){
        allZipcodes.push(response[i].zipcode);
    }
    //Filters zipcodes to only contain unique zipcodes
    var uniqueZipcodes = allZipcodes.filter(((item, i, ar) => ar.indexOf(item) === i))
    
    var zipAndBid: any[];
    zipAndBid = []

    //Gets all the business ids for the given zipcode
    for (var i in uniqueZipcodes)
    {
        const businessID = []
        const selectedZips = response.filter(function(business) {
            return business.zipcode === uniqueZipcodes[i];
        })
        for(var j in selectedZips)
        {
            businessID.push(selectedZips[j].business_id)
        }

        const uniqueBusinessId = businessID.filter(((item,i,ar) => ar.indexOf(item) === i))
        zipAndBid.push({
            zipcode: uniqueZipcodes[i],
            businessId: uniqueBusinessId
        })
    }

    //Combines all the common business ids and puts the categories that go with that id
    var bidAndCategories = new Map;
    this.state.categories.forEach(element => {
        if(bidAndCategories.get(element.business_id)){
            bidAndCategories.get(element.business_id).push(element.category_name)
        }
        else{
            bidAndCategories.set(element.business_id, [element.category_name])
        }
    })

    var zipAndCategories = new Map;

    //Gets all the business id's for a given zipcode
    for (var i in zipAndBid){
        var cat = []
        const b = zipAndBid[i].businessId
        for (var j in b){
            if (bidAndCategories.get(b[j])){
                cat.push(bidAndCategories.get(b[j]))
            }
        }
        var allCategories = [];
        for (var k in cat){
            for (var l in cat[k]){
               allCategories.push(cat[k][l]) 
            }
        }
        
        zipAndCategories.set(zipAndBid[i].zipcode, allCategories)
    }

    //you need to define a render for every column of the table
    
    const SelectCellRenderer = (rowIndex: number) => (
        <Button className="DisplayTipsButtons" text="Show" onClick={() => DisplayTips(this.state.selected[rowIndex].business_id)}/>
    );

    const NameCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.selected[rowIndex].name}</Cell>
    );

    const DistanceCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.distances[rowIndex].distance}</Cell>
    );

    const AddressCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.selected[rowIndex].address}</Cell>
    );

    const CityCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.selected[rowIndex].city}</Cell>
    );

    const StateCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.selected[rowIndex].state}</Cell>
    );

    const ZipcodeCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.selected[rowIndex].zipcode}</Cell>
    );
    
    const StarsCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.selected[rowIndex].stars}</Cell>
    );

    const NumTipsCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.selected[rowIndex].num_tips}</Cell>
    );

    const CheckinCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.selected[rowIndex].num_checkins}</Cell>
    );

    const ViewCheckinsRenderer = (rowIndex: number) => (
        <Button className="DisplayTipsButtons" text="View" onClick={() => ViewCheckIns(this.state.selected[rowIndex].business_id, this.state.selected[rowIndex].name)}/>
    );
    //end of the renderers for the table


    // Renderers for the Tip table
    const DateCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.popup.data[rowIndex].tip_date}</Cell>
    );

    const UserNameCellRenderer = (rowIndex: number) => (
        <Cell> {this.state.popup.data[rowIndex].name} </Cell>
    );

   

    const LikesCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.popup.data[rowIndex].likes }</Cell>
    );

    const TextCellRenderer = (rowIndex: number) => (
        <Cell>{this.state.popup.data[rowIndex].text } </Cell>
    );

    const LikeTipCellRenderer = (rowIndex: number) => (
        <Button className="DisplayTipsButtons" text="Like" intent="primary" onClick={() => PostLikeATip(this.state.popup.data[rowIndex].user_id, this.state.popup.data[rowIndex].business_id, this.state.popup.data[rowIndex].text)}/>
    );

    const MakeTipTable = () => {
        return <HotkeysProvider>
            <Table2 numRows={this.state.popup.data.length}>
                <Column name='Date' cellRenderer={DateCellRenderer}/>
                <Column name='User Name' cellRenderer={UserNameCellRenderer}/>
                <Column name='Likes' cellRenderer={LikesCellRenderer}/>
                <Column name='Text' cellRenderer={TextCellRenderer}/>
                <Column name='Like' cellRenderer={LikeTipCellRenderer}/>
            </Table2> 
        </HotkeysProvider>
    }

    const months:string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const graphoptions = {
        theme: "light2",
        title:{
            text: "Number of Check-ins Per Month",
            fontSize: 24
        },
        axisX: {
            title: "Month",
            titleFontSize: 16
        },
        axisY: {
            title: "Number of Check-ins", 
            includeZero: true,
            titleFontSize: 16
        },
        data: [{
            type: "column",
            dataPoints: this.state.checkins.map(x=>({"y":Number(x.numcheckins), "label":months[Number(x.checkin_month)-1]}))
        }]
    }

    const MakeCheckInGraph = () => {
        console.log(this.state.checkins)
        return (
            <CanvasJSChart options = {graphoptions}/>
        );
    }

    const handleCheckIn = () => {
        // Post new checkin
        PostNewCheckIn()

        // Close the popup
        this.setState({"checkins": []})
    }

    const PostNewCheckIn = async() => {
        // get values
        let date = new Date();
        let month = String(date.getMonth() + 1);
        let day = String(date.getDate());
        let hours = String(date.getHours())
        let mins = String(date.getMinutes())
        let seconds = String(date.getSeconds())

        if (month.length == 1)
            month = "0" + month
        if (day.length == 1)
            day = "0" + day
        if (hours.length == 1)
            hours = "0" + hours
        if (mins.length == 1)
            mins = "0" + mins
        if (seconds.length == 1)
            seconds = "0" + seconds

        let time = hours + ":" + mins + ":" + seconds

        await this.postNewCheckIn(month, day, time, this.state.businessIDCheckIn)
        // Get the new checkins to that it immediately shows up in the table
        this.getCheckInsByBusinessID(this.state.businessIDCheckIn);
    }

    const MakeNewTipForm = () => {
       return <div className="TipForm">
            <EditableText
               className="TipTextbox" multiline={true} minLines={3} maxLines={3}
               onConfirm={(text) => this.setState({tipText: text})}>
            </EditableText>
            <Button
               className="TipButton" text="Post Tip" icon="edit"
               onClick={PostTipClicked}>
            </Button>
         </div>
    }

    const PostTipClicked = async() => {
       const tipText: string = this.state.tipText
       if (tipText.length > 0) {
         this.setState({tipText: ""})
         await this.postNewTip("", this.state.popup.bid, tipText)
         this.getTipsByBusinessID(this.state.popup.bid)
       }
       this.getAllBusinesses()
    }

    //selection handler for choosing states from the drop down list
    const StateSelectionChanged = (event: { target: { value: any; }; }) => 
    {
        this.setState({
            selectedState: event.target.value,
            isStateSelected: true,
            allSelected: event.target.value
        })
    }

    //figuring out the cities option for the selected state
    let cityOptions: string | string[] = []
    const selectedStatesCities = statesAndCities.filter(function(state) {
        return state.state === selectedState
    })

    if (isStateSelected === true && selectedState !== "Select A State")
    {
        cityOptions = selectedStatesCities[0].cities
    }

    //handler for the city selector drop down
    const CitySelectionChanged = (event : {target : { value: any}; }) =>
    {
        const temp = this.state.allSelected + "," + event.target.value
        this.setState({
            selectedCity: event.target.value,
            allSelected: temp
        })

    }

    //handler for the zipcode selector drop down
    const ZipcodeSelectionChanged = (event : {target : { value: any}; }) =>
    {
        const temp = this.state.allSelected + "," + event.target.value
        this.setState({
            selectedZipCode: event.target.value,
            allSelected: temp
        })
    }

    //figuring out the zipcodes of a selected city
    let zipcodeOptions: string | string[] = []
    for(var i in response)
    {
        if (zipcodeOptions[0] != "Select Zipcode")
        {
            if (response[i].city === selectedCity)
            {
                //this city is the one selected, see if we have that zipcode now
                if (zipcodeOptions.includes(response[i].zipcode) === false)
                {
                    zipcodeOptions.push(response[i].zipcode)
                }
            }
        }
    }

    let categoryOptions= []
    if (selectedZipCode !== "")
    {
        for (var i in zipAndCategories.get(selectedZipCode)){
            categoryOptions.push({
                value: zipAndCategories.get(selectedZipCode)[i],
                label: zipAndCategories.get(selectedZipCode)[i]
            })
        }
    }

    //handler for the zipcode selector drop down
    const CategorySelectionChanged = (value: any) =>
    {
        var temp = this.state.allSelected;
        for (var i in value){
            temp += "!" + value[i].value
        }
        this.setState({
            allSelected: temp
        })
    }
    
    // Sets attribute, price, meal, and sort options for drop down
    let attributeOptions = []
    attributeOptions.push({label: 'Accepts Credit Cards', value:'BusinessAcceptsCreditCards'})
    attributeOptions.push({label: 'Reservations', value:'RestaurantsReservations'})
    attributeOptions.push({label: 'Wheelchair Accessible', value:'WheelchairAccessible'})
    attributeOptions.push({label: 'Outdoor Seating', value:'OutdoorSeating'})
    attributeOptions.push({label: 'Good For Kids', value:'GoodForKids'})
    attributeOptions.push({label: 'Good For Groups', value:'RestaurantsGoodForGroups'})
    attributeOptions.push({label: 'Delivery', value:'RestaurantsDelivery'})
    attributeOptions.push({label: 'Take Out', value:'RestaurantsTakeOut'})
    attributeOptions.push({label: 'WiFi', value:'WiFi'})
    attributeOptions.push({label: 'Bike Parking', value:'BikeParking'})

    let priceOptions = []
    priceOptions.push({label: '$', value:'1'})
    priceOptions.push({label: '$$', value:'2'})
    priceOptions.push({label: '$$$', value:'3'})
    priceOptions.push({label: '$$$$', value:'4'})

    let mealOptions = []
    mealOptions.push({label: 'Breakfast', value:'breakfast'})
    mealOptions.push({label: 'Brunch', value:'brunch'})
    mealOptions.push({label: 'Lunch', value:'lunch'})
    mealOptions.push({label: 'Dinner', value:'dinner'})
    mealOptions.push({label: 'Late Night', value:'latenight'})
    mealOptions.push({label: 'Dessert', value:'dessert'})

    let sortOptions = []
    sortOptions.push({label: 'Name (default)', value:'name'})
    sortOptions.push({label: 'Highest Rating', value:'stars'})
    sortOptions.push({label: 'Most Number of Tips', value:'num_tips'})
    sortOptions.push({label: 'Most Checkins', value:'num_checkins'})
    sortOptions.push({label: 'Nearest', value:'distance'})

    //handler for the attribute selector drop down
    const AttributeSelectionChanged = (value: any) => {
        var temp = "";
        for (var i in value){
            temp += "_" + value[i].value + ":"
            if (value[i].value === 'WiFi'){
                temp += "free"
            }
            else{
                temp += "True"
            }
        }
        this.setState({
            selectedAttributes: temp
        })
    }

    //handler for the meal selector
    const MealSelectionChanged = (value: any) => {
        var temp = "";
        for (var i in value){
            temp += "_" + value[i].value + ":"
            if (value[i].value === 'WiFi'){
                temp += "free"
            }
            else{
                temp += "True"
            }
        }
        this.setState({
            selectedMeal: temp
        })
    }

    //handler for the price selector
    const PriceSelectionChanged = (value: any) => {
        var temp = "";
        for (var i in value){
            temp += "_RestaurantsPriceRange2:" + value[i].value
        }
        this.setState({
            selectedPrice: temp
        })
    }

    //handler for the sort selector
    const SortSelectionChanged = (value: any) => {
        this.setState({
            selectedSort: value.value
        })
    }

    //Filters from provided options: state, city, and zipcode
    const handleFilter = () => {
        var selected = this.state.allSelected + this.state.selectedAttributes + this.state.selectedMeal + this.state.selectedPrice
        if (this.state.selectedSort.length > 0){
           selected += "+" + this.state.selectedSort
        }

        console.log(selected)
        if (selected[0] == "_"){
            this.getFilterByAttributes(selected)
        }
        else if (selected[0] == "+"){
            this.getSort(this.state.selectedSort)
        }
        else{
            this.getState(selected)
        }
    }


    const ViewDetailsRenderer = (rowIndex: number) => (
        <Button className="DisplayTipsButtons" text="View" onClick={() => DisplayDetails(this.state.selected[rowIndex].business_id, this.state.selected[rowIndex])}/>
    );

    const DisplayDetails = (bid: string, business: any) => {
        this.getAttributesByID(bid);
        this.getCategoriesByID(bid);
        this.getBuisnessHours(bid);
        this.setState({'SelectedBusiness': business});
    }

    return(
        <div>
            <h3>Table Options</h3>
            <ControlGroup>
                <HTMLSelect onChange={StateSelectionChanged} options={uniqueStates}>
                    <option disabled selected>Select State</option>
                </HTMLSelect>
                <HTMLSelect onChange={CitySelectionChanged} options={cityOptions}>
                    <option disabled selected>Select City</option>
                </HTMLSelect>
                <HTMLSelect onChange={ZipcodeSelectionChanged} options={zipcodeOptions}>
                    <option disabled selected>Select Zipcode</option>
                </HTMLSelect>
                <div className="menu">
                    <ReactSelect placeholder="Select Categories" options={categoryOptions} isMulti={true} onChange={CategorySelectionChanged}/>
                </div>
                <div>
                    <ReactSelect placeholder="Select Attributes" options={attributeOptions} isMulti={true} onChange={AttributeSelectionChanged}/> 
                </div>
                <div>
                    <ReactSelect placeholder="Select Price" options={priceOptions} isMulti={true} onChange={PriceSelectionChanged}/> 
                </div>
                <div>
                    <ReactSelect placeholder="Select Meal" options={mealOptions} isMulti={true} onChange={MealSelectionChanged}/> 
                </div>
                <Button icon='filter' text="Filter States" onClick={handleFilter}/>
                <br />
                <br />
                <ReactSelect placeholder="Select Sort" options={sortOptions} isMulti={false} onChange={SortSelectionChanged}/> 
                <Button icon='filter' text="Sort" onClick={handleFilter}/>
            </ControlGroup>
            <br />
          <div style={{padding:'100px', height: '600px', width: '1100px'}}>
              <HotkeysProvider>
                <Table2 numRows={this.state.selected.length}>
                    <Column name='Business Name' cellRenderer={NameCellRenderer}/>
                    <Column name='Address' cellRenderer={AddressCellRenderer}/>
                    <Column name='City' cellRenderer={CityCellRenderer} />
                    <Column name='State' cellRenderer={StateCellRenderer}/>
                    <Column name='Zipcode' cellRenderer={ZipcodeCellRenderer}/>
                    <Column name='Stars' cellRenderer={StarsCellRenderer} />
                    <Column name='Number of Checkins' cellRenderer={CheckinCellRenderer} />
                    <Column name='Number of Tips' cellRenderer={NumTipsCellRenderer} />
                    <Column name='Display Tips' cellRenderer={SelectCellRenderer}/>
                    <Column name='View Checkins' cellRenderer={ViewCheckinsRenderer}/>
                    <Column name='View Details' cellRenderer={ViewDetailsRenderer} />
                </Table2> 
              </HotkeysProvider>
          </div>
            {this.state.popup.bid.length > 0?<Dialog
            title="Tips"
            isOpen={true}
            onClose={()=>{this.setState( {'popup': {bid:"", data:[]}, loading: true}); this.getAllBusinesses();}}
            >
            <div className={Classes.DIALOG_BODY}>
                {MakeNewTipForm()}
                {MakeTipTable()}
            </div>
            </Dialog>:""}

            {this.state.checkins.length > 0?<Dialog
                title="Check In"
                isOpen={true}
                onClose={()=>{this.setState({'checkins': [], 'businessIDCheckIn': "", 'businessNameCheckIn': ""}); this.getAllBusinesses();}}>
                <div className={Classes.DIALOG_BODY}>
                    <h3 style={{paddingBottom:"30"}}> Business Name: {this.state.businessNameCheckIn} </h3>
                    <br></br>
                    {MakeCheckInGraph()}
                    <br></br>
                    <Button text="Check In" intent="success" fill={true} onClick={handleCheckIn}/>
                </div>
            </Dialog>:""}

            {this.state.businessAttributes.length >0? <Dialog
                title="Details"
                isOpen={true}
                onClose={()=>{this.setState({'businessAttributes' : [], 'BusinessDisplayName' : ""})}}
                >
                <div className={Classes.DIALOG_BODY}>
                    <h3 style={{paddingBottom:"30"}}>{this.state.SelectedBusiness.name}</h3>
                    <h4>{this.state.SelectedBusiness.address}</h4>
                    <h4>Hours</h4>
                    <div>
                        {this.state.SelectedBusinessHours.map((data, i) => <><li key={i}>{data.day_of_week}</li> <li key={i}>{data.business_open} - {data.business_close}</li> </>)}
                    </div>
                    <div>
                        <h3>Attributes</h3>
                        {this.state.businessAttributes.map((data, i) => <li key={i}>{data.attribute_name}</li>)}
                        <h3>Categories</h3>
                        {this.state.businessCategory.map((data, i) => <li key={i}>{data.category_name}</li>)}
                        
                    </div>
                </div>
                </Dialog>:""}
    
        </div>
      );
  }
}

export default BusinessSearch;