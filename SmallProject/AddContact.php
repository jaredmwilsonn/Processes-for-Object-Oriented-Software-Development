
Skip to content
Pull requests
Issues
Marketplace
Explore
@jaredmwilsonn
scastaneda566 /
cop4331-group20
Public

Code
Issues
Pull requests
Actions
Projects
Wiki
Security

    Insights

cop4331-group20/AddContact.php /
@cmathew2
cmathew2 Add files via upload
Latest commit a6ac49e 5 hours ago
History
1 contributor
41 lines (35 sloc) 933 Bytes
<?php
	$inData = getRequestInfo();
	
	$Name = $inData["Name"];
	$Phone = $inData["Phone"];
	$Email = $inData["Email"];
	$UserId = $inData["UserId"];

	$conn = new mysqli("localhost", "root", "Current-Root-Password", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (Name, Phone, Email, UserId) VALUES(?, ?, ?, ?)");
		$stmt->bind_param("sssi", $Name, $Phone, $Email, $UserId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("Contact Added");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>

    © 2022 GitHub, Inc.

    Terms
    Privacy
    Security
    Status
    Docs
    Contact GitHub
    Pricing
    API
    Training
    Blog
    About

Loading complete