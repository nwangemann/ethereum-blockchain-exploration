import React from "react";

function NavBar(props) {
  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <h1 className="navbar-brand col-sm-3 col-md-2 mr-0">
          Blockchain Exploration Marketplace
        </h1>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white">
              <span id="account">{props.account}</span>
            </small>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
