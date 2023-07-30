#CptS 451 - Spring 2022
# https://www.psycopg.org/docs/usage.html#query-parameters

#  if psycopg2 is not installed, install it using pip installer :  pip install psycopg2  (or pip3 install psycopg2) 
import json
import psycopg2

def cleanStr4SQL(s):
    return s.replace("'","`").replace("\n"," ")

def int2BoolStr (value):
    if value == 0:
        return 'False'
    else:
        return 'True'

#Inserts User data into database.
def insertUserData():
    #Read the JSON
    with open('../Data/yelp_user.JSON', 'r') as f:
        # outfile = open('./yelp_user_out.SQL', 'w')
        line = f.readline()
        count_line = 0

        # connect to the db
        try:
            conn = psycopg2.connect("dbname='term_proj' user='postgres' host='localhost' password='1234'")
        except:
            print('Unable to connect to the database!')
        cur = conn.cursor()

        #Reads lines from data file and then inserts it into database.
        while line:
            data = json.loads(line)
            try:
                cur.execute("INSERT INTO Users (user_id, name, latitude, longitude, yelping_since, tip_count, total_likes, average_stars, fans, cool, funny, useful)"
                    + " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (data['user_id'],cleanStr4SQL(data['name']), 0, 0, cleanStr4SQL(data['yelping_since']), 0, 0, data['average_stars'], data['fans'], data['cool'], data['funny'], data['useful']))
            except Exception as e:
                print("Insert into User failed!",e)
            conn.commit()
            
            line = f.readline()
            count_line += 1
        cur.close()
        conn.close()
    print(count_line)
    f.close()

#Inserts data into business table.
def insert2BusinessTable():
    #reading the JSON file
    with open('../Data/yelp_business.JSON','r') as f:    #TODO: update path for the input file
        # outfile =  open('./yelp_business_out.SQL', 'w')  #uncomment this line if you are writing the INSERT statements to an output file.
        line = f.readline()
        count_line = 0

        #connect to yelpdb database on postgres server using psycopg2
        try:
            conn = psycopg2.connect("dbname='term_proj' user='postgres' host='localhost' password='1234'")
        except:
            print('Unable to connect to the database!')
        cur = conn.cursor()

        #Reads lines from data file and then inserts it into database.
        while line:
            data = json.loads(line)
    
            try:
                cur.execute("INSERT INTO Business (business_id, name, address, state, city, zipcode, latitude, longitude, stars, num_checkins, num_tips, is_open)"
                       + " VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
                         (data['business_id'],cleanStr4SQL(data["name"]), cleanStr4SQL(data["address"]), data["state"], data["city"], data["postal_code"], data["latitude"], data["longitude"], data["stars"], 0 , 0 , [False,True][data["is_open"]] ) )              
            except Exception as e:
                print("Insert to Business failed!",e)
            conn.commit()

            line = f.readline()
            count_line +=1

        cur.close()
        conn.close()

    print(count_line)
    #outfile.close()  #uncomment this line if you are writing the INSERT statements to an output file.
    f.close()

#Insert tip data into database.
def insertTipData():
    with open('../Data/yelp_tip.JSON', 'r') as f:
        line = f.readline()
        count_line = 0

        #Connect to database.
        try:
            conn = psycopg2.connect("dbname='term_proj' user='postgres' host='localhost' password='1234'")
        except:
            print('Unable to connect to the database!')
        cur = conn.cursor()

        #Reads lines from data file and then inserts it into database.
        while line:
            data = json.loads(line)
            try:
                cur.execute("INSERT INTO Tip (tip_date, user_id, business_id, text, likes)"
                + " VALUES (%s, %s, %s, %s, %s)",
                (cleanStr4SQL(data["date"]), data['user_id'], data['business_id'], data['text'], data['likes']))
            except Exception as e:
                print ("Insert to Tip failed!", e)
            conn.commit()

            line = f.readline()
            count_line += 1
        cur.close()
        conn.close()
    print(count_line)
    f.close

#Insert checkin data.
def insertCheckinData():
    with open('../Data/yelp_checkin.JSON', 'r') as f:
        line = f.readline()
        count_line = 0

        #Connect to database.
        try:
            conn = psycopg2.connect("dbname='term_proj' user='postgres' host='localhost' password='1234'")
        except:
            print('Unable to connect to the database!')
        cur = conn.cursor()

        #Reads lines from data file and then inserts it into database.
        while line:
            data = json.loads(line)

            #Splits data
            checkinList = data['date'].split(',')
            business_id = cleanStr4SQL(data['business_id'])

            #Goes through each date for a given business id and inserts it into database.
            for specificDate in checkinList:
                checkinData = splitDate(specificDate)

                try:
                    cur.execute("INSERT INTO CheckIns (business_id, checkin_year, checkin_month, checkin_day, checkin_time)"
                    + " VALUES (%s, %s, %s, %s, %s)",
                    (business_id, checkinData[0], checkinData[1], checkinData[2], checkinData[3]))
                except Exception as e:
                    print ("Insert to Checkin failed!", e)
                conn.commit()

            line = f.readline()
            count_line += 1
        cur.close()
        conn.close()
    print(count_line)
    f.close
    

#Splits the date.
def splitDate(date):
    date = date.replace('-', ' ')
    return date.split()

#Insert attribute data.
def insertAttributeData():
    with open('../Data/yelp_business.JSON', 'r') as f:
        line = f.readline()
        count_line = 0

        #Connect to database.
        try:
            conn = psycopg2.connect("dbname='term_proj' user='postgres' host='localhost' password='1234'")
        except:
            print('Unable to connect to the database!')
        cur = conn.cursor()

        #Reads lines from data file and then inserts it into database.
        while line:
            data = json.loads(line)

            #Splits the data.
            out = []
            recursiveGetData(data['attributes'], out)
            businessId = data['business_id']
            
            #Goes through each attribute for a given business id and inserts to database.
            for att in out:
                try:
                    cur.execute("INSERT INTO Attributes (business_id, attribute_name, attribute_value)"
                    + " VALUES (%s, %s, %s)",
                    (cleanStr4SQL(businessId), cleanStr4SQL(att[0]), cleanStr4SQL(att[1])))
                except Exception as e:
                    print ("Insert to Attributes failed!", e)
                conn.commit()
                
            line = f.readline()
            count_line += 1
        cur.close()
        conn.close()
    print(count_line)
    f.close

#Recursively gets data in nested dictionaries.
def recursiveGetData(data, out):
    for info in data:
        if type(data[info]) == dict:
            recursiveGetData(data[info], out)
        else:
            out.append((info, data[info]))

# Friends
def insertFriendData():
    with open('../Data/yelp_user.JSON', 'r') as f:
        line = f.readline()
        count_line = 0

        # connect to the db
        try:
            conn = psycopg2.connect("dbname='term_proj' user='postgres' host='localhost' password='1234'")
        except:
            print('Unable to connect to the database!')
        cur = conn.cursor()

        while line:
            data = json.loads(line)
            
            userID = data['user_id']
            friendData = data['friends']

            for friendID in friendData:
                try:
                    cur.execute("INSERT INTO Friend (user_id, friend_id)"
                        + " VALUES (%s, %s)",
                        (userID, friendID))
                except Exception as e:
                    print("Insert into Friend failed!",e)
                conn.commit()
                count_line += 1
            line = f.readline()
        cur.close()
        conn.close()
    print(count_line)
    f.close()

# Hours
def insertHoursData():
    with open('../Data/yelp_business.JSON', 'r') as f:
        line = f.readline()
        count_line = 0

        # connect to the db
        try:
            conn = psycopg2.connect("dbname='term_proj' user='postgres' host='localhost' password='1234'")
        except:
            print('Unable to connect to the database!')
        cur = conn.cursor()

        while line:
            data = json.loads(line)
            
            businessID = data['business_id']
            hours = data['hours']
            hoursList = []
            for day, times in hours.items():
                timeList = times.split("-")
                hoursList.append((day, timeList[0], timeList[1]))

            for hoursEntry in hoursList:
                try:
                    cur.execute("INSERT INTO Hours (day_of_week, business_open, business_close, business_id)"
                        + " VALUES (%s, %s, %s, %s)",
                        (cleanStr4SQL(hoursEntry[0]), cleanStr4SQL(hoursEntry[1]), cleanStr4SQL(hoursEntry[2]), businessID))
                except Exception as e:
                    print("Insert into Hours failed!",e)
                conn.commit()
                count_line += 1
            line = f.readline()
        cur.close()
        conn.close()
    print(count_line)
    f.close()

# Categories
def insertCategoriesData():
    with open('../Data/yelp_business.JSON', 'r') as f:
        line = f.readline()
        count_line = 0

        # connect to the db
        try:
            conn = psycopg2.connect("dbname='term_proj' user='postgres' host='localhost' password='1234'")
        except:
            print('Unable to connect to the database!')
        cur = conn.cursor()

        while line:
            data = json.loads(line)
            
            businessID = data['business_id']
            categories = data['categories'].split(', ')

            for category in categories:
                try:
                    cur.execute("INSERT INTO Categories (category_name, business_id)"
                        + " VALUES (%s, %s)",
                        (cleanStr4SQL(category), businessID))
                except Exception as e:
                    print("Insert into Categories failed!",e)
                conn.commit()
                count_line += 1
            line = f.readline()
        cur.close()
        conn.close()
    print(count_line)
    f.close()



insert2BusinessTable()
insertUserData()
insertCheckinData()
insertTipData()
insertHoursData()
insertCategoriesData()
insertAttributeData()
insertFriendData()