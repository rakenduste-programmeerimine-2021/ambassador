import React, { useContext } from "react";
import { UserContext } from "../../UserContext";
import SignedInMenu from "./SignedInMenu";
import SignedOutMenu from "./SignedOutMenu";
const Navbar = () => {
	const { user, setUser } = useContext(UserContext);

	const logout = async () => {
		try {
			const res = await fetch("http://localhost:5000/logout", {
				credentials: "include",
			});
			const data = res.json();
			console.log("logout data", data);
			setUser(null);
		} catch (error) {
			console.log(error);
		}
	};
	const menu = user ? <SignedInMenu logout={logout} /> : <SignedOutMenu />;
	return (
		<>
			<nav className="black">
				<div className="nav-wrapper">
					<ul className="left">
						<a href="/" className="brand-logo">
							Ambassador
						</a>
					</ul>

					<ul id="nav" className="right hide-on-med-and-down">
						{menu}
					</ul>
				</div>
			</nav>
		</>
	);
};

export default Navbar;
