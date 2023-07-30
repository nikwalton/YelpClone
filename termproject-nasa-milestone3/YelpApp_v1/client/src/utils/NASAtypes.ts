export default interface BusinessData{
    business_id: string;
    name: string;
    city: string;
    address: string;
    state: string;
    zipcode: string;
    latitude: string;
    longitude: string;
    num_checkins: number;
    num_tips: number;
    is_open: boolean;
    stars: string;
}

export default interface UsersData{
    user_id: string;
    name: string;
    latitude: string;
    longitude: string;
    yelping_since: string;
    tip_count:number,
    total_likes: number;
    average_stars: number;
    fans: number;
    cool: number;
    funny: number;
    useful: number;
}

export default interface FriendTipData{
    Bus_name: string;
    User_name: string;
    city: string;
    text: string,
    tip_date: string;
}

export default interface CategoriesData{
    business_id: string;
    category_name: string;
}

export default interface CheckInMonthData{
    checkin_month: string;
    numcheckins: number;
}

export default interface AttributesData{
    business_id: string;
    attribute_name: string;
    attribute_value: string;
}

export default interface hoursData {
    day_of_week: string;
    business_open: string;
    business_close: string;
    business_id: string;
}

export default interface distanceData {
    distance: string;
}
