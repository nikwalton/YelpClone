CREATE TABLE Users (
    user_id CHAR(22) PRIMARY KEY,
    name VARCHAR,
     -- these data types give us more accurate location placement
    latitude DECIMAL(8, 6),
    longitude DECIMAL(9,6),
    yelping_since TIMESTAMP WITHOUT TIME ZONE,
    tip_count INTEGER,
    total_likes INTEGER,
    --the average for users is given at most as x.xx 
    average_stars DECIMAL (3,2),
    fans INTEGER,
    cool INTEGER,
    funny INTEGER,
    useful INTEGER
);

CREATE TABLE Friend (
    user_id CHAR(22),
    friend_id CHAR(22),
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (friend_id) REFERENCES Users(user_id)
);

CREATE TABLE Business (
    business_id CHAR(22) PRIMARY KEY,
    name VARCHAR,
    address VARCHAR,
    city VARCHAR,
    state CHAR(2),
    zipcode CHAR(5),
    latitude DECIMAL(8,6),
    longitude DECIMAL(9,6),
    num_checkins INTEGER,
    num_tips INTEGER,
    is_open BOOLEAN,
    -- at max can be x.x, using float uses more space than we need
    stars DECIMAL (2, 1)
);

CREATE TABLE Tip (
    tip_date TIMESTAMP WITHOUT TIME ZONE,
    user_id CHAR(22),
    business_id CHAR(22),
    text VARCHAR,
    likes INTEGER CHECK (likes >= 0),
    PRIMARY KEY(tip_date, user_id, business_id),
    FOREIGN KEY (user_id )REFERENCES Users(user_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE Categories (
    category_name VARCHAR,
    business_id CHAR(22),
    PRIMARY KEY (category_name, business_id),
    FOREIGN KEY (business_id)  REFERENCES Business(business_id)
);

CREATE TABLE Attributes (
    attribute_name VARCHAR,
    attribute_value VARCHAR,
    business_id CHAR(22),
    PRIMARY KEY(attribute_name, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE Hours (
    day_of_week CHAR(10),
    -- if the business has hours, its in a 24 hour clock format 00:00
    business_open CHAR(5),
    business_close CHAR (5),
    business_id CHAR (22),
    PRIMARY KEY(day_of_week, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);

CREATE TABLE CheckIns (
    checkin_year CHAR(4),
    checkin_month CHAR(2),
    checkin_day CHAR(2),
    -- 24 hour clock to the seconds 00:00:00
    checkin_time CHAR(8),
    business_id CHAR(22),
    PRIMARY KEY(checkin_year, checkin_month, checkin_day, checkin_time, business_id),
    FOREIGN KEY (business_id) REFERENCES Business(business_id)
);