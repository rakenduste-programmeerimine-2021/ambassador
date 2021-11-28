import React from "react";

const SignedInMenu = ({ logout }) => {
	return (
		<li>
			<button onClick={logout}>Logout</button>
		</li>
	);
};

export default SignedInMenu;
