# project = "IMLS Measuring Up"
# name = "gaApiClickData",
# version = "0.1",
# author = "Patrick OBrien",
# date = "2016-04-03"
# author_email = "patrick@revxcorp.com",
# description = ("Create data file from Google Search Analytics API (part of Search Console API)"),
# license = "LICENSE",
# keywords = "",
# url = "",
"""Example for using the Google Search Analytics API (part of Search Console API).
A basic python command-line example that uses the searchAnalytics.query method
of the Google Search Console API. This example demonstrates how to query Google
search results data for your property. Learn more at
https://developers.google.com/webmaster-tools/
To use:
1) Install the Google Python client library, as shown at https://developers.google.com/webmaster-tools/v3/libraries.
2) Sign up for a new project in the Google APIs console at https://code.google.com/apis/console.
3) Register the project to use OAuth2.0 for installed applications.
4) Copy your client ID, client secret, and redirect URL into the client_secrets.json file included in this package.
5) Run the app in the command-line as shown below.
Sample usage:
  $ python gaApiClickData.py 'https://www.example.com/' '2015-05-01'
"""

import argparse, os, json
from datetime import *
import csv  # added to generate output file
import sys
from googleapiclient import sample_tools
from os import path  #TODO seperate python code and csv output folders
from datetime import date, timedelta

argparser = argparse.ArgumentParser(add_help=False)
argparser.add_argument('org_id', type=str, help=('ID for the organization'))
argparser.add_argument('date_search', type=str, help=('Date for data'))
args = argparser.parse_args()
row_results = []


def main(startDate, endDate, line, argv):
    #print args.org_id
    # TODO determine how to 'argv' and 'parents=[argparser]' for passing function inputs
    service, flags = sample_tools.init(
        argv, 'webmasters', 'v3', __doc__, __file__, parents=[argparser],
        scope='https://www.googleapis.com/auth/webmasters.readonly')

# extract data for 2 of 3 search types.  video search excluded
    searchType = ['image', 'web']

# extract data for single day see https://developers.google.com/webmaster-tools/v3/searchanalytics/query#auth
    response_data = []
    for search in searchType:
        request = {
            'startDate': startDate,
            'endDate': endDate,
            'dimensions': ['date', 'device', 'page'],
            'searchType': search,
            'rowLimit': 5000
        }
        # call execute_request function
        responses = execute_request(service, line, request)
        response_data.append(responses)
        #for response in responses["rows"]:
        #   print response
        #response_data.append(responses)
        
    #json_data = json.dumps(response_data)   
    return response_data
        
def execute_request(service, property_uri, request):
    """Executes a searchAnalytics.query request.
    Args:
      service: The webmasters service to use when executing the query.
      property_uri: The site or app URI to request data for.
      request: The request to be executed.
    Returns:
      An array of response rows.
    """

    return service.searchanalytics().query(
        siteUrl=property_uri, body=request).execute()

if __name__ == '__main__':
    master_json = []
    id  = args.org_id.replace('org_id=', '')
    date_search = args.date_search.replace('date_search=', '')
    os.chdir("/media/3tb/Projects/undercounting/app/organizations/" + id)
    f = open('data.json','r')
    data = json.load(f)
    sites = data["urls"]
    for line in sites:
        #end = (date.today() - timedelta(days=3))
        endDate = date_search
        startDate = date_search
        json_data = main(startDate, endDate, line, sys.argv)
        master_json.append(json_data)
    print json.dumps(master_json)
    