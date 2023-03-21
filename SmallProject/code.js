const urlBase = 'http://cop4331-group20.online';
const extension = 'php';

class currentContact
{
	currentFirst;
	currentLast;
	currentEmail;
	currentPhone;
	currentID;
}
var cc = new currentContact;

let UserId = 0;
let FirstName = "";
let LastName = "";
var currentContact = "";


function cacheContact()
{
	let nameParse = jsonObject.results.Name.split(" ");
	cc.currentFirst = nameParse[0];
	cc.currentLast = nameParse[1];
	cc.currentPhone = jsonObject.results.Phone;
	cc.currentEmail = jsonObject.results.Email;
	cc.currentID = jsonObject.results.ID;
	
	editContact();
}

function doLogin()
{
	UserId = 0;
	FirstName = "";
	LastName = "";
	
	let login = document.getElementById("login").value;
	let password = document.getElementById("password").value;

	if (login == "" || password == "") {
		document.getElementById("loginResult").innerHTML = "Please enter a username and password";
		return;
	}
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/LAMPAPI/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				UserId = jsonObject.ID;
				if( UserId < 1 )
				{	
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				FirstName = jsonObject.FirstName;
				LastName = jsonObject.LastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "FirstName=" + FirstName + ",LastName=" + LastName + ",UserId=" + UserId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	UserId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "FirstName" )
		{
			FirstName = tokens[1];
		}
		else if( tokens[0] == "LastName" )
		{
			LastName = tokens[1];
		}
		else if( tokens[0] == "UserId" )
		{
			UserId = parseInt( tokens[1].trim() );
		}
	}
	
	if( UserId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + FirstName + " " + LastName;
	}
}

function doLogout()
{
	UserId = 0;
	FirstName = "";
	LastName = "";
	document.cookie = "FirstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let newContact = document.getElementById("name").value;
	let newPhone = document.getElementById("phone").value;
	let newEmail = document.getElementById("email").value;
	document.getElementById("contactAddResult").innerHTML = "";
	//alert(newContact + " " + newPhone + " " + newEmail + " " + userId);

	let tmp = {Name:newContact,Phone:newPhone,Email:newEmail,UserId:UserId};
	let jsonPayload = JSON.stringify( tmp );

	let url = 'http://cop4331-group20.online/LAMPAPI/AddContact.php';
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

function searchContact()
{
	let srch = document.getElementById("search").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {userId:UserId, search:srch};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/LAMPAPI/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				var oldTable = document.getElementById("contactList");
				oldTable.innerHTML = "";
				document.getElementById("contactSearchResult").innerHTML = "";
				let jsonObject = JSON.parse( xhr.responseText );
				var table = document.getElementById('contactList');
				var th = document.createElement('tr');
				th.innerHTML = 
				'<th class="tableName">Name</th>' +
                '<th class="tableEmail">Email</th>' +
                '<th class="tablePhone">Phone</th>' +
                '<th class="tableControls">Options</th>';
				table.appendChild(th);

				jsonObject.results.forEach(function(object) {
				var tr = document.createElement('tr');
				let buttonVal = object.ID;
				tr.innerHTML = 
				'<td>' + object.Name + '</td>' +
				'<td>' + object.Email + '</td>' +
				'<td>' + object.Phone + '</td>' +
				'<td class="tableControls"><button type="button" data-value = "buttonVal++"  id=editButton onclick="openForm2();">Edit</button><button type="button" id=deleteButton onclick="deleteContact(object.ID);">Delete</button></td>';
				table.appendChild(tr);
				});
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function register()
{
	let FirstName = document.getElementById("firstName").value;
	let LastName = document.getElementById("lastName").value;
	let login = document.getElementById("login").value;
	let password = document.getElementById("password").value;
	let password2 = document.getElementById("password2").value;

	document.getElementById("loginResult").innerHTML = "";

	if(password2 != password) {
		document.getElementById("loginResult").innerHTML = "Passwords must match."
		return;
	}

	let tmp = {FirstName:FirstName,LastName:LastName,Login:login,Password:password};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/LAMPAPI/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				saveCookie();
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function editContact() {

	let newName = document.getElementById("name2").value;
	let newEmail = document.getElementById("email2").value;
	let newPhone = document.getElementById("phone2").value;
	let currID = parseInt(currentContact.id);

	let tmp = {newName:newName, newPhone:newPhone, newEmail:newEmail, UserId:UserId, ID:currID};
	let jsonPayload = JSON.stringify(tmp);
	alert(jsonPayload);
	let url = urlBase + '/LAMPAPI/EditContact.' + extension;
	let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function() 
        {
            if(this.readyState == 4 && this.status == 200) 
            {                    
                document.getElementById("contactEditResult").innerHTML = "";
            }
        };

        xhr.send(jsonPayload);
    }
    catch(err)
    {
        setFormErrorMessage(errInfo, err.message);
    }        

}

function deleteContact(ID) 
{

	let confirmation = confirm("Are you sure you want to delete this contact?");
	if (confirmation) 
	{
		let fullName = cc.currentFirst + " " + cc.currentLast;
		let tmp = {ID:ID, UserId:UserId};
		let jsonPayload = JSON.stringify(tmp);

		let url = urlBase + '/LAMPAPI/DeleteContact.' + extension;

		let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.onreadystatechange = function() 
            {
                if(this.readyState == 4 && this.status == 200) 
                {                    
                   saveCookie();
				   window.location.href = "contacts.html";
                }
            };

            xhr.send(jsonPayload);
        }
        catch(err)
        {
            setFormErrorMessage(errInfo, err.message);
        }    
	 }
}

function openForm() {
	document.getElementById("myForm").style.display = "block";
  }
  
function closeForm() {
	document.getElementById("myForm").style.display = "none";
}

function openForm2() {
	document.getElementById("myForm2").style.display = "block";
	// let contactName = document.getElementsById("listName").name;
	// let contactEmail = document.getElementsById("listEmail").email;
	// let contactPhone = document.getElementsById("listPhone").name;

	document.getElementById("myForm2").style.display = "block";
	let contactName = document.getElementsById("listName").setAttribute('value', object.Name);
	let contactEmail = document.getElementsById("listEmail").setAttribute('value', object.Email);
	let contactPhone = document.getElementsById("listPhone").setAttribute('value', object.Phone);


	alert("works");

	document.getElementById("name").innerHtml = contactName;
  }
  
function closeForm2() {
	document.getElementById("myForm2").style.display = "none";
}

function userIdTest() {
	alert(UserId);
}

function getPlaceholder(key)
{
	if(key == 0)
	{
		return Name;
	}
	else if(key == 1)
	{
		return Phone;
	}
	else if(key == 2)
	{
		return Email;
	}
	else
		setFormErrorMessage(errInfo, err.message);
}