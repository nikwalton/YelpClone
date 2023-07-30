import json

def cleanStr4SQL(s):
    return s.replace("'","`").replace("\n"," ")

def parseBusinessData():
    # read the JSON file
    # we assume that the Yelp data files are available in the current directory. If not, you should specify the path when you "open" the function. 
    with open('.//yelp_business.JSON','r') as f:  
        outfile =  open('.//business.txt', 'w')
        line = f.readline()
        count_line = 0
        # read each JSON abject and extract data
        while line:
            data = json.loads(line)
            outfile.write("{} - business info : '{}' ; '{}' ; '{}' ; '{}' ; '{}' ; '{}' ; {} ; {} ; {} ; {}\n".format(
                              str(count_line), # the line count
                              cleanStr4SQL(data['business_id']),
                              cleanStr4SQL(data["name"]),
                              cleanStr4SQL(data["address"]),
                              cleanStr4SQL(data["state"]),
                              cleanStr4SQL(data["city"]),
                              cleanStr4SQL(data["postal_code"]),
                              str(data["latitude"]),
                              str(data["longitude"]),
                              str(data["stars"]),
                              str(data["is_open"])) )

            # process business categories
            categories = data["categories"].split(', ')
            outfile.write("      categories: {}\n".format(str(categories)))

            # TO-DO : write your own code to process attributes
            # make sure to **recursively** parse all attributes at all nesting levels. You should not assume a particular nesting level. 
            outfile.write("") 
            attribute_list = flatten_attributes(data["attributes"])
            outfile.write("      attributes: ")
            outfile.write(str(attribute_list))
            outfile.write('\n')

            # TO-DO : write your own code to process hours data
            outfile.write("") 
            outfile.write("      hours: ")
            hours = data["hours"]
            hoursList = []
            # Traverses through each day of the week, if there are any and splits the data.
            for day, times in hours.items():
                timeList = times.split("-")
                hoursList.append((day, timeList))
            outfile.write(str(hoursList)) 
            outfile.write('\n')

            line = f.readline()
            count_line +=1
    print(count_line)
    outfile.close()
    f.close()

# flatten the dict into a single dict
# we can use pythons dict to array for printing to the file
def flatten_attributes(attribute_dict):
    output = {}

    def flatten_attribute(json_obj, attrib =''):
        if type(json_obj) is dict:
            for attribute in json_obj:
                flatten_attribute(json_obj[attribute], attrib + attribute)
        elif type(json_obj) is list:
            for attribute in json_obj:
                flatten_attribute(attribute, attrib)
        else:
            output[attrib] = json_obj
    flatten_attribute(attribute_dict)

    # output is a dictionary, want a list
    data = list(output.items())
    return(data)
    
# just re-use the given above method
def parseUserData():
    with open('.//yelp_user.JSON','r') as f:  
        outfile =  open('.//user.txt', 'w')
        line = f.readline()
        count_line = 0
        # read each JSON abject and extract data
        while line:
            data = json.loads(line)
            outfile.write("{} - user info: '{}' ; '{}' ; '{}' ; {} ; {} ; {} ; {}\n".format(
                              str(count_line), # the line count
                              cleanStr4SQL(data['user_id']),
                              cleanStr4SQL(data['name']),
                              cleanStr4SQL(data['yelping_since']),
                              str(data['tipcount']),
                              str(data['fans']),
                              str(data['average_stars']),
                              str ((data['funny'], data['useful'], data['cool'])) ))

            # process friends list 
            outfile.write("      friends: ")
            outfile.write(str(data['friends']))
            outfile.write('\n')

            line = f.readline()
            count_line +=1
    print(count_line)
    outfile.close()
    f.close()

def parseCheckinData():
    # read the JSON file
    # we assume that the Yelp data files are available in the current directory. If not, you should specify the path when you "open" the function. 
    with open('.//yelp_checkin.JSON','r') as f:  
        outfile =  open('.//checkin.txt', 'w')
        line = f.readline()
        count_line = 0
        # read each JSON abject and extract data
        while line:
            data = json.loads(line)
            # outputs business ID
            outfile.write(str(count_line + 1) + "- '" )
            businessID = data["business_id"]
            outfile.write(str(businessID) + "':\n")

            # outputs check in dates
            dates = data["date"]
            times = dates.split(",")
            for time in times:
                curTime = time.split(" ")
                specificTime = curTime[1]
                date = curTime[0].split("-")
                outfile.write(str((date[0], date[1], date[2], specificTime)))
                outfile.write("  ")

            outfile.write('\n')

            line = f.readline()
            count_line +=1
    print(count_line)
    outfile.close()
    f.close()


def parseTipData():
     with open(".//yelp_tip.JSON", 'r') as file:
        outfile = open(".//tip.txt", "w")
        line = file.readline()
        count_line = 1
        while line:
            data = json.loads(line)
            outfile.write("{} - : '{}' ; '{}' ; {} ; '{}' ; '{}'\n".format(
                str(count_line),
                cleanStr4SQL(data['business_id']),
                cleanStr4SQL(data['date']),
                str(data['likes']),
                cleanStr4SQL(data['text']),
                cleanStr4SQL(data['user_id'])
            ) )
            outfile.write("")
            outfile.write("")

            line = file.readline()
            count_line += 1
        outfile.close()
        print(count_line)
        file.close()

if __name__ == "__main__":
    parseBusinessData()
    parseUserData()
    parseCheckinData()
    parseTipData()