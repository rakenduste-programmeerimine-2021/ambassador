import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

const MainNavbar = (props) => {
	var user = useContext(AuthContext);

	const highlightNavbarIcon = () => {
		let path = window.location.pathname;
		if (path === "/all" || path === "/contacts" || path === "/create-group" || path === "/add-contact") {
			document.getElementById("link" + window.location.pathname).classList.add("blue-shadow");
		}
	};

	useEffect(() => {
		highlightNavbarIcon();
	});

	return (
		<nav className="row">
			<ul id="link-list" className="remove-list-style navbar-icon-list">
				<li id={"link/all"} className="absolute-center">
					<Link to="/all">
						<p>messages</p>
					</Link>
				</li>
				<li id={"link/contacts"} className="absolute-center">
					<Link to="/contacts">
						<p>contacts</p>
					</Link>
				</li>
				<li id={"link/add-contact"} className="absolute-center">
					<Link to="/add-contact">
						<p>add-contacts</p>
					</Link>
				</li>
			</ul>
		</nav>
	);
};

export default MainNavbar;
