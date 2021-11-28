import React from "react";

const SignedOutMenu = () => {
	return (
		<>
			<li>
				<form action="/login">
					<input type="submit" value="login" />
				</form>
			</li>
			<li>
				<form action="/signup">
					<input type="submit" value="signup" />
				</form>
			</li>
		</>
	);
};

export default SignedOutMenu;
