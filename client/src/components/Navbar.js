import React from "react";
import { Button } from "react-bootstrap";

function Navbar() {
	function logout() {
		sessionStorage.clear();
	}

	return <Button onClick={logout()}>Logout</Button>;
}

export default Navbar;
