import http from './http-common';

import BusinessData from './NASAtypes';
import businessResponse from './NASAtypes';
import userResponse from './NASAtypes';
import UsersData from '../utils/NASAtypes';
import categoriesData from './NASAtypes';
import checkInMonthData from './NASAtypes';
import attributesData from './NASAtypes';
import FriendTipData from './NASAtypes';

class NASADataService {

    getBusinessByID(id: string) {
        return http.get<businessResponse>(`/business/${id}`)
    }

    getAllBusinesses() {
        return http.get<businessResponse>(`/business`)
    }
    getAllUsers() {
        return http.get<UsersData>(`/Users`)
    }

    getDistance(user_id: string) {
        return http.get<any>(`/api/distance/${user_id}`)
    }
    getBusinessHours(id: string) {
        return http.get<any>(`/hours/${id}`)
    }
    getUserByID(id: string) {
        return http.get<userResponse>(`/Users/by_user/${id}`)
    }
    
    UpdateUserLocation(id: string, lat: string, long: string) {
        return http.put(`Users/${id}/${lat}/${long}`)
    }

    getUsersFriends(id: string) {
        return http.get<userResponse>(`/Friend/by_user/${id}`)
    }

    getLatestTips(id: string) {
        return http.get<FriendTipData>(`/LatestTip/by_user/${id}`)
    }

    getTipsBusinessByID(id: string) {
        return http.get<businessResponse>(`/Tip/by_business/${id}`)
    }
  
    getCategories(){
        return http.get<categoriesData>(`/categories`)
    }

    getCategoriesBusinessID(id: string){
        return http.get<categoriesData>(`/categories/by_business/${id}`)
    }

    getCheckInsBusinessID(id: string) {
        return http.get<checkInMonthData>(`/CheckIns/by_business/${id}`)
    }

    postNewCheckIn(bmonth: string, bday: string, btime: string, business_id: string) {
        return http.post(`/CheckIns/insertcheckin/${business_id}/${bmonth}/${bday}/${btime}`) 
    }

    getAttributes(){
        return http.get<attributesData>(`/attributes`)
    }

    getAttributesBusinessID(id: string){
        return http.get<attributesData>(`/attributes/by_business/${id}`)
    }

    getSort(sort: string) {
        return http.get<businessResponse>(`/business/by_sort/${sort}`)
    }

    getAttributesByAttribute(attribute: string){
        return http.get<attributesData>(`/attributes/${attribute}`)
    }

    // Uses a hard-coded user_id but have to change this later
    postNewTip(user_id: string, business_id: string, text: string){
        return http.post(`/Tip/insert_tip/---1lKK3aKOuomHnwAkAow/${business_id}/${text}`)
    }

    getState(state: string) {
        return http.get<businessResponse>(`/Business/by_state/${state}`)
    }

    getFilteredByCategories(category: string, zipcode:string, city: string, state:string){
        return http.get<businessResponse>(`/Business/by_state/${state}/${city}/${zipcode}/${category}`)
    }

    postLikeTip(user_id: string, business_id: string, text: string) {
        return http.post(`/Tip/updatelikes/${user_id}/${business_id}/${text}`)
    }
}

export default new NASADataService();