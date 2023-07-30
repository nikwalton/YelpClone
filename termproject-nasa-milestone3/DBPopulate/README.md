# DBPopulate

## Notes

We are using the psycopg2 approach to generating the insert statements for the database.
To run the scripts, Ensure that you have your data located local within this repository
in a file called Data. (Ex ./termproject-nasa/Data/). This folder is included in the git
ignore, so it must be set up in order to run the script

Also make sure that the database name, and password are correct. You should NOT commit your personal password to this repository.

## Running the script

After installing psycopg locally or in your python virtual environment, run ```python3 NASA_ParseAndInsert.py```