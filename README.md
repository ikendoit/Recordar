# Recordar

*** PRESENTATION COMING SOON ***

When note taking and source control get combined.

Graphql server with postgresql, nodejs, reactJS and Express 

Along with a homebrew diff algorithm

This is the back-end for Recordar. Please Check for ReactJS version and React-Native for a full package.

## GUIDE

	1.	ask @ikendoit for the file .env, place it in root directory of the project

	2.	`docker-compose build`

	3.	`docker-compose up`

	4.	check you localhost:8089

## Documentation 

### /api/user : 

#### /api/user/login (POST)

@body: { username: string, password: string } 

@return: { token: JWTtoken, flag: true }  (200)

@errors: 

	- 400: Invalid Account

	- 400: Invalid Data 

#### /api/user/register (POST)

@body: { username: string, password: string, email: string} 

@return: { token: JWTtoken, flag: true }  (200)

@errors: 

	- 400: Invalid Data 

	- 400: Existing Account


### /api/notes :

#### /api/notes (POST)

note: graphql api, you can change query field to get the desired response data

##### query all notes: 

@body: {

	query: "query ( $ID: String! ) {\
		
		note(id:$ID){ <query_fields>  }  \

	} " (string) 

	variables: { ID: int - userID} 

}

@return: { [<note_data>] }

with: 

<query_fields> "cat_id, cat_name, data {type date content hash }"

<note_data> {
	cat_id : int 
	cat_name: string 
	data: {}
		type
		date
		content
		hash
}

##### query type: 

@body: {

	query: "query ($Notes: [Note_type]!, $ID: String! ) {\
		
		notes_type(notes:$Notes, id:$ID){ <query_fields> }  \

	} " (string) 

	variables: { Notes : [<objectNotes_type>] , ID: int-userID} 

}

@return: { notes_type : [<note_types>] }

with: 

<objectNotes_type> : {
	cat_name 
	cat_id 
	data: [] 
		type: string
}

<query_fields> "cat_id, cat_name, data {type date content hash } " : string

<objectNotes_type> {
	cat_id : int 
	cat_name: string 
	data: {}
		type
		date
		content
		hash
}

##### Mutation: change query: 

@body: {

	query: "mutation ($Notes: [Note_Input]!, $Flag: String!, $ID: String!) {\
		
		all_notes_input(notes: $Notes, user_id:$ID, flag: $Flag) {hash}  \
   

	} " (string) 

	variables: {}
		Notes : [<objectNotes_type>] 
		ID: int-userID
		Flag: boolean - should this override server ?
}

@return: { notes_type : [<note_types>] }

with: 

<objectNotes_type> : {
	cat_name 
	cat_id 
	data: [] 
		type: string
}

<query_fields> "cat_id, cat_name, data {type date content hash } " : string

<objectNotes_type> {
	cat_id : int 
	cat_name: string 
	data: {}
	type
		date
		content
		hash
}

